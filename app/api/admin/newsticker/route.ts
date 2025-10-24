import { NextRequest, NextResponse } from 'next/server';
import { loadNewstickerData, saveNewstickerData } from '@/lib/newsticker/data';
import type { NewstickerItem } from '@/lib/types/newsticker';

const TYPE_VALUES = new Set<NewstickerItem['type']>(['info', 'warning', 'success', 'error']);
const PRIORITY_VALUES = new Set<NewstickerItem['priority']>(['low', 'medium', 'high']);

const normalizeType = (value: unknown, fallback: NewstickerItem['type']): NewstickerItem['type'] => {
  return typeof value === 'string' && TYPE_VALUES.has(value as NewstickerItem['type'])
    ? (value as NewstickerItem['type'])
    : fallback;
};

const normalizePriority = (
  value: unknown,
  fallback: NewstickerItem['priority']
): NewstickerItem['priority'] => {
  return typeof value === 'string' && PRIORITY_VALUES.has(value as NewstickerItem['priority'])
    ? (value as NewstickerItem['priority'])
    : fallback;
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
    const contentType = request.headers.get('content-type');
    
    let text: unknown;
    let type: unknown;
    let priority: unknown = 'medium';
    let isActive: unknown = true;
    let startDate: unknown;
    let endDate: unknown;
    
    if (contentType?.includes('application/json')) {
      // Handle JSON requests
      const body = await request.json();
      ({ text, type, priority = 'medium', isActive = true, startDate, endDate } = body);
    } else {
      // Handle form data requests
      const formData = await request.formData();
      text = formData.get('text');
      type = formData.get('type');
      priority = formData.get('priority') || 'medium';
      isActive = formData.get('isActive') === 'on';
      startDate = formData.get('startDate');
      endDate = formData.get('endDate');
    }

    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    const resolvedType = normalizeType(type, 'info');
    const resolvedPriority = normalizePriority(priority, 'medium');
    const active = typeof isActive === 'boolean' ? isActive : Boolean(isActive);

    const items = loadNewstickerData();
    const newItem: NewstickerItem = {
      id: `newsticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      type: resolvedType,
      priority: resolvedPriority,
      isActive: active,
      startDate: typeof startDate === 'string' && startDate ? new Date(startDate).toISOString() : undefined,
      endDate: typeof endDate === 'string' && endDate ? new Date(endDate).toISOString() : undefined,
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
    const { id, text, type, isActive, priority } = body as {
      id?: string;
      text?: unknown;
      type?: unknown;
      isActive?: unknown;
      priority?: unknown;
    };

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
      text:
        typeof text === 'string' && text.trim()
          ? text.trim()
          : items[itemIndex].text,
      type: type !== undefined ? normalizeType(type, items[itemIndex].type) : items[itemIndex].type,
      priority:
        priority !== undefined
          ? normalizePriority(priority, items[itemIndex].priority)
          : items[itemIndex].priority,
      isActive: typeof isActive === 'boolean' ? isActive : items[itemIndex].isActive,
      updatedAt: new Date(),
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
