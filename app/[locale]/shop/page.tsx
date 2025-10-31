import { ShopShowcase } from '@/components/shop/ShopShowcase';
import { loadShopGemstones } from '@/lib/shop/shopData';
export default async function ShopPage() {
  const gemstones = await loadShopGemstones();

  return (
    <div className="min-h-screen public-page-bg text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <ShopShowcase gemstones={gemstones} />
      </div>
    </div>
  );
}
