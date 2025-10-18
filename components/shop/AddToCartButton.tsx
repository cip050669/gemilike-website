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
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={`${
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
      ) : (
        <>
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          In den Warenkorb
        </>
      )}
    </Button>
  );
}
