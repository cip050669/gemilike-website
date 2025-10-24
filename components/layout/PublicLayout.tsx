import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-800/50 text-foreground">
        <main className="pt-16">{children}</main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
}
