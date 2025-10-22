import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface AuditLogData {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    const auditLog = await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details:
          typeof data.details === 'string'
            ? data.details
            : data.details != null
            ? JSON.stringify(data.details)
            : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
    
    console.log('📋 Audit log created:', auditLog.id);
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    throw error;
  }
}

type AuditLogFilters = {
  action?: string;
  entityType?: string;
  userId?: string;
  limit?: number;
  offset?: number;
};

export async function getAuditLogs(filters?: AuditLogFilters) {
  try {
    const where: Prisma.AuditLogWhereInput = {};
    
    if (filters?.action) {
      where.action = filters.action;
    }
    
    if (filters?.entityType) {
      where.entityType = filters.entityType;
    }
    
    if (filters?.userId) {
      where.userId = filters.userId;
    }

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
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    return auditLogs.map((log) => {
      let parsedDetails: unknown = null;
      if (log.details) {
        try {
          parsedDetails = JSON.parse(log.details);
        } catch {
          parsedDetails = log.details;
        }
      }

      return {
        id: log.id,
        userId: log.userId,
        userName: log.user?.name || 'Unbekannt',
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        details: parsedDetails,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt,
      };
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
}

// Hilfsfunktionen für häufige Audit-Log-Aktionen
export async function logUserAction(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: unknown,
  request?: Request
) {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   'unknown';
  const userAgent = request?.headers.get('user-agent') || 'unknown';

  return createAuditLog({
    userId,
    action,
    entityType,
    entityId,
    details,
    ipAddress,
    userAgent,
  });
}

export async function logGemstoneAction(
  userId: string,
  action: string,
  gemstoneId: string,
  details?: unknown,
  request?: Request
) {
  return logUserAction(userId, action, 'Gemstone', gemstoneId, details, request);
}

export async function logUserManagement(
  userId: string,
  action: string,
  targetUserId: string,
  details?: unknown,
  request?: Request
) {
  return logUserAction(userId, action, 'User', targetUserId, details, request);
}

export async function logOrderAction(
  userId: string,
  action: string,
  orderId: string,
  details?: unknown,
  request?: Request
) {
  return logUserAction(userId, action, 'Order', orderId, details, request);
}
