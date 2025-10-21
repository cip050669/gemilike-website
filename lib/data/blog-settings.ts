import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export interface BlogSectionSettings {
  heading: string;
  subheading: string;
  headingColor: string;
  subheadingColor: string;
}

const DATA_DIR = join(process.cwd(), 'data');
const SETTINGS_PATH = join(DATA_DIR, 'blog-settings.json');

const DEFAULT_SETTINGS: BlogSectionSettings = {
  heading: 'GESCHICHTEN UM EDELSTEINE',
  subheading: 'Entdecken Sie die faszinierenden Geschichten und Mythen hinter unseren Edelsteinen',
  headingColor: '#ffffff',
  subheadingColor: '#d1d5db',
};

export const loadBlogSectionSettings = async (): Promise<BlogSectionSettings> => {
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
    console.error('Error loading blog section settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveBlogSectionSettings = async (settings: BlogSectionSettings): Promise<void> => {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
};
