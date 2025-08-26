import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, eventId, amount } = body;

    if (!code || !eventId) {
      return NextResponse.json(
        { message: 'Código do cupom e ID do evento são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar o cupom
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { event: true }
    });

    if (!coupon) {
      return NextResponse.json(
        { message: 'Cupom não encontrado' },
        { status: 404 }
      );
    }

    // Validações
    if (!coupon.isActive) {
      return NextResponse.json(
        { message: 'Cupom inativo' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json(
        { message: 'Cupom fora do período de validade' },
        { status: 400 }
      );
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json(
        { message: 'Cupom esgotado' },
        { status: 400 }
      );
    }

    if (coupon.eventId && coupon.eventId !== eventId) {
      return NextResponse.json(
        { message: 'Cupom não válido para este evento' },
        { status: 400 }
      );
    }

    if (coupon.minOrderValue && amount < coupon.minOrderValue) {
      return NextResponse.json(
        { message: `Valor mínimo para usar este cupom: R$ ${coupon.minOrderValue}` },
        { status: 400 }
      );
    }

    // Calcular desconto
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        finalAmount
      }
    });
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
