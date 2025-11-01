import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/orders/route';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';
import { createOrder, listOrders } from '@/lib/services/shop/order.service';
import { createMockOrder } from '../utils/mock-data.helper';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    customer: {
      findUnique: jest.fn(),
    },
    coupon: {
      update: jest.fn(),
    },
  },
}));

jest.mock('@/lib/session', () => ({
  getSessionWithUser: jest.fn(),
}));

jest.mock('@/lib/services/shop/order.service', () => ({
  createOrder: jest.fn(),
  listOrders: jest.fn(),
}));

jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      json: jest.fn((body, init) => ({
        status: init?.status ?? 200,
        json: async () => body,
        text: async () => JSON.stringify(body),
        ok: (init?.status ?? 200) >= 200 && (init?.status ?? 200) < 300,
        headers: new Headers(),
      })),
    },
  };
});

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedGetSession = getSessionWithUser as jest.MockedFunction<typeof getSessionWithUser>;
const mockedCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>;
const mockedListOrders = listOrders as jest.MockedFunction<typeof listOrders>;

describe('Orders API Routes', () => {
  const mockUserId = 'test-user-id';
  const mockCustomerId = 'customer-1';

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetSession.mockResolvedValue({ session: null, userId: mockUserId });
    mockedPrisma.customer.findUnique.mockResolvedValue({ id: mockCustomerId } as any);
  });

  describe('POST /api/orders', () => {
    const baseOrderPayload = {
      items: [
        { gemstoneId: 'gem-1', quantity: 2, price: 100, notes: 'gift' },
        { gemstoneId: 'gem-2', quantity: 1, price: 250 },
      ],
      billingAddressId: 'addr-1',
      shippingAddressId: 'addr-2',
      paymentMethod: 'credit_card',
      subtotal: 450,
      shipping: 5,
      tax: 85.5,
      total: 540.5,
      notes: 'Bitte als Geschenk verpacken',
    };

    it('creates an order successfully', async () => {
      const mockOrder = createMockOrder({ id: 'order-1' }) as any;
      mockedCreateOrder.mockResolvedValue(mockOrder);

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(baseOrderPayload),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockOrder);
      expect(mockedCreateOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: mockCustomerId,
          subtotal: baseOrderPayload.subtotal,
          taxAmount: baseOrderPayload.tax,
          shippingAmount: baseOrderPayload.shipping,
          total: baseOrderPayload.total,
          paymentMethod: 'CREDIT_CARD',
          notes: baseOrderPayload.notes,
          billingAddressId: baseOrderPayload.billingAddressId,
          shippingAddressId: baseOrderPayload.shippingAddressId,
        })
      );
    });

    it('normalizes shipping address when not provided', async () => {
      const mockOrder = createMockOrder({ id: 'order-2' }) as any;
      mockedCreateOrder.mockResolvedValue(mockOrder);
      const payload = { ...baseOrderPayload, shippingAddressId: undefined };

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      expect(mockedCreateOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          shippingAddressId: payload.billingAddressId,
        })
      );
    });

    it('updates coupon usage when couponCode present', async () => {
      const mockOrder = createMockOrder({ id: 'order-3' }) as any;
      mockedCreateOrder.mockResolvedValue(mockOrder);

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...baseOrderPayload,
          couponCode: 'TEST10',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      expect(mockedPrisma.coupon.update).toHaveBeenCalledWith({
        where: { code: 'TEST10' },
        data: { usedCount: { increment: 1 } },
      });
    });

    it('returns 401 when user not authenticated', async () => {
      mockedGetSession.mockResolvedValue({ session: null, userId: undefined });

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(baseOrderPayload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
      expect(mockedCreateOrder).not.toHaveBeenCalled();
    });

    it('returns 404 when customer not found', async () => {
      mockedPrisma.customer.findUnique.mockResolvedValueOnce(null as any);

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(baseOrderPayload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Customer not found');
      expect(mockedCreateOrder).not.toHaveBeenCalled();
    });

    it('returns 500 when order creation fails', async () => {
      mockedCreateOrder.mockRejectedValueOnce(new Error('db error'));

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(baseOrderPayload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('GET /api/orders', () => {
    it('returns orders for authenticated user', async () => {
      const mockOrders = [createMockOrder({ id: 'order-1' })];
      mockedListOrders.mockResolvedValue(mockOrders as any);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockOrders);
      expect(mockedListOrders).toHaveBeenCalledWith({
        filters: { customerId: mockCustomerId },
      });
    });

    it('returns 401 for unauthenticated users', async () => {
      mockedGetSession.mockResolvedValueOnce({ session: null, userId: undefined });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
      expect(mockedListOrders).not.toHaveBeenCalled();
    });

    it('returns 404 when customer is missing', async () => {
      mockedPrisma.customer.findUnique.mockResolvedValueOnce(null as any);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Customer not found');
      expect(mockedListOrders).not.toHaveBeenCalled();
    });

    it('returns 500 when listing orders fails', async () => {
      mockedListOrders.mockRejectedValueOnce(new Error('db error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
