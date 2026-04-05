import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get('limit') || '20');
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;
  const type = searchParams.get('type') || undefined;
  const status = searchParams.get('status') || undefined;

  try {
    const jobs = await prisma.aiJob.findMany({
      where: {
        ...(type ? { type: type as never } : {}),
        ...(status ? { status: status as never } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        status: true,
        entityType: true,
        entityId: true,
        locale: true,
        input: true,
        output: true,
        error: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      jobs,
      count: jobs.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch AI jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI jobs' },
      { status: 500 }
    );
  }
}
