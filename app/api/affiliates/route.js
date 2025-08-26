import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import affiliateService from '../../../lib/affiliateService';

// GET /api/affiliates - Obtém relatório de afiliados
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const affiliateId = searchParams.get('affiliateId');

    let report;

    if (affiliateId) {
      // Relatório de afiliado específico
      if (session.user.role !== 'ADMIN' && session.user.id !== affiliateId) {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
      }
      report = await affiliateService.generateAffiliateReport(affiliateId, period);
    } else {
      // Relatório geral (apenas para admins)
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
      }
      report = await affiliateService.generateOverallAffiliateReport(period);
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Erro ao gerar relatório de afiliados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/affiliates - Cria novo afiliado
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, website, socialMedia, commission, paymentInfo, taxInfo } = body;

    // Validações básicas
    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 });
    }

    const affiliate = await affiliateService.createAffiliate(session.user.id, {
      name,
      email,
      phone,
      website,
      socialMedia,
      commission,
      paymentInfo,
      taxInfo
    });

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error('Erro ao criar afiliado:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/affiliates - Atualiza afiliado
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { affiliateId, action, data } = body;

    if (!affiliateId || !action) {
      return NextResponse.json({ error: 'ID do afiliado e ação são obrigatórios' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'activate':
        result = await affiliateService.activateAffiliate(affiliateId);
        break;
      case 'suspend':
        result = await affiliateService.suspendAffiliate(affiliateId, data?.reason);
        break;
      case 'addEvent':
        result = await affiliateService.addEventToAffiliate(affiliateId, data.eventId, data.commission);
        break;
      case 'removeEvent':
        result = await affiliateService.removeEventFromAffiliate(affiliateId, data.eventId);
        break;
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao atualizar afiliado:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
