import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export interface KnowledgeSectionSettings {
  heading: string;
  subheading: string;
  headingColor: string;
  subheadingColor: string;
}

const DATA_DIR = join(process.cwd(), 'data');
const SETTINGS_PATH = join(DATA_DIR, 'knowledge-settings.json');

const DEFAULT_SETTINGS: KnowledgeSectionSettings = {
  heading: 'WISSENSWERTES RUND UM EDELSTEINE',
  subheading: 'Vertiefen Sie Ihr Edelsteinwissen mit spannenden Artikeln und praktischen Tipps.',
  headingColor: '#ffffff',
  subheadingColor: '#d1d5db',
};

export const loadKnowledgeSectionSettings = async (): Promise<KnowledgeSectionSettings> => {
  try {
    if (!existsSync(SETTINGS_PATH)) {
      return DEFAULT_SETTINGS;
    }
    const raw = await readFile(SETTINGS_PATH, 'utf-8');
    if (!raw.trim()) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return {
      heading: parsed.heading ?? DEFAULT_SETTINGS.heading,
      subheading: parsed.subheading ?? DEFAULT_SETTINGS.subheading,
      headingColor: parsed.headingColor ?? DEFAULT_SETTINGS.headingColor,
      subheadingColor: parsed.subheadingColor ?? DEFAULT_SETTINGS.subheadingColor,
    };
  } catch (error) {
    console.error('Error loading knowledge section settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveKnowledgeSectionSettings = async (settings: KnowledgeSectionSettings): Promise<void> => {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
};
