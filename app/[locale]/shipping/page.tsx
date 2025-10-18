import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, Clock, Shield } from 'lucide-react';

export default function ShippingPage() {
  const t = useTranslations('shipping');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-6xl container-dark">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-glow mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Shipping Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Truck className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-xl">{t('standardShipping')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('standardShippingDesc')}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{t('deliveryTime')}: 3-5 {t('businessDays')}</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-4">
                  {t('freeShipping')}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-xl">{t('expressShipping')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('expressShippingDesc')}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{t('deliveryTime')}: 1-2 {t('businessDays')}</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mt-4">
                  €9.99
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <CardTitle className="text-xl">{t('insuredShipping')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('insuredShippingDesc')}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{t('deliveryTime')}: 2-3 {t('businessDays')}</span>
                </div>
                <div className="text-2xl font-bold text-purple-600 mt-4">
                  €14.99
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('shippingInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('processingTime')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('processingTimeDesc')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('tracking')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('trackingDesc')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('internationalShipping')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('internationalShippingDesc')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('deliveryAreas')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>{t('germany')}</span>
                    <span className="text-green-600 font-semibold">{t('free')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('austria')}</span>
                    <span className="text-blue-600 font-semibold">€5.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('switzerland')}</span>
                    <span className="text-blue-600 font-semibold">€7.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('euCountries')}</span>
                    <span className="text-blue-600 font-semibold">€9.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('worldwide')}</span>
                    <span className="text-blue-600 font-semibold">€19.99</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
