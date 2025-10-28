'use client';

import { useState, useEffect } from 'react';
import { useHeroSettings } from '@/lib/hooks/useHeroSettings';
import Image from 'next/image';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const { heroSettings } = useHeroSettings();
  const [heroSrc, setHeroSrc] = useState<string>(
    heroSettings?.backgroundImage && heroSettings.backgroundImage.trim()
      ? heroSettings.backgroundImage
      : '/images/hero-fallback.jpg'
  );

  useEffect(() => {
    const next = heroSettings?.backgroundImage && heroSettings.backgroundImage.trim()
      ? heroSettings.backgroundImage
      : '/images/hero-fallback.jpg';
    setHeroSrc(next);
  }, [heroSettings?.backgroundImage]);

  // Listen for hero settings updates
  useEffect(() => {
    const handleSettingsUpdate = async () => {
      try {
        const response = await fetch('/api/admin/hero-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            if (data.settings.imageUrl) {
              setHeroSrc(data.settings.imageUrl);
            }
            // Update heroSettings für Titel-Updates
            if (data.settings.title || data.settings.subtitle) {
              const updatedSettings = {
                ...heroSettings,
                title: data.settings.title || heroSettings?.title,
                subtitle: data.settings.subtitle || heroSettings?.subtitle,
              };
              // Trigger re-render durch localStorage update
              localStorage.setItem('heroSettings', JSON.stringify(updatedSettings));
              window.dispatchEvent(new CustomEvent('hero-settings-updated'));
            }
          }
        }
      } catch (error) {
        // Fallback zu localStorage
        const saved = localStorage.getItem('heroImageSettings');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.imageUrl) {
              setHeroSrc(parsed.imageUrl);
            }
          } catch (error) {
            // Silent error handling
          }
        }
      }
    };

    window.addEventListener('hero-settings-updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('hero-settings-updated', handleSettingsUpdate);
    };
  }, [heroSettings]);

  const renderGemLikeTitle = (title: string) => {
    // Custom gradient for the word "Gemilike": cyan -> mid blue -> mid purple
    // Colors: #6FF3FF -> #1F8CFF -> #7C4DFF (high saturation, medium lightness)
    const gemGradientStyle: React.CSSProperties = {
      backgroundImage:
        'linear-gradient(90deg, #6FF3FF 0%, #1F8CFF 50%, #7C4DFF 100%)',
    };
    const lowercaseTitle = title.toLowerCase();
    const targetIndex = lowercaseTitle.indexOf('gemilike');

    if (targetIndex === -1) {
      return (
        <span
          className="bg-clip-text text-transparent animate-glow"
          style={gemGradientStyle}
        >
          {title}
        </span>
      );
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
          <span
            className="bg-clip-text text-transparent animate-glow"
            style={gemGradientStyle}
          >
            {prefix}
          </span>
        )}
        {beforeI && (
          <span
            className="bg-clip-text text-transparent animate-glow"
            style={gemGradientStyle}
          >
            {beforeI}
          </span>
        )}
        <span className="animate-glow drop-shadow-2xl" style={{ color: '#FF7B7B' }}>{iLetter}</span>
        {afterI && (
          <span
            className="bg-clip-text text-transparent animate-glow"
            style={gemGradientStyle}
          >
            {afterI}
          </span>
        )}
        {suffix && (
          <span
            className="bg-clip-text text-transparent animate-glow"
            style={gemGradientStyle}
          >
            {suffix}
          </span>
        )}
      </>
    );
  };

  // Fallback-Einstellungen (currently unused, kept for reference)

  const currentSettings = {
    title: heroSettings?.title || 'Einfach nur Gemilike',
    subtitle: heroSettings?.subtitle || 'Ihr Spezialist für rohe und geschliffene Edelsteine.',
  };

  // Debug: Log the current settings
  console.log('Hero Settings:', heroSettings);

  return (
    <>
      {/* Hero-Bild mit Text links oben */}
      <section
        className="relative h-screen w-full overflow-hidden"
        style={{ fontFamily: 'Arial, sans-serif' }}
        lang={locale}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={heroSrc}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
            onError={() => setHeroSrc('/images/hero-fallback.jpg')}
          />
        </div>
        
        {/* Text-Overlay - Mobile optimiert */}
        <div className="absolute z-10" style={{ top: '110px', left: '16px', right: '16px' }}>
         <h1 className="text-[40px] sm:text-[46px] lg:text-[58px] font-bold text-white drop-shadow-lg mb-4">
           {renderGemLikeTitle(currentSettings.title)}
         </h1>
         <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-md md:max-w-lg leading-relaxed text-white">
           {currentSettings.subtitle}
         </p>
        </div>
      </section>

      {/* Button-Leiste wird außerhalb platziert */}
    </>
  );
}
