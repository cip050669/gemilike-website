import type { Prisma } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import {
  getPrismaConnectionErrorSummary,
  isPrismaConnectionError,
  prisma,
  withRetry,
} from '@/lib/prisma';
import { semanticVectorSearch, type SemanticDocument, type VectorSearchResult } from '@/lib/search/vector-search';
import { parseVectorQuery, evaluateVectorQuery } from '@/lib/search/query-parser';
import { stripMarkdown } from '@/lib/utils/markdown';
import { cosineSimilarity as cosineSimilarityEmbedding, embedText, parseEmbedding } from '@/lib/ai/embeddings';
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

const PUBLIC_ROOT = path.join(process.cwd(), 'public');

const normalizeMediaUrl = (value: string | null | undefined): string[] => {
  if (!value) return [];

  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => entry.startsWith('/'))
    .filter((entry) => !entry.startsWith('//'))
    .filter((entry) => !entry.startsWith('/home/'))
    .filter((entry) => !entry.startsWith('/Users/'))
    .filter((entry) => fs.existsSync(path.join(PUBLIC_ROOT, entry.slice(1))));
};

const extractRarity = (metadata?: Prisma.JsonValue | null): string | null => {
  if (!metadata || typeof metadata !== 'object') return null;
  const maybeRecord = metadata as Record<string, unknown>;
  const value = maybeRecord?.rarity;
  return typeof value === 'string' && value.trim().length ? value : null;
};

async function withGemstoneReadFallback<T>(
  operation: () => Promise<T>,
  fallback: T,
  context: string
): Promise<T> {
  try {
    return await withRetry(operation);
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn(
        `${context}: ${getPrismaConnectionErrorSummary(error)}`
      );
      return fallback;
    }

    throw error;
  }
}

export const toShopGemstone = (gem: GemstoneWithRelations): ShopGemstone => {
  // Prisma 7: Typ-Assertion für priceBooks Array
  const priceBooks = Array.isArray(gem.priceBooks) ? gem.priceBooks : [];
  const priceBook = priceBooks[0];
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
  const imageUrls = imageMedia.flatMap((media) => normalizeMediaUrl(media.url));
  const videoUrls = videoMedia.flatMap((media) => normalizeMediaUrl(media.url));

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
    images: ensureImages(imageUrls),
    videos: videoUrls,
  };
};

export async function listPublishedGemstones(): Promise<ShopGemstone[]> {
  const gemstones = await withGemstoneReadFallback(
    () =>
      prisma.gemstone.findMany({
        where: { status: 'PUBLISHED' },
        include: gemstoneWithRelationsInclude,
        orderBy: [
          { isNew: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
    [],
    'Published gemstone list unavailable'
  );

  return gemstones.map(toShopGemstone);
}

export async function listAllGemstones(): Promise<ShopGemstone[]> {
  const gemstones = await withGemstoneReadFallback(
    () =>
      prisma.gemstone.findMany({
        include: gemstoneWithRelationsInclude,
        orderBy: [
          { isNew: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
    [],
    'Gemstone list unavailable'
  );

  return gemstones.map(toShopGemstone);
}

export async function fetchGemstoneById(id: string): Promise<ShopGemstone | null> {
  const gemstone = await withGemstoneReadFallback(
    () =>
      prisma.gemstone.findUnique({
        where: { id },
        include: gemstoneWithRelationsInclude,
      }),
    null,
    `Gemstone ${id} unavailable`
  );

  if (!gemstone) {
    return null;
  }

  return toShopGemstone(gemstone);
}

export async function fetchGemstonesByIds(ids: string[]): Promise<ShopGemstone[]> {
  if (ids.length === 0) {
    return [];
  }

  const gemstones = await withGemstoneReadFallback(
    () =>
      prisma.gemstone.findMany({
        where: { id: { in: ids } },
        include: gemstoneWithRelationsInclude,
      }),
    [],
    'Gemstone selection unavailable'
  );

  return gemstones.map(toShopGemstone);
}

export interface GemstoneVectorSearchResult {
  id: string;
  slug?: string;
  name: string;
  category: string;
  similarity: number;
}

export interface SimilarGemstoneResult extends ShopGemstone {
  similarity: number;
}

type GemstoneVectorDocument = SemanticDocument<ShopGemstone> & {
  embedding: number[] | null;
};

interface GemstoneVectorCacheEntry {
  documents: GemstoneVectorDocument[];
  expiresAt: number;
}

const GEMSTONE_VECTOR_CACHE_TTL_MS = 1000 * 60 * 10;
const gemstoneVectorCache = new Map<string, GemstoneVectorCacheEntry>();

export const buildGemstoneSearchText = (gem: ShopGemstone): string =>
  [
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

const createGemstoneVectorDocument = (
  gem: ShopGemstone,
  searchEmbedding?: Prisma.JsonValue | null
): GemstoneVectorDocument => {
  const text = buildGemstoneSearchText(gem);

  return {
    id: gem.id,
    text,
    payload: gem,
    boost: gem.isNew ? 1.1 : 1,
    embedding: parseEmbedding(searchEmbedding),
  };
};

async function buildGemstoneVectorDocuments() {
  const gemstones = await withGemstoneReadFallback(
    () =>
      prisma.gemstone.findMany({
        include: gemstoneWithRelationsInclude,
        orderBy: [
          { isNew: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
    [],
    'Gemstone search index unavailable'
  );

  return gemstones.map((gemstone) =>
    createGemstoneVectorDocument(toShopGemstone(gemstone), gemstone.searchEmbedding)
  );
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
  const embeddingQuery = runSemanticSearch ? embedText(vectorText).vector : null;

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

  const keywordScoreMap = new Map(rawResults.map((result) => [result.id, result.score]));
  const embeddingResults = runSemanticSearch
    ? documents
        .map((doc) => ({
          id: doc.id,
          payload: doc.payload,
          score: cosineSimilarityEmbedding(embeddingQuery, doc.embedding),
        }))
        .filter((result) => result.score >= 0.12)
    : [];

  const mergedResults = new Map<string, VectorSearchResult<ShopGemstone>>();
  for (const result of rawResults) {
    mergedResults.set(result.id, result);
  }

  for (const result of embeddingResults) {
    const existing = mergedResults.get(result.id);
    const keywordScore = keywordScoreMap.get(result.id) ?? 0;
    const mergedScore = Math.max(result.score, keywordScore * 0.92);
    mergedResults.set(result.id, {
      id: result.id,
      payload: result.payload,
      score: existing ? Math.max(existing.score, mergedScore) : mergedScore,
    });
  }

  const filtered = Array.from(mergedResults.values()).filter((result) => {
    if (!parsedQuery.groups.length) return true;
    const docText = textMap.get(result.id) ?? '';
    return evaluateVectorQuery(parsedQuery, docText, result.payload, resolveFieldValue);
  });

  return filtered
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ payload, score }) => ({
      id: payload.id,
      slug: payload.slug,
      name: payload.name,
      category: payload.category,
      similarity: Number(score.toFixed(4)),
    }));
}

export async function findSimilarGemstones(
  gemstoneId: string,
  limit = 4
): Promise<SimilarGemstoneResult[]> {
  const [target, gemstones] = await withGemstoneReadFallback(
    () =>
      Promise.all([
        prisma.gemstone.findUnique({
          where: { id: gemstoneId },
          include: gemstoneWithRelationsInclude,
        }),
        prisma.gemstone.findMany({
          where: {
            status: 'PUBLISHED',
            id: { not: gemstoneId },
          },
          include: gemstoneWithRelationsInclude,
          orderBy: [
            { isNew: 'desc' },
            { publishedAt: 'desc' },
            { createdAt: 'desc' },
          ],
        }),
      ]),
    [null, []] as const,
    `Similar gemstones unavailable for ${gemstoneId}`
  );

  if (!target) {
    return [];
  }

  const targetShopGemstone = toShopGemstone(target);
  const targetEmbedding =
    parseEmbedding(target.searchEmbedding) ?? embedText(buildGemstoneSearchText(targetShopGemstone)).vector;

  return gemstones
    .map((gemstone) => {
      const shopGemstone = toShopGemstone(gemstone);
      const embedding =
        parseEmbedding(gemstone.searchEmbedding) ??
        embedText(buildGemstoneSearchText(shopGemstone)).vector;

      let similarity = cosineSimilarityEmbedding(targetEmbedding, embedding);

      if (shopGemstone.category === targetShopGemstone.category) similarity += 0.08;
      if (shopGemstone.type === targetShopGemstone.type) similarity += 0.03;
      if (shopGemstone.color && shopGemstone.color === targetShopGemstone.color) similarity += 0.05;
      if (shopGemstone.origin && shopGemstone.origin === targetShopGemstone.origin) similarity += 0.03;

      return {
        ...shopGemstone,
        similarity: Number(similarity.toFixed(4)),
      };
    })
    .filter((gemstone) => gemstone.similarity > 0.1)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
