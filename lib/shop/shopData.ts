import type { ShopGemstone } from '@/components/shop/GemstoneGrid';
import { prisma } from '@/lib/prisma';
import { allGemstones, getGemstoneById } from '@/lib/data/gemstones';

export const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

const parseJsonList = (value?: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
};

export const toShopGemstone = (gem: any): ShopGemstone => {
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

export async function loadShopGemstones(): Promise<{ gemstones: ShopGemstone[]; fallback: boolean }> {
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

export async function loadShopGemstoneById(
  id: string
): Promise<{ gemstone: ShopGemstone | null; fallback: boolean }> {
  try {
    const gem = await prisma.gemstone.findUnique({
      where: { id },
    });

    if (gem) {
      return {
        gemstone: toShopGemstone(gem),
        fallback: false,
      };
    }
  } catch (error) {
    console.error(`Shop: Fehler beim Laden des Edelsteins ${id}`, error);
  }

  const fallbackGem = getGemstoneById(id);
  if (fallbackGem) {
    return {
      gemstone: toShopGemstone({
        id: fallbackGem.id,
        name: fallbackGem.name,
        category: fallbackGem.category,
        type: fallbackGem.type,
        price: fallbackGem.price,
        weight:
          'caratWeight' in fallbackGem
            ? fallbackGem.caratWeight
            : 'gramWeight' in fallbackGem
            ? fallbackGem.gramWeight
            : null,
        origin: fallbackGem.origin,
        color: (fallbackGem as any).color ?? null,
        clarity: (fallbackGem as any).clarity ?? null,
        cut: (fallbackGem as any).cut ?? (fallbackGem as any).cutForm ?? null,
        treatment: fallbackGem.treatment?.type ?? null,
        description: fallbackGem.description,
        certification: fallbackGem.certification?.lab ?? null,
        rarity: (fallbackGem as any).rarity ?? null,
        inStock: fallbackGem.inStock ?? true,
        stock: fallbackGem.quantity ?? 0,
        isNew: fallbackGem.isNew ?? false,
        images: [fallbackGem.mainImage, ...(fallbackGem.images ?? [])].filter(Boolean),
        videos: (fallbackGem as any).videos ?? [],
      }),
      fallback: true,
    };
  }

  return { gemstone: null, fallback: false };
}
