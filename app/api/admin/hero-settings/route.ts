import { NextRequest, NextResponse } from 'next/server';
import {
  HeroSettingsData,
  loadHeroSettings,
  saveHeroSettings,
  getDefaultHeroSettings,
} from '@/lib/data/hero-settings';
import { regenerateAndSendInvoice } from '@/lib/services/invoice';
import { sanitizeForLog } from '@/lib/safe-log';

export async function GET() {
  try {
    const settings = await loadHeroSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error loading hero settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load hero settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<HeroSettingsData>;
    const current = await loadHeroSettings();
    const defaults = await getDefaultHeroSettings();

    const payload: HeroSettingsData = {
      title: typeof body.title === 'string' ? body.title : current.title || defaults.title,
      titleLine2:
        typeof body.titleLine2 === 'string'
          ? body.titleLine2
          : current.titleLine2 || defaults.titleLine2,
      subtitle:
        typeof body.subtitle === 'string' ? body.subtitle : current.subtitle || defaults.subtitle,
      subtitleColor:
        typeof body.subtitleColor === 'string'
          ? body.subtitleColor
          : current.subtitleColor || defaults.subtitleColor,
      backgroundImage:
        typeof body.backgroundImage === 'string'
          ? body.backgroundImage
          : current.backgroundImage || defaults.backgroundImage,
      ctaText: typeof body.ctaText === 'string' ? body.ctaText : current.ctaText || defaults.ctaText,
      ctaLink: typeof body.ctaLink === 'string' ? body.ctaLink : current.ctaLink || defaults.ctaLink,
      secondaryCtaText:
        typeof body.secondaryCtaText === 'string'
          ? body.secondaryCtaText
          : current.secondaryCtaText || defaults.secondaryCtaText,
      secondaryCtaLink:
        typeof body.secondaryCtaLink === 'string'
          ? body.secondaryCtaLink
          : current.secondaryCtaLink || defaults.secondaryCtaLink,
    };

    const saved = await saveHeroSettings(payload);

    try {
      await regenerateAndSendInvoice('order-placeholder');
    } catch (error) {
      console.warn('Invoice regeneration skipped:', sanitizeForLog(error));
    }

    return NextResponse.json({ success: true, settings: saved });
  } catch (error) {
    console.error('Error saving hero settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save hero settings' },
      { status: 500 }
    );
  }
}
