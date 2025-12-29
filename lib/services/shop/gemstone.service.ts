import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { semanticVectorSearch, type SemanticDocument, type VectorSearchResult } from '@/lib/search/vector-search';
import { parseVectorQuery, evaluateVectorQuery } from '@/lib/search/query-parser';
import { stripMarkdown } from '@/lib/utils/markdown';
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

  // Ensure currency is a valid string
  let currency = 'EUR';
  if (priceBook?.currency) {
    if (typeof priceBook.currency === 'string' && priceBook.currency.length === 3) {
      currency = priceBook.currency.toUpperCase();
    } else if (typeof priceBook.currency === 'boolean') {
      // Handle boolean values (fallback to EUR)
      currency = 'EUR';
    }
  }

  return {
    id: gem.id,
    slug: gem.slug ?? undefined,
    name: gem.name,
    category: gem.category,
    type: condition === 'ROUGH' ? 'rough' : 'cut',
    price: decimalToNumber(priceBook?.priceGross) ?? 0,
    currency,
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

export interface GemstoneVectorSearchResult {
  id: string;
  slug?: string;
  name: string;
  category: string;
  similarity: number;
}

type GemstoneVectorDocument = SemanticDocument<ShopGemstone>;

interface GemstoneVectorCacheEntry {
  documents: GemstoneVectorDocument[];
  expiresAt: number;
}

const GEMSTONE_VECTOR_CACHE_TTL_MS = 1000 * 60 * 10;
const gemstoneVectorCache = new Map<string, GemstoneVectorCacheEntry>();

const createGemstoneVectorDocument = (gem: ShopGemstone): GemstoneVectorDocument => {
  const text = [
    gem.name,
    gem.category,
    gem.origin ?? '',
    gem.color ?? '',
    gem.clarity ?? '',
    gem.treatment ?? '',
    gem.certification ?? '',
    gem.rarity ?? '',
    stripMarkdown(`${gem.shortDescription ?? ''}\n${gem.description ?? ''}`),
  ]
    .map((segment) => segment?.trim() ?? '')
    .filter(Boolean)
    .join('\n');

  return {
    id: gem.id,
    text,
    payload: gem,
    boost: gem.isNew ? 1.1 : 1,
  };
};

async function buildGemstoneVectorDocuments() {
  const gemstones = await listPublishedGemstones();
  return gemstones.map(createGemstoneVectorDocument);
}

async function getGemstoneVectorDocuments(locale: string) {
  const cached = gemstoneVectorCache.get(locale);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.documents;
  }

  const documents = await buildGemstoneVectorDocuments();
  gemstoneVectorCache.set(locale, {
    documents,
    expiresAt: Date.now() + GEMSTONE_VECTOR_CACHE_TTL_MS,
  });
  return documents;
}

export function invalidateGemstoneVectorCache(locale?: string) {
  if (locale) {
    gemstoneVectorCache.delete(locale);
  } else {
    gemstoneVectorCache.clear();
  }
}

export async function searchGemstonesVector(
  query: string,
  locale: string = 'de',
  limit = 12
): Promise<GemstoneVectorSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const parsedQuery = parseVectorQuery(trimmed);
  const vectorText = parsedQuery.vectorText.trim();

  const documents = await getGemstoneVectorDocuments(locale);
  const textMap = new Map(documents.map((doc) => [doc.id, doc.text.toLowerCase()]));

  const resolveFieldValue = (field: string, gem: ShopGemstone) => {
    switch (field) {
      case 'price':
      case 'preis':
        return typeof gem.price === 'number' ? gem.price : null;
      case 'weight':
      case 'gewicht':
      case 'carat':
      case 'ct':
      case 'gramm':
      case 'gram':
        return typeof gem.weight === 'number' ? gem.weight : null;
      case 'stock':
      case 'quantity':
      case 'bestand':
        return typeof gem.stock === 'number' ? gem.stock : null;
      case 'rarity':
      case 'seltenheit':
        if (!gem.rarity) return null;
        switch (gem.rarity.toLowerCase()) {
          case 'common':
          case 'häufig':
            return 1;
          case 'rare':
          case 'selten':
            return 2;
          case 'very rare':
          case 'sehr selten':
            return 3;
          case 'unique':
          case 'unikat':
            return 4;
          default:
            return null;
        }
      case 'issold':
      case 'sold':
        return gem.isSold ? 1 : 0;
      default:
        return null;
    }
  };

  const runSemanticSearch = vectorText.length > 0;

  const rawResults: VectorSearchResult<ShopGemstone>[] = runSemanticSearch
    ? semanticVectorSearch(vectorText, documents, {
        topK: Math.max(limit * 2, 20),
        minScore: 0.05,
      })
    : documents.map((doc): VectorSearchResult<ShopGemstone> => ({
        id: doc.id,
        payload: doc.payload,
        score: 1,
      }));

  const filtered = rawResults.filter((result) => {
    if (!parsedQuery.groups.length) return true;
    const docText = textMap.get(result.id) ?? '';
    return evaluateVectorQuery(parsedQuery, docText, result.payload, resolveFieldValue);
  });

  return filtered.slice(0, limit).map(({ payload, score }) => ({
    id: payload.id,
    slug: payload.slug,
    name: payload.name,
    category: payload.category,
    similarity: Number(score.toFixed(4)),
  }));
}
