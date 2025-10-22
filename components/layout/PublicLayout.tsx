import { Header } from './Header';
import { CookieBanner } from './CookieBanner';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground">
        <main className="pt-16">{children}</main>
        <CookieBanner />
      </div>
    </>
  );
}
