import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Salvar subscription de notificação push
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { subscription, endpoint, p256dh, auth } = await request.json();
    
    if (!subscription || !endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Dados de subscription inválidos' }, { status: 400 });
    }

    // Salvar ou atualizar subscription
    const pushSubscription = await prisma.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId: session.user.id,
          endpoint: endpoint
        }
      },
      update: {
        subscription: subscription,
        p256dh: p256dh,
        auth: auth,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        subscription: subscription,
        endpoint: endpoint,
        p256dh: p256dh,
        auth: auth
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription salva com sucesso',
      id: pushSubscription.id 
    });

  } catch (error) {
    console.error('Erro ao salvar subscription:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE - Remover subscription
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint é obrigatório' }, { status: 400 });
    }

    await prisma.pushSubscription.deleteMany({
      where: {
        userId: session.user.id,
        endpoint: endpoint
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription removida com sucesso' 
    });

  } catch (error) {
    console.error('Erro ao remover subscription:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// GET - Listar subscriptions do usuário
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        endpoint: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      subscriptions 
    });

  } catch (error) {
    console.error('Erro ao listar subscriptions:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
