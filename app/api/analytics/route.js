import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import analyticsService from '../../../lib/analyticsService';

// GET /api/analytics - Obtém relatório de analytics
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const period = searchParams.get('period') || '30d';
    const type = searchParams.get('type') || 'event';

    let report;

    if (type === 'event' && eventId) {
      report = await analyticsService.generateEventReport(eventId, period);
    } else if (type === 'user') {
      report = await analyticsService.generateUserReport(session.user.id, period);
    } else {
      return NextResponse.json({ error: 'Tipo de relatório inválido' }, { status: 400 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Erro ao gerar relatório de analytics:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Registra ação do usuário
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { action, eventId, metadata } = body;

    if (!action) {
      return NextResponse.json({ error: 'Ação é obrigatória' }, { status: 400 });
    }

    const analytics = await analyticsService.trackUserAction(
      session.user.id,
      action,
      {
        eventId,
        ...metadata,
        timestamp: new Date().toISOString()
      }
    );

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Erro ao registrar ação de analytics:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
