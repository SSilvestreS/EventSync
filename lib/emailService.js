import nodemailer from 'nodemailer';

// Configuração do transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verificar conexão
export async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('Servidor de email configurado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro na configuração do email:', error);
    return false;
  }
}

// Templates de email
const emailTemplates = {
  // Confirmação de inscrição
  registrationConfirmed: (userName, eventTitle, eventDate, qrCode) => ({
    subject: `Inscrição Confirmada - ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Inscrição Confirmada!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">EventSync</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Olá, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Sua inscrição para o evento <strong>${eventTitle}</strong> foi confirmada com sucesso!
          </p>
          
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin: 0 0 15px 0;">📅 Detalhes do Evento</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Data:</strong> ${eventDate}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmado</span></p>
          </div>
          
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #333; margin: 0 0 15px 0;">📱 Seu QR Code</h3>
            <p style="color: #666; margin-bottom: 15px;">Apresente este QR Code no check-in do evento:</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 18px; color: #333;">
              ${qrCode}
            </div>
          </div>
          
          <div style="background: #e8f5e8; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">✅ Próximos Passos</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Salve este email para referência</li>
              <li>Apresente o QR Code no check-in</li>
              <li>Chegue com 15 minutos de antecedência</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Em caso de dúvidas, entre em contato conosco.
          </p>
          
          <p style="color: #666; margin-top: 30px;">
            Obrigado por escolher o EventSync! 🚀
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">
            © 2024 EventSync. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `
  }),

  // Lembrete de evento
  eventReminder: (userName, eventTitle, eventDate, eventLocation) => ({
    subject: `Lembrete: ${eventTitle} - Amanhã!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">⏰ Lembrete de Evento</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">EventSync</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Olá, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Este é um lembrete de que o evento <strong>${eventTitle}</strong> acontece <strong>amanhã</strong>!
          </p>
          
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #ff9a9e;">
            <h3 style="color: #333; margin: 0 0 15px 0;">📅 Detalhes do Evento</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Data:</strong> ${eventDate}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Local:</strong> ${eventLocation}</p>
          </div>
          
          <div style="background: #fff3cd; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">⚠️ Não se esqueça!</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Leve seu QR Code (enviado no email de confirmação)</li>
              <li>Chegue com 15 minutos de antecedência</li>
              <li>Traga documentos de identificação se necessário</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Estamos ansiosos para vê-lo no evento!
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">
            © 2024 EventSync. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `
  }),

  // Confirmação de pagamento
  paymentSuccess: (userName, eventTitle, amount, currency) => ({
    subject: `Pagamento Confirmado - ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">💳 Pagamento Confirmado!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">EventSync</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Olá, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Seu pagamento para o evento <strong>${eventTitle}</strong> foi processado com sucesso!
          </p>
          
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin: 0 0 15px 0;">💰 Detalhes do Pagamento</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Valor:</strong> ${currency} ${amount}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmado</span></p>
            <p style="margin: 5px 0; color: #666;"><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div style="background: #e8f5e8; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">✅ Próximos Passos</h3>
            <p style="color: #666; margin: 0;">
              Você receberá um email de confirmação da inscrição em breve com seu QR Code para o evento.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Obrigado por sua confiança! 🚀
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">
            © 2024 EventSync. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `
  }),

  // Falha no pagamento
  paymentFailed: (userName, eventTitle, reason) => ({
    subject: `Falha no Pagamento - ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">❌ Falha no Pagamento</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">EventSync</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Olá, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Infelizmente, houve uma falha no processamento do pagamento para o evento <strong>${eventTitle}</strong>.
          </p>
          
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #333; margin: 0 0 15px 0;">⚠️ Detalhes da Falha</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Motivo:</strong> ${reason}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">Falhou</span></p>
          </div>
          
          <div style="background: #f8d7da; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin: 0 0 10px 0;">🔄 Como Resolver</h3>
            <ul style="color: #721c24; margin: 0; padding-left: 20px;">
              <li>Verifique os dados do cartão de crédito</li>
              <li>Confirme se há saldo disponível</li>
              <li>Tente novamente em alguns minutos</li>
              <li>Entre em contato conosco se o problema persistir</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Sua inscrição ainda está pendente. Após resolver o problema, você poderá tentar o pagamento novamente.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">
            © 2024 EventSync. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `
  })
};

// Funções para enviar emails
export async function sendRegistrationConfirmation(userEmail, userName, eventTitle, eventDate, qrCode) {
  try {
    const template = emailTemplates.registrationConfirmed(userName, eventTitle, eventDate, qrCode);
    
    await transporter.sendMail({
      from: `"EventSync" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: template.subject,
      html: template.html,
    });

    console.log(`Email de confirmação enviado para: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    return false;
  }
}

export async function sendEventReminder(userEmail, userName, eventTitle, eventDate, eventLocation) {
  try {
    const template = emailTemplates.eventReminder(userName, eventTitle, eventDate, eventLocation);
    
    await transporter.sendMail({
      from: `"EventSync" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: template.subject,
      html: template.html,
    });

    console.log(`Lembrete de evento enviado para: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar lembrete de evento:', error);
    return false;
  }
}

export async function sendPaymentSuccess(userEmail, userName, eventTitle, amount, currency) {
  try {
    const template = emailTemplates.paymentSuccess(userName, eventTitle, amount, currency);
    
    await transporter.sendMail({
      from: `"EventSync" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: template.subject,
      html: template.html,
    });

    console.log(`Email de sucesso no pagamento enviado para: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de sucesso no pagamento:', error);
    return false;
  }
}

export async function sendPaymentFailed(userEmail, userName, eventTitle, reason) {
  try {
    const template = emailTemplates.paymentFailed(userName, eventTitle, reason);
    
    await transporter.sendMail({
      from: `"EventSync" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: template.subject,
      html: template.html,
    });

    console.log(`Email de falha no pagamento enviado para: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de falha no pagamento:', error);
    return false;
  }
}

// Função genérica para enviar emails personalizados
export async function sendCustomEmail(to, subject, html, from = null) {
  try {
    await transporter.sendMail({
      from: from || `"EventSync" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email personalizado enviado para: ${to}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email personalizado:', error);
    return false;
  }
}

export default transporter;
