'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Users, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface FunnelStep {
  step: string;
  label: string;
  count: number;
  uniqueUsers: number;
  avgDuration: number;
  conversionRate: number;
}

interface CheckoutAnalytics {
  overview: {
    totalCheckouts: number;
    completedCheckouts: number;
    abandonedCheckouts: number;
    conversionRate: number;
    abandonmentRate: number;
    avgCheckoutDuration: number;
  };
  funnel: FunnelStep[];
  dropOffs: Array<{ step: string; count: number }>;
  errors: Array<{ step: string; error: string; count: number }>;
  dailyTrends: Array<{
    date: string;
    starts: number;
    completions: number;
    abandonments: number;
  }>;
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

export default function CheckoutAnalyticsPage() {
  const [analytics, setAnalytics] = useState<CheckoutAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/checkout-analytics?days=${days}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAnalytics(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching checkout analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50 flex items-center justify-center">
        <p className="text-gray-300">Lädt...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-800/50 flex items-center justify-center">
        <p className="text-red-400">Fehler beim Laden der Daten</p>
      </div>
    );
  }

  const stepLabels: Record<string, string> = {
    start: 'Checkout gestartet',
    address: 'Adresse ausgefüllt',
    payment: 'Zahlungsmethode gewählt',
    shipping: 'Versand gewählt',
    coupon: 'Gutschein angewendet',
    review: 'Bestellung überprüft',
    submit: 'Bestellung abgeschickt',
    success: 'Bestellung erfolgreich',
    abandon: 'Checkout abgebrochen',
  };

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Checkout-Analytics</h1>
              <p className="text-gray-300">Überwachung des Checkout-Funnels und Conversion-Rate</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={days === 7 ? 'default' : 'outline'}
                onClick={() => setDays(7)}
              >
                7 Tage
              </Button>
              <Button
                variant={days === 30 ? 'default' : 'outline'}
                onClick={() => setDays(30)}
              >
                30 Tage
              </Button>
              <Button
                variant={days === 90 ? 'default' : 'outline'}
                onClick={() => setDays(90)}
              >
                90 Tage
              </Button>
            </div>
          </div>
        </div>

        {/* Overview KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Checkouts gestartet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analytics.overview.totalCheckouts}</div>
              <p className="text-xs text-gray-400 mt-1">Im ausgewählten Zeitraum</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Erfolgreich abgeschlossen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{analytics.overview.completedCheckouts}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-green-600">
                  {analytics.overview.conversionRate.toFixed(1)}%
                </Badge>
                <span className="text-xs text-gray-400">Conversion-Rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                Abgebrochen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{analytics.overview.abandonedCheckouts}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="destructive">
                  {analytics.overview.abandonmentRate.toFixed(1)}%
                </Badge>
                <span className="text-xs text-gray-400">Abandonment-Rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Durchschnittliche Dauer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {Math.round(analytics.overview.avgCheckoutDuration / 1000 / 60)}
              </div>
              <p className="text-xs text-gray-400 mt-1">Minuten</p>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Checkout-Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.funnel.map((step, index) => {
                const prevStep = index > 0 ? analytics.funnel[index - 1] : null;
                const dropOff = prevStep 
                  ? prevStep.uniqueUsers - step.uniqueUsers 
                  : analytics.overview.totalCheckouts - step.uniqueUsers;
                const dropOffRate = prevStep && prevStep.uniqueUsers > 0
                  ? (dropOff / prevStep.uniqueUsers) * 100
                  : 0;

                return (
                  <div key={step.step} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium text-white">{step.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                          {step.uniqueUsers} Nutzer
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {step.conversionRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                        style={{ width: `${step.conversionRate}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                        {step.count} Events
                      </div>
                    </div>
                    {dropOff > 0 && (
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <TrendingDown className="h-3 w-3" />
                        <span>
                          {dropOff} Nutzer haben abgebrochen ({dropOffRate.toFixed(1)}%)
                        </span>
                        {step.avgDuration > 0 && (
                          <span className="text-gray-500 ml-auto">
                            Ø {Math.round(step.avgDuration / 1000)}s
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Errors */}
        {analytics.errors.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                Häufigste Fehler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.errors.map((error, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-700/50 rounded border border-gray-600"
                  >
                    <div>
                      <p className="text-white font-medium">{stepLabels[error.step] || error.step}</p>
                      <p className="text-sm text-gray-400">{error.error}</p>
                    </div>
                    <Badge variant="destructive">{error.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tägliche Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.dailyTrends.map((trend, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded border border-gray-600"
                >
                  <span className="text-white">
                    {new Date(trend.date).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">{trend.starts} Starts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">{trend.completions} Erfolg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-400">{trend.abandonments} Abbrüche</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

