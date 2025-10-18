import { render, screen } from '@testing-library/react'
import { AdminNavigation } from '@/components/admin/AdminNavigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/admin')
}))

describe('AdminNavigation', () => {
  it('renders all navigation items', () => {
    render(<AdminNavigation />)
    
    expect(screen.getByText('Edelsteine')).toBeInTheDocument()
    expect(screen.getByText('Kunden')).toBeInTheDocument()
    expect(screen.getByText('Audit-Log')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Bestellungen')).toBeInTheDocument()
    expect(screen.getByText('Berichte')).toBeInTheDocument()
    expect(screen.getByText('Einstellungen')).toBeInTheDocument()
  })

  it('renders navigation icons', () => {
    render(<AdminNavigation />)
    
    // Check if icons are present (they should be SVG elements)
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it('highlights active navigation item', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/admin/customers')
    
    render(<AdminNavigation />)
    
    const customersLink = screen.getByText('Kunden').closest('a')
    expect(customersLink).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('does not highlight inactive navigation items', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/admin/customers')
    
    render(<AdminNavigation />)
    
    const gemstonesLink = screen.getByText('Edelsteine').closest('a')
    expect(gemstonesLink).toHaveClass('text-muted-foreground')
    expect(gemstonesLink).not.toHaveClass('bg-primary')
  })

  it('has correct href attributes', () => {
    render(<AdminNavigation />)
    
    expect(screen.getByText('Edelsteine').closest('a')).toHaveAttribute('href', '/admin')
    expect(screen.getByText('Kunden').closest('a')).toHaveAttribute('href', '/admin/customers')
    expect(screen.getByText('Audit-Log').closest('a')).toHaveAttribute('href', '/admin/audit')
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/admin/dashboard')
    expect(screen.getByText('Bestellungen').closest('a')).toHaveAttribute('href', '/admin/orders')
    expect(screen.getByText('Berichte').closest('a')).toHaveAttribute('href', '/admin/reports')
    expect(screen.getByText('Einstellungen').closest('a')).toHaveAttribute('href', '/admin/settings')
  })

  it('applies hover styles to inactive items', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/admin')
    
    render(<AdminNavigation />)
    
    const customersLink = screen.getByText('Kunden').closest('a')
    expect(customersLink).toHaveClass('hover:text-foreground', 'hover:bg-muted')
  })

  it('has proper accessibility attributes', () => {
    render(<AdminNavigation />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Admin Navigation')
  })

  it('renders as a flex container', () => {
    render(<AdminNavigation />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('flex', 'space-x-8')
  })
})
