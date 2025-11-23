import type { KnowledgeBase } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { semanticVectorSearch, type SemanticDocument, type VectorSearchResult } from '@/lib/search/vector-search';
import { parseVectorQuery, evaluateVectorQuery } from '@/lib/search/query-parser';
import { stripMarkdown } from '@/lib/utils/markdown';

export interface KnowledgeBaseInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  category: string;
  tags?: string[];
  image?: string | null;
  contentImages?: string[];
  published?: boolean;
  featured?: boolean;
  locale?: string;
  metaDescription?: string | null;
  readingTime?: number | null;
  difficulty?: string | null;
  publishedAt?: Date | null;
}

export interface KnowledgeVectorSearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  similarity: number;
  tags: string[];
  publishedAt: Date | null;
}

export async function getKnowledgeArticles(locale: string = 'de', publishedOnly: boolean = false) {
  const where: { locale: string; published?: boolean } = { locale };
  if (publishedOnly) {
    where.published = true;
  }

  return prisma.knowledgeBase.findMany({
    where,
    orderBy: [
      { featured: 'desc' },
      { publishedAt: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

export async function getKnowledgeArticleBySlug(slug: string, locale: string = 'de') {
  return prisma.knowledgeBase.findFirst({
    where: {
      slug,
      locale,
      published: true,
    },
  });
}

export async function getKnowledgeArticleById(id: string) {
  return prisma.knowledgeBase.findUnique({
    where: { id },
  });
}

export async function createKnowledgeArticle(data: KnowledgeBaseInput) {
  const article = await prisma.knowledgeBase.create({
    data: {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author || 'Gemilike Redaktion',
      category: data.category,
      tags: data.tags || [],
      image: data.image || null,
      contentImages: data.contentImages || [],
      published: data.published || false,
      featured: data.featured || false,
      locale: data.locale || 'de',
      metaDescription: data.metaDescription || null,
      readingTime: data.readingTime || null,
      difficulty: data.difficulty || null,
      publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt || null,
    },
  });
  invalidateKnowledgeVectorCache(data.locale || 'de');
  return article;
}

export async function updateKnowledgeArticle(id: string, data: Partial<KnowledgeBaseInput>) {
  const updateData: Partial<KnowledgeBaseInput> & { publishedAt?: Date } = { ...data };
  
  if (data.published && !data.publishedAt) {
    const existing = await prisma.knowledgeBase.findUnique({ where: { id } });
    if (existing && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  const updated = await prisma.knowledgeBase.update({
    where: { id },
    data: updateData,
  });
  invalidateKnowledgeVectorCache(updated.locale);
  return updated;
}

export async function deleteKnowledgeArticle(id: string) {
  const deleted = await prisma.knowledgeBase.delete({
    where: { id },
  });
  invalidateKnowledgeVectorCache(deleted.locale);
  return deleted;
}

const MAX_EXCERPT_LENGTH = 260;

function buildExcerpt(content: string, fallback?: string | null) {
  const base = (fallback && fallback.trim()) || stripMarkdown(content);
  if (base.length <= MAX_EXCERPT_LENGTH) return base;
  return `${base.slice(0, MAX_EXCERPT_LENGTH).trimEnd()} …`;
}

const VECTOR_CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes
const CACHE_LOGGING_ENABLED = process.env.KNOWLEDGE_VECTOR_CACHE_LOGS === 'true';

type KnowledgeVectorDocument = SemanticDocument<KnowledgeBase>;

interface CachedVectorDocs {
  documents: KnowledgeVectorDocument[];
  expiresAt: number;
}

const knowledgeVectorCache = new Map<string, CachedVectorDocs>();
const knowledgeVectorCacheMetrics = {
  hits: 0,
  misses: 0,
  rebuilds: 0,
  invalidations: 0,
};

const logCacheEvent = (message: string, payload?: Record<string, unknown>) => {
  if (!CACHE_LOGGING_ENABLED) return;
  const data = payload ? ` ${JSON.stringify(payload)}` : '';
  console.info(`[KnowledgeVectorCache] ${message}${data}`);
};

function cacheEntryValid(entry: CachedVectorDocs | undefined) {
  return !!entry && entry.expiresAt > Date.now();
}

function createDocumentFromArticle(article: KnowledgeBase): KnowledgeVectorDocument {
  return {
    id: article.id,
    text: [
      article.title,
      article.excerpt ?? '',
      stripMarkdown(article.content),
      article.category,
      (article.tags ?? []).join(' '),
    ].join('\n'),
    payload: article,
    boost: article.featured ? 1.15 : 1,
  };
}

async function buildKnowledgeVectorDocuments(locale: string) {
  const articles = await prisma.knowledgeBase.findMany({
    where: { locale, published: true },
  });
  return articles.map(createDocumentFromArticle);
}

async function getKnowledgeVectorDocuments(locale: string) {
  const cached = knowledgeVectorCache.get(locale);
  if (cacheEntryValid(cached)) {
    knowledgeVectorCacheMetrics.hits += 1;
    logCacheEvent('cache-hit', { locale, size: cached!.documents.length });
    return cached!.documents;
  }

  knowledgeVectorCacheMetrics.misses += 1;
  logCacheEvent('cache-miss', { locale });
  const documents = await buildKnowledgeVectorDocuments(locale);
  knowledgeVectorCache.set(locale, {
    documents,
    expiresAt: Date.now() + VECTOR_CACHE_TTL_MS,
  });
  knowledgeVectorCacheMetrics.rebuilds += 1;
  logCacheEvent('cache-rebuild', { locale, size: documents.length });

  return documents;
}

export function invalidateKnowledgeVectorCache(locale?: string) {
  if (locale) {
    knowledgeVectorCache.delete(locale);
    logCacheEvent('cache-invalidate', { locale });
  } else {
    knowledgeVectorCache.clear();
    logCacheEvent('cache-invalidate-all');
  }
  knowledgeVectorCacheMetrics.invalidations += 1;
}

export async function rebuildKnowledgeVectorCache(locale: string = 'de') {
  const documents = await buildKnowledgeVectorDocuments(locale);
  knowledgeVectorCache.set(locale, {
    documents,
    expiresAt: Date.now() + VECTOR_CACHE_TTL_MS,
  });
  knowledgeVectorCacheMetrics.rebuilds += 1;
  logCacheEvent('cache-manual-rebuild', { locale, size: documents.length });
  return {
    locale,
    count: documents.length,
    refreshedAt: new Date().toISOString(),
  };
}

export function getKnowledgeVectorCacheMetrics() {
  return { ...knowledgeVectorCacheMetrics };
}

export async function searchKnowledgeArticlesVector(
  query: string,
  locale: string = 'de',
  limit = 6
): Promise<KnowledgeVectorSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const parsedQuery = parseVectorQuery(trimmed);
  const vectorText = parsedQuery.vectorText.trim();

  const documents = await getKnowledgeVectorDocuments(locale);
  const textMap = new Map(documents.map((doc) => [doc.id, doc.text.toLowerCase()]));

  const resolveFieldValue = (field: string, payload: KnowledgeBase) => {
    switch (field) {
      case 'readingtime':
      case 'readtime':
      case 'lesezeit':
        return typeof payload.readingTime === 'number' ? payload.readingTime : null;
      case 'publishedat':
      case 'veröffentlicht':
        return payload.publishedAt ? new Date(payload.publishedAt).getTime() : null;
      case 'difficulty':
      case 'difficultyindex':
        if (!payload.difficulty) return null;
        switch (payload.difficulty) {
          case 'beginner':
            return 1;
          case 'intermediate':
            return 2;
          case 'advanced':
            return 3;
          default:
            return null;
        }
      case 'featured':
        return payload.featured ? 1 : 0;
      default:
        return null;
    }
  };

  const runSemanticSearch = vectorText.length > 0;

  const rawResults: VectorSearchResult<KnowledgeBase>[] = runSemanticSearch
    ? semanticVectorSearch(vectorText, documents, {
        topK: Math.max(limit * 2, 12),
        minScore: 0.04,
      })
    : documents.map((doc): VectorSearchResult<KnowledgeBase> => ({
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
    title: payload.title,
    excerpt: buildExcerpt(payload.content, payload.excerpt),
    image: payload.image || null,
    similarity: Number(score.toFixed(4)),
    tags: payload.tags ?? [],
    publishedAt: payload.publishedAt,
  }));
}
