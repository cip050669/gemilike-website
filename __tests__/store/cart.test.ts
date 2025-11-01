import { renderHook, act, waitFor } from '@testing-library/react'
import { useCartStore } from '@/lib/store/cart'
import * as cartActions from '@/lib/actions/cart'
import { createMockCartItem } from '../utils/mock-data.helper'

// Mock cart actions and dependencies
jest.mock('@/lib/actions/cart')
jest.mock('@/lib/server/shop-context', () => ({
  resolveShopIdentity: jest.fn().mockResolvedValue({ shopId: 'test-shop' }),
}))

const mockedGetCartSummary = cartActions.getCartSummary as jest.MockedFunction<typeof cartActions.getCartSummary>
const mockedAddCartItem = cartActions.addCartItem as jest.MockedFunction<typeof cartActions.addCartItem>
const mockedUpdateCartItemQuantity = cartActions.updateCartItemQuantity as jest.MockedFunction<typeof cartActions.updateCartItemQuantity>
const mockedRemoveCartItem = cartActions.removeCartItem as jest.MockedFunction<typeof cartActions.removeCartItem>
const mockedClearActiveCart = cartActions.clearActiveCart as jest.MockedFunction<typeof cartActions.clearActiveCart>

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store state
    act(() => {
      useCartStore.setState({
        summary: null,
        items: [],
        isOpen: false,
        isLoading: false,
        error: null,
      })
    })
    jest.clearAllMocks()
  })

  describe('toggleCart', () => {
    it('should toggle cart open state', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.isOpen).toBe(false)

      act(() => {
        result.current.toggleCart()
      })

      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.toggleCart()
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should clear error when toggling cart', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        useCartStore.setState({ error: 'Test error' })
      })

      expect(result.current.error).toBe('Test error')

      act(() => {
        result.current.toggleCart()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('fetchCart', () => {
    it('should fetch cart successfully', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [createMockCartItem()],
        totalPrice: 100,
        totalQuantity: 1,
      }

      mockedGetCartSummary.mockResolvedValue(mockSummary)

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.fetchCart()
      })

      expect(result.current.summary).toEqual(mockSummary)
      expect(result.current.items).toEqual(mockSummary.items)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle fetch error', async () => {
      const errorMessage = 'Failed to fetch cart'
      mockedGetCartSummary.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.fetchCart()
      })

      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)
    })

    it('should set loading state during fetch', async () => {
      mockedGetCartSummary.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          id: 'cart-1',
          currency: 'EUR',
          items: [],
          totalPrice: 0,
          totalQuantity: 0,
        }), 100))
      )

      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.fetchCart()
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('addItem', () => {
    it('should add item to cart successfully', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [createMockCartItem()],
        totalPrice: 100,
        totalQuantity: 1,
      }

      mockedAddCartItem.mockResolvedValue(mockSummary)

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.addItem('gemstone-1', 1, {
          name: 'Test Gemstone',
          price: 100,
          currency: 'EUR',
        })
      })

      expect(mockedAddCartItem).toHaveBeenCalledWith('gemstone-1', 1)
      expect(result.current.summary).toEqual(mockSummary)
      expect(result.current.items).toEqual(mockSummary.items)
      expect(result.current.isLoading).toBe(false)
    })

    it('should perform optimistic update when adding item', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      }

      mockedAddCartItem.mockResolvedValue({
        ...mockSummary,
        items: [createMockCartItem({ id: 'item-1', gemstoneId: 'gemstone-1' })],
        totalPrice: 100,
        totalQuantity: 1,
      })

      const { result } = renderHook(() => useCartStore())

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      act(() => {
        result.current.addItem('gemstone-1', 1, {
          name: 'Test Gemstone',
          price: 100,
        })
      })

      // Check optimistic update
      expect(result.current.items.length).toBeGreaterThan(0)
      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should increment quantity for existing item', async () => {
      const existingItem = createMockCartItem({ id: 'item-1', gemstoneId: 'gemstone-1', quantity: 2 })
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [existingItem],
        totalPrice: 200,
        totalQuantity: 2,
      }

      mockedAddCartItem.mockResolvedValue({
        ...mockSummary,
        items: [{ ...existingItem, quantity: 3 }],
        totalPrice: 300,
        totalQuantity: 3,
      })

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.addItem('gemstone-1', 1)
      })

      expect(result.current.items[0].quantity).toBe(3)
    })

    it('should rollback on error', async () => {
      const previousSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      }

      act(() => {
        useCartStore.setState({ summary: previousSummary })
      })

      mockedAddCartItem.mockRejectedValue(new Error('Add failed'))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.addItem('gemstone-1', 1)
      })

      expect(result.current.error).toBe('Add failed')
      expect(result.current.summary).toEqual(previousSummary)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity successfully', async () => {
      const item = createMockCartItem({ id: 'item-1', quantity: 2 })
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [item],
        totalPrice: 200,
        totalQuantity: 2,
      }

      mockedUpdateCartItemQuantity.mockResolvedValue({
        ...mockSummary,
        items: [{ ...item, quantity: 5 }],
        totalPrice: 500,
        totalQuantity: 5,
      })

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.updateQuantity('item-1', 5)
      })

      expect(mockedUpdateCartItemQuantity).toHaveBeenCalledWith('item-1', 5)
      expect(result.current.items[0].quantity).toBe(5)
    })

    it('should remove item when quantity is 0', async () => {
      const item = createMockCartItem({ id: 'item-1', quantity: 1 })
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [item],
        totalPrice: 100,
        totalQuantity: 1,
      }

      mockedUpdateCartItemQuantity.mockResolvedValue({
        ...mockSummary,
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      })

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.updateQuantity('item-1', 0)
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('should rollback on error', async () => {
      const previousSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [createMockCartItem({ id: 'item-1' })],
        totalPrice: 100,
        totalQuantity: 1,
      }

      act(() => {
        useCartStore.setState({ summary: previousSummary })
      })

      mockedUpdateCartItemQuantity.mockRejectedValue(new Error('Update failed'))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.updateQuantity('item-1', 5)
      })

      expect(result.current.error).toBe('Update failed')
      expect(result.current.summary).toEqual(previousSummary)
    })
  })

  describe('removeItem', () => {
    it('should remove item successfully', async () => {
      const item = createMockCartItem({ id: 'item-1' })
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [item],
        totalPrice: 100,
        totalQuantity: 1,
      }

      mockedRemoveCartItem.mockResolvedValue({
        ...mockSummary,
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      })

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.removeItem('item-1')
      })

      expect(mockedRemoveCartItem).toHaveBeenCalledWith('item-1')
      expect(result.current.items).toHaveLength(0)
    })

    it('should rollback on error', async () => {
      const previousSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [createMockCartItem({ id: 'item-1' })],
        totalPrice: 100,
        totalQuantity: 1,
      }

      act(() => {
        useCartStore.setState({ summary: previousSummary })
      })

      mockedRemoveCartItem.mockRejectedValue(new Error('Remove failed'))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.removeItem('item-1')
      })

      expect(result.current.error).toBe('Remove failed')
      expect(result.current.summary).toEqual(previousSummary)
    })
  })

  describe('clearCart', () => {
    it('should clear cart successfully', async () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [createMockCartItem(), createMockCartItem({ id: 'item-2' })],
        totalPrice: 200,
        totalQuantity: 2,
      }

      mockedClearActiveCart.mockResolvedValue({
        ...mockSummary,
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      })

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.clearCart()
      })

      expect(mockedClearActiveCart).toHaveBeenCalled()
      expect(result.current.items).toHaveLength(0)
      expect(result.current.summary?.totalQuantity).toBe(0)
    })

    it('should rollback on error', async () => {
      const previousSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [createMockCartItem()],
        totalPrice: 100,
        totalQuantity: 1,
      }

      act(() => {
        useCartStore.setState({ summary: previousSummary })
      })

      mockedClearActiveCart.mockRejectedValue(new Error('Clear failed'))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.clearCart()
      })

      expect(result.current.error).toBe('Clear failed')
      expect(result.current.summary).toEqual(previousSummary)
    })
  })

  describe('getTotalItems', () => {
    it('should return total quantity from summary', () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [createMockCartItem({ quantity: 3 }), createMockCartItem({ id: 'item-2', quantity: 2 })],
        totalPrice: 500,
        totalQuantity: 5,
      }

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalItems()).toBe(5)
    })

    it('should return 0 when summary is null', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalItems()).toBe(0)
    })
  })

  describe('getTotalPrice', () => {
    it('should return total price from summary', () => {
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items: [createMockCartItem({ price: 100, quantity: 2 })],
        totalPrice: 200,
        totalQuantity: 2,
      }

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalPrice()).toBe(200)
    })

    it('should return 0 when summary is null', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalPrice()).toBe(0)
    })
  })

  describe('getItems', () => {
    it('should return items from summary', () => {
      const items = [createMockCartItem(), createMockCartItem({ id: 'item-2' })]
      const mockSummary = {
        id: 'cart-1',
        currency: 'EUR',
        items,
        totalPrice: 200,
        totalQuantity: 2,
      }

      act(() => {
        useCartStore.setState({ summary: mockSummary })
      })

      const { result } = renderHook(() => useCartStore())

      expect(result.current.getItems()).toEqual(items)
    })

    it('should return empty array when summary is null', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.getItems()).toEqual([])
    })
  })
})

