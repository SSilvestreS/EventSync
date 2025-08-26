import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obter preferências de notificação do usuário
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId: session.user.id }
    });

    // Se não existir, criar com valores padrão
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: {
          userId: session.user.id,
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          whatsappNotifications: false,
          reminder24h: true,
          reminder2h: true,
          reminder30min: true,
          eventUpdates: true,
          paymentConfirmations: true,
          marketingEmails: false,
          timezone: 'America/Sao_Paulo'
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      preferences 
    });

  } catch (error) {
    console.error('Erro ao obter preferências:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar/atualizar preferências de notificação
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const {
      emailNotifications,
      pushNotifications,
      smsNotifications,
      whatsappNotifications,
      reminder24h,
      reminder2h,
      reminder30min,
      eventUpdates,
      paymentConfirmations,
      marketingEmails,
      quietHours,
      timezone
    } = await request.json();

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: session.user.id },
      update: {
        emailNotifications: emailNotifications ?? true,
        pushNotifications: pushNotifications ?? true,
        smsNotifications: smsNotifications ?? false,
        whatsappNotifications: whatsappNotifications ?? false,
        reminder24h: reminder24h ?? true,
        reminder2h: reminder2h ?? true,
        reminder30min: reminder30min ?? true,
        eventUpdates: eventUpdates ?? true,
        paymentConfirmations: paymentConfirmations ?? true,
        marketingEmails: marketingEmails ?? false,
        quietHours: quietHours,
        timezone: timezone ?? 'America/Sao_Paulo',
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        emailNotifications: emailNotifications ?? true,
        pushNotifications: pushNotifications ?? true,
        smsNotifications: smsNotifications ?? false,
        whatsappNotifications: whatsappNotifications ?? false,
        reminder24h: reminder24h ?? true,
        reminder2h: reminder2h ?? true,
        reminder30min: reminder30min ?? true,
        eventUpdates: eventUpdates ?? true,
        paymentConfirmations: paymentConfirmations ?? true,
        marketingEmails: marketingEmails ?? false,
        quietHours: quietHours,
        timezone: timezone ?? 'America/Sao_Paulo'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Preferências atualizadas com sucesso',
      preferences 
    });

  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PUT - Atualizar preferência específica
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { key, value } = await request.json();
    
    if (!key) {
      return NextResponse.json({ error: 'Chave é obrigatória' }, { status: 400 });
    }

    const updateData = { [key]: value, updatedAt: new Date() };

    const preferences = await prisma.notificationPreference.update({
      where: { userId: session.user.id },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Preferência atualizada com sucesso',
      preferences 
    });

  } catch (error) {
    console.error('Erro ao atualizar preferência:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
