'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Award, MapPin, Weight } from 'lucide-react';
import { Gemstone, isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';
import { Button } from '@/components/ui/button';

interface NewGemstonesCarouselProps {
  gemstones: Gemstone[];
  locale: string;
  description?: string;
}

const getWeightLabel = (gemstone: Gemstone) => {
  if (isCutGemstone(gemstone)) {
    return `${gemstone.caratWeight.toFixed(2)} ct`;
  }
  if (isRoughGemstone(gemstone)) {
    return `${gemstone.gramWeight.toFixed(2)} g`;
  }
  return 'N/A';
};

const getCertificationLabel = (gemstone: Gemstone) => {
  if (gemstone.certification?.certified) {
    return gemstone.certification.lab || 'Zertifiziert';
  }
  return 'Keine Zertifizierung';
};

export function NewGemstonesCarousel({ gemstones, locale, description }: NewGemstonesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => gemstones ?? [], [gemstones]);

  if (items.length === 0) {
    return null;
  }

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 260; // card width + gap
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="main-container space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-white/60">Neu im Sortiment</p>
          <h2 className="text-3xl md:text-4xl font-impact font-weight-impact text-white">
            Neue Edelsteine
          </h2>
          {description && (
            <p className="text-sm md:text-base text-white/70 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-full border-white/40 text-white bg-white/10 hover:bg-white/20"
            onClick={() => handleScroll('left')}
            aria-label="Vorherige Edelsteine"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-full border-white/40 text-white bg-white/10 hover:bg-white/20"
            onClick={() => handleScroll('right')}
            aria-label="Nächste Edelsteine"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent snap-x snap-mandatory pb-2"
        >
          {items.map((gemstone) => {
            const imageSrc = gemstone.mainImage || gemstone.images?.[0] || '/products/placeholder-gem.jpg';
            const certificationLabel = getCertificationLabel(gemstone);
            const weightLabel = getWeightLabel(gemstone);

            return (
              <Link
                key={gemstone.id}
                href={`/${locale}/shop?focus=${encodeURIComponent(gemstone.id)}`}
                className="group min-w-[240px] max-w-[240px] snap-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <article className="story-card bg-[#2D2D2D]/90 border border-white/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="overflow-hidden rounded-lg mb-4">
                    <div className="aspect-[4/3] relative bg-black/30">
                      <Image
                        src={imageSrc}
                        alt={gemstone.name}
                        fill
                        sizes="240px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={false}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-white line-clamp-1">{gemstone.name}</h3>
                      {gemstone.isNew && (
                        <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wide">
                          Neu
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="inline-flex items-center gap-1">
                        <Weight className="h-3 w-3" /> {weightLabel}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {gemstone.origin}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="inline-flex items-center gap-1">
                        <Award className="h-3 w-3" /> {certificationLabel}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        €{gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/60">
                      Kategorie: <span className="text-white">{gemstone.category}</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden justify-center gap-3 mt-4">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-full border-white/40 text-white bg-white/10 hover:bg-white/20"
            onClick={() => handleScroll('left')}
            aria-label="Vorherige Edelsteine"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-full border-white/40 text-white bg-white/10 hover:bg-white/20"
            onClick={() => handleScroll('right')}
            aria-label="Nächste Edelsteine"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
