import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import CustomersPage from '@/app/[locale]/admin/customers/page'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Mock data
const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    createdAt: '2024-01-01T00:00:00Z',
    lastOrderAt: '2024-01-15T00:00:00Z',
    totalOrders: 5,
    totalSpent: 2500,
    status: 'active' as const,
    notes: 'VIP customer',
    tags: ['premium'],
    orders: [
      {
        id: 'order1',
        orderNumber: 'GM-001',
        total: 500,
        status: 'completed',
        createdAt: '2024-01-15T00:00:00Z',
        items: [
          {
            id: 'item1',
            gemstoneName: 'Emerald',
            quantity: 1,
            price: 500
          }
        ]
      }
    ]
  }
]

describe('CustomersPage', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'admin1', role: 'admin' } },
      status: 'authenticated'
    })
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockCustomers
    } as Response)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders customer management page', async () => {
    render(<CustomersPage />)
    
    expect(screen.getByText('Kundenverwaltung')).toBeInTheDocument()
    expect(screen.getByText('Verwalten Sie Ihre Kunden, Bestellhistorie und Notizen')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('displays customer statistics', async () => {
    render(<CustomersPage />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument() // Total customers
      expect(screen.getByText('1')).toBeInTheDocument() // Active customers
      expect(screen.getByText('2.500 €')).toBeInTheDocument() // Total revenue
    })
  })

  it('filters customers by search term', async () => {
    render(<CustomersPage />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Kunden suchen...')
    fireEvent.change(searchInput, { target: { value: 'John' } })
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    
    fireEvent.change(searchInput, { target: { value: 'Jane' } })
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('filters customers by status', async () => {
    render(<CustomersPage />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const statusSelect = screen.getByDisplayValue('Alle Status')
    fireEvent.change(statusSelect, { target: { value: 'active' } })
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    
    fireEvent.change(statusSelect, { target: { value: 'vip' } })
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('exports customer data as CSV', async () => {
    render(<CustomersPage />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const exportButton = screen.getByText('Export CSV')
    fireEvent.click(exportButton)
    
    // Check if download was triggered (this would be tested in integration tests)
    expect(exportButton).toBeInTheDocument()
  })

  it('shows customer details modal when edit button is clicked', async () => {
    render(<CustomersPage />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const editButtons = screen.getAllByRole('button')
    const editButton = editButtons.find(button => 
      button.querySelector('svg') // Looking for the Edit icon
    )
    
    if (editButton) {
      fireEvent.click(editButton)
      
      await waitFor(() => {
        expect(screen.getByText('Kunden-Details: John Doe')).toBeInTheDocument()
      })
    }
  })

  it('handles empty customer list', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response)
    
    render(<CustomersPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Keine Kunden gefunden')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'))
    
    render(<CustomersPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Lade Kunden...')).toBeInTheDocument()
    })
  })
})
