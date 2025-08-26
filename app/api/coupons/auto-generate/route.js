import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, ruleType, parameters } = body;

    // Regras de geração automática
    const rules = {
      FIRST_TIME_ATTENDEE: {
        description: 'Desconto para primeira participação',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        maxUses: null,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        minOrderValue: 0,
        maxDiscount: 50
      },
      EARLY_BIRD: {
        description: 'Desconto Early Bird - Inscrição antecipada',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxUses: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        minOrderValue: 0,
        maxDiscount: 100
      },
      BULK_REGISTRATION: {
        description: 'Desconto para inscrições em grupo',
        discountType: 'PERCENTAGE',
        discountValue: 25,
        maxUses: null,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
        minOrderValue: 200,
        maxDiscount: 150
      },
      LOYALTY: {
        description: 'Desconto para participantes recorrentes',
        discountType: 'FIXED_AMOUNT',
        discountValue: 30,
        maxUses: null,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
        minOrderValue: 100,
        maxDiscount: 30
      }
    };

    if (!rules[ruleType]) {
      return NextResponse.json(
        { message: 'Tipo de regra não suportado' },
        { status: 400 }
      );
    }

    const rule = rules[ruleType];
    const baseCode = `${ruleType}_${eventId}_${Date.now().toString(36)}`.toUpperCase();

    // Gerar múltiplos cupons se necessário
    const coupons = [];
    const quantity = parameters?.quantity || 1;

    for (let i = 0; i < quantity; i++) {
      const code = quantity > 1 ? `${baseCode}_${i + 1}` : baseCode;
      
      const coupon = await prisma.coupon.create({
        data: {
          code,
          description: rule.description,
          discountType: rule.discountType,
          discountValue: rule.discountValue,
          maxUses: rule.maxUses,
          validFrom: rule.validFrom,
          validUntil: rule.validUntil,
          minOrderValue: rule.minOrderValue,
          maxDiscount: rule.maxDiscount,
          eventId
        },
        include: {
          event: {
            select: { title: true }
          }
        }
      });

      coupons.push(coupon);
    }

    return NextResponse.json({
      message: `${quantity} cupon(s) gerado(s) com sucesso`,
      coupons
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao gerar cupons automáticos:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
