import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { Gemstone } from '@/lib/types/gemstone';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

const mockGemstones: Gemstone[] = [
  {
    id: '1',
    name: 'Smaragd',
    type: 'cut',
    description: 'Ein wunderschöner Smaragd',
    price: 5000,
    currency: 'EUR',
    images: ['/test1.jpg'],
    mainImage: '/test1.jpg',
    origin: 'Kolumbien',
    dimensions: { length: 10, width: 8, height: 6 },
    treatment: { treated: false },
    certification: { certified: true, lab: 'GIA' },
    inStock: true,
    quantity: 10,
    category: 'Smaragd',
    color: 'Grün',
    createdAt: new Date(),
    updatedAt: new Date(),
    caratWeight: 2.5,
    cut: 'Brillant',
    cutQuality: 'Excellent',
    clarity: 'VVS1',
    symmetry: 'Excellent',
    polish: 'Excellent',
  },
  {
    id: '2',
    name: 'Rubin',
    type: 'rough',
    description: 'Ein roher Rubin',
    price: 3000,
    currency: 'EUR',
    images: ['/test2.jpg'],
    mainImage: '/test2.jpg',
    origin: 'Myanmar',
    dimensions: { length: 12, width: 10, height: 8 },
    treatment: { treated: true, type: 'heated' },
    certification: { certified: false },
    inStock: false,
    quantity: 0,
    category: 'Rubin',
    color: 'Rot',
    createdAt: new Date(),
    updatedAt: new Date(),
    gramWeight: 5.0,
    crystalQuality: 'Very Good',
    transparency: 'Translucent',
  },
];

describe('DashboardStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    expect(screen.getByText('Dashboard Statistiken')).toBeInTheDocument();
    expect(screen.getByText('Lade Statistiken...')).toBeInTheDocument();
  });

  it('renders dashboard statistics after loading', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Gesamtumsatz')).toBeInTheDocument();
      expect(screen.getByText('Bestellungen')).toBeInTheDocument();
      expect(screen.getByText('Kunden')).toBeInTheDocument();
      expect(screen.getByText('Produkte')).toBeInTheDocument();
    });
  });

  it('displays key metrics correctly', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      // Check that key metrics are displayed
      expect(screen.getByText('Gesamtumsatz')).toBeInTheDocument();
      expect(screen.getByText('Bestellungen')).toBeInTheDocument();
      expect(screen.getByText('Kunden')).toBeInTheDocument();
      expect(screen.getByText('Produkte')).toBeInTheDocument();
    });
  });

  it('displays product status information', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Lagerbestand')).toBeInTheDocument();
      expect(screen.getByText('Verfügbar')).toBeInTheDocument();
      expect(screen.getByText('Ausverkauft')).toBeInTheDocument();
      expect(screen.getByText('Niedrig')).toBeInTheDocument();
    });
  });

  it('displays certification statistics', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Zertifizierung')).toBeInTheDocument();
      expect(screen.getByText('Zertifiziert')).toBeInTheDocument();
      expect(screen.getByText('Nicht zertifiziert')).toBeInTheDocument();
      expect(screen.getByText('Zertifizierungsrate')).toBeInTheDocument();
    });
  });

  it('displays price statistics', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Preis-Statistiken')).toBeInTheDocument();
      expect(screen.getByText('Durchschnitt')).toBeInTheDocument();
      expect(screen.getByText('Median')).toBeInTheDocument();
      expect(screen.getByText('Bereich')).toBeInTheDocument();
    });
  });

  it('displays top selling products', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Beliebteste Produkte')).toBeInTheDocument();
    });
  });

  it('displays category statistics', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Kategorien-Statistiken')).toBeInTheDocument();
    });
  });

  it('displays origin statistics', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Herkunft-Statistiken')).toBeInTheDocument();
    });
  });

  it('displays treatment statistics', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Behandlungs-Statistiken')).toBeInTheDocument();
    });
  });

  it('displays weight statistics', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText('Gewichts-Statistiken')).toBeInTheDocument();
      expect(screen.getByText('Geschliffene Steine (Karat)')).toBeInTheDocument();
      expect(screen.getByText('Rohsteine (Gramm)')).toBeInTheDocument();
    });
  });

  it('handles refresh button click', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      const refreshButton = screen.getByText('Aktualisieren');
      expect(refreshButton).toBeInTheDocument();
      
      fireEvent.click(refreshButton);
    });
  });

  it('handles export button click', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      const exportButton = screen.getByText('Export CSV');
      expect(exportButton).toBeInTheDocument();
      
      fireEvent.click(exportButton);
    });
    
    // Check that URL.createObjectURL was called
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('shows last updated timestamp', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Letzte Aktualisierung:/)).toBeInTheDocument();
    });
  });

  it('displays correct product counts', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      // Should show 2 total products
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('handles empty gemstones array', async () => {
    render(<DashboardStats gemstones={[]} />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard Statistiken')).toBeInTheDocument();
    });
  });

  it('displays revenue growth indicator', async () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    await waitFor(() => {
      // Should show either trending up or down icon
      const trendingIcons = screen.getAllByRole('img', { hidden: true });
      expect(trendingIcons.length).toBeGreaterThan(0);
    });
  });

  it('shows proper loading animation', () => {
    render(<DashboardStats gemstones={mockGemstones} />);
    
    // Check for loading spinner
    expect(screen.getByText('Lade Statistiken...')).toBeInTheDocument();
  });
});
