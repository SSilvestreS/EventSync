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

    // Buscar todas as inscrições confirmadas sem certificados
    const registrations = await prisma.registration.findMany({
      where: {
        status: 'CONFIRMED',
        certificate: null
      },
      include: {
        user: true,
        event: true
      }
    });

    if (registrations.length === 0) {
      return NextResponse.json(
        { message: 'Não há inscrições confirmadas sem certificados' },
        { status: 200 }
      );
    }

    const results = {
      success: [],
      errors: [],
      total: registrations.length
    };

    // Gerar certificados para cada inscrição
    for (const registration of registrations) {
      try {
        const certificate = await CertificateService.generateCertificate(registration.id);
        results.success.push({
          registrationId: registration.id,
          certificateId: certificate.id,
          userName: registration.user.name,
          eventTitle: registration.event.title
        });
      } catch (error) {
        console.error(`Erro ao gerar certificado para inscrição ${registration.id}:`, error);
        results.errors.push({
          registrationId: registration.id,
          userName: registration.user.name,
          eventTitle: registration.event.title,
          error: error.message
        });
      }
    }

    const message = `Processamento concluído. ${results.success.length} certificados gerados com sucesso, ${results.errors.length} erros.`;

    return NextResponse.json({
      message,
      results
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao gerar certificados em lote:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
