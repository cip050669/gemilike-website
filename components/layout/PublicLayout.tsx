import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen public-page-bg text-foreground">
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
