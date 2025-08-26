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
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    // Construir filtros
    const where = {};
    
    if (eventId) {
      where.eventId = eventId;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            price: true
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });

    return NextResponse.json(registrations);

  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
