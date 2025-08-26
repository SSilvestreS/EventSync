import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

class AffiliateService {
  constructor() {
    this.defaultCommission = 10.0; // 10% padrão
  }

  // Cria novo afiliado
  async createAffiliate(userId, affiliateData) {
    try {
      // Verifica se usuário já é afiliado
      const existingAffiliate = await prisma.affiliate.findUnique({
        where: { userId }
      });

      if (existingAffiliate) {
        throw new Error('Usuário já é afiliado');
      }

      // Gera código único de afiliado
      const affiliateCode = this.generateAffiliateCode();

      // Cria afiliado
      const affiliate = await prisma.affiliate.create({
        data: {
          userId,
          code: affiliateCode,
          name: affiliateData.name,
          email: affiliateData.email,
          phone: affiliateData.phone,
          website: affiliateData.website,
          socialMedia: affiliateData.socialMedia || {},
          commission: affiliateData.commission || this.defaultCommission,
          status: 'PENDING',
          paymentInfo: affiliateData.paymentInfo || {},
          taxInfo: affiliateData.taxInfo || {}
        }
      });

      // Atualiza usuário com código de afiliado
      await prisma.user.update({
        where: { id: userId },
        data: {
          affiliateCode,
          role: 'AFFILIATE'
        }
      });

      return affiliate;
    } catch (error) {
      console.error('Erro ao criar afiliado:', error);
      throw error;
    }
  }

  // Gera código único de afiliado
  generateAffiliateCode() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `AFF${timestamp}${random}`.toUpperCase();
  }

  // Ativa afiliado
  async activateAffiliate(affiliateId) {
    try {
      const affiliate = await prisma.affiliate.update({
        where: { id: affiliateId },
        data: {
          status: 'ACTIVE',
          updatedAt: new Date()
        }
      });

      return affiliate;
    } catch (error) {
      console.error('Erro ao ativar afiliado:', error);
      throw error;
    }
  }

  // Suspende afiliado
  async suspendAffiliate(affiliateId, reason = '') {
    try {
      const affiliate = await prisma.affiliate.update({
        where: { id: affiliateId },
        data: {
          status: 'SUSPENDED',
          updatedAt: new Date()
        }
      });

      // Log da suspensão
      await this.logAffiliateAction(affiliateId, 'SUSPENDED', {
        reason,
        suspendedAt: new Date()
      });

      return affiliate;
    } catch (error) {
      console.error('Erro ao suspender afiliado:', error);
      throw error;
    }
  }

  // Adiciona evento para afiliado
  async addEventToAffiliate(affiliateId, eventId, commission = null) {
    try {
      const affiliate = await prisma.affiliate.findUnique({
        where: { id: affiliateId }
      });

      if (!affiliate) {
        throw new Error('Afiliado não encontrado');
      }

      if (affiliate.status !== 'ACTIVE') {
        throw new Error('Afiliado não está ativo');
      }

      // Verifica se evento já está associado ao afiliado
      const existingEvent = await prisma.affiliateEvent.findUnique({
        where: {
          affiliateId_eventId: {
            affiliateId,
            eventId
          }
        }
      });

      if (existingEvent) {
        throw new Error('Evento já está associado ao afiliado');
      }

      // Cria associação
      const affiliateEvent = await prisma.affiliateEvent.create({
        data: {
          affiliateId,
          eventId,
          commission: commission || affiliate.commission,
          isActive: true,
          startDate: new Date()
        }
      });

      return affiliateEvent;
    } catch (error) {
      console.error('Erro ao adicionar evento ao afiliado:', error);
      throw error;
    }
  }

  // Remove evento do afiliado
  async removeEventFromAffiliate(affiliateId, eventId) {
    try {
      const affiliateEvent = await prisma.affiliateEvent.update({
        where: {
          affiliateId_eventId: {
            affiliateId,
            eventId
          }
        },
        data: {
          isActive: false,
          endDate: new Date(),
          updatedAt: new Date()
        }
      });

      return affiliateEvent;
    } catch (error) {
      console.error('Erro ao remover evento do afiliado:', error);
      throw error;
    }
  }

  // Registra referência de afiliado
  async registerReferral(affiliateCode, userId, eventId = null) {
    try {
      // Busca afiliado pelo código
      const affiliate = await prisma.affiliate.findUnique({
        where: { code: affiliateCode }
      });

      if (!affiliate) {
        throw new Error('Código de afiliado inválido');
      }

      if (affiliate.status !== 'ACTIVE') {
        throw new Error('Afiliado não está ativo');
      }

      // Verifica se usuário já foi referido
      const existingReferral = await prisma.affiliateReferral.findFirst({
        where: {
          userId,
          affiliateId: affiliate.id
        }
      });

      if (existingReferral) {
        throw new Error('Usuário já foi referido por este afiliado');
      }

      // Calcula comissão
      let commission = affiliate.commission;
      if (eventId) {
        const affiliateEvent = await prisma.affiliateEvent.findUnique({
          where: {
            affiliateId_eventId: {
              affiliateId: affiliate.id,
              eventId
            }
          }
        });

        if (affiliateEvent && affiliateEvent.isActive) {
          commission = affiliateEvent.commission;
        }
      }

      // Cria referência
      const referral = await prisma.affiliateReferral.create({
        data: {
          affiliateId: affiliate.id,
          userId,
          eventId,
          commission,
          status: 'PENDING'
        }
      });

      // Atualiza usuário com referência
      await prisma.user.update({
        where: { id: userId },
        data: {
          referredByUserId: affiliate.userId
        }
      });

      // Log da referência
      await this.logAffiliateAction(affiliate.id, 'REFERRAL_CREATED', {
        referralId: referral.id,
        userId,
        eventId,
        commission
      });

      return referral;
    } catch (error) {
      console.error('Erro ao registrar referência:', error);
      throw error;
    }
  }

  // Aprova referência
  async approveReferral(referralId, notes = '') {
    try {
      const referral = await prisma.affiliateReferral.update({
        where: { id: referralId },
        data: {
          status: 'APPROVED',
          updatedAt: new Date()
        }
      });

      // Log da aprovação
      await this.logAffiliateAction(referral.affiliateId, 'REFERRAL_APPROVED', {
        referralId,
        notes
      });

      return referral;
    } catch (error) {
      console.error('Erro ao aprovar referência:', error);
      throw error;
    }
  }

  // Processa pagamento de comissão
  async processCommissionPayment(referralId) {
    try {
      const referral = await prisma.affiliateReferral.findUnique({
        where: { id: referralId },
        include: {
          affiliate: true
        }
      });

      if (!referral) {
        throw new Error('Referência não encontrada');
      }

      if (referral.status !== 'APPROVED') {
        throw new Error('Referência não está aprovada');
      }

      // Calcula valor da comissão
      let commissionAmount = 0;
      if (referral.eventId) {
        const registration = await prisma.registration.findFirst({
          where: {
            userId: referral.userId,
            eventId: referral.eventId
          },
          include: {
            payment: true
          }
        });

        if (registration && registration.payment && registration.payment.status === 'COMPLETED') {
          commissionAmount = (registration.payment.amount * referral.commission) / 100;
        }
      }

      if (commissionAmount <= 0) {
        throw new Error('Valor da comissão inválido');
      }

      // Cria pagamento
      const payment = await prisma.affiliatePayment.create({
        data: {
          affiliateId: referral.affiliateId,
          amount: commissionAmount,
          currency: 'BRL',
          status: 'PENDING',
          method: 'BANK_TRANSFER',
          reference: `REF_${referralId}`,
          createdAt: new Date()
        }
      });

      // Atualiza referência
      await prisma.affiliateReferral.update({
        where: { id: referralId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Atualiza estatísticas do afiliado
      await prisma.affiliate.update({
        where: { id: referral.affiliateId },
        data: {
          totalEarnings: { increment: commissionAmount },
          totalReferrals: { increment: 1 },
          updatedAt: new Date()
        }
      });

      // Log do pagamento
      await this.logAffiliateAction(referral.affiliateId, 'COMMISSION_PAID', {
        referralId,
        paymentId: payment.id,
        amount: commissionAmount
      });

      return payment;
    } catch (error) {
      console.error('Erro ao processar pagamento de comissão:', error);
      throw error;
    }
  }

  // Gera relatório de afiliado
  async generateAffiliateReport(affiliateId, period = '30d') {
    try {
      const affiliate = await prisma.affiliate.findUnique({
        where: { id: affiliateId },
        include: {
          events: {
            include: {
              event: true
            }
          },
          referrals: true,
          payments: true
        }
      });

      if (!affiliate) {
        throw new Error('Afiliado não encontrado');
      }

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

      // Filtra dados por período
      const periodReferrals = affiliate.referrals.filter(r => 
        r.createdAt >= startDate
      );

      const periodPayments = affiliate.payments.filter(p => 
        p.createdAt >= startDate
      );

      // Calcula métricas
      const totalReferrals = periodReferrals.length;
      const approvedReferrals = periodReferrals.filter(r => r.status === 'APPROVED').length;
      const paidReferrals = periodReferrals.filter(r => r.status === 'PAID').length;
      const totalEarnings = periodPayments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

      const conversionRate = totalReferrals > 0 ? 
        (paidReferrals / totalReferrals) * 100 : 0;

      return {
        affiliateId,
        affiliateName: affiliate.name,
        period,
        metrics: {
          totalReferrals,
          approvedReferrals,
          paidReferrals,
          totalEarnings: Math.round(totalEarnings * 100) / 100,
          conversionRate: Math.round(conversionRate * 100) / 100,
          averageCommission: affiliate.commission
        },
        events: affiliate.events.map(ae => ({
          eventId: ae.eventId,
          eventTitle: ae.event.title,
          commission: ae.commission,
          isActive: ae.isActive
        })),
        topReferrals: periodReferrals
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 10)
          .map(r => ({
            id: r.id,
            userId: r.userId,
            eventId: r.eventId,
            status: r.status,
            commission: r.commission,
            createdAt: r.createdAt
          })),
        paymentHistory: periodPayments
          .sort((a, b) => b.createdAt - a.createdAt)
          .map(p => ({
            id: p.id,
            amount: p.amount,
            status: p.status,
            method: p.method,
            createdAt: p.createdAt,
            paidAt: p.paidAt
          }))
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de afiliado:', error);
      throw error;
    }
  }

  // Gera relatório geral de afiliados
  async generateOverallAffiliateReport(period = '30d') {
    try {
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

      const affiliates = await prisma.affiliate.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        },
        include: {
          referrals: true,
          payments: true
        }
      });

      const referrals = await prisma.affiliateReferral.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        }
      });

      const payments = await prisma.affiliatePayment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        }
      });

      // Calcula métricas gerais
      const totalAffiliates = affiliates.length;
      const activeAffiliates = affiliates.filter(a => a.status === 'ACTIVE').length;
      const totalReferrals = referrals.length;
      const totalEarnings = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

      // Top afiliados por performance
      const topAffiliates = affiliates
        .map(a => {
          const affiliateReferrals = referrals.filter(r => r.affiliateId === a.id);
          const affiliatePayments = payments.filter(p => p.affiliateId === a.id);
          const earnings = affiliatePayments
            .filter(p => p.status === 'COMPLETED')
            .reduce((sum, p) => sum + p.amount, 0);

          return {
            id: a.id,
            name: a.name,
            email: a.email,
            status: a.status,
            totalReferrals: affiliateReferrals.length,
            totalEarnings: earnings,
            conversionRate: affiliateReferrals.length > 0 ? 
              (affiliateReferrals.filter(r => r.status === 'PAID').length / affiliateReferrals.length) * 100 : 0
          };
        })
        .sort((a, b) => b.totalEarnings - a.totalEarnings)
        .slice(0, 10);

      return {
        period,
        metrics: {
          totalAffiliates,
          activeAffiliates,
          totalReferrals,
          totalEarnings: Math.round(totalEarnings * 100) / 100,
          averageEarningsPerAffiliate: totalAffiliates > 0 ? 
            Math.round((totalEarnings / totalAffiliates) * 100) / 100 : 0
        },
        topAffiliates,
        statusBreakdown: {
          ACTIVE: affiliates.filter(a => a.status === 'ACTIVE').length,
          INACTIVE: affiliates.filter(a => a.status === 'INACTIVE').length,
          SUSPENDED: affiliates.filter(a => a.status === 'SUSPENDED').length,
          PENDING: affiliates.filter(a => a.status === 'PENDING').length
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório geral de afiliados:', error);
      throw error;
    }
  }

  // Log de ações do afiliado
  async logAffiliateAction(affiliateId, action, metadata = {}) {
    try {
      // Aqui você pode implementar um sistema de logging mais robusto
      console.log(`Affiliate Action: ${action}`, {
        affiliateId,
        timestamp: new Date().toISOString(),
        metadata
      });

      return true;
    } catch (error) {
      console.error('Erro ao logar ação do afiliado:', error);
      return false;
    }
  }

  // Valida código de afiliado
  async validateAffiliateCode(code) {
    try {
      const affiliate = await prisma.affiliate.findUnique({
        where: { code }
      });

      if (!affiliate) {
        return { valid: false, reason: 'Código inválido' };
      }

      if (affiliate.status !== 'ACTIVE') {
        return { valid: false, reason: 'Afiliado inativo' };
      }

      return { valid: true, affiliate };
    } catch (error) {
      console.error('Erro ao validar código de afiliado:', error);
      return { valid: false, reason: 'Erro interno' };
    }
  }

  // Obtém estatísticas de afiliado
  async getAffiliateStats(affiliateId) {
    try {
      const affiliate = await prisma.affiliate.findUnique({
        where: { id: affiliateId },
        include: {
          referrals: {
            include: {
              user: true
            }
          },
          payments: true
        }
      });

      if (!affiliate) {
        throw new Error('Afiliado não encontrado');
      }

      const totalReferrals = affiliate.referrals.length;
      const pendingReferrals = affiliate.referrals.filter(r => r.status === 'PENDING').length;
      const approvedReferrals = affiliate.referrals.filter(r => r.status === 'APPROVED').length;
      const paidReferrals = affiliate.referrals.filter(r => r.status === 'PAID').length;

      const totalEarnings = affiliate.payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

      const pendingEarnings = affiliate.payments
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        totalReferrals,
        pendingReferrals,
        approvedReferrals,
        paidReferrals,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        pendingEarnings: Math.round(pendingEarnings * 100) / 100,
        conversionRate: totalReferrals > 0 ? 
          Math.round((paidReferrals / totalReferrals) * 100 * 100) / 100 : 0
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas do afiliado:', error);
      throw error;
    }
  }
}

export default new AffiliateService();
