'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import type { HeroSettingsData } from '@/lib/data/hero-settings';
import { ParallaxHero } from '@/components/ui/ParallaxHero';

interface HeroSectionProps {
  locale: string;
  settings: HeroSettingsData;
}

const defaultHeroImage = '/uploads/hero/hero-default.jpg';
const defaultTitle = 'Einfach nur GemILike';
const defaultSubtitle = 'Ihr Spezialist für rohe und geschliffene Edelsteine.';
const defaultPrimaryCtaLabel = 'Sortiment entdecken';
const defaultPrimaryCtaLink = '/shop';
const defaultSecondaryCtaLabel = 'Kontaktieren Sie uns';
const defaultSecondaryCtaLink = '/contact';
const HERO_TOP_OFFSET_PX = 85;
const defaultSubtitleColor = '#F4F4FF';

const renderGemLikeTitle = (title: string) => {
  const gemGradientStyle: CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, #6FF3FF 0%, #1F8CFF 50%, #7C4DFF 100%)',
  };

  const lowercaseTitle = title.toLowerCase();
  const gemIndex = lowercaseTitle.indexOf('gem');

  // Wenn "gem" nicht gefunden wird, zeige den Titel normal an
  if (gemIndex === -1) {
    return (
      <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
        {title}
      </span>
    );
  }

  // Teile den Titel: "Einfach nur " + "Gem" + "I" + "Like"
  const prefix = title.slice(0, gemIndex); // "Einfach nur "
  const gemPart = title.slice(gemIndex, gemIndex + 3); // "Gem"
  const iLetter = title[gemIndex + 3]; // Das "I" nach "Gem"
  const afterI = title.slice(gemIndex + 4); // "Like"

  return (
    <>
      {prefix && (
        <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
          {prefix}
        </span>
      )}
      <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
        {gemPart}
      </span>
      {iLetter && iLetter.toLowerCase() === 'i' && (
        <span 
          className="animate-glow drop-shadow-2xl" 
          style={{ 
            color: '#FF7B7B',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          {iLetter}
        </span>
      )}
      {afterI && (
        <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
          {afterI}
        </span>
      )}
    </>
  );
};

export function HeroSection({ locale, settings }: HeroSectionProps) {
  const normalizedSettings: HeroSettingsData = settings ?? {
    title: defaultTitle,
    titleLine2: 'Heroes in Gems------',
    subtitle: defaultSubtitle,
    subtitleColor: defaultSubtitleColor,
    backgroundImage: defaultHeroImage,
    ctaText: defaultPrimaryCtaLabel,
    ctaLink: defaultPrimaryCtaLink,
    secondaryCtaText: defaultSecondaryCtaLabel,
    secondaryCtaLink: defaultSecondaryCtaLink,
  };

  const [heroSrc, setHeroSrc] = useState(
    normalizedSettings.backgroundImage && normalizedSettings.backgroundImage.trim()
      ? normalizedSettings.backgroundImage
      : defaultHeroImage
  );

  useEffect(() => {
    const next =
      normalizedSettings.backgroundImage && normalizedSettings.backgroundImage.trim()
        ? normalizedSettings.backgroundImage
        : defaultHeroImage;
    setHeroSrc(next);
  }, [normalizedSettings.backgroundImage]);

  const heroTitle =
    normalizedSettings.title !== undefined && normalizedSettings.title !== null
      ? normalizedSettings.title
      : defaultTitle;
  const heroSubtitle =
    normalizedSettings.subtitle !== undefined && normalizedSettings.subtitle !== null
      ? normalizedSettings.subtitle
      : defaultSubtitle;
  const heroSubtitleColor =
    normalizedSettings.subtitleColor !== undefined && normalizedSettings.subtitleColor !== null
      ? normalizedSettings.subtitleColor
      : defaultSubtitleColor;
  const titleLine2 =
    normalizedSettings.titleLine2 !== undefined && normalizedSettings.titleLine2 !== null
      ? normalizedSettings.titleLine2
      : undefined;

  // CTA-Variablen derzeit ungenutzt (Buttons vorübergehend entfernt)

  return (
    <section
      className="relative flex min-h-screen w-full items-start justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      lang={locale}
      aria-label="Hero Section"
    >
      {/* Immersive Overlay mit verbessertem Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 dark:from-black/60 dark:via-black/40 dark:to-black/80" />
      
      {/* Parallax-Effekt für Hintergrund */}
      <ParallaxHero speed={0.3}>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      </ParallaxHero>

      <div
        className="relative z-10 w-full max-w-5xl px-6 pb-24 text-white"
        style={{ paddingTop: `${HERO_TOP_OFFSET_PX}px` }}
      >
        <div className="space-y-6 text-left sm:text-center">
          <h1 className="font-bold text-[59px] sm:text-[71px] lg:text-[87px] leading-tight drop-shadow-2xl">
            {renderGemLikeTitle(heroTitle)}
            {titleLine2 && (
              <span className="block text-[30px] sm:text-[38px] lg:text-[44px] font-light text-white/90">
                {titleLine2}
              </span>
            )}
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: heroSubtitleColor }}
          >
            {heroSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
