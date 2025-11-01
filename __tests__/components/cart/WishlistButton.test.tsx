/**
 * WishlistButton Component Tests
 */

import { render, screen, waitFor, act } from '@testing-library/react'
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

  const setStoreState = (overrides: Partial<Record<string, any>> = {}) => {
    mockedUseWishlistStore.mockImplementation((selector) =>
      selector({
        toggleItem: mockToggleItem,
        removeItem: mockRemoveItem,
        isInWishlist: mockIsInWishlist,
        fetchWishlist: mockFetchWishlist,
        summary: mockSummary,
        isLoading: mockIsLoading(),
        ...overrides,
      } as any)
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    setStoreState()
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
    await act(async () => {
      jest.runOnlyPendingTimers()
    })

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
    await act(async () => {
      jest.runOnlyPendingTimers()
    })

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('gem-1')
    })
  })

  it('should fetch wishlist if summary is not available', () => {
    setStoreState({ summary: null, isLoading: false })

    render(<WishlistButton item={mockItem} />)

    expect(mockFetchWishlist).toHaveBeenCalled()
  })

  it('should be disabled when store is loading', () => {
    mockIsLoading.mockReturnValue(true)
    
    setStoreState({ isLoading: true })

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
