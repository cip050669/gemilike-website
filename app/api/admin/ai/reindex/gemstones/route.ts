import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { reindexGemstoneEmbeddings } from '@/lib/services/ai/reindex.service';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let ids: string[] | undefined;
  let locale: string | undefined;

  try {
    const body = await request.json();
    ids = Array.isArray(body.ids)
      ? body.ids.filter(
          (value: unknown): value is string =>
            typeof value === 'string' && value.trim().length > 0
        )
      : undefined;
    locale =
      typeof body.locale === 'string' && body.locale.trim() ? body.locale.trim() : undefined;
  } catch {
    // use defaults
  }

  try {
    const result = await reindexGemstoneEmbeddings({ ids, locale });
    return NextResponse.json({
      status: 'completed',
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to reindex gemstone embeddings:', error);
    return NextResponse.json(
      { error: 'Failed to reindex gemstone embeddings' },
      { status: 500 }
    );
  }
}
