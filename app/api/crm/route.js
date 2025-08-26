import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import crmService from '../../../lib/crmService';

// GET /api/crm - Obtém relatório de CRM
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admins e organizadores podem acessar relatórios de CRM
    if (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    const report = await crmService.generateCRMReport(period);

    return NextResponse.json(report);
  } catch (error) {
    console.error('Erro ao gerar relatório de CRM:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/crm - Cria ou atualiza contato no CRM
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, crmSystem, eventId, source } = body;

    let result;

    if (eventId && source) {
      // Cria lead para evento específico
      result = await crmService.createEventLead(eventId, userId || session.user.id, source);
    } else {
      // Cria ou atualiza contato
      result = await crmService.createOrUpdateContact(
        userId || session.user.id,
        crmSystem || 'HUBSPOT'
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao criar/atualizar contato no CRM:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
