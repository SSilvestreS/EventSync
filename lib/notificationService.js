const webpush = require('web-push');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const { format } = require('date-fns');
const { ptBR, enUS, esES } = require('date-fns/locale');

const prisma = new PrismaClient();

class NotificationService {
  constructor() {
    this.initializeVAPID();
    this.initializeEmailTransporter();
  }

  // Inicializar VAPID para notificações push
  initializeVAPID() {
    const vapidKeys = webpush.generateVAPIDKeys();
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || vapidKeys.publicKey;
    this.vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || vapidKeys.privateKey;
    
    webpush.setVapidDetails(
      'mailto:contato@eventsync.com',
      this.vapidPublicKey,
      this.vapidPrivateKey
    );
  }

  // Inicializar transportador de email
  initializeEmailTransporter() {
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Enviar notificação push
  async sendPushNotification(subscription, payload) {
    try {
      const result = await webpush.sendNotification(subscription, JSON.stringify(payload));
      return { success: true, result };
    } catch (error) {
      console.error('Erro ao enviar notificação push:', error);
      return { success: false, error: error.message };
    }
  }

  // Enviar notificação push para múltiplos usuários
  async sendPushToUsers(userIds, payload) {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: { in: userIds } }
    });

    const results = [];
    for (const subscription of subscriptions) {
      const result = await this.sendPushNotification(
        JSON.parse(subscription.subscription),
        payload
      );
      results.push({ userId: subscription.userId, ...result });
    }

    return results;
  }

  // Enviar email inteligente
  async sendSmartEmail(userId, template, data) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { preferences: true }
      });

      if (!user) throw new Error('Usuário não encontrado');

      const emailContent = this.generateEmailContent(template, data, user);
      const emailSubject = this.generateEmailSubject(template, data);

      const result = await this.emailTransporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: emailSubject,
        html: emailContent
      });

      // Log da notificação
      await this.logNotification(userId, 'EMAIL', template, data, result.messageId);

      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error: error.message };
    }
  }

  // Enviar lembretes inteligentes
  async sendSmartReminders(eventId) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: { include: { user: true } } }
    });

    if (!event) throw new Error('Evento não encontrado');

    const now = new Date();
    const eventDate = new Date(event.startDate);
    const timeDiff = eventDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    // Lembretes baseados no tempo restante
    if (hoursDiff <= 24 && hoursDiff > 23) {
      // 24h antes
      await this.sendReminderBatch(event, '24h', event.registrations);
    } else if (hoursDiff <= 2 && hoursDiff > 1) {
      // 2h antes
      await this.sendReminderBatch(event, '2h', event.registrations);
    } else if (hoursDiff <= 0.5 && hoursDiff > 0) {
      // 30min antes
      await this.sendReminderBatch(event, '30min', event.registrations);
    }
  }

  // Enviar lote de lembretes
  async sendReminderBatch(event, reminderType, registrations) {
    const template = `reminder_${reminderType}`;
    
    for (const registration of registrations) {
      if (registration.status === 'CONFIRMED') {
        // Enviar push notification
        await this.sendPushToUsers([registration.userId], {
          title: `Lembrete: ${event.title}`,
          body: `Evento começa em ${reminderType}`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          data: { eventId: event.id, type: 'reminder' }
        });

        // Enviar email
        await this.sendSmartEmail(registration.userId, template, {
          eventTitle: event.title,
          eventDate: event.startDate,
          eventLocation: event.location,
          reminderType
        });
      }
    }
  }

  // Gerar conteúdo do email
  generateEmailContent(template, data, user) {
    const language = user?.preferences?.language || 'pt';
    const locale = this.getLocale(language);

    switch (template) {
      case 'event_confirmation':
        return this.generateEventConfirmationEmail(data, locale);
      case 'reminder_24h':
        return this.generateReminderEmail(data, locale, '24 horas');
      case 'reminder_2h':
        return this.generateReminderEmail(data, locale, '2 horas');
      case 'reminder_30min':
        return this.generateReminderEmail(data, locale, '30 minutos');
      case 'payment_success':
        return this.generatePaymentSuccessEmail(data, locale);
      case 'event_update':
        return this.generateEventUpdateEmail(data, locale);
      default:
        return this.generateDefaultEmail(data, locale);
    }
  }

  // Gerar assunto do email
  generateEmailSubject(template, data) {
    switch (template) {
      case 'event_confirmation':
        return `✅ Confirmação de Inscrição - ${data.eventTitle}`;
      case 'reminder_24h':
        return `⏰ Lembrete: ${data.eventTitle} amanhã!`;
      case 'reminder_2h':
        return `🚀 ${data.eventTitle} começa em 2 horas!`;
      case 'reminder_30min':
        return `🎯 ÚLTIMA CHANCE: ${data.eventTitle} em 30 minutos!`;
      case 'payment_success':
        return `💳 Pagamento Confirmado - ${data.eventTitle}`;
      case 'event_update':
        return `📢 Atualização Importante - ${data.eventTitle}`;
      default:
        return 'EventSync - Notificação';
    }
  }

  // Obter locale para formatação
  getLocale(language) {
    const locales = { pt: ptBR, en: enUS, es: esES };
    return locales[language] || ptBR;
  }

  // Log de notificações
  async logNotification(userId, type, template, data, messageId) {
    await prisma.notificationLog.create({
      data: {
        userId,
        type,
        template,
        data: JSON.stringify(data),
        messageId,
        sentAt: new Date()
      }
    });
  }

  // Configurar preferências de notificação
  async setNotificationPreferences(userId, preferences) {
    return await prisma.userPreferences.upsert({
      where: { userId },
      update: { notificationPreferences: preferences },
      create: { userId, notificationPreferences: preferences }
    });
  }

  // Obter estatísticas de notificações
  async getNotificationStats(userId, period = '30d') {
    const startDate = this.getStartDate(period);
    
    const stats = await prisma.notificationLog.groupBy({
      by: ['type', 'template'],
      where: {
        userId,
        sentAt: { gte: startDate }
      },
      _count: { id: true }
    });

    return stats;
  }

  // Calcular data de início baseada no período
  getStartDate(period) {
    const now = new Date();
    switch (period) {
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
}

module.exports = new NotificationService();
