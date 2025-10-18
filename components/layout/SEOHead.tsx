import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gemilike - Heroes in Gems | Edelsteinhandel',
  description: 'Ihr Spezialist für rohe und geschliffene Edelsteine. Entdecken Sie unsere exquisite Auswahl an Diamanten, Smaragden, Rubinen und weiteren Edelsteinen.',
  keywords: 'Edelsteine, Diamanten, Smaragde, Rubine, Edelsteinhandel, Gemilike',
  authors: [{ name: 'Gemilike' }],
  openGraph: {
    title: 'Gemilike - Heroes in Gems',
    description: 'Ihr Spezialist für rohe und geschliffene Edelsteine',
    type: 'website',
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gemilike - Heroes in Gems',
    description: 'Ihr Spezialist für rohe und geschliffene Edelsteine',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function SEOHead() {
  return null; // Metadata wird automatisch von Next.js verarbeitet
}
