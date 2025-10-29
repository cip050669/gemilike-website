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
const HERO_SETTINGS_ID = 'singleton';

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

const normalizeText = (value: string | null | undefined, fallback: string): string => {
  if (value === undefined || value === null) return fallback;
  return value.trim();
};

const normalizeOptionalText = (
  value: string | null | undefined,
  fallback: string | null | undefined
): string => {
  if (value === undefined || value === null) return fallback ?? '';
  return value.trim();
};

const normalizeSettings = (settings?: Partial<HeroSettingsData>): HeroSettingsData => {
  const backgroundImageCandidate = settings?.backgroundImage;
  const backgroundImageTrimmed = backgroundImageCandidate?.trim();

  const backgroundImage =
    backgroundImageCandidate === undefined || backgroundImageCandidate === null
      ? DEFAULT_SETTINGS.backgroundImage
      : backgroundImageTrimmed && backgroundImageTrimmed.length > 0
        ? backgroundImageTrimmed
        : fallbackHeroImage();

  return {
    title: normalizeText(settings?.title, DEFAULT_SETTINGS.title),
    titleLine2: normalizeOptionalText(settings?.titleLine2, DEFAULT_SETTINGS.titleLine2),
    subtitle: normalizeText(settings?.subtitle, DEFAULT_SETTINGS.subtitle),
    backgroundImage,
    ctaText: normalizeText(settings?.ctaText, DEFAULT_SETTINGS.ctaText),
    ctaLink: normalizeText(settings?.ctaLink, DEFAULT_SETTINGS.ctaLink),
    secondaryCtaText: normalizeOptionalText(
      settings?.secondaryCtaText,
      DEFAULT_SETTINGS.secondaryCtaText
    ),
    secondaryCtaLink: normalizeOptionalText(
      settings?.secondaryCtaLink,
      DEFAULT_SETTINGS.secondaryCtaLink
    ),
  };
};

export const getDefaultHeroSettings = async (): Promise<HeroSettingsData> => ({
  ...DEFAULT_SETTINGS,
});

export const loadHeroSettings = async (): Promise<HeroSettingsData> => {
  noStore();

  const record = await prisma.heroSettings.findUnique({
    where: { id: HERO_SETTINGS_ID },
  });

  if (!record) {
    return { ...DEFAULT_SETTINGS };
  }

  return normalizeSettings({
    title: record.title,
    titleLine2: record.titleLine2 ?? undefined,
    subtitle: record.subtitle,
    backgroundImage: record.imageUrl,
    ctaText: record.primaryButtonText,
    ctaLink: record.primaryButtonLink,
    secondaryCtaText: record.secondaryButtonText ?? undefined,
    secondaryCtaLink: record.secondaryButtonLink ?? undefined,
  });
};

export const saveHeroSettings = async (settings: HeroSettingsData): Promise<HeroSettingsData> => {
  const normalized = normalizeSettings(settings);

  await prisma.heroSettings.upsert({
    where: { id: HERO_SETTINGS_ID },
    update: {
      title: normalized.title,
      titleLine2: normalized.titleLine2,
      subtitle: normalized.subtitle,
      imageUrl: normalized.backgroundImage,
      primaryButtonText: normalized.ctaText,
      primaryButtonLink: normalized.ctaLink,
      secondaryButtonText: normalized.secondaryCtaText,
      secondaryButtonLink: normalized.secondaryCtaLink,
    },
    create: {
      id: HERO_SETTINGS_ID,
      title: normalized.title,
      titleLine2: normalized.titleLine2,
      subtitle: normalized.subtitle,
      imageUrl: normalized.backgroundImage,
      primaryButtonText: normalized.ctaText,
      primaryButtonLink: normalized.ctaLink,
      secondaryButtonText: normalized.secondaryCtaText,
      secondaryButtonLink: normalized.secondaryCtaLink,
    },
  });

  return normalized;
};
