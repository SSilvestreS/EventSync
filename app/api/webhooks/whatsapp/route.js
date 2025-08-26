import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import WhatsAppService from '../../../../lib/whatsappService';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verificar se é uma mensagem válida
    if (!body.entry || !body.entry[0] || !body.entry[0].changes) {
      return NextResponse.json({ status: 'ok' });
    }

    const change = body.entry[0].changes[0];
    
    if (change.value && change.value.messages) {
      const message = change.value.messages[0];
      const phoneNumber = message.from;
      const messageText = message.text?.body || '';
      const messageType = message.type;

      console.log('Mensagem recebida:', { phoneNumber, messageText, messageType });

      // Processar mensagem com chatbot
      if (messageType === 'text') {
        await processIncomingMessage(phoneNumber, messageText);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Erro no webhook WhatsApp:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

// Verificação do webhook
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

async function processIncomingMessage(phoneNumber, messageText) {
  try {
    const lowerMessage = messageText.toLowerCase();
    
    // Buscar usuário pelo telefone
    const user = await prisma.user.findFirst({
      where: { phone: phoneNumber },
      include: {
        registrations: {
          include: {
            event: true
          }
        }
      }
    });

    let response = '';

    // Comandos do chatbot
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      response = `🤖 *EventSync Bot - Comandos Disponíveis*

📋 *Comandos principais:*
• "eventos" - Listar meus eventos
• "inscrições" - Ver minhas inscrições
• "certificados" - Listar meus certificados
• "suporte" - Falar com atendente
• "status" - Status da minha conta

💡 *Dicas:*
• Digite "eventos" para ver todos os eventos disponíveis
• Use "inscrições" para acompanhar suas participações
• Solicite "certificados" para baixar seus documentos

Precisa de mais ajuda? Digite "suporte" para falar com um atendente.`;

    } else if (lowerMessage.includes('eventos') || lowerMessage.includes('events')) {
      if (user && user.registrations.length > 0) {
        response = `🎯 *Seus Eventos:*

${user.registrations.map(reg => 
  `• *${reg.event.title}*
   📅 ${new Date(reg.event.date).toLocaleDateString('pt-BR')}
   📍 ${reg.event.location || 'Local não informado'}
   ✅ Status: ${reg.status}
   🎫 ID: ${reg.id}`
).join('\n\n')}

Para ver detalhes de um evento específico, digite "evento [ID]".`;
      } else {
        response = `📝 *Eventos Disponíveis:*

Você ainda não se inscreveu em nenhum evento.

Para ver eventos disponíveis, acesse nosso site ou digite "eventos disponíveis".`;
      }

    } else if (lowerMessage.includes('inscrições') || lowerMessage.includes('registrations')) {
      if (user && user.registrations.length > 0) {
        response = `📋 *Suas Inscrições:*

${user.registrations.map(reg => 
  `• *${reg.event.title}*
   📅 Data: ${new Date(reg.event.date).toLocaleDateString('pt-BR')}
   💰 Valor: R$ ${reg.event.price || '0,00'}
   ✅ Status: ${reg.status}
   🎫 ID: ${reg.id}`
).join('\n\n')}

Para cancelar uma inscrição, digite "cancelar [ID]".`;
      } else {
        response = `📝 *Inscrições:*

Você ainda não possui inscrições em eventos.

Para se inscrever, acesse nosso site ou digite "eventos disponíveis".`;
      }

    } else if (lowerMessage.includes('certificados') || lowerMessage.includes('certificates')) {
      if (user) {
        const certificates = await prisma.certificate.findMany({
          where: {
            registration: {
              userId: user.id
            }
          },
          include: {
            registration: {
              include: {
                event: true
              }
            }
          }
        });

        if (certificates.length > 0) {
          response = `🎓 *Seus Certificados:*

${certificates.map(cert => 
  `• *${cert.registration.event.title}*
   📅 Emitido: ${new Date(cert.issuedAt).toLocaleDateString('pt-BR')}
   🔗 Código: ${cert.certificateCode}
   📥 Download: ${process.env.NEXTAUTH_URL}${cert.downloadUrl}`
).join('\n\n')}

Para baixar um certificado, clique no link acima ou acesse nosso site.`;
        } else {
          response = `📝 *Certificados:*

Você ainda não possui certificados emitidos.

Os certificados são gerados automaticamente após a conclusão dos eventos.`;
        }
      }

    } else if (lowerMessage.includes('suporte') || lowerMessage.includes('support')) {
      response = `🆘 *Suporte EventSync*

Para falar com um atendente humano:

📧 Email: suporte@eventsync.com
📱 WhatsApp: +55 (11) 99999-9999
🌐 Site: ${process.env.NEXTAUTH_URL}

⏰ Horário de atendimento:
Segunda a Sexta: 9h às 18h (GMT-3)

Em caso de urgência, envie "URGENTE" + sua mensagem.`;

    } else if (lowerMessage.includes('status') || lowerMessage.includes('account')) {
      if (user) {
        response = `👤 *Status da Conta*

📧 Email: ${user.email}
👤 Nome: ${user.name}
🏢 Empresa: ${user.company || 'Não informado'}
📱 Telefone: ${user.phone || 'Não informado'}
✅ Verificado: ${user.isVerified ? 'Sim' : 'Não'}
📅 Membro desde: ${new Date(user.createdAt).toLocaleDateString('pt-BR')}

🎯 *Estatísticas:*
• Eventos inscritos: ${user.registrations.length}
• Certificados: ${await prisma.certificate.count({
  where: {
    registration: {
      userId: user.id
    }
  }
})}

Para atualizar seus dados, acesse nosso site.`;
      } else {
        response = `❌ *Usuário não encontrado*

Não conseguimos identificar sua conta pelo número de telefone.

Para se cadastrar, acesse nosso site ou entre em contato com suporte.`;
      }

    } else if (lowerMessage.includes('evento ') || lowerMessage.includes('event ')) {
      const eventId = messageText.match(/\d+/)?.[0];
      if (eventId && user) {
        const registration = user.registrations.find(reg => reg.id === eventId);
        if (registration) {
          response = `🎯 *Detalhes do Evento*

📋 *${registration.event.title}*
📅 Data: ${new Date(registration.event.date).toLocaleDateString('pt-BR')}
⏰ Horário: ${registration.event.time || 'Não informado'}
📍 Local: ${registration.event.location || 'Não informado'}
💰 Valor: R$ ${registration.event.price || '0,00'}
✅ Status: ${registration.status}
🎫 ID: ${registration.id}

📝 *Descrição:*
${registration.event.description || 'Descrição não disponível'}

Para cancelar esta inscrição, digite "cancelar ${registration.id}".`;
        } else {
          response = `❌ *Evento não encontrado*

Não encontramos um evento com o ID ${eventId} em suas inscrições.

Digite "inscrições" para ver todos os seus eventos.`;
        }
      }

    } else if (lowerMessage.includes('cancelar ') || lowerMessage.includes('cancel ')) {
      const eventId = messageText.match(/\d+/)?.[0];
      if (eventId && user) {
        const registration = user.registrations.find(reg => reg.id === eventId);
        if (registration) {
          // Implementar lógica de cancelamento
          response = `⚠️ *Cancelamento de Inscrição*

Para cancelar sua inscrição no evento "${registration.event.title}", entre em contato com nosso suporte:

📧 Email: suporte@eventsync.com
📱 WhatsApp: +55 (11) 99999-9999

Ou acesse nosso site para cancelar diretamente.`;
        } else {
          response = `❌ *Inscrição não encontrada*

Não encontramos uma inscrição com o ID ${eventId}.

Digite "inscrições" para ver todas as suas inscrições.`;
        }
      }

    } else {
      // Resposta padrão para mensagens não reconhecidas
      response = `🤖 *EventSync Bot*

Olá! Sou o assistente virtual do EventSync.

Para começar, digite um dos comandos:

📋 *Comandos principais:*
• "ajuda" - Ver todos os comandos
• "eventos" - Listar meus eventos
• "inscrições" - Ver minhas inscrições
• "certificados" - Listar meus certificados
• "status" - Status da minha conta
• "suporte" - Falar com atendente

💡 *Dica:* Digite "ajuda" para ver todos os comandos disponíveis.`;
    }

    // Enviar resposta
    if (response) {
      await WhatsAppService.sendTextMessage(phoneNumber, response);
    }

  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    
    // Enviar mensagem de erro
    const errorMessage = `❌ *Erro no Sistema*

Desculpe, ocorreu um erro ao processar sua mensagem.

Por favor, tente novamente ou entre em contato com suporte:
📧 suporte@eventsync.com`;

    await WhatsAppService.sendTextMessage(phoneNumber, errorMessage);
  }
}
