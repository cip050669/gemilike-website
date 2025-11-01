import { NextRequest } from 'next/server';
import { GET as GET_ORDER, PUT as PUT_ORDER } from '@/app/api/orders/[id]/route';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';
import { getOrderForCustomer, updateOrder } from '@/lib/services/shop/order.service';
import { createMockOrder } from '../utils/mock-data.helper';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    customer: {
      findUnique: jest.fn(),
    },
    order: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock('@/lib/session', () => ({
  getSessionWithUser: jest.fn(),
}));

jest.mock('@/lib/services/shop/order.service', () => ({
  getOrderForCustomer: jest.fn(),
  updateOrder: jest.fn(),
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
const mockedGetOrderForCustomer = getOrderForCustomer as jest.MockedFunction<typeof getOrderForCustomer>;
const mockedUpdateOrder = updateOrder as jest.MockedFunction<typeof updateOrder>;

describe('Orders Detail API Routes', () => {
  const mockUserId = 'test-user';
  const mockCustomerId = 'customer-1';
  const params = Promise.resolve({ id: 'order-1' });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetSession.mockResolvedValue({ session: null, userId: mockUserId });
    mockedPrisma.customer.findUnique.mockResolvedValue({ id: mockCustomerId } as any);
  });

  describe('GET /api/orders/[id]', () => {
    it('returns order for customer', async () => {
      const mockOrder = createMockOrder({ id: 'order-1' });
      mockedGetOrderForCustomer.mockResolvedValue(mockOrder as any);

      const request = new NextRequest('http://localhost/api/orders/order-1');
      const response = await GET_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockOrder);
      expect(mockedGetOrderForCustomer).toHaveBeenCalledWith('order-1', mockCustomerId);
    });

    it('returns 401 when unauthenticated', async () => {
      mockedGetSession.mockResolvedValueOnce({ session: null, userId: undefined });

      const request = new NextRequest('http://localhost/api/orders/order-1');
      const response = await GET_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 404 when customer missing', async () => {
      mockedPrisma.customer.findUnique.mockResolvedValueOnce(null as any);

      const request = new NextRequest('http://localhost/api/orders/order-1');
      const response = await GET_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Customer not found');
    });

    it('returns 404 when order not found', async () => {
      mockedGetOrderForCustomer.mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost/api/orders/order-1');
      const response = await GET_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Order not found');
    });

    it('returns 500 on service error', async () => {
      mockedGetOrderForCustomer.mockRejectedValueOnce(new Error('db error'));

      const request = new NextRequest('http://localhost/api/orders/order-1');
      const response = await GET_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('PUT /api/orders/[id]', () => {
    const updatePayload = { status: 'CONFIRMED', notes: 'Updated notes' };

    beforeEach(() => {
      mockedPrisma.order.findFirst.mockResolvedValue({ id: 'order-1', customerId: mockCustomerId } as any);
      mockedGetOrderForCustomer.mockResolvedValue(createMockOrder({ id: 'order-1' }) as any);
    });

    it('updates order and returns refreshed entity', async () => {
      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PUT_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockedUpdateOrder).toHaveBeenCalledWith('order-1', {
        status: updatePayload.status,
        notes: updatePayload.notes,
      });
      expect(data.id).toBe('order-1');
    });

    it('returns 401 when unauthenticated', async () => {
      mockedGetSession.mockResolvedValueOnce({ session: null, userId: undefined });

      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });

      const response = await PUT_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 404 when customer missing', async () => {
      mockedPrisma.customer.findUnique.mockResolvedValueOnce(null as any);

      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });

      const response = await PUT_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Customer not found');
    });

    it('returns 404 when order not found', async () => {
      mockedPrisma.order.findFirst.mockResolvedValueOnce(null as any);

      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });

      const response = await PUT_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Order not found');
      expect(mockedUpdateOrder).not.toHaveBeenCalled();
    });

    it('returns 500 when update fails', async () => {
      mockedUpdateOrder.mockRejectedValueOnce(new Error('db error'));

      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });

      const response = await PUT_ORDER(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
