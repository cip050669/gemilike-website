import { GemstoneGrid, ShopGemstone } from '@/components/shop/GemstoneGrid';
import { prisma } from '@/lib/prisma';
import { allGemstones } from '@/lib/data/gemstones';
import { Badge } from '@/components/ui/badge';

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
    <div className="min-h-screen bg-surface text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 space-y-4 text-center">
          <Badge variant="outline" className="mx-auto bg-primary-soft text-primary">
            Exklusive Auswahl
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Edelstein-Shop</h1>
          <p className="mx-auto max-w-2xl text-base text-white/70">
            Entdecken Sie handverlesene Edelsteine aus aller Welt – geschliffen oder roh, zertifiziert
            und sofort verfügbar. Jedes Stück ist einzigartig und bereit für Ihre Kollektion.
          </p>
        </header>

        <section className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary/20 bg-primary-soft p-6">
            <p className="text-xs uppercase tracking-wide text-white/55">Sortiment</p>
            <p className="text-3xl font-semibold text-white">{gemstones.length}</p>
            <p className="text-sm text-white/60">verfügbare Edelsteine</p>
          </div>
          <div className="rounded-2xl border border-secondary/20 bg-secondary-soft p-6">
            <p className="text-xs uppercase tracking-wide text-white/55">Neuzugänge</p>
            <p className="text-3xl font-semibold text-white">
              {gemstones.filter((gem) => gem.isNew).length}
            </p>
            <p className="text-sm text-white/60">werden hervorgehoben</p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent-soft p-6">
            <p className="text-xs uppercase tracking-wide text-white/55">Gesamt-Bestand</p>
            <p className="text-3xl font-semibold text-white">
              {gemstones.reduce((sum, gem) => sum + (Number.isFinite(gem.stock) ? gem.stock : 0), 0)}
            </p>
            <p className="text-sm text-white/60">Steine auf Lager</p>
          </div>
        </section>

        <GemstoneGrid gemstones={gemstones} fallback={fallback} />
      </div>
    </div>
  );
}
