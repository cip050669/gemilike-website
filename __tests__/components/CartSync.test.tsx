import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { CartSync } from '@/components/cart/CartSync'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock the persistent cart store
jest.mock('@/lib/store/persistentCart', () => ({
  usePersistentCartStore: jest.fn()
}))

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('CartSync', () => {
  const mockStore = {
    isSyncing: false,
    lastSynced: null,
    autoSave: true,
    setAutoSave: jest.fn(),
    saveCartToServer: jest.fn(),
    loadCartFromServer: jest.fn(),
    items: []
  }

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'user123' } },
      status: 'authenticated'
    })
    
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    usePersistentCartStore.mockReturnValue(mockStore)
    
    mockFetch.mockClear()
    jest.clearAllMocks()
  })

  it('renders nothing when user is not authenticated', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })
    
    const { container } = render(<CartSync />)
    expect(container.firstChild).toBeNull()
  })

  it('renders sync status when user is authenticated', () => {
    render(<CartSync />)
    
    expect(screen.getByText('Auto-Sync')).toBeInTheDocument()
    expect(screen.getByText('Auto aus')).toBeInTheDocument()
  })

  it('shows syncing state', () => {
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    usePersistentCartStore.mockReturnValue({
      ...mockStore,
      isSyncing: true
    })
    
    render(<CartSync />)
    
    expect(screen.getByText('Synchronisiere...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument() // Spinning icon
  })

  it('shows offline state when auto save is disabled', () => {
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    usePersistentCartStore.mockReturnValue({
      ...mockStore,
      autoSave: false
    })
    
    render(<CartSync />)
    
    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.getByText('Auto an')).toBeInTheDocument()
  })

  it('displays last synced time', () => {
    const lastSynced = new Date('2024-01-01T10:30:00Z')
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    usePersistentCartStore.mockReturnValue({
      ...mockStore,
      lastSynced
    })
    
    render(<CartSync />)
    
    expect(screen.getByText('10:30')).toBeInTheDocument()
  })

  it('calls saveCartToServer when manual sync button is clicked', () => {
    render(<CartSync />)
    
    const syncButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(syncButton)
    
    expect(mockStore.saveCartToServer).toHaveBeenCalledWith('user123')
  })

  it('toggles auto save when toggle button is clicked', () => {
    render(<CartSync />)
    
    const toggleButton = screen.getByText('Auto aus')
    fireEvent.click(toggleButton)
    
    expect(mockStore.setAutoSave).toHaveBeenCalledWith(false)
  })

  it('loads cart from server when user logs in', () => {
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    const mockLoadCartFromServer = jest.fn()
    usePersistentCartStore.mockReturnValue({
      ...mockStore,
      loadCartFromServer: mockLoadCartFromServer
    })
    
    render(<CartSync />)
    
    expect(mockLoadCartFromServer).toHaveBeenCalledWith('user123')
  })

  it('auto-saves cart when items change', async () => {
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    const mockSaveCartToServer = jest.fn()
    usePersistentCartStore.mockReturnValue({
      ...mockStore,
      saveCartToServer: mockSaveCartToServer,
      items: [{ id: 'item1', gemstone: { id: 'gem1' }, quantity: 1 }]
    })
    
    render(<CartSync />)
    
    // Wait for debounced auto-save
    await waitFor(() => {
      expect(mockSaveCartToServer).toHaveBeenCalledWith('user123')
    }, { timeout: 3000 })
  })

  it('does not auto-save when auto save is disabled', async () => {
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    const mockSaveCartToServer = jest.fn()
    usePersistentCartStore.mockReturnValue({
      ...mockStore,
      autoSave: false,
      saveCartToServer: mockSaveCartToServer,
      items: [{ id: 'item1', gemstone: { id: 'gem1' }, quantity: 1 }]
    })
    
    render(<CartSync />)
    
    // Wait to ensure auto-save doesn't trigger
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    expect(mockSaveCartToServer).not.toHaveBeenCalled()
  })

  it('does not auto-save when cart is empty', async () => {
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    const mockSaveCartToServer = jest.fn()
    usePersistentCartStore.mockReturnValue({
      ...mockStore,
      saveCartToServer: mockSaveCartToServer,
      items: []
    })
    
    render(<CartSync />)
    
    // Wait to ensure auto-save doesn't trigger
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    expect(mockSaveCartToServer).not.toHaveBeenCalled()
  })

  it('shows correct icons for different states', () => {
    const { usePersistentCartStore } = require('@/lib/store/persistentCart')
    usePersistentCartStore.mockReturnValue({
      ...mockStore,
      autoSave: false
    })
    
    render(<CartSync />)
    
    // Should show CloudOff icon for offline state
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })
})
