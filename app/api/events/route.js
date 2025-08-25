import { NextResponse } from 'next/server';

// Dados mockados para demonstração
let events = [
  {
    id: 1,
    title: 'Workshop de Desenvolvimento Web',
    description: 'Aprenda as melhores práticas de desenvolvimento web moderno com React e Node.js',
    date: '2024-02-15',
    time: '14:00',
    location: 'Centro de Inovação',
    capacity: 50,
    registered: 35,
    category: 'Tecnologia',
    status: 'Ativo',
    price: 'R$ 150,00',
    image: '/images/workshop-web.jpg',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Palestra sobre Inteligência Artificial',
    description: 'Descubra como a IA está transformando diferentes setores da economia',
    date: '2024-02-20',
    time: '19:00',
    location: 'Auditório Principal',
    capacity: 100,
    registered: 78,
    category: 'Tecnologia',
    status: 'Ativo',
    price: 'Gratuito',
    image: '/images/palestra-ia.jpg',
    createdAt: '2024-01-10T10:00:00Z'
  }
];

// GET - Listar todos os eventos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredEvents = [...events];

    // Filtro por categoria
    if (category && category !== 'Todos') {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }

    // Filtro por status
    if (status && status !== 'Todos') {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }

    // Filtro por busca
    if (search) {
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Ordenar por data de criação (mais recentes primeiro)
    filteredEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length,
      message: 'Eventos listados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo evento
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.title || !body.description || !body.date || !body.time || !body.location || !body.capacity) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Criar novo evento
    const newEvent = {
      id: events.length + 1,
      ...body,
      registered: 0,
      status: body.status || 'Rascunho',
      createdAt: new Date().toISOString(),
      image: body.image || '/images/default-event.jpg'
    };

    events.push(newEvent);

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Evento criado com sucesso'
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
