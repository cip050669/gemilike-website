import type { Prisma } from '@prisma/client';
import type { ShopGemstone } from '@/components/shop/GemstoneGrid';
import { prisma } from '@/lib/prisma';
import { allGemstones, getGemstoneById } from '@/lib/data/gemstones';
import { isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';
import type { Gemstone } from '@/lib/types/gemstone';

export const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

type GemstoneWithRelations = Prisma.GemstoneGetPayload<{
  include: {
    inventory: true;
    attributes: true;
    media: true;
    priceBooks: true;
  };
}>;

const decimalToNumber = (value?: Prisma.Decimal | number | string | null): number | null => {
  if (value == null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return Number(value);
};

const ensureImages = (urls: string[]): string[] =>
  urls.length ? urls : [PLACEHOLDER_IMAGE];

const extractRarity = (metadata?: Prisma.JsonValue | null): string | null => {
  if (!metadata || typeof metadata !== 'object') return null;
  const maybeRecord = metadata as Record<string, unknown>;
  const value = maybeRecord?.rarity;
  return typeof value === 'string' && value.trim().length ? value : null;
};

const toShopGemstoneFromPrisma = (gem: GemstoneWithRelations): ShopGemstone => {
  const priceBook = gem.priceBooks[0];
  const inventory = gem.inventory;
  const attributes = gem.attributes;

  const condition = inventory?.condition ?? gem.condition;
  const weight =
    condition === 'ROUGH'
      ? decimalToNumber(inventory?.gramWeight)
      : decimalToNumber(inventory?.caratWeight) ?? decimalToNumber(inventory?.gramWeight);
  const weightUnit: 'ct' | 'g' = condition === 'ROUGH' ? 'g' : 'ct';
  const stock = inventory?.quantity ?? 0;
  const color = attributes?.color ?? null;

  const imageMedia = gem.media.filter((media) => media.type === 'IMAGE');
  const videoMedia = gem.media.filter((media) => media.type === 'VIDEO');

  return {
    id: gem.id,
    slug: gem.slug ?? undefined,
    name: gem.name,
    category: gem.category,
    type: condition === 'ROUGH' ? 'rough' : 'cut',
    price: decimalToNumber(priceBook?.priceGross) ?? 0,
    currency: priceBook?.currency ?? 'EUR',
    weight,
    weightUnit,
    origin: gem.origin ?? null,
    color: color ?? null,
    colorSaturation: attributes?.colorSaturation ?? null,
    clarity: attributes?.clarity ?? null,
    cut: attributes?.cutGrade ?? null,
    treatment: attributes?.treatment ?? null,
    description: gem.longDescription ?? gem.shortDescription ?? null,
    shortDescription: gem.shortDescription ?? null,
    certification: attributes?.certification ?? null,
    rarity: extractRarity(attributes?.metadata),
    dimensions: {
      length: decimalToNumber(attributes?.lengthMm),
      width: decimalToNumber(attributes?.widthMm),
      height: decimalToNumber(attributes?.heightMm),
    },
    inStock: !gem.isSold && stock > 0,
    isSold: gem.isSold ?? false,
    stock,
    isNew: gem.isNew ?? false,
    images: ensureImages(imageMedia.map((media) => media.url).filter(Boolean)),
    videos: videoMedia.map((media) => media.url).filter(Boolean),
  };
};

const toShopGemstoneFromLibrary = (gem: Gemstone): ShopGemstone => {
  const isCut = isCutGemstone(gem);
  const isRough = isRoughGemstone(gem);
  const images = [gem.mainImage, ...(gem.images ?? [])].filter(
    (item): item is string => Boolean(item)
  );
  const videos = (gem.videos ?? []).filter((item): item is string => Boolean(item));
  const dimensions = gem.dimensions
    ? {
        length: gem.dimensions.length ?? null,
        width: gem.dimensions.width ?? null,
        height: gem.dimensions.height ?? null,
      }
    : undefined;

  return {
    id: gem.id,
    name: gem.name,
    category: gem.category ?? 'Edelstein',
    type: isRough ? 'rough' : 'cut',
    price: gem.price,
    currency: 'EUR',
    weight: isCut ? gem.caratWeight ?? null : gem.gramWeight ?? null,
    weightUnit: isRough ? 'g' : 'ct',
    origin: gem.origin ?? null,
    color: (gem as Gemstone & { color?: string }).color ?? null,
    colorSaturation: isCut ? gem.colorIntensity ?? null : null,
    clarity: isCut ? gem.clarity ?? null : null,
    cut: isCut ? gem.cut ?? gem.cutForm ?? null : null,
    treatment: gem.treatment?.type ?? null,
    description: gem.description ?? null,
    shortDescription: gem.description ?? null,
    certification: gem.certification?.lab ?? null,
    rarity: gem.rarity ?? null,
    dimensions,
    inStock: Boolean(gem.inStock),
    isSold: !gem.inStock,
    stock: gem.quantity ?? 0,
    isNew: gem.isNew ?? false,
    images: ensureImages(images),
    videos,
  };
};

export async function loadShopGemstones(): Promise<{ gemstones: ShopGemstone[]; fallback: boolean }> {
  try {
    const gemstones = await prisma.gemstone.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        inventory: true,
        attributes: true,
        media: {
          orderBy: [
            { isPrimary: 'desc' },
            { position: 'asc' },
            { createdAt: 'asc' },
          ],
        },
        priceBooks: {
          orderBy: [
            { validFrom: 'desc' },
            { createdAt: 'desc' },
          ],
          take: 1,
        },
      },
      orderBy: [
        { isNew: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    if (!gemstones.length) {
      throw new Error('Keine Edelsteine in der Datenbank gefunden.');
    }

    return {
      gemstones: gemstones.map(toShopGemstoneFromPrisma),
      fallback: false,
    };
  } catch (error) {
    console.error('Shop: Fallback auf statische Edelsteine', error);
    return {
      gemstones: allGemstones.map(toShopGemstoneFromLibrary),
      fallback: true,
    };
  }
}

export async function loadShopGemstoneById(
  id: string
): Promise<{ gemstone: ShopGemstone | null; fallback: boolean }> {
  try {
    const gemstone = await prisma.gemstone.findUnique({
      where: { id },
      include: {
        inventory: true,
        attributes: true,
        media: {
          orderBy: [
            { isPrimary: 'desc' },
            { position: 'asc' },
            { createdAt: 'asc' },
          ],
        },
        priceBooks: {
          orderBy: [
            { validFrom: 'desc' },
            { createdAt: 'desc' },
          ],
          take: 1,
        },
      },
    });

    if (gemstone) {
      return {
        gemstone: toShopGemstoneFromPrisma(gemstone),
        fallback: false,
      };
    }
  } catch (error) {
    console.error(`Shop: Fehler beim Laden des Edelsteins ${id}`, error);
  }

  const fallbackGem = getGemstoneById(id);
  if (fallbackGem) {
    return {
      gemstone: toShopGemstoneFromLibrary(fallbackGem),
      fallback: true,
    };
  }

  return { gemstone: null, fallback: false };
}
