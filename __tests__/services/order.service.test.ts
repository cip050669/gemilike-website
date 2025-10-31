import { Prisma } from '@prisma/client';

jest.mock('@/lib/prisma', () => ({
  prisma: {},
}));

import { serializeOrder, type OrderWithRelations } from '@/lib/services/shop/order.service';

const buildDecimal = (value: number) => new Prisma.Decimal(value);

const createMockOrder = (): OrderWithRelations => {
  const now = new Date('2024-01-01T12:00:00Z');
  return {
    id: 'order_1',
    orderNumber: 'GM-ORDER-1',
    customerId: 'customer_1',
    cartId: null,
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    paymentMethod: null,
    subtotal: buildDecimal(100),
    taxAmount: buildDecimal(19),
    shippingAmount: buildDecimal(5),
    total: buildDecimal(124),
    currency: 'EUR',
    notes: 'Test order',
    placedAt: null,
    paidAt: null,
    canceledAt: null,
    createdAt: now,
    updatedAt: now,
    customer: {
      id: 'customer_1',
      firstName: 'Anna',
      lastName: 'Stein',
      email: 'anna@example.com',
      phone: '+491234567',
    },
    billingAddress: {
      id: 'address_1',
      customerId: 'customer_1',
      company: 'Gemilike GmbH',
      salutation: 'Ms.',
      firstName: 'Anna',
      lastName: 'Stein',
      street: 'Musterstraße 1',
      street2: '3. OG',
      postalCode: '12345',
      city: 'Berlin',
      state: null,
      country: 'DE',
      phone: '+491234567',
      type: 'BILLING',
      isDefault: false,
      createdAt: now,
      updatedAt: now,
      billingCustomerId: null,
      shippingCustomerId: null,
    } as unknown as OrderWithRelations['billingAddress'],
    shippingAddress: {
      id: 'address_2',
      customerId: 'customer_1',
      company: null,
      salutation: 'Ms.',
      firstName: 'Anna',
      lastName: 'Stein',
      street: 'Liefergasse 5',
      street2: null,
      postalCode: '54321',
      city: 'Hamburg',
      state: null,
      country: 'DE',
      phone: '+491234567',
      type: 'SHIPPING',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      billingCustomerId: null,
      shippingCustomerId: null,
    } as unknown as OrderWithRelations['shippingAddress'],
    items: [
      {
        id: 'item_1',
        orderId: 'order_1',
        gemstoneId: null,
        quantity: 2,
        unitPrice: buildDecimal(50),
        unitNet: buildDecimal(50),
        unitTax: buildDecimal(0),
        weightSnapshot: null,
        attributesSnapshot: null,
        description: 'Test Edelstein',
        createdAt: now,
        updatedAt: now,
        gemstone: null,
        reviews: [],
      },
    ],
    downloadGrants: [],
    invoice: null,
  } as unknown as OrderWithRelations;
};

describe('order.service serializeOrder', () => {
  it('normalizes decimal fields, addresses and items', () => {
    const mockOrder = createMockOrder();

    const result = serializeOrder(mockOrder);

    expect(result.subtotal).toBe(100);
    expect(result.taxAmount).toBe(19);
    expect(result.shippingAmount).toBe(5);
    expect(result.total).toBe(124);

    expect(result.billingAddress?.address1).toBe('Musterstraße 1');
    expect(result.billingAddress?.address2).toBe('3. OG');
    expect(result.billingAddress?.street).toBe('Musterstraße 1');

    expect(result.shippingAddress?.address1).toBe('Liefergasse 5');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].price).toBe(50);
    expect(result.items[0].totalPrice).toBe(100);
    expect(result.items[0].name).toBe('Test Edelstein');
  });

  it('falls back to safe defaults when optional relations are missing', () => {
    const mockOrder = createMockOrder();
    mockOrder.customer = null;
    mockOrder.billingAddress = null;
    mockOrder.items[0].description = null;

    const result = serializeOrder(mockOrder);

    expect(result.customer).toBeNull();
    expect(result.billingAddress).toBeNull();
    expect(result.items[0].name).toBe('Edelstein');
  });
});
