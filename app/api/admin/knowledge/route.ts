import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { loadKnowledgeArticles, saveKnowledgeArticles } from '@/lib/data/knowledge';
import type { KnowledgeArticle } from '@/lib/types/knowledge';

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    const articles = await loadKnowledgeArticles();
    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error('Error fetching knowledge articles:', error);
    return NextResponse.json({ error: 'Failed to fetch knowledge articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    const body = await request.json();
    const { title, excerpt, content, author, category, tags, image, contentImages, published, featured } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const articles = await loadKnowledgeArticles();
    const slug = generateSlug(title);

    if (articles.some((article) => article.slug === slug)) {
      return NextResponse.json({ error: 'Article with this title already exists' }, { status: 409 });
    }

    const newArticle: KnowledgeArticle = {
      id: `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      slug,
      excerpt: excerpt || content.substring(0, 200) + '...',
      content,
      author: author || 'Gemilike Redaktion',
      category: category || 'Grundlagen',
      tags: tags || [],
      image: image || '/images/stories/placeholder-gem.svg',
      contentImages: contentImages || [],
      published: published ?? false,
      featured: featured ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: published ? new Date() : undefined,
    };

    articles.push(newArticle);
    await saveKnowledgeArticles(articles);

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error) {
    console.error('Error creating knowledge article:', error);
    return NextResponse.json({ error: 'Failed to create knowledge article' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    const body = await request.json();
    const { id, title, excerpt, content, author, category, tags, image, contentImages, published, featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const articles = await loadKnowledgeArticles();
    const index = articles.findIndex((article) => article.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const current = articles[index];
    const updated: KnowledgeArticle = {
      ...current,
      title: title ?? current.title,
      excerpt: excerpt ?? current.excerpt,
      content: content ?? current.content,
      author: author ?? current.author,
      category: category ?? current.category,
      tags: tags ?? current.tags,
      image: image ?? current.image,
      contentImages: contentImages ?? current.contentImages,
      published: published ?? current.published,
      featured: featured ?? current.featured,
      updatedAt: new Date(),
      publishedAt: published && !current.published ? new Date() : current.publishedAt,
    };

    if (title && title !== current.title) {
      const newSlug = generateSlug(title);
      if (!articles.some((article) => article.slug === newSlug && article.id !== id)) {
        updated.slug = newSlug;
      }
    }

    articles[index] = updated;
    await saveKnowledgeArticles(articles);

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error('Error updating knowledge article:', error);
    return NextResponse.json({ error: 'Failed to update knowledge article' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const articles = await loadKnowledgeArticles();
    const index = articles.findIndex((article) => article.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    articles.splice(index, 1);
    await saveKnowledgeArticles(articles);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting knowledge article:', error);
    return NextResponse.json({ error: 'Failed to delete knowledge article' }, { status: 500 });
  }
}
