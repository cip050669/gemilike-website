'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MediaGallery } from '@/components/shop/MediaGallery';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { GemIcon } from 'lucide-react';

export interface ShopGemstone {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  weight?: number | null;
  weightUnit?: 'ct' | 'g';
  origin?: string | null;
  color?: string | null;
  clarity?: string | null;
  cut?: string | null;
  treatment?: string | null;
  description?: string | null;
  certification?: string | null;
  rarity?: string | null;
  inStock: boolean;
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

export function GemstoneGrid({ gemstones, fallback = false }: GemstoneGridProps) {
  const [selectedGemstone, setSelectedGemstone] = useState<ShopGemstone | null>(null);

  const cardGem = (gem: ShopGemstone) => ({
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

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {gemstones.map((gem) => {
          const previewImage = gem.images[0] ?? PLACEHOLDER_IMAGE;
          return (
            <article
              key={gem.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gray-800/50-alt/80 shadow-lg ring-1 ring-black/30 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedGemstone(gem)}
                className="relative block aspect-[4/3] overflow-hidden"
              >
                <Image
                  src={previewImage}
                  alt={gem.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!gem.inStock && (
                  <div className="absolute left-4 top-4">
                    <Badge variant="destructive">Ausverkauft</Badge>
                  </div>
                )}
                {gem.isNew && (
                  <div className="absolute right-4 top-4">
                    <Badge variant="accent">Neu</Badge>
                  </div>
                )}
              </button>

              <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white">{gem.name}</h3>
                    <p className="text-sm uppercase tracking-wide text-white/50">
                      {gem.category} • {gem.type === 'cut' ? 'Geschliffen' : 'Rohstein'}
                    </p>
                  </div>
                  <WishlistButton item={cardGem(gem)} className="border border-white/10" />
                </div>

                <div className="space-y-2 text-sm text-white/70">
                  {gem.description && <p className="line-clamp-3">{gem.description}</p>}
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-white/55">
                    {gem.treatment && <Badge variant="outline">{gem.treatment}</Badge>}
                    {gem.clarity && <Badge variant="outline">Klarheit {gem.clarity}</Badge>}
                    {gem.color && <Badge variant="outline">Farbe {gem.color}</Badge>}
                    {gem.certification && <Badge variant="outline">Zertifikat {gem.certification}</Badge>}
                  </div>
                </div>

                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-semibold text-primary">
                      €{gem.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-white/50">
                      Bestand: {gem.stock}
                    </p>
                  </div>
                  <AddToCartButton item={cardGem(gem)} />
                </div>

                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-gray-800/30/10"
                  onClick={() => setSelectedGemstone(gem)}
                >
                  Details öffnen
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={selectedGemstone != null} onOpenChange={() => setSelectedGemstone(null)}>
        <DialogContent className="max-w-5xl bg-[#111111] text-white">
          {selectedGemstone && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <MediaGallery
                  gemName={selectedGemstone.name}
                  images={selectedGemstone.images.length ? selectedGemstone.images : [PLACEHOLDER_IMAGE]}
                  videos={selectedGemstone.videos}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-6">
                <DialogHeader className="space-y-2 text-left">
                  <DialogTitle className="text-3xl font-semibold text-white">
                    {selectedGemstone.name}
                  </DialogTitle>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-white/50">
                    <Badge variant="secondary">{selectedGemstone.category}</Badge>
                    <Badge variant="outline">{selectedGemstone.type === 'cut' ? 'Geschliffen' : 'Rohstein'}</Badge>
                    {selectedGemstone.isNew && <Badge variant="accent">Neu</Badge>}
                  </div>
                </DialogHeader>

                {selectedGemstone.description && (
                  <p className="text-sm leading-relaxed text-white/70">
                    {selectedGemstone.description}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <DetailRow label="Preis">
                    €{selectedGemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </DetailRow>
                  <DetailRow label="Bestand">{selectedGemstone.stock} Stück</DetailRow>
                  {typeof selectedGemstone.weight === 'number' && (
                    <DetailRow label="Gewicht">
                      {selectedGemstone.weight.toFixed(2)} {selectedGemstone.weightUnit ?? 'ct'}
                    </DetailRow>
                  )}
                  {selectedGemstone.origin && (
                    <DetailRow label="Herkunft">{selectedGemstone.origin}</DetailRow>
                  )}
                  {selectedGemstone.clarity && (
                    <DetailRow label="Klarheit">{selectedGemstone.clarity}</DetailRow>
                  )}
                  {selectedGemstone.color && (
                    <DetailRow label="Farbe">{selectedGemstone.color}</DetailRow>
                  )}
                  {selectedGemstone.cut && (
                    <DetailRow label="Schliff">{selectedGemstone.cut}</DetailRow>
                  )}
                  {selectedGemstone.treatment && (
                    <DetailRow label="Behandlung">{selectedGemstone.treatment}</DetailRow>
                  )}
                  {selectedGemstone.certification && (
                    <DetailRow label="Zertifizierung">{selectedGemstone.certification}</DetailRow>
                  )}
                  {selectedGemstone.rarity && (
                    <DetailRow label="Seltenheit">{selectedGemstone.rarity}</DetailRow>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <AddToCartButton item={cardGem(selectedGemstone)} />
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-gray-800/30/10"
                    onClick={() => setSelectedGemstone(null)}
                  >
                    Schließen
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-gray-800/30/5 p-3">
      <GemIcon className="mt-0.5 h-4 w-4 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
        <p className="text-sm text-white">{children}</p>
      </div>
    </div>
  );
}
