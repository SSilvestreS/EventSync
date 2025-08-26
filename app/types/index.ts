// Tipos principais do EventSync
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  price: number;
  organizerId: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: DiscountType;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum UserRole {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
  AFFILIATE = 'AFFILIATE'
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED'
}

// Tipos para notificações
export interface PushSubscription {
  id: string;
  userId: string;
  subscription: any;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  reminder24h: boolean;
  reminder2h: boolean;
  reminder30min: boolean;
  eventUpdates: boolean;
  paymentConfirmations: boolean;
  marketingEmails: boolean;
  quietHours?: { start: string; end: string };
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para analytics
export interface UserAnalytics {
  id: string;
  userId: string;
  eventViews: number;
  registrations: number;
  totalSpent: number;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventAnalytics {
  id: string;
  eventId: string;
  views: number;
  registrations: number;
  revenue: number;
  conversionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para CRM
export interface CRMContact {
  id: string;
  userId: string;
  externalId: string;
  provider: CRMProvider;
  status: ContactStatus;
  score: number;
  lastContact: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum CRMProvider {
  HUBSPOT = 'HUBSPOT',
  SALESFORCE = 'SALESFORCE',
  PIPEDRIVE = 'PIPEDRIVE',
  ZAPIER = 'ZAPIER'
}

export enum ContactStatus {
  LEAD = 'LEAD',
  PROSPECT = 'PROSPECT',
  CUSTOMER = 'CUSTOMER',
  INACTIVE = 'INACTIVE'
}

// Tipos para sistema de afiliados
export interface Affiliate {
  id: string;
  userId: string;
  code: string;
  commissionRate: number;
  totalEarnings: number;
  status: AffiliateStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum AffiliateStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE'
}

// Tipos para internacionalização
export interface LocaleConfig {
  code: string;
  name: string;
  flag: string;
  rtl: boolean;
}

export interface TranslationData {
  [key: string]: string | TranslationData;
}

// Tipos para configurações
export interface AppConfig {
  environment: string;
  database: DatabaseConfig;
  email: EmailConfig;
  notifications: NotificationConfig;
  analytics: AnalyticsConfig;
  crm: CRMConfig;
  affiliate: AffiliateConfig;
  i18n: I18nConfig;
}

export interface DatabaseConfig {
  url: string;
  type: string;
}

export interface EmailConfig {
  provider: string;
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export interface NotificationConfig {
  vapid: {
    publicKey: string;
    privateKey: string;
  };
  email: EmailConfig;
  push: {
    enabled: boolean;
    ttl: number;
  };
}

export interface AnalyticsConfig {
  mixpanel: {
    token: string;
    enabled: boolean;
  };
  posthog: {
    token: string;
    enabled: boolean;
  };
  amplitude: {
    token: string;
    enabled: boolean;
  };
}

export interface CRMConfig {
  hubspot: {
    apiKey: string;
    enabled: boolean;
  };
  salesforce: {
    clientId: string;
    clientSecret: string;
    enabled: boolean;
  };
  pipedrive: {
    apiKey: string;
    enabled: boolean;
  };
}

export interface AffiliateConfig {
  enabled: boolean;
  defaultCommissionRate: number;
  minPayoutAmount: number;
}

export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale: string;
}

// Tipos para respostas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para formulários
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

// Tipos para componentes UI
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: boolean;
  search?: boolean;
  onRowClick?: (row: T) => void;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// Tipos para hooks
export interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (options?: UseApiOptions) => Promise<void>;
  reset: () => void;
}

// Tipos para utilitários
export interface DateRange {
  start: Date;
  end: Date;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

// Tipos para eventos personalizados
export interface CustomEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

// Tipos para cache
export interface CacheItem<T> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
}

// Tipos para logs
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

// Tipos para métricas
export interface Metric {
  name: string;
  value: number;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  period: string;
  timestamp: Date;
}

// Tipos para webhooks
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: Date;
  signature?: string;
}

// Tipos para auditoria
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Tipos para permissões
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface Role {
  name: string;
  permissions: Permission[];
  description?: string;
}

// Tipos para configurações de usuário
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreference;
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    activityVisibility: 'public' | 'private' | 'friends';
    allowMessages: boolean;
  };
}

// Tipos para relatórios
export interface Report {
  id: string;
  name: string;
  type: 'analytics' | 'financial' | 'user' | 'event' | 'custom';
  parameters: Record<string, any>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextRun: Date;
    lastRun?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para integrações
export interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'email' | 'analytics' | 'crm' | 'social' | 'other';
  provider: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para templates
export interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'whatsapp';
  content: string;
  variables: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para campanhas
export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  targetAudience: {
    segments: string[];
    filters: Record<string, any>;
  };
  content: {
    subject?: string;
    body: string;
    template?: string;
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    timezone: string;
  };
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
