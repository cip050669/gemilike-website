import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/register/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
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
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('Auth Register API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register user successfully', async () => {
    const hashedPassword = 'hashed-password'
    mockedBcrypt.hash.mockResolvedValue(hashedPassword as never)

    mockedPrisma.user.findUnique.mockResolvedValue(null)
    mockedPrisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)


    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.password).toBeUndefined() // Password should not be returned
    expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 12)
    expect(mockedPrisma.user.create).toHaveBeenCalled()
  })

  it('should reject duplicate email', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'existing-user',
      email: 'existing@example.com',
    } as any)

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('E-Mail')
    expect(mockedPrisma.user.create).not.toHaveBeenCalled()
  })

  it('should validate email format', async () => {
    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('should validate password strength', async () => {
    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123', // Too short
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('should require all fields', async () => {
    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        // Missing password and name
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('should handle database errors', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null)
    mockedBcrypt.hash.mockResolvedValue('hashed-password' as never)
    mockedPrisma.user.create.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
  })
})

