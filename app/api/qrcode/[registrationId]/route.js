import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

// Dados mockados para demonstração
const registrations = [
  {
    id: 1,
    eventId: 1,
    eventTitle: 'Workshop de Desenvolvimento Web',
    name: 'João Silva',
    email: 'joao@email.com',
    qrCode: 'qr_joao_workshop_web_001',
    status: 'confirmed'
  },
  {
    id: 2,
    eventId: 1,
    eventTitle: 'Workshop de Desenvolvimento Web',
    name: 'Maria Santos',
    email: 'maria@email.com',
    qrCode: 'qr_maria_workshop_web_002',
    status: 'confirmed'
  }
];

// GET - Gerar QR code para uma inscrição específica
export async function GET(request, { params }) {
  try {
    const { registrationId } = params;
    
    // Buscar a inscrição
    const registration = registrations.find(reg => reg.id == registrationId);
    
    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }

    // Dados para o QR code
    const qrData = {
      registrationId: registration.id,
      eventId: registration.eventId,
      eventTitle: registration.eventTitle,
      participantName: registration.name,
      participantEmail: registration.email,
      qrCode: registration.qrCode,
      timestamp: new Date().toISOString()
    };

    // Gerar QR code como SVG
    const qrCodeSVG = await QRCode.toString(JSON.stringify(qrData), {
      type: 'svg',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Retornar o QR code como SVG
    return new NextResponse(qrCodeSVG, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Atualizar QR code (se necessário)
export async function POST(request, { params }) {
  try {
    const { registrationId } = params;
    const body = await request.json();
    
    // Buscar a inscrição
    const registration = registrations.find(reg => reg.id == registrationId);
    
    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }

    // Aqui você poderia implementar lógica para regenerar ou atualizar o QR code
    // Por exemplo, se houver mudança nos dados da inscrição

    return NextResponse.json({
      success: true,
      message: 'QR code atualizado com sucesso',
      data: {
        registrationId: registration.id,
        qrCode: registration.qrCode
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar QR code:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
