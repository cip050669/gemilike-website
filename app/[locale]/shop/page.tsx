import { ShopShowcase } from '@/components/shop/ShopShowcase';
import { loadShopGemstones } from '@/lib/shop/shopData';

export default async function ShopPage() {
  const { gemstones, fallback } = await loadShopGemstones();

  return (
    <div className="min-h-screen bg-gray-800/50 text-white py-16">
      <div className="max-w-6xl mx-auto space-y-12 px-4">
        <section className="main-container text-center space-y-3">
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
