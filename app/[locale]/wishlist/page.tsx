'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Eye, Trash2, Share2, ArrowLeft } from 'lucide-react';
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

export default function WishlistPage() {
  const t = useTranslations('shop');
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

  const handleRemoveFromWishlist = (gemstoneId: string) => {
    void removeItem(gemstoneId);
  };

  const handleAddToCart = (item: WishlistItemDTO) => {
    const gemstone = item.gemstone;
    if (!gemstone) return;

    addCartItem(gemstone.id, 1, {
      gemstoneId: gemstone.id,
      name: gemstone.name,
      price: gemstone.price,
      image: gemstone.images?.[0] ?? null,
      category: gemstone.category,
      weight: gemstone.weight ?? undefined,
      weightUnit: gemstone.weightUnit,
      origin: gemstone.origin ?? undefined,
      currency: gemstone.currency,
    });
  };

  const handleViewDetails = (item: WishlistItemDTO) => {
    const slug = item.slug ?? item.gemstone?.slug;
    if (slug) {
      router.push(`/shop/${slug}`);
    } else {
      router.push(`/shop/${item.gemstoneId}`);
    }
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Meine Wunschliste',
        text: 'Schauen Sie sich meine Wunschliste an!',
        url: window.location.href,
      }).catch(() => {
        // Fallback: URL in Zwischenablage kopieren
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (wishlistLoading) {
    return (
      <div className="container py-12 md:py-20 text-[var(--color-text-primary)]">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Lädt Merkliste...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (wishlistError) {
    return (
      <div className="container py-12 md:py-20 text-[var(--color-text-primary)]">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-400 mb-4">{wishlistError}</p>
              <Button onClick={() => fetchWishlist()}>Erneut versuchen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container py-12 md:py-20 text-[var(--color-text-primary)]">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <Heart className="w-24 h-24 mx-auto text-muted-foreground/50 mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t('wishlistEmpty') || 'Ihre Merkliste ist leer'}</h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {t('wishlistEmptyDescription') || 'Entdecken Sie unsere wunderschönen Edelsteine und fügen Sie Ihre Favoriten zur Merkliste hinzu.'}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/shop">
              <Button className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('goToShop') || 'Zum Shop'}
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToHome') || 'Zur Startseite'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20 text-[var(--color-text-primary)]">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('wishlist') || 'Meine Merkliste'}</h1>
            <p className="text-[var(--color-text-secondary)]">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Artikel' : 'Artikel'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShareWishlist}>
              <Share2 className="h-4 w-4 mr-2" />
              Teilen
            </Button>
            <Button 
              variant="outline" 
              onClick={() => clearWishlist()}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('clearWishlist') || 'Alle löschen'}
            </Button>
          </div>
        </div>
      </div>

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
                  <div className="bg-muted rounded-lg overflow-hidden mb-3 relative" style={{ width: '240px', height: '240px' }}>
                    <Image
                      src={image}
                      alt={itemName}
                      width={240}
                      height={240}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-xl">
                    {itemName}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{gemstone?.category ?? 'Unbekannt'}</Badge>
                    {gemstone?.isNew && <Badge variant="secondary">Neu</Badge>}
                    {(gemstone?.isSold ?? item.isSold) && <Badge variant="destructive">Verkauft</Badge>}
                  </div>
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
    </div>
  );
}
