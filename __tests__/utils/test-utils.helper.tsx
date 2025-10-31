import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { SessionProvider } from 'next-auth/react'

/**
 * Test-Utilities für die Gemilike-Website
 */

// Mock-Messages für next-intl
const mockMessages = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
  },
}

/**
 * Custom render function with all providers
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="de" messages={mockMessages}>
      <SessionProvider session={null}>
        {children}
      </SessionProvider>
    </NextIntlClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

/**
 * Wait for async operations
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

/**
 * Mock user session
 */
export const createMockSession = (overrides = {}) => ({
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date(Date.now() + 86400000).toISOString(), // 24 hours
  ...overrides,
})

/**
 * Mock admin session
 */
export const createMockAdminSession = () => createMockSession({
  user: {
    id: 'admin-user-id',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
})

