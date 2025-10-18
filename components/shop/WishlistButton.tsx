'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  gemstoneId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}

export function WishlistButton({ 
  gemstoneId, 
  className, 
  size = 'sm', 
  variant = 'ghost',
  showText = false 
}: WishlistButtonProps) {
  const t = useTranslations('shop');
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isWishlisted = isInWishlist(gemstoneId);
  
  const handleToggle = () => {
    setIsAnimating(true);
    toggleItem(gemstoneId);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={cn(
        'transition-all duration-200',
        isWishlisted && 'text-red-500 hover:text-red-600',
        !isWishlisted && 'text-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500',
        isAnimating && 'scale-110',
        className
      )}
      aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
    >
      {isWishlisted ? (
        <Heart className="w-4 h-4 fill-current" />
      ) : (
        <HeartOff className="w-4 h-4" />
      )}
      {showText && (
        <span className="ml-2">
          {isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
        </span>
      )}
    </Button>
  );
}
