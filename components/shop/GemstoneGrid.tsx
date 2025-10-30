'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MediaGallery } from '@/components/shop/MediaGallery';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { GemIcon, MapPin, Ruler, Scale } from 'lucide-react';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { cn } from '@/lib/utils';

export interface ShopGemstone {
  id: string;
  slug?: string;
  name: string;
  category: string;
  type: 'cut' | 'rough';
  price: number;
  currency?: string;
  weight?: number | null;
  weightUnit?: 'ct' | 'g';
  origin?: string | null;
  color?: string | null;
  colorSaturation?: string | null;
  clarity?: string | null;
  cut?: string | null;
  treatment?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  certification?: string | null;
  rarity?: string | null;
  dimensions?: {
    length?: number | null;
    width?: number | null;
    height?: number | null;
  };
  inStock: boolean;
  isSold: boolean;
  stock: number;
  isNew: boolean;
  images: string[];
  videos: string[];
}

export interface GemstoneGridProps {
  gemstones: ShopGemstone[];
  fallback?: boolean;
}

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';
const INITIAL_VISIBLE = 30;
const LOAD_STEP = 15;

const formatPrice = (value: number, currency = 'EUR') =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);

const formatWeight = (weight?: number | null, unit?: 'ct' | 'g') => {
  if (typeof weight !== 'number') {
    return null;
  }
  return `${weight.toFixed(2)} ${unit ?? 'ct'}`;
};

const formatDimensions = (dimensions?: ShopGemstone['dimensions']) => {
  if (!dimensions) return null;
  const parts = [
    dimensions.length != null ? Number(dimensions.length).toFixed(1) : null,
    dimensions.width != null ? Number(dimensions.width).toFixed(1) : null,
    dimensions.height != null ? Number(dimensions.height).toFixed(1) : null,
  ].filter((part) => part !== null);

  if (!parts.length) return null;
  return `${parts.join(' × ')} mm`;
};

export function GemstoneGrid({ gemstones, fallback = false }: GemstoneGridProps) {
  const [selectedGemstone, setSelectedGemstone] = useState<ShopGemstone | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [gemstones]);

  const visibleGemstones = useMemo(
    () => gemstones.slice(0, visibleCount),
    [gemstones, visibleCount]
  );
  const hasMore = gemstones.length > visibleCount;

  const handleLoadMore = () => setVisibleCount((count) => count + LOAD_STEP);

  const toCartItem = (gem: ShopGemstone) => ({
    id: gem.id,
    name: gem.name,
    price: gem.price,
    image: gem.images[0],
    category: gem.category,
    weight: typeof gem.weight === 'number' ? gem.weight : undefined,
    origin: gem.origin ?? undefined,
  });

  return (
    <>
      {fallback && (
        <div className="mb-6 rounded-lg border border-yellow-400/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          Die angezeigten Edelsteine stammen aus einer Beispieldatenquelle, da aktuell keine
          Datenbankverbindung möglich war.
        </div>
      )}

      <div
        className="grid gap-[6px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 pb-[10px]"
        style={{ gridAutoRows: 'minmax(0, 1fr)' }}
      >
        {visibleGemstones.map((gem) => {
          const previewImage = gem.images[0] ?? PLACEHOLDER_IMAGE;
          const priceLabel = formatPrice(gem.price, gem.currency);
          const weightLabel = formatWeight(gem.weight, gem.weightUnit ?? (gem.type === 'rough' ? 'g' : 'ct'));
          const dimensionLabel = formatDimensions(gem.dimensions);

          return (
            <article
              key={gem.id}
              className="gem-card group flex h-full flex-col overflow-hidden rounded-[18px] transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => setSelectedGemstone(gem)}
                className="relative block h-[230px] w-full overflow-hidden rounded-[18px]"
              >
                <Image
                  src={previewImage}
                  alt={gem.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {gem.isSold && (
                  <div className="absolute left-4 top-4">
                    <Badge variant="destructive">Verkauft</Badge>
                  </div>
                )}
                {gem.isNew && (
                  <div className="absolute right-4 top-4">
                    <Badge variant="accent">Neu</Badge>
                  </div>
                )}
                <div className="absolute right-3 bottom-3">
                  <WishlistButton
                    item={toCartItem(gem)}
                    className="border border-white/10 bg-black/30 backdrop-blur"
                  />
                </div>
              </button>

              <div className="flex flex-1 flex-col gap-5 p-5">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                      {gem.category}
                    </span>
                    <h3 className="min-h-[3.5rem] text-xl font-semibold text-white line-clamp-2">
                      {gem.name}
                    </h3>
                  </div>
                  {(gem.description || gem.shortDescription) && (
                    <p className="text-sm text-white/70 line-clamp-2">
                      {gem.shortDescription ?? gem.description}
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-white/65">
                    <div className="flex items-center gap-2">
                      <GemIcon className="h-4 w-4 text-primary" />
                      <span>{gem.type === 'cut' ? 'Geschliffen' : 'Rohstein'}</span>
                    </div>
                    {weightLabel && (
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-primary" />
                        <span>{weightLabel}</span>
                      </div>
                    )}
                    {dimensionLabel && (
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span>{dimensionLabel}</span>
                      </div>
                    )}
                    {gem.origin && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{gem.origin}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-semibold text-primary">{priceLabel}</p>
                      <p className="text-xs uppercase tracking-wide text-white/50">
                        Bestand: {gem.stock}
                      </p>
                    </div>
                    <AddToCartButton
                      item={toCartItem(gem)}
                      disabled={!gem.inStock || gem.isSold}
                    />
                  </div>
                  <button
                    type="button"
                    className={cn(
                      navStyles.navButton,
                      navStyles.navButtonTight,
                      'w-full justify-center text-sm'
                    )}
                    onClick={() => setSelectedGemstone(gem)}
                  >
                    <span className={navStyles.navLabel}>Details öffnen</span>
                    <span className={navStyles.navGlow} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className={cn(navStyles.navButton, navStyles.navButtonTight, 'px-6 py-2')}
            onClick={handleLoadMore}
          >
            <span className={navStyles.navLabel}>Mehr Edelsteine laden</span>
            <span className={navStyles.navGlow} />
          </button>
        </div>
      )}

      <Dialog open={selectedGemstone != null} onOpenChange={() => setSelectedGemstone(null)}>
        <DialogContent className="max-w-5xl bg-[#111111] text-white">
          {selectedGemstone &&
            (() => {
              const detailWeightLabel = formatWeight(
                selectedGemstone.weight,
                selectedGemstone.weightUnit ?? (selectedGemstone.type === 'rough' ? 'g' : 'ct')
              );

              return (
                <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
                  <div className="space-y-6">
                    <MediaGallery
                      gemName={selectedGemstone.name}
                      images={
                        selectedGemstone.images.length
                          ? selectedGemstone.images
                          : [PLACEHOLDER_IMAGE]
                      }
                      videos={selectedGemstone.videos}
                      className="rounded-xl"
                      inStock={selectedGemstone.inStock && !selectedGemstone.isSold}
                    />
                  </div>
                  <div className="space-y-6">
                    <DialogHeader className="space-y-2 text-left">
                      <DialogTitle className="text-3xl font-semibold text-white">
                        {selectedGemstone.name}
                      </DialogTitle>
                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-white/55">
                        <Badge variant="secondary">{selectedGemstone.category}</Badge>
                        <Badge variant="outline">
                          {selectedGemstone.type === 'cut' ? 'Geschliffener Stein' : 'Rohstein'}
                        </Badge>
                        {selectedGemstone.isNew && <Badge variant="accent">Neu</Badge>}
                        {selectedGemstone.isSold && <Badge variant="destructive">Verkauft</Badge>}
                        {!selectedGemstone.isSold && !selectedGemstone.inStock && (
                          <Badge variant="destructive">Nicht verfügbar</Badge>
                        )}
                      </div>
                    </DialogHeader>

                    {selectedGemstone.description && (
                      <p className="text-sm leading-relaxed text-white/70">
                        {selectedGemstone.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <DetailRow label="Preis">
                        {formatPrice(selectedGemstone.price, selectedGemstone.currency)}
                      </DetailRow>
                      <DetailRow label="Bestand">{selectedGemstone.stock} Stück</DetailRow>
                      {detailWeightLabel && (
                        <DetailRow label="Gewicht">{detailWeightLabel}</DetailRow>
                      )}
                      {selectedGemstone.origin && (
                        <DetailRow label="Herkunft">{selectedGemstone.origin}</DetailRow>
                      )}
                      {selectedGemstone.dimensions?.length != null && (
                        <DetailRow label="Länge">
                          {Number(selectedGemstone.dimensions.length).toFixed(1)} mm
                        </DetailRow>
                      )}
                      {selectedGemstone.dimensions?.width != null && (
                        <DetailRow label="Breite">
                          {Number(selectedGemstone.dimensions.width).toFixed(1)} mm
                        </DetailRow>
                      )}
                      {selectedGemstone.dimensions?.height != null && (
                        <DetailRow label="Höhe">
                          {Number(selectedGemstone.dimensions.height).toFixed(1)} mm
                        </DetailRow>
                      )}
                      {selectedGemstone.color && (
                        <DetailRow label="Farbe">{selectedGemstone.color}</DetailRow>
                      )}
                      {selectedGemstone.colorSaturation && (
                        <DetailRow label="Farbsättigung">
                          {selectedGemstone.colorSaturation}
                        </DetailRow>
                      )}
                      {selectedGemstone.clarity && (
                        <DetailRow label="Klarheit">{selectedGemstone.clarity}</DetailRow>
                      )}
                      {selectedGemstone.cut && (
                        <DetailRow label="Schliff">{selectedGemstone.cut}</DetailRow>
                      )}
                      {selectedGemstone.treatment && (
                        <DetailRow label="Behandlung">{selectedGemstone.treatment}</DetailRow>
                      )}
                      {selectedGemstone.certification && (
                        <DetailRow label="Zertifizierung">
                          {selectedGemstone.certification}
                        </DetailRow>
                      )}
                      {selectedGemstone.rarity && (
                        <DetailRow label="Seltenheit">{selectedGemstone.rarity}</DetailRow>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <AddToCartButton
                        item={toCartItem(selectedGemstone)}
                        disabled={!selectedGemstone.inStock || selectedGemstone.isSold}
                      />
                      <WishlistButton
                        item={toCartItem(selectedGemstone)}
                        className="border border-white/10"
                      />
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-gray-800/40"
                        onClick={() => setSelectedGemstone(null)}
                      >
                        Schließen
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-gray-800/40 p-3">
      <GemIcon className="mt-0.5 h-4 w-4 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-wide text-white/45">{label}</p>
        <p className="text-sm text-white">{children}</p>
      </div>
    </div>
  );
}
