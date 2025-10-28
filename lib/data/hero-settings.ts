'use server';

import { existsSync, readdirSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { unstable_noStore as noStore } from 'next/cache';

export interface HeroSettingsData {
  title: string;
  titleLine2?: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const DATA_DIR = join(process.cwd(), 'data');
const SETTINGS_PATH = join(DATA_DIR, 'hero-settings.json');
const HERO_UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'hero');
const HERO_DEFAULT_IMAGE = '/uploads/hero/hero-default.jpg';
const PLACEHOLDER_IMAGE = '/images/hero-fallback.jpg';

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

  return PLACEHOLDER_IMAGE;
};

const resolveHeroImage = (candidate?: string): string => {
  const trimmed = candidate?.trim();
  if (trimmed) {
    return trimmed;
  }
  return fallbackHeroImage();
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

export const getDefaultHeroSettings = async (): Promise<HeroSettingsData> => ({
  ...DEFAULT_SETTINGS,
});

export const loadHeroSettings = async (): Promise<HeroSettingsData> => {
  noStore();

  try {
    if (!existsSync(SETTINGS_PATH)) {
      return { ...DEFAULT_SETTINGS };
    }

    const raw = await readFile(SETTINGS_PATH, 'utf-8');
    if (!raw.trim()) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed = JSON.parse(raw) as Partial<HeroSettingsData>;
    return {
      title: parsed.title?.trim() || DEFAULT_SETTINGS.title,
      titleLine2: parsed.titleLine2?.trim() || DEFAULT_SETTINGS.titleLine2,
      subtitle: parsed.subtitle?.trim() || DEFAULT_SETTINGS.subtitle,
      backgroundImage:
        resolveHeroImage(parsed.backgroundImage) || DEFAULT_SETTINGS.backgroundImage,
      ctaText: parsed.ctaText?.trim() || DEFAULT_SETTINGS.ctaText,
      ctaLink: parsed.ctaLink?.trim() || DEFAULT_SETTINGS.ctaLink,
      secondaryCtaText: parsed.secondaryCtaText?.trim() || DEFAULT_SETTINGS.secondaryCtaText,
      secondaryCtaLink: parsed.secondaryCtaLink?.trim() || DEFAULT_SETTINGS.secondaryCtaLink,
    };
  } catch (error) {
    console.error('Error loading hero settings:', error);
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveHeroSettings = async (settings: HeroSettingsData): Promise<void> => {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }

  const data: HeroSettingsData = {
    title: settings.title?.trim() || DEFAULT_SETTINGS.title,
    titleLine2: settings.titleLine2?.trim() || DEFAULT_SETTINGS.titleLine2,
    subtitle: settings.subtitle?.trim() || DEFAULT_SETTINGS.subtitle,
    backgroundImage: settings.backgroundImage?.trim() || DEFAULT_SETTINGS.backgroundImage,
    ctaText: settings.ctaText?.trim() || DEFAULT_SETTINGS.ctaText,
    ctaLink: settings.ctaLink?.trim() || DEFAULT_SETTINGS.ctaLink,
    secondaryCtaText: settings.secondaryCtaText?.trim() || DEFAULT_SETTINGS.secondaryCtaText,
    secondaryCtaLink: settings.secondaryCtaLink?.trim() || DEFAULT_SETTINGS.secondaryCtaLink,
  };

  await writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');
};
