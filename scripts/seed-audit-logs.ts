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
        role: 'admin',
      },
    });

    const managerUser = await prisma.user.upsert({
      where: { email: 'manager@gemilike.com' },
      update: {},
      create: {
        email: 'manager@gemilike.com',
        name: 'Manager User',
        role: 'admin',
      },
    });

    // Lösche bestehende Audit-Logs
    await prisma.auditLog.deleteMany({});

    // Erstelle Beispieldaten für Audit-Logs
    const auditLogs = [
      {
        userId: adminUser.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: adminUser.id,
        details: JSON.stringify({ loginTime: new Date().toISOString() }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        userId: adminUser.id,
        action: 'CREATE',
        entityType: 'Gemstone',
        entityId: 'EMERALD-001',
        details: JSON.stringify({ name: 'Smaragd 001', price: 1250, category: 'Emerald' }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        userId: adminUser.id,
        action: 'UPDATE',
        entityType: 'Gemstone',
        entityId: 'RUBY-002',
        details: JSON.stringify({ price: 890, previousPrice: 750 }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
      {
        userId: managerUser.id,
        action: 'DELETE',
        entityType: 'Gemstone',
        entityId: 'SAPPHIRE-003',
        details: JSON.stringify({ name: 'Saphir 003', reason: 'Defekt' }),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      },
      {
        userId: adminUser.id,
        action: 'VIEW',
        entityType: 'Order',
        entityId: 'ORD-001',
        details: JSON.stringify({ customer: 'Max Mustermann', total: 1250 }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      },
      {
        userId: managerUser.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: managerUser.id,
        details: JSON.stringify({ loginTime: new Date().toISOString() }),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      },
      {
        userId: adminUser.id,
        action: 'CREATE',
        entityType: 'Gemstone',
        entityId: 'DIAMOND-004',
        details: JSON.stringify({ name: 'Diamant 004', price: 2100, category: 'Diamond' }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        userId: adminUser.id,
        action: 'UPDATE',
        entityType: 'Gemstone',
        entityId: 'EMERALD-001',
        details: JSON.stringify({ description: 'Updated description', previousDescription: 'Old description' }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      },
      {
        userId: managerUser.id,
        action: 'VIEW',
        entityType: 'Report',
        entityId: 'SALES-REPORT-2025-01',
        details: JSON.stringify({ reportType: 'Sales', period: 'January 2025' }),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      },
      {
        userId: adminUser.id,
        action: 'LOGOUT',
        entityType: 'User',
        entityId: adminUser.id,
        details: JSON.stringify({ logoutTime: new Date().toISOString() }),
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
