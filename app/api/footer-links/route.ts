import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    const section = searchParams.get('section');

    const where: Prisma.FooterLinkWhereInput = {
      locale,
      isActive: true,
    };

    if (section) {
      where.section = section;
    }

    const links = await prisma.footerLink.findMany({
      where,
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
