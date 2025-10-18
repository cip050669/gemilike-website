import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Gutscheincode ist erforderlich' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Ungültiger Gutscheincode' },
        { status: 400 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Gutschein ist nicht mehr aktiv' },
        { status: 400 }
      );
    }

    // Check validity period
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json(
        { error: 'Gutschein ist nicht mehr gültig' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'Gutschein ist ausgeschöpft' },
        { status: 400 }
      );
    }

    // Check minimum amount
    if (coupon.minAmount && subtotal < coupon.minAmount) {
      return NextResponse.json(
        { error: `Mindestbestellwert von €${coupon.minAmount} erforderlich` },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    return NextResponse.json({
      code: coupon.code,
      type: coupon.type.toLowerCase(),
      value: coupon.value,
      discount: Math.min(discount, subtotal), // Don't exceed subtotal
      description: `${coupon.type === 'PERCENTAGE' ? coupon.value + '%' : '€' + coupon.value} Rabatt`
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
