import type { ShopGemstone } from '@/components/shop/GemstoneGrid';
import { ShopShowcase } from '@/components/shop/ShopShowcase';
import { prisma } from '@/lib/prisma';
import { allGemstones } from '@/lib/data/gemstones';

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

const parseJsonList = (value?: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
};

const toShopGemstone = (gem: any): ShopGemstone => {
  const images = Array.isArray(gem.images) ? gem.images : parseJsonList(gem.images);
  const videos = Array.isArray(gem.videos) ? gem.videos : parseJsonList(gem.videos);
  const type = gem.type ?? 'cut';
  const weight = typeof gem.weight === 'number' ? gem.weight : gem.weight ? Number(gem.weight) : null;
  const weightUnit: 'ct' | 'g' = type === 'rough' ? 'g' : 'ct';

  return {
    id: String(gem.id),
    name: gem.name ?? 'Unbenannter Edelstein',
    category: gem.category ?? 'Edelstein',
    type,
    price: typeof gem.price === 'number' ? gem.price : Number(gem.price ?? 0),
    weight,
    weightUnit,
    origin: gem.origin ?? null,
    color: gem.color ?? null,
    clarity: gem.clarity ?? null,
    cut: gem.cut ?? gem.cutForm ?? null,
    treatment: gem.treatment ?? null,
    description: gem.description ?? null,
    certification: gem.certification ?? null,
    rarity: gem.rarity ?? null,
    inStock: gem.inStock ?? true,
    stock: typeof gem.stock === 'number' ? gem.stock : Number(gem.stock ?? gem.quantity ?? 0),
    isNew: gem.isNew ?? false,
    images: images.length ? images.slice(0, 10) : [gem.mainImage || PLACEHOLDER_IMAGE].filter(Boolean),
    videos: videos.slice(0, 2),
  };
};

async function loadGemstones(): Promise<{ gemstones: ShopGemstone[]; fallback: boolean }> {
  try {
    const data = await prisma.gemstone.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!data.length) {
      throw new Error('Keine Edelsteine gefunden');
    }

    return {
      gemstones: data.map(toShopGemstone),
      fallback: false,
    };
  } catch (error) {
    console.error('Shop: Fallback auf statische Edelsteine', error);
    return {
      gemstones: allGemstones.map((gem) =>
        toShopGemstone({
          id: gem.id,
          name: gem.name,
          category: gem.category,
          type: gem.type,
          price: gem.price,
          weight: 'caratWeight' in gem ? gem.caratWeight : 'gramWeight' in gem ? gem.gramWeight : null,
          origin: gem.origin,
          color: (gem as any).color ?? null,
          clarity: (gem as any).clarity ?? null,
          cut: (gem as any).cut ?? (gem as any).cutForm ?? null,
          treatment: gem.treatment?.type ?? null,
          description: gem.description,
          certification: gem.certification?.lab ?? null,
          rarity: (gem as any).rarity ?? null,
          inStock: gem.inStock ?? true,
          stock: gem.quantity ?? 0,
          isNew: gem.isNew ?? false,
          images: [gem.mainImage, ...(gem.images ?? [])].filter(Boolean),
          videos: (gem as any).videos ?? [],
        })
      ),
      fallback: true,
    };
  }
}

export default async function ShopPage() {
  const { gemstones, fallback } = await loadGemstones();

  return (
    <div className="min-h-screen bg-surface text-white py-16">
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
