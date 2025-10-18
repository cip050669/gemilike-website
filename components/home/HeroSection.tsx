'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Gem } from 'lucide-react';
import Link from 'next/link';
import { useHeroSettings } from '@/lib/hooks/useHeroSettings';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const { settings, isLoading, resetSettings } = useHeroSettings();
  

  const renderGemLikeTitle = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    const targetIndex = lowercaseTitle.indexOf('gemilike');

    if (targetIndex === -1) {
      return <span className="gradient-text animate-glow">{title}</span>;
    }

    const prefix = title.slice(0, targetIndex);
    const highlightedWord = title.slice(targetIndex, targetIndex + 'gemilike'.length);
    const suffix = title.slice(targetIndex + 'gemilike'.length);

    const gemWordLower = highlightedWord.toLowerCase();
    const firstIIndex = gemWordLower.indexOf('i');

    if (firstIIndex === -1) {
      return <span className="gradient-text animate-glow">{title}</span>;
    }

    const beforeI = highlightedWord.slice(0, firstIIndex);
    const iLetter = highlightedWord[firstIIndex];
    const afterI = highlightedWord.slice(firstIIndex + 1);

    return (
      <>
        {prefix && (
          <span className="gradient-text animate-glow">{prefix}</span>
        )}
        {beforeI && (
          <span className="gradient-text animate-glow">{beforeI}</span>
        )}
        <span className="text-ruby animate-glow drop-shadow-2xl">{iLetter}</span>
        {afterI && (
          <span className="gradient-text animate-glow">{afterI}</span>
        )}
        {suffix && (
          <span className="gradient-text animate-glow">{suffix}</span>
        )}
      </>
    );
  };

  // Automatische Cache-Bereinigung wenn alter Pfad erkannt wird
  if (settings.imageUrl === '/products/emerald-001-2.jpg') {
    resetSettings();
  }

  // Fallback-Einstellungen falls localStorage leer ist
  const heroSettings = {
    imageUrl: settings.imageUrl?.trim() ? settings.imageUrl : '/uploads/hero/hero-1759840578273.jpg',
    title: settings.title || 'Einfach nur Gemilike',
    titleLine2: settings.titleLine2 !== undefined ? settings.titleLine2 : 'Heroes in Gems',
    subtitle: settings.subtitle || 'Ihr Spezialist für rohe und geschliffene Edelsteine.',
    primaryButtonText: settings.primaryButtonText || 'Sortiment entdecken',
    secondaryButtonText: settings.secondaryButtonText || 'Kontaktieren Sie uns',
    primaryButtonLink: settings.primaryButtonLink || '/shop',
    secondaryButtonLink: settings.secondaryButtonLink || '/contact'
  };

  // Entferne den Loading-Zustand, da er den Text-Bereich verhindert


  return (
    <>
      {/* Hero-Bild mit Text links oben */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen w-full overflow-hidden">
        {/* Fallback Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/50 to-accent/30" />
        
        <div className="absolute inset-0">
          <img
            src={heroSettings.imageUrl}
            alt="Exquisite Edelsteine - Gemilike"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback zu einem anderen Hero-Bild
              const target = e.target as HTMLImageElement;
              target.src = '/uploads/hero/hero-1759791144832.jpg';
            }}
          />
        </div>
        
        {/* Text-Overlay - Mobile optimiert */}
        <div className="absolute top-2 left-2 right-2 sm:top-8 sm:left-8 sm:right-auto lg:top-12 lg:left-12 z-10">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-1 sm:mb-2 md:mb-4 text-white drop-shadow-2xl">
            {renderGemLikeTitle(heroSettings.title)}
          </h1>
          {heroSettings.titleLine2 && (
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight mb-1 sm:mb-2 md:mb-4 text-white drop-shadow-2xl">
              {renderGemLikeTitle(heroSettings.titleLine2)}
            </h2>
          )}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white drop-shadow-2xl max-w-xs sm:max-w-md md:max-w-lg leading-relaxed">
            {heroSettings.subtitle}
          </p>
        </div>
      </section>

      {/* Button-Leiste wird außerhalb platziert */}
    </>
  );
}
