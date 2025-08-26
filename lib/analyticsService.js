import { PrismaClient } from '@prisma/client';
import mixpanel from 'mixpanel-browser';
import posthog from 'posthog-js';
import amplitude from 'amplitude-js';

const prisma = new PrismaClient();

class AnalyticsService {
  constructor() {
    this.initializeTracking();
  }

  // Inicializa os serviços de tracking
  initializeTracking() {
    // Mixpanel
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
    }

    // PostHog
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
      });
    }

    // Amplitude
    if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      amplitude.getInstance().init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
    }
  }

  // Track de eventos do usuário
  async trackUserAction(userId, action, metadata = {}) {
    try {
      // Salva no banco de dados
      const analytics = await prisma.userAnalytics.create({
        data: {
          userId,
          action,
          metadata,
          timestamp: new Date(),
          sessionId: metadata.sessionId,
          pageUrl: metadata.pageUrl,
          timeOnPage: metadata.timeOnPage,
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
          referrer: metadata.referrer,
          utmSource: metadata.utmSource,
          utmMedium: metadata.utmMedium,
          utmCampaign: metadata.utmCampaign,
          utmTerm: metadata.utmTerm,
          utmContent: metadata.utmContent
        }
      });

      // Envia para serviços externos
      this.sendToExternalServices(userId, action, metadata);

      return analytics;
    } catch (error) {
      console.error('Erro ao trackear ação do usuário:', error);
      throw error;
    }
  }

  // Envia dados para serviços externos
  sendToExternalServices(userId, action, metadata) {
    const eventData = {
      distinct_id: userId,
      action,
      ...metadata,
      timestamp: new Date().toISOString()
    };

    // Mixpanel
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      mixpanel.track(action, eventData);
    }

    // PostHog
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture(action, eventData);
    }

    // Amplitude
    if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      amplitude.getInstance().logEvent(action, eventData);
    }
  }

  // Track de visualização de evento
  async trackEventView(eventId, userId = null, metadata = {}) {
    try {
      // Atualiza analytics do evento
      await prisma.eventAnalytics.upsert({
        where: { eventId },
        update: {
          totalViews: { increment: 1 },
          uniqueViews: { increment: 1 },
          lastUpdated: new Date()
        },
        create: {
          eventId,
          totalViews: 1,
          uniqueViews: 1,
          lastUpdated: new Date()
        }
      });

      // Track da ação do usuário
      if (userId) {
        await this.trackUserAction(userId, 'EVENT_VIEW', {
          eventId,
          ...metadata
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao trackear visualização do evento:', error);
      throw error;
    }
  }

  // Track de inscrição em evento
  async trackEventRegistration(eventId, userId, metadata = {}) {
    try {
      // Atualiza analytics do evento
      await prisma.eventAnalytics.upsert({
        where: { eventId },
        update: {
          totalRegistrations: { increment: 1 },
          lastUpdated: new Date()
        },
        create: {
          eventId,
          totalRegistrations: 1,
          lastUpdated: new Date()
        }
      });

      // Track da ação do usuário
      await this.trackUserAction(userId, 'EVENT_REGISTRATION', {
        eventId,
        ...metadata
      });

      return true;
    } catch (error) {
      console.error('Erro ao trackear inscrição no evento:', error);
      throw error;
    }
  }

  // Track de conversão (pagamento)
  async trackConversion(eventId, userId, amount, metadata = {}) {
    try {
      // Atualiza analytics do evento
      await prisma.eventAnalytics.upsert({
        where: { eventId },
        update: {
          totalRevenue: { increment: amount },
          lastUpdated: new Date()
        },
        create: {
          eventId,
          totalRevenue: amount,
          lastUpdated: new Date()
        }
      });

      // Salva tracking de conversão
      await prisma.conversionTracking.create({
        data: {
          eventId,
          userId,
          conversionType: 'PAYMENT',
          conversionValue: amount,
          source: metadata.source,
          medium: metadata.medium,
          campaign: metadata.campaign,
          term: metadata.term,
          content: metadata.content,
          landingPage: metadata.landingPage,
          sessionId: metadata.sessionId,
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent
        }
      });

      // Track da ação do usuário
      await this.trackUserAction(userId, 'PAYMENT_SUCCESS', {
        eventId,
        amount,
        ...metadata
      });

      return true;
    } catch (error) {
      console.error('Erro ao trackear conversão:', error);
      throw error;
    }
  }

  // Gera relatórios de analytics
  async generateEventReport(eventId, period = '30d') {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          analytics: true,
          registrations: {
            include: {
              payment: true
            }
          }
        }
      });

      if (!event) {
        throw new Error('Evento não encontrado');
      }

      const analytics = event.analytics[0] || {};
      const registrations = event.registrations;
      const payments = registrations
        .map(r => r.payment)
        .filter(p => p && p.status === 'COMPLETED');

      // Calcula métricas
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const conversionRate = registrations.length > 0 ? 
        (payments.length / registrations.length) * 100 : 0;

      // Gera estatísticas por período
      const stats = await this.generatePeriodStats(eventId, period);

      return {
        eventId,
        eventTitle: event.title,
        period,
        metrics: {
          totalViews: analytics.totalViews || 0,
          uniqueViews: analytics.uniqueViews || 0,
          totalRegistrations: registrations.length,
          totalRevenue,
          conversionRate: Math.round(conversionRate * 100) / 100,
          averageSessionTime: analytics.averageSessionTime || 0,
          bounceRate: analytics.bounceRate || 0
        },
        stats,
        topReferrers: analytics.topReferrers || [],
        topDevices: analytics.topDevices || [],
        topBrowsers: analytics.topBrowsers || [],
        topCountries: analytics.topCountries || []
      };
    } catch (error) {
      console.error('Erro ao gerar relatório do evento:', error);
      throw error;
    }
  }

  // Gera estatísticas por período
  async generatePeriodStats(eventId, period) {
    const now = new Date();
    let startDate;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    try {
      const analytics = await prisma.userAnalytics.findMany({
        where: {
          eventId,
          timestamp: {
            gte: startDate,
            lte: now
          }
        },
        orderBy: {
          timestamp: 'asc'
        }
      });

      // Agrupa por dia
      const dailyStats = {};
      analytics.forEach(record => {
        const date = record.timestamp.toISOString().split('T')[0];
        if (!dailyStats[date]) {
          dailyStats[date] = {
            views: 0,
            registrations: 0,
            revenue: 0
          };
        }

        if (record.action === 'EVENT_VIEW') {
          dailyStats[date].views++;
        } else if (record.action === 'EVENT_REGISTRATION') {
          dailyStats[date].registrations++;
        }
      });

      return dailyStats;
    } catch (error) {
      console.error('Erro ao gerar estatísticas por período:', error);
      return {};
    }
  }

  // Gera relatório de usuário
  async generateUserReport(userId, period = '30d') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          analytics: true,
          registrations: {
            include: {
              event: true,
              payment: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const analytics = user.analytics;
      const registrations = user.registrations;
      const payments = registrations
        .map(r => r.payment)
        .filter(p => p && p.status === 'COMPLETED');

      // Agrupa ações por tipo
      const actionCounts = {};
      analytics.forEach(record => {
        actionCounts[record.action] = (actionCounts[record.action] || 0) + 1;
      });

      // Calcula métricas
      const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
      const averageOrderValue = payments.length > 0 ? totalSpent / payments.length : 0;

      return {
        userId,
        userName: user.name,
        period,
        metrics: {
          totalActions: analytics.length,
          totalRegistrations: registrations.length,
          totalSpent,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
          lastActivity: analytics.length > 0 ? 
            Math.max(...analytics.map(a => a.timestamp.getTime())) : null
        },
        actionBreakdown: actionCounts,
        topEvents: registrations
          .map(r => ({
            eventId: r.eventId,
            eventTitle: r.event.title,
            registeredAt: r.registeredAt,
            status: r.status
          }))
          .sort((a, b) => b.registeredAt - a.registeredAt)
          .slice(0, 5)
      };
    } catch (error) {
      console.error('Erro ao gerar relatório do usuário:', error);
      throw error;
    }
  }

  // Exporta dados de analytics
  async exportAnalyticsData(eventId = null, startDate = null, endDate = null) {
    try {
      const where = {};
      
      if (eventId) {
        where.eventId = eventId;
      }
      
      if (startDate && endDate) {
        where.timestamp = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }

      const analytics = await prisma.userAnalytics.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          event: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      return analytics.map(record => ({
        id: record.id,
        userId: record.userId,
        userName: record.user.name,
        userEmail: record.user.email,
        eventId: record.eventId,
        eventTitle: record.event?.title,
        action: record.action,
        metadata: record.metadata,
        timestamp: record.timestamp,
        ipAddress: record.ipAddress,
        userAgent: record.userAgent,
        referrer: record.referrer,
        utmSource: record.utmSource,
        utmMedium: record.utmMedium,
        utmCampaign: record.utmCampaign,
        utmTerm: record.utmTerm,
        utmContent: record.utmContent,
        sessionId: record.sessionId,
        pageUrl: record.pageUrl,
        timeOnPage: record.timeOnPage
      }));
    } catch (error) {
      console.error('Erro ao exportar dados de analytics:', error);
      throw error;
    }
  }

  // Limpa dados antigos de analytics
  async cleanupOldAnalytics(daysToKeep = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const deletedCount = await prisma.userAnalytics.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      console.log(`Limpeza de analytics concluída. ${deletedCount.count} registros removidos.`);
      return deletedCount.count;
    } catch (error) {
      console.error('Erro ao limpar analytics antigos:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();
