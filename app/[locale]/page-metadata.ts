import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata, seoConfig } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  return generateSEOMetadata({
    ...seoConfig.home,
    locale,
    url: `/${locale}`,
    alternateLocales: [
      { locale: 'de-DE', url: '/de' },
      { locale: 'en-US', url: '/en' }
    ]
  })
}

