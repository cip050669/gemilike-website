import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { session } = await getSessionWithUser();
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    const section = searchParams.get('section');

    const where: any = {
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

export async function POST(request: NextRequest) {
  try {
    const { session } = await getSessionWithUser();
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, url, section, order, locale } = body;

    if (!text || !url || !section) {
      return NextResponse.json(
        { error: 'Missing required fields: text, url, section' },
        { status: 400 }
      );
    }

    const link = await prisma.footerLink.create({
      data: {
        text,
        url,
        section,
        order: order || 0,
        locale: locale || 'de',
        isActive: true,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating footer link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

