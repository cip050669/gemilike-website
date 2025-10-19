import { ReactNode } from 'react';
import SessionProvider from '../../components/providers/SessionProvider';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CookieBanner from '../../components/layout/CookieBanner';
import Cart from '../../components/cart/Cart';
import ClientProvider from '../../components/providers/ClientProvider';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

const locales = ['de', 'en'] as const;

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <>
      <SessionProvider>
        <ClientProvider>
          <Header />
          <main className="pt-32">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <Cart />
        </ClientProvider>
      </SessionProvider>
    </>
  );
}
