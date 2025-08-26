const { format } = require('date-fns');

class EmailTemplates {
  // Template base com CSS responsivo
  getBaseTemplate(content) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EventSync</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 30px; 
            text-align: center;
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 300;
          }
          .content { 
            padding: 30px; 
            background: white;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #666;
            font-size: 14px;
          }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #667eea; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
            font-weight: 500;
          }
          .event-card { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            border-left: 4px solid #667eea;
          }
          .highlight { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            border-radius: 6px; 
            padding: 15px; 
            margin: 20px 0;
          }
          .urgent { 
            background: #f8d7da; 
            border: 1px solid #f5c6cb; 
            color: #721c24;
            border-radius: 6px; 
            padding: 15px; 
            margin: 20px 0;
          }
          @media (max-width: 600px) {
            .container { margin: 10px; }
            .header h1 { font-size: 24px; }
            .content { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 EventSync</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© 2024 EventSync. Todos os direitos reservados.</p>
            <p>Para suporte, entre em contato: contato@eventsync.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template de confirmação de inscrição
  generateEventConfirmation(data, locale) {
    const content = `
      <h2 style="color: #667eea; margin-bottom: 20px;">✅ Inscrição Confirmada!</h2>
      
      <p>Olá! Sua inscrição foi confirmada com sucesso.</p>
      
      <div class="event-card">
        <h3 style="margin-top: 0; color: #333;">${data.eventTitle}</h3>
        <p><strong>📅 Data:</strong> ${format(new Date(data.eventDate), 'PPP', { locale })}</p>
        <p><strong>🕒 Horário:</strong> ${format(new Date(data.eventDate), 'p', { locale })}</p>
        <p><strong>📍 Local:</strong> ${data.eventLocation}</p>
        <p><strong>🎫 Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmado</span></p>
      </div>
      
      <div class="highlight">
        <p><strong>📱 QR Code:</strong> Apresente o QR Code no dia do evento para fazer check-in.</p>
        <p><strong>📧 Lembretes:</strong> Você receberá lembretes automáticos antes do evento.</p>
      </div>
      
      <a href="${data.eventUrl}" class="button">Ver Detalhes do Evento</a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Se você não puder participar, entre em contato conosco o quanto antes.
      </p>
    `;
    
    return this.getBaseTemplate(content);
  }

  // Template de lembrete
  generateReminder(data, locale, timeLeft) {
    const isUrgent = timeLeft === '30 minutos';
    const urgencyClass = isUrgent ? 'urgent' : 'highlight';
    const urgencyIcon = isUrgent ? '🚨' : '⏰';
    
    const content = `
      <h2 style="color: #667eea; margin-bottom: 20px;">${urgencyIcon} Lembrete do Evento</h2>
      
      <p>Olá! Este é um lembrete sobre seu evento.</p>
      
      <div class="event-card">
        <h3 style="margin-top: 0; color: #333;">${data.eventTitle}</h3>
        <p><strong>📅 Data:</strong> ${format(new Date(data.eventDate), 'PPP', { locale })}</p>
        <p><strong>🕒 Horário:</strong> ${format(new Date(data.eventDate), 'p', { locale })}</p>
        <p><strong>📍 Local:</strong> ${data.eventLocation}</p>
      </div>
      
      <div class="${urgencyClass}">
        <p><strong>${urgencyIcon} O evento começa em ${timeLeft}!</strong></p>
        ${isUrgent ? '<p>Não se esqueça de levar seu QR Code para check-in!</p>' : ''}
      </div>
      
      <a href="${data.eventUrl}" class="button">Ver Detalhes do Evento</a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Chegue com antecedência para garantir uma boa experiência!
      </p>
    `;
    
    return this.getBaseTemplate(content);
  }

  // Template de confirmação de pagamento
  generatePaymentSuccess(data, locale) {
    const content = `
      <h2 style="color: #28a745; margin-bottom: 20px;">💳 Pagamento Confirmado!</h2>
      
      <p>Parabéns! Seu pagamento foi processado com sucesso.</p>
      
      <div class="event-card">
        <h3 style="margin-top: 0; color: #333;">${data.eventTitle}</h3>
        <p><strong>💰 Valor:</strong> ${data.amount}</p>
        <p><strong>📅 Data:</strong> ${format(new Date(data.eventDate), 'PPP', { locale })}</p>
        <p><strong>🎫 Status:</strong> <span style="color: #28a745; font-weight: bold;">Pago</span></p>
      </div>
      
      <div class="highlight">
        <p><strong>✅ Inscrição:</strong> Sua inscrição está confirmada e ativa.</p>
        <p><strong>📱 QR Code:</strong> Você receberá o QR Code por email em breve.</p>
      </div>
      
      <a href="${data.eventUrl}" class="button">Ver Detalhes do Evento</a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Em caso de dúvidas sobre o pagamento, entre em contato conosco.
      </p>
    `;
    
    return this.getBaseTemplate(content);
  }

  // Template de atualização de evento
  generateEventUpdate(data, locale) {
    const content = `
      <h2 style="color: #ffc107; margin-bottom: 20px;">📢 Atualização do Evento</h2>
      
      <p>Olá! Temos uma atualização importante sobre seu evento.</p>
      
      <div class="event-card">
        <h3 style="margin-top: 0; color: #333;">${data.eventTitle}</h3>
        <p><strong>📅 Data:</strong> ${format(new Date(data.eventDate), 'PPP', { locale })}</p>
        <p><strong>📍 Local:</strong> ${data.eventLocation}</p>
      </div>
      
      <div class="highlight">
        <h4 style="margin-top: 0; color: #856404;">🔄 Mudanças Realizadas:</h4>
        <p>${data.changes}</p>
      </div>
      
      <a href="${data.eventUrl}" class="button">Ver Detalhes Atualizados</a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Pedimos desculpas por qualquer inconveniente causado.
      </p>
    `;
    
    return this.getBaseTemplate(content);
  }

  // Template padrão
  generateDefault(data, locale) {
    const content = `
      <h2 style="color: #667eea; margin-bottom: 20px;">📧 Notificação EventSync</h2>
      
      <p>Olá! Você recebeu uma notificação do EventSync.</p>
      
      <div class="event-card">
        <p><strong>Mensagem:</strong> ${data.message || 'Notificação do sistema'}</p>
        ${data.eventTitle ? `<p><strong>Evento:</strong> ${data.eventTitle}</p>` : ''}
      </div>
      
      <a href="${data.actionUrl || '#'}" class="button">Acessar Sistema</a>
    `;
    
    return this.getBaseTemplate(content);
  }
}

module.exports = new EmailTemplates();
