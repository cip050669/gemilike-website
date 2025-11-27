import { NextRequest, NextResponse } from 'next/server';
import type { NewstickerItem } from '@/lib/types/newsticker';
import type { NewstickerInput } from '@/lib/services/newsticker.service';
import {
  getNewstickerItems,
  createNewstickerItem,
  updateNewstickerItem,
  deleteNewstickerItem,
} from '@/lib/services/newsticker.service';

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

const parseBody = async (request: NextRequest): Promise<NewstickerInput & { isActive?: boolean }> => {
  const contentType = request.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return (await request.json()) as NewstickerInput;
  }

  const formData = await request.formData();
  return {
    text: (formData.get('text') as string) ?? '',
    type: (formData.get('type') as string) ?? undefined,
    priority: (formData.get('priority') as string) ?? undefined,
    link: (formData.get('link') as string) ?? undefined,
    linkText: (formData.get('linkText') as string) ?? undefined,
    isActive: formData.get('isActive') ? true : false,
    startDate: (formData.get('startDate') as string) ?? undefined,
    endDate: (formData.get('endDate') as string) ?? undefined,
    order: formData.get('order') ? Number(formData.get('order')) : undefined,
    headingColor: (formData.get('headingColor') as string) ?? undefined,
    subheadingColor: (formData.get('subheadingColor') as string) ?? undefined,
  };
};

export async function GET() {
  const items = await getNewstickerItems(false);
  return NextResponse.json({ success: true, items });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await parseBody(request);

    if (typeof payload.text !== 'string' || !payload.text.trim()) {
      return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
    }

    const item = await createNewstickerItem({
      text: payload.text.trim(),
      type: normalizeType(payload.type, 'info'),
      priority: normalizePriority(payload.priority, 'medium'),
      link: payload.link ?? null,
      linkText: payload.linkText ?? null,
      isActive: payload.isActive ?? true,
      startDate: payload.startDate ?? null,
      endDate: payload.endDate ?? null,
      order: payload.order ?? 0,
      headingColor: payload.headingColor ?? null,
      subheadingColor: payload.subheadingColor ?? null,
    });

    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.redirect(new URL('/de/admin/newsticker', request.url));
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error creating newsticker item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create newsticker item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = (await request.json()) as NewstickerInput & { id?: string };
    if (!payload.id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const item = await updateNewstickerItem(payload.id, {
      ...payload,
      text: payload.text,
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

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
