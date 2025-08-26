// Configurações da Versão 1.2 - EventSync

export const VERSION = '1.2.0';

// Configurações de Analytics
export const ANALYTICS_CONFIG = {
  // Mixpanel
  MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  MIXPANEL_ENABLED: !!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  
  // PostHog
  POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  POSTHOG_ENABLED: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
  
  // Amplitude
  AMPLITUDE_API_KEY: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
  AMPLITUDE_ENABLED: !!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
  
  // Configurações gerais
  TRACK_PAGE_VIEWS: true,
  TRACK_USER_ACTIONS: true,
  TRACK_CONVERSIONS: true,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  CLEANUP_OLD_DATA_DAYS: 365
};

// Configurações de CRM
export const CRM_CONFIG = {
  // HubSpot
  HUBSPOT_API_KEY: process.env.HUBSPOT_API_KEY,
  HUBSPOT_ENABLED: !!process.env.HUBSPOT_API_KEY,
  
  // Salesforce
  SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
  SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
  SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME,
  SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD,
  SALESFORCE_BASE_URL: process.env.SALESFORCE_BASE_URL,
  SALESFORCE_ENABLED: !!process.env.SALESFORCE_CLIENT_ID,
  
  // Pipedrive
  PIPEDRIVE_API_KEY: process.env.PIPEDRIVE_API_KEY,
  PIPEDRIVE_ENABLED: !!process.env.PIPEDRIVE_API_KEY,
  
  // Zapier
  ZAPIER_WEBHOOK_URL: process.env.ZAPIER_WEBHOOK_URL,
  ZAPIER_ENABLED: !!process.env.ZAPIER_WEBHOOK_URL,
  
  // Configurações gerais
  AUTO_SYNC_CONTACTS: true,
  AUTO_CREATE_LEADS: true,
  LEAD_SCORING_ENABLED: true,
  SYNC_INTERVAL: 24 * 60 * 60 * 1000 // 24 horas
};

// Configurações de Afiliados
export const AFFILIATE_CONFIG = {
  DEFAULT_COMMISSION: 10.0, // 10%
  MIN_COMMISSION: 1.0, // 1%
  MAX_COMMISSION: 50.0, // 50%
  
  // Status de afiliados
  STATUSES: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    PENDING: 'PENDING'
  },
  
  // Status de referências
  REFERRAL_STATUSES: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED'
  },
  
  // Configurações de pagamento
  PAYMENT_METHODS: ['BANK_TRANSFER', 'PIX', 'PAYPAL'],
  MIN_PAYOUT_AMOUNT: 50.0, // R$ 50,00
  PAYOUT_SCHEDULE: 'MONTHLY', // Mensal
  
  // Validações
  MIN_REFERRALS_FOR_PAYOUT: 1,
  AUTO_APPROVE_REFERRALS: false,
  REQUIRE_MANUAL_APPROVAL: true
};

// Configurações de Internacionalização
export const I18N_CONFIG = {
  DEFAULT_LANGUAGE: 'pt-BR',
  FALLBACK_LANGUAGE: 'en-US',
  
  // Idiomas suportados
  SUPPORTED_LANGUAGES: [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷', rtl: false },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸', rtl: false },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸', rtl: false },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', rtl: false },
    { code: 'it-IT', name: 'Italiano', flag: '🇮🇹', rtl: false },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵', rtl: false },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷', rtl: false },
    { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳', rtl: false },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦', rtl: true }
  ],
  
  // Configurações de detecção
  DETECT_BROWSER_LANGUAGE: true,
  DETECT_IP_LOCATION: false,
  SAVE_USER_PREFERENCES: true,
  
  // Formatação
  DEFAULT_DATE_FORMAT: 'DD/MM/YYYY',
  DEFAULT_TIME_FORMAT: '24h',
  DEFAULT_CURRENCY: 'BRL',
  DEFAULT_TIMEZONE: 'America/Sao_Paulo'
};

// Configurações de Tracking de Conversões
export const CONVERSION_CONFIG = {
  TRACK_UTM_PARAMETERS: true,
  TRACK_REFERRERS: true,
  TRACK_LANDING_PAGES: true,
  TRACK_SESSION_DATA: true,
  
  // Tipos de conversão
  CONVERSION_TYPES: [
    'REGISTRATION',
    'PAYMENT',
    'CHECKIN',
    'CERTIFICATE_DOWNLOAD',
    'SOCIAL_SHARE'
  ],
  
  // Configurações de atribuição
  ATTRIBUTION_WINDOW: 30 * 24 * 60 * 60 * 1000, // 30 dias
  FIRST_CLICK_ATTRIBUTION: true,
  LAST_CLICK_ATTRIBUTION: true,
  LINEAR_ATTRIBUTION: false
};

// Configurações de Performance
export const PERFORMANCE_CONFIG = {
  // Cache
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos
  MAX_CACHE_SIZE: 100, // 100 itens
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: 100, // 100 requests por janela
  
  // Paginação
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Timeouts
  REQUEST_TIMEOUT: 30 * 1000, // 30 segundos
  DATABASE_TIMEOUT: 10 * 1000 // 10 segundos
};

// Configurações de Segurança
export const SECURITY_CONFIG = {
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: '7d',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  // Rate Limiting
  ENABLE_RATE_LIMITING: true,
  
  // Validação de entrada
  ENABLE_INPUT_VALIDATION: true,
  SANITIZE_INPUTS: true,
  
  // Headers de segurança
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
};

// Configurações de Notificações
export const NOTIFICATION_CONFIG = {
  // Email
  EMAIL_ENABLED: true,
  EMAIL_TEMPLATES_PATH: '/templates/emails',
  
  // WhatsApp
  WHATSAPP_ENABLED: !!process.env.WHATSAPP_TOKEN,
  
  // Push
  PUSH_ENABLED: true,
  PUSH_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  
  // In-app
  IN_APP_ENABLED: true,
  IN_APP_RETENTION_DAYS: 30
};

// Configurações de Logs
export const LOGGING_CONFIG = {
  LEVEL: process.env.LOG_LEVEL || 'info',
  ENABLE_FILE_LOGGING: false,
  ENABLE_CONSOLE_LOGGING: true,
  LOG_FORMAT: 'json',
  
  // Logs específicos
  ANALYTICS_LOGGING: true,
  CRM_LOGGING: true,
  AFFILIATE_LOGGING: true,
  I18N_LOGGING: false,
  
  // Retenção
  LOG_RETENTION_DAYS: 90
};

// Configurações de Monitoramento
export const MONITORING_CONFIG = {
  ENABLE_HEALTH_CHECKS: true,
  HEALTH_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutos
  
  // Métricas
  ENABLE_METRICS: true,
  METRICS_INTERVAL: 60 * 1000, // 1 minuto
  
  // Alertas
  ENABLE_ALERTS: false,
  ALERT_EMAIL: process.env.ALERT_EMAIL,
  
  // Performance
  ENABLE_PERFORMANCE_MONITORING: true,
  SLOW_QUERY_THRESHOLD: 1000 // 1 segundo
};

// Configurações de Backup
export const BACKUP_CONFIG = {
  ENABLE_AUTO_BACKUP: false,
  BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
  
  // Retenção
  BACKUP_RETENTION_DAYS: 30,
  MAX_BACKUP_SIZE: '1GB',
  
  // Localização
  BACKUP_PATH: './backups',
  
  // Compressão
  COMPRESS_BACKUPS: true,
  COMPRESSION_LEVEL: 6
};

// Configurações de Desenvolvimento
export const DEVELOPMENT_CONFIG = {
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_HOT_RELOAD: process.env.NODE_ENV === 'development',
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
  
  // Testes
  ENABLE_TESTS: true,
  TEST_COVERAGE_THRESHOLD: 80,
  
  // Linting
  ENABLE_LINTING: true,
  LINT_ON_SAVE: true,
  
  // TypeScript
  STRICT_MODE: true,
  NO_IMPLICIT_ANY: true
};

// Configuração principal
export const CONFIG = {
  VERSION,
  ANALYTICS: ANALYTICS_CONFIG,
  CRM: CRM_CONFIG,
  AFFILIATE: AFFILIATE_CONFIG,
  I18N: I18N_CONFIG,
  CONVERSION: CONVERSION_CONFIG,
  PERFORMANCE: PERFORMANCE_CONFIG,
  SECURITY: SECURITY_CONFIG,
  NOTIFICATION: NOTIFICATION_CONFIG,
  LOGGING: LOGGING_CONFIG,
  MONITORING: MONITORING_CONFIG,
  BACKUP: BACKUP_CONFIG,
  DEVELOPMENT: DEVELOPMENT_CONFIG
};

export default CONFIG;
