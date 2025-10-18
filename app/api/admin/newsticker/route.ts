import { NextRequest, NextResponse } from 'next/server';
import { NewstickerItem } from '@/lib/types/newsticker';
import fs from 'fs';
import path from 'path';

const NEWSTICKER_FILE = path.join(process.cwd(), 'data', 'newsticker.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load newsticker data
const loadNewstickerData = (): NewstickerItem[] => {
  try {
    if (fs.existsSync(NEWSTICKER_FILE)) {
      const data = fs.readFileSync(NEWSTICKER_FILE, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }));
    }
  } catch (error) {
    console.error('Error loading newsticker data:', error);
  }
  return [];
};

// Save newsticker data
const saveNewstickerData = (data: NewstickerItem[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(NEWSTICKER_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving newsticker data:', error);
    throw error;
  }
};

// GET - Fetch all newsticker items
export async function GET() {
  try {
    const items = loadNewstickerData();
    // Ensure we always return an array
    const safeItems = Array.isArray(items) ? items : [];
    return NextResponse.json({ success: true, items: safeItems });
  } catch (error) {
    // Return empty array instead of error
    return NextResponse.json({ success: true, items: [] });
  }
}

// POST - Create new newsticker item
export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const { text, type, isActive = true } = body;

    if (!text || !type) {
      return NextResponse.json(
        { success: false, error: 'Text and type are required' },
        { status: 400 }
      );
    }

    const items = loadNewstickerData();
    const newItem: NewstickerItem = {
      id: `newsticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      type,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    items.push(newItem);
    saveNewstickerData(items);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error creating newsticker item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create newsticker item' },
      { status: 500 }
    );
  }
}

// PUT - Update newsticker item
export async function PUT(request: NextRequest) {
  try {

    const body = await request.json();
    const { id, text, type, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const items = loadNewstickerData();
    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Newsticker item not found' },
        { status: 404 }
      );
    }

    // Update item
    items[itemIndex] = {
      ...items[itemIndex],
      text: text !== undefined ? text : items[itemIndex].text,
      type: type !== undefined ? type : items[itemIndex].type,
      isActive: isActive !== undefined ? isActive : items[itemIndex].isActive,
      updatedAt: new Date()
    };

    saveNewstickerData(items);

    return NextResponse.json({ success: true, item: items[itemIndex] });
  } catch (error) {
    console.error('Error updating newsticker item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update newsticker item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete newsticker item
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

    const items = loadNewstickerData();
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === items.length) {
      return NextResponse.json(
        { success: false, error: 'Newsticker item not found' },
        { status: 404 }
      );
    }

    saveNewstickerData(filteredItems);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting newsticker item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete newsticker item' },
      { status: 500 }
    );
  }
}
