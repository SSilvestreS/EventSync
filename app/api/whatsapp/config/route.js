import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Configuração mockada para demonstração
let whatsappConfig = {
  phoneNumber: '+5511999999999',
  accessToken: '',
  webhookUrl: '',
  isActive: false,
  autoReply: true,
  businessHours: {
    start: '09:00',
    end: '18:00',
    timezone: 'America/Sao_Paulo'
  },
  chatbotEnabled: true,
  notificationsEnabled: true
};

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    return NextResponse.json(whatsappConfig);
  } catch (error) {
    console.error('Erro ao carregar configuração WhatsApp:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    // Atualizar configuração
    whatsappConfig = { ...whatsappConfig, ...body };

    return NextResponse.json({ 
      message: 'Configuração salva com sucesso',
      config: whatsappConfig 
    });
  } catch (error) {
    console.error('Erro ao salvar configuração WhatsApp:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
