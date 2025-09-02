import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schemas de validação
const SSOConfigSchema = z.object({
  provider: z.enum(['saml', 'oauth', 'ldap', 'azure-ad', 'google-workspace', 'okta']),
  name: z.string().min(1),
  domain: z.string().email().optional(),
  metadata: z.record(z.any()),
  isActive: z.boolean().default(true),
  organizationId: z.string().uuid()
});

const SSOUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  organizationId: z.string().uuid(),
  roles: z.array(z.string()),
  attributes: z.record(z.any()).optional()
});

// Simulação de dados
const ssoConfigurations = [
  {
    id: '1',
    provider: 'azure-ad',
    name: 'Microsoft Azure AD',
    domain: 'techcorp.com',
    isActive: true,
    organizationId: '1',
    metadata: {
      tenantId: '12345678-1234-1234-1234-123456789012',
      clientId: '87654321-4321-4321-4321-210987654321',
      redirectUri: 'https://eventsync.com/auth/azure/callback'
    },
    createdAt: '2024-01-15T10:00:00Z',
    lastSync: '2024-03-15T14:30:00Z'
  },
  {
    id: '2',
    provider: 'google-workspace',
    name: 'Google Workspace',
    domain: 'globalevents.com',
    isActive: true,
    organizationId: '2',
    metadata: {
      clientId: 'google-client-id-123',
      clientSecret: 'google-client-secret-456',
      redirectUri: 'https://eventsync.com/auth/google/callback'
    },
    createdAt: '2024-02-20T09:00:00Z',
    lastSync: '2024-03-15T14:25:00Z'
  }
];

const ssoUsers = [
  {
    id: '1',
    email: 'john.doe@techcorp.com',
    firstName: 'John',
    lastName: 'Doe',
    organizationId: '1',
    roles: ['admin', 'organizer'],
    lastLogin: '2024-03-15T14:30:00Z',
    isActive: true
  },
  {
    id: '2',
    email: 'jane.smith@globalevents.com',
    firstName: 'Jane',
    lastName: 'Smith',
    organizationId: '2',
    roles: ['organizer'],
    lastLogin: '2024-03-15T14:25:00Z',
    isActive: true
  }
];

// GET /api/sso - Listar configurações SSO
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const provider = searchParams.get('provider');

    const filteredConfigs = ssoConfigurations.filter(config => {
      const matchesOrganization = !organizationId || config.organizationId === organizationId;
      const matchesProvider = !provider || config.provider === provider;
      return matchesOrganization && matchesProvider;
    });

    return NextResponse.json({
      success: true,
      data: filteredConfigs,
      meta: {
        total: filteredConfigs.length,
        active: filteredConfigs.filter(c => c.isActive).length
      }
    });
  } catch (error) {
    console.error('SSO GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar configurações SSO' },
      { status: 500 }
    );
  }
}

// POST /api/sso - Criar nova configuração SSO
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = SSOConfigSchema.parse(body);

    const newConfig = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      lastSync: null
    };

    ssoConfigurations.push(newConfig);

    return NextResponse.json({
      success: true,
      data: newConfig,
      message: 'Configuração SSO criada com sucesso'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('SSO POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar configuração SSO' },
      { status: 500 }
    );
  }
}

// PUT /api/sso - Atualizar configuração SSO
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da configuração é obrigatório' },
        { status: 400 }
      );
    }

    const configIndex = ssoConfigurations.findIndex(config => config.id === id);
    if (configIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Configuração SSO não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar configuração
    ssoConfigurations[configIndex] = {
      ...ssoConfigurations[configIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: ssoConfigurations[configIndex],
      message: 'Configuração SSO atualizada com sucesso'
    });
  } catch (error) {
    console.error('SSO PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar configuração SSO' },
      { status: 500 }
    );
  }
}

// DELETE /api/sso - Remover configuração SSO
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da configuração é obrigatório' },
        { status: 400 }
      );
    }

    const configIndex = ssoConfigurations.findIndex(config => config.id === id);
    if (configIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Configuração SSO não encontrada' },
        { status: 404 }
      );
    }

    // Remover configuração
    ssoConfigurations.splice(configIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Configuração SSO removida com sucesso'
    });
  } catch (error) {
    console.error('SSO DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao remover configuração SSO' },
      { status: 500 }
    );
  }
}
