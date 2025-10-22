'use client';

import { useState, useEffect } from 'react';

const defaultSettings = {
  title: 'Gemilike - Heroes in Gems',
  subtitle: 'Ihr Spezialist für rohe und geschliffene Edelsteine',
  backgroundImage: null as string | null,
  ctaText: 'Entdecken Sie unsere Edelsteine',
  ctaLink: '/gemstones',
};

type HeroSettings = typeof defaultSettings;

export function useHeroSettings() {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(defaultSettings);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem('heroSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as HeroSettings;
        setHeroSettings({ ...defaultSettings, ...parsed });
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const updateSettings = (newSettings: HeroSettings) => {
    setHeroSettings(newSettings);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('heroSettings', JSON.stringify(newSettings));
    }
  };

  return { heroSettings, updateSettings };
}
