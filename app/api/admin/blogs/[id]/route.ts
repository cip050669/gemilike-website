import { NextRequest, NextResponse } from 'next/server';
import { loadBlogs, saveBlogs } from '@/lib/data/blogs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogs = await loadBlogs();
    const blog = blogs.find((item) => item.id === id);

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
    const { id } = await params;
    const body = await request.json();
    const blogs = await loadBlogs();
    const index = blogs.findIndex((blog) => blog.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const existing = blogs[index];
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
      contentImages:
        contentImages !== undefined ? contentImages : existing.contentImages,
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
      const slugTaken = blogs.some(
        (blog, idx) => idx !== index && blog.slug === newSlug
      );
      if (!slugTaken) {
        updated.slug = newSlug;
      }
    }

    blogs[index] = updated;
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, blog: updated });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogs = await loadBlogs();
    const index = blogs.findIndex((blog) => blog.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const [removed] = blogs.splice(index, 1);
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, blog: removed });
  } catch (error) {
    console.error('Error deleting blog:', error);
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
