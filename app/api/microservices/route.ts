import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schemas de validação
const ServiceSchema = z.object({
  name: z.string().min(1),
  version: z.string(),
  port: z.number().min(1000).max(65535),
  healthEndpoint: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  environment: z.enum(['development', 'staging', 'production']),
  replicas: z.number().min(1).default(1),
  resources: z.object({
    cpu: z.string(),
    memory: z.string(),
    storage: z.string().optional()
  }).optional()
});

const ServiceDeploymentSchema = z.object({
  serviceId: z.string(),
  version: z.string(),
  environment: z.enum(['development', 'staging', 'production']),
  replicas: z.number().min(1),
  strategy: z.enum(['rolling', 'blue-green', 'canary']).default('rolling')
});

// Simulação de dados de microserviços
const services = [
  {
    id: '1',
    name: 'auth-service',
    version: '2.1.0',
    port: 3001,
    healthEndpoint: '/health',
    status: 'healthy',
    environment: 'production',
    replicas: 3,
    dependencies: ['user-service', 'notification-service'],
    resources: {
      cpu: '500m',
      memory: '1Gi',
      storage: '10Gi'
    },
    metrics: {
      requestsPerSecond: 1200,
      averageResponseTime: 45,
      errorRate: 0.1,
      uptime: 99.9
    },
    lastDeployment: '2024-03-15T10:00:00Z',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'event-service',
    version: '1.8.2',
    port: 3002,
    healthEndpoint: '/health',
    status: 'healthy',
    environment: 'production',
    replicas: 5,
    dependencies: ['user-service', 'payment-service'],
    resources: {
      cpu: '1000m',
      memory: '2Gi',
      storage: '20Gi'
    },
    metrics: {
      requestsPerSecond: 800,
      averageResponseTime: 65,
      errorRate: 0.05,
      uptime: 99.95
    },
    lastDeployment: '2024-03-14T15:30:00Z',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '3',
    name: 'payment-service',
    version: '1.5.1',
    port: 3003,
    healthEndpoint: '/health',
    status: 'warning',
    environment: 'production',
    replicas: 2,
    dependencies: ['notification-service'],
    resources: {
      cpu: '750m',
      memory: '1.5Gi',
      storage: '15Gi'
    },
    metrics: {
      requestsPerSecond: 400,
      averageResponseTime: 120,
      errorRate: 0.3,
      uptime: 99.8
    },
    lastDeployment: '2024-03-13T12:00:00Z',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '4',
    name: 'analytics-service',
    version: '2.0.0',
    port: 3004,
    healthEndpoint: '/health',
    status: 'healthy',
    environment: 'production',
    replicas: 4,
    dependencies: ['event-service', 'user-service'],
    resources: {
      cpu: '2000m',
      memory: '4Gi',
      storage: '50Gi'
    },
    metrics: {
      requestsPerSecond: 600,
      averageResponseTime: 85,
      errorRate: 0.08,
      uptime: 99.9
    },
    lastDeployment: '2024-03-15T09:15:00Z',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '5',
    name: 'notification-service',
    version: '1.3.4',
    port: 3005,
    healthEndpoint: '/health',
    status: 'healthy',
    environment: 'production',
    replicas: 2,
    dependencies: [],
    resources: {
      cpu: '300m',
      memory: '512Mi',
      storage: '5Gi'
    },
    metrics: {
      requestsPerSecond: 200,
      averageResponseTime: 25,
      errorRate: 0.02,
      uptime: 99.95
    },
    lastDeployment: '2024-03-12T16:45:00Z',
    createdAt: '2024-01-15T08:00:00Z'
  }
];

const deployments = [
  {
    id: '1',
    serviceId: '1',
    version: '2.1.0',
    environment: 'production',
    status: 'completed',
    strategy: 'rolling',
    replicas: 3,
    startedAt: '2024-03-15T10:00:00Z',
    completedAt: '2024-03-15T10:05:00Z',
    duration: 300
  },
  {
    id: '2',
    serviceId: '2',
    version: '1.8.2',
    environment: 'production',
    status: 'completed',
    strategy: 'blue-green',
    replicas: 5,
    startedAt: '2024-03-14T15:30:00Z',
    completedAt: '2024-03-14T15:45:00Z',
    duration: 900
  },
  {
    id: '3',
    serviceId: '4',
    version: '2.0.0',
    environment: 'production',
    status: 'in-progress',
    strategy: 'canary',
    replicas: 4,
    startedAt: '2024-03-15T09:15:00Z',
    completedAt: null,
    duration: null
  }
];

// GET /api/microservices - Listar serviços
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment');
    const status = searchParams.get('status');
    const includeMetrics = searchParams.get('includeMetrics') === 'true';

    const filteredServices = services.filter(service => {
      const matchesEnvironment = !environment || service.environment === environment;
      const matchesStatus = !status || service.status === status;
      return matchesEnvironment && matchesStatus;
    });

    const processedServices = includeMetrics 
      ? filteredServices 
      : filteredServices.map(({ metrics, ...service }) => service);

    const stats = {
      total: services.length,
      healthy: services.filter(s => s.status === 'healthy').length,
      warning: services.filter(s => s.status === 'warning').length,
      error: services.filter(s => s.status === 'error').length,
      totalReplicas: services.reduce((sum, s) => sum + s.replicas, 0),
      averageUptime: services.reduce((sum, s) => sum + s.metrics.uptime, 0) / services.length
    };

    return NextResponse.json({
      success: true,
      data: processedServices,
      meta: {
        stats,
        environment: environment || 'all',
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Microservices GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter dados dos microserviços' },
      { status: 500 }
    );
  }
}

// POST /api/microservices - Criar novo serviço
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ServiceSchema.parse(body);

    const newService = {
      id: Date.now().toString(),
      ...validatedData,
      status: 'healthy',
      metrics: {
        requestsPerSecond: 0,
        averageResponseTime: 0,
        errorRate: 0,
        uptime: 100
      },
      lastDeployment: null,
      createdAt: new Date().toISOString()
    };

    services.push(newService);

    return NextResponse.json({
      success: true,
      data: newService,
      message: 'Serviço criado com sucesso'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Microservices POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar serviço' },
      { status: 500 }
    );
  }
}

// PUT /api/microservices - Atualizar serviço
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do serviço é obrigatório' },
        { status: 400 }
      );
    }

    const serviceIndex = services.findIndex(service => service.id === id);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar serviço
    services[serviceIndex] = {
      ...services[serviceIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: services[serviceIndex],
      message: 'Serviço atualizado com sucesso'
    });
  } catch (error) {
    console.error('Microservices PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar serviço' },
      { status: 500 }
    );
  }
}

// DELETE /api/microservices - Remover serviço
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do serviço é obrigatório' },
        { status: 400 }
      );
    }

    const serviceIndex = services.findIndex(service => service.id === id);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se há dependências
    const hasDependencies = services.some(service => 
      service.dependencies?.includes(services[serviceIndex].name)
    );

    if (hasDependencies) {
      return NextResponse.json(
        { success: false, error: 'Não é possível remover serviço com dependências ativas' },
        { status: 400 }
      );
    }

    // Remover serviço
    services.splice(serviceIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Serviço removido com sucesso'
    });
  } catch (error) {
    console.error('Microservices DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao remover serviço' },
      { status: 500 }
    );
  }
}
