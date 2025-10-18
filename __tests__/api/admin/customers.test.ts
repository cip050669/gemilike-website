import { NextRequest } from 'next/server'
import { GET } from '@/app/api/admin/customers/route'

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn()
    }
  }
}))

const { getServerSession } = require('next-auth')
const { prisma } = require('@/lib/prisma')

describe('/api/admin/customers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 when user is not authenticated', async () => {
    getServerSession.mockResolvedValue(null)
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 403 when user is not admin', async () => {
    getServerSession.mockResolvedValue({
      user: { id: 'user123' }
    })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'customer'
    })
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBe('Forbidden')
  })

  it('should return customers when user is admin', async () => {
    getServerSession.mockResolvedValue({
      user: { id: 'admin123' }
    })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'admin'
    })
    
    const mockCustomers = [
      {
        id: 'customer1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        createdAt: new Date('2024-01-01'),
        orders: [
          {
            id: 'order1',
            total: 500,
            createdAt: new Date('2024-01-15'),
            orderItems: [
              {
                id: 'item1',
                gemstoneName: 'Emerald',
                quantity: 1,
                price: 500
              }
            ]
          }
        ]
      }
    ]
    
    prisma.user.findMany.mockResolvedValue(mockCustomers)
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data).toHaveLength(1)
    expect(data[0]).toMatchObject({
      id: 'customer1',
      name: 'John Doe',
      email: 'john@example.com',
      totalOrders: 1,
      totalSpent: 500,
      status: 'active'
    })
  })

  it('should handle database errors gracefully', async () => {
    getServerSession.mockResolvedValue({
      user: { id: 'admin123' }
    })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'admin'
    })
    
    prisma.user.findMany.mockRejectedValue(new Error('Database error'))
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Internal server error')
  })

  it('should determine VIP status correctly', async () => {
    getServerSession.mockResolvedValue({
      user: { id: 'admin123' }
    })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'admin'
    })
    
    const mockCustomers = [
      {
        id: 'customer1',
        name: 'VIP Customer',
        email: 'vip@example.com',
        createdAt: new Date('2024-01-01'),
        orders: [
          {
            id: 'order1',
            total: 15000, // High spending
            createdAt: new Date('2024-01-15'),
            orderItems: []
          }
        ]
      }
    ]
    
    prisma.user.findMany.mockResolvedValue(mockCustomers)
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data[0].status).toBe('vip')
  })

  it('should determine inactive status correctly', async () => {
    getServerSession.mockResolvedValue({
      user: { id: 'admin123' }
    })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'admin'
    })
    
    const mockCustomers = [
      {
        id: 'customer1',
        name: 'Inactive Customer',
        email: 'inactive@example.com',
        createdAt: new Date('2024-01-01'),
        orders: [] // No orders
      }
    ]
    
    prisma.user.findMany.mockResolvedValue(mockCustomers)
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data[0].status).toBe('inactive')
  })
})
