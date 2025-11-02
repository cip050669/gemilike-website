import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getKnowledgeArticles,
  createKnowledgeArticle,
} from '@/lib/services/knowledge.service';

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
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existing = await getKnowledgeArticles(locale);
    if (existing.some((a) => a.slug === slug && a.locale === locale)) {
      return NextResponse.json(
        { error: 'Article with this title already exists' },
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
      image: image || null,
      contentImages: contentImages || [],
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

