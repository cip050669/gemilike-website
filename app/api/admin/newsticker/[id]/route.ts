import { NextRequest, NextResponse } from 'next/server';
import { loadNewstickerData, saveNewstickerData } from '../route';

// GET - Fetch single newsticker item
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const items = loadNewstickerData();
    const item = items.find(item => item.id === id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Newsticker item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error fetching newsticker item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsticker item' },
      { status: 500 }
    );
  }
}

// PUT - Update newsticker item
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, type, priority, isActive, startDate, endDate } = body;

    if (!text || !type) {
      return NextResponse.json(
        { success: false, error: 'Text and type are required' },
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

    // Update the item
    items[itemIndex] = {
      ...items[itemIndex],
      text,
      type,
      priority: priority || 'medium',
      isActive: isActive ?? true,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
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

// POST - Handle form submissions with _method
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const method = formData.get('_method') as string;

    if (method === 'PUT') {
      const text = formData.get('text') as string;
      const type = formData.get('type') as string;
      const priority = formData.get('priority') as string;
      const isActive = formData.get('isActive') === 'on';
      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string;

      if (!text || !type) {
        return NextResponse.json(
          { success: false, error: 'Text and type are required' },
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

      // Update the item
      items[itemIndex] = {
        ...items[itemIndex],
        text,
        type,
        priority: priority || 'medium',
        isActive,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        updatedAt: new Date()
      };

      saveNewstickerData(items);

      return NextResponse.redirect(new URL('/de/admin/newsticker', request.url));
    }

    if (method === 'DELETE') {
      const items = loadNewstickerData();
      const itemIndex = items.findIndex(item => item.id === id);

      if (itemIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Newsticker item not found' },
          { status: 404 }
        );
      }

      // Remove the item
      const deletedItem = items.splice(itemIndex, 1)[0];
      saveNewstickerData(items);

      return NextResponse.redirect(new URL('/de/admin/newsticker', request.url));
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

// DELETE - Delete newsticker item
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const items = loadNewstickerData();
    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Newsticker item not found' },
        { status: 404 }
      );
    }

    // Remove the item
    const deletedItem = items.splice(itemIndex, 1)[0];
    saveNewstickerData(items);

    return NextResponse.json({ success: true, item: deletedItem });
  } catch (error) {
    console.error('Error deleting newsticker item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete newsticker item' },
      { status: 500 }
    );
  }
}