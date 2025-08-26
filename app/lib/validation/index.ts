import { z } from 'zod';
import { createModuleLogger } from '../logger';

// Logger específico para validação
const validationLogger = createModuleLogger('Validation');

// Schemas base reutilizáveis
export const BaseSchemas = {
  // ID (UUID ou string)
  id: z.string().min(1, 'ID é obrigatório'),
  
  // Email
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  
  // Senha
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/\d/, 'Senha deve conter pelo menos um número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial'),
  
  // Nome
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  // Telefone
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Telefone inválido')
    .min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  
  // CPF
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX')
    .refine((cpf) => {
      const cleanCPF = cpf.replace(/\D/g, '');
      if (cleanCPF.length !== 11) return false;
      if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
      
      // Validação do primeiro dígito verificador
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
      }
      let remainder = sum % 11;
      let digit1 = remainder < 2 ? 0 : 11 - remainder;
      
      // Validação do segundo dígito verificador
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
      }
      remainder = sum % 11;
      let digit2 = remainder < 2 ? 0 : 11 - remainder;
      
      return parseInt(cleanCPF.charAt(9)) === digit1 && parseInt(cleanCPF.charAt(10)) === digit2;
    }, 'CPF inválido'),
  
  // CNPJ
  cnpj: z.string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX')
    .refine((cnpj) => {
      const cleanCNPJ = cnpj.replace(/\D/g, '');
      if (cleanCNPJ.length !== 14) return false;
      if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
      
      // Validação do primeiro dígito verificador
      let sum = 0;
      let weight = 5;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanCNPJ.charAt(i)) * weight;
        weight = weight === 2 ? 9 : weight - 1;
      }
      let remainder = sum % 11;
      let digit1 = remainder < 2 ? 0 : 11 - remainder;
      
      // Validação do segundo dígito verificador
      sum = 0;
      weight = 6;
      for (let i = 0; i < 13; i++) {
        sum += parseInt(cleanCNPJ.charAt(i)) * weight;
        weight = weight === 2 ? 9 : weight - 1;
      }
      remainder = sum % 11;
      let digit2 = remainder < 2 ? 0 : 11 - remainder;
      
      return parseInt(cleanCNPJ.charAt(12)) === digit1 && parseInt(cleanCNPJ.charAt(13)) === digit2;
    }, 'CNPJ inválido'),
  
  // Data
  date: z.string().datetime('Data inválida').or(z.date()),
  
  // URL
  url: z.string().url('URL inválida'),
  
  // Preço (número positivo)
  price: z.number().positive('Preço deve ser positivo').min(0, 'Preço deve ser maior ou igual a zero'),
  
  // Quantidade (número inteiro positivo)
  quantity: z.number().int('Quantidade deve ser um número inteiro').positive('Quantidade deve ser positiva'),
  
  // Porcentagem (0-100)
  percentage: z.number().min(0, 'Porcentagem deve ser maior ou igual a 0').max(100, 'Porcentagem deve ser menor ou igual a 100'),
  
  // CEP
  cep: z.string()
    .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato XXXXX-XXX'),
  
  // Endereço
  address: z.object({
    street: z.string().min(1, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    cep: BaseSchemas.cep,
  }),
  
  // Paginação
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
  
  // Filtros
  filters: z.object({
    search: z.string().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    status: z.string().optional(),
    category: z.string().optional(),
  }),
};

// Schemas para usuários
export const UserSchemas = {
  // Criação de usuário
  create: z.object({
    name: BaseSchemas.name,
    email: BaseSchemas.email,
    password: BaseSchemas.password,
    phone: BaseSchemas.phone.optional(),
    cpf: BaseSchemas.cpf.optional(),
    cnpj: BaseSchemas.cnpj.optional(),
    role: z.enum(['USER', 'ORGANIZER', 'ADMIN', 'AFFILIATE']).default('USER'),
    address: BaseSchemas.address.optional(),
    preferences: z.object({
      emailNotifications: z.boolean().default(true),
      pushNotifications: z.boolean().default(true),
      smsNotifications: z.boolean().default(false),
      whatsappNotifications: z.boolean().default(false),
      language: z.string().default('pt-BR'),
      timezone: z.string().default('America/Sao_Paulo'),
    }).optional(),
  }),

  // Atualização de usuário
  update: z.object({
    name: BaseSchemas.name.optional(),
    phone: BaseSchemas.phone.optional(),
    cpf: BaseSchemas.cpf.optional(),
    cnpj: BaseSchemas.cnpj.optional(),
    address: BaseSchemas.address.optional(),
    preferences: z.object({
      emailNotifications: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
      smsNotifications: z.boolean().optional(),
      whatsappNotifications: z.boolean().optional(),
      language: z.string().optional(),
      timezone: z.string().optional(),
    }).optional(),
  }),

  // Login
  login: z.object({
    email: BaseSchemas.email,
    password: z.string().min(1, 'Senha é obrigatória'),
    rememberMe: z.boolean().default(false),
  }),

  // Alteração de senha
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: BaseSchemas.password,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  }),

  // Recuperação de senha
  forgotPassword: z.object({
    email: BaseSchemas.email,
  }),

  // Reset de senha
  resetPassword: z.object({
    token: z.string().min(1, 'Token é obrigatório'),
    newPassword: BaseSchemas.password,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  }),
};

// Schemas para eventos
export const EventSchemas = {
  // Criação de evento
  create: z.object({
    title: z.string()
      .min(3, 'Título deve ter pelo menos 3 caracteres')
      .max(200, 'Título deve ter no máximo 200 caracteres'),
    description: z.string()
      .min(10, 'Descrição deve ter pelo menos 10 caracteres')
      .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),
    date: BaseSchemas.date,
    endDate: BaseSchemas.date.optional(),
    location: z.object({
      address: BaseSchemas.address,
      coordinates: z.object({
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
      }).optional(),
      type: z.enum(['physical', 'virtual', 'hybrid']).default('physical'),
      virtualUrl: BaseSchemas.url.optional(),
      virtualPlatform: z.string().optional(),
    }),
    capacity: BaseSchemas.quantity,
    price: BaseSchemas.price,
    category: z.string().min(1, 'Categoria é obrigatória'),
    tags: z.array(z.string()).max(10, 'Máximo de 10 tags').optional(),
    image: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).default('DRAFT'),
    visibility: z.enum(['public', 'private', 'invite_only']).default('public'),
    organizerId: BaseSchemas.id,
    settings: z.object({
      allowWaitlist: z.boolean().default(true),
      requireApproval: z.boolean().default(false),
      maxRegistrationsPerUser: z.number().int().positive().default(1),
      allowCancellation: z.boolean().default(true),
      cancellationDeadline: z.number().default(24), // horas antes do evento
    }).optional(),
  }),

  // Atualização de evento
  update: z.object({
    title: z.string()
      .min(3, 'Título deve ter pelo menos 3 caracteres')
      .max(200, 'Título deve ter no máximo 200 caracteres')
      .optional(),
    description: z.string()
      .min(10, 'Descrição deve ter pelo menos 10 caracteres')
      .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
      .optional(),
    date: BaseSchemas.date.optional(),
    endDate: BaseSchemas.date.optional(),
    location: z.object({
      address: BaseSchemas.address.optional(),
      coordinates: z.object({
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
      }).optional(),
      type: z.enum(['physical', 'virtual', 'hybrid']).optional(),
      virtualUrl: BaseSchemas.url.optional(),
      virtualPlatform: z.string().optional(),
    }).optional(),
    capacity: BaseSchemas.quantity.optional(),
    price: BaseSchemas.price.optional(),
    category: z.string().min(1, 'Categoria é obrigatória').optional(),
    tags: z.array(z.string()).max(10, 'Máximo de 10 tags').optional(),
    image: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
    visibility: z.enum(['public', 'private', 'invite_only']).optional(),
    settings: z.object({
      allowWaitlist: z.boolean().optional(),
      requireApproval: z.boolean().optional(),
      maxRegistrationsPerUser: z.number().int().positive().optional(),
      allowCancellation: z.boolean().optional(),
      cancellationDeadline: z.number().optional(),
    }).optional(),
  }),

  // Filtros de evento
  filters: BaseSchemas.filters.extend({
    category: z.string().optional(),
    priceRange: z.object({
      min: BaseSchemas.price.optional(),
      max: BaseSchemas.price.optional(),
    }).optional(),
    dateRange: z.object({
      from: BaseSchemas.date.optional(),
      to: BaseSchemas.date.optional(),
    }).optional(),
    location: z.string().optional(),
    organizerId: BaseSchemas.id.optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
    visibility: z.enum(['public', 'private', 'invite_only']).optional(),
  }),
};

// Schemas para inscrições
export const RegistrationSchemas = {
  // Criação de inscrição
  create: z.object({
    eventId: BaseSchemas.id,
    userId: BaseSchemas.id,
    ticketType: z.string().min(1, 'Tipo de ingresso é obrigatório'),
    quantity: BaseSchemas.quantity.default(1),
    personalInfo: z.object({
      name: BaseSchemas.name,
      email: BaseSchemas.email,
      phone: BaseSchemas.phone.optional(),
      cpf: BaseSchemas.cpf.optional(),
      dietaryRestrictions: z.string().optional(),
      accessibilityNeeds: z.string().optional(),
      emergencyContact: z.object({
        name: BaseSchemas.name,
        phone: BaseSchemas.phone,
        relationship: z.string().optional(),
      }).optional(),
    }),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'pix', 'bank_transfer', 'cash']),
    couponCode: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'Você deve concordar com os termos e condições',
    }),
  }),

  // Atualização de inscrição
  update: z.object({
    ticketType: z.string().min(1, 'Tipo de ingresso é obrigatório').optional(),
    quantity: BaseSchemas.quantity.optional(),
    personalInfo: z.object({
      name: BaseSchemas.name.optional(),
      email: BaseSchemas.email.optional(),
      phone: BaseSchemas.phone.optional(),
      cpf: BaseSchemas.cpf.optional(),
      dietaryRestrictions: z.string().optional(),
      accessibilityNeeds: z.string().optional(),
      emergencyContact: z.object({
        name: BaseSchemas.name.optional(),
        phone: BaseSchemas.phone.optional(),
        relationship: z.string().optional(),
      }).optional(),
    }).optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  }),

  // Cancelamento de inscrição
  cancel: z.object({
    reason: z.string().min(1, 'Motivo do cancelamento é obrigatório').max(500, 'Motivo deve ter no máximo 500 caracteres'),
    refundRequest: z.boolean().default(false),
  }),
};

// Schemas para cupons
export const CouponSchemas = {
  // Criação de cupom
  create: z.object({
    code: z.string()
      .min(3, 'Código deve ter pelo menos 3 caracteres')
      .max(20, 'Código deve ter no máximo 20 caracteres')
      .regex(/^[A-Z0-9]+$/, 'Código deve conter apenas letras maiúsculas e números'),
    discount: BaseSchemas.percentage,
    type: z.enum(['PERCENTAGE', 'FIXED']),
    validFrom: BaseSchemas.date,
    validUntil: BaseSchemas.date,
    usageLimit: BaseSchemas.quantity.optional(),
    minOrderValue: BaseSchemas.price.optional(),
    maxDiscountValue: BaseSchemas.price.optional(),
    applicableEvents: z.array(BaseSchemas.id).optional(),
    applicableCategories: z.array(z.string()).optional(),
    userRestrictions: z.object({
      newUsersOnly: z.boolean().default(false),
      existingUsersOnly: z.boolean().default(false),
      specificUsers: z.array(BaseSchemas.id).optional(),
    }).optional(),
  }),

  // Validação de cupom
  validate: z.object({
    code: z.string().min(1, 'Código do cupom é obrigatório'),
    eventId: BaseSchemas.id,
    userId: BaseSchemas.id,
    orderValue: BaseSchemas.price,
  }),
};

// Schemas para pagamentos
export const PaymentSchemas = {
  // Criação de pagamento
  create: z.object({
    registrationId: BaseSchemas.id,
    amount: BaseSchemas.price,
    currency: z.enum(['BRL', 'USD', 'EUR']).default('BRL'),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'pix', 'bank_transfer', 'cash']),
    installments: z.number().int().positive().max(12).default(1),
    billingAddress: BaseSchemas.address.optional(),
    cardInfo: z.object({
      number: z.string().regex(/^\d{16}$/, 'Número do cartão deve ter 16 dígitos').optional(),
      expiryMonth: z.number().int().min(1).max(12).optional(),
      expiryYear: z.number().int().min(new Date().getFullYear()).optional(),
      cvv: z.string().regex(/^\d{3,4}$/, 'CVV deve ter 3 ou 4 dígitos').optional(),
      holderName: z.string().min(1, 'Nome do titular é obrigatório').optional(),
    }).optional(),
  }),

  // Confirmação de pagamento
  confirm: z.object({
    paymentId: BaseSchemas.id,
    transactionId: z.string().min(1, 'ID da transação é obrigatório'),
    status: z.enum(['completed', 'failed', 'cancelled']),
    metadata: z.record(z.any()).optional(),
  }),
};

// Schemas para notificações
export const NotificationSchemas = {
  // Criação de notificação
  create: z.object({
    userId: BaseSchemas.id,
    type: z.enum(['email', 'push', 'sms', 'whatsapp']),
    title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
    message: z.string().min(1, 'Mensagem é obrigatória').max(500, 'Mensagem deve ter no máximo 500 caracteres'),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
    data: z.record(z.any()).optional(),
    scheduledFor: BaseSchemas.date.optional(),
    expiresAt: BaseSchemas.date.optional(),
  }),

  // Preferências de notificação
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    pushNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    whatsappNotifications: z.boolean().default(false),
    reminder24h: z.boolean().default(true),
    reminder2h: z.boolean().default(true),
    reminder30min: z.boolean().default(true),
    eventUpdates: z.boolean().default(true),
    paymentConfirmations: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
    quietHours: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
    }).optional(),
    timezone: z.string().default('America/Sao_Paulo'),
  }),
};

// Schemas para analytics
export const AnalyticsSchemas = {
  // Filtros de analytics
  filters: z.object({
    dateFrom: BaseSchemas.date,
    dateTo: BaseSchemas.date,
    eventId: BaseSchemas.id.optional(),
    userId: BaseSchemas.id.optional(),
    groupBy: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('day'),
    metrics: z.array(z.enum(['views', 'registrations', 'revenue', 'conversion_rate'])).min(1),
  }),

  // Evento de tracking
  track: z.object({
    event: z.string().min(1, 'Nome do evento é obrigatório'),
    userId: BaseSchemas.id.optional(),
    sessionId: z.string().optional(),
    properties: z.record(z.any()).optional(),
    timestamp: BaseSchemas.date.optional(),
  }),
};

// Schemas para CRM
export const CRMSchemas = {
  // Sincronização de contato
  syncContact: z.object({
    userId: BaseSchemas.id,
    provider: z.enum(['hubspot', 'salesforce', 'pipedrive', 'zapier']),
    externalId: z.string().optional(),
    data: z.record(z.any()),
  }),

  // Lead scoring
  leadScore: z.object({
    userId: BaseSchemas.id,
    score: z.number().min(0).max(100),
    factors: z.array(z.object({
      factor: z.string(),
      weight: z.number().min(0).max(100),
      value: z.any(),
    })),
  }),
};

// Schemas para afiliados
export const AffiliateSchemas = {
  // Criação de afiliado
  create: z.object({
    userId: BaseSchemas.id,
    code: z.string()
      .min(3, 'Código deve ter pelo menos 3 caracteres')
      .max(20, 'Código deve ter no máximo 20 caracteres')
      .regex(/^[A-Z0-9]+$/, 'Código deve conter apenas letras maiúsculas e números'),
    commissionRate: BaseSchemas.percentage,
    paymentInfo: z.object({
      bankName: z.string().min(1, 'Nome do banco é obrigatório'),
      agency: z.string().min(1, 'Agência é obrigatória'),
      account: z.string().min(1, 'Conta é obrigatória'),
      accountType: z.enum(['checking', 'savings']).default('checking'),
      cpf: BaseSchemas.cpf,
      accountHolder: BaseSchemas.name,
    }),
  }),

  // Tracking de referência
  trackReferral: z.object({
    affiliateCode: z.string().min(1, 'Código do afiliado é obrigatório'),
    userId: BaseSchemas.id.optional(),
    eventId: BaseSchemas.id.optional(),
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
  }),
};

// Função para validar dados
export function validateData<T>(schema: z.ZodSchema<T>, data: any): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.');
        return path ? `${path}: ${err.message}` : err.message;
      });
      
      validationLogger.warn('Validação falhou', {
        errors,
        data: JSON.stringify(data),
      });
      
      return { success: false, errors };
    }
    
    validationLogger.error('Erro inesperado na validação', {
      error: error instanceof Error ? error.message : String(error),
      data: JSON.stringify(data),
    });
    
    return { success: false, errors: ['Erro interno de validação'] };
  }
}

// Função para validar dados de forma assíncrona
export async function validateDataAsync<T>(schema: z.ZodSchema<T>, data: any): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.');
        return path ? `${path}: ${err.message}` : err.message;
      });
      
      validationLogger.warn('Validação assíncrona falhou', {
        errors,
        data: JSON.stringify(data),
      });
      
      return { success: false, errors };
    }
    
    validationLogger.error('Erro inesperado na validação assíncrona', {
      error: error instanceof Error ? error.message : String(error),
      data: JSON.stringify(data),
    });
    
    return { success: false, errors: ['Erro interno de validação'] };
  }
}

// Função para validar parcialmente (permite campos opcionais)
export function validatePartial<T>(schema: z.ZodSchema<T>, data: any): { success: true; data: Partial<T> } | { success: false; errors: string[] } {
  try {
    const partialSchema = schema.partial();
    const validatedData = partialSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.');
        return path ? `${path}: ${err.message}` : err.message;
      });
      
      validationLogger.warn('Validação parcial falhou', {
        errors,
        data: JSON.stringify(data),
      });
      
      return { success: false, errors };
    }
    
    return { success: false, errors: ['Erro interno de validação'] };
  }
}

// Função para sanitizar dados (remove campos inválidos)
export function sanitizeData<T>(schema: z.ZodSchema<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Remove campos inválidos e tenta novamente
      const sanitizedData = { ...data };
      error.errors.forEach(err => {
        const path = err.path;
        if (path.length > 0) {
          let current = sanitizedData;
          for (let i = 0; i < path.length - 1; i++) {
            if (current && typeof current === 'object' && path[i] in current) {
              current = current[path[i]];
            } else {
              return;
            }
          }
          if (current && typeof current === 'object' && path[path.length - 1] in current) {
            delete current[path[path.length - 1]];
          }
        }
      });
      
      // Tenta validar novamente
      try {
        return schema.parse(sanitizedData);
      } catch {
        // Se ainda falhar, retorna dados limpos
        return schema.parse({});
      }
    }
    
    // Em caso de erro inesperado, retorna dados vazios
    return schema.parse({});
  }
}

// Exporta todos os schemas
export const Schemas = {
  Base: BaseSchemas,
  User: UserSchemas,
  Event: EventSchemas,
  Registration: RegistrationSchemas,
  Coupon: CouponSchemas,
  Payment: PaymentSchemas,
  Notification: NotificationSchemas,
  Analytics: AnalyticsSchemas,
  CRM: CRMSchemas,
  Affiliate: AffiliateSchemas,
};

// Exporta funções de validação
export const Validation = {
  validate: validateData,
  validateAsync: validateDataAsync,
  validatePartial,
  sanitize: sanitizeData,
};

// Exporta o logger
export { validationLogger };
