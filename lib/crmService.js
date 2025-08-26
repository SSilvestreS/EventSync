import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

class CRMService {
  constructor() {
    this.integrations = this.initializeIntegrations();
  }

  // Inicializa integrações com CRMs externos
  initializeIntegrations() {
    return {
      hubspot: {
        apiKey: process.env.HUBSPOT_API_KEY,
        baseUrl: 'https://api.hubapi.com',
        enabled: !!process.env.HUBSPOT_API_KEY
      },
      salesforce: {
        clientId: process.env.SALESFORCE_CLIENT_ID,
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
        username: process.env.SALESFORCE_USERNAME,
        password: process.env.SALESFORCE_PASSWORD,
        baseUrl: process.env.SALESFORCE_BASE_URL,
        enabled: !!process.env.SALESFORCE_CLIENT_ID
      },
      pipedrive: {
        apiKey: process.env.PIPEDRIVE_API_KEY,
        baseUrl: 'https://api.pipedrive.com/v1',
        enabled: !!process.env.PIPEDRIVE_API_KEY
      },
      zapier: {
        webhookUrl: process.env.ZAPIER_WEBHOOK_URL,
        enabled: !!process.env.ZAPIER_WEBHOOK_URL
      }
    };
  }

  // Cria ou atualiza contato no CRM
  async createOrUpdateContact(userId, crmSystem = 'HUBSPOT') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          registrations: {
            include: {
              event: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verifica se já existe contato no CRM
      let crmContact = await prisma.cRMContact.findFirst({
        where: {
          userId,
          crmSystem
        }
      });

      if (!crmContact) {
        // Cria novo contato
        crmContact = await prisma.cRMContact.create({
          data: {
            userId,
            crmSystem,
            status: 'LEAD',
            score: this.calculateLeadScore(user),
            source: 'WEBSITE',
            tags: ['event_registration'],
            notes: `Usuário registrado em ${user.registrations.length} eventos`
          }
        });
      }

      // Sincroniza com CRM externo
      const externalContact = await this.syncWithExternalCRM(user, crmSystem);

      if (externalContact) {
        // Atualiza contato local com ID externo
        await prisma.cRMContact.update({
          where: { id: crmContact.id },
          data: {
            crmId: externalContact.id,
            lastContact: new Date(),
            score: externalContact.score || crmContact.score
          }
        });
      }

      return crmContact;
    } catch (error) {
      console.error('Erro ao criar/atualizar contato no CRM:', error);
      throw error;
    }
  }

  // Calcula score do lead baseado em atividades
  calculateLeadScore(user) {
    let score = 0;

    // Score por registros em eventos
    score += user.registrations.length * 10;

    // Score por eventos pagos
    const paidRegistrations = user.registrations.filter(r => 
      r.payment && r.payment.status === 'COMPLETED'
    );
    score += paidRegistrations.length * 20;

    // Score por atividade recente
    const lastActivity = user.updatedAt;
    const daysSinceActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceActivity <= 7) score += 30;
    else if (daysSinceActivity <= 30) score += 20;
    else if (daysSinceActivity <= 90) score += 10;

    return Math.min(score, 100); // Máximo 100
  }

  // Sincroniza com CRM externo
  async syncWithExternalCRM(user, crmSystem) {
    try {
      switch (crmSystem) {
        case 'HUBSPOT':
          return await this.syncWithHubSpot(user);
        case 'SALESFORCE':
          return await this.syncWithSalesforce(user);
        case 'PIPEDRIVE':
          return await this.syncWithPipedrive(user);
        case 'ZAPIER':
          return await this.syncWithZapier(user);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Erro ao sincronizar com ${crmSystem}:`, error);
      return null;
    }
  }

  // Sincronização com HubSpot
  async syncWithHubSpot(user) {
    if (!this.integrations.hubspot.enabled) {
      return null;
    }

    try {
      const contactData = {
        properties: {
          email: user.email,
          firstname: user.name.split(' ')[0],
          lastname: user.name.split(' ').slice(1).join(' '),
          phone: user.phone || '',
          company: user.company || '',
          lifecyclestage: 'lead',
          lead_status: 'new',
          notes: `Usuário registrado em ${user.registrations.length} eventos`
        }
      };

      // Verifica se contato já existe
      const existingContact = await axios.get(
        `${this.integrations.hubspot.baseUrl}/crm/v3/objects/contacts/search`,
        {
          headers: {
            'Authorization': `Bearer ${this.integrations.hubspot.apiKey}`,
            'Content-Type': 'application/json'
          },
          data: {
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: user.email
              }]
            }]
          }
        }
      );

      let contact;
      if (existingContact.data.results.length > 0) {
        // Atualiza contato existente
        const contactId = existingContact.data.results[0].id;
        contact = await axios.patch(
          `${this.integrations.hubspot.baseUrl}/crm/v3/objects/contacts/${contactId}`,
          contactData,
          {
            headers: {
              'Authorization': `Bearer ${this.integrations.hubspot.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Cria novo contato
        contact = await axios.post(
          `${this.integrations.hubspot.baseUrl}/crm/v3/objects/contacts`,
          contactData,
          {
            headers: {
              'Authorization': `Bearer ${this.integrations.hubspot.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      return {
        id: contact.data.id,
        score: this.calculateLeadScore(user)
      };
    } catch (error) {
      console.error('Erro ao sincronizar com HubSpot:', error);
      return null;
    }
  }

  // Sincronização com Salesforce
  async syncWithSalesforce(user) {
    if (!this.integrations.salesforce.enabled) {
      return null;
    }

    try {
      // Obtém token de acesso
      const tokenResponse = await axios.post(
        `${this.integrations.salesforce.baseUrl}/services/oauth2/token`,
        new URLSearchParams({
          grant_type: 'password',
          client_id: this.integrations.salesforce.clientId,
          client_secret: this.integrations.salesforce.clientSecret,
          username: this.integrations.salesforce.username,
          password: this.integrations.salesforce.password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const leadData = {
        Email: user.email,
        FirstName: user.name.split(' ')[0],
        LastName: user.name.split(' ').slice(1).join(' '),
        Phone: user.phone || '',
        Company: user.company || 'Individual',
        LeadSource: 'Website',
        Description: `Usuário registrado em ${user.registrations.length} eventos`
      };

      // Verifica se lead já existe
      const existingLead = await axios.get(
        `${this.integrations.salesforce.baseUrl}/services/data/v58.0/query`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          params: {
            q: `SELECT Id FROM Lead WHERE Email = '${user.email}'`
          }
        }
      );

      let lead;
      if (existingLead.data.records.length > 0) {
        // Atualiza lead existente
        const leadId = existingLead.data.records[0].Id;
        lead = await axios.patch(
          `${this.integrations.salesforce.baseUrl}/services/data/v58.0/sobjects/Lead/${leadId}`,
          leadData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Cria novo lead
        lead = await axios.post(
          `${this.integrations.salesforce.baseUrl}/services/data/v58.0/sobjects/Lead`,
          leadData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      return {
        id: lead.data.id,
        score: this.calculateLeadScore(user)
      };
    } catch (error) {
      console.error('Erro ao sincronizar com Salesforce:', error);
      return null;
    }
  }

  // Sincronização com Pipedrive
  async syncWithPipedrive(user) {
    if (!this.integrations.pipedrive.enabled) {
      return null;
    }

    try {
      const personData = {
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        org_name: user.company || 'Individual'
      };

      // Verifica se pessoa já existe
      const existingPerson = await axios.get(
        `${this.integrations.pipedrive.baseUrl}/persons/search`,
        {
          headers: {
            'Authorization': `Bearer ${this.integrations.pipedrive.apiKey}`,
            'Content-Type': 'application/json'
          },
          params: {
            term: user.email
          }
        }
      );

      let person;
      if (existingPerson.data.data && existingPerson.data.data.length > 0) {
        // Atualiza pessoa existente
        const personId = existingPerson.data.data[0].id;
        person = await axios.put(
          `${this.integrations.pipedrive.baseUrl}/persons/${personId}`,
          personData,
          {
            headers: {
              'Authorization': `Bearer ${this.integrations.pipedrive.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Cria nova pessoa
        person = await axios.post(
          `${this.integrations.pipedrive.baseUrl}/persons`,
          personData,
          {
            headers: {
              'Authorization': `Bearer ${this.integrations.pipedrive.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      return {
        id: person.data.data.id,
        score: this.calculateLeadScore(user)
      };
    } catch (error) {
      console.error('Erro ao sincronizar com Pipedrive:', error);
      return null;
    }
  }

  // Sincronização com Zapier
  async syncWithZapier(user) {
    if (!this.integrations.zapier.enabled) {
      return null;
    }

    try {
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        company: user.company || '',
        registrations_count: user.registrations.length,
        created_at: user.createdAt,
        source: 'eventsync'
      };

      await axios.post(this.integrations.zapier.webhookUrl, userData);

      return {
        id: `zapier_${user.id}`,
        score: this.calculateLeadScore(user)
      };
    } catch (error) {
      console.error('Erro ao sincronizar com Zapier:', error);
      return null;
    }
  }

  // Cria lead para evento específico
  async createEventLead(eventId, userId, source = 'WEBSITE') {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId }
      });

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!event || !user) {
        throw new Error('Evento ou usuário não encontrado');
      }

      // Cria ou atualiza contato
      const contact = await this.createOrUpdateContact(userId);

      // Cria lead para o evento
      const lead = await prisma.cRMLead.create({
        data: {
          contactId: contact.id,
          eventId,
          status: 'NEW',
          priority: 'MEDIUM',
          value: event.price || 0,
          source,
          campaign: `Event: ${event.title}`,
          notes: `Lead gerado para evento: ${event.title}`,
          assignedTo: event.organizerId
        }
      });

      return lead;
    } catch (error) {
      console.error('Erro ao criar lead para evento:', error);
      throw error;
    }
  }

  // Registra atividade no CRM
  async logActivity(contactId, type, subject, description, metadata = {}) {
    try {
      const activity = await prisma.cRMActivity.create({
        data: {
          contactId,
          type,
          subject,
          description,
          metadata,
          createdAt: new Date()
        }
      });

      return activity;
    } catch (error) {
      console.error('Erro ao registrar atividade no CRM:', error);
      throw error;
    }
  }

  // Atualiza status do lead
  async updateLeadStatus(leadId, status, notes = null) {
    try {
      const lead = await prisma.cRMLead.update({
        where: { id: leadId },
        data: {
          status,
          notes: notes ? `${lead.notes}\n${new Date().toISOString()}: ${notes}` : lead.notes,
          updatedAt: new Date()
        }
      });

      return lead;
    } catch (error) {
      console.error('Erro ao atualizar status do lead:', error);
      throw error;
    }
  }

  // Gera relatório de CRM
  async generateCRMReport(period = '30d') {
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

      const contacts = await prisma.cRMContact.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        },
        include: {
          leads: true,
          activities: true
        }
      });

      const leads = await prisma.cRMLead.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now
          }
        }
      });

      // Calcula métricas
      const totalContacts = contacts.length;
      const totalLeads = leads.length;
      const convertedLeads = leads.filter(l => l.status === 'CLOSED_WON').length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Agrupa por status
      const leadStatusBreakdown = {};
      leads.forEach(lead => {
        leadStatusBreakdown[lead.status] = (leadStatusBreakdown[lead.status] || 0) + 1;
      });

      // Agrupa por prioridade
      const priorityBreakdown = {};
      leads.forEach(lead => {
        priorityBreakdown[lead.priority] = (priorityBreakdown[lead.priority] || 0) + 1;
      });

      return {
        period,
        metrics: {
          totalContacts,
          totalLeads,
          convertedLeads,
          conversionRate: Math.round(conversionRate * 100) / 100
        },
        leadStatusBreakdown,
        priorityBreakdown,
        topSources: this.getTopSources(leads),
        dailyStats: this.getDailyStats(leads, startDate, now)
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de CRM:', error);
      throw error;
    }
  }

  // Obtém principais fontes de leads
  getTopSources(leads) {
    const sources = {};
    leads.forEach(lead => {
      sources[lead.source] = (sources[lead.source] || 0) + 1;
    });

    return Object.entries(sources)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));
  }

  // Obtém estatísticas diárias
  getDailyStats(leads, startDate, endDate) {
    const dailyStats = {};
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().split('T')[0];
      dailyStats[date] = {
        leads: 0,
        conversions: 0
      };
    }

    leads.forEach(lead => {
      const date = lead.createdAt.toISOString().split('T')[0];
      if (dailyStats[date]) {
        dailyStats[date].leads++;
        if (lead.status === 'CLOSED_WON') {
          dailyStats[date].conversions++;
        }
      }
    });

    return dailyStats;
  }

  // Sincroniza todos os contatos com CRMs externos
  async syncAllContacts() {
    try {
      const contacts = await prisma.cRMContact.findMany({
        include: {
          user: true
        }
      });

      const results = {
        total: contacts.length,
        synced: 0,
        errors: 0,
        details: []
      };

      for (const contact of contacts) {
        try {
          await this.syncWithExternalCRM(contact.user, contact.crmSystem);
          results.synced++;
          results.details.push({
            contactId: contact.id,
            status: 'success',
            crmSystem: contact.crmSystem
          });
        } catch (error) {
          results.errors++;
          results.details.push({
            contactId: contact.id,
            status: 'error',
            crmSystem: contact.crmSystem,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Erro ao sincronizar todos os contatos:', error);
      throw error;
    }
  }
}

export default new CRMService();
