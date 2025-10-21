import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Story {
  id: string;
  title: string;
  content: string;
  gemstone: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  imageUrl: string;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  createdAt: Date;
  updatedAt: Date;
}

const STORIES_FILE = path.join(process.cwd(), 'data', 'stories.json');

const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

export const loadStoriesData = (): Story[] => {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(STORIES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(STORIES_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading stories data:', error);
    return [];
  }
};

export const saveStoriesData = (data: Story[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(STORIES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving stories data:', error);
    throw error;
  }
};

// GET - Fetch all stories
export async function GET() {
  try {
    const stories = loadStoriesData();
    return NextResponse.json({ success: true, stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ success: true, stories: [] });
  }
}

// POST - Create new story
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    let title, content, author, status = 'draft', imageUrl = '';
    
    if (contentType?.includes('application/json')) {
      // Handle JSON requests
      const body = await request.json();
      ({ title, content, author, status = 'draft', imageUrl = '' } = body);
    } else {
      // Handle form data requests
      const formData = await request.formData();
      title = formData.get('title') as string;
      content = formData.get('content') as string;
      author = formData.get('author') as string;
      status = formData.get('status') as string || 'draft';
      
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
        console.log('Image saved:', imageUrl);
      } else {
        imageUrl = formData.get('imageUrl') as string || '';
      }

      // Handle markdown file upload
      const markdownFile = formData.get('markdownUpload') as File;
      if (markdownFile && markdownFile.size > 0) {
        // Read the markdown file content and use it as content
        const markdownContent = await markdownFile.text();
        content = markdownContent;
        console.log('Markdown file processed:', markdownFile.name, 'Content length:', markdownContent.length);
      }
    }

    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, error: 'Title, content and author are required' },
        { status: 400 }
      );
    }

    const stories = loadStoriesData();
    const newStory: Story = {
      id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      gemstone: 'general', // Default value since we removed the field
      author,
      status: status as 'draft' | 'published' | 'archived',
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    stories.push(newStory);
    saveStoriesData(stories);

    // If it's a form submission, redirect to the stories page
    if (!contentType?.includes('application/json')) {
      return NextResponse.redirect(new URL('/de/admin/stories', request.url));
    }

    return NextResponse.json({ success: true, story: newStory });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
