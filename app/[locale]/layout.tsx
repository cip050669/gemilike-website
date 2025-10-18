import { Inter } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { SessionProvider } from '@/components/providers/SessionProvider';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gemilike - Heroes in Gems | Edelsteinhandel',
  description: 'Ihr Spezialist für rohe und geschliffene Edelsteine. Entdecken Sie unsere exquisite Auswahl an Diamanten, Smaragden, Rubinen und weiteren Edelsteinen.',
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-20">{children}</main>
            <Footer />
            <CookieBanner />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}