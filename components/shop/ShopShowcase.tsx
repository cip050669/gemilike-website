'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MediaGallery } from '@/components/shop/MediaGallery';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { ShopGemstone } from '@/components/shop/GemstoneGrid';
import { cn } from '@/lib/utils';

interface ShopShowcaseProps {
  gemstones: ShopGemstone[];
  fallback?: boolean;
}

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

export function ShopShowcase({ gemstones, fallback = false }: ShopShowcaseProps) {
  const newGemstones = useMemo(
    () => gemstones.filter((gem) => gem.isNew),
    [gemstones]
  );

  const regularGemstones = useMemo(
    () => gemstones.filter((gem) => !gem.isNew),
    [gemstones]
  );

  const firstAvailable = gemstones[0] ?? null;
  const [selectedGemstone, setSelectedGemstone] = useState<ShopGemstone | null>(firstAvailable);

  const toCartItem = (gemstone: ShopGemstone) => ({
    id: gemstone.id,
    name: gemstone.name,
    price: gemstone.price,
    image: gemstone.images[0],
    category: gemstone.category,
    weight: typeof gemstone.weight === 'number' ? gemstone.weight : undefined,
    origin: gemstone.origin ?? undefined,
  });

  const renderCarousel = (
    items: ShopGemstone[],
    label: string,
    subtitle: string,
    showNewBadge = false
  ) => {
    if (items.length === 0) {
      return null;
    }

    return (
      <section className="main-container space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-white/60">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-impact font-weight-impact text-white">
              {label}
            </h2>
            {fallback && (
              <p className="text-xs text-white/50">
                Hinweis: Temporäre Beispiel-Daten, da aktuell keine Datenbankverbindung möglich war.
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-[75px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {items.map((gemstone) => {
              const imageSrc = gemstone.images[0] ?? PLACEHOLDER_IMAGE;
              const isSelected = selectedGemstone?.id === gemstone.id;

              return (
                <button
                  key={gemstone.id}
                  type="button"
                  onClick={() => setSelectedGemstone(gemstone)}
                  className={cn(
                    'group min-w-[240px] max-w-[240px] snap-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
                    isSelected && 'scale-95 opacity-100'
                  )}
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
                        />
                      </div>
                    </div>
                    <div className="space-y-3 px-2 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-white line-clamp-1">
                          {gemstone.name}
                        </h3>
                        {showNewBadge && gemstone.isNew && (
                          <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wide">
                            Neu
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/80">
                        {typeof gemstone.weight === 'number' && (
                          <span className="inline-flex items-center gap-1">
                            Gewicht {gemstone.weight.toFixed(2)} {gemstone.weightUnit ?? 'ct'}
                          </span>
                        )}
                        {gemstone.origin && (
                          <span className="inline-flex items-center gap-1">
                            Herkunft {gemstone.origin}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/80">
                        <span className="inline-flex items-center gap-1">
                          Kategorie {gemstone.category}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          €{gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/60">Bestand: {gemstone.stock}</div>
                    </div>
                  </article>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-12">
      {renderCarousel(newGemstones, 'Neue Edelsteine', 'Highlights', true)}
      {renderCarousel(
        regularGemstones.length ? regularGemstones : newGemstones,
        'Bestand',
        'Verfügbare Edelsteine',
        false
      )}

      {selectedGemstone && (
        <section className="main-container max-w-4xl mx-auto">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-white">{selectedGemstone.name}</h2>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-white/55">
                <Badge variant="secondary">{selectedGemstone.category}</Badge>
                <Badge variant="outline">
                  {selectedGemstone.type === 'cut' ? 'Geschliffener Stein' : 'Rohstein'}
                </Badge>
                {selectedGemstone.isNew && <Badge variant="accent">Neu</Badge>}
                {!selectedGemstone.inStock && <Badge variant="destructive">Nicht verfügbar</Badge>}
              </div>
            </div>

            <MediaGallery
              images={selectedGemstone.images.length ? selectedGemstone.images : [PLACEHOLDER_IMAGE]}
              videos={selectedGemstone.videos}
              gemName={selectedGemstone.name}
              className="rounded-xl"
              inStock={selectedGemstone.inStock}
            />

            <div className="grid gap-6 md:grid-cols-2 text-sm text-white/80">
              {selectedGemstone.description && (
                <DetailBlock title="Beschreibung">
                  {selectedGemstone.description}
                </DetailBlock>
              )}
              <DetailBlock title="Preis">
                €{selectedGemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </DetailBlock>
              <DetailBlock title="Bestand">{selectedGemstone.stock} Stück</DetailBlock>
              {typeof selectedGemstone.weight === 'number' && (
                <DetailBlock title="Gewicht">
                  {selectedGemstone.weight.toFixed(2)} {selectedGemstone.weightUnit ?? 'ct'}
                </DetailBlock>
              )}
              {selectedGemstone.origin && (
                <DetailBlock title="Herkunft">{selectedGemstone.origin}</DetailBlock>
              )}
              {selectedGemstone.color && (
                <DetailBlock title="Farbe">{selectedGemstone.color}</DetailBlock>
              )}
              {selectedGemstone.clarity && (
                <DetailBlock title="Klarheit">{selectedGemstone.clarity}</DetailBlock>
              )}
              {selectedGemstone.cut && (
                <DetailBlock title="Schliff">{selectedGemstone.cut}</DetailBlock>
              )}
              {selectedGemstone.treatment && (
                <DetailBlock title="Behandlung">{selectedGemstone.treatment}</DetailBlock>
              )}
              {selectedGemstone.certification && (
                <DetailBlock title="Zertifizierung">{selectedGemstone.certification}</DetailBlock>
              )}
              {selectedGemstone.rarity && (
                <DetailBlock title="Seltenheit">{selectedGemstone.rarity}</DetailBlock>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <AddToCartButton item={toCartItem(selectedGemstone)} />
              <WishlistButton item={toCartItem(selectedGemstone)} />
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setSelectedGemstone(null)}
              >
                Auswahl zurücksetzen
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-4">
      <p className="text-xs uppercase tracking-wide text-white/45">{title}</p>
      <p className="mt-2 text-sm text-white/90 leading-relaxed">{children}</p>
    </div>
  );
}
