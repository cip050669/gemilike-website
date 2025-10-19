import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

