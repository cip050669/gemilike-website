import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { BlogPost } from '@/lib/types/blog';
import { loadBlogs, saveBlogs } from '@/lib/data/blogs';

// GET - Alle Blog-Posts abrufen
export async function GET(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();
    
    // Für Development: Authentifizierung temporär deaktiviert
    // TODO: In Production wieder aktivieren
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    const blogs = await loadBlogs();
    return NextResponse.json({ success: true, blogs });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST - Neuen Blog-Post erstellen
export async function POST(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();
    
    // Für Development: Authentifizierung temporär deaktiviert
    // TODO: In Production wieder aktivieren
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    const body = await request.json();
    const { title, excerpt, content, author, category, tags, image, contentImages, published, featured, className, metaDescription, readingTime } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const blogs = await loadBlogs();
    
    // Erstelle Slug aus Titel
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Prüfe ob Slug bereits existiert
    const existingSlug = blogs.find(blog => blog.slug === slug);
    if (existingSlug) {
      return NextResponse.json({ error: 'A blog post with this title already exists' }, { status: 409 });
    }

    const newBlog: BlogPost = {
      id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      slug,
      excerpt: excerpt || content.substring(0, 200) + '...',
      content,
      author: author || 'Gemilike Team',
      category: category || 'Edelsteinkunde',
      tags: tags || [],
      image: image || '/images/stories/placeholder-gem.svg',
      contentImages: contentImages || [],
      published: published || false,
      featured: featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: published ? new Date() : undefined,
      className: className || 'blog-post',
      metaDescription: metaDescription || excerpt || content.substring(0, 160) + '...',
      readingTime: readingTime || Math.ceil(content.split(' ').length / 200), // Geschätzte Lesezeit
    };

    blogs.push(newBlog);
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// PUT - Blog-Post aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();
    
    // Für Development: Authentifizierung temporär deaktiviert
    // TODO: In Production wieder aktivieren
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    const body = await request.json();
    const { id, title, excerpt, content, author, category, tags, image, contentImages, published, featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const blogs = await loadBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === id);

    if (blogIndex === -1) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Aktualisiere Blog-Post
    const updatedBlog = {
      ...blogs[blogIndex],
      title: title || blogs[blogIndex].title,
      excerpt: excerpt || blogs[blogIndex].excerpt,
      content: content || blogs[blogIndex].content,
      author: author || blogs[blogIndex].author,
      category: category || blogs[blogIndex].category,
      tags: tags || blogs[blogIndex].tags,
      image: image || blogs[blogIndex].image,
      contentImages: contentImages !== undefined ? contentImages : blogs[blogIndex].contentImages,
      published: published !== undefined ? published : blogs[blogIndex].published,
      featured: featured !== undefined ? featured : blogs[blogIndex].featured,
      updatedAt: new Date(),
      publishedAt: published && !blogs[blogIndex].published ? new Date() : blogs[blogIndex].publishedAt,
    };

    // Aktualisiere Slug wenn Titel geändert wurde
    if (title && title !== blogs[blogIndex].title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Prüfe ob neuer Slug bereits existiert
      const existingSlug = blogs.find(blog => blog.slug === newSlug && blog.id !== id);
      if (!existingSlug) {
        updatedBlog.slug = newSlug;
      }
    }

    blogs[blogIndex] = updatedBlog;
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, blog: updatedBlog });

  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE - Blog-Post löschen
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();
    
    // Für Development: Authentifizierung temporär deaktiviert
    // TODO: In Production wieder aktivieren
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const blogs = await loadBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === id);

    if (blogIndex === -1) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    blogs.splice(blogIndex, 1);
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });

  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
