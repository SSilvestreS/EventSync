import { NextResponse } from 'next/server';

// Dados mockados para demonstração
let registrations = [
  {
    id: 1,
    eventId: 1,
    eventTitle: 'Workshop de Desenvolvimento Web',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    status: 'confirmed',
    registrationDate: '2024-01-20T10:00:00Z',
    checkInDate: null,
    qrCode: 'qr_joao_workshop_web_001',
    notes: 'Participante interessado em React'
  },
  {
    id: 2,
    eventId: 1,
    eventTitle: 'Workshop de Desenvolvimento Web',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 88888-8888',
    status: 'confirmed',
    registrationDate: '2024-01-21T14:30:00Z',
    checkInDate: null,
    qrCode: 'qr_maria_workshop_web_002',
    notes: ''
  },
  {
    id: 3,
    eventId: 2,
    eventTitle: 'Palestra sobre Inteligência Artificial',
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    phone: '(11) 77777-7777',
    status: 'pending',
    registrationDate: '2024-01-22T09:15:00Z',
    checkInDate: null,
    qrCode: 'qr_pedro_palestra_ia_001',
    notes: 'Aguardando confirmação de pagamento'
  }
];

// GET - Listar todas as inscrições
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredRegistrations = [...registrations];

    // Filtro por evento
    if (eventId) {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.eventId == eventId);
    }

    // Filtro por status
    if (status && status !== 'Todos') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === status);
    }

    // Filtro por busca
    if (search) {
      filteredRegistrations = filteredRegistrations.filter(reg => 
        reg.name.toLowerCase().includes(search.toLowerCase()) ||
        reg.email.toLowerCase().includes(search.toLowerCase()) ||
        reg.eventTitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Ordenar por data de inscrição (mais recentes primeiro)
    filteredRegistrations.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

    return NextResponse.json({
      success: true,
      data: filteredRegistrations,
      total: filteredRegistrations.length,
      message: 'Inscrições listadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao listar inscrições:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova inscrição
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.eventId || !body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Verificar se já existe inscrição para este email neste evento
    const existingRegistration = registrations.find(
      reg => reg.eventId == body.eventId && reg.email === body.email
    );

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, message: 'Email já inscrito neste evento' },
        { status: 409 }
      );
    }

    // Gerar QR code único
    const qrCode = `qr_${body.name.toLowerCase().replace(' ', '_')}_${Date.now()}`;

    // Criar nova inscrição
    const newRegistration = {
      id: registrations.length + 1,
      ...body,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      checkInDate: null,
      qrCode,
      notes: body.notes || ''
    };

    registrations.push(newRegistration);

    return NextResponse.json({
      success: true,
      data: newRegistration,
      message: 'Inscrição realizada com sucesso'
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar inscrição:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
