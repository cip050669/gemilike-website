import { Inter } from 'next/font/google';
import '../globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HydrationHandler } from '@/components/HydrationHandler';

const inter = Inter({ subsets: ['latin'] });

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
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Sofortiges Setzen des Attributs vor React Hydration
              (function() {
                if (typeof document !== 'undefined') {
                  // Setze das Attribut sofort
                  document.documentElement.setAttribute('data-cbscriptallow', 'true');
                  
                  // Verhindere weitere Änderungen durch Extensions
                  Object.defineProperty(document.documentElement, 'setAttribute', {
                    value: function(name, value) {
                      if (name === 'data-cbscriptallow') {
                        return; // Ignoriere Änderungen an diesem Attribut
                      }
                      return HTMLElement.prototype.setAttribute.call(this, name, value);
                    },
                    writable: false,
                    configurable: false
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <HydrationHandler />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
