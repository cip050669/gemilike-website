'use client';

import { useEffect, useState, useTransition } from 'react';
import { useWishlistStore } from '@/lib/store/wishlist';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';

interface WishlistButtonProps {
  item: {
    id: string;
    name?: string;
    image?: string;
    isSold?: boolean;
  };
  className?: string;
}

export function WishlistButton({ item, className }: WishlistButtonProps) {
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(item.id));
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const summary = useWishlistStore((state) => state.summary);
  const isStoreLoading = useWishlistStore((state) => state.isLoading);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!summary) {
      void fetchWishlist();
    }
  }, [summary, fetchWishlist]);

  const handleToggle = () => {
    if (isPending || isStoreLoading) return;

    setIsAnimating(true);

    startTransition(() => {
      if (isInWishlist) {
        removeItem(item.id).finally(() => {
          setTimeout(() => setIsAnimating(false), 300);
        });
      } else {
        toggleItem(item.id, {
          gemstoneId: item.id,
          name: item.name,
          image: item.image,
          isSold: item.isSold,
        }).finally(() => {
          setTimeout(() => setIsAnimating(false), 300);
        });
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending || isStoreLoading}
      className={`${className ?? ''} ${
        isInWishlist
          ? 'text-red-500 bg-red-50 hover:bg-red-100'
          : 'text-muted-foreground hover:text-red-500'
      } ${isAnimating ? 'scale-110' : ''} transition-all duration-300`}
    >
      <HeartIcon className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
    </Button>
  );
}
