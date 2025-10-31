'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      void fetchCart();
    }
  }, [isOpen, fetchCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800/50/50" onClick={toggleCart}>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-800/50 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCartIcon className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">Warenkorb</h2>
              <Badge variant="secondary">{getTotalItems()}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleCart}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
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
                <Link href="/">
                  <Button onClick={toggleCart}>Zum Shop</Button>
                </Link>
              </div>
            ) : null}

            {!isLoading && items.length > 0 && (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <div className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                              priority={false}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.category && `${item.category} • `}
                            {item.weight && `${item.weight.toFixed(2)}${item.weightUnit ?? 'ct'} • `}
                            {item.origin}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {currency} {item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t border-border p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Gesamt:</span>
                <span className="text-primary">
                  {currency} {getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full" onClick={toggleCart}>
                    Zur Kasse
                  </Button>
                </Link>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full" onClick={toggleCart}>
                    Weiter einkaufen
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
