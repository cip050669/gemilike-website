import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { locales } from '@/lib/i18n/config';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gemilike - Heroes in Gems | Edelsteinhandel',
  description: 'Ihr Spezialist für rohe und geschliffene Edelsteine. Entdecken Sie unsere exquisite Auswahl an Diamanten, Smaragden, Rubinen und weiteren Edelsteinen.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SimpleLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gemilike - Heroes in Gems</title>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

