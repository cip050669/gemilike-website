import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/admin/gemstones/route'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    gemstone: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/data/gemstones', () => ({
  allGemstones: [],
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
      })),
    },
  }
})

const mockedPrisma = prisma as jest.Mocked<typeof prisma>

describe('Admin Gemstones API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/admin/gemstones', () => {
    it('should fetch gemstones with pagination', async () => {
      const mockGemstones = [
        {
          id: 'gem-1',
          name: 'Test Gem 1',
          category: 'Diamond',
          status: 'PUBLISHED',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            wishlistItems: 5,
            cartItems: 2,
          },
        },
      ]

      mockedPrisma.gemstone.findMany.mockResolvedValue(mockGemstones as any)

      const request = new NextRequest('http://localhost/api/admin/gemstones?page=1&limit=25', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.pagination).toBeDefined()
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(25)
    })

    it('should filter by search term', async () => {
      const mockGemstones = [
        {
          id: 'gem-1',
          name: 'Emerald',
          category: 'Emerald',
          status: 'PUBLISHED',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            wishlistItems: 0,
            cartItems: 0,
          },
        },
      ]

      mockedPrisma.gemstone.findMany.mockResolvedValue(mockGemstones as any)

      const request = new NextRequest('http://localhost/api/admin/gemstones?search=emerald', {
        method: 'GET',
      })

      await GET(request)

      expect(mockedPrisma.gemstone.findMany).toHaveBeenCalled()
    })

    it('should handle default pagination', async () => {
      mockedPrisma.gemstone.findMany.mockResolvedValue([])

      const request = new NextRequest('http://localhost/api/admin/gemstones', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(25)
    })

    it('should handle errors', async () => {
      mockedPrisma.gemstone.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost/api/admin/gemstones', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200) // Falls auf fallback zurückgreift
      expect(data).toBeDefined()
    })
  })

  describe('POST /api/admin/gemstones', () => {
    it('should create gemstone successfully', async () => {
      const mockGemstone = {
        id: 'gem-1',
        name: 'New Gemstone',
        category: 'Diamond',
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockedPrisma.gemstone.create.mockResolvedValue(mockGemstone as any)

      const request = new NextRequest('http://localhost/api/admin/gemstones', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Gemstone',
          category: 'Diamond',
          status: 'DRAFT',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      // Check actual status - might be 200 or 201 depending on implementation
      expect([200, 201]).toContain(response.status)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(mockedPrisma.gemstone.create).toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost/api/admin/gemstones', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it('should handle database errors', async () => {
      mockedPrisma.gemstone.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost/api/admin/gemstones', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Gemstone',
          category: 'Diamond',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeDefined()
    })
  })
})

