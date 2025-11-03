import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';

    const sections = await prisma.footerSection.findMany({
      where: { locale },
      orderBy: { section: 'asc' },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching footer sections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

