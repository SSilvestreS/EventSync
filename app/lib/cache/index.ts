import { getConfig, isProduction } from '../../config';
import { createModuleLogger } from '../logger';
import { performanceUtils } from '../../utils';

// Logger específico para cache
const cacheLogger = createModuleLogger('Cache');

// Interfaces para o sistema de cache
export interface CacheItem<T = any> {
  key: string;
  value: T;
  expiresAt: number;
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  compress?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  maxSize?: number;
  metadata?: Record<string, any>;
}

export interface CacheStats {
  totalItems: number;
  totalSize: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  evictionCount: number;
  compressionRatio: number;
}

export interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  size(): Promise<number>;
  stats(): Promise<CacheStats>;
}

// Estratégias de cache
export enum CacheStrategy {
  CACHE_FIRST = 'cache-first',
  NETWORK_FIRST = 'network-first',
  STALE_WHILE_REVALIDATE = 'stale-while-revalidate',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only',
}

// Classe principal de cache
export class CacheManager implements CacheProvider {
  private cache: Map<string, CacheItem> = new Map();
  private stats: CacheStats = {
    totalItems: 0,
    totalSize: 0,
    hitCount: 0,
    missCount: 0,
    hitRate: 0,
    evictionCount: 0,
    compressionRatio: 1,
  };
  
  private config = getConfig('cache');
  private maxMemorySize: number;
  private cleanupInterval: NodeJS.Timeout;
  private compressionEnabled: boolean;

  constructor() {
    this.maxMemorySize = this.config.provider === 'memory' ? 100 * 1024 * 1024 : 0; // 100MB
    this.compressionEnabled = this.config.provider === 'memory';
    
    // Inicia limpeza automática
    this.startCleanup();
    
    cacheLogger.info('Cache Manager inicializado', {
      provider: this.config.provider,
      maxMemorySize: this.formatBytes(this.maxMemorySize),
      compressionEnabled: this.compressionEnabled,
    });
  }

  // Obtém um item do cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        this.stats.missCount++;
        this.updateHitRate();
        return null;
      }

      // Verifica se expirou
      if (Date.now() > item.expiresAt) {
        await this.delete(key);
        this.stats.missCount++;
        this.updateHitRate();
        return null;
      }

      // Atualiza estatísticas de acesso
      item.accessCount++;
      item.lastAccessed = Date.now();
      
      this.stats.hitCount++;
      this.updateHitRate();
      
      cacheLogger.debug('Cache hit', { key, accessCount: item.accessCount });
      
      return item.value as T;
    } catch (error) {
      cacheLogger.error('Erro ao obter item do cache', { key, error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  }

  // Define um item no cache
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    try {
      const ttl = options.ttl || this.config.ttl.medium;
      const expiresAt = Date.now() + ttl;
      const createdAt = Date.now();
      
      // Calcula tamanho do item
      const serializedValue = JSON.stringify(value);
      let size = new Blob([serializedValue]).size;
      
      // Compressão se habilitada
      let finalValue = value;
      if (options.compress !== false && this.compressionEnabled && size > 1024) {
        try {
          finalValue = await this.compress(value);
          const compressedSize = new Blob([JSON.stringify(finalValue)]).size;
          const ratio = compressedSize / size;
          this.stats.compressionRatio = (this.stats.compressionRatio + ratio) / 2;
          size = compressedSize;
        } catch (error) {
          cacheLogger.warn('Falha na compressão, usando valor original', { key, error: error instanceof Error ? error.message : String(error) });
        }
      }

      const item: CacheItem<T> = {
        key,
        value: finalValue,
        expiresAt,
        createdAt,
        accessCount: 0,
        lastAccessed: createdAt,
        size,
        tags: options.tags || [],
        metadata: options.metadata,
      };

      // Verifica se há espaço suficiente
      await this.ensureSpace(size);

      // Remove item existente se houver
      const existingItem = this.cache.get(key);
      if (existingItem) {
        this.stats.totalSize -= existingItem.size;
        this.stats.totalItems--;
      }

      // Adiciona novo item
      this.cache.set(key, item);
      this.stats.totalSize += size;
      this.stats.totalItems++;

      cacheLogger.debug('Item adicionado ao cache', {
        key,
        size: this.formatBytes(size),
        ttl: this.formatDuration(ttl),
        tags: item.tags,
      });

    } catch (error) {
      cacheLogger.error('Erro ao definir item no cache', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Remove um item do cache
  async delete(key: string): Promise<void> {
    try {
      const item = this.cache.get(key);
      if (item) {
        this.stats.totalSize -= item.size;
        this.stats.totalItems--;
        this.cache.delete(key);
        
        cacheLogger.debug('Item removido do cache', { key });
      }
    } catch (error) {
      cacheLogger.error('Erro ao remover item do cache', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Remove múltiplos itens por tag
  async deleteByTag(tag: string): Promise<void> {
    try {
      const keysToDelete: string[] = [];
      
      for (const [key, item] of this.cache.entries()) {
        if (item.tags.includes(tag)) {
          keysToDelete.push(key);
        }
      }

      for (const key of keysToDelete) {
        await this.delete(key);
      }

      cacheLogger.info('Itens removidos por tag', { tag, count: keysToDelete.length });
    } catch (error) {
      cacheLogger.error('Erro ao remover itens por tag', {
        tag,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Limpa todo o cache
  async clear(): Promise<void> {
    try {
      this.cache.clear();
      this.stats.totalItems = 0;
      this.stats.totalSize = 0;
      
      cacheLogger.info('Cache limpo completamente');
    } catch (error) {
      cacheLogger.error('Erro ao limpar cache', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Verifica se um item existe
  async has(key: string): Promise<boolean> {
    try {
      const item = this.cache.get(key);
      if (!item) return false;
      
      // Verifica se expirou
      if (Date.now() > item.expiresAt) {
        await this.delete(key);
        return false;
      }
      
      return true;
    } catch (error) {
      cacheLogger.error('Erro ao verificar existência do item', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  // Obtém todas as chaves
  async keys(): Promise<string[]> {
    try {
      return Array.from(this.cache.keys());
    } catch (error) {
      cacheLogger.error('Erro ao obter chaves do cache', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  // Obtém tamanho total do cache
  async size(): Promise<number> {
    return this.stats.totalSize;
  }

  // Obtém estatísticas do cache
  async stats(): Promise<CacheStats> {
    return { ...this.stats };
  }

  // Estratégia de cache inteligente
  async withStrategy<T>(
    key: string,
    strategy: CacheStrategy,
    fetchFunction: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      switch (strategy) {
        case CacheStrategy.CACHE_FIRST:
          return await this.cacheFirst(key, fetchFunction, options);
        
        case CacheStrategy.NETWORK_FIRST:
          return await this.networkFirst(key, fetchFunction, options);
        
        case CacheStrategy.STALE_WHILE_REVALIDATE:
          return await this.staleWhileRevalidate(key, fetchFunction, options);
        
        case CacheStrategy.NETWORK_ONLY:
          return await this.networkOnly(fetchFunction, options);
        
        case CacheStrategy.CACHE_ONLY:
          return await this.cacheOnly(key);
        
        default:
          return await this.cacheFirst(key, fetchFunction, options);
      }
    } finally {
      const duration = performance.now() - startTime;
      cacheLogger.debug('Estratégia de cache executada', {
        key,
        strategy,
        duration: `${duration.toFixed(2)}ms`,
      });
    }
  }

  // Estratégia: Cache primeiro
  private async cacheFirst<T>(key: string, fetchFunction: () => Promise<T>, options: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetchFunction();
    await this.set(key, value, options);
    return value;
  }

  // Estratégia: Rede primeiro
  private async networkFirst<T>(key: string, fetchFunction: () => Promise<T>, options: CacheOptions): Promise<T> {
    try {
      const value = await fetchFunction();
      await this.set(key, value, options);
      return value;
    } catch (error) {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        cacheLogger.warn('Falha na rede, usando cache', { key, error: error instanceof Error ? error.message : String(error) });
        return cached;
      }
      throw error;
    }
  }

  // Estratégia: Stale while revalidate
  private async staleWhileRevalidate<T>(key: string, fetchFunction: () => Promise<T>, options: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key);
    
    // Retorna cache imediatamente se disponível
    if (cached !== null) {
      // Atualiza em background
      fetchFunction().then(async (value) => {
        await this.set(key, value, options);
      }).catch((error) => {
        cacheLogger.warn('Falha na revalidação em background', { key, error: error instanceof Error ? error.message : String(error) });
      });
      
      return cached;
    }

    // Se não há cache, busca da rede
    const value = await fetchFunction();
    await this.set(key, value, options);
    return value;
  }

  // Estratégia: Apenas rede
  private async networkOnly<T>(fetchFunction: () => Promise<T>, options: CacheOptions): Promise<T> {
    return await fetchFunction();
  }

  // Estratégia: Apenas cache
  private async cacheOnly<T>(key: string): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached === null) {
      throw new Error(`Item não encontrado no cache: ${key}`);
    }
    return cached;
  }

  // Garante espaço suficiente no cache
  private async ensureSpace(requiredSize: number): Promise<void> {
    if (this.maxMemorySize === 0) return; // Sem limite de memória
    
    while (this.stats.totalSize + requiredSize > this.maxMemorySize) {
      const evicted = this.evictItem();
      if (!evicted) break; // Não foi possível evictar mais itens
    }
  }

  // Remove item menos importante
  private evictItem(): boolean {
    let leastImportant: { key: string; score: number } | null = null;
    
    for (const [key, item] of this.cache.entries()) {
      const score = this.calculateImportanceScore(item);
      
      if (leastImportant === null || score < leastImportant.score) {
        leastImportant = { key, score };
      }
    }
    
    if (leastImportant) {
      this.delete(leastImportant.key);
      this.stats.evictionCount++;
      return true;
    }
    
    return false;
  }

  // Calcula score de importância do item
  private calculateImportanceScore(item: CacheItem): number {
    const now = Date.now();
    const age = now - item.createdAt;
    const timeSinceLastAccess = now - item.lastAccessed;
    
    // Score baseado em:
    // - Frequência de acesso (mais alto = mais importante)
    // - Idade (mais novo = mais importante)
    // - Tamanho (menor = mais importante)
    // - Prioridade (se definida)
    
    let score = 0;
    score += item.accessCount * 10; // Acesso frequente
    score += Math.max(0, 1000 - age / 1000); // Mais novo
    score += Math.max(0, 1000 - item.size / 1000); // Menor tamanho
    score += Math.max(0, 1000 - timeSinceLastAccess / 1000); // Acesso recente
    
    return score;
  }

  // Compressão de dados
  private async compress<T>(data: T): Promise<T> {
    try {
      // Implementação simples de compressão
      // Em produção, usar bibliotecas como lz-string ou pako
      const serialized = JSON.stringify(data);
      
      // Remove espaços e quebras de linha desnecessárias
      const compressed = serialized
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}[\],:])\s*/g, '$1')
        .trim();
      
      return JSON.parse(compressed);
    } catch (error) {
      cacheLogger.warn('Falha na compressão', { error: error instanceof Error ? error.message : String(error) });
      return data;
    }
  }

  // Atualiza taxa de hit
  private updateHitRate(): void {
    const total = this.stats.hitCount + this.stats.missCount;
    this.stats.hitRate = total > 0 ? (this.stats.hitCount / total) * 100 : 0;
  }

  // Inicia limpeza automática
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // A cada minuto
  }

  // Limpeza automática de itens expirados
  private cleanup(): void {
    try {
      const now = Date.now();
      const keysToDelete: string[] = [];
      
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiresAt) {
          keysToDelete.push(key);
        }
      }
      
      for (const key of keysToDelete) {
        this.delete(key);
      }
      
      if (keysToDelete.length > 0) {
        cacheLogger.debug('Limpeza automática executada', { removedCount: keysToDelete.length });
      }
    } catch (error) {
      cacheLogger.error('Erro na limpeza automática', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Para limpeza automática
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  // Utilitários de formatação
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  }
}

// Instância global do cache
export const cacheManager = new CacheManager();

// Funções de conveniência
export const cache = {
  // Operações básicas
  get: <T>(key: string): Promise<T | null> => cacheManager.get<T>(key),
  set: <T>(key: string, value: T, options?: CacheOptions): Promise<void> => cacheManager.set(key, value, options),
  delete: (key: string): Promise<void> => cacheManager.delete(key),
  clear: (): Promise<void> => cacheManager.clear(),
  has: (key: string): Promise<boolean> => cacheManager.has(key),
  
  // Estratégias
  withStrategy: <T>(
    key: string,
    strategy: CacheStrategy,
    fetchFunction: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> => cacheManager.withStrategy(key, strategy, fetchFunction, options),
  
  // Operações por tag
  deleteByTag: (tag: string): Promise<void> => cacheManager.deleteByTag(tag),
  
  // Estatísticas
  stats: (): Promise<CacheStats> => cacheManager.stats(),
  size: (): Promise<number> => cacheManager.size(),
  keys: (): Promise<string[]> => cacheManager.keys(),
};

// Função para inicializar cache
export function initializeCache(): void {
  try {
    cacheLogger.info('Sistema de cache inicializado', {
      provider: getConfig('cache').provider,
      ttl: {
        short: getConfig('cache').ttl.short,
        medium: getConfig('cache').ttl.medium,
        long: getConfig('cache').ttl.long,
        day: getConfig('cache').ttl.day,
      },
    });
  } catch (error) {
    cacheLogger.error('Erro ao inicializar cache', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Exporta o cache padrão
export default cache;
