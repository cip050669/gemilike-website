import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');

    // Prüfe ob Admin-Benutzer bereits existiert
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@gemilike.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Erstelle Admin-Benutzer
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@gemilike.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
      }
    });

    console.log('✅ Admin user created successfully:');
    console.log('📧 Email: admin@gemilike.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('🆔 ID:', adminUser.id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Führe das Skript aus
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('🎉 Admin user setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin user setup failed:', error);
      process.exit(1);
    });
}

export { createAdminUser };
