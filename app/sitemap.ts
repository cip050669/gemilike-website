import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gemilike.de'
  
  // Statische Seiten
  const staticPages = [
    '',
    '/about',
    '/services', 
    '/blog',
    '/shop',
    '/contact',
    '/auth/signin',
    '/auth/signup',
    '/privacy',
    '/terms',
    '/imprint',
    '/cookies'
  ]

  // Admin-Seiten (nicht in Sitemap)
  const adminPages = [
    '/admin',
    '/admin/dashboard',
    '/admin/gemstones',
    '/admin/customers',
    '/admin/orders',
    '/admin/reports',
    '/admin/audit',
    '/admin/settings',
    '/admin/newsletter'
  ]

  // Dynamische Seiten (für zukünftige Erweiterung)
  const dynamicPages = [
    // Blog-Artikel werden später hinzugefügt
    // Produktdetail-Seiten werden später hinzugefügt
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Für jede Sprache
  locales.forEach(locale => {
    // Statische Seiten
    staticPages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      })
    })

    // Dynamische Seiten (wenn verfügbar)
    dynamicPages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    })
  })

  return sitemap
}

