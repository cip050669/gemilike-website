'use client';

import Link from 'next/link';

interface HeroSectionSettings {
  title?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

interface HeroSectionProps {
  settings?: HeroSectionSettings | null;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const title = settings?.title || 'Gemilike - Heroes in Gems';
  const subtitle = settings?.subtitle || 'Ihr Spezialist für rohe und geschliffene Edelsteine';
  const ctaLabel = settings?.ctaLabel || 'Entdecken Sie unsere Edelsteine';
  const ctaHref = settings?.ctaHref || '/de/shop';

  return (
    <section className="bg-gem-energy text-gem-text py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">{title}</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <Link
          href={ctaHref}
          className="inline-block bg-gem-fire text-gem-bgDark px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gem-fireLight hover:text-gem-bgDark transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
