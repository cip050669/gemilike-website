import { prisma } from '@/lib/prisma';

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

export async function getKnowledgeArticles(locale: string = 'de', publishedOnly: boolean = false) {
  const where: any = { locale };
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
  return prisma.knowledgeBase.create({
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
}

export async function updateKnowledgeArticle(id: string, data: Partial<KnowledgeBaseInput>) {
  const updateData: any = { ...data };
  
  if (data.published && !data.publishedAt) {
    const existing = await prisma.knowledgeBase.findUnique({ where: { id } });
    if (existing && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  return prisma.knowledgeBase.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteKnowledgeArticle(id: string) {
  return prisma.knowledgeBase.delete({
    where: { id },
  });
}

