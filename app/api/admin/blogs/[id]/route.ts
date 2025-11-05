import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getBlogById, updateBlog, deleteBlog } from '@/lib/services/blog.service';

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
    if ((session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Not ADMIN' }, { status: 401 });
    }

    const { id } = await params;
    const blog = await getBlogById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const body = await request.json();
    const existing = await getBlogById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

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
      locale,
      metaDescription,
      readingTime,
      difficulty,
      slug,
    } = body;

    // Update slug if title changed
    let newSlug = slug || existing.slug;
    if (title && title !== existing.title && !slug) {
      newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const { getBlogs } = await import('@/lib/services/blog.service');
      const currentLocale = locale || existing.locale;
      const allBlogs = await getBlogs(currentLocale);
      const slugTaken = allBlogs.some(
        (blog) => blog.slug === newSlug && blog.id !== id && blog.locale === currentLocale
      );
      if (slugTaken) {
        return NextResponse.json(
          { success: false, error: 'A blog post with this slug already exists for this locale' },
          { status: 409 }
        );
      }
    }

    const updated = await updateBlog(id, {
      title: title ?? existing.title,
      slug: newSlug,
      excerpt: excerpt ?? existing.excerpt,
      content: content ?? existing.content,
      author: author ?? existing.author,
      category: category ?? existing.category,
      tags: tags ?? existing.tags,
      image: image ?? existing.image,
      contentImages: contentImages !== undefined ? contentImages : existing.contentImages,
      published: published ?? existing.published,
      featured: featured ?? existing.featured,
      locale: locale || existing.locale,
      metaDescription: metaDescription ?? existing.metaDescription,
      readingTime: readingTime ?? existing.readingTime,
      difficulty: difficulty ?? existing.difficulty,
    });

    return NextResponse.json({ success: true, blog: updated });
  } catch (error) {
    console.error('Error updating blog:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
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
    await deleteBlog(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
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
