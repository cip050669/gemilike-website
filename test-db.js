const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test if we can create a FooterData record
    const testData = await prisma.footerData.upsert({
      where: { id: 'test' },
      update: {
        companyName: 'Test Company',
        phone: '+49 999 888 777',
        email: 'test@example.com',
        copyright: '© 2025 Test Company'
      },
      create: {
        id: 'test',
        companyName: 'Test Company',
        phone: '+49 999 888 777',
        email: 'test@example.com',
        copyright: '© 2025 Test Company'
      }
    });
    
    console.log('✅ Test data created:', testData);
    
    // Test if we can read it back
    const readData = await prisma.footerData.findUnique({
      where: { id: 'test' }
    });
    
    console.log('✅ Test data read back:', readData);
    
    // Clean up
    await prisma.footerData.delete({
      where: { id: 'test' }
    });
    
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();

