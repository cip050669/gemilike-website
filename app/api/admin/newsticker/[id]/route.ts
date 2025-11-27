import { NextRequest, NextResponse } from 'next/server';
import type { NewstickerItem } from '@/lib/types/newsticker';
import {
  getNewstickerItem,
  updateNewstickerItem,
  deleteNewstickerItem,
} from '@/lib/services/newsticker.service';
import type { NewstickerInput } from '@/lib/services/newsticker.service';

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getNewstickerItem(id);
  if (!item) {
    return NextResponse.json({ success: false, error: 'Newsticker item not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, item });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as NewstickerInput;
    if (typeof payload.text !== 'string' || !payload.text.trim()) {
      return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
    }

    const item = await updateNewstickerItem(id, {
      ...payload,
      text: payload.text.trim(),
      type: payload.type ? normalizeType(payload.type, 'info') : undefined,
      priority: payload.priority ? normalizePriority(payload.priority, 'medium') : undefined,
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error updating newsticker item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update newsticker item' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const formData = await request.formData();
  const method = formData.get('_method');
  const { id } = await params;

  if (method === 'PUT') {
    const text = formData.get('text');
    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
    }

    await updateNewstickerItem(id, {
      text: text.trim(),
      type: normalizeType(formData.get('type'), 'info'),
      priority: normalizePriority(formData.get('priority'), 'medium'),
      isActive: formData.get('isActive') === 'on',
      startDate: (formData.get('startDate') as string) ?? undefined,
      endDate: (formData.get('endDate') as string) ?? undefined,
      headingColor: (formData.get('headingColor') as string) ?? undefined,
      subheadingColor: (formData.get('subheadingColor') as string) ?? undefined,
    });

    return NextResponse.redirect(new URL('/de/admin/newsticker', request.url));
  }

  if (method === 'DELETE') {
    await deleteNewstickerItem(id);
    return NextResponse.redirect(new URL('/de/admin/newsticker', request.url));
  }

  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteNewstickerItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting newsticker item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete newsticker item' },
      { status: 500 }
    );
  }
}
