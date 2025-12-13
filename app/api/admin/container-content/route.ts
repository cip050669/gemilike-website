import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getContainerContent, upsertContainerContent } from '@/lib/services/containerContent';

const ALLOWED_KEYS = [
  'home.blog.heading',
  'home.blog.subheading',
  'home.newGemstones.description',
];

const defaultLocale = 'de';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || defaultLocale;
  const keysParam = searchParams.get('keys');
  const keys = keysParam ? keysParam.split(',').filter(Boolean) : ALLOWED_KEYS;

  const items = await getContainerContent(keys, locale);
  return NextResponse.json({ items });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const locale = (body?.locale as string) || defaultLocale;
    const items = (body?.items as Array<Record<string, string>>) || [];

    const sanitized = items
      .filter((item) => ALLOWED_KEYS.includes(item.key))
      .map((item) => ({
        key: item.key,
        locale,
        title: item.title ?? null,
        subtitle: item.subtitle ?? null,
        body: item.body ?? null,
      }));

    if (!sanitized.length) {
      return NextResponse.json(
        { error: 'No valid items provided' },
        { status: 400 }
      );
    }

    await upsertContainerContent(sanitized, locale);
    const updated = await getContainerContent(ALLOWED_KEYS, locale);

    return NextResponse.json({ success: true, items: updated });
  } catch (error) {
    console.error('Error updating container content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
