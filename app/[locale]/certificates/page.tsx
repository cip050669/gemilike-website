import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Award, CheckCircle, FileText } from 'lucide-react';

export default function CertificatesPage() {
  const t = useTranslations('certificates');

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

          {/* Certificate Types */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-xl">{t('gemologicalCertificate')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 dark:text-gray-300 mb-4">
                  {t('gemologicalCertificateDesc')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('authenticity')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('quality')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('origin')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-xl">{t('qualityCertificate')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 dark:text-gray-300 mb-4">
                  {t('qualityCertificateDesc')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('cutQuality')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('colorGrade')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('clarity')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <CardTitle className="text-xl">{t('originCertificate')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 dark:text-gray-300 mb-4">
                  {t('originCertificateDesc')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('miningLocation')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('ethicalSourcing')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('traceability')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Certification Process */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('certificationProcess')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('step1')}</h4>
                  <p className="text-gray-300 dark:text-gray-300">
                    {t('step1Desc')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('step2')}</h4>
                  <p className="text-gray-300 dark:text-gray-300">
                    {t('step2Desc')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('step3')}</h4>
                  <p className="text-gray-300 dark:text-gray-300">
                    {t('step3Desc')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('step4')}</h4>
                  <p className="text-gray-300 dark:text-gray-300">
                    {t('step4Desc')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('certificationBenefits')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('benefit3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('benefit4')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('benefit5')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('contactInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">{t('certificationRequest')}</h4>
                  <p className="text-gray-300 dark:text-gray-300 mb-4">
                    {t('certificationRequestDesc')}
                  </p>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    {t('requestCertificate')}
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('verification')}</h4>
                  <p className="text-gray-300 dark:text-gray-300 mb-4">
                    {t('verificationDesc')}
                  </p>
                  <button className="bg-gray-800/500/50 text-white py-2 px-4 rounded-md hover:bg-gray-700/300/70 transition-colors">
                    {t('verifyCertificate')}
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
