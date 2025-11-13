'use client';

import { useEffect, useState } from 'react';
import { Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface WishlistItem {
  id: string;
  gemstone: {
    id: string;
    name: string;
    slug: string;
    category: string;
  } | null;
  notes: string | null;
  createdAt: string;
}

interface Wishlist {
  id: string;
  name: string;
  isPrimary: boolean;
  customer: {
    id: string;
    name: string;
    email: string | null;
    customerNumber: string;
  } | null;
  itemCount: number;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

interface Analytics {
  totalWishlists: number;
  totalItems: number;
  totalCustomers: number;
  popularGemstones: Array<{
    gemstone: {
      id: string;
      name: string;
      slug: string;
      category: string;
    };
    count: number;
  }>;
}

export default function AdminWishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const response = await fetch('/api/admin/wishlists');
      const data = await response.json();

      if (data.success) {
        setWishlists(data.wishlists);
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50 p-8">
        <div className="container mx-auto">
          <div className="text-white">Lade Merklisten...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Merklisten</h1>
          <p className="text-gray-300">Verwalten Sie alle Kundenmerklisten</p>
        </div>

        {/* Analytics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card data-testid="wishlist-analytics-total-wishlists">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Gesamt Merklisten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-3xl font-bold"
                  data-testid="wishlist-analytics-total-wishlists-value"
                >
                  {analytics.totalWishlists}
                </div>
              </CardContent>
            </Card>
            <Card data-testid="wishlist-analytics-total-items">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Gesamt Artikel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-3xl font-bold"
                  data-testid="wishlist-analytics-total-items-value"
                >
                  {analytics.totalItems}
                </div>
              </CardContent>
            </Card>
            <Card data-testid="wishlist-analytics-total-customers">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Kunden mit Merkliste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-3xl font-bold"
                  data-testid="wishlist-analytics-total-customers-value"
                >
                  {analytics.totalCustomers}
                </div>
              </CardContent>
            </Card>
            <Card data-testid="wishlist-analytics-average-items">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Durchschnitt pro Merkliste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-3xl font-bold"
                  data-testid="wishlist-analytics-average-items-value"
                >
                  {analytics.totalWishlists > 0
                    ? (analytics.totalItems / analytics.totalWishlists).toFixed(1)
                    : '0'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Popular Gemstones */}
        {analytics && analytics.popularGemstones.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Beliebte Artikel in Merklisten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.popularGemstones.slice(0, 10).map((item, index) => (
                  <div
                    key={item.gemstone.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <Link
                        href={`/de/shop/${item.gemstone.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.gemstone.name}
                      </Link>
                      <Badge>{item.gemstone.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-semibold">{item.count}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wishlists List */}
        <div className="space-y-4">
          {wishlists.map((wishlist) => (
            <Card key={wishlist.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      {wishlist.name || 'Standard-Merkliste'}
                      {wishlist.isPrimary && (
                        <Badge variant="secondary">Primär</Badge>
                      )}
                    </CardTitle>
                    {wishlist.customer && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Kunde:</strong> {wishlist.customer.name} (
                        {wishlist.customer.customerNumber})
                        {wishlist.customer.email && ` - ${wishlist.customer.email}`}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">{wishlist.itemCount} Artikel</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {wishlist.items.length > 0 ? (
                  <div className="space-y-2">
                    {wishlist.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          {item.gemstone ? (
                            <Link
                              href={`/de/shop/${item.gemstone.slug}`}
                              className="text-blue-500 hover:underline"
                            >
                              {item.gemstone.name}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">Gelöschtes Produkt</span>
                          )}
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Keine Artikel in dieser Merkliste.</p>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  Erstellt: {formatDate(wishlist.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}

          {wishlists.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Keine Merklisten gefunden.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
