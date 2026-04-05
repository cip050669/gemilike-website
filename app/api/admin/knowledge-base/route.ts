import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  getKnowledgeArticles,
  createKnowledgeArticle,
} from '@/lib/services/knowledge.service';

const ACCENT_MARKS_REGEX = /[\u0300-\u036f]/g;

function toSlug(value: string) {
  const slug = value
    .toLowerCase()
    .normalize('NFD')
    .replace(ACCENT_MARKS_REGEX, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return slug || `article-${Date.now()}`;
}

function normalizeImage(
  image: unknown,
  contentImages: unknown
) {
  const imageValue = typeof image === 'string' ? image.trim() : '';
  const contentImageList = Array.isArray(contentImages)
    ? contentImages.filter(
        (entry): entry is string => typeof entry === 'string' && entry.trim().length > 0
      )
    : [];

  const normalizedImage =
    imageValue && imageValue !== '/blog/default-blog.jpg' && imageValue !== '/images/stories/placeholder-gem.svg'
      ? imageValue
      : contentImageList[0] || null;

  return {
    image: normalizedImage,
    contentImages: contentImageList,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const articles = await getKnowledgeArticles(locale, publishedOnly);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching knowledge articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Knowledge Base API - POST request received');
    const session = await getServerSession(authOptions);
    console.log('🔍 Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      role: (session?.user as { role?: string })?.role,
      email: session?.user?.email,
    });
    
    if (!session?.user) {
      console.error('❌ No session or user found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }
    
    if ((session.user as { role?: string }).role !== 'ADMIN') {
      console.error('❌ User is not ADMIN:', (session.user as { role?: string }).role);
      return NextResponse.json({ error: 'Unauthorized - Not ADMIN' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      author,
      category,
      tags,
      image,
      contentImages,
      published,
      featured,
      locale = 'de',
      metaDescription,
      readingTime,
      difficulty,
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const slug = toSlug(title);
    const normalizedImages = normalizeImage(image, contentImages);

    const existing = await prisma.knowledgeBase.findFirst({
      where: {
        slug,
      },
      select: { id: true, locale: true, title: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.locale === locale
              ? 'Ein Artikel mit diesem Titel bzw. Slug existiert in dieser Sprache bereits'
              : `Ein Artikel mit diesem Slug existiert bereits in der Sprache ${existing.locale}`,
        },
        { status: 409 }
      );
    }

    // Calculate reading time if not provided
    const calculatedReadingTime = readingTime || Math.ceil(content.split(' ').length / 200);

    const article = await createKnowledgeArticle({
      slug,
      title,
      excerpt: excerpt || content.substring(0, 200) + '...',
      content,
      author: author || 'Gemilike Redaktion',
      category,
      tags: tags || [],
      image: normalizedImages.image,
      contentImages: normalizedImages.contentImages,
      published: published ?? false,
      featured: featured ?? false,
      locale,
      metaDescription: metaDescription || excerpt || content.substring(0, 160) + '...',
      readingTime: calculatedReadingTime,
      difficulty: difficulty || 'beginner',
      publishedAt: published ? new Date() : null,
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating knowledge article:', error);
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'Article with this slug and locale already exists' },
        { status: 409 }
      );
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message || 'Internal server error' },
      { status: 500 }
    );
  }
}
