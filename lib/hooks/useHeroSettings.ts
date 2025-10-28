'use client';

import { useState, useEffect } from 'react';

const defaultSettings = {
  title: 'Gemilike - Heroes in Gems',
  subtitle: 'Ihr Spezialist für rohe und geschliffene Edelsteine',
  backgroundImage: '/uploads/hero/hero-1759840578273.jpg',
  ctaText: 'Entdecken Sie unsere Edelsteine',
  ctaLink: '/gemstones',
};

type HeroSettings = typeof defaultSettings;

export function useHeroSettings() {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(defaultSettings);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadSettings = async () => {
      try {
        // Versuche zuerst die API
        const response = await fetch('/api/admin/hero-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            const apiSettings = {
              title: data.settings.title || defaultSettings.title,
              subtitle: data.settings.subtitle || defaultSettings.subtitle,
              backgroundImage: data.settings.imageUrl || defaultSettings.backgroundImage,
              ctaText: data.settings.primaryButtonText || defaultSettings.ctaText,
              ctaLink: data.settings.primaryButtonLink || defaultSettings.ctaLink,
            };
            setHeroSettings(apiSettings);
            return;
          }
        }
      } catch (error) {
        // Fallback zu localStorage
      }

      // Fallback zu localStorage
      const saved = window.localStorage.getItem('heroSettings');
      const legacySaved = window.localStorage.getItem('heroImageSettings');

      let parsedSettings: Partial<HeroSettings> = {};

      if (saved) {
        try {
          parsedSettings = { ...parsedSettings, ...JSON.parse(saved) as Partial<HeroSettings> };
        } catch { /* ignore */ }
      }

      if (legacySaved) {
        try {
          const legacyParsed = JSON.parse(legacySaved) as { imageUrl?: string; title?: string; subtitle?: string; primaryButtonText?: string; primaryButtonLink?: string; };
          if (legacyParsed.imageUrl) parsedSettings.backgroundImage = legacyParsed.imageUrl;
          if (legacyParsed.title) parsedSettings.title = legacyParsed.title;
          if (legacyParsed.subtitle) parsedSettings.subtitle = legacyParsed.subtitle;
          if (legacyParsed.primaryButtonText) parsedSettings.ctaText = legacyParsed.primaryButtonText;
          if (legacyParsed.primaryButtonLink) parsedSettings.ctaLink = legacyParsed.primaryButtonLink;
        } catch { /* ignore */ }
      }
      
      setHeroSettings({ ...defaultSettings, ...parsedSettings });
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: HeroSettings) => {
    setHeroSettings(newSettings);
    if (typeof window !== 'undefined') {
      // Speichere in localStorage
      window.localStorage.setItem('heroSettings', JSON.stringify(newSettings));
      // Also update legacy key for backward compatibility
      window.localStorage.setItem('heroImageSettings', JSON.stringify({
        imageUrl: newSettings.backgroundImage,
        title: newSettings.title,
        subtitle: newSettings.subtitle,
        primaryButtonText: newSettings.ctaText,
        primaryButtonLink: newSettings.ctaLink,
      }));
      
      // Versuche auch die API zu aktualisieren
      try {
        await fetch('/api/admin/hero-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: newSettings.backgroundImage,
            title: newSettings.title,
            subtitle: newSettings.subtitle,
            primaryButtonText: newSettings.ctaText,
            primaryButtonLink: newSettings.ctaLink,
          })
        });
      } catch (error) {
        // Silent error - localStorage ist bereits gespeichert
      }
      
      window.dispatchEvent(new CustomEvent('hero-settings-updated'));
    }
  };

  return { heroSettings, updateSettings };
}