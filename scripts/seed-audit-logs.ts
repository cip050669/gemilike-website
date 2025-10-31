import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAuditLogs() {
  try {
    console.log('🌱 Seeding audit logs...');

    // Erstelle Admin-Benutzer falls nicht vorhanden
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@gemilike.com' },
      update: {},
      create: {
        email: 'admin@gemilike.com',
        name: 'Admin User',
        role: 'ADMIN',
      },
    });

    const managerUser = await prisma.user.upsert({
      where: { email: 'manager@gemilike.com' },
      update: {},
      create: {
        email: 'manager@gemilike.com',
        name: 'Manager User',
        role: 'ADMIN',
      },
    });

    // Lösche bestehende Audit-Logs
    await prisma.auditLog.deleteMany({});

    // Erstelle Beispieldaten für Audit-Logs
    const auditLogs = [
      {
        actorId: adminUser.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: adminUser.id,
        metadata: { loginTime: new Date().toISOString() },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        actorId: adminUser.id,
        action: 'CREATE',
        entity: 'Gemstone',
        entityId: 'EMERALD-001',
        metadata: { name: 'Smaragd 001', price: 1250, category: 'Emerald' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        actorId: adminUser.id,
        action: 'UPDATE',
        entity: 'Gemstone',
        entityId: 'RUBY-002',
        metadata: { price: 890, previousPrice: 750 },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
      {
        actorId: managerUser.id,
        action: 'DELETE',
        entity: 'Gemstone',
        entityId: 'SAPPHIRE-003',
        metadata: { name: 'Saphir 003', reason: 'Defekt' },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      },
      {
        actorId: adminUser.id,
        action: 'VIEW',
        entity: 'Order',
        entityId: 'ORD-001',
        metadata: { customer: 'Max Mustermann', total: 1250 },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      },
      {
        actorId: managerUser.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: managerUser.id,
        metadata: { loginTime: new Date().toISOString() },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      },
      {
        actorId: adminUser.id,
        action: 'CREATE',
        entity: 'Gemstone',
        entityId: 'DIAMOND-004',
        metadata: { name: 'Diamant 004', price: 2100, category: 'Diamond' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        actorId: adminUser.id,
        action: 'UPDATE',
        entity: 'Gemstone',
        entityId: 'EMERALD-001',
        metadata: { description: 'Updated description', previousDescription: 'Old description' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      },
      {
        actorId: managerUser.id,
        action: 'VIEW',
        entity: 'Report',
        entityId: 'SALES-REPORT-2025-01',
        metadata: { reportType: 'Sales', period: 'January 2025' },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      },
      {
        actorId: adminUser.id,
        action: 'LOGOUT',
        entity: 'User',
        entityId: adminUser.id,
        metadata: { logoutTime: new Date().toISOString() },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      },
    ];

    // Erstelle Audit-Logs in der Datenbank
    for (const auditLog of auditLogs) {
      await prisma.auditLog.create({
        data: auditLog,
      });
    }

    console.log(`✅ Created ${auditLogs.length} audit log entries`);
    console.log('📋 Audit logs seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding audit logs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Führe das Skript aus
if (require.main === module) {
  seedAuditLogs()
    .then(() => {
      console.log('🎉 Audit log seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Audit log seeding failed:', error);
      process.exit(1);
    });
}

export { seedAuditLogs };
