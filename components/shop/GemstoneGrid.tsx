'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MediaGallery } from '@/components/shop/MediaGallery';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { GemIcon } from 'lucide-react';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { cn } from '@/lib/utils';
import type { ShopGemstone } from '@/lib/services/shop/types';

export interface GemstoneGridProps {
  gemstones: ShopGemstone[];
}

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';
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

export function GemstoneGrid({ gemstones }: GemstoneGridProps) {
  const [selectedGemstone, setSelectedGemstone] = useState<ShopGemstone | null>(null);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'de';

  const displayGemstones = gemstones;

  const toCartItem = (gem: ShopGemstone) => ({
    id: gem.id,
    name: gem.name,
    price: gem.price,
    currency: gem.currency ?? 'EUR',
    image: gem.images[0],
    category: gem.category,
    weight: typeof gem.weight === 'number' ? gem.weight : undefined,
    weightUnit: gem.weightUnit,
    origin: gem.origin ?? undefined,
  });

  return (
    <>
      <div
        className="grid gap-[16px]"
        style={{ gridTemplateColumns: 'repeat(5, 240px)', justifyContent: 'center', maxHeight: 'calc(6 * 340px + 5 * 16px)', overflowY: 'auto', paddingBottom: '16px' }}
      >
        {displayGemstones.map((gem) => {
          const previewImage = gem.images[0] ?? PLACEHOLDER_IMAGE;
          const priceLabel = formatPrice(gem.price, gem.currency);
          const weightLabel = formatWeight(gem.weight, gem.weightUnit ?? (gem.type === 'rough' ? 'g' : 'ct'));

          return (
            <article
              key={gem.id}
              className="gem-card group flex min-w-[240px] max-w-[240px] flex-col gap-3 rounded-[18px] p-4 transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => setSelectedGemstone(gem)}
                className="group relative block w-full overflow-hidden rounded-[18px]"
                style={{ height: '240px' }}
              >
                <Image
                  src={previewImage}
                  alt={gem.name}
                  width={240}
                  height={240}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {gem.isSold && (
                  <div className="absolute left-3 top-3">
                    <Badge variant="destructive">Verkauft</Badge>
                  </div>
                )}
                {gem.isNew && (
                  <div className="absolute right-3 top-3">
                    <Badge variant="accent">Neu</Badge>
                  </div>
                )}
              </button>

              <div className="space-y-3 text-sm text-white/75">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                    {gem.category}
                  </span>
                  <Link
                    href={`/${locale}/shop/${gem.id}`}
                    className="block text-lg font-semibold text-white line-clamp-2 hover:text-primary"
                  >
                    {gem.name}
                  </Link>
                </div>
                <div className="space-y-1 text-xs text-white/60">
                  <p>{priceLabel}</p>
                  {weightLabel && <p>Gewicht {weightLabel}</p>}
                  {gem.origin && <p>Herkunft {gem.origin}</p>}
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <AddToCartButton
                    item={toCartItem(gem)}
                    disabled={!gem.inStock || gem.isSold}
                  />
                  <WishlistButton item={toCartItem(gem)} className="border border-white/10" />
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
            </article>
          );
        })}
      </div>

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
                      certification={
                        selectedGemstone.certification
                          ? {
                              certified: true,
                              lab: selectedGemstone.certification,
                            }
                          : undefined
                      }
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
                        {selectedGemstone.rarity && (
                          <Badge className="bg-purple-600/20 text-purple-200 border-purple-500/40">
                            {selectedGemstone.rarity}
                          </Badge>
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
                      {selectedGemstone.cutForm && (
                        <DetailRow label="Schliffform">{selectedGemstone.cutForm}</DetailRow>
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
