/**
 * Mock-Daten für Tests
 */

import type { Gemstone, Order, Customer, CartItem, WishlistItem } from '@/lib/types'

/**
 * Mock Gemstone
 */
export const createMockGemstone = (overrides: Partial<Gemstone> = {}): Gemstone => ({
  id: 'test-gemstone-id',
  slug: 'test-gemstone',
  name: 'Test Gemstone',
  category: 'diamond',
  shortDescription: 'A test gemstone',
  longDescription: 'This is a test gemstone for testing purposes',
  origin: 'Test Origin',
  status: 'PUBLISHED',
  isNew: false,
  isSold: false,
  featured: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Mock Order
 */
export const createMockOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 'test-order-id',
  orderNumber: 'ORD-001',
  customerId: 'test-customer-id',
  status: 'PENDING',
  paymentStatus: 'UNPAID',
  paymentMethod: 'CREDIT_CARD',
  subtotal: { toString: () => '100.00' } as any,
  taxAmount: { toString: () => '19.00' } as any,
  shippingAmount: { toString: () => '5.00' } as any,
  total: { toString: () => '124.00' } as any,
  currency: 'EUR',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Mock Customer
 */
export const createMockCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  id: 'test-customer-id',
  userId: 'test-user-id',
  customerNumber: 'CUST-001',
  firstName: 'Test',
  lastName: 'Customer',
  email: 'customer@example.com',
  phone: '+49123456789',
  preferredLanguage: 'de',
  marketingOptIn: false,
  kycStatus: 'NOT_REQUIRED',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Mock Cart Item
 */
export const createMockCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'test-cart-item-id',
  gemstoneId: 'test-gemstone-id',
  name: 'Test Gemstone',
  price: 100,
  quantity: 1,
  image: '/images/test-gemstone.jpg',
  category: 'diamond',
  weight: 1.5,
  weightUnit: 'ct',
  origin: 'Test Origin',
  ...overrides,
})

/**
 * Mock Wishlist Item
 */
export const createMockWishlistItem = (overrides: Partial<WishlistItem> = {}): WishlistItem => ({
  id: 'test-wishlist-item-id',
  gemstoneId: 'test-gemstone-id',
  name: 'Test Gemstone',
  price: 100,
  image: '/images/test-gemstone.jpg',
  category: 'diamond',
  ...overrides,
})

/**
 * Array von Mock-Gemstones erstellen
 */
export const createMockGemstones = (count: number): Gemstone[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockGemstone({
      id: `test-gemstone-${i}`,
      slug: `test-gemstone-${i}`,
      name: `Test Gemstone ${i + 1}`,
    })
  )
}

/**
 * Mock API Response
 */
export const createMockApiResponse = <T>(data: T, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
} as Response)

/**
 * Mock Error Response
 */
export const createMockErrorResponse = (message: string, status = 500) =>
  createMockApiResponse({ error: message }, status)

/**
 * Mock Prisma Query Result
 */
export const mockPrismaQuery = <T>(data: T | T[]) => {
  return Promise.resolve(data as any)
}

