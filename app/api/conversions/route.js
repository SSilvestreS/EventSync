import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import analyticsService from '../../../lib/analyticsService';

// GET /api/conversions - Obtém dados de conversão
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admins e organizadores podem acessar dados de conversão
    if (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const period = searchParams.get('period') || '30d';

    // Por enquanto, retorna dados básicos
    // Implementar busca real de conversões
    return NextResponse.json({
      eventId,
      period,
      conversions: [],
      totalConversions: 0,
      totalValue: 0
    });
  } catch (error) {
    console.error('Erro ao obter dados de conversão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/conversions - Registra nova conversão
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, amount, source, medium, campaign, term, content, landingPage } = body;

    if (!eventId || !amount) {
      return NextResponse.json({ error: 'ID do evento e valor são obrigatórios' }, { status: 400 });
    }

    // Registra conversão usando o serviço de analytics
    await analyticsService.trackConversion(
      eventId,
      session.user.id,
      amount,
      {
        source,
        medium,
        campaign,
        term,
        content,
        landingPage,
        sessionId: body.sessionId,
        ipAddress: body.ipAddress,
        userAgent: body.userAgent
      }
    );

    return NextResponse.json({ success: true, message: 'Conversão registrada com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar conversão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
