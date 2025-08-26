import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import notificationService from '../../../../lib/notificationService';

const prisma = new PrismaClient();

// POST - Enviar notificação para usuários específicos
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admins e organizadores podem enviar notificações
    if (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 });
    }

    const {
      userIds,
      eventId,
      type,
      title,
      message,
      data,
      sendEmail = true,
      sendPush = true
    } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'IDs de usuários são obrigatórios' }, { status: 400 });
    }

    if (!title || !message) {
      return NextResponse.json({ error: 'Título e mensagem são obrigatórios' }, { status: 400 });
    }

    const results = [];

    for (const userId of userIds) {
      try {
        // Verificar se usuário existe
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { notificationPreferences: true }
        });

        if (!user) {
          results.push({ userId, success: false, error: 'Usuário não encontrado' });
          continue;
        }

        // Verificar preferências de notificação
        const preferences = user.notificationPreferences;
        const shouldSendEmail = sendEmail && preferences?.emailNotifications !== false;
        const shouldSendPush = sendPush && preferences?.pushNotifications !== false;

        // Enviar notificação push
        if (shouldSendPush) {
          const pushResult = await notificationService.sendPushToUsers([userId], {
            title,
            body: message,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            data: { eventId, type, ...data }
          });
          results.push({ userId, type: 'PUSH', ...pushResult[0] });
        }

        // Enviar email
        if (shouldSendEmail) {
          const emailResult = await notificationService.sendSmartEmail(userId, type, {
            eventTitle: data?.eventTitle,
            eventDate: data?.eventDate,
            eventLocation: data?.eventLocation,
            ...data
          });
          results.push({ userId, type: 'EMAIL', ...emailResult });
        }

        // Criar notificação no sistema
        await prisma.notification.create({
          data: {
            title,
            message,
            type: type || 'GENERAL',
            userId
          }
        });

      } catch (error) {
        console.error(`Erro ao enviar notificação para usuário ${userId}:`, error);
        results.push({ userId, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = userIds.length;

    return NextResponse.json({ 
      success: true, 
      message: `${successCount}/${totalCount} notificações enviadas com sucesso`,
      results 
    });

  } catch (error) {
    console.error('Erro ao enviar notificações:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// GET - Obter estatísticas de notificações (admin/organizador)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admins e organizadores podem ver estatísticas
    if (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const eventId = searchParams.get('eventId');

    let whereClause = {};
    if (eventId) {
      whereClause.eventId = eventId;
    }

    // Estatísticas de notificações
    const notificationStats = await prisma.notification.groupBy({
      by: ['type'],
      where: whereClause,
      _count: { id: true }
    });

    // Estatísticas de logs de notificação
    const logStats = await prisma.notificationLog.groupBy({
      by: ['type', 'status'],
      where: whereClause,
      _count: { id: true }
    });

    // Estatísticas de preferências
    const preferenceStats = await prisma.notificationPreference.groupBy({
      by: ['emailNotifications', 'pushNotifications'],
      _count: { id: true }
    });

    return NextResponse.json({ 
      success: true, 
      stats: {
        notifications: notificationStats,
        logs: logStats,
        preferences: preferenceStats
      }
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
