/**
 * AddToCartButton Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddToCartButton } from '@/components/shop/AddToCartButton'

// Mock dependencies - mock the entire store module
const mockAddItem = jest.fn().mockResolvedValue(undefined)
const mockIsLoading = jest.fn().mockReturnValue(false)

jest.mock('@/lib/store/cart', () => ({
  useCartStore: jest.fn((selector: any) => {
    const result = selector({
      addItem: mockAddItem,
      isLoading: mockIsLoading(),
    } as any)
    return result
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

describe('AddToCartButton', () => {
  const mockItem = {
    id: 'gem-1',
    name: 'Test Diamond',
    price: 1000,
    currency: 'EUR',
    image: '/images/diamond.jpg',
    category: 'diamond',
    weight: 1.5,
    weightUnit: 'ct' as const,
    origin: 'South Africa',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockAddItem.mockResolvedValue(undefined)
    mockIsLoading.mockReturnValue(false)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render button with correct text', () => {
    render(<AddToCartButton item={mockItem} />)
    
    expect(screen.getByRole('button', { name: /In den Warenkorb/i })).toBeInTheDocument()
  })

  it('should call addItem when clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton item={mockItem} />)
    
    const button = screen.getByRole('button', { name: /In den Warenkorb/i })
    await user.click(button)

    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith(
        'gem-1',
        1,
        expect.objectContaining({
          gemstoneId: 'gem-1',
          name: 'Test Diamond',
          price: 1000,
          currency: 'EUR',
        })
      )
    })
  })

  it('should show "Hinzugefügt" after adding', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton item={mockItem} />)
    
    const button = screen.getByRole('button', { name: /In den Warenkorb/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Hinzugefügt/i)).toBeInTheDocument()
    })
  })

  it('should be disabled when disabled prop is true', () => {
    render(<AddToCartButton item={mockItem} disabled={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText(/Nicht verfügbar/i)).toBeInTheDocument()
  })

  it('should be disabled when store is loading', () => {
    mockIsLoading.mockReturnValue(true)
    const { useCartStore } = require('@/lib/store/cart')
    useCartStore.mockImplementation((selector: any) => {
      const result = selector({
        addItem: mockAddItem,
        isLoading: true,
      } as any)
      return result
    })

    render(<AddToCartButton item={mockItem} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should reset to normal state after 2 seconds', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton item={mockItem} />)
    
    const button = screen.getByRole('button', { name: /In den Warenkorb/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Hinzugefügt/i)).toBeInTheDocument()
    })

    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      expect(screen.getByText(/In den Warenkorb/i)).toBeInTheDocument()
    })
  })

  it('should handle addItem errors gracefully', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const mockAddItemWithError = jest.fn().mockRejectedValue(new Error('Failed to add'))
    
    const { useCartStore } = require('@/lib/store/cart')
    useCartStore.mockImplementation((selector: any) => {
      const result = selector({
        addItem: mockAddItemWithError,
        isLoading: false,
      } as any)
      return result
    })

    render(<AddToCartButton item={mockItem} />)
    
    const button = screen.getByRole('button', { name: /In den Warenkorb/i })
    await user.click(button)

    await waitFor(() => {
      expect(mockAddItemWithError).toHaveBeenCalled()
    })

    // Should reset after error
    jest.advanceTimersByTime(2000)
    
    await waitFor(() => {
      expect(screen.queryByText(/Hinzugefügt/i)).not.toBeInTheDocument()
    })
  })

  it('should work without optional fields', () => {
    const minimalItem = {
      id: 'gem-2',
      name: 'Minimal Gem',
      price: 500,
    }

    render(<AddToCartButton item={minimalItem} />)
    
    expect(screen.getByRole('button', { name: /In den Warenkorb/i })).toBeInTheDocument()
  })
})

