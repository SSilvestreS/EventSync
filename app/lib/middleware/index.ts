import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '../../config';
import { log, createModuleLogger } from '../logger';
import { z } from 'zod';

// Logger específico para middleware
const middlewareLogger = createModuleLogger('Middleware');

// Interface para middleware
export interface MiddlewareFunction {
  (req: NextRequest, res?: NextResponse): Promise<NextResponse | void> | NextResponse | void;
  priority?: number;
  name?: string;
}

// Interface para configuração de middleware
export interface MiddlewareConfig {
  enabled: boolean;
  options?: Record<string, any>;
}

// Classe principal de middleware
export class MiddlewareManager {
  private middlewares: Map<string, MiddlewareFunction> = new Map();
  private config: Record<string, MiddlewareConfig> = {};

  constructor() {
    this.initializeDefaultMiddlewares();
  }

  // Registra um middleware
  register(name: string, middleware: MiddlewareFunction, config: MiddlewareConfig = { enabled: true }): void {
    this.middlewares.set(name, middleware);
    this.config[name] = config;
    middlewareLogger.info(`Middleware registrado: ${name}`, { enabled: config.enabled });
  }

  // Executa todos os middlewares registrados
  async execute(req: NextRequest): Promise<NextResponse | null> {
    const startTime = Date.now();
    
    try {
      // Filtra middlewares habilitados e ordena por prioridade
      const enabledMiddlewares = Array.from(this.middlewares.entries())
        .filter(([name]) => this.config[name]?.enabled)
        .sort(([, a], [, b]) => (b.priority || 0) - (a.priority || 0));

      middlewareLogger.debug(`Executando ${enabledMiddlewares.length} middlewares`, {
        middlewares: enabledMiddlewares.map(([name]) => name),
        url: req.url,
        method: req.method,
      });

      // Executa cada middleware
      for (const [name, middleware] of enabledMiddlewares) {
        const middlewareStart = Date.now();
        
        try {
          const result = await middleware(req);
          
          // Se o middleware retornou uma resposta, para a execução
          if (result instanceof NextResponse) {
            const duration = Date.now() - middlewareStart;
            middlewareLogger.debug(`Middleware ${name} retornou resposta`, {
              name,
              duration: `${duration}ms`,
              status: result.status,
            });
            return result;
          }
          
          const duration = Date.now() - middlewareStart;
          middlewareLogger.debug(`Middleware ${name} executado`, {
            name,
            duration: `${duration}ms`,
          });
        } catch (error) {
          middlewareLogger.error(`Erro no middleware ${name}`, {
            name,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          
          // Em caso de erro, retorna erro 500
          return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
          );
        }
      }

      const totalDuration = Date.now() - startTime;
      middlewareLogger.debug('Todos os middlewares executados com sucesso', {
        totalDuration: `${totalDuration}ms`,
        url: req.url,
        method: req.method,
      });

      return null; // Continua para o próximo handler
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      middlewareLogger.error('Erro na execução dos middlewares', {
        totalDuration: `${totalDuration}ms`,
        error: error instanceof Error ? error.message : String(error),
        url: req.url,
        method: req.method,
      });
      
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  // Inicializa middlewares padrão
  private initializeDefaultMiddlewares(): void {
    // Middleware de logging (prioridade alta)
    this.register('logging', this.createLoggingMiddleware(), { enabled: true });

    // Middleware de CORS (prioridade alta)
    this.register('cors', this.createCorsMiddleware(), { enabled: true });

    // Middleware de rate limiting (prioridade alta)
    this.register('rateLimit', this.createRateLimitMiddleware(), { enabled: true });

    // Middleware de segurança (prioridade alta)
    this.register('security', this.createSecurityMiddleware(), { enabled: true });

    // Middleware de validação (prioridade média)
    this.register('validation', this.createValidationMiddleware(), { enabled: true });

    // Middleware de autenticação (prioridade média)
    this.register('authentication', this.createAuthenticationMiddleware(), { enabled: true });

    // Middleware de autorização (prioridade média)
    this.register('authorization', this.createAuthorizationMiddleware(), { enabled: true });

    // Middleware de cache (prioridade baixa)
    this.register('cache', this.createCacheMiddleware(), { enabled: true });

    // Middleware de compressão (prioridade baixa)
    this.register('compression', this.createCompressionMiddleware(), { enabled: true });
  }

  // Middleware de logging
  private createLoggingMiddleware(): MiddlewareFunction {
    return (req: NextRequest) => {
      const startTime = Date.now();
      
      req.headers.set('x-request-start', startTime.toString());
      
      // Log da requisição
      middlewareLogger.info('Requisição recebida', {
        method: req.method,
        url: req.url,
        userAgent: req.headers.get('user-agent'),
        ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString(),
      });
    };
  }

  // Middleware de CORS
  private createCorsMiddleware(): MiddlewareFunction {
    const config = getConfig('security.cors');
    
    return (req: NextRequest) => {
      if (!config.enabled) return;

      const origin = req.headers.get('origin');
      const allowedOrigins = Array.isArray(config.origin) ? config.origin : [config.origin];

      // Verifica se a origem é permitida
      if (origin && allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        // CORS headers serão adicionados pela resposta
        req.headers.set('x-cors-allowed', 'true');
      } else {
        middlewareLogger.warn('Origem CORS não permitida', {
          origin,
          allowedOrigins,
          url: req.url,
        });
      }
    };
  }

  // Middleware de rate limiting
  private createRateLimitMiddleware(): MiddlewareFunction {
    const config = getConfig('security.rateLimit');
    
    if (!config.enabled) {
      return () => {}; // Middleware vazio
    }

    // Cache simples para rate limiting (em produção, usar Redis)
    const requestCounts = new Map<string, { count: number; resetTime: number }>();

    return (req: NextRequest) => {
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
      const now = Date.now();
      const key = `${ip}:${req.method}:${req.nextUrl.pathname}`;
      
      const current = requestCounts.get(key);
      
      if (!current || now > current.resetTime) {
        // Reset do contador
        requestCounts.set(key, {
          count: 1,
          resetTime: now + config.windowMs,
        });
      } else {
        // Incrementa o contador
        current.count++;
        
        if (current.count > config.max) {
          middlewareLogger.warn('Rate limit excedido', {
            ip,
            url: req.url,
            method: req.method,
            count: current.count,
            limit: config.max,
          });
          
          return NextResponse.json(
            { error: config.message },
            { status: 429 }
          );
        }
      }
    };
  }

  // Middleware de segurança
  private createSecurityMiddleware(): MiddlewareFunction {
    const config = getConfig('security');
    
    return (req: NextRequest) => {
      // Headers de segurança
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      };

      // Adiciona headers de segurança
      Object.entries(securityHeaders).forEach(([key, value]) => {
        req.headers.set(key, value);
      });

      // Log de tentativas de segurança
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /vbscript:/i,
        /onload/i,
        /onerror/i,
      ];

      const url = req.url;
      const userAgent = req.headers.get('user-agent') || '';

      suspiciousPatterns.forEach(pattern => {
        if (pattern.test(url) || pattern.test(userAgent)) {
          middlewareLogger.warn('Tentativa de ataque detectada', {
            pattern: pattern.source,
            url,
            userAgent,
            ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
          });
        }
      });
    };
  }

  // Middleware de validação
  private createValidationMiddleware(): MiddlewareFunction {
    return (req: NextRequest) => {
      // Validação básica de requisição
      if (!req.url) {
        return NextResponse.json(
          { error: 'URL inválida' },
          { status: 400 }
        );
      }

      // Validação de tamanho de payload
      const contentLength = req.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB
        return NextResponse.json(
          { error: 'Payload muito grande' },
          { status: 413 }
        );
      }
    };
  }

  // Middleware de autenticação
  private createAuthenticationMiddleware(): MiddlewareFunction {
    return async (req: NextRequest) => {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader) {
        // Requisições públicas não precisam de autenticação
        return;
      }

      try {
        // Validação básica do token
        if (!authHeader.startsWith('Bearer ')) {
          return NextResponse.json(
            { error: 'Formato de autorização inválido' },
            { status: 401 }
          );
        }

        const token = authHeader.substring(7);
        
        // Aqui você implementaria a validação real do JWT
        // Por enquanto, apenas valida o formato
        if (token.length < 10) {
          return NextResponse.json(
            { error: 'Token inválido' },
            { status: 401 }
          );
        }

        // Adiciona informações do usuário à requisição
        req.headers.set('x-user-id', 'user-id-from-token');
        req.headers.set('x-authenticated', 'true');
        
      } catch (error) {
        middlewareLogger.error('Erro na autenticação', {
          error: error instanceof Error ? error.message : String(error),
          url: req.url,
        });
        
        return NextResponse.json(
          { error: 'Erro na autenticação' },
          { status: 401 }
        );
      }
    };
  }

  // Middleware de autorização
  private createAuthorizationMiddleware(): MiddlewareFunction {
    return (req: NextRequest) => {
      const isAuthenticated = req.headers.get('x-authenticated') === 'true';
      const userId = req.headers.get('x-user-id');
      
      // Verifica se a rota requer autenticação
      const protectedRoutes = ['/api/admin', '/api/dashboard', '/api/events/create'];
      const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
      
      if (isProtectedRoute && !isAuthenticated) {
        middlewareLogger.warn('Acesso negado a rota protegida', {
          url: req.url,
          ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
        });
        
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 403 }
        );
      }
      
      // Log de acesso autorizado
      if (isProtectedRoute && isAuthenticated) {
        middlewareLogger.info('Acesso autorizado a rota protegida', {
          url: req.url,
          userId,
          ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
        });
      }
    };
  }

  // Middleware de cache
  private createCacheMiddleware(): MiddlewareFunction {
    return (req: NextRequest) => {
      // Implementar lógica de cache aqui
      // Por enquanto, apenas adiciona headers de cache
      if (req.method === 'GET') {
        req.headers.set('x-cache-control', 'public, max-age=300'); // 5 minutos
      }
    };
  }

  // Middleware de compressão
  private createCompressionMiddleware(): MiddlewareFunction {
    return (req: NextRequest) => {
      // Implementar compressão aqui
      // Por enquanto, apenas verifica se o cliente suporta compressão
      const acceptEncoding = req.headers.get('accept-encoding') || '';
      
      if (acceptEncoding.includes('gzip') || acceptEncoding.includes('deflate')) {
        req.headers.set('x-compression-supported', 'true');
      }
    };
  }

  // Obtém configuração de um middleware
  getMiddlewareConfig(name: string): MiddlewareConfig | undefined {
    return this.config[name];
  }

  // Habilita/desabilita um middleware
  setMiddlewareEnabled(name: string, enabled: boolean): void {
    if (this.config[name]) {
      this.config[name].enabled = enabled;
      middlewareLogger.info(`Middleware ${name} ${enabled ? 'habilitado' : 'desabilitado'}`);
    }
  }

  // Lista todos os middlewares
  listMiddlewares(): Array<{ name: string; enabled: boolean; priority: number }> {
    return Array.from(this.middlewares.entries()).map(([name, middleware]) => ({
      name,
      enabled: this.config[name]?.enabled || false,
      priority: middleware.priority || 0,
    }));
  }
}

// Instância global do gerenciador de middleware
export const middlewareManager = new MiddlewareManager();

// Função para criar middleware customizado
export function createCustomMiddleware(
  name: string,
  handler: MiddlewareFunction,
  config: MiddlewareConfig = { enabled: true }
): void {
  middlewareManager.register(name, handler, config);
}

// Função para executar middlewares
export async function executeMiddlewares(req: NextRequest): Promise<NextResponse | null> {
  return middlewareManager.execute(req);
}

// Função para inicializar middlewares
export function initializeMiddlewares(): void {
  try {
    middlewareLogger.info('Sistema de middleware inicializado', {
      middlewares: middlewareManager.listMiddlewares(),
    });
  } catch (error) {
    middlewareLogger.error('Erro ao inicializar middlewares', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Exporta o gerenciador padrão
export default middlewareManager;
