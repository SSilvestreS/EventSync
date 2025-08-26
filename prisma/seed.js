const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar banco
  await prisma.certificate.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.sessionRegistration.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.session.deleteMany();
  await prisma.media.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.event.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  console.log('Banco limpo com sucesso');

  // Criar usuários
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@eventsync.com',
      name: 'Administrador EventSync',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      isVerified: true,
      phone: '+5511999999999',
      company: 'EventSync Corp'
    }
  });

  const organizerUser = await prisma.user.create({
    data: {
      email: 'organizador@eventsync.com',
      name: 'João Silva - Organizador',
      password: await bcrypt.hash('organizador123', 10),
      role: 'ORGANIZER',
      isVerified: true,
      phone: '+5511888888888',
      company: 'Tech Events Ltda'
    }
  });

  const attendeeUser = await prisma.user.create({
    data: {
      email: 'participante@eventsync.com',
      name: 'Maria Santos - Participante',
      password: await bcrypt.hash('participante123', 10),
      role: 'ATTENDEE',
      isVerified: true,
      phone: '+5511777777777',
      company: 'Digital Solutions'
    }
  });

  console.log('Usuários criados com sucesso');

  // Criar eventos
  const techConference = await prisma.event.create({
    data: {
      title: 'Tech Conference 2024',
      description: 'A maior conferência de tecnologia do Brasil',
      date: new Date('2024-12-15T09:00:00Z'),
      time: '09:00',
      duration: 8,
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
      category: 'CONFERENCE',
      status: 'PUBLISHED',
      organizerId: organizerUser.id,
      image: '/images/tech-conference.jpg',
      website: 'https://techconference.com.br',
      tags: ['tecnologia', 'inovação', 'startups', 'IA'],
      isPublic: true
    }
  });

  const workshopAI = await prisma.event.create({
    data: {
      title: 'Workshop de Inteligência Artificial',
      description: 'Aprenda os fundamentos da IA na prática',
      date: new Date('2024-11-20T14:00:00Z'),
      time: '14:00',
      duration: 4,
      location: 'Escola de Tecnologia',
      address: 'Rua Augusta, 500',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      coordinates: { lat: -23.5489, lng: -46.6388 },
      capacity: 50,
      currentRegistrations: 0,
      price: 149.99,
      currency: 'BRL',
      category: 'WORKSHOP',
      status: 'PUBLISHED',
      organizerId: organizerUser.id,
      image: '/images/ai-workshop.jpg',
      website: 'https://aiworkshop.com.br',
      tags: ['inteligência artificial', 'machine learning', 'python'],
      isPublic: true
    }
  });

  console.log('Eventos criados com sucesso');

  // Criar sessões
  const session1 = await prisma.session.create({
    data: {
      title: 'Abertura e Keynote',
      description: 'Palestra de abertura sobre o futuro da tecnologia',
      startTime: new Date('2024-12-15T09:00:00Z'),
      endTime: new Date('2024-12-15T10:30:00Z'),
      duration: 1.5,
      speaker: 'Dr. Carlos Tech',
      eventId: techConference.id
    }
  });

  const session2 = await prisma.session.create({
    data: {
      title: 'Inteligência Artificial na Prática',
      description: 'Demonstrações práticas de IA',
      startTime: new Date('2024-12-15T11:00:00Z'),
      endTime: new Date('2024-12-15T12:30:00Z'),
      duration: 1.5,
      speaker: 'Dra. Ana IA',
      eventId: techConference.id
    }
  });

  console.log('Sessões criadas com sucesso');

  // Criar cupons
  const earlyBirdCoupon = await prisma.coupon.create({
    data: {
      code: 'EARLYBIRD2024',
      description: 'Desconto Early Bird - Inscrição antecipada',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxUses: 100,
      currentUses: 0,
      validFrom: new Date('2024-08-01T00:00:00Z'),
      validUntil: new Date('2024-10-31T23:59:59Z'),
      minOrderValue: 0,
      maxDiscount: 100,
      isActive: true,
      eventId: techConference.id
    }
  });

  const loyaltyCoupon = await prisma.coupon.create({
    data: {
      code: 'LOYALTY2024',
      description: 'Desconto para participantes recorrentes',
      discountType: 'FIXED_AMOUNT',
      discountValue: 50,
      maxUses: null,
      currentUses: 0,
      validFrom: new Date('2024-08-01T00:00:00Z'),
      validUntil: new Date('2024-12-31T23:59:59Z'),
      minOrderValue: 200,
      maxDiscount: 50,
      isActive: true,
      eventId: techConference.id
    }
  });

  console.log('Cupons criados com sucesso');

  // Criar inscrições
  const registration1 = await prisma.registration.create({
    data: {
      userId: attendeeUser.id,
      eventId: techConference.id,
      status: 'CONFIRMED',
      registeredAt: new Date('2024-08-15T10:00:00Z'),
      checkedInAt: null,
      checkedOutAt: null,
      notes: 'Participante interessado em IA'
    }
  });

  const registration2 = await prisma.registration.create({
    data: {
      userId: attendeeUser.id,
      eventId: workshopAI.id,
      status: 'CONFIRMED',
      registeredAt: new Date('2024-08-20T14:00:00Z'),
      checkedInAt: null,
      checkedOutAt: null,
      notes: 'Participante do workshop de IA'
    }
  });

  console.log('Inscrições criadas com sucesso');

  // Criar pagamentos
  const payment1 = await prisma.payment.create({
    data: {
      amount: 299.99,
      currency: 'BRL',
      status: 'COMPLETED',
      method: 'CREDIT_CARD',
      transactionId: 'TXN_' + Date.now(),
      userId: attendeeUser.id,
      registrationId: registration1.id,
      description: 'Pagamento Tech Conference 2024',
      metadata: { gateway: 'stripe', cardType: 'visa' }
    }
  });

  const payment2 = await prisma.payment.create({
    data: {
      amount: 149.99,
      currency: 'BRL',
      status: 'COMPLETED',
      method: 'PIX',
      transactionId: 'PIX_' + Date.now(),
      userId: attendeeUser.id,
      registrationId: registration2.id,
      description: 'Pagamento Workshop IA',
      metadata: { gateway: 'pix', qrCode: 'pix_qr_code_123' }
    }
  });

  console.log('Pagamentos criados com sucesso');

  // Criar certificados
  const certificate1 = await prisma.certificate.create({
    data: {
      registrationId: registration1.id,
      certificateCode: 'CERT_' + Date.now() + '_001',
      issuedAt: new Date(),
      expiresAt: new Date('2025-12-15T23:59:59Z'),
      isActive: true,
      templateId: 'default',
      customFields: {
        eventTitle: techConference.title,
        userName: attendeeUser.name,
        eventDate: techConference.date,
        totalHours: 8
      },
      downloadUrl: '/certificates/generated/certificate_001.pdf'
    }
  });

  console.log('Certificados criados com sucesso');

  // Criar notificações
  const notification1 = await prisma.notification.create({
    data: {
      title: 'Inscrição Confirmada',
      message: `Sua inscrição para "${techConference.title}" foi confirmada!`,
      type: 'REGISTRATION_CONFIRMED',
      isRead: false,
      data: { eventId: techConference.id, eventTitle: techConference.title },
      userId: attendeeUser.id
    }
  });

  const notification2 = await prisma.notification.create({
    data: {
      title: 'Certificado Disponível',
      message: `Seu certificado para "${techConference.title}" está pronto para download!`,
      type: 'GENERAL',
      isRead: false,
      data: { 
        certificateId: certificate1.id, 
        eventTitle: techConference.title,
        downloadUrl: certificate1.downloadUrl
      },
      userId: attendeeUser.id
    }
  });

  console.log('Notificações criadas com sucesso');

  // Criar patrocinadores
  const sponsor1 = await prisma.sponsor.create({
    data: {
      name: 'TechCorp',
      logo: '/images/sponsors/techcorp.png',
      website: 'https://techcorp.com.br',
      tier: 'PLATINUM',
      eventId: techConference.id
    }
  });

  const sponsor2 = await prisma.sponsor.create({
    data: {
      name: 'InnovationLab',
      logo: '/images/sponsors/innovationlab.png',
      website: 'https://innovationlab.com.br',
      tier: 'GOLD',
      eventId: techConference.id
    }
  });

  console.log('Patrocinadores criados com sucesso');

  // Criar mídia
  const media1 = await prisma.media.create({
    data: {
      title: 'Banner Principal',
      description: 'Banner principal da Tech Conference 2024',
      url: '/images/events/tech-conference-banner.jpg',
      type: 'IMAGE',
      eventId: techConference.id
    }
  });

  const media2 = await prisma.media.create({
    data: {
      title: 'Apresentação Keynote',
      description: 'Slides da palestra de abertura',
      url: '/documents/presentations/keynote-2024.pdf',
      type: 'DOCUMENT',
      eventId: techConference.id
    }
  });

  console.log('Mídia criada com sucesso');

  console.log('Seed concluído com sucesso!');
  console.log('');
  console.log('Resumo dos dados criados:');
  console.log(`Usuários: ${await prisma.user.count()}`);
  console.log(`Eventos: ${await prisma.event.count()}`);
  console.log(`Sessões: ${await prisma.session.count()}`);
  console.log(`Cupons: ${await prisma.coupon.count()}`);
  console.log(`Inscrições: ${await prisma.registration.count()}`);
  console.log(`Pagamentos: ${await prisma.payment.count()}`);
  console.log(`Certificados: ${await prisma.certificate.count()}`);
  console.log(`Notificações: ${await prisma.notification.count()}`);
  console.log(`Patrocinadores: ${await prisma.sponsor.count()}`);
  console.log(`Mídia: ${await prisma.media.count()}`);
  console.log('');
  console.log('Credenciais de teste:');
  console.log('Admin: admin@eventsync.com / admin123');
  console.log('Organizador: organizador@eventsync.com / organizador123');
  console.log('Participante: participante@eventsync.com / participante123');
  console.log('');
  console.log('Cupons de teste:');
  console.log('EARLYBIRD2024 (20% desconto)');
  console.log('LOYALTY2024 (R$ 50,00 desconto)');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
