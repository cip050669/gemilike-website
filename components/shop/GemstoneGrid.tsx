'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MediaGallery } from '@/components/shop/MediaGallery';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { 
  Gem, 
  Euro, 
  Package, 
  Weight, 
  MapPin, 
  Ruler, 
  Palette, 
  Droplets, 
  Sparkles, 
  Award, 
  Shapes,
  FlaskConical,
  Star,
  Tag
} from 'lucide-react';
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
  const [cardPosition, setCardPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'de';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const updateUrl = (paramsToApply: URLSearchParams) => {
    const queryString = paramsToApply.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const openGemstone = (gem: ShopGemstone) => {
    setSelectedGemstone(gem);
    const paramsCopy = new URLSearchParams(searchParams?.toString() ?? '');
    paramsCopy.set('gem', gem.id);
    updateUrl(paramsCopy);
  };

  const closeGemstone = () => {
    const paramsCopy = new URLSearchParams(searchParams?.toString() ?? '');
    if (paramsCopy.has('gem')) {
      paramsCopy.delete('gem');
      updateUrl(paramsCopy);
    }
    setSelectedGemstone(null);
  };

  useEffect(() => {
    if (!searchParams) {
      return;
    }
    const gemParam = searchParams.get('gem');
    if (!gemParam) {
      if (selectedGemstone !== null) {
        setSelectedGemstone(null);
      }
      return;
    }

    if (selectedGemstone?.id === gemParam) {
      return;
    }

    const match = gemstones.find((gem) => gem.id === gemParam);
    if (match) {
      setSelectedGemstone(match);
      // Reset position when opening new gemstone - center of screen
      if (typeof window !== 'undefined') {
        // Position in center, will adjust based on actual card width
        const x = Math.max(50, (window.innerWidth - 400) / 2);
        const y = 50;
        setCardPosition({ x, y });
      }
    }
  }, [searchParams, gemstones, selectedGemstone]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Allow dragging from header area, but prevent from interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [onMouseDown]')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cardPosition.x,
      y: e.clientY - cardPosition.y,
    });
  }, [cardPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    // NO BOUNDS - allow free movement anywhere
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setCardPosition({
      x: newX,
      y: newY,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div
        className="grid gap-[16px]"
        style={{ gridTemplateColumns: 'repeat(4, 240px)', justifyContent: 'center', maxHeight: 'calc(6 * 340px + 5 * 16px)', overflowY: 'auto', overflowX: 'hidden', paddingBottom: '16px' }}
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
                onClick={() => openGemstone(gem)}
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
                  onClick={() => openGemstone(gem)}
                >
                  <span className={navStyles.navLabel}>Details öffnen</span>
                  <span className={navStyles.navGlow} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {/* Draggable Floating Card */}
      {selectedGemstone && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={closeGemstone}
          />
          {/* Draggable Card - NO CONTAINER LIMITS */}
          <div
            ref={cardRef}
            className="gem-card z-[9999] cursor-move select-none"
            style={{
              position: 'fixed',
              left: `${cardPosition.x}px`,
              top: `${cardPosition.y}px`,
              cursor: isDragging ? 'grabbing' : 'grab',
              margin: 0,
              transform: 'none',
              padding: '1.5rem',
              width: '450px',
              maxWidth: '450px',
              minWidth: '450px',
              maxHeight: '90vh',
              boxSizing: 'border-box',
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="overflow-y-auto space-y-6 w-full" style={{ maxHeight: 'calc(90vh - 3rem)', boxSizing: 'border-box', width: '100%' }}>
              {/* Header with Close Button - Draggable area */}
              <div 
                className="flex justify-between items-start mb-4 cursor-move"
                onMouseDown={(e) => {
                  // Allow dragging from header, but not from close button
                  if ((e.target as HTMLElement).closest('button')) {
                    e.stopPropagation();
                    return;
                  }
                  handleMouseDown(e);
                }}
              >
                <h2 className="text-2xl font-semibold text-white flex-1 pr-4 select-none">
                  {selectedGemstone.name}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeGemstone}
                  className="text-white hover:bg-white/20 rounded-full flex-shrink-0"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

                {(() => {
                  const detailWeightLabel = formatWeight(
                    selectedGemstone.weight,
                    selectedGemstone.weightUnit ?? (selectedGemstone.type === 'rough' ? 'g' : 'ct')
                  );

                  return (
                    <>
                      {/* Media Gallery */}
                      <div className="space-y-4 w-full overflow-hidden" onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
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

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
                          <Badge className="bg-gray-800/60 text-white border-white/20">
                            {selectedGemstone.category}
                          </Badge>
                          <Badge className="bg-gray-800/60 text-white border-white/20">
                            {selectedGemstone.type === 'cut' ? 'Geschliffener Stein' : 'Rohstein'}
                          </Badge>
                          {selectedGemstone.isNew && (
                            <Badge className="bg-orange-600/30 text-orange-200 border-orange-500/40">
                              Neu
                            </Badge>
                          )}
                          {selectedGemstone.isSold && (
                            <Badge className="bg-red-600/30 text-red-200 border-red-500/40">
                              Verkauft
                            </Badge>
                          )}
                          {!selectedGemstone.isSold && !selectedGemstone.inStock && (
                            <Badge className="bg-red-600/30 text-red-200 border-red-500/40">
                              Nicht verfügbar
                            </Badge>
                          )}
                          {selectedGemstone.rarity && (
                            <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/40">
                              {selectedGemstone.rarity}
                            </Badge>
                          )}
                        </div>
                      {(selectedGemstone.shortDescription || selectedGemstone.description) && (
                        <p className="text-sm text-white/80 leading-relaxed">
                          {selectedGemstone.shortDescription ?? selectedGemstone.description}
                        </p>
                      )}

                      {/* Details */}
                      <div className="grid grid-cols-1 gap-3 text-sm" onMouseDown={(e) => e.stopPropagation()}>
                        <DetailRow label="Edelsteinart">
                          <span className="text-white">{selectedGemstone.category}</span>
                        </DetailRow>
                        <DetailRow label="Preis">
                          <span className="text-white font-semibold">
                            {formatPrice(selectedGemstone.price, selectedGemstone.currency)}
                          </span>
                        </DetailRow>
                        <DetailRow label="Bestand">
                          <span className="text-white">{selectedGemstone.stock} Stück</span>
                        </DetailRow>
                        {detailWeightLabel && (
                          <DetailRow label="Gewicht">
                            <span className="text-white">{detailWeightLabel}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.origin && (
                          <DetailRow label="Herkunft">
                            <span className="text-white">{selectedGemstone.origin}</span>
                          </DetailRow>
                        )}
                        {(selectedGemstone.dimensions?.length != null ||
                          selectedGemstone.dimensions?.width != null ||
                          selectedGemstone.dimensions?.height != null) && (
                          <DetailRow label="Abmessungen">
                            <span className="text-white">
                              {[
                                selectedGemstone.dimensions?.length != null
                                  ? `${Number(selectedGemstone.dimensions.length).toFixed(2)} mm`
                                  : null,
                                selectedGemstone.dimensions?.width != null
                                  ? `${Number(selectedGemstone.dimensions.width).toFixed(2)} mm`
                                  : null,
                                selectedGemstone.dimensions?.height != null
                                  ? `${Number(selectedGemstone.dimensions.height).toFixed(2)} mm`
                                  : null,
                              ].filter(Boolean).join(' x ')}
                            </span>
                          </DetailRow>
                        )}
                        {selectedGemstone.color && (
                          <DetailRow label="Farbe">
                            <span className="text-white">{selectedGemstone.color}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.colorSaturation && (
                          <DetailRow label="Farbsättigung">
                            <span className="text-white">
                              {selectedGemstone.colorSaturation}
                            </span>
                          </DetailRow>
                        )}
                        {selectedGemstone.clarity && (
                          <DetailRow label="Klarheit">
                            <span className="text-white">{selectedGemstone.clarity}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.cut && (
                          <DetailRow label="Schliff">
                            <span className="text-white">{selectedGemstone.cut}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.cutForm && (
                          <DetailRow label="Schliffform">
                            <span className="text-white">{selectedGemstone.cutForm}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.treatment && (
                          <DetailRow label="Behandlung">
                            <span className="text-white">{selectedGemstone.treatment}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.certification && (
                          <DetailRow label="Zertifizierung">
                            <span className="text-white">{selectedGemstone.certification}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.rarity && (
                          <DetailRow label="Seltenheit">
                            <span className="text-white">{selectedGemstone.rarity}</span>
                          </DetailRow>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10" onMouseDown={(e) => e.stopPropagation()}>
                        <AddToCartButton
                          item={toCartItem(selectedGemstone)}
                          disabled={!selectedGemstone.inStock || selectedGemstone.isSold}
                        />
                        <WishlistButton
                          item={toCartItem(selectedGemstone)}
                          className="border border-white/20"
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
        </>
      )}
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  const getIconAndStyle = (label: string) => {
    // Jedes Icon bekommt eine eindeutige, kontrastreiche Farbe
    // Optimiert für maximale visuelle Unterscheidbarkeit
    const iconMap: Record<string, { 
      icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>, 
      style: React.CSSProperties 
    }> = {
      'Edelsteinart': { 
        icon: Gem, 
        style: { 
          color: '#FF6B35', // Kräftiges Rot-Orange
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Preis': { 
        icon: Euro, 
        style: { 
          color: '#00E5FF', // Helles Cyan
          filter: 'brightness(1.5) saturate(1.6)',
        } 
      },
      'Bestand': { 
        icon: Package, 
        style: { 
          color: '#9C27B0', // Kräftiges Violett
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Gewicht': { 
        icon: Weight, 
        style: { 
          color: '#FFC107', // Kräftiges Gelb
          filter: 'brightness(1.5) saturate(1.6)',
        } 
      },
      'Herkunft': { 
        icon: MapPin, 
        style: { 
          color: '#4CAF50', // Kräftiges Grün
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Abmessungen': { 
        icon: Ruler, 
        style: { 
          color: '#FF1493', // Kräftiges Deep Pink/Magenta (deutlich anders als Rot-Orange)
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Farbe': { 
        icon: Palette, 
        style: { 
          color: '#F44336', // Kräftiges Rot (deutlich anders als Violett)
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Farbsättigung': { 
        icon: Droplets, 
        style: { 
          color: '#00FF7F', // Kräftiges Grün (deutlich anders als Cyan/Blau)
          filter: 'brightness(1.5) saturate(1.6)',
        } 
      },
      'Klarheit': { 
        icon: Star, 
        style: { 
          color: '#FF9800', // Kräftiges Orange (deutlich anders als Gelb)
          filter: 'brightness(1.5) saturate(1.6)',
        } 
      },
      'Schliff': { 
        icon: Gem, 
        style: { 
          color: '#E91E63', // Pink/Magenta
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Schliffform': { 
        icon: Shapes, 
        style: { 
          color: '#7B1FA2', // Dunkles Violett
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Behandlung': { 
        icon: FlaskConical, 
        style: { 
          color: '#673AB7', // Dunkles Violett/Indigo (deutlich anders als Cyan und Grün)
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Zertifizierung': { 
        icon: Award, 
        style: { 
          color: '#3F51B5', // Indigo
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Seltenheit': { 
        icon: Sparkles, 
        style: { 
          color: '#2196F3', // Kräftiges Blau
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
    };
    
    return iconMap[label] || { 
      icon: Tag, 
      style: { 
        color: '#00BCD4',
        filter: 'brightness(1.5) saturate(1.6)',
      }
    };
  };

  const { icon: IconComponent, style } = getIconAndStyle(label);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-800/60 border border-white/20 p-3 backdrop-blur">
      <IconComponent className="h-4 w-4 flex-shrink-0" style={style} />
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs uppercase tracking-wide text-white/70">{label}:</span>
        <span className="text-sm text-white font-medium">{children}</span>
      </div>
    </div>
  );
}
