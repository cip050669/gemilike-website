import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInvoiceData() {
  console.log('🌱 Seeding invoice data...');

  try {
    // Create sample customers
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          customerNumber: 'K-001',
          company: 'Musterfirma GmbH',
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max.mustermann@musterfirma.de',
          phone: '+49 123 456789',
          address: 'Musterstraße 123',
          postalCode: '12345',
          city: 'Musterstadt',
          country: 'Deutschland',
          taxId: '12/345/67890',
          notes: 'Wichtiger Kunde, bevorzugte Zahlungsweise: Überweisung',
          isActive: true
        }
      }),
      prisma.customer.create({
        data: {
          customerNumber: 'K-002',
          firstName: 'Anna',
          lastName: 'Schmidt',
          email: 'anna.schmidt@email.de',
          phone: '+49 987 654321',
          address: 'Beispielweg 456',
          postalCode: '54321',
          city: 'Beispielstadt',
          country: 'Deutschland',
          notes: 'Privatkunde, interessiert an Edelsteinen',
          isActive: true
        }
      }),
      prisma.customer.create({
        data: {
          customerNumber: 'K-003',
          company: 'Edelstein-Handel AG',
          firstName: 'Peter',
          lastName: 'Weber',
          email: 'p.weber@edelstein-handel.de',
          phone: '+49 555 123456',
          address: 'Geschäftsstraße 789',
          postalCode: '98765',
          city: 'Handelsstadt',
          country: 'Deutschland',
          taxId: '98/765/43210',
          notes: 'Großhändler, regelmäßige Bestellungen',
          isActive: true
        }
      })
    ]);

    console.log(`✅ Created ${customers.length} customers`);

    // Create bank accounts
    const bankAccounts = await Promise.all([
      prisma.bankAccount.create({
        data: {
          name: 'Hauptkonto',
          bankName: 'Deutsche Bank',
          iban: 'DE89370400440532013000',
          bic: 'DEUTDEFF',
          accountHolder: 'Gemilike Inhaber',
          isDefault: true,
          isActive: true
        }
      }),
      prisma.bankAccount.create({
        data: {
          name: 'Geschäftskonto',
          bankName: 'Commerzbank',
          iban: 'DE12500105170648489890',
          bic: 'COBADEFFXXX',
          accountHolder: 'Gemilike Inhaber',
          isDefault: false,
          isActive: true
        }
      })
    ]);

    console.log(`✅ Created ${bankAccounts.length} bank accounts`);

    // Create sample invoices
    const invoices = await Promise.all([
      prisma.invoice.create({
        data: {
          invoiceNumber: 'RE-2024-001',
          customerId: customers[0].id,
          invoiceDate: new Date('2024-01-15'),
          dueDate: new Date('2024-01-29'),
          status: 'SENT',
          paymentStatus: 'PAID',
          paymentDate: new Date('2024-01-28'),
          subtotal: 1250.00,
          total: 1250.00,
          currency: 'EUR',
          notes: 'Vielen Dank für Ihren Einkauf!',
          bankAccountId: bankAccounts[0].id,
          items: {
            create: [
              {
                description: 'Smaragd Ring 18k Gold',
                quantity: 1,
                unitPrice: 800.00,
                total: 800.00,
                order: 1
              },
              {
                description: 'Diamant Ohrringe',
                quantity: 1,
                unitPrice: 450.00,
                total: 450.00,
                order: 2
              }
            ]
          }
        }
      }),
      prisma.invoice.create({
        data: {
          invoiceNumber: 'RE-2024-002',
          customerId: customers[1].id,
          invoiceDate: new Date('2024-02-01'),
          dueDate: new Date('2024-02-15'),
          status: 'SENT',
          paymentStatus: 'UNPAID',
          subtotal: 320.00,
          total: 320.00,
          currency: 'EUR',
          notes: 'Bitte überweisen Sie den Betrag bis zum Fälligkeitsdatum.',
          bankAccountId: bankAccounts[0].id,
          items: {
            create: [
              {
                description: 'Rubin Anhänger',
                quantity: 1,
                unitPrice: 320.00,
                total: 320.00,
                order: 1
              }
            ]
          }
        }
      }),
      prisma.invoice.create({
        data: {
          invoiceNumber: 'RE-2024-003',
          customerId: customers[2].id,
          invoiceDate: new Date('2024-01-20'),
          dueDate: new Date('2024-02-03'),
          status: 'OVERDUE',
          paymentStatus: 'UNPAID',
          subtotal: 2500.00,
          total: 2500.00,
          currency: 'EUR',
          notes: 'Überfällige Rechnung - bitte umgehend begleichen.',
          bankAccountId: bankAccounts[0].id,
          reminderCount: 1,
          lastReminderDate: new Date('2024-02-10'),
          items: {
            create: [
              {
                description: 'Saphir Set (Ring + Ohrringe)',
                quantity: 1,
                unitPrice: 1800.00,
                total: 1800.00,
                order: 1
              },
              {
                description: 'Perlenkette',
                quantity: 1,
                unitPrice: 700.00,
                total: 700.00,
                order: 2
              }
            ]
          }
        }
      }),
      prisma.invoice.create({
        data: {
          invoiceNumber: 'RE-2024-004',
          customerId: customers[0].id,
          invoiceDate: new Date('2024-02-15'),
          dueDate: new Date('2024-03-01'),
          status: 'DRAFT',
          paymentStatus: 'UNPAID',
          subtotal: 750.00,
          total: 750.00,
          currency: 'EUR',
          notes: 'Entwurf - noch nicht versendet',
          bankAccountId: bankAccounts[0].id,
          items: {
            create: [
              {
                description: 'Amethyst Armband',
                quantity: 1,
                unitPrice: 450.00,
                total: 450.00,
                order: 1
              },
              {
                description: 'Topas Ring',
                quantity: 1,
                unitPrice: 300.00,
                total: 300.00,
                order: 2
              }
            ]
          }
        }
      })
    ]);

    console.log(`✅ Created ${invoices.length} invoices`);

    // Update company settings if they exist
    const existingSettings = await prisma.companySettings.findFirst();
    if (existingSettings) {
      await prisma.companySettings.update({
        where: { id: existingSettings.id },
        data: {
          nextInvoiceNumber: 5 // Next invoice will be RE-2024-005
        }
      });
      console.log('✅ Updated company settings with next invoice number');
    }

    console.log('🎉 Invoice data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${customers.length} customers created`);
    console.log(`- ${bankAccounts.length} bank accounts created`);
    console.log(`- ${invoices.length} invoices created`);
    console.log('\n💡 You can now test the invoice system at:');
    console.log('- http://localhost:3003/de/admin/rechnungen');
    console.log('- http://localhost:3003/de/admin/kunden');

  } catch (error) {
    console.error('❌ Error seeding invoice data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedInvoiceData()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

