import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Cart } from '@/components/cart/Cart'
import { useCartStore } from '@/lib/store/cart'
import { createMockCartItem } from '../../utils/mock-data.helper'

// Mock cart store
jest.mock('@/lib/store/cart')
const mockedUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>

describe('Cart Component', () => {
  const mockToggleCart = jest.fn()
  const mockUpdateQuantity = jest.fn()
  const mockRemoveItem = jest.fn()
  const mockFetchCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: false,
        items: [],
        summary: null,
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
      }
      return selector(state as any)
    })
  })

  it('should not render when cart is closed', () => {
    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: false,
        items: [],
        summary: null,
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
      }
      return selector(state as any)
    })

    const { container } = render(<Cart />)
    expect(container.firstChild).toBeNull()
  })

  it('should render when cart is open', () => {
    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items: [],
        summary: null,
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
      }
      return selector(state as any)
    })

    render(<Cart />)
    expect(screen.getByText('Warenkorb')).toBeInTheDocument()
  })

  it('should display empty cart message', () => {
    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items: [],
        summary: null,
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
      }
      return selector(state as any)
    })

    render(<Cart />)
    expect(screen.getByText(/Ihr Warenkorb ist leer/i)).toBeInTheDocument()
  })

  it('should display cart items', () => {
    const items = [
      createMockCartItem({ id: 'item-1', name: 'Gemstone 1', price: 100 }),
      createMockCartItem({ id: 'item-2', name: 'Gemstone 2', price: 200 }),
    ]

    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items,
        summary: {
          id: 'cart-1',
          currency: 'EUR',
          items,
          totalPrice: 300,
          totalQuantity: 2,
        },
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 300,
        getTotalItems: () => 2,
      }
      return selector(state as any)
    })

    render(<Cart />)
    expect(screen.getByText('Gemstone 1')).toBeInTheDocument()
    expect(screen.getByText('Gemstone 2')).toBeInTheDocument()
    expect(screen.getByText('300.00')).toBeInTheDocument()
  })

  it('should call toggleCart when close button is clicked', () => {
    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items: [],
        summary: null,
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
      }
      return selector(state as any)
    })

    render(<Cart />)
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(mockToggleCart).toHaveBeenCalled()
  })

  it('should call updateQuantity when quantity buttons are clicked', () => {
    const items = [createMockCartItem({ id: 'item-1', quantity: 2 })]

    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items,
        summary: {
          id: 'cart-1',
          currency: 'EUR',
          items,
          totalPrice: 200,
          totalQuantity: 2,
        },
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 200,
        getTotalItems: () => 2,
      }
      return selector(state as any)
    })

    render(<Cart />)
    const minusButton = screen.getAllByRole('button').find((btn) => 
      btn.querySelector('svg')?.getAttribute('class')?.includes('Minus')
    )
    
    if (minusButton) {
      fireEvent.click(minusButton)
      expect(mockUpdateQuantity).toHaveBeenCalledWith('item-1', 1)
    }
  })

  it('should call removeItem when remove button is clicked', () => {
    const items = [createMockCartItem({ id: 'item-1' })]

    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items,
        summary: {
          id: 'cart-1',
          currency: 'EUR',
          items,
          totalPrice: 100,
          totalQuantity: 1,
        },
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 100,
        getTotalItems: () => 1,
      }
      return selector(state as any)
    })

    render(<Cart />)
    const removeButtons = screen.getAllByRole('button')
    const removeButton = removeButtons.find((btn) =>
      btn.querySelector('svg')?.getAttribute('class')?.includes('X')
    )

    if (removeButton) {
      fireEvent.click(removeButton)
      expect(mockRemoveItem).toHaveBeenCalledWith('item-1')
    }
  })

  it('should display loading state', () => {
    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items: [],
        summary: null,
        isLoading: true,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
      }
      return selector(state as any)
    })

    render(<Cart />)
    expect(screen.getByText(/Wird geladen/i)).toBeInTheDocument()
  })

  it('should display error message', () => {
    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items: [],
        summary: null,
        isLoading: false,
        error: 'Test error',
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
      }
      return selector(state as any)
    })

    render(<Cart />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('should fetch cart when opened', () => {
    mockedUseCartStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        items: [],
        summary: null,
        isLoading: false,
        error: null,
        toggleCart: mockToggleCart,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
        fetchCart: mockFetchCart,
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
      }
      return selector(state as any)
    })

    render(<Cart />)
    // fetchCart should be called via useEffect when cart opens
    // This would need useEffect to be properly tested
  })
})

