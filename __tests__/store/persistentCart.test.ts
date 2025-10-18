import { renderHook, act } from '@testing-library/react'
import { usePersistentCartStore } from '@/lib/store/persistentCart'
import { Gemstone } from '@/lib/types/gemstone'

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Mock data
const mockGemstone: Gemstone = {
  id: 'gem-001',
  name: 'Test Emerald',
  category: 'Emerald',
  type: 'cut',
  price: 500,
  currency: 'EUR',
  inStock: true,
  images: ['/test-image.jpg'],
  mainImage: '/test-image.jpg',
  origin: 'Colombia',
  mineLocation: 'Muzo',
  description: 'Test emerald',
  dimensions: {
    length: 10,
    width: 8,
    height: 6
  }
}

describe('PersistentCartStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      usePersistentCartStore.getState().clearCart()
    })
    
    mockFetch.mockClear()
  })

  it('should add item to cart', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone)
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].gemstone).toEqual(mockGemstone)
    expect(result.current.items[0].quantity).toBe(1)
  })

  it('should increment quantity when adding existing item', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone)
      result.current.addItem(mockGemstone)
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone)
    })
    
    expect(result.current.items).toHaveLength(1)
    
    act(() => {
      result.current.removeItem(result.current.items[0].id)
    })
    
    expect(result.current.items).toHaveLength(0)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone)
    })
    
    const itemId = result.current.items[0].id
    
    act(() => {
      result.current.updateQuantity(itemId, 5)
    })
    
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone)
    })
    
    const itemId = result.current.items[0].id
    
    act(() => {
      result.current.updateQuantity(itemId, 0)
    })
    
    expect(result.current.items).toHaveLength(0)
  })

  it('should update item notes', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone)
    })
    
    const itemId = result.current.items[0].id
    
    act(() => {
      result.current.updateNotes(itemId, 'Test notes')
    })
    
    expect(result.current.items[0].notes).toBe('Test notes')
  })

  it('should clear cart', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone)
      result.current.clearCart()
    })
    
    expect(result.current.items).toHaveLength(0)
    expect(result.current.coupon).toBeNull()
  })

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone, 2)
    })
    
    expect(result.current.getTotalPrice()).toBe(1000) // 500 * 2
  })

  it('should calculate total items correctly', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone, 3)
    })
    
    expect(result.current.getTotalItems()).toBe(3)
  })

  it('should calculate item count correctly', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.addItem(mockGemstone)
      result.current.addItem({ ...mockGemstone, id: 'gem-002' })
    })
    
    expect(result.current.getItemCount()).toBe(2)
  })

  it('should apply coupon successfully', async () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'TEST10',
        discount: 10,
        type: 'percentage'
      })
    } as Response)
    
    await act(async () => {
      const response = await result.current.applyCoupon('TEST10')
      expect(response.success).toBe(true)
    })
    
    expect(result.current.coupon).toEqual({
      code: 'TEST10',
      discount: 10,
      type: 'percentage'
    })
  })

  it('should handle coupon application failure', async () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid coupon' })
    } as Response)
    
    await act(async () => {
      const response = await result.current.applyCoupon('INVALID')
      expect(response.success).toBe(false)
      expect(response.message).toBe('Invalid coupon')
    })
    
    expect(result.current.coupon).toBeNull()
  })

  it('should remove coupon', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.coupon = {
        code: 'TEST10',
        discount: 10,
        type: 'percentage'
      }
      result.current.removeCoupon()
    })
    
    expect(result.current.coupon).toBeNull()
  })

  it('should save cart to server', async () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    } as Response)
    
    act(() => {
      result.current.addItem(mockGemstone)
    })
    
    await act(async () => {
      await result.current.saveCartToServer('user123')
    })
    
    expect(mockFetch).toHaveBeenCalledWith('/api/cart/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'user123',
        items: result.current.items,
        coupon: null
      })
    })
  })

  it('should load cart from server', async () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    const serverCart = {
      items: [{
        id: 'server-item-1',
        gemstone: mockGemstone,
        quantity: 2,
        addedAt: new Date().toISOString(),
        notes: 'Server notes'
      }],
      coupon: {
        code: 'SERVER10',
        discount: 10,
        type: 'percentage'
      }
    }
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => serverCart
    } as Response)
    
    await act(async () => {
      await result.current.loadCartFromServer('user123')
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.coupon).toEqual(serverCart.coupon)
  })

  it('should toggle auto save', () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    expect(result.current.autoSave).toBe(true)
    
    act(() => {
      result.current.setAutoSave(false)
    })
    
    expect(result.current.autoSave).toBe(false)
  })

  it('should not save to server when auto save is disabled', async () => {
    const { result } = renderHook(() => usePersistentCartStore())
    
    act(() => {
      result.current.setAutoSave(false)
      result.current.addItem(mockGemstone)
    })
    
    await act(async () => {
      await result.current.saveCartToServer('user123')
    })
    
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
