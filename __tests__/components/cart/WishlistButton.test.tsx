/**
 * WishlistButton Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WishlistButton } from '@/components/cart/WishlistButton'
import { useWishlistStore } from '@/lib/store/wishlist'

// Mock dependencies
jest.mock('@/lib/store/wishlist')

const mockedUseWishlistStore = useWishlistStore as jest.MockedFunction<typeof useWishlistStore>

describe('WishlistButton', () => {
  const mockItem = {
    id: 'gem-1',
    name: 'Test Diamond',
    image: '/images/diamond.jpg',
    isSold: false,
  }

  const mockToggleItem = jest.fn().mockResolvedValue(undefined)
  const mockRemoveItem = jest.fn().mockResolvedValue(undefined)
  const mockIsInWishlist = jest.fn().mockReturnValue(false)
  const mockFetchWishlist = jest.fn().mockResolvedValue(undefined)
  const mockSummary = { items: [], totalItems: 0 }
  const mockIsLoading = jest.fn().mockReturnValue(false)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockedUseWishlistStore.mockImplementation((selector) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('toggleItem')) {
        return mockToggleItem
      }
      if (selectorStr.includes('removeItem')) {
        return mockRemoveItem
      }
      if (selectorStr.includes('isInWishlist')) {
        return mockIsInWishlist
      }
      if (selectorStr.includes('fetchWishlist')) {
        return mockFetchWishlist
      }
      if (selectorStr.includes('summary')) {
        return mockSummary
      }
      if (selectorStr.includes('isLoading')) {
        return mockIsLoading()
      }
      return undefined
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render button', () => {
    render(<WishlistButton item={mockItem} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should call toggleItem when item not in wishlist', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    mockIsInWishlist.mockReturnValue(false)
    
    render(<WishlistButton item={mockItem} />)
    
    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(mockToggleItem).toHaveBeenCalledWith('gem-1', {
        gemstoneId: 'gem-1',
        name: 'Test Diamond',
        image: '/images/diamond.jpg',
        isSold: false,
      })
    })
  })

  it('should call removeItem when item is in wishlist', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    mockIsInWishlist.mockReturnValue(true)
    
    render(<WishlistButton item={mockItem} />)
    
    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('gem-1')
    })
  })

  it('should fetch wishlist if summary is not available', () => {
    mockedUseWishlistStore.mockImplementation((selector) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('toggleItem')) {
        return mockToggleItem
      }
      if (selectorStr.includes('removeItem')) {
        return mockRemoveItem
      }
      if (selectorStr.includes('isInWishlist')) {
        return mockIsInWishlist
      }
      if (selectorStr.includes('fetchWishlist')) {
        return mockFetchWishlist
      }
      if (selectorStr.includes('summary')) {
        return null // No summary
      }
      if (selectorStr.includes('isLoading')) {
        return false
      }
      return undefined
    })

    render(<WishlistButton item={mockItem} />)

    expect(mockFetchWishlist).toHaveBeenCalled()
  })

  it('should be disabled when store is loading', () => {
    mockIsLoading.mockReturnValue(true)
    
    mockedUseWishlistStore.mockImplementation((selector) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('toggleItem')) {
        return mockToggleItem
      }
      if (selectorStr.includes('removeItem')) {
        return mockRemoveItem
      }
      if (selectorStr.includes('isInWishlist')) {
        return mockIsInWishlist
      }
      if (selectorStr.includes('fetchWishlist')) {
        return mockFetchWishlist
      }
      if (selectorStr.includes('summary')) {
        return mockSummary
      }
      if (selectorStr.includes('isLoading')) {
        return true
      }
      return undefined
    })

    render(<WishlistButton item={mockItem} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should apply correct className when item is in wishlist', () => {
    mockIsInWishlist.mockReturnValue(true)
    
    render(<WishlistButton item={mockItem} />)
    
    const button = screen.getByRole('button')
    expect(button.className).toContain('text-red-500')
  })

  it('should work with minimal item props', () => {
    const minimalItem = {
      id: 'gem-2',
    }

    render(<WishlistButton item={minimalItem} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<WishlistButton item={mockItem} className="custom-class" />)
    
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })
})

