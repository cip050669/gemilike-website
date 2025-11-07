/**
 * Integration Tests: Checkout Flow
 * 
 * Tests the complete user flow from adding items to cart,
 * proceeding to checkout, and completing an order.
 */

import { GET as GET_ORDERS, POST as POST_ORDER } from '@/app/api/orders/route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionWithUser } from '@/lib/session'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    cart: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    cartItem: {
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    customer: {
      findUnique: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    coupon: {
      update: jest.fn(),
    },
  },
}))

jest.mock('@/lib/session', () => ({
  getSessionWithUser: jest.fn(),
}))

jest.mock('@/lib/actions/cart', () => ({
  getCartSummary: jest.fn(),
}))

jest.mock('@/lib/services/shop/order.service', () => ({
  createOrder: jest.fn(),
  listOrders: jest.fn(),
}))

jest.mock('@/lib/server/shop-context', () => ({
  resolveShopIdentity: jest.fn().mockResolvedValue({ shopId: 'test-shop' }),
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
const { getCartSummary } = require('@/lib/actions/cart')
const mockedGetCartSummary = getCartSummary as jest.MockedFunction<typeof getCartSummary>
const { createOrder, listOrders } = require('@/lib/services/shop/order.service')
const mockedCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>
const mockedListOrders = listOrders as jest.MockedFunction<typeof listOrders>

describe('Checkout Flow Integration', () => {
  const mockUserId = 'test-user-id'

  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetSession.mockResolvedValue({
      session: null,
      userId: mockUserId,
    })
  })

  describe('Complete Checkout Flow', () => {
    it('should complete full checkout flow: cart → order', async () => {
      // Step 1: Add items to cart
      const cartSummary = {
        items: [
          {
            id: 'item-1',
            gemstoneId: 'gem-1',
            name: 'Diamond',
            price: 1000,
            quantity: 2,
            total: 2000,
          },
        ],
        subtotal: 2000,
        tax: 380,
        shipping: 5,
        total: 2385,
        currency: 'EUR',
      }

      mockedGetCartSummary.mockResolvedValue(cartSummary as any)
      mockedPrisma.cart.findFirst.mockResolvedValue({
        id: 'cart-1',
        userId: mockUserId,
      } as any)
      mockedPrisma.cartItem.create.mockResolvedValue({} as any)

      // Step 2: Create order
      const orderData = {
        items: cartSummary.items.map((item) => ({
          gemstoneId: item.gemstoneId,
          quantity: item.quantity,
          price: item.price,
        })),
        billingAddressId: 'addr-1',
        shippingAddressId: 'addr-2',
        shippingMethod: 'STANDARD',
        paymentMethod: 'CREDIT_CARD',
        subtotal: cartSummary.subtotal,
        shipping: cartSummary.shipping,
        tax: cartSummary.tax,
        total: cartSummary.total,
      }

      const mockOrder = {
        id: 'order-1',
        orderNumber: 'GM-1234567890-ABCD',
        userId: mockUserId,
        status: 'PENDING',
        ...orderData,
        orderItems: [],
        billingAddress: null,
        shippingAddress: null,
      }

      mockedPrisma.customer.findUnique.mockResolvedValue({
        id: 'customer-1',
        userId: mockUserId,
      } as any)
      
      mockedCreateOrder.mockResolvedValue({
        id: 'order-1',
        orderNumber: 'GM-1234567890-ABCD',
        ...mockOrder,
      } as any)

      const orderRequest = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' },
      })

      const orderResponse = await POST_ORDER(orderRequest)
      const orderResult = await orderResponse.json()

      // Assertions
      expect(orderResponse.status).toBe(201)
      expect(orderResult.orderNumber).toBeDefined()
      expect(mockedCreateOrder).toHaveBeenCalled()
    })

    it('should handle cart-to-order flow with coupon', async () => {
      const cartSummary = {
        items: [{ id: 'item-1', gemstoneId: 'gem-1', name: 'Diamond', price: 1000, quantity: 1 }],
        subtotal: 1000,
        tax: 190,
        shipping: 5,
        total: 1195,
        currency: 'EUR',
      }

      mockedGetCartSummary.mockResolvedValue(cartSummary as any)

      const orderData = {
        items: cartSummary.items.map((item) => ({
          gemstoneId: item.gemstoneId,
          quantity: item.quantity,
          price: item.price,
        })),
        billingAddressId: 'addr-1',
        couponCode: 'TEST10',
        subtotal: 900, // With discount
        shipping: 5,
        tax: 171,
        total: 1076,
      }

      const mockOrder = {
        id: 'order-2',
        orderNumber: 'GM-1234567891-ABCD',
        ...orderData,
        orderItems: [],
        billingAddress: null,
        shippingAddress: null,
      }

      mockedPrisma.customer.findUnique.mockResolvedValue({
        id: 'customer-1',
        userId: mockUserId,
      } as any)
      
      mockedCreateOrder.mockResolvedValue({
        id: 'order-2',
        orderNumber: 'GM-1234567891-ABCD',
        ...mockOrder,
      } as any)
      mockedPrisma.coupon.update.mockResolvedValue({} as any)

      const orderRequest = new NextRequest('http://localhost/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' },
      })

      await POST_ORDER(orderRequest)

      expect(mockedPrisma.coupon.update).toHaveBeenCalledWith({
        where: { code: 'TEST10' },
        data: { usedCount: { increment: 1 } },
      })
    })

    it('should fetch orders after checkout', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          orderNumber: 'GM-1234567890-ABCD',
          userId: mockUserId,
          status: 'PENDING',
          orderItems: [],
          billingAddress: null,
          shippingAddress: null,
        },
      ]

      mockedPrisma.customer.findUnique.mockResolvedValue({
        id: 'customer-1',
        userId: mockUserId,
      } as any)
      mockedListOrders.mockResolvedValue(mockOrders as any)

      const ordersRequest = new NextRequest('http://localhost/api/orders')
      const ordersResponse = await GET_ORDERS(ordersRequest)
      const orders = await ordersResponse.json()

      expect(ordersResponse.status).toBe(200)
      expect(Array.isArray(orders)).toBe(true)
      expect(orders.length).toBeGreaterThan(0)
    })
  })
})

