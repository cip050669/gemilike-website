import '../globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import clsx from 'clsx';

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
    <html lang={locale} suppressHydrationWarning>
      <head>
      </head>
      <body className={clsx('public-page-bg', 'font-sans')} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <Header />
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
