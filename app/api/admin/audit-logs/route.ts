import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { PrismaClient } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting audit logs API request...');
    
    // Temporäre Lösung für Entwicklung - in Produktion sollte Authentifizierung aktiviert werden
    const { userId: currentUserId } = await getSessionWithUser();
    
    // Für Entwicklung: Erlaube Zugriff ohne Authentifizierung
    if (process.env.NODE_ENV === 'development') {
      console.log('🔓 Development mode: Skipping authentication for audit logs');
    } else {
      if (!currentUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user is admin
      const { prisma } = await import('@/lib/prisma');
      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true }
      });

      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    console.log('📊 Fetching audit logs from database...');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const entityType = searchParams.get('entityType');

    console.log('🔍 Query parameters:', { page, limit, action, userId, entityType });

    // Erstelle neue Prisma-Instanz
    const prisma = new PrismaClient();
    
    try {
      // Direkte Prisma-Abfrage
      const where: Partial<{ action: string; userId: string; entityType: string }> = {};
      
      if (action) {
        where.action = action;
      }
      
      if (userId) {
        where.userId = userId;
      }
      
      if (entityType) {
        where.entityType = entityType;
      }

      console.log('🔍 Prisma where clause:', where);

      const auditLogs = await prisma.auditLog.findMany({
        where,
        include: {
          user: {
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
        userId: log.userId,
        userName: log.user?.name || 'Unbekannt',
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        details: log.details ? JSON.parse(log.details) : null,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt,
      }));

      console.log('✅ Returning transformed logs:', transformedLogs.length);
      
      return NextResponse.json(transformedLogs);
    } finally {
      // Schließe Prisma-Verbindung
      await prisma.$disconnect();
    }
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
