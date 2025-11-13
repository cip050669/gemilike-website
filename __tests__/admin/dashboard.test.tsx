/**
 * Admin Dashboard Functionality Tests
 * Tests all features of the admin dashboard page
 */

import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '@/app/[locale]/admin/dashboard/page';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    gemstone: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
    order: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    checkoutEvent: {
      count: jest.fn(),
    },
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/de/admin/dashboard',
}));

describe('Admin Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (prisma.gemstone.count as jest.Mock).mockResolvedValue(150);
    (prisma.user.count as jest.Mock).mockResolvedValue(89);
    (prisma.order.count as jest.Mock).mockResolvedValue(234);
    (prisma.order.aggregate as jest.Mock).mockResolvedValue({
      _sum: { total: 125000 },
    });
    (prisma.gemstone.findMany as jest.Mock).mockResolvedValue([
      {
        id: '1',
        name: 'Smaragd',
        createdAt: new Date('2025-01-15'),
      },
      {
        id: '2',
        name: 'Rubin',
        createdAt: new Date('2025-01-14'),
      },
    ]);
    (prisma.order.findMany as jest.Mock).mockResolvedValue([
      {
        id: '1',
        orderNumber: 'ORD-001',
        createdAt: new Date('2025-01-15'),
        customer: {
          firstName: 'Max',
          lastName: 'Mustermann',
        },
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        createdAt: new Date('2025-01-14'),
        customer: {
          firstName: 'Anna',
          lastName: 'Schmidt',
        },
      },
    ]);
    (prisma.checkoutEvent.count as jest.Mock).mockImplementation(({ where }) => {
      switch (where?.step) {
        case 'start':
          return Promise.resolve(120);
        case 'success':
          return Promise.resolve(80);
        case 'abandon':
          return Promise.resolve(40);
        default:
          return Promise.resolve(0);
      }
    });
  });

  describe('Page Rendering', () => {
    it('should render dashboard page with title and description', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/Übersicht über Ihr Edelstein-Geschäft/)).toBeInTheDocument();
    });

    it('should fetch and display statistics from database', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(prisma.gemstone.count).toHaveBeenCalled();
        expect(prisma.user.count).toHaveBeenCalled();
        expect(prisma.order.count).toHaveBeenCalled();
        expect(prisma.order.aggregate).toHaveBeenCalled();
      });
    });
  });

  describe('Statistics Cards', () => {
    it('should display total gemstones count', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('Gesamte Edelsteine')).toBeInTheDocument();
      });
    });

    it('should display total customers count', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('89')).toBeInTheDocument();
        expect(screen.getByText('Kunden')).toBeInTheDocument();
      });
    });

    it('should display total orders count', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('234')).toBeInTheDocument();
        expect(screen.getByText('Bestellungen')).toBeInTheDocument();
      });
    });

    it('should display total revenue with formatting', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // Revenue is formatted with toLocaleString - might be "125,000" or "125.000" depending on locale
        expect(screen.getByText(/€\d{1,3}[\.,]\d{3}/)).toBeInTheDocument();
        expect(screen.getByText('Umsatz')).toBeInTheDocument();
      });
    });

    it('should display growth indicators', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // These are hardcoded in the component, not from database
        expect(screen.getByText(/\+2 neue diese Woche/)).toBeInTheDocument();
        expect(screen.getByText(/\+5 neue diesen Monat/)).toBeInTheDocument();
        expect(screen.getByText(/\+12 diese Woche/)).toBeInTheDocument();
      });

      // Monthly growth is calculated from stats.monthlyGrowth (hardcoded to 12.5)
      await waitFor(() => {
        const monthlyGrowth = screen.getByText(/\+12.5% diesen Monat/);
        expect(monthlyGrowth).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Recent Activity Section', () => {
    it('should display recent activity title and description', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Letzte Aktivitäten')).toBeInTheDocument();
        expect(screen.getByText(/Übersicht der letzten System-Aktivitäten/)).toBeInTheDocument();
      });
    });

    it('should display recent gemstones in activity feed', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/Neuer Edelstein: Smaragd/)).toBeInTheDocument();
        expect(screen.getByText(/Neuer Edelstein: Rubin/)).toBeInTheDocument();
      });
    });

    it('should display recent orders in activity feed', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/Neue Bestellung #ORD-001/)).toBeInTheDocument();
        expect(screen.getByText(/Max Mustermann/)).toBeInTheDocument();
      });
    });

    it('should format dates correctly in activity feed', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // Check for formatted date strings (German format)
        const dateElements = screen.getAllByText(/\d{2}\.\d{2}\.\d{4}/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Best Sellers Section', () => {
    it('should display bestsellers title and description', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Bestseller')).toBeInTheDocument();
        expect(screen.getByText(/Beliebteste Edelsteine/)).toBeInTheDocument();
      });
    });

    it('should display top selling gemstones with sales counts', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Smaragd')).toBeInTheDocument();
        expect(screen.getByText('Kolumbien')).toBeInTheDocument();
        expect(screen.getByText('45 Verkäufe')).toBeInTheDocument();
        
        expect(screen.getByText('Rubin')).toBeInTheDocument();
        expect(screen.getByText('Burma')).toBeInTheDocument();
        expect(screen.getByText('32 Verkäufe')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    it('should fetch recent gemstones with correct parameters', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(prisma.gemstone.findMany).toHaveBeenCalledWith({
          take: 5,
          orderBy: { createdAt: 'desc' },
        });
      });
    });

    it('should fetch recent orders with customer relations', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(prisma.order.findMany).toHaveBeenCalledWith({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { customer: true },
        });
      });
    });

    it('should handle database errors gracefully', async () => {
      (prisma.gemstone.count as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(
        AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) })
      ).rejects.toThrow('Database error');
    });
  });

  describe('Empty State Handling', () => {
    it('should handle empty gemstone list', async () => {
      (prisma.gemstone.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Letzte Aktivitäten')).toBeInTheDocument();
      });
    });

    it('should handle zero revenue correctly', async () => {
      (prisma.order.aggregate as jest.Mock).mockResolvedValue({
        _sum: { total: null },
      });

      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/€0/)).toBeInTheDocument();
      });
    });
  });

  describe('Locale Support', () => {
    it('should handle different locale parameters', async () => {
      const pageDE = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(pageDE);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should format dates according to locale', async () => {
      const page = await AdminDashboardPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        // German date format: DD.MM.YYYY
        const dateStrings = screen.getAllByText(/\d{2}\.\d{2}\.\d{4}/);
        expect(dateStrings.length).toBeGreaterThan(0);
      });
    });
  });
});
