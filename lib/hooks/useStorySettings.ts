'use client';

import { useState, useEffect } from 'react';

type StoryEntry = {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  [key: string]: unknown;
};

type StorySettings = {
  title: string;
  description: string;
  stories: StoryEntry[];
};

const defaultStorySettings: StorySettings = {
  title: 'Unsere Geschichte',
  description: 'Seit über 20 Jahren sind wir Ihr vertrauensvoller Partner für Edelsteine',
  stories: [],
};

export function useStorySettings() {
  const [storySettings, setStorySettings] = useState<StorySettings>(defaultStorySettings);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem('storySettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StorySettings;
        setStorySettings({ ...defaultStorySettings, ...parsed });
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const updateSettings = (newSettings: StorySettings) => {
    setStorySettings(newSettings);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('storySettings', JSON.stringify(newSettings));
    }
  };

  return { storySettings, updateSettings };
}
