import { getConfig } from '../../config';
import { createModuleLogger } from '../logger';
import { performanceUtils } from '../../utils';

// Logger específico para monitoramento
const monitoringLogger = createModuleLogger('Monitoring');

// Interfaces para o sistema de monitoramento
export interface Metric {
  name: string;
  value: number;
  unit?: string;
  timestamp: number;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  timestamp: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: number;
  metadata?: Record<string, any>;
}

export interface MonitoringStats {
  totalMetrics: number;
  totalHealthChecks: number;
  activeAlerts: number;
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
}

// Classe principal de monitoramento
export class MonitoringSystem {
  private metrics: Map<string, Metric[]> = new Map();
  private healthChecks: Map<string, HealthCheck> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private config = getConfig('monitoring');
  private startTime = Date.now();
  private metricsInterval: NodeJS.Timeout;
  private healthCheckInterval: NodeJS.Timeout;

  constructor() {
    this.initializeMonitoring();
    monitoringLogger.info('Sistema de monitoramento inicializado');
  }

  // Inicializa o sistema de monitoramento
  private initializeMonitoring(): void {
    if (this.config.enabled) {
      // Inicia coleta de métricas
      if (this.config.metrics.enabled) {
        this.startMetricsCollection();
      }

      // Inicia health checks
      if (this.config.healthCheck.enabled) {
        this.startHealthChecks();
      }

      // Configura handlers para eventos não capturados
      this.setupGlobalHandlers();
    }
  }

  // Adiciona uma métrica
  recordMetric(name: string, value: number, options: { unit?: string; tags?: Record<string, string>; metadata?: Record<string, any> } = {}): void {
    try {
      const metric: Metric = {
        name,
        value,
        unit: options.unit,
        timestamp: Date.now(),
        tags: options.tags,
        metadata: options.metadata,
      };

      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }

      const metrics = this.metrics.get(name)!;
      metrics.push(metric);

      // Mantém apenas as métricas mais recentes baseado na retenção
      const retentionTime = this.config.metrics.retention;
      const cutoffTime = Date.now() - retentionTime;
      const filteredMetrics = metrics.filter(m => m.timestamp > cutoffTime);
      
      if (filteredMetrics.length !== metrics.length) {
        this.metrics.set(name, filteredMetrics);
      }

      monitoringLogger.debug('Métrica registrada', { name, value, unit: options.unit });
    } catch (error) {
      monitoringLogger.error('Erro ao registrar métrica', {
        name,
        value,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Adiciona métrica de performance
  recordPerformance(operation: string, duration: number, metadata?: Record<string, any>): void {
    this.recordMetric(`${operation}_duration`, duration, {
      unit: 'ms',
      tags: { operation, type: 'performance' },
      metadata,
    });

    // Registra taxa de operações por segundo
    this.recordMetric(`${operation}_rate`, 1000 / duration, {
      unit: 'ops/sec',
      tags: { operation, type: 'throughput' },
      metadata,
    });
  }

  // Adiciona métrica de erro
  recordError(error: Error, context?: Record<string, any>): void {
    this.recordMetric('error_count', 1, {
      unit: 'count',
      tags: { 
        error_type: error.name,
        error_message: error.message.substring(0, 100),
        type: 'error' 
      },
      metadata: {
        stack: error.stack,
        context,
      },
    });
  }

  // Adiciona métrica de negócio
  recordBusinessEvent(event: string, value: number, metadata?: Record<string, any>): void {
    this.recordMetric(`business_${event}`, value, {
      tags: { event, type: 'business' },
      metadata,
    });
  }

  // Executa health check
  async runHealthCheck(name: string, checkFunction: () => Promise<boolean>, options: { timeout?: number; metadata?: Record<string, any> } = {}): Promise<void> {
    const startTime = Date.now();
    const timeout = options.timeout || this.config.healthCheck.timeout;

    try {
      const result = await Promise.race([
        checkFunction(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);

      const responseTime = Date.now() - startTime;
      const status: 'healthy' | 'unhealthy' | 'degraded' = result ? 'healthy' : 'unhealthy';

      const healthCheck: HealthCheck = {
        name,
        status,
        responseTime,
        lastCheck: Date.now(),
        metadata: options.metadata,
      };

      this.healthChecks.set(name, healthCheck);

      if (status === 'unhealthy') {
        await this.createAlert('error', `Health check falhou: ${name}`, 'health-check', {
          healthCheck: name,
          responseTime,
          metadata: options.metadata,
        });
      }

      monitoringLogger.debug('Health check executado', {
        name,
        status,
        responseTime: `${responseTime}ms`,
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const healthCheck: HealthCheck = {
        name,
        status: 'unhealthy',
        responseTime,
        lastCheck: Date.now(),
        error: error instanceof Error ? error.message : String(error),
        metadata: options.metadata,
      };

      this.healthChecks.set(name, healthCheck);

      await this.createAlert('error', `Health check falhou: ${name}`, 'health-check', {
        healthCheck: name,
        error: error instanceof Error ? error.message : String(error),
        responseTime,
        metadata: options.metadata,
      });

      monitoringLogger.warn('Health check falhou', {
        name,
        error: error instanceof Error ? error.message : String(error),
        responseTime: `${responseTime}ms`,
      });
    }
  }

  // Cria um alerta
  async createAlert(level: Alert['level'], message: string, source: string, metadata?: Record<string, any>): Promise<string> {
    try {
      const alert: Alert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        level,
        message,
        source,
        timestamp: Date.now(),
        acknowledged: false,
        metadata,
      };

      this.alerts.set(alert.id, alert);

      // Log do alerta
      monitoringLogger.warn('Alerta criado', {
        id: alert.id,
        level,
        message,
        source,
      });

      // Envia alerta se configurado
      if (this.config.alerts.enabled) {
        await this.sendAlert(alert);
      }

      return alert.id;
    } catch (error) {
      monitoringLogger.error('Erro ao criar alerta', {
        level,
        message,
        source,
        error: error instanceof Error ? error.message : String(error),
      });
      return '';
    }
  }

  // Reconhece um alerta
  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean> {
    try {
      const alert = this.alerts.get(alertId);
      if (!alert) {
        return false;
      }

      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = Date.now();

      monitoringLogger.info('Alerta reconhecido', {
        alertId,
        acknowledgedBy,
      });

      return true;
    } catch (error) {
      monitoringLogger.error('Erro ao reconhecer alerta', {
        alertId,
        acknowledgedBy,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  // Obtém estatísticas do sistema
  getStats(): MonitoringStats {
    const now = Date.now();
    const uptime = now - this.startTime;

    // Calcula taxa de erro
    const errorMetrics = this.metrics.get('error_count') || [];
    const totalErrors = errorMetrics.reduce((sum, m) => sum + m.value, 0);
    const totalRequests = this.metrics.get('request_count') || [];
    const totalRequestsCount = totalRequests.reduce((sum, m) => sum + m.value, 0);
    const errorRate = totalRequestsCount > 0 ? (totalErrors / totalRequestsCount) * 100 : 0;

    // Calcula tempo médio de resposta
    const responseTimeMetrics = Array.from(this.metrics.values())
      .flat()
      .filter(m => m.unit === 'ms' && m.tags?.type === 'performance');
    const averageResponseTime = responseTimeMetrics.length > 0
      ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) / responseTimeMetrics.length
      : 0;

    return {
      totalMetrics: Array.from(this.metrics.values()).reduce((sum, metrics) => sum + metrics.length, 0),
      totalHealthChecks: this.healthChecks.size,
      activeAlerts: Array.from(this.alerts.values()).filter(a => !a.acknowledged).length,
      systemUptime: uptime,
      averageResponseTime,
      errorRate,
    };
  }

  // Obtém métricas por nome
  getMetrics(name: string, options: { limit?: number; from?: number; to?: number } = {}): Metric[] {
    const metrics = this.metrics.get(name) || [];
    let filteredMetrics = [...metrics];

    // Filtra por período se especificado
    if (options.from || options.to) {
      const from = options.from || 0;
      const to = options.to || Date.now();
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= from && m.timestamp <= to);
    }

    // Limita quantidade de resultados
    if (options.limit) {
      filteredMetrics = filteredMetrics.slice(-options.limit);
    }

    return filteredMetrics;
  }

  // Obtém health checks
  getHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  // Obtém alertas ativos
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(a => !a.acknowledged);
  }

  // Inicia coleta automática de métricas
  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.collectSystemMetrics();
    }, this.config.metrics.collectInterval);
  }

  // Coleta métricas do sistema
  private collectSystemMetrics(): void {
    try {
      // Métricas de memória
      if (typeof process !== 'undefined') {
        const memUsage = process.memoryUsage();
        this.recordMetric('memory_heap_used', memUsage.heapUsed, { unit: 'bytes', tags: { type: 'system' } });
        this.recordMetric('memory_heap_total', memUsage.heapTotal, { unit: 'bytes', tags: { type: 'system' } });
        this.recordMetric('memory_external', memUsage.external, { unit: 'bytes', tags: { type: 'system' } });
        this.recordMetric('memory_rss', memUsage.rss, { unit: 'bytes', tags: { type: 'system' } });
      }

      // Métricas de uptime
      const uptime = Date.now() - this.startTime;
      this.recordMetric('system_uptime', uptime, { unit: 'ms', tags: { type: 'system' } });

      // Métricas de performance
      this.recordMetric('monitoring_metrics_count', this.metrics.size, { unit: 'count', tags: { type: 'monitoring' } });
      this.recordMetric('monitoring_alerts_count', this.alerts.size, { unit: 'count', tags: { type: 'monitoring' } });

    } catch (error) {
      monitoringLogger.error('Erro ao coletar métricas do sistema', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Inicia health checks automáticos
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.runDefaultHealthChecks();
    }, this.config.healthCheck.interval);
  }

  // Executa health checks padrão
  private async runDefaultHealthChecks(): Promise<void> {
    try {
      // Health check básico do sistema
      await this.runHealthCheck('system_basic', async () => {
        return true; // Sempre retorna true para health check básico
      });

      // Health check de memória
      if (typeof process !== 'undefined') {
        await this.runHealthCheck('memory_usage', async () => {
          const memUsage = process.memoryUsage();
          const heapUsageRatio = memUsage.heapUsed / memUsage.heapTotal;
          return heapUsageRatio < 0.9; // Menos de 90% de uso
        }, { metadata: { heapUsageRatio: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal } });
      }

      // Health check de métricas
      await this.runHealthCheck('metrics_collection', async () => {
        return this.metrics.size > 0; // Deve ter pelo menos uma métrica
      });

    } catch (error) {
      monitoringLogger.error('Erro ao executar health checks padrão', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Configura handlers globais
  private setupGlobalHandlers(): void {
    if (typeof process !== 'undefined') {
      // Handler para exceções não capturadas
      process.on('uncaughtException', (error) => {
        this.recordError(error, { source: 'uncaughtException' });
        this.createAlert('critical', `Exceção não capturada: ${error.message}`, 'system', {
          error: error.message,
          stack: error.stack,
        });
      });

      // Handler para rejeições de promise não tratadas
      process.on('unhandledRejection', (reason) => {
        const error = reason instanceof Error ? reason : new Error(String(reason));
        this.recordError(error, { source: 'unhandledRejection' });
        this.createAlert('critical', `Promise rejeitada não tratada: ${error.message}`, 'system', {
          error: error.message,
          stack: error.stack,
        });
      }

      // Handler para sinais de término
      process.on('SIGTERM', () => {
        this.recordMetric('system_shutdown', 1, { unit: 'count', tags: { type: 'system', signal: 'SIGTERM' } });
        this.cleanup();
      });

      process.on('SIGINT', () => {
        this.recordMetric('system_shutdown', 1, { unit: 'count', tags: { type: 'system', signal: 'SIGINT' } });
        this.cleanup();
      });
    }
  }

  // Envia alerta
  private async sendAlert(alert: Alert): Promise<void> {
    try {
      if (this.config.alerts.webhook) {
        // Envia para webhook
        await fetch(this.config.alerts.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        });
      }

      if (this.config.alerts.email) {
        // Envia por email (implementar serviço de email)
        monitoringLogger.info('Alerta enviado por email', { alertId: alert.id, email: this.config.alerts.email });
      }

    } catch (error) {
      monitoringLogger.error('Erro ao enviar alerta', {
        alertId: alert.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Limpeza do sistema
  private cleanup(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    monitoringLogger.info('Sistema de monitoramento finalizado');
  }

  // Destrói o sistema
  destroy(): void {
    this.cleanup();
  }
}

// Instância global do sistema de monitoramento
export const monitoring = new MonitoringSystem();

// Funções de conveniência
export const metrics = {
  record: (name: string, value: number, options?: { unit?: string; tags?: Record<string, string>; metadata?: Record<string, any> }) => 
    monitoring.recordMetric(name, value, options),
  
  performance: (operation: string, duration: number, metadata?: Record<string, any>) => 
    monitoring.recordPerformance(operation, duration, metadata),
  
  error: (error: Error, context?: Record<string, any>) => 
    monitoring.recordError(error, context),
  
  business: (event: string, value: number, metadata?: Record<string, any>) => 
    monitoring.recordBusinessEvent(event, value, metadata),
};

export const health = {
  check: (name: string, checkFunction: () => Promise<boolean>, options?: { timeout?: number; metadata?: Record<string, any> }) => 
    monitoring.runHealthCheck(name, checkFunction, options),
  
  get: () => monitoring.getHealthChecks(),
};

export const alerts = {
  create: (level: Alert['level'], message: string, source: string, metadata?: Record<string, any>) => 
    monitoring.createAlert(level, message, source, metadata),
  
  acknowledge: (alertId: string, acknowledgedBy: string) => 
    monitoring.acknowledgeAlert(alertId, acknowledgedBy),
  
  getActive: () => monitoring.getActiveAlerts(),
};

// Função para inicializar monitoramento
export function initializeMonitoring(): void {
  try {
    monitoringLogger.info('Sistema de monitoramento inicializado', {
      enabled: getConfig('monitoring').enabled,
      metrics: getConfig('monitoring').metrics.enabled,
      healthCheck: getConfig('monitoring').healthCheck.enabled,
      alerts: getConfig('monitoring').alerts.enabled,
    });
  } catch (error) {
    monitoringLogger.error('Erro ao inicializar monitoramento', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Exporta o sistema padrão
export default monitoring;
