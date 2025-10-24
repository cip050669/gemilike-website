import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  locale?: string
  alternateLocales?: { locale: string; url: string }[]
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/logo.png',
  url,
  type = 'website',
  locale = 'de',
  alternateLocales = []
}: SEOProps): Metadata {
  const baseUrl = 'https://gemilike.de'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  const defaultKeywords = [
    'Edelsteine',
    'Schmuck',
    'Diamanten',
    'Rubine',
    'Smaragde',
    'Saphire',
    'Gemilike',
    'Edelstein Shop',
    'Schmuck Online',
    'Luxus Edelsteine'
  ]

  const allKeywords = [...defaultKeywords, ...keywords].join(', ')

  return {
    title: `${title} | Gemilike - Heroes in Gems`,
    description,
    keywords: allKeywords,
    authors: [{ name: 'Gemilike' }],
    creator: 'Gemilike',
    publisher: 'Gemilike',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
      languages: {
        'de-DE': `${baseUrl}/de${url || ''}`,
        'en-US': `${baseUrl}/en${url || ''}`,
        ...Object.fromEntries(
          alternateLocales.map(alt => [alt.locale, alt.url])
        )
      },
    },
    openGraph: {
      title: `${title} | Gemilike - Heroes in Gems`,
      description,
      url: fullUrl,
      siteName: 'Gemilike',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      type: (type === 'product' ? 'website' : type) || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Gemilike - Heroes in Gems`,
      description,
      images: [fullImageUrl],
      creator: '@gemilike',
      site: '@gemilike',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  }
}

// Vordefinierte SEO-Konfigurationen für häufige Seiten
export const seoConfig = {
  home: {
    title: 'Gemilike - Heroes in Gems',
    description: 'Entdecken Sie exklusive Edelsteine und Luxus-Schmuck bei Gemilike. Diamanten, Rubine, Smaragde und Saphire in höchster Qualität. Jetzt online kaufen!',
    keywords: ['Edelsteine kaufen', 'Luxus Schmuck', 'Diamanten Shop', 'Edelstein Online Shop'],
  },
  about: {
    title: 'Über uns',
    description: 'Erfahren Sie mehr über Gemilike - Ihr vertrauensvoller Partner für exklusive Edelsteine und Luxus-Schmuck. Über 20 Jahre Erfahrung in der Edelsteinbranche.',
    keywords: ['Über Gemilike', 'Edelstein Experten', 'Unternehmensgeschichte'],
  },
  services: {
    title: 'Unsere Leistungen',
    description: 'Entdecken Sie unsere umfassenden Dienstleistungen: Edelstein-Beratung, Schmuck-Design, Zertifizierung und Reparatur. Professionelle Beratung von Experten.',
    keywords: ['Edelstein Beratung', 'Schmuck Design', 'Zertifizierung', 'Reparatur'],
  },
  shop: {
    title: 'Edelstein Shop',
    description: 'Durchstöbern Sie unsere exklusive Kollektion von Edelsteinen. Diamanten, Rubine, Smaragde, Saphire und mehr. Hochwertige Qualität zu fairen Preisen.',
    keywords: ['Edelstein Shop', 'Diamanten kaufen', 'Rubine', 'Smaragde', 'Saphire'],
  },
  contact: {
    title: 'Kontakt',
    description: 'Kontaktieren Sie uns für eine persönliche Beratung. Unser Expertenteam steht Ihnen gerne zur Verfügung. Telefon, E-Mail oder vor Ort in unserem Showroom.',
    keywords: ['Kontakt Gemilike', 'Edelstein Beratung', 'Showroom'],
  },
  blog: {
    title: 'Edelstein Blog',
    description: 'Lesen Sie spannende Artikel über Edelsteine, Schmuck-Trends und Pflegetipps. Wissenswertes aus der Welt der Edelsteine von unseren Experten.',
    keywords: ['Edelstein Blog', 'Schmuck Trends', 'Edelstein Wissen', 'Pflegetipps'],
  },
  privacy: {
    title: 'Datenschutzerklärung',
    description: 'Datenschutzerklärung von Gemilike. Informationen zum Umgang mit Ihren personenbezogenen Daten gemäß DSGVO.',
    keywords: ['Datenschutz', 'DSGVO', 'Privatsphäre'],
  },
  terms: {
    title: 'AGB',
    description: 'Allgemeine Geschäftsbedingungen von Gemilike. Rechtliche Grundlagen für den Kauf von Edelsteinen und Schmuck.',
    keywords: ['AGB', 'Geschäftsbedingungen', 'Kaufbedingungen'],
  },
  imprint: {
    title: 'Impressum',
    description: 'Impressum von Gemilike. Angaben gemäß § 5 TMG über unser Unternehmen und die verantwortlichen Personen.',
    keywords: ['Impressum', 'Anbieterkennzeichnung', 'TMG'],
  },
}

