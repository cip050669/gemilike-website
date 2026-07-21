import { NextRequest, NextResponse } from 'next/server';
import { prisma, runWithDbFallback } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';

    // Hole alle aktiven LegalPages für "Rechtliches"
    // Filtere nur deutsche Slugs (keine englischen wie 'imprint', 'privacy', etc.)
    const germanSlugs = ['impressum', 'datenschutz', 'agb', 'widerruf', 'versand', 'cookies'];

    const legalPages = await runWithDbFallback(
      () =>
        prisma.legalPage.findMany({
          where: {
            locale,
            isActive: true,
            slug: {
              in: germanSlugs, // Nur deutsche Slugs
            },
          },
          select: {
            slug: true,
            title: true,
          },
          orderBy: {
            slug: 'asc',
          },
        }),
      []
    );

    // Mappe die LegalPages zu Footer-Links
    // Die LegalPages haben deutsche Slugs (impressum, datenschutz, etc.)
    // Diese werden direkt als URL-Pfad verwendet
    const legalLinks = legalPages.map((page) => ({
      text: page.title,
      url: `/${page.slug}`,
      slug: page.slug,
    }));

    // Für "Wer sind wir?" - feste Links (können später auch aus Services generiert werden)
    const aboutLinks = [
      { text: 'Über uns', url: '/about', slug: 'about' },
      { text: 'Unsere Leistungen', url: '/services', slug: 'services' },
      { text: 'Wissenswertes', url: '/wissenswertes', slug: 'wissenswertes' },
      { text: 'Kontakt', url: '/contact', slug: 'contact' },
    ];

    return NextResponse.json({
      legal: legalLinks,
      about: aboutLinks,
    });
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

