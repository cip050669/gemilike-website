'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon, CheckIcon } from 'lucide-react';

interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
    weight?: number;
    origin?: string;
  };
  disabled?: boolean;
}

export function AddToCartButton({ item, disabled = false }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (disabled) {
      return;
    }
    addItem(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled}
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
