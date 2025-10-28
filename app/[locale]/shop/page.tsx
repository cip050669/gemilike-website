import { ShopShowcase } from '@/components/shop/ShopShowcase';
import { loadShopGemstones } from '@/lib/shop/shopData';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors border border-white/20 rounded-lg hover:bg-white/10"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-impact font-weight-impact text-white">
            Edelstein-Shop
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70">
            Entdecken Sie unsere kuratierte Auswahl an neuen Highlights und dauerhaft verfügbaren Edelsteinen.
            Wählen Sie eine Vorschau, um alle Details zum jeweiligen Stein anzuzeigen.
          </p>
        </section>

        <ShopShowcase gemstones={gemstones} fallback={fallback} />
      </div>
    </div>
  );
}
