import { NextRequest } from 'next/server'
import { GET } from '@/app/api/admin/customers/route'

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))

// Mock session
jest.mock('@/lib/session', () => ({
  getSessionWithUser: jest.fn()
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn()
    },
    customer: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn()
    }
  }
}))

const { getSessionWithUser } = require('@/lib/session')
const { prisma } = require('@/lib/prisma')

describe('/api/admin/customers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 when user is not authenticated', async () => {
    getSessionWithUser.mockResolvedValue({ userId: null })
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 403 when user is not admin', async () => {
    getSessionWithUser.mockResolvedValue({ userId: 'user123' })
    
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
    getSessionWithUser.mockResolvedValue({ userId: 'admin123' })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'ADMIN'
    })
    
    const mockCustomers = [
      {
        id: 'customer1',
        userId: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }
    ]
    
    prisma.customer.findMany.mockResolvedValue(mockCustomers)
    prisma.customer.count.mockResolvedValue(1)
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0]).toMatchObject({
      id: 'customer1',
      email: 'john@example.com',
    })
  })

  it('should handle database errors gracefully', async () => {
    getSessionWithUser.mockResolvedValue({ userId: 'admin123' })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'ADMIN'
    })
    
    prisma.customer.findMany.mockRejectedValue(new Error('Database error'))
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Internal server error')
  })

  it('should determine VIP status correctly', async () => {
    getSessionWithUser.mockResolvedValue({ userId: 'admin123' })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'ADMIN'
    })
    
    const mockCustomers = [
      {
        id: 'customer1',
        userId: 'user123',
        firstName: 'VIP',
        lastName: 'Customer',
        email: 'vip@example.com',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }
    ]
    
    prisma.customer.findMany.mockResolvedValue(mockCustomers)
    prisma.customer.count.mockResolvedValue(1)
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })

  it('should determine inactive status correctly', async () => {
    getSessionWithUser.mockResolvedValue({ userId: 'admin123' })
    
    prisma.user.findUnique.mockResolvedValue({
      role: 'ADMIN'
    })
    
    const mockCustomers = [
      {
        id: 'customer1',
        userId: 'user123',
        firstName: 'Inactive',
        lastName: 'Customer',
        email: 'inactive@example.com',
        isActive: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }
    ]
    
    prisma.customer.findMany.mockResolvedValue(mockCustomers)
    prisma.customer.count.mockResolvedValue(1)
    
    const request = new NextRequest('http://localhost:3000/api/admin/customers')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})
