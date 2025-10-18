'use client';

import { useState } from 'react';
import { useWishlistStore } from '@/lib/store/wishlist';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';

interface WishlistButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
    weight?: number;
    origin?: string;
  };
  className?: string;
}

export function WishlistButton({ item, className }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isInList = isInWishlist(item.id);

  const handleToggle = () => {
    setIsAnimating(true);
    
    if (isInList) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`${className} ${
        isInList 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-muted-foreground hover:text-red-500'
      } ${
        isAnimating ? 'scale-110' : ''
      } transition-all duration-300`}
    >
      <HeartIcon 
        className={`h-4 w-4 ${
          isInList ? 'fill-current' : ''
        }`} 
      />
    </Button>
  );
}
