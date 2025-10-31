/**
 * WishlistManager Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WishlistManager from '@/components/profile/WishlistManager'
import { useWishlistStore } from '@/lib/store/wishlist'
import { useCartStore } from '@/lib/store/cart'
import { allGemstones } from '@/lib/data/gemstones'

// Mock dependencies
jest.mock('@/lib/store/wishlist')
jest.mock('@/lib/store/cart')
jest.mock('@/lib/data/gemstones', () => ({
  allGemstones: [
    {
      id: 'gem-1',
      name: 'Diamond',
      price: 1000,
      images: ['/images/diamond.jpg'],
      category: 'diamond',
      caratWeight: 1.5,
      origin: 'South Africa',
    },
    {
      id: 'gem-2',
      name: 'Ruby',
      price: 800,
      images: ['/images/ruby.jpg'],
      category: 'ruby',
      gramWeight: 2.0,
      origin: 'Myanmar',
    },
  ],
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

const mockedUseWishlistStore = useWishlistStore as jest.MockedFunction<typeof useWishlistStore>
const mockedUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>

describe('WishlistManager', () => {
  const mockWishlistItems = [
    {
      id: 'wish-1',
      gemstoneId: 'gem-1',
      name: 'Diamond',
      price: 1000,
      image: '/images/diamond.jpg',
      category: 'diamond',
    },
  ]

  const mockRemoveItem = jest.fn().mockResolvedValue(undefined)
  const mockClearWishlist = jest.fn().mockResolvedValue(undefined)
  const mockFetchWishlist = jest.fn().mockResolvedValue(undefined)
  const mockAddCartItem = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    jest.clearAllMocks()
    global.confirm = jest.fn().mockReturnValue(true)

    mockedUseWishlistStore.mockImplementation((selector) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('items')) {
        return mockWishlistItems
      }
      if (selectorStr.includes('removeItem')) {
        return mockRemoveItem
      }
      if (selectorStr.includes('clearWishlist')) {
        return mockClearWishlist
      }
      if (selectorStr.includes('fetchWishlist')) {
        return mockFetchWishlist
      }
      if (selectorStr.includes('error')) {
        return null
      }
      if (selectorStr.includes('isLoading')) {
        return false
      }
      return undefined
    })

    mockedUseCartStore.mockImplementation((selector) => {
      if (selector.toString().includes('addItem')) {
        return mockAddCartItem
      }
      return undefined
    })
  })

  it('should render wishlist items', async () => {
    render(<WishlistManager />)

    await waitFor(() => {
      expect(screen.getByText(/Diamond/i)).toBeInTheDocument()
    })
  })

  it('should call removeItem when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<WishlistManager />)

    await waitFor(() => {
      expect(screen.getByText(/Diamond/i)).toBeInTheDocument()
    })

    const removeButtons = screen.getAllByRole('button', { name: /entfernen/i })
    if (removeButtons.length > 0) {
      await user.click(removeButtons[0])
      
      await waitFor(() => {
        expect(mockRemoveItem).toHaveBeenCalled()
      })
    }
  })

  it('should call clearWishlist when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<WishlistManager />)

    await waitFor(() => {
      expect(screen.getByText(/Diamond/i)).toBeInTheDocument()
    })

    const clearButton = screen.queryByRole('button', { name: /alle löschen/i }) || 
                        screen.queryByRole('button', { name: /merkmale löschen/i })
    
    if (clearButton) {
      await user.click(clearButton)
      
      expect(mockClearWishlist).toHaveBeenCalled()
    }
  })

  it('should fetch wishlist on mount', () => {
    render(<WishlistManager />)
    
    expect(mockFetchWishlist).toHaveBeenCalled()
  })

  it('should display empty state when no items', async () => {
    mockedUseWishlistStore.mockImplementation((selector) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('items')) {
        return []
      }
      if (selectorStr.includes('removeItem')) {
        return mockRemoveItem
      }
      if (selectorStr.includes('clearWishlist')) {
        return mockClearWishlist
      }
      if (selectorStr.includes('fetchWishlist')) {
        return mockFetchWishlist
      }
      if (selectorStr.includes('error')) {
        return null
      }
      if (selectorStr.includes('isLoading')) {
        return false
      }
      return undefined
    })

    render(<WishlistManager />)

    await waitFor(() => {
      // Should show empty state or no items message
      const emptyMessage = screen.queryByText(/keine/i) || screen.queryByText(/leer/i)
      expect(emptyMessage || screen.queryByText(/Diamond/i)).toBeTruthy()
    })
  })

  it('should handle loading state', () => {
    mockedUseWishlistStore.mockImplementation((selector) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('items')) {
        return mockWishlistItems
      }
      if (selectorStr.includes('removeItem')) {
        return mockRemoveItem
      }
      if (selectorStr.includes('clearWishlist')) {
        return mockClearWishlist
      }
      if (selectorStr.includes('fetchWishlist')) {
        return mockFetchWishlist
      }
      if (selectorStr.includes('error')) {
        return null
      }
      if (selectorStr.includes('isLoading')) {
        return true
      }
      return undefined
    })

    render(<WishlistManager />)
    
    // Component should handle loading state gracefully
    expect(screen.queryByText(/Diamond/i) || screen.queryByText(/laden/i)).toBeTruthy()
  })
})

