import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';

interface FooterSectionPayload {
  section: string;
  title: string;
  locale?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { session } = await getSessionWithUser();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

export async function POST(request: NextRequest) {
  try {
    const { session } = await getSessionWithUser();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as FooterSectionPayload;
    const { section, title, locale } = body;

    if (!section || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: section, title' },
        { status: 400 }
      );
    }

    // Upsert: Update if exists, create if not
    const footerSection = await prisma.footerSection.upsert({
      where: {
        section_locale: {
          section,
          locale: locale || 'de',
        },
      },
      update: {
        title,
      },
      create: {
        section,
        title,
        locale: locale || 'de',
      },
    });

    return NextResponse.json(footerSection, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating footer section:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
