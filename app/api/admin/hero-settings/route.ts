import { NextRequest, NextResponse } from 'next/server';
import {
  HeroSettingsData,
  loadHeroSettings,
  saveHeroSettings,
  getDefaultHeroSettings,
} from '@/lib/data/hero-settings';

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
    const defaults = await getDefaultHeroSettings();

    const payload: HeroSettingsData = {
      title: typeof body.title === 'string' ? body.title : defaults.title,
      titleLine2: typeof body.titleLine2 === 'string' ? body.titleLine2 : defaults.titleLine2,
      subtitle: typeof body.subtitle === 'string' ? body.subtitle : defaults.subtitle,
      backgroundImage:
        typeof body.backgroundImage === 'string' ? body.backgroundImage : defaults.backgroundImage,
      ctaText: typeof body.ctaText === 'string' ? body.ctaText : defaults.ctaText,
      ctaLink: typeof body.ctaLink === 'string' ? body.ctaLink : defaults.ctaLink,
      secondaryCtaText:
        typeof body.secondaryCtaText === 'string'
          ? body.secondaryCtaText
          : defaults.secondaryCtaText,
      secondaryCtaLink:
        typeof body.secondaryCtaLink === 'string'
          ? body.secondaryCtaLink
          : defaults.secondaryCtaLink,
    };

    await saveHeroSettings(payload);
    return NextResponse.json({ success: true, settings: payload });
  } catch (error) {
    console.error('Error saving hero settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save hero settings' },
      { status: 500 }
    );
  }
}
