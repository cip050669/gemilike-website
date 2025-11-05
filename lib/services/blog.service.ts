import { prisma } from '@/lib/prisma';

export interface BlogInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
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
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | null;
  publishedAt?: Date | null;
  views?: number;
}

export async function getBlogs(locale: string = 'de', publishedOnly: boolean = false) {
  const where: { locale: string; published?: boolean } = { locale };
  if (publishedOnly) {
    where.published = true;
  }

  return prisma.blog.findMany({
    where,
    orderBy: [
      { featured: 'desc' },
      { publishedAt: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

export async function getBlogBySlug(slug: string, locale: string = 'de') {
  return prisma.blog.findFirst({
    where: {
      slug,
      locale,
      published: true,
    },
  });
}

export async function getBlogById(id: string) {
  return prisma.blog.findUnique({
    where: { id },
  });
}

export async function createBlog(data: BlogInput) {
  // Calculate reading time if not provided
  const readingTime = data.readingTime || Math.ceil(data.content.split(' ').length / 200);

  return prisma.blog.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || '',
      author: data.author || 'Gemilike Team',
      category: data.category,
      tags: data.tags || [],
      image: data.image || null,
      contentImages: data.contentImages || [],
      published: data.published || false,
      featured: data.featured || false,
      locale: data.locale || 'de',
      metaDescription: data.metaDescription || null,
      readingTime: readingTime,
      difficulty: data.difficulty || null,
      publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt || null,
      views: data.views || 0,
    },
  });
}

export async function updateBlog(id: string, data: Partial<BlogInput>) {
  const updateData: Partial<BlogInput> & { readingTime?: number; publishedAt?: Date } = { ...data };
  
  // Calculate reading time if content changed
  if (data.content && !data.readingTime) {
    updateData.readingTime = Math.ceil(data.content.split(' ').length / 200);
  }
  
  // Set publishedAt if publishing for the first time
  if (data.published && !data.publishedAt) {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (existing && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  return prisma.blog.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteBlog(id: string) {
  return prisma.blog.delete({
    where: { id },
  });
}

export async function incrementBlogViews(id: string) {
  return prisma.blog.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}

