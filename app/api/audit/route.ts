import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schemas de validação
const AuditLogSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  action: z.string().min(1),
  resource: z.string().min(1),
  resourceId: z.string().optional(),
  details: z.record(z.any()).optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  timestamp: z.string().datetime().optional()
});

const ComplianceRuleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  organizationId: z.string().uuid(),
  type: z.enum(['data-retention', 'access-control', 'audit-trail', 'encryption', 'backup']),
  config: z.record(z.any()),
  isActive: z.boolean().default(true)
});

// Simulação de dados de auditoria
const auditLogs = [
  {
    id: '1',
    userId: 'user-1',
    organizationId: 'org-1',
    action: 'CREATE_EVENT',
    resource: 'Event',
    resourceId: 'event-123',
    details: {
      eventName: 'Tech Conference 2024',
      eventType: 'conference',
      location: 'San Francisco'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-03-15T14:30:00Z',
    severity: 'info'
  },
  {
    id: '2',
    userId: 'user-2',
    organizationId: 'org-1',
    action: 'UPDATE_USER_ROLE',
    resource: 'User',
    resourceId: 'user-456',
    details: {
      oldRole: 'participant',
      newRole: 'organizer',
      reason: 'Promotion to event organizer'
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: '2024-03-15T14:25:00Z',
    severity: 'warning'
  },
  {
    id: '3',
    userId: 'user-3',
    organizationId: 'org-2',
    action: 'DELETE_EVENT',
    resource: 'Event',
    resourceId: 'event-789',
    details: {
      eventName: 'Cancelled Workshop',
      reason: 'Low registration numbers'
    },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    timestamp: '2024-03-15T14:20:00Z',
    severity: 'error'
  },
  {
    id: '4',
    userId: 'user-1',
    organizationId: 'org-1',
    action: 'LOGIN',
    resource: 'Authentication',
    details: {
      method: 'SSO',
      provider: 'Azure AD'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-03-15T14:15:00Z',
    severity: 'info'
  },
  {
    id: '5',
    userId: 'user-4',
    organizationId: 'org-1',
    action: 'EXPORT_DATA',
    resource: 'Analytics',
    details: {
      dataType: 'user-analytics',
      recordCount: 1500,
      format: 'CSV'
    },
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-03-15T14:10:00Z',
    severity: 'warning'
  }
];

const complianceRules = [
  {
    id: '1',
    name: 'Data Retention Policy',
    description: 'Automatic deletion of user data after 7 years of inactivity',
    organizationId: 'org-1',
    type: 'data-retention',
    config: {
      retentionPeriod: '7 years',
      autoDelete: true,
      notifyBeforeDeletion: true,
      notificationPeriod: '30 days'
    },
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    lastModified: '2024-03-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Access Control Policy',
    description: 'Role-based access control with minimum privilege principle',
    organizationId: 'org-1',
    type: 'access-control',
    config: {
      requireMFA: true,
      sessionTimeout: '8 hours',
      maxLoginAttempts: 5,
      lockoutDuration: '30 minutes'
    },
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    lastModified: '2024-02-15T14:00:00Z'
  },
  {
    id: '3',
    name: 'Audit Trail Policy',
    description: 'Comprehensive logging of all user actions and system events',
    organizationId: 'org-1',
    type: 'audit-trail',
    config: {
      logLevel: 'detailed',
      retentionPeriod: '10 years',
      realTimeAlerts: true,
      sensitiveDataMasking: true
    },
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    lastModified: '2024-01-20T09:00:00Z'
  },
  {
    id: '4',
    name: 'Encryption Policy',
    description: 'End-to-end encryption for all sensitive data',
    organizationId: 'org-1',
    type: 'encryption',
    config: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      keyRotation: '90 days',
      algorithm: 'AES-256'
    },
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    lastModified: '2024-01-15T08:00:00Z'
  }
];

// GET /api/audit - Obter logs de auditoria
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const severity = searchParams.get('severity');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const filteredLogs = auditLogs.filter(log => {
      const matchesOrganization = !organizationId || log.organizationId === organizationId;
      const matchesUser = !userId || log.userId === userId;
      const matchesAction = !action || log.action.includes(action);
      const matchesResource = !resource || log.resource === resource;
      const matchesSeverity = !severity || log.severity === severity;
      const matchesStartDate = !startDate || log.timestamp >= startDate;
      const matchesEndDate = !endDate || log.timestamp <= endDate;
      
      return matchesOrganization && matchesUser && matchesAction && 
             matchesResource && matchesSeverity && matchesStartDate && matchesEndDate;
    });

    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    const stats = {
      total: filteredLogs.length,
      bySeverity: {
        info: filteredLogs.filter(log => log.severity === 'info').length,
        warning: filteredLogs.filter(log => log.severity === 'warning').length,
        error: filteredLogs.filter(log => log.severity === 'error').length
      },
      byAction: filteredLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byResource: filteredLogs.reduce((acc, log) => {
        acc[log.resource] = (acc[log.resource] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      success: true,
      data: paginatedLogs,
      meta: {
        stats,
        pagination: {
          limit,
          offset,
          total: filteredLogs.length,
          hasMore: offset + limit < filteredLogs.length
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Audit GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter logs de auditoria' },
      { status: 500 }
    );
  }
}

// POST /api/audit - Criar log de auditoria
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = AuditLogSchema.parse(body);

    const newLog = {
      id: Date.now().toString(),
      ...validatedData,
      timestamp: validatedData.timestamp || new Date().toISOString(),
      severity: 'info' // Default severity
    };

    auditLogs.unshift(newLog); // Adicionar no início para manter ordem cronológica

    return NextResponse.json({
      success: true,
      data: newLog,
      message: 'Log de auditoria criado com sucesso'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Audit POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar log de auditoria' },
      { status: 500 }
    );
  }
}

// GET /api/audit/compliance - Obter regras de compliance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const type = searchParams.get('type');

    let filteredRules = complianceRules;

    if (organizationId) {
      filteredRules = filteredRules.filter(rule => rule.organizationId === organizationId);
    }

    if (type) {
      filteredRules = filteredRules.filter(rule => rule.type === type);
    }

    return NextResponse.json({
      success: true,
      data: filteredRules,
      meta: {
        total: filteredRules.length,
        active: filteredRules.filter(rule => rule.isActive).length,
        byType: filteredRules.reduce((acc, rule) => {
          acc[rule.type] = (acc[rule.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    });
  } catch (error) {
    console.error('Compliance GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter regras de compliance' },
      { status: 500 }
    );
  }
}

// POST /api/audit/compliance - Criar regra de compliance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ComplianceRuleSchema.parse(body);

    const newRule = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    complianceRules.push(newRule);

    return NextResponse.json({
      success: true,
      data: newRule,
      message: 'Regra de compliance criada com sucesso'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Compliance POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar regra de compliance' },
      { status: 500 }
    );
  }
}
