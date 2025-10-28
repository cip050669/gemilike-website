'use client';

import { useHeroSettings } from '@/lib/hooks/useHeroSettings';
import GemILikeLogo from '@/components/GemILikeLogo';
import Image from 'next/image';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const { heroSettings } = useHeroSettings();

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

  // Fallback-Einstellungen (currently unused, kept for reference)

  const currentSettings = {
    imageUrl: '/uploads/hero/hero-1759840578273.jpg',
    title: 'Einfach nur Gemilike',
    subtitle: 'Ihr Spezialist für rohe und geschliffene Edelsteine.',
  };

  // Debug: Log the current settings
  console.log('Hero Settings:', heroSettings);
  console.log('Current Settings:', currentSettings);

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
            src="/images/hero-fallback.jpg"
            alt="Exquisite Edelsteine - Gemilike"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        
        {/* Text-Overlay - Mobile optimiert */}
        <div className="absolute z-10" style={{ top: '80px', left: '16px', right: '16px' }}>
         <div className="mb-4">
           <GemILikeLogo 
             size={80} 
             animated={false}
             firstIColor="#FF7B7B"
             tagline="Heroes in Gems"
             className="text-center"
             gradientClassName="gradient-gem-spectrum"
           />
         </div>
         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-4">
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
