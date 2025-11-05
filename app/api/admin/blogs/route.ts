import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getBlogs, createBlog } from '@/lib/services/blog.service';

// GET - Alle Blog-Posts abrufen
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const blogs = await getBlogs(locale, publishedOnly);
    return NextResponse.json({ success: true, blogs });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST - Neuen Blog-Post erstellen
export async function POST(request: NextRequest) {
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
      difficulty 
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ 
        error: 'Title, content, and category are required' 
      }, { status: 400 });
    }

    // Erstelle Slug aus Titel
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Prüfe ob Slug bereits existiert (pro Locale)
    const existing = await getBlogs(locale);
    if (existing.some(blog => blog.slug === slug && blog.locale === locale)) {
      return NextResponse.json({ 
        error: 'A blog post with this title already exists for this locale' 
      }, { status: 409 });
    }

    const blog = await createBlog({
      title,
      slug,
      excerpt: excerpt || content.substring(0, 200) + '...',
      content,
      author: author || 'Gemilike Team',
      category,
      tags: tags || [],
      image: image || '/images/stories/placeholder-gem.svg',
      contentImages: contentImages || [],
      published: published || false,
      featured: featured || false,
      locale,
      metaDescription: metaDescription || excerpt || content.substring(0, 160) + '...',
      readingTime,
      difficulty: difficulty || null,
    });

    return NextResponse.json({ success: true, blog }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// PUT - Blog-Post aktualisieren
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { 
      id, 
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
      slug 
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const { updateBlog, getBlogById } = await import('@/lib/services/blog.service');
    const existing = await getBlogById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Aktualisiere Slug wenn Titel geändert wurde
    let newSlug = slug || existing.slug;
    if (title && title !== existing.title && !slug) {
      newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Prüfe ob neuer Slug bereits existiert (pro Locale)
      const currentLocale = locale || existing.locale;
      const allBlogs = await getBlogs(currentLocale);
      const slugTaken = allBlogs.some(blog => blog.slug === newSlug && blog.id !== id && blog.locale === currentLocale);
      if (slugTaken) {
        return NextResponse.json({ error: 'A blog post with this slug already exists for this locale' }, { status: 409 });
      }
    }

    const updatedBlog = await updateBlog(id, {
      title,
      slug: newSlug,
      excerpt,
      content,
      author,
      category,
      tags,
      image,
      contentImages,
      published,
      featured,
      locale: locale || existing.locale,
      metaDescription,
      readingTime,
      difficulty,
    });

    return NextResponse.json({ success: true, blog: updatedBlog });

  } catch (error) {
    console.error('Error updating blog:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE - Blog-Post löschen
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const { deleteBlog } = await import('@/lib/services/blog.service');
    await deleteBlog(id);

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });

  } catch (error) {
    console.error('Error deleting blog:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
