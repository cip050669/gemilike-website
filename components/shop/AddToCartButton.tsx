'use client';

import { useState, useTransition } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
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
    <Button
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
    >
      {isAdded ? (
        <>
          <CheckIcon className="h-4 w-4 mr-2" />
          Hinzugefügt
        </>
      ) : disabled ? (
        <>
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          Nicht verfügbar
        </>
      ) : (
        <>
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          In den Warenkorb
        </>
      )}
    </Button>
  );
}
