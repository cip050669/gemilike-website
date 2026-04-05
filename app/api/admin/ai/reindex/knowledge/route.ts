import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { reindexKnowledgeEmbeddings } from '@/lib/services/ai/reindex.service';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let ids: string[] | undefined;
  let locale = 'de';

  try {
    const body = await request.json();
    ids = Array.isArray(body.ids)
      ? body.ids.filter(
          (value: unknown): value is string =>
            typeof value === 'string' && value.trim().length > 0
        )
      : undefined;
    if (typeof body.locale === 'string' && body.locale.trim()) {
      locale = body.locale.trim();
    }
  } catch {
    // use defaults
  }

  try {
    const result = await reindexKnowledgeEmbeddings({ ids, locale });
    return NextResponse.json({
      status: 'completed',
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to reindex knowledge embeddings:', error);
    return NextResponse.json(
      { error: 'Failed to reindex knowledge embeddings' },
      { status: 500 }
    );
  }
}
