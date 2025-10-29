'use server';

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

export interface HeroSettingsData {
  title: string;
  titleLine2?: string | null;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
}

const HERO_UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'hero');
const HERO_DEFAULT_IMAGE = '/uploads/hero/hero-default.jpg';
const HERO_FALLBACK_IMAGE = '/images/hero-fallback.jpg';

const fallbackHeroImage = (): string => {
  try {
    if (existsSync(HERO_UPLOAD_DIR)) {
      const files = readdirSync(HERO_UPLOAD_DIR)
        .filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file))
        .sort((a, b) => b.localeCompare(a));
      if (files.length > 0) {
        return `/uploads/hero/${files[0]}`;
      }
    }
  } catch (error) {
    console.warn('fallbackHeroImage error:', error);
  }

  const defaultAbsolute = join(process.cwd(), 'public', HERO_DEFAULT_IMAGE.replace(/^\//, ''));
  if (existsSync(defaultAbsolute)) {
    return HERO_DEFAULT_IMAGE;
  }

  return HERO_FALLBACK_IMAGE;
};

const DEFAULT_SETTINGS: HeroSettingsData = {
  title: 'Einfach nur Gemilike',
  titleLine2: 'Heroes in Gems------',
  subtitle: 'Ihr Spezialist für rohe und geschliffene Edelsteine.',
  backgroundImage: fallbackHeroImage(),
  ctaText: 'Sortiment entdecken',
  ctaLink: '/shop',
  secondaryCtaText: 'Kontaktieren Sie uns',
  secondaryCtaLink: '/contact',
};

const normalizeSettings = (settings?: Partial<HeroSettingsData>): HeroSettingsData => {
  const backgroundImage = settings?.backgroundImage?.trim();
  return {
    title: settings?.title?.trim() || DEFAULT_SETTINGS.title,
    titleLine2: settings?.titleLine2?.trim() || DEFAULT_SETTINGS.titleLine2,
    subtitle: settings?.subtitle?.trim() || DEFAULT_SETTINGS.subtitle,
    backgroundImage: backgroundImage && backgroundImage.length > 0 ? backgroundImage : fallbackHeroImage(),
    ctaText: settings?.ctaText?.trim() || DEFAULT_SETTINGS.ctaText,
    ctaLink: settings?.ctaLink?.trim() || DEFAULT_SETTINGS.ctaLink,
    secondaryCtaText: settings?.secondaryCtaText?.trim() || DEFAULT_SETTINGS.secondaryCtaText,
    secondaryCtaLink: settings?.secondaryCtaLink?.trim() || DEFAULT_SETTINGS.secondaryCtaLink,
  };
};

export const getDefaultHeroSettings = async (): Promise<HeroSettingsData> => ({
  ...DEFAULT_SETTINGS,
});

export const loadHeroSettings = async (): Promise<HeroSettingsData> => {
  noStore();

  const record = await prisma.heroSettings.findUnique({
    where: { id: 1 },
  });

  if (!record) {
    return { ...DEFAULT_SETTINGS };
  }

  return normalizeSettings({
    title: record.title,
    titleLine2: record.titleLine2 ?? undefined,
    subtitle: record.subtitle,
    backgroundImage: record.backgroundImage,
    ctaText: record.ctaText,
    ctaLink: record.ctaLink,
    secondaryCtaText: record.secondaryCtaText ?? undefined,
    secondaryCtaLink: record.secondaryCtaLink ?? undefined,
  });
};

export const saveHeroSettings = async (settings: HeroSettingsData): Promise<HeroSettingsData> => {
  const normalized = normalizeSettings(settings);

  await prisma.heroSettings.upsert({
    where: { id: 1 },
    update: {
      title: normalized.title,
      titleLine2: normalized.titleLine2,
      subtitle: normalized.subtitle,
      backgroundImage: normalized.backgroundImage,
      ctaText: normalized.ctaText,
      ctaLink: normalized.ctaLink,
      secondaryCtaText: normalized.secondaryCtaText,
      secondaryCtaLink: normalized.secondaryCtaLink,
    },
    create: {
      id: 1,
      title: normalized.title,
      titleLine2: normalized.titleLine2,
      subtitle: normalized.subtitle,
      backgroundImage: normalized.backgroundImage,
      ctaText: normalized.ctaText,
      ctaLink: normalized.ctaLink,
      secondaryCtaText: normalized.secondaryCtaText,
      secondaryCtaLink: normalized.secondaryCtaLink,
    },
  });

  return normalized;
};
