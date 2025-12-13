'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Eye, Trash2, Share2, Plus } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useCartStore } from '@/lib/store/cart';
import type { WishlistItemDTO } from '@/lib/actions/wishlist';

const GEM_IMAGE_PLACEHOLDER = '/products/placeholder-gem.jpg';

const normalizeTreatment = (treatment?: string | null) => treatment?.toLowerCase() ?? 'none';

const getTreatmentIcon = (treatment?: string | null) => {
  switch (normalizeTreatment(treatment)) {
    case 'heated':
      return '🔥';
    case 'irradiated':
      return '⚡';
    case 'coated':
      return '✨';
    case 'filled':
      return '🔧';
    case 'oiled':
      return '💧';
    case 'diffused':
      return '🌈';
    case 'none':
    default:
      return '💎';
  }
};

const getTreatmentColor = (treatment?: string | null) => {
  switch (normalizeTreatment(treatment)) {
    case 'heated':
      return 'text-orange-600';
    case 'irradiated':
      return 'text-purple-600';
    case 'coated':
      return 'text-blue-600';
    case 'filled':
      return 'text-gray-300';
    case 'oiled':
      return 'text-emerald-600';
    case 'diffused':
      return 'text-indigo-600';
    case 'none':
    default:
      return 'text-green-600';
  }
};

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(price);

export default function WishlistManager() {
  const router = useRouter();
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const wishlistError = useWishlistStore((state) => state.error);
  const wishlistLoading = useWishlistStore((state) => state.isLoading);
  const addCartItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    void fetchWishlist();
  }, [fetchWishlist]);

  // Debug: Log wishlist items (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (wishlistItems.length > 0) {
        console.log('Wishlist items loaded:', wishlistItems.length, wishlistItems);
      } else {
        console.log('Wishlist is empty or loading:', { 
          items: wishlistItems.length, 
          loading: wishlistLoading, 
          error: wishlistError 
        });
      }
    }
  }, [wishlistItems, wishlistLoading, wishlistError]);

  const handleRemoveFromWishlist = (gemstoneId: string) => {
    void removeItem(gemstoneId);
  };

  const handleAddToCart = (item: WishlistItemDTO) => {
    const gemstone = item.gemstone;
    if (!gemstone) return;

    try {
      void addCartItem(gemstone.id, 1, {
        gemstoneId: gemstone.id,
        name: gemstone.name,
        price: gemstone.price,
        image: gemstone.images[0],
        category: gemstone.category,
        weight: gemstone.weight ?? undefined,
        weightUnit: gemstone.weightUnit,
        origin: gemstone.origin ?? undefined,
        currency: gemstone.currency,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewDetails = (item: WishlistItemDTO) => {
    const gemstoneId = item.gemstone?.id ?? item.gemstoneId;
    router.push(`/shop/${gemstoneId}`);
  };

  const handleShareWishlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meine Edelstein-Merkliste',
          text: 'Schauen Sie sich meine gespeicherten Edelsteine an!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleClearWishlist = () => {
    if (confirm('Sind Sie sicher, dass Sie Ihre gesamte Merkliste löschen möchten?')) {
      void clearWishlist();
    }
  };

  if (wishlistLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Lädt Merkliste...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (wishlistError) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-red-400 mb-4">{wishlistError}</p>
            <Button onClick={() => fetchWishlist()}>Erneut versuchen</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meine Merkliste</h2>
          <p className="text-muted-foreground">
            Ihre gespeicherten Edelsteine ({wishlistItems.length} Artikel)
          </p>
        </div>
        <div className="flex gap-2">
          {wishlistItems.length > 0 && (
            <>
              <Button variant="outline" onClick={handleShareWishlist}>
                <Share2 className="h-4 w-4 mr-2" />
                Teilen
              </Button>
              <Button variant="outline" onClick={handleClearWishlist}>
                <Trash2 className="h-4 w-4 mr-2" />
                Alle löschen
              </Button>
            </>
          )}
          <Button onClick={() => router.push('/shop')}>
            <Plus className="h-4 w-4 mr-2" />
            Weitere hinzufügen
          </Button>
        </div>
      </div>

      {wishlistItems.length === 0 && !wishlistLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ihre Merkliste ist leer</h3>
              <p className="text-muted-foreground mb-4">
                Entdecken Sie unsere wunderschönen Edelsteine und fügen Sie Ihre Favoriten zur Merkliste hinzu.
              </p>
              <Button onClick={() => router.push('/shop')}>
                <Heart className="h-4 w-4 mr-2" />
                Edelsteine entdecken
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : wishlistItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => {
            const gemstone = item.gemstone;
            const image = item.image ?? gemstone?.images?.[0] ?? GEM_IMAGE_PLACEHOLDER;
            const treatment = gemstone?.treatment ?? 'none';
            const weightLabel = gemstone?.weight != null
              ? `${gemstone.weight.toFixed(2)} ${gemstone.weightUnit}`
              : '—';
            const itemName = gemstone?.name ?? item.name ?? 'Edelstein';

            return (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 relative">
                      <Image
                        src={image}
                        alt={itemName}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardTitle className="text-xl">
                      {itemName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline">{gemstone?.category ?? 'Unbekannt'}</Badge>
                      {gemstone?.isNew && <Badge variant="secondary">Neu</Badge>}
                      {(gemstone?.isSold ?? item.isSold) && <Badge variant="destructive">Verkauft</Badge>}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gemstone ? (
                    <>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-lg p-2">
                          {getTreatmentIcon(treatment)}
                        </Badge>
                        <div>
                          <p className="text-sm text-muted-foreground">Preis</p>
                          <p className="text-2xl font-semibold">
                            {formatPrice(gemstone.price ?? 0, gemstone.currency ?? 'EUR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Gewicht</p>
                          <p className="text-lg">{weightLabel}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Herkunft</p>
                          <p>{gemstone.origin ?? 'Unbekannt'}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid gap-2 text-sm">
                        <p>
                          <span className="font-medium">Farbe:</span> {gemstone.color ?? 'Unbekannt'}
                        </p>
                        <p className={getTreatmentColor(treatment)}>
                          <span className="font-medium">Behandlung:</span> {gemstone.treatment ?? 'Keine Angabe'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Edelstein-Daten werden geladen...</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    {item.slug && (
                      <Button variant="outline" onClick={() => handleViewDetails(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Details ansehen
                      </Button>
                    )}
                    {gemstone && !gemstone.isSold && (
                      <Button onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        In den Warenkorb
                      </Button>
                    )}
                    <Button variant="destructive" onClick={() => handleRemoveFromWishlist(item.gemstoneId)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Entfernen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
