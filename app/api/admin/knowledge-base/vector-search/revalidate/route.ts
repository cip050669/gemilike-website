import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  invalidateKnowledgeVectorCache,
  rebuildKnowledgeVectorCache,
} from '@/lib/services/knowledge.service';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let locale = 'de';
  let action: 'rebuild' | 'invalidate' = 'rebuild';

  try {
    const body = await request.json();
    if (typeof body.locale === 'string' && body.locale.trim()) {
      locale = body.locale.trim();
    }
    if (body.action === 'invalidate') {
      action = 'invalidate';
    }
  } catch {
    // Ignore JSON parsing errors and use defaults
  }

  try {
    if (action === 'invalidate') {
      invalidateKnowledgeVectorCache(locale);
      return NextResponse.json({
        status: 'invalidated',
        locale,
        timestamp: new Date().toISOString(),
      });
    }

    const result = await rebuildKnowledgeVectorCache(locale);
    return NextResponse.json({
      status: 'rebuilt',
      ...result,
    });
  } catch (error) {
    console.error('Failed to rebuild knowledge vector cache:', error);
    return NextResponse.json(
      { error: 'Failed to rebuild knowledge vector cache' },
      { status: 500 }
    );
  }
}

