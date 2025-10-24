import fs from 'fs';
import path from 'path';
import type { NewstickerItem } from '@/lib/types/newsticker';

const DATA_DIR = path.join(process.cwd(), 'data');
const NEWSTICKER_FILE = path.join(DATA_DIR, 'newsticker.json');

const ensureDataDirectory = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

export const loadNewstickerData = (): NewstickerItem[] => {
  try {
    if (fs.existsSync(NEWSTICKER_FILE)) {
      const raw = fs.readFileSync(NEWSTICKER_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }))
        : [];
    }
  } catch (error) {
    console.error('Newsticker: Fehler beim Laden der Daten.', error);
  }
  return [];
};

export const saveNewstickerData = (items: NewstickerItem[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(
      NEWSTICKER_FILE,
      JSON.stringify(
        items.map((item) => ({
          ...item,
          createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
          updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
        })),
        null,
        2
      )
    );
  } catch (error) {
    console.error('Newsticker: Fehler beim Speichern der Daten.', error);
    throw error;
  }
};
