'use client';

import { useState, useEffect } from 'react';

export function useStorySettings() {
  const [storySettings, setStorySettings] = useState({
    title: 'Unsere Geschichte',
    description: 'Seit über 20 Jahren sind wir Ihr vertrauensvoller Partner für Edelsteine',
    stories: []
  });

  useEffect(() => {
    // Load settings from localStorage or API
    const saved = localStorage.getItem('storySettings');
    if (saved) {
      setStorySettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: any) => {
    setStorySettings(newSettings);
    localStorage.setItem('storySettings', JSON.stringify(newSettings));
  };

  return { storySettings, updateSettings };
}