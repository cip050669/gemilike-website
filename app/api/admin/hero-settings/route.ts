import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch current hero settings
export async function GET() {
  try {
    let settings = await prisma.heroSettings.findFirst();
    if (!settings) {
      settings = await prisma.heroSettings.create({
        data: {
          imageUrl: '/images/hero-fallback.jpg',
          title: 'Einfach nur Gemilike',
          titleLine2: 'Heroes in Gems',
          subtitle: 'Ihr Spezialist für rohe und geschliffene Edelsteine.',
          primaryButtonText: 'Sortiment entdecken',
          primaryButtonLink: '/shop',
          secondaryButtonText: 'Kontaktieren Sie uns',
          secondaryButtonLink: '/contact'
        }
      });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    return NextResponse.json({ success: false, error: 'Fehler beim Laden der Einstellungen' }, { status: 500 });
  }
}

// PUT - Update hero settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, title, titleLine2, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink } = body;

    if (!imageUrl || !title || !subtitle || !primaryButtonText || !primaryButtonLink) {
      return NextResponse.json({ success: false, error: 'Pflichtfelder fehlen' }, { status: 400 });
    }

    let settings = await prisma.heroSettings.findFirst();
    if (settings) {
      settings = await prisma.heroSettings.update({
        where: { id: settings.id },
        data: { imageUrl, title, titleLine2, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink }
      });
    } else {
      settings = await prisma.heroSettings.create({
        data: { imageUrl, title, titleLine2, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink }
      });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating hero settings:', error);
    return NextResponse.json({ success: false, error: 'Fehler beim Speichern der Einstellungen' }, { status: 500 });
  }
}
