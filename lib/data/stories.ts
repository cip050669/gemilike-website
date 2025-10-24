import fs from 'fs';
import path from 'path';
import { Story } from '@/lib/types/story';

const STORIES_FILE = path.join(process.cwd(), 'data', 'stories.json');

const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

export const loadStoriesData = (): Story[] => {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(STORIES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(STORIES_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading stories data:', error);
    return [];
  }
};

export const saveStoriesData = (data: Story[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(STORIES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving stories data:', error);
    throw error;
  }
};
