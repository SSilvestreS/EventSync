// Configurações para o sistema de notificações
const NOTIFICATION_CONFIG = {
  // Configurações VAPID para notificações push
  VAPID: {
    PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'your_vapid_public_key_here',
    PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || 'your_vapid_private_key_here',
    EMAIL: process.env.VAPID_EMAIL || 'contato@eventsync.com'
  },

  // Configurações de email
  EMAIL: {
    FROM: process.env.SMTP_FROM || 'noreply@eventsync.com',
    REPLY_TO: process.env.SMTP_REPLY_TO || 'contato@eventsync.com',
    SUBJECT_PREFIX: process.env.EMAIL_SUBJECT_PREFIX || '[EventSync]'
  },

  // Configurações de lembretes
  REMINDERS: {
    ENABLED: process.env.REMINDERS_ENABLED !== 'false',
    TIMES: {
      '24h': 24 * 60 * 60 * 1000, // 24 horas em ms
      '2h': 2 * 60 * 60 * 1000,   // 2 horas em ms
      '30min': 30 * 60 * 1000      // 30 minutos em ms
    },
    MAX_RETRIES: parseInt(process.env.REMINDER_MAX_RETRIES) || 3,
    RETRY_DELAY: parseInt(process.env.REMINDER_RETRY_DELAY) || 5000 // 5 segundos
  },

  // Configurações de notificações push
  PUSH: {
    ENABLED: process.env.PUSH_NOTIFICATIONS_ENABLED !== 'false',
    ICON: process.env.PUSH_ICON_URL || '/icon-192x192.png',
    BADGE: process.env.PUSH_BADGE_URL || '/badge-72x72.png',
    TTL: parseInt(process.env.PUSH_TTL) || 86400, // 24 horas
    URGENCY: process.env.PUSH_URGENCY || 'normal', // 'very-low', 'low', 'normal', 'high'
    VIBRATE: process.env.PUSH_VIBRATE === 'true' ? [200, 100, 200] : undefined
  },

  // Configurações de WhatsApp (futuro)
  WHATSAPP: {
    ENABLED: process.env.WHATSAPP_NOTIFICATIONS_ENABLED === 'true',
    API_URL: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0',
    ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || '',
    PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN || ''
  },

  // Configurações de SMS (futuro)
  SMS: {
    ENABLED: process.env.SMS_NOTIFICATIONS_ENABLED === 'true',
    PROVIDER: process.env.SMS_PROVIDER || 'twilio',
    TWILIO: {
      ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
      AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
      FROM_NUMBER: process.env.TWILIO_FROM_NUMBER || ''
    }
  },

  // Configurações de horário silencioso
  QUIET_HOURS: {
    ENABLED: process.env.QUIET_HOURS_ENABLED === 'true',
    DEFAULT_START: process.env.QUIET_HOURS_START || '22:00',
    DEFAULT_END: process.env.QUIET_HOURS_END || '08:00',
    TIMEZONE: process.env.QUIET_HOURS_TIMEZONE || 'America/Sao_Paulo'
  },

  // Configurações de templates
  TEMPLATES: {
    DEFAULT_LANGUAGE: process.env.DEFAULT_EMAIL_LANGUAGE || 'pt-BR',
    SUPPORTED_LANGUAGES: ['pt-BR', 'en-US', 'es-ES'],
    CUSTOM_TEMPLATES_PATH: process.env.CUSTOM_TEMPLATES_PATH || './templates'
  },

  // Configurações de rate limiting
  RATE_LIMITING: {
    ENABLED: process.env.RATE_LIMITING_ENABLED !== 'false',
    MAX_EMAILS_PER_HOUR: parseInt(process.env.MAX_EMAILS_PER_HOUR) || 100,
    MAX_PUSH_PER_HOUR: parseInt(process.env.MAX_PUSH_PER_HOUR) || 1000,
    MAX_SMS_PER_HOUR: parseInt(process.env.MAX_SMS_PER_HOUR) || 50
  },

  // Configurações de retry e fallback
  RETRY: {
    MAX_ATTEMPTS: parseInt(process.env.NOTIFICATION_MAX_RETRIES) || 3,
    DELAY_BETWEEN_ATTEMPTS: parseInt(process.env.NOTIFICATION_RETRY_DELAY) || 5000,
    EXPONENTIAL_BACKOFF: process.env.NOTIFICATION_EXPONENTIAL_BACKOFF === 'true'
  },

  // Configurações de logging
  LOGGING: {
    ENABLED: process.env.NOTIFICATION_LOGGING_ENABLED !== 'false',
    LEVEL: process.env.NOTIFICATION_LOG_LEVEL || 'info',
    SAVE_FAILED: process.env.SAVE_FAILED_NOTIFICATIONS === 'true',
    MAX_LOG_AGE: parseInt(process.env.NOTIFICATION_MAX_LOG_AGE) || 90 // dias
  },

  // Configurações de segurança
  SECURITY: {
    VALIDATE_ORIGIN: process.env.VALIDATE_NOTIFICATION_ORIGIN === 'true',
    ALLOWED_ORIGINS: process.env.ALLOWED_NOTIFICATION_ORIGINS?.split(',') || ['https://eventsync.com'],
    ENCRYPT_PAYLOAD: process.env.ENCRYPT_NOTIFICATION_PAYLOAD === 'true',
    SIGN_NOTIFICATIONS: process.env.SIGN_NOTIFICATIONS === 'true'
  }
};

// Configurações específicas por ambiente
const ENV_CONFIG = {
  development: {
    ...NOTIFICATION_CONFIG,
    LOGGING: { ...NOTIFICATION_CONFIG.LOGGING, LEVEL: 'debug' },
    RETRY: { ...NOTIFICATION_CONFIG.RETRY, MAX_ATTEMPTS: 1 }
  },
  production: {
    ...NOTIFICATION_CONFIG,
    LOGGING: { ...NOTIFICATION_CONFIG.LOGGING, LEVEL: 'warn' },
    SECURITY: { ...NOTIFICATION_CONFIG.SECURITY, VALIDATE_ORIGIN: true }
  },
  test: {
    ...NOTIFICATION_CONFIG,
    PUSH: { ...NOTIFICATION_CONFIG.PUSH, ENABLED: false },
    EMAIL: { ...NOTIFICATION_CONFIG.EMAIL, FROM: 'test@eventsync.com' }
  }
};

// Função para obter configuração baseada no ambiente
function getConfig() {
  const env = process.env.NODE_ENV || 'development';
  return ENV_CONFIG[env] || NOTIFICATION_CONFIG;
}

// Função para validar configuração
function validateConfig(config) {
  const required = [
    'VAPID.PUBLIC_KEY',
    'VAPID.PRIVATE_KEY',
    'VAPID.EMAIL'
  ];

  const errors = [];
  
  for (const path of required) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], config);
    if (!value || value === 'your_vapid_public_key_here') {
      errors.push(`Configuração obrigatória ausente: ${path}`);
    }
  }

  if (errors.length > 0) {
    console.warn('⚠️ Configurações de notificação incompletas:', errors);
    return false;
  }

  return true;
}

module.exports = {
  NOTIFICATION_CONFIG,
  getConfig,
  validateConfig
};
