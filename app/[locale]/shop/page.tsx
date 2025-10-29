import { ShopShowcase } from '@/components/shop/ShopShowcase';
import { loadShopGemstones } from '@/lib/shop/shopData';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import navStyles from '@/components/layout/HeaderNav.module.css';

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { gemstones, fallback } = await loadShopGemstones();

  return (
    <div className="min-h-screen public-page-bg text-white py-16">
      <div className="max-w-6xl mx-auto space-y-12 px-4">
        <section className="main-container text-center space-y-3">
          <div className="flex justify-center mb-4">
            <Link
              href={`/${locale}`}
              className={cn(navStyles.navButton, navStyles.navButtonTight, 'group gap-2')}
            >
              <ArrowLeftIcon className="relative z-[1] h-4 w-4 text-black transition-colors duration-200 group-active:text-[#FF7B7B]" />
              <span className={navStyles.navLabel}>Zurück zur Startseite</span>
              <span className={navStyles.navGlow} />
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-impact font-weight-impact text-white">
            Edelstein-Shop
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70">
                   </p>
        </section>

        <ShopShowcase gemstones={gemstones} fallback={fallback} />
      </div>
    </div>
  );
}
