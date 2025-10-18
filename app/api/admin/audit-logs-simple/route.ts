import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/simple-auth';

export async function GET(request: NextRequest) {
  try {
    // Temporär deaktiviert für Entwicklung
    // TODO: Reaktivieren wenn Server-Session funktioniert
    /*
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */
    
    // Mock-Daten für Tests
    const mockAuditLogs = [
      {
        id: 'AUDIT-001',
        userId: 'admin-001',
        userName: 'Admin User',
        action: 'LOGIN',
        entityType: 'User',
        entityId: 'admin-001',
        details: { loginTime: new Date().toISOString() },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: 'AUDIT-002',
        userId: 'admin-001',
        userName: 'Admin User',
        action: 'CREATE',
        entityType: 'Gemstone',
        entityId: 'EMERALD-001',
        details: { name: 'Smaragd 001', price: 1250, category: 'Emerald' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: 'AUDIT-003',
        userId: 'admin-002',
        userName: 'Manager User',
        action: 'UPDATE',
        entityType: 'Gemstone',
        entityId: 'RUBY-002',
        details: { price: 890, previousPrice: 750 },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      },
      {
        id: 'AUDIT-004',
        userId: 'admin-002',
        userName: 'Manager User',
        action: 'DELETE',
        entityType: 'Gemstone',
        entityId: 'SAPPHIRE-003',
        details: { name: 'Saphir 003', reason: 'Defekt' },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      },
      {
        id: 'AUDIT-005',
        userId: 'admin-001',
        userName: 'Admin User',
        action: 'VIEW',
        entityType: 'Order',
        entityId: 'ORD-001',
        details: { customer: 'Max Mustermann', total: 1250 },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      },
    ];

    return NextResponse.json(mockAuditLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
