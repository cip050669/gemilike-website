/**
 * Orders API Tests
 */

import { POST, GET } from '@/app/api/orders/route'
import { GET as GET_ORDER, PUT as PUT_ORDER } from '@/app/api/orders/[id]/route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionWithUser } from '@/lib/session'
import { createMockOrder, createMockCustomer } from '../utils/mock-data.helper'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    coupon: {
      update: jest.fn(),
    },
  },
}))

jest.mock('@/lib/session', () => ({
  getSessionWithUser: jest.fn(),
}))

// Mock NextResponse
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server')
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      json: jest.fn((body, init) => ({
        status: init?.status || 200,
        json: async () => body,
        text: async () => JSON.stringify(body),
        ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
        headers: new Headers(),
      })),
    },
  }
})

const mockedPrisma = prisma as jest.Mocked<typeof prisma>
const mockedGetSession = getSessionWithUser as jest.MockedFunction<typeof getSessionWithUser>

describe('Orders API', () => {
  const mockUserId = 'test-user-id'
  const mockOrder = createMockOrder({
    id: 'order-1',
    orderNumber: 'GM-1234567890-ABCD',
    customerId: mockUserId,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/orders', () => {
    it('should create order successfully', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      const orderData = {
        items: [
          {
            gemstoneId: 'gem-1',
            quantity: 2,
            price: 100,
          },
        ],
        billingAddressId: 'addr-1',
        shippingAddressId: 'addr-2',
        shippingMethod: 'STANDARD',
        paymentMethod: 'CREDIT_CARD',
        subtotal: 200,
        shipping: 5,
        tax: 38,
        total: 243,
        notes: 'Test order',
      }

      mockedPrisma.order.create.mockResolvedValue({
        ...mockOrder,
        orderItems: [],
        billingAddress: null,
        shippingAddress: null,
      } as any)

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toBeDefined()
      expect(mockedPrisma.order.create).toHaveBeenCalled()
    })

    it('should return 401 if user not authenticated', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: undefined,
      })

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(mockedPrisma.order.create).not.toHaveBeenCalled()
    })

    it('should update coupon usage if coupon code provided', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      const orderData = {
        items: [{ gemstoneId: 'gem-1', quantity: 1, price: 100 }],
        billingAddressId: 'addr-1',
        couponCode: 'TEST10',
        subtotal: 100,
        shipping: 5,
        tax: 19,
        total: 124,
      }

      mockedPrisma.order.create.mockResolvedValue(mockOrder as any)
      mockedPrisma.coupon.update.mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' },
      })

      await POST(request)

      expect(mockedPrisma.coupon.update).toHaveBeenCalledWith({
        where: { code: 'TEST10' },
        data: { usedCount: { increment: 1 } },
      })
    })

    it('should handle database errors', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      mockedPrisma.order.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ gemstoneId: 'gem-1', quantity: 1, price: 100 }],
          subtotal: 100,
          shipping: 5,
          tax: 19,
          total: 124,
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('GET /api/orders', () => {
    it('should fetch user orders successfully', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      const orders = [
        { ...mockOrder, orderItems: [], billingAddress: null, shippingAddress: null },
      ]

      mockedPrisma.order.findMany.mockResolvedValue(orders as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(mockedPrisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return 401 if user not authenticated', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: undefined,
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(mockedPrisma.order.findMany).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      mockedPrisma.order.findMany.mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('GET /api/orders/[id]', () => {
    it('should fetch single order successfully', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      const orderWithRelations = {
        ...mockOrder,
        orderItems: [],
        billingAddress: null,
        shippingAddress: null,
      }

      mockedPrisma.order.findFirst.mockResolvedValue(orderWithRelations as any)

      const request = new NextRequest('http://localhost/api/orders/order-1')
      const params = Promise.resolve({ id: 'order-1' })

      const response = await GET_ORDER(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('order-1')
      expect(mockedPrisma.order.findFirst).toHaveBeenCalledWith({
        where: { id: 'order-1', userId: mockUserId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
        },
      })
    })

    it('should return 404 if order not found', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      mockedPrisma.order.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/orders/order-999')
      const params = Promise.resolve({ id: 'order-999' })

      const response = await GET_ORDER(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Order not found')
    })

    it('should return 401 if user not authenticated', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: undefined,
      })

      const request = new NextRequest('http://localhost/api/orders/order-1')
      const params = Promise.resolve({ id: 'order-1' })

      const response = await GET_ORDER(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('PUT /api/orders/[id]', () => {
    it('should update order status successfully', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      const existingOrder = { ...mockOrder, userId: mockUserId }
      const updatedOrder = { ...existingOrder, status: 'CONFIRMED' }

      mockedPrisma.order.findFirst.mockResolvedValue(existingOrder as any)
      mockedPrisma.order.update.mockResolvedValue({
        ...updatedOrder,
        orderItems: [],
        billingAddress: null,
        shippingAddress: null,
      } as any)

      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify({ status: 'CONFIRMED' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const params = Promise.resolve({ id: 'order-1' })

      const response = await PUT_ORDER(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('CONFIRMED')
      expect(mockedPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: 'CONFIRMED' },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
        },
      })
    })

    it('should update order notes successfully', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      const existingOrder = { ...mockOrder, userId: mockUserId }
      const updatedOrder = { ...existingOrder, notes: 'Updated notes' }

      mockedPrisma.order.findFirst.mockResolvedValue(existingOrder as any)
      mockedPrisma.order.update.mockResolvedValue({
        ...updatedOrder,
        orderItems: [],
        billingAddress: null,
        shippingAddress: null,
      } as any)

      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify({ notes: 'Updated notes' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const params = Promise.resolve({ id: 'order-1' })

      const response = await PUT_ORDER(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.notes).toBe('Updated notes')
    })

    it('should return 404 if order not found', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      mockedPrisma.order.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/orders/order-999', {
        method: 'PUT',
        body: JSON.stringify({ status: 'CONFIRMED' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const params = Promise.resolve({ id: 'order-999' })

      const response = await PUT_ORDER(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Order not found')
    })

    it('should return 401 if user not authenticated', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: undefined,
      })

      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify({ status: 'CONFIRMED' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const params = Promise.resolve({ id: 'order-1' })

      const response = await PUT_ORDER(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should handle database errors', async () => {
      mockedGetSession.mockResolvedValue({
        session: null,
        userId: mockUserId,
      })

      const existingOrder = { ...mockOrder, userId: mockUserId }
      mockedPrisma.order.findFirst.mockResolvedValue(existingOrder as any)
      mockedPrisma.order.update.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost/api/orders/order-1', {
        method: 'PUT',
        body: JSON.stringify({ status: 'CONFIRMED' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const params = Promise.resolve({ id: 'order-1' })

      const response = await PUT_ORDER(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})

