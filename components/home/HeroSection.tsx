'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import type { HeroSettingsData } from '@/lib/data/hero-settings';

interface HeroSectionProps {
  locale: string;
  settings: HeroSettingsData;
}

const defaultHeroImage = '/uploads/hero/hero-default.jpg';
const defaultTitle = 'Einfach nur Gemilike';
const defaultSubtitle = 'Ihr Spezialist für rohe und geschliffene Edelsteine.';
const defaultPrimaryCtaLabel = 'Sortiment entdecken';
const defaultPrimaryCtaLink = '/shop';
const defaultSecondaryCtaLabel = 'Kontaktieren Sie uns';
const defaultSecondaryCtaLink = '/contact';
const HERO_TOP_OFFSET_PX = 85;

const renderGemLikeTitle = (title: string) => {
  const gemGradientStyle: CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, #6FF3FF 0%, #1F8CFF 50%, #7C4DFF 100%)',
  };

  const lowercaseTitle = title.toLowerCase();
  const targetIndex = lowercaseTitle.indexOf('gemilike');

  if (targetIndex === -1) {
    return (
      <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
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
        <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
          {prefix}
        </span>
      )}
      {beforeI && (
        <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
          {beforeI}
        </span>
      )}
      <span className="animate-glow drop-shadow-2xl" style={{ color: '#FF7B7B' }}>
        {iLetter}
      </span>
      {afterI && (
        <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
          {afterI}
        </span>
      )}
      {suffix && (
        <span className="bg-clip-text text-transparent animate-glow" style={gemGradientStyle}>
          {suffix}
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
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

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

          <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-white/90 max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
