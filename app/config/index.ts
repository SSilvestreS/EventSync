import { z } from 'zod';

// Schema de validação para configurações
const ConfigSchema = z.object({
  // Configurações básicas
  app: z.object({
    name: z.string().default('EventSync'),
    version: z.string().default('1.3.0'),
    environment: z.enum(['development', 'staging', 'production']).default('development'),
    debug: z.boolean().default(false),
    port: z.number().default(3000),
    host: z.string().default('localhost'),
  }),

  // Configurações de banco de dados
  database: z.object({
    url: z.string().url(),
    type: z.enum(['postgresql', 'mysql', 'sqlite']).default('postgresql'),
    pool: z.object({
      min: z.number().default(2),
      max: z.number().default(10),
      acquireTimeoutMillis: z.number().default(30000),
      createTimeoutMillis: z.number().default(30000),
      destroyTimeoutMillis: z.number().default(5000),
      idleTimeoutMillis: z.number().default(30000),
      reapIntervalMillis: z.number().default(1000),
      createRetryIntervalMillis: z.number().default(200),
    }),
    ssl: z.boolean().default(false),
    logging: z.boolean().default(false),
  }),

  // Configurações de autenticação
  auth: z.object({
    secret: z.string().min(32),
    jwt: z.object({
      secret: z.string().min(32),
      expiresIn: z.string().default('7d'),
      refreshExpiresIn: z.string().default('30d'),
      issuer: z.string().default('eventsync'),
      audience: z.string().default('eventsync-users'),
    }),
    session: z.object({
      secret: z.string().min(32),
      maxAge: z.number().default(24 * 60 * 60 * 1000), // 24 horas
      secure: z.boolean().default(false),
      httpOnly: z.boolean().default(true),
      sameSite: z.enum(['lax', 'strict', 'none']).default('lax'),
    }),
    oauth: z.object({
      google: z.object({
        clientId: z.string().optional(),
        clientSecret: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
      github: z.object({
        clientId: z.string().optional(),
        clientSecret: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
      facebook: z.object({
        appId: z.string().optional(),
        appSecret: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
    }),
  }),

  // Configurações de email
  email: z.object({
    provider: z.enum(['smtp', 'sendgrid', 'mailgun', 'ses', 'nodemailer']).default('nodemailer'),
    from: z.object({
      name: z.string().default('EventSync'),
      email: z.string().email(),
    }),
    smtp: z.object({
      host: z.string().optional(),
      port: z.number().optional(),
      secure: z.boolean().default(true),
      auth: z.object({
        user: z.string().optional(),
        pass: z.string().optional(),
      }),
    }),
    sendgrid: z.object({
      apiKey: z.string().optional(),
    }),
    mailgun: z.object({
      apiKey: z.string().optional(),
      domain: z.string().optional(),
    }),
    ses: z.object({
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
      region: z.string().optional(),
    }),
    templates: z.object({
      path: z.string().default('./templates/email'),
      engine: z.enum(['handlebars', 'ejs', 'pug']).default('handlebars'),
    }),
  }),

  // Configurações de pagamento
  payment: z.object({
    stripe: z.object({
      secretKey: z.string().optional(),
      publishableKey: z.string().optional(),
      webhookSecret: z.string().optional(),
      enabled: z.boolean().default(false),
    }),
    paypal: z.object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      mode: z.enum(['sandbox', 'live']).default('sandbox'),
      enabled: z.boolean().default(false),
    }),
    pix: z.object({
      enabled: z.boolean().default(true),
      expirationHours: z.number().default(24),
    }),
    bankTransfer: z.object({
      enabled: z.boolean().default(true),
      banks: z.array(z.string()).default(['Banco do Brasil', 'Itaú', 'Bradesco', 'Santander']),
    }),
  }),

  // Configurações de notificações
  notifications: z.object({
    push: z.object({
      enabled: z.boolean().default(true),
      vapid: z.object({
        publicKey: z.string().optional(),
        privateKey: z.string().optional(),
      }),
      ttl: z.number().default(24 * 60 * 60), // 24 horas
    }),
    sms: z.object({
      enabled: z.boolean().default(false),
      provider: z.enum(['twilio', 'aws-sns', 'zenvia']).optional(),
      twilio: z.object({
        accountSid: z.string().optional(),
        authToken: z.string().optional(),
        fromNumber: z.string().optional(),
      }),
    }),
    whatsapp: z.object({
      enabled: z.boolean().default(false),
      provider: z.enum(['twilio', 'meta']).optional(),
      meta: z.object({
        accessToken: z.string().optional(),
        phoneNumberId: z.string().optional(),
        verifyToken: z.string().optional(),
      }),
    }),
  }),

  // Configurações de analytics
  analytics: z.object({
    enabled: z.boolean().default(true),
    providers: z.object({
      mixpanel: z.object({
        token: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
      posthog: z.object({
        token: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
      amplitude: z.object({
        token: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
      google: z.object({
        measurementId: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
    }),
    tracking: z.object({
      pageViews: z.boolean().default(true),
      events: z.boolean().default(true),
      userBehavior: z.boolean().default(true),
      performance: z.boolean().default(true),
    }),
  }),

  // Configurações de CRM
  crm: z.object({
    enabled: z.boolean().default(true),
    providers: z.object({
      hubspot: z.object({
        apiKey: z.string().optional(),
        enabled: z.boolean().default(false),
        portalId: z.string().optional(),
      }),
      salesforce: z.object({
        clientId: z.string().optional(),
        clientSecret: z.string().optional(),
        username: z.string().optional(),
        password: z.string().optional(),
        securityToken: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
      pipedrive: z.object({
        apiKey: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
      zapier: z.object({
        webhookUrl: z.string().optional(),
        enabled: z.boolean().default(false),
      }),
    }),
    sync: z.object({
      enabled: z.boolean().default(true),
      interval: z.number().default(5 * 60 * 1000), // 5 minutos
      batchSize: z.number().default(100),
    }),
  }),

  // Configurações de afiliados
  affiliate: z.object({
    enabled: z.boolean().default(true),
    commission: z.object({
      defaultRate: z.number().min(0).max(1).default(0.10), // 10%
      minPayout: z.number().min(0).default(50.00),
      payoutSchedule: z.enum(['weekly', 'monthly', 'quarterly']).default('monthly'),
      payoutDay: z.number().min(1).max(31).default(15),
    }),
    tracking: z.object({
      cookieExpiry: z.number().default(30 * 24 * 60 * 60 * 1000), // 30 dias
      ipTracking: z.boolean().default(true),
      deviceTracking: z.boolean().default(true),
    }),
  }),

  // Configurações de internacionalização
  i18n: z.object({
    defaultLocale: z.string().default('pt-BR'),
    supportedLocales: z.array(z.string()).default(['pt-BR', 'en-US', 'es-ES']),
    fallbackLocale: z.string().default('pt-BR'),
    loadPath: z.string().default('./public/locales/{{lng}}/{{ns}}.json'),
    detection: z.object({
      order: z.array(z.string()).default(['cookie', 'localStorage', 'navigator', 'htmlTag']),
      caches: z.array(z.string()).default(['localStorage']),
      cookieExpirationDate: z.number().default(365 * 24 * 60 * 60 * 1000), // 1 ano
    }),
    interpolation: z.object({
      escapeValue: z.boolean().default(false),
    }),
  }),

  // Configurações de cache
  cache: z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['memory', 'redis', 'memcached']).default('memory'),
    redis: z.object({
      host: z.string().default('localhost'),
      port: z.number().default(6379),
      password: z.string().optional(),
      db: z.number().default(0),
    }),
    ttl: z.object({
      short: z.number().default(5 * 60 * 1000), // 5 minutos
      medium: z.number().default(30 * 60 * 1000), // 30 minutos
      long: z.number().default(2 * 60 * 60 * 1000), // 2 horas
      day: z.number().default(24 * 60 * 60 * 1000), // 24 horas
    }),
    keys: z.object({
      prefix: z.string().default('eventsync:'),
      separator: z.string().default(':'),
    }),
  }),

  // Configurações de upload
  upload: z.object({
    provider: z.enum(['local', 's3', 'cloudinary', 'gcs']).default('local'),
    maxFileSize: z.number().default(10 * 1024 * 1024), // 10MB
    allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    imageProcessing: z.object({
      enabled: z.boolean().default(true),
      quality: z.number().min(0).max(1).default(0.8),
      formats: z.array(z.string()).default(['webp', 'jpeg']),
      sizes: z.array(z.object({
        name: z.string(),
        width: z.number(),
        height: z.number(),
      })).default([
        { name: 'thumbnail', width: 150, height: 150 },
        { name: 'small', width: 300, height: 300 },
        { name: 'medium', width: 600, height: 600 },
        { name: 'large', width: 1200, height: 1200 },
      ]),
    }),
    s3: z.object({
      bucket: z.string().optional(),
      region: z.string().optional(),
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
    }),
    cloudinary: z.object({
      cloudName: z.string().optional(),
      apiKey: z.string().optional(),
      apiSecret: z.string().optional(),
    }),
    gcs: z.object({
      bucket: z.string().optional(),
      projectId: z.string().optional(),
      keyFilename: z.string().optional(),
    }),
  }),

  // Configurações de segurança
  security: z.object({
    cors: z.object({
      enabled: z.boolean().default(true),
      origin: z.union([z.string(), z.array(z.string())]).default('*'),
      methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
      allowedHeaders: z.array(z.string()).default(['Content-Type', 'Authorization']),
      credentials: z.boolean().default(true),
    }),
    rateLimit: z.object({
      enabled: z.boolean().default(true),
      windowMs: z.number().default(15 * 60 * 1000), // 15 minutos
      max: z.number().default(100),
      message: z.string().default('Muitas requisições, tente novamente mais tarde.'),
      standardHeaders: z.boolean().default(true),
      legacyHeaders: z.boolean().default(false),
    }),
    helmet: z.object({
      enabled: z.boolean().default(true),
      contentSecurityPolicy: z.boolean().default(true),
      hsts: z.boolean().default(true),
      noSniff: z.boolean().default(true),
      referrerPolicy: z.boolean().default(true),
    }),
    csrf: z.object({
      enabled: z.boolean().default(true),
      secret: z.string().optional(),
    }),
  }),

  // Configurações de logging
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    format: z.enum(['json', 'simple', 'combined']).default('json'),
    transports: z.array(z.enum(['console', 'file', 'database'])).default(['console']),
    file: z.object({
      filename: z.string().default('./logs/app.log'),
      maxSize: z.number().default(20 * 1024 * 1024), // 20MB
      maxFiles: z.number().default(5),
    }),
    database: z.object({
      enabled: z.boolean().default(false),
      table: z.string().default('logs'),
    }),
  }),

  // Configurações de monitoramento
  monitoring: z.object({
    enabled: z.boolean().default(true),
    healthCheck: z.object({
      enabled: z.boolean().default(true),
      interval: z.number().default(30 * 1000), // 30 segundos
      timeout: z.number().default(5000),
    }),
    metrics: z.object({
      enabled: z.boolean().default(true),
      collectInterval: z.number().default(60 * 1000), // 1 minuto
      retention: z.number().default(7 * 24 * 60 * 60 * 1000), // 7 dias
    }),
    alerts: z.object({
      enabled: z.boolean().default(false),
      webhook: z.string().optional(),
      email: z.string().optional(),
    }),
  }),

  // Configurações de testes
  testing: z.object({
    enabled: z.boolean().default(false),
    coverage: z.object({
      enabled: z.boolean().default(true),
      threshold: z.object({
        global: z.number().min(0).max(100).default(80),
        branches: z.number().min(0).max(100).default(80),
        functions: z.number().min(0).max(100).default(80),
        lines: z.number().min(0).max(100).default(80),
        statements: z.number().min(0).max(100).default(80),
      }),
    }),
    e2e: z.object({
      enabled: z.boolean().default(false),
      browser: z.array(z.enum(['chromium', 'firefox', 'webkit'])).default(['chromium']),
      headless: z.boolean().default(true),
    }),
  }),
});

// Tipo inferido do schema
export type AppConfig = z.infer<typeof ConfigSchema>;

// Configuração padrão
const defaultConfig: AppConfig = {
  app: {
    name: 'EventSync',
    version: '1.3.0',
    environment: 'development',
    debug: false,
    port: 3000,
    host: 'localhost',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/eventsync',
    type: 'postgresql',
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
    },
    ssl: false,
    logging: false,
  },
  auth: {
    secret: process.env.AUTH_SECRET || 'your-secret-key-here-min-32-chars',
    jwt: {
      secret: process.env.JWT_SECRET || 'your-jwt-secret-key-here-min-32-chars',
      expiresIn: '7d',
      refreshExpiresIn: '30d',
      issuer: 'eventsync',
      audience: 'eventsync-users',
    },
    session: {
      secret: process.env.SESSION_SECRET || 'your-session-secret-key-here-min-32-chars',
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
    },
    oauth: {
      google: {
        enabled: false,
      },
      github: {
        enabled: false,
      },
      facebook: {
        enabled: false,
      },
    },
  },
  email: {
    provider: 'nodemailer',
    from: {
      name: 'EventSync',
      email: process.env.FROM_EMAIL || 'noreply@eventsync.com',
    },
    smtp: {},
    sendgrid: {},
    mailgun: {},
    ses: {},
    templates: {
      path: './templates/email',
      engine: 'handlebars',
    },
  },
  payment: {
    stripe: {
      enabled: false,
    },
    paypal: {
      mode: 'sandbox',
      enabled: false,
    },
    pix: {
      enabled: true,
      expirationHours: 24,
    },
    bankTransfer: {
      enabled: true,
      banks: ['Banco do Brasil', 'Itaú', 'Bradesco', 'Santander'],
    },
  },
  notifications: {
    push: {
      enabled: true,
      vapid: {},
      ttl: 24 * 60 * 60,
    },
    sms: {
      enabled: false,
    },
    whatsapp: {
      enabled: false,
    },
  },
  analytics: {
    enabled: true,
    providers: {
      mixpanel: {
        enabled: false,
      },
      posthog: {
        enabled: false,
      },
      amplitude: {
        enabled: false,
      },
      google: {
        enabled: false,
      },
    },
    tracking: {
      pageViews: true,
      events: true,
      userBehavior: true,
      performance: true,
    },
  },
  crm: {
    enabled: true,
    providers: {
      hubspot: {
        enabled: false,
      },
      salesforce: {
        enabled: false,
      },
      pipedrive: {
        enabled: false,
      },
      zapier: {
        enabled: false,
      },
    },
    sync: {
      enabled: true,
      interval: 5 * 60 * 1000,
      batchSize: 100,
    },
  },
  affiliate: {
    enabled: true,
    commission: {
      defaultRate: 0.10,
      minPayout: 50.00,
      payoutSchedule: 'monthly',
      payoutDay: 15,
    },
    tracking: {
      cookieExpiry: 30 * 24 * 60 * 60 * 1000,
      ipTracking: true,
      deviceTracking: true,
    },
  },
  i18n: {
    defaultLocale: 'pt-BR',
    supportedLocales: ['pt-BR', 'en-US', 'es-ES'],
    fallbackLocale: 'pt-BR',
    loadPath: './public/locales/{{lng}}/{{ns}}.json',
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      cookieExpirationDate: 365 * 24 * 60 * 60 * 1000,
    },
    interpolation: {
      escapeValue: false,
    },
  },
  cache: {
    enabled: true,
    provider: 'memory',
    redis: {
      host: 'localhost',
      port: 6379,
      db: 0,
    },
    ttl: {
      short: 5 * 60 * 1000,
      medium: 30 * 60 * 1000,
      long: 2 * 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
    },
    keys: {
      prefix: 'eventsync:',
      separator: ':',
    },
  },
  upload: {
    provider: 'local',
    maxFileSize: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    imageProcessing: {
      enabled: true,
      quality: 0.8,
      formats: ['webp', 'jpeg'],
      sizes: [
        { name: 'thumbnail', width: 150, height: 150 },
        { name: 'small', width: 300, height: 300 },
        { name: 'medium', width: 600, height: 600 },
        { name: 'large', width: 1200, height: 1200 },
      ],
    },
    s3: {},
    cloudinary: {},
    gcs: {},
  },
  security: {
    cors: {
      enabled: true,
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Muitas requisições, tente novamente mais tarde.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    helmet: {
      enabled: true,
      contentSecurityPolicy: true,
      hsts: true,
      noSniff: true,
      referrerPolicy: true,
    },
    csrf: {
      enabled: true,
    },
  },
  logging: {
    level: 'info',
    format: 'json',
    transports: ['console'],
    file: {
      filename: './logs/app.log',
      maxSize: 20 * 1024 * 1024,
      maxFiles: 5,
    },
    database: {
      enabled: false,
      table: 'logs',
    },
  },
  monitoring: {
    enabled: true,
    healthCheck: {
      enabled: true,
      interval: 30 * 1000,
      timeout: 5000,
    },
    metrics: {
      enabled: true,
      collectInterval: 60 * 1000,
      retention: 7 * 24 * 60 * 60 * 1000,
    },
    alerts: {
      enabled: false,
    },
  },
  testing: {
    enabled: false,
    coverage: {
      enabled: true,
      threshold: {
        global: 80,
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    e2e: {
      enabled: false,
      browser: ['chromium'],
      headless: true,
    },
  },
};

// Função para carregar configuração do ambiente
function loadEnvironmentConfig(): Partial<AppConfig> {
  const envConfig: Partial<AppConfig> = {};

  // Configurações de ambiente
  if (process.env.NODE_ENV) {
    envConfig.app = { ...envConfig.app, environment: process.env.NODE_ENV as any };
  }

  // Configurações de banco de dados
  if (process.env.DATABASE_URL) {
    envConfig.database = { ...envConfig.database, url: process.env.DATABASE_URL };
  }

  // Configurações de autenticação
  if (process.env.AUTH_SECRET) {
    envConfig.auth = { ...envConfig.auth, secret: process.env.AUTH_SECRET };
  }
  if (process.env.JWT_SECRET) {
    envConfig.auth = { ...envConfig.auth, jwt: { ...envConfig.auth?.jwt, secret: process.env.JWT_SECRET } };
  }
  if (process.env.SESSION_SECRET) {
    envConfig.auth = { ...envConfig.auth, session: { ...envConfig.auth?.session, secret: process.env.SESSION_SECRET } };
  }

  // Configurações de email
  if (process.env.FROM_EMAIL) {
    envConfig.email = { ...envConfig.email, from: { ...envConfig.email?.from, email: process.env.FROM_EMAIL } };
  }

  // Configurações de Stripe
  if (process.env.STRIPE_SECRET_KEY) {
    envConfig.payment = { ...envConfig.payment, stripe: { ...envConfig.payment?.stripe, secretKey: process.env.STRIPE_SECRET_KEY } };
  }
  if (process.env.STRIPE_PUBLISHABLE_KEY) {
    envConfig.payment = { ...envConfig.payment, stripe: { ...envConfig.payment?.stripe, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY } };
  }

  // Configurações de Google OAuth
  if (process.env.GOOGLE_CLIENT_ID) {
    envConfig.auth = { ...envConfig.auth, oauth: { ...envConfig.auth?.oauth, google: { ...envConfig.auth?.oauth?.google, clientId: process.env.GOOGLE_CLIENT_ID } } };
  }
  if (process.env.GOOGLE_CLIENT_SECRET) {
    envConfig.auth = { ...envConfig.auth, oauth: { ...envConfig.auth?.oauth, google: { ...envConfig.auth?.oauth?.google, clientSecret: process.env.GOOGLE_CLIENT_SECRET } } };
  }

  return envConfig;
}

// Função para carregar configuração de arquivo
async function loadFileConfig(): Promise<Partial<AppConfig>> {
  try {
    // Tenta carregar configuração de arquivo baseado no ambiente
    const env = process.env.NODE_ENV || 'development';
    const configPath = `./config.${env}.json`;
    
    // Em produção, pode ser um arquivo separado
    if (env === 'production') {
      try {
        const config = await import(configPath);
        return config.default || config;
      } catch {
        // Se não conseguir carregar, retorna vazio
        return {};
      }
    }
    
    return {};
  } catch {
    return {};
  }
}

// Função para validar configuração
function validateConfig(config: AppConfig): AppConfig {
  try {
    return ConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação de configuração:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw new Error('Configuração inválida');
  }
}

// Função para carregar configuração completa
export async function loadConfig(): Promise<AppConfig> {
  try {
    // Carrega configurações do ambiente
    const envConfig = loadEnvironmentConfig();
    
    // Carrega configurações de arquivo
    const fileConfig = await loadFileConfig();
    
    // Mescla todas as configurações
    const mergedConfig = {
      ...defaultConfig,
      ...fileConfig,
      ...envConfig,
    };
    
    // Valida a configuração final
    const validatedConfig = validateConfig(mergedConfig);
    
    console.log(`✅ Configuração carregada para ambiente: ${validatedConfig.app.environment}`);
    
    return validatedConfig;
  } catch (error) {
    console.error('❌ Erro ao carregar configuração:', error);
    throw error;
  }
}

// Função para obter configuração específica
export function getConfig<T extends keyof AppConfig>(key: T): AppConfig[T] {
  if (!globalConfig) {
    throw new Error('Configuração não foi carregada. Chame loadConfig() primeiro.');
  }
  return globalConfig[key];
}

// Função para obter configuração aninhada
export function getNestedConfig<T = any>(path: string, defaultValue?: T): T {
  if (!globalConfig) {
    throw new Error('Configuração não foi carregada. Chame loadConfig() primeiro.');
  }
  
  const keys = path.split('.');
  let value: any = globalConfig;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue as T;
    }
  }
  
  return value;
}

// Função para verificar se estamos em produção
export function isProduction(): boolean {
  return getConfig('app').environment === 'production';
}

// Função para verificar se estamos em desenvolvimento
export function isDevelopment(): boolean {
  return getConfig('app').environment === 'development';
}

// Função para verificar se debug está habilitado
export function isDebugEnabled(): boolean {
  return getConfig('app').debug;
}

// Configuração global
let globalConfig: AppConfig | null = null;

// Função para inicializar configuração
export async function initializeConfig(): Promise<void> {
  if (!globalConfig) {
    globalConfig = await loadConfig();
  }
}

// Função para obter configuração completa
export function getFullConfig(): AppConfig {
  if (!globalConfig) {
    throw new Error('Configuração não foi carregada. Chame loadConfig() primeiro.');
  }
  return globalConfig;
}

// Exporta configuração padrão para uso em desenvolvimento
export { defaultConfig, ConfigSchema };
export type { AppConfig };
