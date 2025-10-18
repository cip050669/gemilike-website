'use client';

import { useState, useEffect } from 'react';

export function useHeroSettings() {
  const [heroSettings, setHeroSettings] = useState({
    title: 'Gemilike - Heroes in Gems',
    subtitle: 'Ihr Spezialist für rohe und geschliffene Edelsteine',
    backgroundImage: null,
    ctaText: 'Entdecken Sie unsere Edelsteine',
    ctaLink: '/gemstones'
  });

  useEffect(() => {
    // Load settings from localStorage or API
    const saved = localStorage.getItem('heroSettings');
    if (saved) {
      setHeroSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: any) => {
    setHeroSettings(newSettings);
    localStorage.setItem('heroSettings', JSON.stringify(newSettings));
  };

  return { heroSettings, updateSettings };
}