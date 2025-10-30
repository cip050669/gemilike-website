'use client';

import { useEffect, useState, useTransition } from 'react';
import { useWishlistStore } from '@/lib/store/wishlist';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';

interface WishlistButtonProps {
  item: {
    id: string;
  };
  className?: string;
}

export function WishlistButton({ item, className }: WishlistButtonProps) {
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(item.id));
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const summary = useWishlistStore((state) => state.summary);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!summary) {
      void fetchWishlist();
    }
  }, [summary, fetchWishlist]);

  const handleToggle = () => {
    if (isPending) return;

    setIsAnimating(true);

    startTransition(() => {
      const action = isInWishlist ? removeItem : toggleItem;
      action(item.id).finally(() => {
        setTimeout(() => setIsAnimating(false), 300);
      });
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
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
