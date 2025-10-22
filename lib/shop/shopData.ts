import type { Gemstone as PrismaGemstone } from '@prisma/client';
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

type GemstoneSource = Partial<PrismaGemstone> & {
  id: string | number;
  quantity?: number;
  images?: string[] | string | null;
  videos?: string[] | string | null;
  mainImage?: string | null;
  caratWeight?: number | null;
  gramWeight?: number | null;
  cutForm?: string | null;
  rarity?: string | null;
  treatment?: string | { type?: string | null } | null;
  certification?: string | { lab?: string | null } | null;
  color?: string | null;
  clarity?: string | null;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const toShopGemstone = (gem: GemstoneSource): ShopGemstone => {
  const images = Array.isArray(gem.images)
    ? gem.images.map((item) => String(item))
    : parseJsonList(typeof gem.images === 'string' ? gem.images : undefined);
  const videos = Array.isArray(gem.videos)
    ? gem.videos.map((item) => String(item))
    : parseJsonList(typeof gem.videos === 'string' ? gem.videos : undefined);
  const type = (gem.type as ShopGemstone['type']) ?? 'cut';
  const weight = toNumber(gem.weight ?? (type === 'cut' ? gem.caratWeight : gem.gramWeight));
  const weightUnit: 'ct' | 'g' = type === 'rough' ? 'g' : 'ct';

  const treatmentValue = gem.treatment;
  const treatment = typeof treatmentValue === 'string'
    ? treatmentValue
    : treatmentValue && typeof treatmentValue === 'object'
      ? (treatmentValue.type as string | undefined) ?? null
      : null;

  const certificationValue = gem.certification;
  const certification = typeof certificationValue === 'string'
    ? certificationValue
    : certificationValue && typeof certificationValue === 'object'
      ? (certificationValue.lab as string | undefined) ?? null
      : null;

  return {
    id: String(gem.id),
    name: gem.name ?? 'Unbenannter Edelstein',
    category: gem.category ?? 'Edelstein',
    type,
    price: toNumber(gem.price) ?? 0,
    weight,
    weightUnit,
    origin: gem.origin ?? null,
    color: gem.color ?? null,
    clarity: gem.clarity ?? null,
    cut: gem.cut ?? gem.cutForm ?? null,
    treatment,
    description: gem.description ?? null,
    certification,
    rarity: gem.rarity ?? null,
    inStock: gem.inStock ?? true,
    stock: toNumber(gem.stock ?? gem.quantity) ?? 0,
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
          color: (gem as Record<string, unknown>).color ?? null,
          clarity: (gem as Record<string, unknown>).clarity ?? null,
          cut: (gem as Record<string, unknown>).cut ?? (gem as Record<string, unknown>).cutForm ?? null,
          treatment: gem.treatment?.type ?? null,
          description: gem.description,
          certification: gem.certification?.lab ?? null,
          rarity: (gem as Record<string, unknown>).rarity ?? null,
          inStock: gem.inStock ?? true,
          stock: gem.quantity ?? 0,
          isNew: gem.isNew ?? false,
          images: [gem.mainImage, ...(gem.images ?? [])].filter(Boolean),
          videos: (gem as Record<string, unknown>).videos ?? [],
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
        color: (fallbackGem as Record<string, unknown>).color ?? null,
        clarity: (fallbackGem as Record<string, unknown>).clarity ?? null,
        cut:
          (fallbackGem as Record<string, unknown>).cut ??
          (fallbackGem as Record<string, unknown>).cutForm ??
          null,
        treatment: fallbackGem.treatment?.type ?? null,
        description: fallbackGem.description,
        certification: fallbackGem.certification?.lab ?? null,
        rarity: (fallbackGem as Record<string, unknown>).rarity ?? null,
        inStock: fallbackGem.inStock ?? true,
        stock: fallbackGem.quantity ?? 0,
        isNew: fallbackGem.isNew ?? false,
        images: [fallbackGem.mainImage, ...(fallbackGem.images ?? [])].filter(Boolean),
        videos: (fallbackGem as Record<string, unknown>).videos ?? [],
      }),
      fallback: true,
    };
  }

  return { gemstone: null, fallback: false };
}
