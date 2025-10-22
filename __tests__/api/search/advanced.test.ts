import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/search/advanced/route';
import { getServerSession } from 'next-auth';

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock gemstones data
jest.mock('@/lib/data/gemstones', () => ({
  allGemstones: [
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
  ],
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('/api/search/advanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue({
      user: { id: 'test-user' },
    } as any);
  });

  describe('POST', () => {
    it('performs search with text filter', async () => {
      const filters = {
        searchTerm: 'Smaragd',
        category: 'all',
        origin: 'all',
        type: 'all',
        priceRange: [0, 100000],
        weightRange: [0, 100],
        treatment: 'all',
        certification: 'all',
        inStockOnly: false,
        color: 'all',
        clarity: 'all',
        cutQuality: 'all',
        symmetry: 'all',
        polish: 'all',
        colorGrade: 'all',
        colorIntensity: 'all',
        crystalQuality: 'all',
        transparency: 'all',
        dimensionsRange: {
          length: [0, 50],
          width: [0, 50],
          height: [0, 50],
        },
        hasVideos: false,
        hasCertificates: false,
        estimatedYieldRange: [0, 100],
      };

      const request = new NextRequest('http://localhost:3000/api/search/advanced', {
        method: 'POST',
        body: JSON.stringify(filters),
        headers: {
          'Content-Type': 'application/json',
          'user-agent': 'test-agent',
          'x-forwarded-for': '127.0.0.1',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.gemstones).toHaveLength(1);
      expect(data.gemstones[0].name).toBe('Smaragd');
      expect(data.appliedFilters).toContain('Suche: "Smaragd"');
    });

    it('performs search with category filter', async () => {
      const filters = {
        searchTerm: '',
        category: 'Smaragd',
        origin: 'all',
        type: 'all',
        priceRange: [0, 100000],
        weightRange: [0, 100],
        treatment: 'all',
        certification: 'all',
        inStockOnly: false,
        color: 'all',
        clarity: 'all',
        cutQuality: 'all',
        symmetry: 'all',
        polish: 'all',
        colorGrade: 'all',
        colorIntensity: 'all',
        crystalQuality: 'all',
        transparency: 'all',
        dimensionsRange: {
          length: [0, 50],
          width: [0, 50],
          height: [0, 50],
        },
        hasVideos: false,
        hasCertificates: false,
        estimatedYieldRange: [0, 100],
      };

      const request = new NextRequest('http://localhost:3000/api/search/advanced', {
        method: 'POST',
        body: JSON.stringify(filters),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.gemstones).toHaveLength(1);
      expect(data.gemstones[0].category).toBe('Smaragd');
      expect(data.appliedFilters).toContain('Kategorie: Smaragd');
    });

    it('performs search with price range filter', async () => {
      const filters = {
        searchTerm: '',
        category: 'all',
        origin: 'all',
        type: 'all',
        priceRange: [4000, 6000],
        weightRange: [0, 100],
        treatment: 'all',
        certification: 'all',
        inStockOnly: false,
        color: 'all',
        clarity: 'all',
        cutQuality: 'all',
        symmetry: 'all',
        polish: 'all',
        colorGrade: 'all',
        colorIntensity: 'all',
        crystalQuality: 'all',
        transparency: 'all',
        dimensionsRange: {
          length: [0, 50],
          width: [0, 50],
          height: [0, 50],
        },
        hasVideos: false,
        hasCertificates: false,
        estimatedYieldRange: [0, 100],
      };

      const request = new NextRequest('http://localhost:3000/api/search/advanced', {
        method: 'POST',
        body: JSON.stringify(filters),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.gemstones).toHaveLength(1);
      expect(data.gemstones[0].price).toBe(5000);
      expect(data.appliedFilters).toContain('Preis: €4,000 - €6,000');
    });

    it('performs search with treatment filter', async () => {
      const filters = {
        searchTerm: '',
        category: 'all',
        origin: 'all',
        type: 'all',
        priceRange: [0, 100000],
        weightRange: [0, 100],
        treatment: 'untreated',
        certification: 'all',
        inStockOnly: false,
        color: 'all',
        clarity: 'all',
        cutQuality: 'all',
        symmetry: 'all',
        polish: 'all',
        colorGrade: 'all',
        colorIntensity: 'all',
        crystalQuality: 'all',
        transparency: 'all',
        dimensionsRange: {
          length: [0, 50],
          width: [0, 50],
          height: [0, 50],
        },
        hasVideos: false,
        hasCertificates: false,
        estimatedYieldRange: [0, 100],
      };

      const request = new NextRequest('http://localhost:3000/api/search/advanced', {
        method: 'POST',
        body: JSON.stringify(filters),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.gemstones).toHaveLength(1);
      expect(data.gemstones[0].treatment.treated).toBe(false);
      expect(data.appliedFilters).toContain('Behandlung: Unbehandelt');
    });

    it('performs search with certification filter', async () => {
      const filters = {
        searchTerm: '',
        category: 'all',
        origin: 'all',
        type: 'all',
        priceRange: [0, 100000],
        weightRange: [0, 100],
        treatment: 'all',
        certification: 'certified',
        inStockOnly: false,
        color: 'all',
        clarity: 'all',
        cutQuality: 'all',
        symmetry: 'all',
        polish: 'all',
        colorGrade: 'all',
        colorIntensity: 'all',
        crystalQuality: 'all',
        transparency: 'all',
        dimensionsRange: {
          length: [0, 50],
          width: [0, 50],
          height: [0, 50],
        },
        hasVideos: false,
        hasCertificates: false,
        estimatedYieldRange: [0, 100],
      };

      const request = new NextRequest('http://localhost:3000/api/search/advanced', {
        method: 'POST',
        body: JSON.stringify(filters),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.gemstones).toHaveLength(1);
      expect(data.gemstones[0].certification.certified).toBe(true);
      expect(data.appliedFilters).toContain('Zertifizierung: Zertifiziert');
    });

    it('returns suggestions when no results found', async () => {
      const filters = {
        searchTerm: 'xyz',
        category: 'all',
        origin: 'all',
        type: 'all',
        priceRange: [0, 100000],
        weightRange: [0, 100],
        treatment: 'all',
        certification: 'all',
        inStockOnly: false,
        color: 'all',
        clarity: 'all',
        cutQuality: 'all',
        symmetry: 'all',
        polish: 'all',
        colorGrade: 'all',
        colorIntensity: 'all',
        crystalQuality: 'all',
        transparency: 'all',
        dimensionsRange: {
          length: [0, 50],
          width: [0, 50],
          height: [0, 50],
        },
        hasVideos: false,
        hasCertificates: false,
        estimatedYieldRange: [0, 100],
      };

      const request = new NextRequest('http://localhost:3000/api/search/advanced', {
        method: 'POST',
        body: JSON.stringify(filters),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.gemstones).toHaveLength(0);
      expect(data.suggestions).toBeDefined();
    });

    it('handles search error', async () => {
      const request = new NextRequest('http://localhost:3000/api/search/advanced', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Search failed');
    });
  });

  describe('GET', () => {
    it('returns suggestions for valid query', async () => {
      const request = new NextRequest('http://localhost:3000/api/search/advanced?q=sma');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toContain('Smaragd');
    });

    it('returns empty suggestions for short query', async () => {
      const request = new NextRequest('http://localhost:3000/api/search/advanced?q=s');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toEqual([]);
    });

    it('returns empty suggestions for no query', async () => {
      const request = new NextRequest('http://localhost:3000/api/search/advanced');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toEqual([]);
    });

    it('handles suggestions error', async () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const request = new NextRequest('http://localhost:3000/api/search/advanced?q=test');

      // Mock an error by making the request invalid
      Object.defineProperty(request, 'url', {
        value: 'invalid-url',
        writable: true,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to get suggestions');

      consoleSpy.mockRestore();
    });
  });
});
