import { NextRequest, NextResponse } from 'next/server';
import { loadStoriesData, saveStoriesData } from '@/lib/data/stories';
import fs from 'fs';
import path from 'path';

// GET - Fetch single story
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stories = loadStoriesData();
    const story = stories.find(story => story.id === id);

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, story });
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

// PUT - Update story
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, author, status, imageUrl } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, error: 'Title, content and author are required' },
        { status: 400 }
      );
    }

    const stories = loadStoriesData();
    const storyIndex = stories.findIndex(story => story.id === id);

    if (storyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    stories[storyIndex] = {
      ...stories[storyIndex],
      title,
      content,
      author,
      status: status || 'draft',
      imageUrl: imageUrl || '',
      updatedAt: new Date()
    };

    saveStoriesData(stories);
    return NextResponse.json({ success: true, story: stories[storyIndex] });
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

// POST - Handle form submissions with _method (for Server Actions)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const method = formData.get('_method') as string;

    if (method === 'PUT') {
      const title = formData.get('title') as string;
      let content = formData.get('content') as string;
      const author = formData.get('author') as string;
      const status = formData.get('status') as string;
      let imageUrl = formData.get('imageUrl') as string;

      // Handle image upload
      const imageFile = formData.get('imageUpload') as File;
      if (imageFile && imageFile.size > 0) {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Save the file
        const filePath = path.join(uploadsDir, imageFile.name);
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        
        imageUrl = `/uploads/${imageFile.name}`;
        console.log('Image saved for update:', imageUrl);
      }

      // Handle markdown file upload
      const markdownFile = formData.get('markdownUpload') as File;
      if (markdownFile && markdownFile.size > 0) {
        // Read the markdown file content and use it as content
        const markdownContent = await markdownFile.text();
        content = markdownContent;
        console.log('Markdown file processed for update:', markdownFile.name, 'Content length:', markdownContent.length);
      }

      if (!title || !content || !author) {
        return NextResponse.json(
          { success: false, error: 'Title, content and author are required' },
          { status: 400 }
        );
      }

      const stories = loadStoriesData();
      const storyIndex = stories.findIndex(story => story.id === id);

      if (storyIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Story not found' },
          { status: 404 }
        );
      }

      stories[storyIndex] = {
        ...stories[storyIndex],
        title,
        content,
        author,
        status: (status as 'published' | 'draft' | 'archived') || 'draft',
        imageUrl: imageUrl || '',
        updatedAt: new Date()
      };

      saveStoriesData(stories);
      return NextResponse.redirect(new URL('/de/admin/stories', request.url));
    }

    if (method === 'DELETE') {
      const stories = loadStoriesData();
      const storyIndex = stories.findIndex(story => story.id === id);

      if (storyIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Story not found' },
          { status: 404 }
        );
      }

      // Remove the story
      const deletedStory = stories.splice(storyIndex, 1)[0];
      saveStoriesData(stories);

      return NextResponse.redirect(new URL('/de/admin/stories', request.url));
    }

    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Delete story
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stories = loadStoriesData();
    const storyIndex = stories.findIndex(story => story.id === id);

    if (storyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    const deletedStory = stories.splice(storyIndex, 1)[0];
    saveStoriesData(stories);
    return NextResponse.json({ success: true, story: deletedStory });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
