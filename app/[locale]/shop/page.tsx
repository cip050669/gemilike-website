import { ShopShowcase } from '@/components/shop/ShopShowcase';
import { loadShopGemstones } from '@/lib/shop/shopData';
import { PublicLayout } from '@/components/layout/PublicLayout';

// Always fetch fresh data so newly importierte Steine sofort sichtbar sind
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  const gemstones = await loadShopGemstones();

  return (
    <PublicLayout>
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <ShopShowcase gemstones={gemstones} />
        </div>
      </div>
    </PublicLayout>
  );
}
