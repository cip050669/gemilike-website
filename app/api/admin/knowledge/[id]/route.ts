import { NextRequest, NextResponse } from 'next/server';
import { loadKnowledgeArticles, saveKnowledgeArticles } from '@/lib/data/knowledge';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articles = await loadKnowledgeArticles();
    const article = articles.find((item) => item.id === id);

    if (!article) {
      return NextResponse.json({ success: false, error: 'Knowledge article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error('Error fetching knowledge article:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch knowledge article' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const articles = await loadKnowledgeArticles();
    const index = articles.findIndex((article) => article.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Knowledge article not found' }, { status: 404 });
    }

    const existing = articles[index];
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
    } = body;

    const updated = {
      ...existing,
      title: title ?? existing.title,
      excerpt: excerpt ?? existing.excerpt,
      content: content ?? existing.content,
      author: author ?? existing.author,
      category: category ?? existing.category,
      tags: tags ?? existing.tags,
      image: image ?? existing.image,
      contentImages: contentImages !== undefined ? contentImages : existing.contentImages,
      published: published ?? existing.published,
      featured: featured ?? existing.featured,
      updatedAt: new Date(),
      publishedAt:
        published !== undefined
          ? published
            ? existing.publishedAt ?? new Date()
            : undefined
          : existing.publishedAt,
    };

    if (title && title !== existing.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const slugTaken = articles.some((article, idx) => idx !== index && article.slug === newSlug);
      if (!slugTaken) {
        updated.slug = newSlug;
      }
    }

    articles[index] = updated;
    await saveKnowledgeArticles(articles);

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error('Error updating knowledge article:', error);
    return NextResponse.json({ success: false, error: 'Failed to update knowledge article' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articles = await loadKnowledgeArticles();
    const index = articles.findIndex((article) => article.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Knowledge article not found' }, { status: 404 });
    }

    const [removed] = articles.splice(index, 1);
    await saveKnowledgeArticles(articles);

    return NextResponse.json({ success: true, article: removed });
  } catch (error) {
    console.error('Error deleting knowledge article:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete knowledge article' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const formData = await request.formData();
  const method = (formData.get('_method') as string | null)?.toUpperCase();

  if (method === 'DELETE') {
    return DELETE(request, context);
  }

  return NextResponse.json(
    { success: false, error: 'Unsupported method override' },
    { status: 405 }
  );
}
