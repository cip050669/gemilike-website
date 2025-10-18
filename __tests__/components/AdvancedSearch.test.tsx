import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdvancedSearch } from '@/components/shop/AdvancedSearch';
import { Gemstone } from '@/lib/types/gemstone';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock fetch
global.fetch = jest.fn();

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
    quantity: 1,
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
    inStock: true,
    quantity: 1,
    category: 'Rubin',
    color: 'Rot',
    createdAt: new Date(),
    updatedAt: new Date(),
    gramWeight: 5.0,
    crystalQuality: 'Very Good',
    transparency: 'Translucent',
  },
];

describe('AdvancedSearch', () => {
  const mockOnFilter = jest.fn();
  const mockOnSaveSearch = jest.fn();
  const mockOnLoadSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input and filter button', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
      />
    );

    expect(screen.getByPlaceholderText(/Suche nach Name, Beschreibung, Kategorie oder Farbe/)).toBeInTheDocument();
    expect(screen.getByText('Erweiterte Suche')).toBeInTheDocument();
    expect(screen.getByText('Zurücksetzen')).toBeInTheDocument();
  });

  it('opens filter panel when filter button is clicked', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
      />
    );

    const filterButton = screen.getByText('Erweiterte Suche');
    fireEvent.click(filterButton);

    expect(screen.getByText('Erweiterte Suchfilter')).toBeInTheDocument();
    expect(screen.getByText('Grundlagen')).toBeInTheDocument();
    expect(screen.getByText('Qualität')).toBeInTheDocument();
    expect(screen.getByText('Abmessungen')).toBeInTheDocument();
    expect(screen.getByText('Besonderheiten')).toBeInTheDocument();
  });

  it('displays filter options correctly', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
      />
    );

    const filterButton = screen.getByText('Erweiterte Suche');
    fireEvent.click(filterButton);

    // Check basic filters
    expect(screen.getByText('Kategorie')).toBeInTheDocument();
    expect(screen.getByText('Herkunft')).toBeInTheDocument();
    expect(screen.getByText('Typ')).toBeInTheDocument();
    expect(screen.getByText('Farbe')).toBeInTheDocument();
  });

  it('updates search term when typing', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Suche nach Name, Beschreibung, Kategorie oder Farbe/);
    fireEvent.change(searchInput, { target: { value: 'Smaragd' } });

    expect(searchInput).toHaveValue('Smaragd');
  });

  it('applies filters when search is performed', async () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Suche nach Name, Beschreibung, Kategorie oder Farbe/);
    fireEvent.change(searchInput, { target: { value: 'Smaragd' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalled();
    });
  });

  it('shows save search button when onSaveSearch is provided', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
        onSaveSearch={mockOnSaveSearch}
      />
    );

    expect(screen.getByText('Suche speichern')).toBeInTheDocument();
  });

  it('opens save dialog when save button is clicked', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
        onSaveSearch={mockOnSaveSearch}
      />
    );

    const saveButton = screen.getByText('Suche speichern');
    fireEvent.click(saveButton);

    expect(screen.getByText('Suche speichern')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/z.B. 'Hochwertige Smaragde'/)).toBeInTheDocument();
  });

  it('displays saved searches when provided', () => {
    const savedSearches = [
      {
        id: '1',
        name: 'Hochwertige Smaragde',
        filters: {} as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      },
    ];

    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
        savedSearches={savedSearches}
        onLoadSearch={mockOnLoadSearch}
      />
    );

    expect(screen.getByText('Gespeicherte Suchen:')).toBeInTheDocument();
    expect(screen.getByText('Hochwertige Smaragde')).toBeInTheDocument();
  });

  it('loads saved search when clicked', () => {
    const savedSearches = [
      {
        id: '1',
        name: 'Hochwertige Smaragde',
        filters: {} as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      },
    ];

    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
        savedSearches={savedSearches}
        onLoadSearch={mockOnLoadSearch}
      />
    );

    const savedSearchButton = screen.getByText('Hochwertige Smaragde');
    fireEvent.click(savedSearchButton);

    expect(mockOnLoadSearch).toHaveBeenCalledWith(savedSearches[0]);
  });

  it('resets filters when reset button is clicked', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Suche nach Name, Beschreibung, Kategorie oder Farbe/);
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    const resetButton = screen.getByText('Zurücksetzen');
    fireEvent.click(resetButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnFilter).toHaveBeenCalledWith(mockGemstones);
  });

  it('shows active filters count', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Suche nach Name, Beschreibung, Kategorie oder Farbe/);
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // The count should appear in the filter button
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles tab switching correctly', () => {
    render(
      <AdvancedSearch
        gemstones={mockGemstones}
        onFilter={mockOnFilter}
      />
    );

    const filterButton = screen.getByText('Erweiterte Suche');
    fireEvent.click(filterButton);

    // Click on different tabs
    fireEvent.click(screen.getByText('Qualität'));
    expect(screen.getByText('Behandlung')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Abmessungen'));
    expect(screen.getByText('Länge:')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Besonderheiten'));
    expect(screen.getByText('Nur mit Videos')).toBeInTheDocument();
  });
});
