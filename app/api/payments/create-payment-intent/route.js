import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { registrationId, amount, currency = 'brl' } = body;

    if (!registrationId || !amount) {
      return NextResponse.json(
        { message: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Verificar se a inscrição existe e pertence ao usuário
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        user: true
      }
    });

    if (!registration) {
      return NextResponse.json(
        { message: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }

    if (registration.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Verificar se já existe um pagamento para esta inscrição
    const existingPayment = await prisma.payment.findUnique({
      where: { registrationId }
    });

    if (existingPayment) {
      return NextResponse.json(
        { message: 'Pagamento já existe para esta inscrição' },
        { status: 400 }
      );
    }

    // Criar Payment Intent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency.toLowerCase(),
      metadata: {
        registrationId,
        eventId: registration.event.id,
        eventTitle: registration.event.title,
        userId: session.user.id,
        userName: session.user.name
      },
      description: `Inscrição para ${registration.event.title}`,
    });

    // Criar registro de pagamento no banco
    const payment = await prisma.payment.create({
      data: {
        amount: amount,
        currency: currency.toUpperCase(),
        status: 'PENDING',
        method: 'CREDIT_CARD', // Será atualizado quando o pagamento for confirmado
        stripePaymentId: paymentIntent.id,
        description: `Inscrição para ${registration.event.title}`,
        userId: session.user.id,
        registrationId: registrationId,
        metadata: {
          stripePaymentIntentId: paymentIntent.id,
          eventId: registration.event.id,
          eventTitle: registration.event.title
        }
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { message: `Erro do Stripe: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
