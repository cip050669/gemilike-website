import type { AiJobType, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { embedText } from '@/lib/ai/embeddings';
import {
  gemstoneWithRelationsInclude,
  toShopGemstone,
  buildGemstoneSearchText,
  invalidateGemstoneVectorCache,
} from '@/lib/services/shop/gemstone.service';
import {
  buildKnowledgeSearchText,
  invalidateKnowledgeVectorCache,
} from '@/lib/services/knowledge.service';

interface ReindexOptions {
  locale?: string;
  ids?: string[];
}

interface ReindexResult {
  jobId: string;
  processed: number;
  locale?: string;
  model: string;
  entity: 'gemstones' | 'knowledge';
}

async function createJob(type: AiJobType, input?: Prisma.InputJsonValue, locale?: string) {
  return prisma.aiJob.create({
    data: {
      type,
      status: 'RUNNING',
      startedAt: new Date(),
      input,
      locale,
    },
  });
}

async function completeJob(id: string, output: Prisma.InputJsonValue) {
  await prisma.aiJob.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      output,
      completedAt: new Date(),
    },
  });
}

async function failJob(id: string, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown AI job error';
  await prisma.aiJob.update({
    where: { id },
    data: {
      status: 'FAILED',
      error: message,
      completedAt: new Date(),
    },
  });
}

export async function reindexGemstoneEmbeddings(
  options: ReindexOptions = {}
): Promise<ReindexResult> {
  const job = await createJob(
    'GEMSTONE_REINDEX',
    {
      ids: options.ids ?? [],
      locale: options.locale ?? 'all',
    },
    options.locale
  );

  try {
    const gemstones = await prisma.gemstone.findMany({
      where: options.ids?.length ? { id: { in: options.ids } } : undefined,
      include: gemstoneWithRelationsInclude,
    });

    let model = 'local-hash-embedding-v1';
    for (const gemstone of gemstones) {
      const shopGemstone = toShopGemstone(gemstone);
      const embedding = embedText(buildGemstoneSearchText(shopGemstone));
      model = embedding.model;
      await prisma.gemstone.update({
        where: { id: gemstone.id },
        data: {
          searchEmbedding: embedding.vector,
          searchEmbeddingModel: embedding.model,
          searchEmbeddingUpdatedAt: new Date(),
        },
      });
    }

    invalidateGemstoneVectorCache(options.locale);

    const output = {
      processed: gemstones.length,
      locale: options.locale ?? 'all',
      model,
      entity: 'gemstones',
    } satisfies Prisma.InputJsonObject;
    await completeJob(job.id, output);

    return {
      jobId: job.id,
      processed: gemstones.length,
      locale: options.locale,
      model,
      entity: 'gemstones',
    };
  } catch (error) {
    await failJob(job.id, error);
    throw error;
  }
}

export async function reindexKnowledgeEmbeddings(
  options: ReindexOptions = {}
): Promise<ReindexResult> {
  const locale = options.locale ?? 'de';
  const job = await createJob(
    'KNOWLEDGE_REINDEX',
    {
      ids: options.ids ?? [],
      locale,
    },
    locale
  );

  try {
    const articles = await prisma.knowledgeBase.findMany({
      where: {
        ...(options.locale ? { locale } : {}),
        ...(options.ids?.length ? { id: { in: options.ids } } : {}),
      },
    });

    let model = 'local-hash-embedding-v1';
    for (const article of articles) {
      const embedding = embedText(buildKnowledgeSearchText(article));
      model = embedding.model;
      await prisma.knowledgeBase.update({
        where: { id: article.id },
        data: {
          searchEmbedding: embedding.vector,
          searchEmbeddingModel: embedding.model,
          searchEmbeddingUpdatedAt: new Date(),
        },
      });
    }

    invalidateKnowledgeVectorCache(locale);

    const output = {
      processed: articles.length,
      locale,
      model,
      entity: 'knowledge',
    } satisfies Prisma.InputJsonObject;
    await completeJob(job.id, output);

    return {
      jobId: job.id,
      processed: articles.length,
      locale,
      model,
      entity: 'knowledge',
    };
  } catch (error) {
    await failJob(job.id, error);
    throw error;
  }
}
