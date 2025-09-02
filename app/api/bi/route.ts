import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schemas de validação
const BIQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  }).optional(),
  metrics: z.array(z.string()).optional(),
  dimensions: z.array(z.string()).optional(),
  filters: z.record(z.any()).optional()
});

const ReportSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  organizationId: z.string().uuid(),
  type: z.enum(['executive', 'operational', 'financial', 'custom']),
  config: z.record(z.any()),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
    time: z.string(),
    recipients: z.array(z.string().email())
  }).optional()
});

// Simulação de dados de BI
const biMetrics = {
  revenue: {
    total: 1250000,
    growth: 15.5,
    monthly: [
      { month: 'Jan', value: 95000 },
      { month: 'Feb', value: 110000 },
      { month: 'Mar', value: 125000 },
      { month: 'Apr', value: 140000 },
      { month: 'May', value: 160000 },
      { month: 'Jun', value: 180000 }
    ]
  },
  users: {
    total: 25000,
    growth: 12.3,
    active: 18500,
    new: 3200,
    churn: 3.2
  },
  events: {
    total: 1250,
    growth: 8.7,
    completed: 1100,
    upcoming: 150,
    cancelled: 25
  },
  conversion: {
    rate: 24.5,
    funnel: [
      { stage: 'Visitors', count: 10000, rate: 100 },
      { stage: 'Registered', count: 3500, rate: 35 },
      { stage: 'Interested', count: 2100, rate: 21 },
      { stage: 'Converted', count: 2450, rate: 24.5 }
    ]
  },
  performance: {
    avgResponseTime: 45,
    uptime: 99.9,
    errorRate: 0.1,
    throughput: 2400
  }
};

const executiveReports = [
  {
    id: '1',
    name: 'Executive Dashboard',
    type: 'executive',
    organizationId: '1',
    lastGenerated: '2024-03-15T14:30:00Z',
    metrics: ['revenue', 'users', 'events', 'conversion'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Operational Report',
    type: 'operational',
    organizationId: '1',
    lastGenerated: '2024-03-15T14:25:00Z',
    metrics: ['performance', 'events', 'users'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Financial Summary',
    type: 'financial',
    organizationId: '1',
    lastGenerated: '2024-03-15T14:20:00Z',
    metrics: ['revenue', 'conversion'],
    status: 'active'
  }
];

// GET /api/bi - Obter métricas de BI
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const type = searchParams.get('type');
    const reportId = searchParams.get('reportId');

    if (reportId) {
      const report = executiveReports.find(r => r.id === reportId);
      if (!report) {
        return NextResponse.json(
          { success: false, error: 'Relatório não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { report, metrics: biMetrics }
      });
    }

    if (type === 'reports') {
      const filteredReports = organizationId 
        ? executiveReports.filter(r => r.organizationId === organizationId)
        : executiveReports;

      return NextResponse.json({
        success: true,
        data: filteredReports,
        meta: {
          total: filteredReports.length,
          active: filteredReports.filter(r => r.status === 'active').length
        }
      });
    }

    const filteredMetrics = organizationId ? {
      ...biMetrics,
      revenue: {
        ...biMetrics.revenue,
        total: biMetrics.revenue.total * 0.6
      }
    } : biMetrics;

    return NextResponse.json({
      success: true,
      data: filteredMetrics,
      meta: {
        generatedAt: new Date().toISOString(),
        organizationId: organizationId || 'all'
      }
    });
  } catch (error) {
    console.error('BI GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter dados de BI' },
      { status: 500 }
    );
  }
}

// POST /api/bi - Criar relatório personalizado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ReportSchema.parse(body);

    const newReport = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      lastGenerated: null,
      status: 'active'
    };

    executiveReports.push(newReport);

    return NextResponse.json({
      success: true,
      data: newReport,
      message: 'Relatório criado com sucesso'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('BI POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar relatório' },
      { status: 500 }
    );
  }
}

// PUT /api/bi - Atualizar relatório
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do relatório é obrigatório' },
        { status: 400 }
      );
    }

    const reportIndex = executiveReports.findIndex(report => report.id === id);
    if (reportIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar relatório
    executiveReports[reportIndex] = {
      ...executiveReports[reportIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: executiveReports[reportIndex],
      message: 'Relatório atualizado com sucesso'
    });
  } catch (error) {
    console.error('BI PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar relatório' },
      { status: 500 }
    );
  }
}

// DELETE /api/bi - Remover relatório
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do relatório é obrigatório' },
        { status: 400 }
      );
    }

    const reportIndex = executiveReports.findIndex(report => report.id === id);
    if (reportIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    // Remover relatório
    executiveReports.splice(reportIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Relatório removido com sucesso'
    });
  } catch (error) {
    console.error('BI DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao remover relatório' },
      { status: 500 }
    );
  }
}
