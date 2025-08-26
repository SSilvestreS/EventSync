import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getConfig, isProduction, isDevelopment } from '../../config';

// Níveis de log personalizados
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Cores para diferentes níveis de log
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'white',
};

// Adiciona cores ao winston
winston.addColors(logColors);

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Formato para desenvolvimento (mais legível)
const devFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Formato para produção (JSON estruturado)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Configuração dos transportes
function createTransports() {
  const transports: winston.transport[] = [];
  const config = getConfig('logging');

  // Transporte para console
  if (config.transports.includes('console')) {
    transports.push(
      new winston.transports.Console({
        level: config.level,
        format: isDevelopment() ? devFormat : prodFormat,
        handleExceptions: true,
        handleRejections: true,
      })
    );
  }

  // Transporte para arquivo
  if (config.transports.includes('file')) {
    // Arquivo de erro
    transports.push(
      new DailyRotateFile({
        filename: config.file.filename.replace('.log', '.error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: config.file.maxSize,
        maxFiles: config.file.maxFiles,
        format: prodFormat,
        handleExceptions: true,
        handleRejections: true,
      })
    );

    // Arquivo geral
    transports.push(
      new DailyRotateFile({
        filename: config.file.filename.replace('.log', '-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: config.file.maxSize,
        maxFiles: config.file.maxFiles,
        format: prodFormat,
        handleExceptions: true,
        handleRejections: true,
      })
    );
  }

  // Transporte para banco de dados
  if (config.transports.includes('database') && config.database.enabled) {
    // Implementar transporte para banco de dados
    // Pode ser um transport customizado para Prisma
  }

  return transports;
}

// Cria o logger principal
const logger = winston.createLogger({
  level: getConfig('logging').level,
  levels: logLevels,
  format: isProduction() ? prodFormat : logFormat,
  transports: createTransports(),
  exitOnError: false,
});

// Adiciona handlers para exceções não capturadas
logger.exceptions.handle(
  new winston.transports.File({
    filename: 'logs/exceptions.log',
    format: prodFormat,
  })
);

logger.rejections.handle(
  new winston.transports.File({
    filename: 'logs/rejections.log',
    format: prodFormat,
  })
);

// Interface para o logger
export interface Logger {
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  http(message: string, meta?: any): void;
  verbose(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  silly(message: string, meta?: any): void;
  
  // Métodos especiais
  logRequest(req: any, res: any, responseTime?: number): void;
  logError(error: Error, context?: any): void;
  logPerformance(operation: string, duration: number, meta?: any): void;
  logSecurity(event: string, details: any): void;
  logBusiness(event: string, details: any): void;
}

// Implementação do logger
class EventSyncLogger implements Logger {
  error(message: string, meta?: any): void {
    logger.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    logger.warn(message, meta);
  }

  info(message: string, meta?: any): void {
    logger.info(message, meta);
  }

  http(message: string, meta?: any): void {
    logger.http(message, meta);
  }

  verbose(message: string, meta?: any): void {
    logger.verbose(message, meta);
  }

  debug(message: string, meta?: any): void {
    logger.debug(message, meta);
  }

  silly(message: string, meta?: any): void {
    logger.silly(message, meta);
  }

  // Log de requisições HTTP
  logRequest(req: any, res: any, responseTime?: number): void {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      this.warn('HTTP Request', logData);
    } else {
      this.http('HTTP Request', logData);
    }
  }

  // Log de erros com contexto
  logError(error: Error, context?: any): void {
    const logData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      timestamp: new Date().toISOString(),
    };

    this.error('Application Error', logData);
  }

  // Log de performance
  logPerformance(operation: string, duration: number, meta?: any): void {
    const logData = {
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...meta,
    };

    if (duration > 1000) {
      this.warn('Performance Warning', logData);
    } else {
      this.info('Performance Metric', logData);
    }
  }

  // Log de eventos de segurança
  logSecurity(event: string, details: any): void {
    const logData = {
      event,
      details,
      timestamp: new Date().toISOString(),
      type: 'security',
    };

    this.warn('Security Event', logData);
  }

  // Log de eventos de negócio
  logBusiness(event: string, details: any): void {
    const logData = {
      event,
      details,
      timestamp: new Date().toISOString(),
      type: 'business',
    };

    this.info('Business Event', logData);
  }
}

// Instância principal do logger
export const log = new EventSyncLogger();

// Função para criar logger específico para um módulo
export function createModuleLogger(module: string): Logger {
  return {
    error: (message: string, meta?: any) => log.error(`[${module}] ${message}`, meta),
    warn: (message: string, meta?: any) => log.warn(`[${module}] ${message}`, meta),
    info: (message: string, meta?: any) => log.info(`[${module}] ${message}`, meta),
    http: (message: string, meta?: any) => log.http(`[${module}] ${message}`, meta),
    verbose: (message: string, meta?: any) => log.verbose(`[${module}] ${message}`, meta),
    debug: (message: string, meta?: any) => log.debug(`[${module}] ${message}`, meta),
    silly: (message: string, meta?: any) => log.silly(`[${module}] ${message}`, meta),
    logRequest: (req: any, res: any, responseTime?: number) => log.logRequest(req, res, responseTime),
    logError: (error: Error, context?: any) => log.logError(error, context),
    logPerformance: (operation: string, duration: number, meta?: any) => log.logPerformance(operation, duration, meta),
    logSecurity: (event: string, details: any) => log.logSecurity(event, details),
    logBusiness: (event: string, details: any) => log.logBusiness(event, details),
  };
}

// Middleware para logging de requisições
export function requestLogger(req: any, res: any, next: any): void {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    log.logRequest(req, res, duration);
  });
  
  next();
}

// Função para inicializar o logger
export function initializeLogger(): void {
  try {
    log.info('Logger inicializado com sucesso', {
      level: getConfig('logging').level,
      transports: getConfig('logging').transports,
      environment: getConfig('app').environment,
    });
  } catch (error) {
    console.error('Erro ao inicializar logger:', error);
  }
}

// Exporta o logger padrão
export default log;
