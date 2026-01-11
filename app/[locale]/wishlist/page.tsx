'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Eye, Trash2, Share2, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useCartStore } from '@/lib/store/cart';
import type { WishlistItemDTO } from '@/lib/actions/wishlist';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';

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
      <PublicLayout>
        <div className="min-h-screen public-page-bg text-white pb-16">
          <div className="max-w-6xl mx-auto px-4">
            <ScrollAnimated direction="fade" delay={0}>
              <section className="main-container">
                <div className="story-card space-y-4 p-6 md:p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-200">Lädt Merkliste...</p>
                </div>
              </section>
            </ScrollAnimated>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (wishlistError) {
    return (
      <PublicLayout>
        <div className="min-h-screen public-page-bg text-white pb-16">
          <div className="max-w-6xl mx-auto px-4">
            <ScrollAnimated direction="fade" delay={0}>
              <section className="main-container">
                <div className="story-card space-y-4 p-6 md:p-8 text-center">
                  <p className="text-red-400 mb-4">{wishlistError}</p>
                  <Button onClick={() => fetchWishlist()}>Erneut versuchen</Button>
                </div>
              </section>
            </ScrollAnimated>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <PublicLayout>
        <div className="min-h-screen public-page-bg text-white pb-16">
          <div className="max-w-6xl mx-auto px-4">
            <ScrollAnimated direction="fade" delay={0}>
              <section className="main-container">
                <div className="story-card space-y-4 p-6 md:p-8 text-center">
                  <div className="mb-8">
                    <Heart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 gemilike-text-gradient">
                      {t('wishlistEmpty') || 'Ihre Merkliste ist leer'}
                    </h1>
                    <p className="text-gray-200 mb-6">
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
                      <Button variant="outline" className="w-full border-white/40 text-white hover:bg-gray-800/30">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('backToHome') || 'Zur Startseite'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            </ScrollAnimated>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimated direction="fade" delay={0}>
            <section className="main-container">
              <div className="story-card space-y-4 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-impact font-weight-impact mb-2">
                      <span className="gemilike-text-gradient">{t('wishlist') || 'Meine Merkliste'}</span>
                    </h1>
                    <p className="text-gray-200">
                      {wishlistItems.length} {wishlistItems.length === 1 ? 'Artikel' : 'Artikel'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleShareWishlist} className="border-white/40 text-white hover:bg-gray-800/30">
                      <Share2 className="h-4 w-4 mr-2" />
                      Teilen
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => clearWishlist()}
                      className="text-red-400 hover:text-red-300 border-red-400/40 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('clearWishlist') || 'Alle löschen'}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          <ScrollAnimated direction="up" delay={100}>
            <section className="main-container mt-8">
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
                    <div key={item.id} className="story-card group transition-transform hover:-translate-y-1 hover:shadow-lg">
                      <div className="p-6 md:p-8">
                        <div className="relative mb-4">
                          <div className="relative overflow-hidden rounded-lg border border-white/10 public-page-bg/20 h-[240px] w-full mb-3">
                            <Image
                              src={image}
                              alt={itemName}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <h3 className="text-xl font-bold gemilike-text-gradient mb-2">
                            {itemName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-200 mb-4">
                            <Badge variant="outline" className="border-white/40 text-white">{gemstone?.category ?? 'Unbekannt'}</Badge>
                            {gemstone?.isNew && <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/40">Neu</Badge>}
                            {(gemstone?.isSold ?? item.isSold) && <Badge variant="destructive" className="bg-red-500/20 text-red-200 border-red-400/40">Verkauft</Badge>}
                          </div>
                        </div>
                        <div className="space-y-4">
                          {gemstone ? (
                            <>
                              <div className="flex items-center gap-4 flex-wrap">
                                <Badge variant="outline" className="text-lg p-2 border-white/40 text-white">
                                  {getTreatmentIcon(treatment)}
                                </Badge>
                                <div>
                                  <p className="text-sm text-gray-300">Preis</p>
                                  <p className="text-2xl font-semibold text-white">
                                    {formatPrice(gemstone.price ?? 0, gemstone.currency ?? 'EUR')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-300">Gewicht</p>
                                  <p className="text-lg text-white">{weightLabel}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-300">Herkunft</p>
                                  <p className="text-white">{gemstone.origin ?? 'Unbekannt'}</p>
                                </div>
                              </div>
                              <div className="border-t border-white/20 my-4"></div>
                              <div className="grid gap-2 text-sm">
                                <p className="text-gray-200">
                                  <span className="font-medium">Farbe:</span> {gemstone.color ?? 'Unbekannt'}
                                </p>
                                <p className={`text-gray-200 ${getTreatmentColor(treatment)}`}>
                                  <span className="font-medium">Behandlung:</span> {gemstone.treatment ?? 'Keine Angabe'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-4 text-gray-200">
                              <p>Edelstein-Daten werden geladen...</p>
                            </div>
                          )}
                          <div className="flex items-center gap-3 flex-wrap mt-4">
                            {item.slug && (
                              <Button variant="outline" onClick={() => handleViewDetails(item)} className="border-white/40 text-white hover:bg-gray-800/30">
                                <Eye className="h-4 w-4 mr-2" />
                                Details ansehen
                              </Button>
                            )}
                            {gemstone && !gemstone.isSold && (
                              <Button onClick={() => handleAddToCart(item)} className="bg-primary hover:bg-primary/90">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                In den Warenkorb
                              </Button>
                            )}
                            <Button variant="destructive" onClick={() => handleRemoveFromWishlist(item.gemstoneId)} className="bg-red-500/20 text-red-200 border-red-400/40 hover:bg-red-500/30">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Entfernen
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </ScrollAnimated>
        </div>
      </div>
    </PublicLayout>
  );
}
