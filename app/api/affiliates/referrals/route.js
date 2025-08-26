import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import affiliateService from '../../../../lib/affiliateService';

// GET /api/affiliates/referrals - Obtém referências de afiliados
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const affiliateId = searchParams.get('affiliateId');
    const status = searchParams.get('status');

    // Apenas o próprio afiliado ou admin pode ver suas referências
    if (session.user.role !== 'ADMIN' && session.user.id !== affiliateId) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Implementar busca de referências por afiliado
    // Por enquanto, retorna lista vazia
    return NextResponse.json({ referrals: [] });
  } catch (error) {
    console.error('Erro ao obter referências:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/affiliates/referrals - Registra nova referência
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { affiliateCode, eventId } = body;

    if (!affiliateCode) {
      return NextResponse.json({ error: 'Código de afiliado é obrigatório' }, { status: 400 });
    }

    const referral = await affiliateService.registerReferral(
      affiliateCode,
      session.user.id,
      eventId
    );

    return NextResponse.json(referral);
  } catch (error) {
    console.error('Erro ao registrar referência:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/affiliates/referrals - Atualiza status da referência
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admins podem atualizar status de referências
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    const { referralId, action, notes } = body;

    if (!referralId || !action) {
      return NextResponse.json({ error: 'ID da referência e ação são obrigatórios' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'approve':
        result = await affiliateService.approveReferral(referralId, notes);
        break;
      case 'processPayment':
        result = await affiliateService.processCommissionPayment(referralId);
        break;
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao atualizar referência:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
