import { NextRequest } from 'next/server'
import { GET, POST, PATCH, DELETE } from '@/app/api/cart/route'
import * as cartActions from '@/lib/actions/cart'
import { createMockApiResponse, createMockErrorResponse } from '../utils/mock-data.helper'

// Mock cart actions and dependencies
jest.mock('@/lib/actions/cart')
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
      })),
    },
  }
})

const mockedCartActions = cartActions as jest.Mocked<typeof cartActions>

describe('Cart API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/cart', () => {
    it('should return cart summary successfully', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      }

      mockedCartActions.getCartSummary.mockResolvedValue(mockSummary)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockSummary)
      expect(mockedCartActions.getCartSummary).toHaveBeenCalled()
    })

    it('should handle errors when fetching cart', async () => {
      mockedCartActions.getCartSummary.mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeDefined()
    })
  })

  describe('POST /api/cart', () => {
    it('should add item to cart successfully', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [{
          id: 'item-1',
          gemstoneId: 'gem-1',
          name: 'Test Gem',
          quantity: 1,
          price: 100,
          currency: 'EUR',
          slug: null,
          image: null,
          isSold: false,
          category: null,
          weight: null,
          weightUnit: 'ct' as const,
          origin: null,
        }],
        totalPrice: 100,
        totalQuantity: 1,
      }

      mockedCartActions.addCartItem.mockResolvedValue(mockSummary)

      const request = new NextRequest('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          gemstoneId: 'gem-1',
          quantity: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockSummary)
      expect(mockedCartActions.addCartItem).toHaveBeenCalledWith('gem-1', 1)
    })

    it('should validate gemstoneId', async () => {
      const request = new NextRequest('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          quantity: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('gemstoneId')
    })

    it('should validate quantity', async () => {
      const request = new NextRequest('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          gemstoneId: 'gem-1',
          quantity: 'invalid',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('quantity')
    })

    it('should default quantity to 1', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      }

      mockedCartActions.addCartItem.mockResolvedValue(mockSummary)

      const request = new NextRequest('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          gemstoneId: 'gem-1',
        }),
      })

      await POST(request)

      expect(mockedCartActions.addCartItem).toHaveBeenCalledWith('gem-1', 1)
    })

    it('should handle errors when adding item', async () => {
      mockedCartActions.addCartItem.mockRejectedValue(new Error('Add failed'))

      const request = new NextRequest('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          gemstoneId: 'gem-1',
          quantity: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeDefined()
    })
  })

  describe('PATCH /api/cart', () => {
    it('should update item quantity successfully', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [{
          id: 'item-1',
          gemstoneId: 'gem-1',
          name: 'Test Gem',
          quantity: 5,
          price: 100,
          currency: 'EUR',
          slug: null,
          image: null,
          isSold: false,
          category: null,
          weight: null,
          weightUnit: 'ct' as const,
          origin: null,
        }],
        totalPrice: 500,
        totalQuantity: 5,
      }

      mockedCartActions.updateCartItemQuantity.mockResolvedValue(mockSummary)

      const request = new NextRequest('http://localhost/api/cart', {
        method: 'PATCH',
        body: JSON.stringify({
          cartItemId: 'item-1',
          quantity: 5,
        }),
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockSummary)
      expect(mockedCartActions.updateCartItemQuantity).toHaveBeenCalledWith('item-1', 5)
    })

    it('should validate cartItemId', async () => {
      const request = new NextRequest('http://localhost/api/cart', {
        method: 'PATCH',
        body: JSON.stringify({
          quantity: 5,
        }),
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('cartItemId')
    })

    it('should validate quantity', async () => {
      const request = new NextRequest('http://localhost/api/cart', {
        method: 'PATCH',
        body: JSON.stringify({
          cartItemId: 'item-1',
          quantity: 'invalid',
        }),
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('quantity')
    })

    it('should handle errors when updating quantity', async () => {
      mockedCartActions.updateCartItemQuantity.mockRejectedValue(new Error('Update failed'))

      const request = new NextRequest('http://localhost/api/cart', {
        method: 'PATCH',
        body: JSON.stringify({
          cartItemId: 'item-1',
          quantity: 5,
        }),
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeDefined()
    })
  })

  describe('DELETE /api/cart', () => {
    it('should clear cart when clear=true', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      }

      mockedCartActions.clearActiveCart.mockResolvedValue(mockSummary)

      const request = new NextRequest('http://localhost/api/cart?clear=true', {
        method: 'DELETE',
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockSummary)
      expect(mockedCartActions.clearActiveCart).toHaveBeenCalled()
    })

    it('should remove item when cartItemId is provided', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      }

      mockedCartActions.removeCartItem.mockResolvedValue(mockSummary)

      const request = new NextRequest('http://localhost/api/cart?cartItemId=item-1', {
        method: 'DELETE',
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockSummary)
      expect(mockedCartActions.removeCartItem).toHaveBeenCalledWith('item-1')
    })

    it('should require either clear or cartItemId', async () => {
      const request = new NextRequest('http://localhost/api/cart', {
        method: 'DELETE',
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it('should handle errors when removing item', async () => {
      mockedCartActions.removeCartItem.mockRejectedValue(new Error('Remove failed'))

      const request = new NextRequest('http://localhost/api/cart?cartItemId=item-1', {
        method: 'DELETE',
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeDefined()
    })
  })
})

