const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventsync.com' },
    update: {},
    create: {
      email: 'admin@eventsync.com',
      name: 'Administrador EventSync',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      emailVerified: new Date(),
      company: 'EventSync',
      bio: 'Administrador do sistema EventSync'
    },
  });

  // Criar usuário organizador
  const organizerPassword = await bcrypt.hash('organizer123', 12);
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@eventsync.com' },
    update: {},
    create: {
      email: 'organizer@eventsync.com',
      name: 'João Silva',
      password: organizerPassword,
      role: 'ORGANIZER',
      isVerified: true,
      emailVerified: new Date(),
      company: 'Tech Events Brasil',
      bio: 'Organizador de eventos de tecnologia',
      phone: '(11) 99999-9999'
    },
  });

  // Criar usuário participante
  const attendeePassword = await bcrypt.hash('attendee123', 12);
  const attendee = await prisma.user.upsert({
    where: { email: 'attendee@eventsync.com' },
    update: {},
    create: {
      email: 'attendee@eventsync.com',
      name: 'Maria Santos',
      password: attendeePassword,
      role: 'ATTENDEE',
      isVerified: true,
      emailVerified: new Date(),
      company: 'Startup XYZ',
      bio: 'Desenvolvedora apaixonada por eventos',
      phone: '(11) 88888-8888'
    },
  });

  console.log('✅ Usuários criados:', { admin: admin.email, organizer: organizer.email, attendee: attendee.email });

  // Criar eventos de exemplo
  const event1 = await prisma.event.create({
    data: {
      title: 'Tech Conference 2024',
      description: 'A maior conferência de tecnologia do Brasil, com palestras sobre IA, Blockchain e desenvolvimento web.',
      shortDescription: 'Conferência de tecnologia com foco em inovação',
      category: 'CONFERENCE',
      status: 'PUBLISHED',
      startDate: new Date('2024-06-15T09:00:00Z'),
      endDate: new Date('2024-06-15T18:00:00Z'),
      location: 'Centro de Convenções São Paulo',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      coordinates: { lat: -23.5505, lng: -46.6333 },
      capacity: 500,
      currentRegistrations: 0,
      price: 299.99,
      currency: 'BRL',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
      requirements: 'Conhecimentos básicos em tecnologia',
      contactEmail: 'contato@techconference.com',
      contactPhone: '(11) 3333-3333',
      website: 'https://techconference.com',
      tags: ['tecnologia', 'IA', 'blockchain', 'desenvolvimento'],
      isPublic: true,
      allowWaitlist: true,
      maxWaitlist: 100,
      organizerId: organizer.id
    }
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Workshop de React Avançado',
      description: 'Workshop prático sobre React Hooks, Context API, Performance e boas práticas.',
      shortDescription: 'Aprenda React avançado na prática',
      category: 'WORKSHOP',
      status: 'PUBLISHED',
      startDate: new Date('2024-07-20T14:00:00Z'),
      endDate: new Date('2024-07-20T18:00:00Z'),
      location: 'Escola de Programação CodeLab',
      address: 'Rua Augusta, 500',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      coordinates: { lat: -23.5489, lng: -46.6388 },
      capacity: 30,
      currentRegistrations: 0,
      price: 149.99,
      currency: 'BRL',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
      requirements: 'Conhecimento básico em React',
      contactEmail: 'contato@codelab.com',
      contactPhone: '(11) 4444-4444',
      website: 'https://codelab.com',
      tags: ['react', 'javascript', 'frontend', 'workshop'],
      isPublic: true,
      allowWaitlist: true,
      maxWaitlist: 20,
      organizerId: organizer.id
    }
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Meetup de Startups',
      description: 'Networking e palestras sobre empreendedorismo, inovação e mercado de startups.',
      shortDescription: 'Conecte-se com empreendedores',
      category: 'MEETUP',
      status: 'PUBLISHED',
      startDate: new Date('2024-08-10T19:00:00Z'),
      endDate: new Date('2024-08-10T22:00:00Z'),
      location: 'WeWork Paulista',
      address: 'Av. Paulista, 2000',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      coordinates: { lat: -23.5505, lng: -46.6333 },
      capacity: 100,
      currentRegistrations: 0,
      price: 0,
      currency: 'BRL',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
      requirements: 'Interesse em empreendedorismo',
      contactEmail: 'contato@startupmeetup.com',
      contactPhone: '(11) 5555-5555',
      website: 'https://startupmeetup.com',
      tags: ['startup', 'empreendedorismo', 'networking', 'inovação'],
      isPublic: true,
      allowWaitlist: false,
      organizerId: organizer.id
    }
  });

  console.log('✅ Eventos criados:', { 
    event1: event1.title, 
    event2: event2.title, 
    event3: event3.title 
  });

  // Criar sessões para o primeiro evento
  const session1 = await prisma.session.create({
    data: {
      title: 'Introdução à Inteligência Artificial',
      description: 'Conceitos básicos de IA e machine learning',
      startTime: new Date('2024-06-15T09:00:00Z'),
      endTime: new Date('2024-06-15T10:30:00Z'),
      speaker: 'Dr. Carlos Silva',
      room: 'Auditório Principal',
      capacity: 500,
      eventId: event1.id
    }
  });

  const session2 = await prisma.session.create({
    data: {
      title: 'Blockchain e Criptomoedas',
      description: 'O futuro das transações digitais',
      startTime: new Date('2024-06-15T11:00:00Z'),
      endTime: new Date('2024-06-15T12:30:00Z'),
      speaker: 'Ana Costa',
      room: 'Auditório Principal',
      capacity: 500,
      eventId: event1.id
    }
  });

  const session3 = await prisma.session.create({
    data: {
      title: 'Desenvolvimento Web Moderno',
      description: 'Tendências e tecnologias atuais',
      startTime: new Date('2024-06-15T14:00:00Z'),
      endTime: new Date('2024-06-15T15:30:00Z'),
      speaker: 'Pedro Santos',
      room: 'Sala A',
      capacity: 200,
      eventId: event1.id
    }
  });

  console.log('✅ Sessões criadas para o evento principal');

  // Criar patrocinadores
  const sponsor1 = await prisma.sponsor.create({
    data: {
      name: 'TechCorp',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      website: 'https://techcorp.com',
      description: 'Empresa líder em soluções tecnológicas',
      tier: 'PLATINUM',
      eventId: event1.id
    }
  });

  const sponsor2 = await prisma.sponsor.create({
    data: {
      name: 'InnovateLab',
      logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200',
      website: 'https://innovatelab.com',
      description: 'Laboratório de inovação e pesquisa',
      tier: 'GOLD',
      eventId: event1.id
    }
  });

  console.log('✅ Patrocinadores criados');

  // Criar inscrições de exemplo
  const registration1 = await prisma.registration.create({
    data: {
      status: 'CONFIRMED',
      ticketType: 'VIP',
      price: 299.99,
      currency: 'BRL',
      notes: 'Participante VIP com acesso a área exclusiva',
      qrCode: 'VIP-001-ABC123',
      userId: attendee.id,
      eventId: event1.id
    }
  });

  const registration2 = await prisma.registration.create({
    data: {
      status: 'PENDING',
      ticketType: 'Standard',
      price: 149.99,
      currency: 'BRL',
      notes: 'Aguardando confirmação de pagamento',
      qrCode: 'STD-002-DEF456',
      userId: attendee.id,
      eventId: event2.id
    }
  });

  console.log('✅ Inscrições criadas');

  // Criar pagamento para a primeira inscrição
  const payment1 = await prisma.payment.create({
    data: {
      amount: 299.99,
      currency: 'BRL',
      status: 'COMPLETED',
      method: 'CREDIT_CARD',
      stripePaymentId: 'pi_mock_123',
      description: 'Inscrição VIP - Tech Conference 2024',
      metadata: {
        eventId: event1.id,
        eventTitle: event1.title,
        ticketType: 'VIP'
      },
      userId: attendee.id,
      registrationId: registration1.id
    }
  });

  console.log('✅ Pagamento criado');

  // Criar notificações
  const notification1 = await prisma.notification.create({
    data: {
      type: 'REGISTRATION_CONFIRMED',
      title: 'Inscrição Confirmada',
      message: 'Sua inscrição para Tech Conference 2024 foi confirmada!',
      isRead: false,
      userId: attendee.id
    }
  });

  const notification2 = await prisma.notification.create({
    data: {
      type: 'EVENT_REMINDER',
      title: 'Lembrete de Evento',
      message: 'Tech Conference 2024 acontece amanhã! Não se esqueça do seu QR Code.',
      isRead: false,
      userId: attendee.id
    }
  });

  console.log('✅ Notificações criadas');

  // Criar mídia para os eventos
  const media1 = await prisma.media.create({
    data: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      alt: 'Tech Conference 2024',
      caption: 'Imagem promocional da conferência',
      eventId: event1.id
    }
  });

  const media2 = await prisma.media.create({
    data: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      alt: 'Workshop React',
      caption: 'Workshop prático de React',
      eventId: event2.id
    }
  });

  console.log('✅ Mídia criada');

  console.log('🎉 Seed do banco de dados concluído com sucesso!');
  console.log('\n📊 Resumo dos dados criados:');
  console.log(`- Usuários: ${await prisma.user.count()}`);
  console.log(`- Eventos: ${await prisma.event.count()}`);
  console.log(`- Sessões: ${await prisma.session.count()}`);
  console.log(`- Inscrições: ${await prisma.registration.count()}`);
  console.log(`- Pagamentos: ${await prisma.payment.count()}`);
  console.log(`- Patrocinadores: ${await prisma.sponsor.count()}`);
  console.log(`- Notificações: ${await prisma.notification.count()}`);
  console.log(`- Mídia: ${await prisma.media.count()}`);

  console.log('\n🔑 Credenciais de teste:');
  console.log('Admin: admin@eventsync.com / admin123');
  console.log('Organizador: organizer@eventsync.com / organizer123');
  console.log('Participante: attendee@eventsync.com / attendee123');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
