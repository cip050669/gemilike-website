'use client';

import { useTranslations } from 'next-intl';
import { useWishlistStore } from '@/lib/store/wishlist';
import { allGemstones } from '@/lib/data/gemstones';
import { GemstoneCard } from '@/components/shop/GemstoneCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Gemstone } from '@/lib/types/gemstone';

export default function WishlistPage() {
  const t = useTranslations('shop');
  const { items: wishlistItems, clearWishlist } = useWishlistStore();
  const wishlistIds = useMemo(() => new Set(wishlistItems.map((item) => item.id)), [wishlistItems]);
  const [wishlistGemstones, setWishlistGemstones] = useState<Gemstone[]>([]);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Filter gemstones that are in wishlist
  useEffect(() => {
    const filtered = allGemstones.filter((gemstone) => wishlistIds.has(gemstone.id));
    setWishlistGemstones(filtered);
  }, [wishlistIds]);

  const handleAddToCart = (gemstone: Gemstone) => {
    // This would integrate with your cart store
    setAddedItems(new Set(addedItems).add(gemstone.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(gemstone.id);
        return next;
      });
    }, 2000);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container py-12 md:py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <Heart className="w-24 h-24 mx-auto text-muted-foreground/50 mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t('wishlistEmpty')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('wishlistEmptyDescription')}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/shop">
              <Button className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                {t('goToShop')}
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToHome')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('wishlist')}</h1>
            <p className="text-muted-foreground">
              {t('wishlistCount', { count: wishlistItems.length })}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700"
          >
            {t('clearWishlist')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlistGemstones.map((gemstone) => (
          <GemstoneCard
            key={gemstone.id}
            gemstone={gemstone}
            onAddToCart={handleAddToCart}
            isAdded={addedItems.has(gemstone.id)}
          />
        ))}
      </div>
    </div>
  );
}
