import axios from 'axios';

class WhatsAppService {
  constructor() {
    this.baseURL = process.env.WHATSAPP_API_URL;
    this.token = process.env.WHATSAPP_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  // Enviar mensagem de texto
  async sendTextMessage(phoneNumber, message) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar mensagem de template
  async sendTemplateMessage(phoneNumber, templateName, languageCode = 'pt_BR', components = []) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode
            },
            components
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      console.error('Erro ao enviar template WhatsApp:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar confirmação de inscrição
  async sendRegistrationConfirmation(phoneNumber, userName, eventTitle, eventDate, qrCodeUrl) {
    const message = `Olá ${userName}! 🎉

Sua inscrição para o evento "${eventTitle}" foi confirmada com sucesso!

📅 Data: ${eventDate}
🎫 QR Code: ${qrCodeUrl}

Apresente este QR Code no dia do evento para fazer o check-in.

Em caso de dúvidas, entre em contato conosco.

Obrigado por participar! 🚀`;

    return this.sendTextMessage(phoneNumber, message);
  }

  // Enviar lembrete de evento
  async sendEventReminder(phoneNumber, userName, eventTitle, eventDate, eventLocation) {
    const message = `Olá ${userName}! ⏰

Lembrete: O evento "${eventTitle}" acontece amanhã!

📅 Data: ${eventDate}
📍 Local: ${eventLocation}

Não se esqueça de levar seu QR Code para o check-in.

Até lá! 🎯`;

    return this.sendTextMessage(phoneNumber, message);
  }

  // Enviar notificação de pagamento
  async sendPaymentNotification(phoneNumber, userName, eventTitle, amount, status) {
    let message = '';
    
    if (status === 'success') {
      message = `Olá ${userName}! ✅

Pagamento confirmado para o evento "${eventTitle}"

💰 Valor: R$ ${amount}
✅ Status: Aprovado

Sua inscrição está confirmada! 🎉

Em breve você receberá o QR Code por email.`;
    } else if (status === 'failed') {
      message = `Olá ${userName}! ❌

Falha no pagamento para o evento "${eventTitle}"

💰 Valor: R$ ${amount}
❌ Status: Falhou

Por favor, tente novamente ou entre em contato conosco para suporte.`;
    }

    return this.sendTextMessage(phoneNumber, message);
  }

  // Enviar mensagem de check-in
  async sendCheckInConfirmation(phoneNumber, userName, eventTitle, checkInTime) {
    const message = `Olá ${userName}! 🎯

Check-in realizado com sucesso!

🎉 Evento: ${eventTitle}
⏰ Horário: ${checkInTime}

Bem-vindo ao evento! Aproveite! 🚀`;

    return this.sendTextMessage(phoneNumber, message);
  }

  // Verificar status da mensagem
  async getMessageStatus(messageId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      return {
        success: true,
        status: response.data.status
      };
    } catch (error) {
      console.error('Erro ao verificar status da mensagem:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar mensagem em massa
  async sendBulkMessage(phoneNumbers, message) {
    const results = [];
    
    for (const phoneNumber of phoneNumbers) {
      const result = await this.sendTextMessage(phoneNumber, message);
      results.push({
        phoneNumber,
        ...result
      });
      
      // Aguardar 1 segundo entre mensagens para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

export default new WhatsAppService();
