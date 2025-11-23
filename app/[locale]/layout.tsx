import '../globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { SkipToContent } from '@/components/accessibility/SkipToContent';
import { Inter } from 'next/font/google';
import clsx from 'clsx';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Gemilike - Heroes in Gems | Edelsteinhandel',
  description: 'Ihr Spezialist für rohe und geschliffene Edelsteine. Entdecken Sie unsere exquisite Auswahl an Diamanten, Smaragden, Rubinen und weiteren Edelsteinen.',
};

const locales = ['de', 'en'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Load messages for the locale
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preload wichtige Ressourcen */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
      </head>
      <body className={clsx('public-page-bg', 'font-inter')} suppressHydrationWarning>
        <SkipToContent />
        <ServiceWorkerRegistration />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <Header />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
