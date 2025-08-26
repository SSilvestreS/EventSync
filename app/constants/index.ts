// Constantes principais do EventSync

// Configurações da aplicação
export const APP_CONFIG = {
  NAME: 'EventSync',
  VERSION: '1.3.0',
  DESCRIPTION: 'Plataforma completa para gerenciamento de eventos',
  AUTHOR: 'EventSync Team',
  WEBSITE: 'https://eventsync.com',
  SUPPORT_EMAIL: 'support@eventsync.com'
} as const;

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const;

// Configurações de cache
export const CACHE = {
  TTL: {
    SHORT: 5 * 60 * 1000, // 5 minutos
    MEDIUM: 30 * 60 * 1000, // 30 minutos
    LONG: 2 * 60 * 60 * 1000, // 2 horas
    DAY: 24 * 60 * 60 * 1000 // 24 horas
  },
  KEYS: {
    USER: 'user',
    EVENT: 'event',
    ANALYTICS: 'analytics',
    SETTINGS: 'settings'
  }
} as const;

// Configurações de upload
export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  IMAGE_QUALITY: 0.8,
  THUMBNAIL_SIZE: { width: 300, height: 300 }
} as const;

// Configurações de validação
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE: {
    PATTERN: /^\+?[\d\s\-\(\)]+$/
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  }
} as const;

// Configurações de notificações
export const NOTIFICATIONS = {
  TYPES: {
    EMAIL: 'email',
    PUSH: 'push',
    SMS: 'sms',
    WHATSAPP: 'whatsapp'
  },
  PRIORITIES: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
  },
  REMINDER_TIMES: {
    EVENT_24H: 24 * 60 * 60 * 1000, // 24 horas
    EVENT_2H: 2 * 60 * 60 * 1000, // 2 horas
    EVENT_30MIN: 30 * 60 * 1000 // 30 minutos
  }
} as const;

// Configurações de eventos
export const EVENTS = {
  STATUS: {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
  },
  VISIBILITY: {
    PUBLIC: 'public',
    PRIVATE: 'private',
    INVITE_ONLY: 'invite_only'
  },
  CATEGORIES: [
    'Tecnologia',
    'Negócios',
    'Educação',
    'Saúde',
    'Arte e Cultura',
    'Esportes',
    'Música',
    'Comida e Bebida',
    'Networking',
    'Outros'
  ]
} as const;

// Configurações de pagamento
export const PAYMENTS = {
  CURRENCIES: ['BRL', 'USD', 'EUR'],
  METHODS: {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PIX: 'pix',
    BANK_TRANSFER: 'bank_transfer',
    CASH: 'cash'
  },
  STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  }
} as const;

// Configurações de analytics
export const ANALYTICS = {
  TRACKING_EVENTS: {
    PAGE_VIEW: 'page_view',
    EVENT_VIEW: 'event_view',
    REGISTRATION: 'registration',
    PAYMENT: 'payment',
    SHARE: 'share',
    CLICK: 'click'
  },
  METRICS: {
    VIEWS: 'views',
    REGISTRATIONS: 'registrations',
    REVENUE: 'revenue',
    CONVERSION_RATE: 'conversion_rate',
    BOUNCE_RATE: 'bounce_rate'
  }
} as const;

// Configurações de CRM
export const CRM = {
  PROVIDERS: {
    HUBSPOT: 'hubspot',
    SALESFORCE: 'salesforce',
    PIPEDRIVE: 'pipedrive',
    ZAPIER: 'zapier'
  },
  LEAD_SCORING: {
    MIN_SCORE: 0,
    MAX_SCORE: 100,
    THRESHOLDS: {
      HOT: 80,
      WARM: 50,
      COLD: 20
    }
  }
} as const;

// Configurações de afiliados
export const AFFILIATES = {
  COMMISSION_RATES: {
    DEFAULT: 0.10, // 10%
    PREMIUM: 0.15, // 15%
    VIP: 0.20 // 20%
  },
  MIN_PAYOUT: 50.00, // R$ 50,00
  PAYOUT_SCHEDULE: 'monthly'
} as const;

// Configurações de internacionalização
export const I18N = {
  DEFAULT_LOCALE: 'pt-BR',
  SUPPORTED_LOCALES: ['pt-BR', 'en-US', 'es-ES'],
  FALLBACK_LOCALE: 'pt-BR',
  DATE_FORMATS: {
    'pt-BR': 'dd/MM/yyyy',
    'en-US': 'MM/dd/yyyy',
    'es-ES': 'dd/MM/yyyy'
  },
  TIME_FORMATS: {
    'pt-BR': 'HH:mm',
    'en-US': 'hh:mm a',
    'es-ES': 'HH:mm'
  }
} as const;

// Configurações de segurança
export const SECURITY = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  PASSWORD_EXPIRY: 90 * 24 * 60 * 60 * 1000, // 90 dias
  JWT_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY: '30d'
} as const;

// Configurações de API
export const API = {
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutos
    MAX_REQUESTS: 100
  },
  TIMEOUT: 30000, // 30 segundos
  VERSION: 'v1',
  ENDPOINTS: {
    AUTH: '/api/auth',
    EVENTS: '/api/events',
    USERS: '/api/users',
    ANALYTICS: '/api/analytics',
    CRM: '/api/crm',
    AFFILIATES: '/api/affiliates',
    NOTIFICATIONS: '/api/notifications'
  }
} as const;

// Configurações de erro
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

// Configurações de log
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
} as const;

// Configurações de tema
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

// Configurações de responsividade
export const BREAKPOINTS = {
  XS: 480,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// Configurações de performance
export const PERFORMANCE = {
  LAZY_LOADING_THRESHOLD: 0.1,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  CACHE_STRATEGY: 'stale-while-revalidate'
} as const;
