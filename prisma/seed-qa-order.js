/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Seeding QA order data…');

  const user = await prisma.user.upsert({
    where: { email: 'qa.customer@gemilike.com' },
    update: {
      name: 'QA Kunde',
      phone: '+49 30 1234567',
    },
    create: {
      id: 'user-qa-0001',
      email: 'qa.customer@gemilike.com',
      name: 'QA Kunde',
      phone: '+49 30 1234567',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const billingAddress = await prisma.address.upsert({
    where: { id: 'addr-qa-billing' },
    update: {
      firstName: 'QA',
      lastName: 'Kunde',
      company: 'Gemilike QA GmbH',
      address1: 'Musterstraße 1',
      address2: '2. OG',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Deutschland',
      phone: '+49 30 1234567',
      updatedAt: new Date(),
    },
    create: {
      id: 'addr-qa-billing',
      userId: user.id,
      type: 'billing',
      firstName: 'QA',
      lastName: 'Kunde',
      company: 'Gemilike QA GmbH',
      address1: 'Musterstraße 1',
      address2: '2. OG',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Deutschland',
      phone: '+49 30 1234567',
      state: 'Berlin',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const shippingAddress = await prisma.address.upsert({
    where: { id: 'addr-qa-shipping' },
    update: {
      firstName: 'QA',
      lastName: 'Kunde',
      address1: 'Versandweg 5',
      city: 'Potsdam',
      postalCode: '14467',
      country: 'Deutschland',
      phone: '+49 331 987654',
      updatedAt: new Date(),
    },
    create: {
      id: 'addr-qa-shipping',
      userId: user.id,
      type: 'shipping',
      firstName: 'QA',
      lastName: 'Kunde',
      address1: 'Versandweg 5',
      city: 'Potsdam',
      postalCode: '14467',
      country: 'Deutschland',
      phone: '+49 331 987654',
      state: 'Brandenburg',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const customer = await prisma.customer.upsert({
    where: { customerNumber: 'CUST-QA-0001' },
    update: {
      firstName: 'QA',
      lastName: 'Kunde',
      company: 'Gemilike QA GmbH',
      email: 'qa.customer@gemilike.com',
      phone: '+49 30 1234567',
      address: `${billingAddress.address1}, ${billingAddress.postalCode} ${billingAddress.city}`,
      city: billingAddress.city,
      postalCode: billingAddress.postalCode,
      country: billingAddress.country,
      updatedAt: new Date(),
    },
    create: {
      id: 'customer-qa-0001',
      customerNumber: 'CUST-QA-0001',
      firstName: 'QA',
      lastName: 'Kunde',
      company: 'Gemilike QA GmbH',
      email: 'qa.customer@gemilike.com',
      phone: '+49 30 1234567',
      address: `${billingAddress.address1}, ${billingAddress.postalCode} ${billingAddress.city}`,
      city: billingAddress.city,
      postalCode: billingAddress.postalCode,
      country: billingAddress.country,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const gemstone = await prisma.gemstone.upsert({
    where: { id: 'gem-qa-0001' },
    update: {
      price: 499,
      description: 'QA Smaragd für Rechnungs-Tests',
      stock: 3,
      inStock: true,
    },
    create: {
      id: 'gem-qa-0001',
      name: 'QA Smaragd',
      category: 'Edelstein',
      type: 'Emerald',
      price: 499,
      weight: 1.25,
      dimensions: '8 x 6 mm',
      color: 'Grün',
      clarity: 'VS',
      treatment: 'Unbehandelt',
      rarity: 'Selten',
      description: 'QA Smaragd für Rechnungs-Tests',
      images: JSON.stringify(['/images/gems/qa-emerald.jpg']),
      inStock: true,
      stock: 3,
      sku: 'QA-EMERALD-0001',
      isNew: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.order.deleteMany({
    where: { orderNumber: 'QA-ORDER-1001' },
  });

  const order = await prisma.order.create({
    data: {
      id: 'order-qa-1001',
      orderNumber: 'QA-ORDER-1001',
      userId: user.id,
      status: 'PENDING',
      subtotal: 499,
      tax: 0,
      shipping: 0,
      total: 499,
      currency: 'EUR',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'PENDING',
      shippingMethod: 'standard',
      notes: 'Automatisch angelegte QA-Bestellung.',
      billingAddressId: billingAddress.id,
      shippingAddressId: shippingAddress.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.orderItem.create({
    data: {
      id: 'order-item-qa-1001',
      orderId: order.id,
      gemstoneId: gemstone.id,
      quantity: 1,
      price: gemstone.price,
      total: gemstone.price,
      notes: 'QA Testposition',
    },
  });

  await prisma.invoice.deleteMany({
    where: { orderId: order.id },
  });

  console.log('✅ QA order seeded successfully.');
  console.log('   - Order number: QA-ORDER-1001');
  console.log('   - Customer email: qa.customer@gemilike.com');
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error('❌ Error seeding QA order:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { main };
