import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { message: 'Assinatura não fornecida' },
        { status: 400 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Erro na verificação da assinatura:', err.message);
      return NextResponse.json(
        { message: 'Assinatura inválida' },
        { status: 400 }
      );
    }

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;
      
      case 'charge.refunded':
        await handlePaymentRefunded(event.data.object);
        break;
      
      default:
        console.log(`Evento não processado: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function handlePaymentSuccess(paymentIntent) {
  try {
    const { registrationId } = paymentIntent.metadata;

    // Atualizar status do pagamento
    await prisma.payment.update({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'COMPLETED',
        metadata: {
          ...paymentIntent.metadata,
          stripeChargeId: paymentIntent.latest_charge,
          completedAt: new Date().toISOString()
        }
      }
    });

    // Atualizar status da inscrição
    await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: 'CONFIRMED'
      }
    });

    // Atualizar contador de inscrições do evento
    await prisma.event.update({
      where: { id: paymentIntent.metadata.eventId },
      data: {
        currentRegistrations: {
          increment: 1
        }
      }
    });

    console.log(`Pagamento confirmado para inscrição: ${registrationId}`);

  } catch (error) {
    console.error('Erro ao processar pagamento bem-sucedido:', error);
  }
}

async function handlePaymentFailure(paymentIntent) {
  try {
    const { registrationId } = paymentIntent.metadata;

    // Atualizar status do pagamento
    await prisma.payment.update({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'FAILED',
        metadata: {
          ...paymentIntent.metadata,
          failureReason: paymentIntent.last_payment_error?.message || 'Falha no pagamento',
          failedAt: new Date().toISOString()
        }
      }
    });

    // Atualizar status da inscrição
    await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: 'CANCELLED'
      }
    });

    console.log(`Pagamento falhou para inscrição: ${registrationId}`);

  } catch (error) {
    console.error('Erro ao processar falha no pagamento:', error);
  }
}

async function handlePaymentCanceled(paymentIntent) {
  try {
    const { registrationId } = paymentIntent.metadata;

    // Atualizar status do pagamento
    await prisma.payment.update({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'CANCELLED',
        metadata: {
          ...paymentIntent.metadata,
          canceledAt: new Date().toISOString()
        }
      }
    });

    // Atualizar status da inscrição
    await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: 'CANCELLED'
      }
    });

    console.log(`Pagamento cancelado para inscrição: ${registrationId}`);

  } catch (error) {
    console.error('Erro ao processar cancelamento do pagamento:', error);
  }
}

async function handlePaymentRefunded(charge) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: charge.payment_intent },
      include: { registration: true }
    });

    if (payment) {
      // Atualizar status do pagamento
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REFUNDED',
          metadata: {
            ...payment.metadata,
            refundedAt: new Date().toISOString(),
            refundAmount: charge.amount_refunded / 100
          }
        }
      });

      // Atualizar status da inscrição
      await prisma.registration.update({
        where: { id: payment.registrationId },
        data: {
          status: 'CANCELLED'
        }
      });

      // Decrementar contador de inscrições do evento
      await prisma.event.update({
        where: { id: payment.registration.eventId },
        data: {
          currentRegistrations: {
            decrement: 1
          }
        }
      });

      console.log(`Pagamento reembolsado para inscrição: ${payment.registrationId}`);
    }

  } catch (error) {
    console.error('Erro ao processar reembolso:', error);
  }
}
