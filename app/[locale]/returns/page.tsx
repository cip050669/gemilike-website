import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Clock, Shield } from 'lucide-react';

export default function ReturnsPage() {
  const t = useTranslations('returns');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-6xl container-dark">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-glow mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-300 dark:text-gray-300 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Return Process */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <ArrowLeft className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-xl">{t('step1')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 dark:text-gray-300">
                  {t('step1Desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-xl">{t('step2')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 dark:text-gray-300">
                  {t('step2Desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <CardTitle className="text-xl">{t('step3')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 dark:text-gray-300">
                  {t('step3Desc')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Return Policy */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('returnPolicy')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('returnPeriod')}</h4>
                  <p className="text-gray-300 dark:text-gray-300">
                    {t('returnPeriodDesc')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('returnConditions')}</h4>
                  <p className="text-gray-300 dark:text-gray-300">
                    {t('returnConditionsDesc')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('refundProcess')}</h4>
                  <p className="text-gray-300 dark:text-gray-300">
                    {t('refundProcessDesc')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('returnConditions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('condition1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('condition2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('condition3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('condition4')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('condition5')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Return Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('returnForm')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('orderNumber')}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('orderNumberPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('email')}</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('emailPlaceholder')}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">{t('returnReason')}</label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{t('selectReason')}</option>
                    <option value="defective">{t('defective')}</option>
                    <option value="wrong-item">{t('wrongItem')}</option>
                    <option value="not-as-described">{t('notAsDescribed')}</option>
                    <option value="changed-mind">{t('changedMind')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">{t('additionalInfo')}</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('additionalInfoPlaceholder')}
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors">
                    {t('submitReturn')}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
