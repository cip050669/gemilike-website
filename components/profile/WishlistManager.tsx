'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Eye, Trash2, Share2, Plus } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useCartStore } from '@/lib/store/cart';
import { Gemstone, Treatment } from '@/lib/types/gemstone';
import { allGemstones } from '@/lib/data/gemstones';

export default function WishlistManager() {
  const router = useRouter();
  const { items: wishlistItems, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [wishlistData, setWishlistData] = useState<Gemstone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlistData = useCallback(() => {
    const gemstones = allGemstones.filter((gemstone) =>
      wishlistItems.some(item => item.id === gemstone.id)
    );
    setWishlistData(gemstones);
    setIsLoading(false);
  }, [wishlistItems]);

  useEffect(() => {
    loadWishlistData();
  }, [loadWishlistData]);

  const handleRemoveFromWishlist = (gemstoneId: string) => {
    removeItem(gemstoneId);
  };

  const handleAddToCart = async (gemstone: Gemstone) => {
    try {
      await addItem({
        id: gemstone.id,
        name: gemstone.name,
        price: gemstone.price,
        image: gemstone.images[0],
        quantity: 1,
      });
      
      // Optional: Remove from wishlist after adding to cart
      // removeItem(gemstone.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewDetails = (gemstoneId: string) => {
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
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleClearWishlist = () => {
    if (confirm('Sind Sie sicher, dass Sie Ihre gesamte Merkliste löschen möchten?')) {
      clearWishlist();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getTreatmentIcon = (treatment?: Treatment | null) => {
    if (!treatment) return '💎';
    
    switch (treatment.type) {
      case 'none':
        return '💎';
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
      default:
        return '💎';
    }
  };

  const getTreatmentColor = (treatment?: Treatment | null) => {
    if (!treatment) return 'text-green-600';
    
    switch (treatment.type) {
      case 'none':
        return 'text-green-600';
      case 'heated':
        return 'text-orange-600';
      case 'irradiated':
        return 'text-purple-600';
      case 'coated':
        return 'text-blue-600';
      case 'filled':
        return 'text-gray-600';
      case 'oiled':
        return 'text-emerald-600';
      case 'diffused':
        return 'text-indigo-600';
      default:
        return 'text-green-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Lädt Merkliste...</div>
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
            Ihre gespeicherten Edelsteine ({wishlistData.length} Artikel)
          </p>
        </div>
        <div className="flex gap-2">
          {wishlistData.length > 0 && (
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

      {wishlistData.length === 0 ? (
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wishlistData.map((gemstone) => (
            <Card key={gemstone.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="relative">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 relative">
                    <Image
                      src={gemstone.images[0]}
                      alt={gemstone.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {gemstone.certified && (
                      <Badge variant="secondary" className="text-xs">
                        Zertifiziert
                      </Badge>
                    )}
                    {!gemstone.inStock && (
                      <Badge variant="destructive" className="text-xs">
                        Ausverkauft
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {gemstone.name}
                </CardTitle>
                <CardDescription className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Kategorie:</span>
                    <Badge variant="outline" className="text-xs">
                      {gemstone.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Herkunft:</span>
                    <span className="text-sm font-medium">{gemstone.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Behandlung:</span>
                    <span className={`text-sm font-medium ${getTreatmentColor(gemstone.treatment)}`}>
                      {getTreatmentIcon(gemstone.treatment)} {gemstone.treatment?.type === 'none' ? 'Unbehandelt' : gemstone.treatment?.type}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(gemstone.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {gemstone.weight} ct
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleViewDetails(gemstone.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(gemstone.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {gemstone.inStock && (
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(gemstone)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    In den Warenkorb
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {wishlistData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Schnellaktionen</CardTitle>
            <CardDescription>
              Verwalten Sie Ihre Merkliste effizient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Add all items to cart
                  wishlistData.forEach(gemstone => {
                    if (gemstone.inStock) {
                      handleAddToCart(gemstone);
                    }
                  });
                }}
                disabled={!wishlistData.some(g => g.inStock)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Alle verfügbaren in den Warenkorb
              </Button>
              <Button
                variant="outline"
                onClick={handleShareWishlist}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Merkliste teilen
              </Button>
              <Button
                variant="outline"
                onClick={handleClearWishlist}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Merkliste leeren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
