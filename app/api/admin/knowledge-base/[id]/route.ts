import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  getKnowledgeArticleById,
  updateKnowledgeArticle,
  deleteKnowledgeArticle,
  KnowledgeBaseInput,
} from '@/lib/services/knowledge.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Unauthorized - No session. Please log in at /de/admin/login' 
      }, { status: 401 });
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Not ADMIN' }, { status: 401 });
    }

    const { id } = await params;
    const article = await getKnowledgeArticleById(id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching knowledge article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔍 Knowledge Base API - PUT request received');
    
    // Check cookies
    const cookieHeader = request.headers.get('cookie');
    console.log('🔍 Cookies received:', cookieHeader ? 'Yes' : 'No');
    if (cookieHeader) {
      const hasAuthCookie = cookieHeader.includes('next-auth.session-token') || cookieHeader.includes('__Secure-next-auth.session-token');
      console.log('🔍 Has auth cookie:', hasAuthCookie);
    }
    
    const session = await getServerSession(authOptions);
    console.log('🔍 Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      role: session?.user?.role,
      email: session?.user?.email,
    });
    
    if (!session?.user) {
      console.error('❌ No session or user found');
      console.error('❌ Please ensure you are logged in at /de/admin/login');
      return NextResponse.json({ 
        error: 'Unauthorized - No session. Please log in at /de/admin/login' 
      }, { status: 401 });
    }
    
    if (session.user.role !== 'ADMIN') {
      console.error('❌ User is not ADMIN:', session.user.role);
      return NextResponse.json({ error: 'Unauthorized - Not ADMIN' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Partial<KnowledgeBaseInput>;
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      tags,
      image,
      contentImages,
      published,
      featured,
      metaDescription,
      readingTime,
      difficulty,
    } = body;

    const updateData: Partial<KnowledgeBaseInput> = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (author !== undefined) updateData.author = author;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (image !== undefined) updateData.image = image;
    if (contentImages !== undefined) updateData.contentImages = contentImages;
    if (published !== undefined) updateData.published = published;
    if (featured !== undefined) updateData.featured = featured;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (readingTime !== undefined) updateData.readingTime = readingTime;
    if (difficulty !== undefined) updateData.difficulty = difficulty;

    // Set publishedAt if publishing for the first time
    if (published === true) {
      const existing = await getKnowledgeArticleById(id);
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const article = await updateKnowledgeArticle(id, updateData);

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating knowledge article:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Unauthorized - No session. Please log in at /de/admin/login' 
      }, { status: 401 });
    }
    if ((session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Not ADMIN' }, { status: 401 });
    }

    const { id } = await params;
    await deleteKnowledgeArticle(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting knowledge article:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
