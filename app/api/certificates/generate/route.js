import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import CertificateService from '../../../../lib/certificateService';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { registrationId } = body;

    if (!registrationId) {
      return NextResponse.json(
        { message: 'ID da inscrição é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a inscrição existe e está confirmada
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

    if (registration.status !== 'CONFIRMED') {
      return NextResponse.json(
        { message: 'Apenas inscrições confirmadas podem gerar certificados' },
        { status: 400 }
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

    // Gerar certificado
    const certificate = await CertificateService.generateCertificate(registrationId);

    return NextResponse.json(certificate, { status: 201 });

  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
