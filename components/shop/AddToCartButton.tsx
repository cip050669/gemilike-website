'use client';

import { useState, useTransition } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { RippleButton } from '@/components/ui/RippleButton';
import { ShoppingCartIcon, CheckIcon } from 'lucide-react';

interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    currency?: string;
    image?: string;
    category?: string;
    weight?: number;
    weightUnit?: 'ct' | 'g';
    origin?: string;
  };
  disabled?: boolean;
}

export function AddToCartButton({ item, disabled = false }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isStoreLoading = useCartStore((state) => state.isLoading);
  const [isAdded, setIsAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    if (disabled || isPending || isStoreLoading) {
      return;
    }

    setIsAdded(true);
    startTransition(() => {
      addItem(item.id, 1, {
        gemstoneId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        weight: item.weight,
        weightUnit: item.weightUnit,
        origin: item.origin,
        currency: item.currency ?? 'EUR',
      }).catch(() => {
        setIsAdded(false);
      });
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <>
      <RippleButton
        onClick={handleAddToCart}
        disabled={disabled || isPending || isStoreLoading}
        className={`${
          disabled
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-700'
            :
          isAdded 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-primary hover:bg-primary/90'
        } text-primary-foreground transition-colors duration-300`}
        aria-label={
          isAdded 
            ? `${item.name} wurde zum Warenkorb hinzugefügt`
            : disabled
            ? `${item.name} ist nicht verfügbar`
            : `${item.name} zum Warenkorb hinzufügen`
        }
        aria-describedby="cart-button-help"
      >
        {isAdded ? (
          <>
            <CheckIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            <span aria-live="polite" aria-atomic="true">Hinzugefügt</span>
          </>
        ) : disabled ? (
          <>
            <ShoppingCartIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            Nicht verfügbar
          </>
        ) : (
          <>
            <ShoppingCartIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            In den Warenkorb
          </>
        )}
      </RippleButton>
      <span id="cart-button-help" className="sr-only">
        Fügt {item.name} zum Warenkorb hinzu
      </span>

      {/* Progressive Enhancement: noscript Fallback für JavaScript-freie Umgebungen */}
      <noscript>
        <form action="/api/cart/add" method="POST" style={{ display: 'inline' }}>
          <input type="hidden" name="gemstoneId" value={item.id} />
          <input type="hidden" name="quantity" value="1" />
          <Button
            type="submit"
            disabled={disabled}
            className={`${
              disabled
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-primary hover:bg-primary/90'
            } text-primary-foreground transition-colors duration-300`}
            aria-label={`${item.name} zum Warenkorb hinzufügen (Formular-Submit)`}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            In den Warenkorb
          </Button>
        </form>
      </noscript>
    </>
  );
}
