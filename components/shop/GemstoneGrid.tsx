'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { cn } from '@/lib/utils';
import type { ShopGemstone } from '@/lib/services/shop/types';

export interface GemstoneGridProps {
  gemstones: ShopGemstone[];
}

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';
const formatPrice = (value: number, currency: string | boolean | undefined = 'EUR') => {
  // Ensure currency is a valid string
  let validCurrency = 'EUR';
  if (typeof currency === 'string' && currency.length === 3) {
    validCurrency = currency.toUpperCase();
  } else if (currency === true || currency === false) {
    // Handle boolean values (fallback to EUR)
    validCurrency = 'EUR';
  }
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: validCurrency,
    minimumFractionDigits: 2,
  }).format(value);
};

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
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window === 'undefined') return;
      setIsMobile(window.innerWidth < 768);
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  return (
    <>
      <div
        className="grid gap-3 sm:gap-4 text-[var(--color-text-primary)]"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          justifyContent: 'center',
          paddingBottom: '12px',
        }}
      >
        {displayGemstones.map((gem) => {
          const previewImage = gem.images[0] ?? PLACEHOLDER_IMAGE;
          const priceLabel = formatPrice(gem.price, gem.currency);
          const weightLabel = formatWeight(gem.weight, gem.weightUnit ?? (gem.type === 'rough' ? 'g' : 'ct'));

          return (
            <article
              key={gem.id}
              className="gem-card group flex min-w-[180px] max-w-[240px] flex-col gap-3 rounded-[18px] p-3 sm:p-4 transition-all duration-300 text-[color:rgba(255,255,255,0.7)]"
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
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 240px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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

              <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                    {gem.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => openGemstone(gem)}
                    className="block text-left text-lg font-semibold text-[var(--color-text-primary)] line-clamp-2 hover:text-[var(--color-accent)] cursor-pointer"
                  >
                    {gem.name}
                  </button>
                </div>
                <div className="space-y-1 text-xs text-[var(--color-text-muted)]">
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-[var(--font-button-size)] font-semibold"
                  onClick={() => openGemstone(gem)}
                >
                  Details öffnen
                </Button>
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
          {/* Draggable Card - desktop, Bottom Sheet - mobile */}
          <div
            ref={cardRef}
            className={cn(
              'gem-card z-[9999] select-none',
              isMobile ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-move'
            )}
            style={
              isMobile
                ? {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 'auto',
                    margin: 0,
                    padding: '1.25rem',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: '100%',
                    height: '85vh',
                    maxHeight: '85vh',
                    boxSizing: 'border-box',
                    borderTopLeftRadius: '18px',
                    borderTopRightRadius: '18px',
                  }
                : {
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
                  }
            }
            role="dialog"
            aria-modal="true"
            aria-label={`Details für ${selectedGemstone.name}`}
            onMouseDown={isMobile ? undefined : handleMouseDown}
          >
            <div
              className="overflow-y-auto space-y-6 w-full"
              style={{
                maxHeight: isMobile ? 'calc(85vh - 2.5rem)' : 'calc(90vh - 3rem)',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {/* Header with Close Button - Draggable area */}
              <div 
                className={cn(
                  'flex justify-between items-start mb-4',
                  isMobile ? 'cursor-default' : 'cursor-move'
                )}
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                  // Allow dragging from header, but not from close button
                  if ((e.target as HTMLElement).closest('button') || isMobile) {
                    e.stopPropagation();
                    return;
                  }
                  handleMouseDown(e);
                }}
              >
                <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] flex-1 pr-4 select-none">
                  {selectedGemstone.name}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeGemstone}
                  className="text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] rounded-full flex-shrink-0"
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
                          <Badge 
                            className="border-white/20"
                            style={{ 
                              backgroundColor: 'rgba(255, 148, 71, 0.3)', 
                              borderColor: 'rgba(255, 148, 71, 0.5)',
                              color: '#FF9447'
                            }}
                          >
                            {selectedGemstone.category}
                          </Badge>
                          <Badge 
                            className="border-white/20"
                            style={{ 
                              backgroundColor: 'rgba(106, 27, 154, 0.3)', 
                              borderColor: 'rgba(106, 27, 154, 0.5)',
                              color: '#6A1B9A'
                            }}
                          >
                            {selectedGemstone.type === 'cut' ? 'Geschliffener Stein' : 'Rohstein'}
                          </Badge>
                          {selectedGemstone.isNew && (
                            <Badge 
                              className="border-white/20"
                              style={{ 
                                backgroundColor: 'rgba(255, 193, 7, 0.3)', 
                                borderColor: 'rgba(255, 193, 7, 0.5)',
                                color: '#FFC107'
                              }}
                            >
                              Neu
                            </Badge>
                          )}
                          {selectedGemstone.isSold && (
                            <Badge 
                              className="border-white/20"
                              style={{ 
                                backgroundColor: 'rgba(255, 123, 123, 0.3)', 
                                borderColor: 'rgba(255, 123, 123, 0.5)',
                                color: '#FF7B7B'
                              }}
                            >
                              Verkauft
                            </Badge>
                          )}
                          {!selectedGemstone.isSold && !selectedGemstone.inStock && (
                            <Badge 
                              className="border-white/20"
                              style={{ 
                                backgroundColor: 'rgba(255, 123, 123, 0.3)', 
                                borderColor: 'rgba(255, 123, 123, 0.5)',
                                color: '#FF7B7B'
                              }}
                            >
                              Nicht verfügbar
                            </Badge>
                          )}
                          {selectedGemstone.rarity && (
                            <Badge 
                              className="border-white/20"
                              style={{ 
                                backgroundColor: 'rgba(212, 94, 0, 0.3)', 
                                borderColor: 'rgba(212, 94, 0, 0.5)',
                                color: '#D45E00'
                              }}
                            >
                              {selectedGemstone.rarity}
                            </Badge>
                          )}
                        </div>
                      {(selectedGemstone.shortDescription || selectedGemstone.description) && (
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                          {selectedGemstone.shortDescription ?? selectedGemstone.description}
                        </p>
                      )}

                      {/* Details */}
                      <div className="grid grid-cols-1 gap-3 text-sm text-[var(--color-text-secondary)]" onMouseDown={(e) => e.stopPropagation()}>
                        <DetailRow label="Edelsteinart">
                          <span className="text-[var(--color-text-primary)]">{selectedGemstone.category}</span>
                        </DetailRow>
                        <DetailRow label="Preis">
                          <span className="text-[var(--color-text-primary)] font-semibold">
                            {formatPrice(selectedGemstone.price, selectedGemstone.currency)}
                          </span>
                        </DetailRow>
                        <DetailRow label="Bestand">
                          <span className="text-[var(--color-text-primary)]">{selectedGemstone.stock} Stück</span>
                        </DetailRow>
                        {detailWeightLabel && (
                          <DetailRow label="Gewicht">
                            <span className="text-[var(--color-text-primary)]">{detailWeightLabel}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.origin && (
                          <DetailRow label="Herkunft">
                            <span className="text-[var(--color-text-primary)]">{selectedGemstone.origin}</span>
                          </DetailRow>
                        )}
                        {(selectedGemstone.dimensions?.length != null ||
                          selectedGemstone.dimensions?.width != null ||
                          selectedGemstone.dimensions?.height != null) && (
                          <DetailRow label="Abmessungen">
                            <span className="text-[var(--color-text-primary)]">
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
                            <span className="text-[var(--color-text-primary)]">{selectedGemstone.color}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.colorSaturation && (
                          <DetailRow label="Farbsättigung">
                            <span className="text-[var(--color-text-primary)]">
                              {selectedGemstone.colorSaturation}
                            </span>
                          </DetailRow>
                        )}
                        {selectedGemstone.clarity && (
                          <DetailRow label="Klarheit">
                            <span className="text-[var(--color-text-primary)]">{selectedGemstone.clarity}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.cut && (
                          <DetailRow label="Schliff">
                            <span className="text-[var(--color-text-primary)]">{selectedGemstone.cut}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.cutForm && (
                          <DetailRow label="Schliffform">
                            <span className="text-[var(--color-text-primary)]">{selectedGemstone.cutForm}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.treatment && (
                          <DetailRow label="Behandlung">
                            <span className="text-[var(--color-text-primary)]">{selectedGemstone.treatment}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.certification && (
                          <DetailRow label="Zertifizierung">
                            <span className="text-[var(--color-text-primary)]">{selectedGemstone.certification}</span>
                          </DetailRow>
                        )}
                        {selectedGemstone.rarity && (
                          <DetailRow label="Seltenheit">
                            <span className="text-[var(--color-text-primary)]">{selectedGemstone.rarity}</span>
                          </DetailRow>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--color-border)]" onMouseDown={(e) => e.stopPropagation()}>
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
    // Komplementärfarben und hoher Kontrast für dunklen Hintergrund
    const iconMap: Record<string, { 
      icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>, 
      style: React.CSSProperties 
    }> = {
      'Edelsteinart': { 
        icon: Gem, 
        style: { 
          color: '#FF9447', // Orange (gem-fire) - sehr hell
          filter: 'brightness(1.2) saturate(1.3)',
        } 
      },
      'Preis': { 
        icon: Euro, 
        style: { 
          color: '#00E5FF', // Hell-Cyan (gem-iceLight) - Komplementär zu Orange
          filter: 'brightness(1.3) saturate(1.4)',
        } 
      },
      'Bestand': { 
        icon: Package, 
        style: { 
          color: '#8A5CF6', // Purple - sehr gesättigt
          filter: 'brightness(1.2) saturate(1.3)',
        } 
      },
      'Gewicht': { 
        icon: Weight, 
        style: { 
          color: '#FFD85E', // Gold (gem-fireLight) - Komplementär zu Purple
          filter: 'brightness(1.3) saturate(1.4)',
        } 
      },
      'Herkunft': { 
        icon: MapPin, 
        style: { 
          color: '#00B8A9', // Grün-Cyan (gem-green)
          filter: 'brightness(1.3) saturate(1.4)',
        } 
      },
      'Abmessungen': { 
        icon: Ruler, 
        style: { 
          color: '#FF6B35', // Orange-Rot - Komplementär zu Cyan
          filter: 'brightness(1.2) saturate(1.3)',
        } 
      },
      'Farbe': { 
        icon: Palette, 
        style: { 
          color: '#FF7B7B', // Logo-Rot - Pink-Ton
          filter: 'brightness(1.3) saturate(1.4)',
        } 
      },
      'Farbsättigung': { 
        icon: Droplets, 
        style: { 
          color: '#00BCD4', // Cyan (gem-ice)
          filter: 'brightness(1.3) saturate(1.4)',
        } 
      },
      'Klarheit': { 
        icon: Star, 
        style: { 
          color: '#FFC107', // Gold-Gelb - sehr hell
          filter: 'brightness(1.4) saturate(1.5)',
        } 
      },
      'Schliff': { 
        icon: Gem, 
        style: { 
          color: '#E53935', // Rot (gem-fireDark) - Komplementär zu Cyan
          filter: 'brightness(1.2) saturate(1.3)',
        } 
      },
      'Schliffform': { 
        icon: Shapes, 
        style: { 
          color: '#6A1B9A', // Dunkles Purple
          filter: 'brightness(1.3) saturate(1.4)',
        } 
      },
      'Behandlung': { 
        icon: FlaskConical, 
        style: { 
          color: '#478EFF', // Blau (compOrange) - Komplementär zu Orange
          filter: 'brightness(1.3) saturate(1.4)',
        } 
      },
      'Zertifizierung': { 
        icon: Award, 
        style: { 
          color: '#5E8EFF', // Azure-Blau (compYellow) - Komplementär zu Gold
          filter: 'brightness(1.3) saturate(1.4)',
        } 
      },
      'Seltenheit': { 
        icon: Sparkles, 
        style: { 
          color: '#D45E00', // Amber (compCyan) - Komplementär zu Cyan
          filter: 'brightness(1.2) saturate(1.3)',
        } 
      },
    };
    
    return iconMap[label] || { 
      icon: Tag, 
      style: { 
        color: '#00BCD4',
        filter: 'brightness(1.3) saturate(1.4)',
      }
    };
  };

  const { icon: IconComponent, style } = getIconAndStyle(label);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-800/60 border border-[var(--color-border)] p-3 backdrop-blur text-[var(--color-text-primary)]">
      <IconComponent className="h-4 w-4 flex-shrink-0" style={style} />
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">{label}:</span>
        <span className="text-sm text-[var(--color-text-primary)] font-medium">{children}</span>
      </div>
    </div>
  );
}
