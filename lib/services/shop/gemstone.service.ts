import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ShopGemstone } from './types';

export const GEMSTONE_PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

export const gemstoneWithRelationsInclude = {
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
} satisfies Prisma.GemstoneInclude;

export type GemstoneWithRelations = Prisma.GemstoneGetPayload<{
  include: typeof gemstoneWithRelationsInclude;
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
  urls.length ? urls : [GEMSTONE_PLACEHOLDER_IMAGE];

const extractRarity = (metadata?: Prisma.JsonValue | null): string | null => {
  if (!metadata || typeof metadata !== 'object') return null;
  const maybeRecord = metadata as Record<string, unknown>;
  const value = maybeRecord?.rarity;
  return typeof value === 'string' && value.trim().length ? value : null;
};

export const toShopGemstone = (gem: GemstoneWithRelations): ShopGemstone => {
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
    cut: gem.cut ?? attributes?.cutGrade ?? null,
    cutForm: gem.cutForm ?? null,
    treatment: attributes?.treatment ?? null,
    description: gem.longDescription ?? gem.shortDescription ?? null,
    shortDescription: gem.shortDescription ?? null,
    certification: attributes?.certification ?? null,
    rarity: gem.rarity ?? extractRarity(attributes?.metadata),
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

export async function listPublishedGemstones(): Promise<ShopGemstone[]> {
  const gemstones = await prisma.gemstone.findMany({
    where: { status: 'PUBLISHED' },
    include: gemstoneWithRelationsInclude,
    orderBy: [
      { isNew: 'desc' },
      { publishedAt: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return gemstones.map(toShopGemstone);
}

export async function fetchGemstoneById(id: string): Promise<ShopGemstone | null> {
  const gemstone = await prisma.gemstone.findUnique({
    where: { id },
    include: gemstoneWithRelationsInclude,
  });

  if (!gemstone) {
    return null;
  }

  return toShopGemstone(gemstone);
}
