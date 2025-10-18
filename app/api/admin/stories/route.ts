import { NextRequest, NextResponse } from 'next/server';
import { StorySectionSettings } from '@/lib/hooks/useStorySettings';
import fs from 'fs';
import path from 'path';

const STORIES_FILE = path.join(process.cwd(), 'data', 'stories.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load stories data
const loadStoriesData = (): StorySectionSettings => {
  try {
    if (fs.existsSync(STORIES_FILE)) {
      const data = fs.readFileSync(STORIES_FILE, 'utf8');
      const parsed = JSON.parse(data);
      return parsed;
    }
  } catch (error) {
    // Silent error handling
  }
  
  // Return default settings if file doesn't exist or is invalid
  return {
    sectionTitle: 'Geschichten um Edelsteine',
    sectionDescription: 'Faszinierende Einblicke in die Welt der Edelsteine, ihre Herkunft und die Menschen dahinter',
    stories: []
  };
};

// Save stories data
const saveStoriesData = (data: StorySectionSettings) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(STORIES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    throw error;
  }
};

// GET - Fetch stories
export async function GET() {
  try {
    const stories = loadStoriesData();
    return NextResponse.json({ success: true, stories });
  } catch (error) {
    // Return default settings instead of error
    return NextResponse.json({ 
      success: true, 
      stories: {
        sectionTitle: 'Geschichten um Edelsteine',
        sectionDescription: 'Faszinierende Einblicke in die Welt der Edelsteine, ihre Herkunft und die Menschen dahinter',
        stories: []
      }
    });
  }
}

// POST - Create new story or handle actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, story, settings } = body;

    // Handle different actions
    if (action === 'addStory') {
      const { title, description, content, imageUrl, published = true } = story;

      if (!title || !description) {
        return NextResponse.json(
          { success: false, error: 'Title and description are required' },
          { status: 400 }
        );
      }

      const stories = loadStoriesData();
      const newStory = {
        id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        content: content || '',
        imageUrl: imageUrl || '/images/stories/placeholder.svg',
        published,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      stories.stories.push(newStory);
      saveStoriesData(stories);

      return NextResponse.json({ success: true, story: newStory });
    }

    if (action === 'updateStory') {
      const { id, title, description, content, imageUrl, published } = story;

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'ID is required' },
          { status: 400 }
        );
      }

      const stories = loadStoriesData();
      const storyIndex = stories.stories.findIndex(s => s.id === id);

      if (storyIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Story not found' },
          { status: 404 }
        );
      }

      stories.stories[storyIndex] = {
        ...stories.stories[storyIndex],
        title: title !== undefined ? title : stories.stories[storyIndex].title,
        description: description !== undefined ? description : stories.stories[storyIndex].description,
        content: content !== undefined ? content : stories.stories[storyIndex].content,
        imageUrl: imageUrl !== undefined ? imageUrl : stories.stories[storyIndex].imageUrl,
        published: published !== undefined ? published : stories.stories[storyIndex].published,
        updatedAt: new Date().toISOString()
      };

      saveStoriesData(stories);
      return NextResponse.json({ success: true, story: stories.stories[storyIndex] });
    }

    if (action === 'deleteStory') {
      const { id } = story;

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'ID is required' },
          { status: 400 }
        );
      }

      const stories = loadStoriesData();
      const filteredStories = stories.stories.filter(s => s.id !== id);

      if (filteredStories.length === stories.stories.length) {
        return NextResponse.json(
          { success: false, error: 'Story not found' },
          { status: 404 }
        );
      }

      stories.stories = filteredStories;
      saveStoriesData(stories);
      return NextResponse.json({ success: true });
    }

    if (action === 'updateSettings') {
      const stories = loadStoriesData();
      stories.sectionTitle = settings.sectionTitle;
      stories.sectionDescription = settings.sectionDescription;
      saveStoriesData(stories);
      return NextResponse.json({ success: true });
    }

    // Fallback: Direct story creation (legacy support)
    const { title, description, content, imageUrl, published = true } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const stories = loadStoriesData();
    const newStory = {
      id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      content: content || '',
      imageUrl: imageUrl || '/images/stories/placeholder.svg',
      published,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    stories.stories.push(newStory);
    saveStoriesData(stories);

    return NextResponse.json({ success: true, story: newStory });
  } catch (error) {
    console.error('Stories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// PUT - Update story
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, imageUrl, published } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const stories = loadStoriesData();
    const storyIndex = stories.stories.findIndex(story => story.id === id);

    if (storyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    // Update story
    stories.stories[storyIndex] = {
      ...stories.stories[storyIndex],
      title: title !== undefined ? title : stories.stories[storyIndex].title,
      description: description !== undefined ? description : stories.stories[storyIndex].description,
      imageUrl: imageUrl !== undefined ? imageUrl : stories.stories[storyIndex].imageUrl,
      published: published !== undefined ? published : stories.stories[storyIndex].published
    };

    saveStoriesData(stories);

    return NextResponse.json({ success: true, story: stories.stories[storyIndex] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

// DELETE - Delete story
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const stories = loadStoriesData();
    const filteredStories = stories.stories.filter(story => story.id !== id);

    if (filteredStories.length === stories.stories.length) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    stories.stories = filteredStories;
    saveStoriesData(stories);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}