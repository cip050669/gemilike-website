'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import type { CartItemDTO } from '@/lib/actions/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { XIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

const EMPTY_ITEMS: ReadonlyArray<CartItemDTO> = Object.freeze([]);

export function Cart() {
  const pathname = usePathname();
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const items = useCartStore((state) => state.items ?? EMPTY_ITEMS);
  const currency = useCartStore((state) => state.summary?.currency ?? 'EUR');
  const isLoading = useCartStore((state) => state.isLoading);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const error = useCartStore((state) => state.error);

  const localePrefix = (() => {
    if (!pathname) return '';
    const segments = pathname.split('/');
    return segments[1] && segments[1].length === 2 ? `/${segments[1]}` : '';
  })();

  const buildHref = (href: string) => {
    if (!localePrefix) return href;
    if (href === '/') return localePrefix;
    return `${localePrefix}${href}`;
  };

  useEffect(() => {
    if (isOpen) {
      void fetchCart();
    }
  }, [isOpen, fetchCart]);

  useEffect(() => {
    if (isOpen) {
      console.log('Cart is open, items:', items);
      console.log('Items count:', items.length);
      if (items.length > 0) {
        console.log('First item:', items[0]);
      }
    }
  }, [isOpen, items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={toggleCart}>
      <div className="fixed right-0 top-0 h-full w-full max-w-md border-l border-gem-iceDark/20 shadow-2xl public-page-bg" onClick={(e) => e.stopPropagation()}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gem-iceDark/20 p-6" style={{ backgroundColor: 'rgba(31, 41, 55, 0.85)' }}>
            <div className="flex items-center gap-3">
              <ShoppingCartIcon className="h-6 w-6 text-gem-accent" />
              <h2 className="text-xl font-bold text-gem-text">Warenkorb</h2>
              {getTotalItems() > 0 && (
                <Badge variant="secondary" className="bg-gem-accent text-gem-bgDark">
                  {getTotalItems()}
                </Badge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart} 
              aria-label="Warenkorb schließen"
              className="hover:bg-gem-surface-soft"
              style={{ transform: 'translateX(-100px)' }}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'rgba(31, 41, 55, 0.85)' }}>
            {isLoading && (
              <div className="py-8 text-center text-muted-foreground">
                Wird geladen …
              </div>
            )}

            {!isLoading && error && (
              <div className="py-4 text-center text-red-400 text-sm">
                {error}
              </div>
            )}

            {!isLoading && items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCartIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ihr Warenkorb ist leer</h3>
                <p className="text-muted-foreground mb-4">
                  Entdecken Sie unsere Edelsteine und fügen Sie sie zu Ihrem Warenkorb hinzu.
                </p>
                <Link href={buildHref('/shop')}>
                  <Button onClick={toggleCart}>Zum Shop</Button>
                </Link>
              </div>
            ) : null}

            {!isLoading && items.length > 0 && (
              <div className="space-y-4">
                {items.map((item) => {
                  const details = [
                    item.category,
                    item.weight ? `${item.weight.toFixed(2)}${item.weightUnit ?? 'ct'}` : null,
                    item.origin
                  ].filter(Boolean).join(' • ') || 'Keine Details verfügbar';
                  
                  return (
                    <Card key={item.id} className="border-gem-iceDark/30 shadow-md" style={{ backgroundColor: 'rgba(31, 41, 55, 0.75)' }}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          {item.image ? (
                            <div className="relative h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name || 'Edelstein'}
                                fill
                                sizes="80px"
                                className="object-cover"
                                priority={false}
                              />
                            </div>
                          ) : (
                            <div className="h-20 w-20 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                              <ShoppingCartIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <h3 className="font-semibold text-gem-text text-base mb-1">
                                {item.name || 'Unbekannter Edelstein'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {details}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-gem-accent">
                                {new Intl.NumberFormat('de-DE', { 
                                  style: 'currency', 
                                  currency: item.currency || currency 
                                }).format(item.price * item.quantity)}
                                {item.quantity > 1 && (
                                  <span className="text-sm text-muted-foreground ml-2">
                                    ({new Intl.NumberFormat('de-DE', { 
                                      style: 'currency', 
                                      currency: item.currency || currency 
                                    }).format(item.price)} pro Stück)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={isLoading || item.quantity <= 1}
                                className="h-8 w-8"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={isLoading}
                                className="h-8 w-8"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                            aria-label="Artikel entfernen"
                            style={{ transform: 'translateX(-100px)' }}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t border-gem-iceDark/20 p-6 space-y-4" style={{ backgroundColor: 'rgba(31, 41, 55, 0.85)' }}>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gem-text">Gesamt:</span>
                <span className="text-2xl font-bold text-gem-accent">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(getTotalPrice())}
                </span>
              </div>
              <div className="space-y-3">
                <Link href={buildHref('/checkout')} className="block w-full">
                  <Button className="w-full bg-gem-accent hover:bg-gem-accent-strong text-gem-bgDark font-semibold h-12" onClick={toggleCart}>
                    Zur Kasse gehen
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full border-gem-iceDark/30 hover:bg-gem-surface-soft h-11" 
                  onClick={toggleCart}
                >
                  Weiter einkaufen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
