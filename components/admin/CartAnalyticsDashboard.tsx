'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

interface CartAnalyticsData {
  overview: {
    totalCarts: number;
    activeCarts: number;
    checkedOutCarts: number;
    abandonedCarts: number;
    totalCartItems: number;
    totalQuantity: number;
  };
  metrics: {
    averageCartValue: number;
    conversionRate: number;
    abandonmentRate: number;
    ordersInPeriod: number;
    cartsCreatedInPeriod: number;
  };
  topProducts: Array<{
    gemstoneId: string;
    name: string;
    slug: string | null;
    totalQuantity: number;
    cartCount: number;
    averagePrice: number;
  }>;
  dailyChartData: Array<{
    date: string;
    active: number;
    checkedOut: number;
    abandoned: number;
  }>;
  activeCarts: Array<{
    id: string;
    customerId: string | null;
    customer: { name: string; email: string | null } | null;
    itemCount: number;
    totalQuantity: number;
    totalValue: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    age: number;
  }>;
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

export function CartAnalyticsDashboard({ locale }: { locale: string }) {
  const [data, setData] = useState<CartAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (daysValue: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/carts/analytics?days=${daysValue}`);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Daten');
      }
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Unbekannter Fehler');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  const formatCurrency = (value: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const formatAge = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Lade Daten...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
        <p>Fehler: {error}</p>
        <Button onClick={() => loadData(days)} className="mt-4">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={days.toString()} onValueChange={(value) => setDays(parseInt(value, 10))}>
          <SelectTrigger className="w-48 bg-gray-800/30 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Letzte 7 Tage</SelectItem>
            <SelectItem value="30">Letzte 30 Tage</SelectItem>
            <SelectItem value="90">Letzte 90 Tage</SelectItem>
            <SelectItem value="365">Letztes Jahr</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Aktive Warenkörbe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{data.overview.activeCarts}</p>
            <p className="text-sm text-gray-400 mt-1">von {data.overview.totalCarts} insgesamt</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Durchschnittlicher Wert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">
              {formatCurrency(data.metrics.averageCartValue)}
            </p>
            <p className="text-sm text-gray-400 mt-1">pro Warenkorb</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {data.metrics.conversionRate.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {data.overview.checkedOutCarts} / {data.metrics.cartsCreatedInPeriod} Carts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Abandonment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-400">
              {data.metrics.abandonmentRate.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {data.overview.abandonedCarts} abgebrochene Carts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Warenkorb-Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Aktiv</span>
              <span className="text-white font-semibold">{data.overview.activeCarts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Zum Checkout</span>
              <span className="text-white font-semibold">{data.overview.checkedOutCarts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Abgebrochen</span>
              <span className="text-white font-semibold">{data.overview.abandonedCarts}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Artikel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Gesamt Artikel</span>
              <span className="text-white font-semibold">{data.overview.totalCartItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Gesamt Menge</span>
              <span className="text-white font-semibold">{data.overview.totalQuantity}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Zeitraum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Von</span>
              <span className="text-white font-semibold">{formatDate(data.period.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Bis</span>
              <span className="text-white font-semibold">{formatDate(data.period.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Neue Carts</span>
              <span className="text-white font-semibold">{data.metrics.cartsCreatedInPeriod}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      {data.topProducts.length > 0 && (
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Produkte in Warenkörben</CardTitle>
            <CardDescription className="text-gray-400">
              Meist hinzugefügte Produkte im gewählten Zeitraum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4 text-gray-300">Produkt</th>
                    <th className="text-right py-2 px-4 text-gray-300">Menge</th>
                    <th className="text-right py-2 px-4 text-gray-300">In Carts</th>
                    <th className="text-right py-2 px-4 text-gray-300">Ø Preis</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((product) => (
                    <tr key={product.gemstoneId} className="border-b border-gray-700/50">
                      <td className="py-2 px-4">
                        {product.slug ? (
                          <Link
                            href={`/${locale}/shop/${product.slug}`}
                            className="text-cyan-300 hover:text-cyan-200"
                          >
                            {product.name}
                          </Link>
                        ) : (
                          <span className="text-white">{product.name}</span>
                        )}
                      </td>
                      <td className="text-right py-2 px-4 text-white">{product.totalQuantity}</td>
                      <td className="text-right py-2 px-4 text-white">{product.cartCount}</td>
                      <td className="text-right py-2 px-4 text-white">
                        {formatCurrency(product.averagePrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Carts */}
      {data.activeCarts.length > 0 && (
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Aktive Warenkörbe</CardTitle>
            <CardDescription className="text-gray-400">
              Letzte 50 aktive Warenkörbe aus dem gewählten Zeitraum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4 text-gray-300">Kunde</th>
                    <th className="text-right py-2 px-4 text-gray-300">Artikel</th>
                    <th className="text-right py-2 px-4 text-gray-300">Menge</th>
                    <th className="text-right py-2 px-4 text-gray-300">Wert</th>
                    <th className="text-right py-2 px-4 text-gray-300">Alter</th>
                    <th className="text-right py-2 px-4 text-gray-300">Aktualisiert</th>
                  </tr>
                </thead>
                <tbody>
                  {data.activeCarts.map((cart) => (
                    <tr key={cart.id} className="border-b border-gray-700/50">
                      <td className="py-2 px-4">
                        {cart.customer ? (
                          <div>
                            <div className="text-white">{cart.customer.name}</div>
                            {cart.customer.email && (
                              <div className="text-sm text-gray-400">{cart.customer.email}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Gast</span>
                        )}
                      </td>
                      <td className="text-right py-2 px-4 text-white">{cart.itemCount}</td>
                      <td className="text-right py-2 px-4 text-white">{cart.totalQuantity}</td>
                      <td className="text-right py-2 px-4 text-white">
                        {formatCurrency(cart.totalValue, cart.currency)}
                      </td>
                      <td className="text-right py-2 px-4 text-gray-400">{formatAge(cart.age)}</td>
                      <td className="text-right py-2 px-4 text-gray-400">
                        {formatDate(cart.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

