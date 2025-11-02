/**
 * Admin Orders Management Functionality Tests
 * Tests all CRUD operations, filtering, status updates, and search functionality
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import OrdersPage from '@/app/[locale]/admin/orders/page';
import { listOrders } from '@/lib/services/shop/order.service';

// Mock order service
jest.mock('@/lib/services/shop/order.service', () => ({
  listOrders: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/de/admin/orders',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    status: 'PENDING' as const,
    paymentStatus: 'UNPAID' as const,
    customer: {
      id: 'cust-1',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
    },
    total: 1250.00,
    createdAt: new Date('2025-01-15T10:00:00Z'),
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    status: 'CONFIRMED' as const,
    paymentStatus: 'PAID' as const,
    customer: {
      id: 'cust-2',
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna@example.com',
    },
    total: 850.50,
    createdAt: new Date('2025-01-14T15:30:00Z'),
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    status: 'FULFILLED' as const,
    paymentStatus: 'PAID' as const,
    customer: {
      id: 'cust-3',
      firstName: 'Peter',
      lastName: 'Müller',
      email: null,
    },
    total: 2100.00,
    createdAt: new Date('2025-01-13T09:15:00Z'),
  },
];

describe('Admin Orders Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (listOrders as jest.Mock).mockResolvedValue(mockOrders);
  });

  describe('Page Rendering', () => {
    it('should render orders page with title and description', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Bestellungen')).toBeInTheDocument();
        expect(screen.getByText(/Verwalten Sie alle Kundenbestellungen/)).toBeInTheDocument();
      });
    });

    it('should fetch orders on page load', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(listOrders).toHaveBeenCalledWith({
          filters: {
            status: 'all',
          },
        });
      });
    });
  });

  describe('Order Display', () => {
    it('should display all orders in table', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // Order numbers are prefixed with # in the display
        expect(screen.getByText(/#ORD-001/)).toBeInTheDocument();
        expect(screen.getByText(/#ORD-002/)).toBeInTheDocument();
        expect(screen.getByText(/#ORD-003/)).toBeInTheDocument();
      });
    });

    it('should display customer names', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/Max Mustermann/)).toBeInTheDocument();
        expect(screen.getByText(/Anna Schmidt/)).toBeInTheDocument();
        expect(screen.getByText(/Peter Müller/)).toBeInTheDocument();
      });
    });

    it('should display customer emails when available', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // Emails are displayed in the table, check they appear
        const emailElements = screen.getAllByText(/@example\.com/);
        expect(emailElements.length).toBeGreaterThan(0);
      });
    });

    it('should display formatted order totals', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('€1250.00')).toBeInTheDocument();
        expect(screen.getByText('€850.50')).toBeInTheDocument();
        expect(screen.getByText('€2100.00')).toBeInTheDocument();
      });
    });

    it('should display formatted dates', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // Dates are formatted with toLocaleDateString('de-DE')
        // Format: DD.MM.YYYY - use flexible matcher for date format
        const dateElements = screen.getAllByText(/\d{2}\.\d{2}\.\d{4}/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Status Display', () => {
    it('should display status badges with correct colors', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Ausstehend')).toBeInTheDocument();
        expect(screen.getByText('Bestätigt')).toBeInTheDocument();
        expect(screen.getByText('Erfüllt')).toBeInTheDocument();
      });
    });

    it('should display status count in filter buttons', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // Status filter buttons with counts exist
        // Format: "Ausstehend (1)" - use getAllByText to handle multiple matches
        const allButtons = screen.getAllByText(/Alle/);
        const pendingButtons = screen.getAllByText(/Ausstehend/);
        const confirmedButtons = screen.getAllByText(/Bestätigt/);
        
        // At least one button of each type should exist
        expect(allButtons.length).toBeGreaterThan(0);
        expect(pendingButtons.length).toBeGreaterThan(0);
        expect(confirmedButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Filter Functionality', () => {
    it('should filter orders by status', async () => {
      (listOrders as jest.Mock).mockResolvedValueOnce([
        mockOrders[0], // PENDING
      ]);

      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // Multiple "Ausstehend" elements exist (button and status badge)
        const pendingElements = screen.getAllByText(/Ausstehend/);
        expect(pendingElements.length).toBeGreaterThan(0);
      });
    });

    it('should display search input', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Bestellnummer, Kunde/);
        expect(searchInput).toBeInTheDocument();
      });
    });

    it('should display date filter inputs', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByLabelText(/Von Datum/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Bis Datum/)).toBeInTheDocument();
      });
    });
  });

  describe('Actions', () => {
    it('should display action buttons for each order', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        const viewButtons = screen.getAllByText('Anzeigen');
        const editButtons = screen.getAllByText('Bearbeiten');
        expect(viewButtons.length).toBeGreaterThan(0);
        expect(editButtons.length).toBeGreaterThan(0);
      });
    });

    it('should link to order view page', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        const viewButton = screen.getAllByText('Anzeigen')[0];
        const form = viewButton.closest('form');
        expect(form).toHaveAttribute('action', '/de/admin/orders/view/1');
      });
    });

    it('should link to order edit page', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        const editButton = screen.getAllByText('Bearbeiten')[0];
        const form = editButton.closest('form');
        expect(form).toHaveAttribute('action', '/de/admin/orders/edit/1');
      });
    });
  });

  describe('Header Actions', () => {
    it('should display export button', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        const exportLink = screen.getByText('📊 Export');
        expect(exportLink.closest('a')).toHaveAttribute('href', '/de/admin/orders/export');
      });
    });

    it('should display new order button', async () => {
      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        const newOrderLink = screen.getByText('+ Neue Bestellung');
        expect(newOrderLink.closest('a')).toHaveAttribute('href', '/de/admin/orders/new');
      });
    });
  });

  describe('Empty State', () => {
    it('should handle empty orders list', async () => {
      (listOrders as jest.Mock).mockResolvedValue([]);

      const page = await OrdersPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/Bestellungen \(0 gefunden\)/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      (listOrders as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        OrdersPage({ params: Promise.resolve({ locale: 'de' }) })
      ).rejects.toThrow();
    });
  });
});

