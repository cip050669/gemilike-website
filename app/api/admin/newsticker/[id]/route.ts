import { NextRequest, NextResponse } from 'next/server';
import { loadNewstickerData, saveNewstickerData } from '@/lib/newsticker/data';
import type { NewstickerItem } from '@/lib/types/newsticker';

const TYPE_VALUES = new Set<NewstickerItem['type']>(['info', 'warning', 'success', 'error']);
const PRIORITY_VALUES = new Set<NewstickerItem['priority']>(['low', 'medium', 'high']);

const normalizeType = (value: unknown, fallback: NewstickerItem['type']): NewstickerItem['type'] =>
  typeof value === 'string' && TYPE_VALUES.has(value as NewstickerItem['type'])
    ? (value as NewstickerItem['type'])
    : fallback;

const normalizePriority = (
  value: unknown,
  fallback: NewstickerItem['priority']
): NewstickerItem['priority'] =>
  typeof value === 'string' && PRIORITY_VALUES.has(value as NewstickerItem['priority'])
    ? (value as NewstickerItem['priority'])
    : fallback;

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
    const { text, type, priority, isActive, startDate, endDate } = body as {
      text?: unknown;
      type?: unknown;
      priority?: unknown;
      isActive?: unknown;
      startDate?: unknown;
      endDate?: unknown;
    };

    if (typeof text !== 'string' || !text.trim() || typeof type !== 'string') {
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
      text: text.trim(),
      type: normalizeType(type, items[itemIndex].type),
      priority: normalizePriority(priority, items[itemIndex].priority),
      isActive: typeof isActive === 'boolean' ? isActive : items[itemIndex].isActive,
      startDate: typeof startDate === 'string' && startDate ? new Date(startDate).toISOString() : undefined,
      endDate: typeof endDate === 'string' && endDate ? new Date(endDate).toISOString() : undefined,
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
      const text = formData.get('text');
      const type = formData.get('type');
      const priority = formData.get('priority');
      const isActive = formData.get('isActive') === 'on';
      const startDate = formData.get('startDate');
      const endDate = formData.get('endDate');

      if (typeof text !== 'string' || !text.trim() || typeof type !== 'string') {
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
        text: text.trim(),
        type: normalizeType(type, items[itemIndex].type),
        priority: normalizePriority(priority, items[itemIndex].priority),
        isActive,
        startDate:
          typeof startDate === 'string' && startDate
            ? new Date(startDate).toISOString()
            : undefined,
        endDate:
          typeof endDate === 'string' && endDate ? new Date(endDate).toISOString() : undefined,
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
