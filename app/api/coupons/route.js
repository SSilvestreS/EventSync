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
    const isActive = searchParams.get('isActive');

    // Construir filtros
    const where = {};
    
    if (eventId) {
      where.eventId = eventId;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const coupons = await prisma.coupon.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(coupons);

  } catch (error) {
    console.error('Erro ao buscar cupons:', error);
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
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      validFrom,
      validUntil,
      minOrderValue,
      maxDiscount,
      isActive,
      eventId
    } = body;

    // Validações básicas
    if (!code || !discountValue || !validFrom || !validUntil || !eventId) {
      return NextResponse.json(
        { message: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Verificar se o código já existe
    const existingCoupon = await prisma.coupon.findFirst({
      where: { code }
    });

    if (existingCoupon) {
      return NextResponse.json(
        { message: 'Código de cupom já existe' },
        { status: 400 }
      );
    }

    // Criar cupom
    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        maxUses: maxUses ? parseInt(maxUses) : null,
        currentUses: 0,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        isActive: isActive !== undefined ? isActive : true,
        eventId
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true
          }
        }
      }
    });

    return NextResponse.json(coupon, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
