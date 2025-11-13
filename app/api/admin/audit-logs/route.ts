import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting audit logs API request...');
    
    // Authentifizierung ist IMMER erforderlich, auch in Development
    const { userId: currentUserId } = await getSessionWithUser();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('📊 Fetching audit logs from database...');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const actorId = searchParams.get('userId') || searchParams.get('actorId');
    const entityType = searchParams.get('entityType') || searchParams.get('entity');

    console.log('🔍 Query parameters:', { page, limit, action, actorId, entityType });

    const where: Partial<{ action: string; actorId: string; entity: string }> = {};
      
    if (action) {
      where.action = action;
    }
    
    if (actorId) {
      where.actorId = actorId;
    }
    
    if (entityType) {
      where.entity = entityType;
    }

    console.log('🔍 Prisma where clause:', where);

    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log('📋 Found audit logs:', auditLogs.length);

    // Transform data for frontend
    const transformedLogs = auditLogs.map(log => ({
      id: log.id,
      userId: log.actorId,
      userName: log.actor?.name || 'Unbekannt',
      action: log.action,
      entityType: log.entity,
      entityId: log.entityId,
      details: log.metadata,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
    }));

    console.log('✅ Returning transformed logs:', transformedLogs.length);
    
    return NextResponse.json(transformedLogs);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ Error fetching audit logs:', err);
    console.error('❌ Error details:', err.message);
    console.error('❌ Error stack:', err.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
