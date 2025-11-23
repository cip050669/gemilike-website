import { useTranslations } from 'next-intl';
import { Shield, Award, CheckCircle, FileText } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function CertificatesPage() {
  const t = useTranslations('certificates');

  return (
    <PublicLayout>
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="main-container">
            <div className="story-card space-y-4 p-6 md:p-8">
              <div className="space-y-4 text-center">
                <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                  <span className="gemilike-text-gradient">{t('title')}</span>
                </h1>
                <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
                  {t('subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Types */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mt-8">
            <div className="story-card">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <h2 className="text-xl font-bold text-gray-200">{t('gemologicalCertificate')}</h2>
                </div>
                <p className="text-gray-200 mb-4">
                  {t('gemologicalCertificateDesc')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('authenticity')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('quality')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('origin')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="story-card">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-8 w-8 text-primary" />
                  <h2 className="text-xl font-bold text-gray-200">{t('qualityCertificate')}</h2>
                </div>
                <p className="text-gray-200 mb-4">
                  {t('qualityCertificateDesc')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('cutQuality')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('colorGrade')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('clarity')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="story-card">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <h2 className="text-xl font-bold text-gray-200">{t('originCertificate')}</h2>
                </div>
                <p className="text-gray-200 mb-4">
                  {t('originCertificateDesc')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('miningLocation')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('ethicalSourcing')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-gray-200">{t('traceability')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Certification Process */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="story-card">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-200">{t('certificationProcess')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-200">{t('step1')}</h3>
                    <p className="text-gray-200">
                      {t('step1Desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-200">{t('step2')}</h3>
                    <p className="text-gray-200">
                      {t('step2Desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-200">{t('step3')}</h3>
                    <p className="text-gray-200">
                      {t('step3Desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-200">{t('step4')}</h3>
                    <p className="text-gray-200">
                      {t('step4Desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="story-card">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-200">{t('certificationBenefits')}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-200">{t('benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-200">{t('benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-200">{t('benefit3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-200">{t('benefit4')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-200">{t('benefit5')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="story-card">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-200">{t('contactInfo')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-200">{t('certificationRequest')}</h3>
                  <p className="text-gray-200 mb-4">
                    {t('certificationRequestDesc')}
                  </p>
                  <button className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                    {t('requestCertificate')}
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-200">{t('verification')}</h3>
                  <p className="text-gray-200 mb-4">
                    {t('verificationDesc')}
                  </p>
                  <button className="bg-primary/50 text-white py-2 px-4 rounded-md hover:bg-primary/70 transition-colors">
                    {t('verifyCertificate')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
