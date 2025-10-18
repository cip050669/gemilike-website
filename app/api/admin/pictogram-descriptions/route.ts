import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'pictogram-descriptions.json');

interface PictogramDescription {
  id: string;
  icon: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface PictogramSettings {
  descriptions: PictogramDescription[];
}

// Load pictogram descriptions from JSON file
async function loadPictogramDescriptions(): Promise<PictogramDescription[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const settings: PictogramSettings = JSON.parse(data);
    return settings.descriptions || [];
  } catch (error) {
    console.error('Error loading pictogram descriptions:', error);
    return [];
  }
}

// Save pictogram descriptions to JSON file
async function savePictogramDescriptions(descriptions: PictogramDescription[]): Promise<void> {
  try {
    const settings: PictogramSettings = { descriptions };
    await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving pictogram descriptions:', error);
    throw error;
  }
}

// GET - Fetch all pictogram descriptions
export async function GET() {
  try {
    const descriptions = await loadPictogramDescriptions();
    return NextResponse.json({ success: true, descriptions });
  } catch (error) {
    console.error('Error fetching pictogram descriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pictogram descriptions' },
      { status: 500 }
    );
  }
}

// POST - Create new pictogram description
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icon, title, description, isActive = true, order = 0 } = body;

    if (!icon || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Icon, title and description are required' },
        { status: 400 }
      );
    }

    const descriptions = await loadPictogramDescriptions();
    const newDescription: PictogramDescription = {
      id: `pictogram-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      icon,
      title,
      description,
      isActive,
      order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    descriptions.push(newDescription);
    await savePictogramDescriptions(descriptions);

    return NextResponse.json({ success: true, description: newDescription });
  } catch (error) {
    console.error('Error creating pictogram description:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create pictogram description' },
      { status: 500 }
    );
  }
}

// PUT - Update pictogram description
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, icon, title, description, isActive, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const descriptions = await loadPictogramDescriptions();
    const index = descriptions.findIndex(d => d.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Pictogram description not found' },
        { status: 404 }
      );
    }

    descriptions[index] = {
      ...descriptions[index],
      icon: icon || descriptions[index].icon,
      title: title || descriptions[index].title,
      description: description || descriptions[index].description,
      isActive: isActive !== undefined ? isActive : descriptions[index].isActive,
      order: order !== undefined ? order : descriptions[index].order,
      updatedAt: new Date().toISOString(),
    };

    await savePictogramDescriptions(descriptions);
    return NextResponse.json({ success: true, description: descriptions[index] });
  } catch (error) {
    console.error('Error updating pictogram description:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update pictogram description' },
      { status: 500 }
    );
  }
}

// DELETE - Delete pictogram description
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

    const descriptions = await loadPictogramDescriptions();
    const filteredDescriptions = descriptions.filter(d => d.id !== id);
    
    if (descriptions.length === filteredDescriptions.length) {
      return NextResponse.json(
        { success: false, error: 'Pictogram description not found' },
        { status: 404 }
      );
    }

    await savePictogramDescriptions(filteredDescriptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pictogram description:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete pictogram description' },
      { status: 500 }
    );
  }
}
