import { render, screen } from '@testing-library/react';
import type { Prisma } from '@prisma/client';
import CustomersPage from '@/app/[locale]/admin/customers/page';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    customer: {
      findMany: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

const buildCustomer = (overrides: Partial<Prisma.CustomerGetPayload<object>> = {}) => ({
  id: overrides.id ?? 'cust-1',
  userId: overrides.userId ?? null,
  customerNumber: overrides.customerNumber ?? 'CUST-0001',
  firstName: overrides.firstName ?? 'John',
  lastName: overrides.lastName ?? 'Doe',
  email: overrides.email ?? 'john@example.com',
  phone: overrides.phone ?? '+123456789',
  createdAt: overrides.createdAt ?? new Date('2024-01-01T00:00:00Z'),
  updatedAt: overrides.updatedAt ?? new Date('2024-01-05T00:00:00Z'),
  marketingOptIn: overrides.marketingOptIn ?? false,
  preferredLanguage: overrides.preferredLanguage ?? 'de',
  kycStatus: overrides.kycStatus ?? 'NOT_REQUIRED',
  notes: overrides.notes ?? null,
  metadata: overrides.metadata ?? null,
});

const renderCustomersPage = async () => {
  const Page = await CustomersPage();
  render(Page);
};

describe('CustomersPage (admin)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders header and description', async () => {
    mockedPrisma.customer.findMany.mockResolvedValue([buildCustomer()]);

    await renderCustomersPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Kunden' })).toBeInTheDocument();
    expect(
      screen.getByText('Verwalten Sie Ihre Kunden und deren Daten')
    ).toBeInTheDocument();
  });

  it('lists customers returned from the database', async () => {
    mockedPrisma.customer.findMany.mockResolvedValue([
      buildCustomer(),
      buildCustomer({
        id: 'cust-2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        customerNumber: 'CUST-0002',
      }),
    ]);

    await renderCustomersPage();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText(/Kunde: CUST-0001/)).toBeInTheDocument();
    expect(screen.getByText(/Kunde: CUST-0002/)).toBeInTheDocument();
  });

  it('shows customer count in table header', async () => {
    mockedPrisma.customer.findMany.mockResolvedValue([buildCustomer()]);

    await renderCustomersPage();

    expect(screen.getByText('Kunden (1 gefunden)')).toBeInTheDocument();
  });

  it('falls back gracefully when no customers are returned', async () => {
    mockedPrisma.customer.findMany.mockResolvedValue([]);

    await renderCustomersPage();

    expect(screen.getByText('Kunden (0 gefunden)')).toBeInTheDocument();
    // Table renders header even without rows
    expect(screen.getByRole('columnheader', { name: 'Kunde' })).toBeInTheDocument();
  });
});
