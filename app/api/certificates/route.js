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
    const isActive = searchParams.get('isActive');

    // Construir filtros
    const where = {};
    
    if (eventId) {
      where.registration = {
        ...where.registration,
        eventId
      };
    }
    
    if (userId) {
      where.registration = {
        ...where.registration,
        userId
      };
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const certificates = await prisma.certificate.findMany({
      where,
      include: {
        registration: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            event: {
              select: {
                id: true,
                title: true,
                date: true,
                location: true
              }
            }
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    });

    return NextResponse.json(certificates);

  } catch (error) {
    console.error('Erro ao buscar certificados:', error);
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
    const { registrationId, templateId, customFields } = body;

    if (!registrationId) {
      return NextResponse.json(
        { message: 'ID da inscrição é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a inscrição existe
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        user: true,
        event: true
      }
    });

    if (!registration) {
      return NextResponse.json(
        { message: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se já existe certificado
    const existingCertificate = await prisma.certificate.findUnique({
      where: { registrationId }
    });

    if (existingCertificate) {
      return NextResponse.json(
        { message: 'Certificado já existe para esta inscrição' },
        { status: 400 }
      );
    }

    // Gerar código único do certificado
    const certificateCode = `CERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Criar certificado
    const certificate = await prisma.certificate.create({
      data: {
        registrationId,
        certificateCode,
        templateId: templateId || 'default',
        customFields: customFields || {},
        isActive: true
      },
      include: {
        registration: {
          include: {
            user: true,
            event: true
          }
        }
      }
    });

    return NextResponse.json(certificate, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar certificado:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
