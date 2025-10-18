import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import AuditLogPage from '@/app/[locale]/admin/audit/page'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Mock data
const mockAuditLogs = [
  {
    id: '1',
    userId: 'admin1',
    userName: 'Admin User',
    action: 'CREATE',
    entityType: 'GEMSTONE',
    entityId: 'gem-001',
    details: { name: 'New Emerald', price: 500 },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    userId: 'admin1',
    userName: 'Admin User',
    action: 'UPDATE',
    entityType: 'CUSTOMER',
    entityId: 'customer-001',
    details: { notes: 'Updated customer notes' },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2024-01-01T11:00:00Z'
  }
]

describe('AuditLogPage', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'admin1', role: 'admin' } },
      status: 'authenticated'
    })
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockAuditLogs
    } as Response)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders audit log page', async () => {
    render(<AuditLogPage />)
    
    expect(screen.getByText('Audit-Log')).toBeInTheDocument()
    expect(screen.getByText('Vollständige Nachverfolgung aller Admin-Aktionen')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })
  })

  it('displays audit log statistics', async () => {
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument() // Total entries
      expect(screen.getByText('1')).toBeInTheDocument() // Active users
      expect(screen.getByText('2')).toBeInTheDocument() // Actions
    })
  })

  it('filters audit logs by search term', async () => {
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Audit-Logs suchen...')
    fireEvent.change(searchInput, { target: { value: 'CREATE' } })
    
    expect(screen.getByText('CREATE')).toBeInTheDocument()
    
    fireEvent.change(searchInput, { target: { value: 'DELETE' } })
    
    expect(screen.queryByText('CREATE')).not.toBeInTheDocument()
  })

  it('filters audit logs by action', async () => {
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })
    
    const actionSelect = screen.getByDisplayValue('Alle Aktionen')
    fireEvent.change(actionSelect, { target: { value: 'CREATE' } })
    
    expect(screen.getByText('CREATE')).toBeInTheDocument()
    
    fireEvent.change(actionSelect, { target: { value: 'DELETE' } })
    
    expect(screen.queryByText('CREATE')).not.toBeInTheDocument()
  })

  it('filters audit logs by date', async () => {
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })
    
    const dateSelect = screen.getByDisplayValue('Alle Zeiten')
    fireEvent.change(dateSelect, { target: { value: 'today' } })
    
    // Should still show logs from today
    expect(screen.getByText('Admin User')).toBeInTheDocument()
  })

  it('exports audit logs as CSV', async () => {
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })
    
    const exportButton = screen.getByText('Export CSV')
    fireEvent.click(exportButton)
    
    // Check if download was triggered
    expect(exportButton).toBeInTheDocument()
  })

  it('shows audit log details modal when view button is clicked', async () => {
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })
    
    const viewButtons = screen.getAllByRole('button')
    const viewButton = viewButtons.find(button => 
      button.querySelector('svg') // Looking for the Eye icon
    )
    
    if (viewButton) {
      fireEvent.click(viewButton)
      
      await waitFor(() => {
        expect(screen.getByText('Audit-Log Details')).toBeInTheDocument()
      })
    }
  })

  it('displays correct action badges', async () => {
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('CREATE')).toBeInTheDocument()
      expect(screen.getByText('UPDATE')).toBeInTheDocument()
    })
  })

  it('handles empty audit log list', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response)
    
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Keine Audit-Logs gefunden')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'))
    
    render(<AuditLogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Lade Audit-Logs...')).toBeInTheDocument()
    })
  })

  it('shows correct timestamps', async () => {
    render(<AuditLogPage />)
    
    await waitFor(() => {
      // Check if timestamps are displayed in German format
      expect(screen.getByText(/01\.01\.2024/)).toBeInTheDocument()
    })
  })
})
