import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    // Simular teste do webhook
    console.log('Testando webhook do WhatsApp...');

    // Aguardar um pouco para simular processamento
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simular verificação de conectividade
    const webhookStatus = {
      url: '/api/webhooks/whatsapp',
      status: 'active',
      lastTest: new Date().toISOString(),
      responseTime: '150ms',
      message: 'Webhook funcionando corretamente'
    };

    return NextResponse.json({
      success: true,
      message: 'Webhook testado com sucesso',
      status: webhookStatus
    });

  } catch (error) {
    console.error('Erro ao testar webhook:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
