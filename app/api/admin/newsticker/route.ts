import { NextRequest, NextResponse } from 'next/server';
import { loadNewstickerData, saveNewstickerData } from '@/lib/newsticker/data';
import type { NewstickerItem } from '@/lib/types/newsticker';

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
    const contentType = request.headers.get('content-type');
    
    let text, type, priority = 'medium', isActive = true, startDate, endDate;
    
    if (contentType?.includes('application/json')) {
      // Handle JSON requests
      const body = await request.json();
      ({ text, type, priority = 'medium', isActive = true, startDate, endDate } = body);
    } else {
      // Handle form data requests
      const formData = await request.formData();
      text = formData.get('text') as string;
      type = formData.get('type') as string;
      priority = formData.get('priority') as string || 'medium';
      isActive = formData.get('isActive') === 'on';
      startDate = formData.get('startDate') as string;
      endDate = formData.get('endDate') as string;
    }

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
      priority,
      isActive,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    items.push(newItem);
    saveNewstickerData(items);

    // If it's a form submission, redirect to the newsticker page
    if (!contentType?.includes('application/json')) {
      return NextResponse.redirect(new URL('/de/admin/newsticker', request.url));
    }

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
