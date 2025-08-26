import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizerId = searchParams.get('organizerId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');

    // Construir filtros
    const where = {};
    
    if (organizerId) {
      where.organizerId = organizerId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true';
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            registrations: true,
            sessions: true,
            sponsors: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json(events);

  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      duration,
      location,
      address,
      city,
      state,
      country,
      coordinates,
      capacity,
      price,
      currency,
      category,
      status,
      image,
      website,
      tags,
      isPublic
    } = body;

    // Validações básicas
    if (!title || !date || !location) {
      return NextResponse.json(
        { message: 'Título, data e local são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar evento
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        duration: duration || 1,
        location,
        address,
        city,
        state,
        country,
        coordinates: coordinates || {},
        capacity: capacity || 100,
        currentRegistrations: 0,
        price: price || 0,
        currency: currency || 'BRL',
        category: category || 'CONFERENCE',
        status: status || 'DRAFT',
        organizerId: session.user.id,
        image,
        website,
        tags: tags || [],
        isPublic: isPublic !== undefined ? isPublic : true
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(event, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
