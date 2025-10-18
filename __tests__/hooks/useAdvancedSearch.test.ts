import { renderHook, act } from '@testing-library/react';
import { useAdvancedSearch } from '@/lib/hooks/useAdvancedSearch';
import { SearchFilters } from '@/components/shop/AdvancedSearch';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'test-user' } },
    status: 'authenticated',
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('useAdvancedSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAdvancedSearch());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.results).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.appliedFilters).toEqual([]);
    expect(result.current.searchTime).toBe(0);
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.savedSearches).toEqual([]);
    expect(result.current.isLoadingSavedSearches).toBe(false);
  });

  it('performs search successfully', async () => {
    const mockSearchResult = {
      gemstones: [{ id: '1', name: 'Test Gemstone' }],
      totalCount: 1,
      appliedFilters: ['Kategorie: Smaragd'],
      searchTime: 50,
      suggestions: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSearchResult,
    });

    const { result } = renderHook(() => useAdvancedSearch());

    const filters: SearchFilters = {
      searchTerm: 'test',
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

    await act(async () => {
      await result.current.search(filters);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.results).toEqual(mockSearchResult.gemstones);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.appliedFilters).toEqual(['Kategorie: Smaragd']);
    expect(result.current.searchTime).toBe(50);
    expect(result.current.error).toBe(null);
  });

  it('handles search error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAdvancedSearch());

    const filters: SearchFilters = {
      searchTerm: 'test',
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

    await act(async () => {
      await result.current.search(filters);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.results).toEqual([]);
  });

  it('gets search suggestions', async () => {
    const mockSuggestions = ['Smaragd', 'Rubin', 'Saphir'];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ suggestions: mockSuggestions }),
    });

    const { result } = renderHook(() => useAdvancedSearch());

    let suggestions: string[] = [];
    await act(async () => {
      suggestions = await result.current.getSuggestions('sma');
    });

    expect(suggestions).toEqual(mockSuggestions);
    expect(result.current.suggestions).toEqual(mockSuggestions);
  });

  it('saves search successfully', async () => {
    const mockSavedSearch = {
      id: 'search-1',
      name: 'Test Search',
      filters: {} as SearchFilters,
      userId: 'test-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ search: mockSavedSearch }),
    });

    const { result } = renderHook(() => useAdvancedSearch());

    const filters: SearchFilters = {
      searchTerm: 'test',
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

    await act(async () => {
      await result.current.saveSearch('Test Search', filters);
    });

    expect(result.current.savedSearches).toContain(mockSavedSearch);
  });

  it('loads saved search', async () => {
    const mockSavedSearch = {
      id: 'search-1',
      name: 'Test Search',
      filters: { searchTerm: 'test' } as SearchFilters,
      userId: 'test-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    const { result } = renderHook(() => useAdvancedSearch());

    // Mock the saved searches
    act(() => {
      result.current.savedSearches.push(mockSavedSearch);
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    let loadedFilters: SearchFilters | null = null;
    await act(async () => {
      loadedFilters = await result.current.loadSavedSearch('search-1');
    });

    expect(loadedFilters).toEqual(mockSavedSearch.filters);
  });

  it('deletes saved search', async () => {
    const mockSavedSearch = {
      id: 'search-1',
      name: 'Test Search',
      filters: {} as SearchFilters,
      userId: 'test-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    const { result } = renderHook(() => useAdvancedSearch());

    // Mock the saved searches
    act(() => {
      result.current.savedSearches.push(mockSavedSearch);
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await act(async () => {
      await result.current.deleteSavedSearch('search-1');
    });

    expect(result.current.savedSearches).not.toContain(mockSavedSearch);
  });

  it('clears results', () => {
    const { result } = renderHook(() => useAdvancedSearch());

    // Set some state first
    act(() => {
      result.current.results.push({ id: '1', name: 'Test' } as any);
      result.current.totalCount = 1;
      result.current.appliedFilters.push('Test filter');
      result.current.searchTime = 50;
      result.current.suggestions.push('Test suggestion');
      result.current.error = 'Test error';
    });

    act(() => {
      result.current.clearResults();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.appliedFilters).toEqual([]);
    expect(result.current.searchTime).toBe(0);
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('handles authentication required error for save search', async () => {
    // Mock no session
    jest.doMock('next-auth/react', () => ({
      useSession: () => ({ data: null, status: 'unauthenticated' }),
    }));

    const { result } = renderHook(() => useAdvancedSearch());

    const filters: SearchFilters = {
      searchTerm: 'test',
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

    await expect(
      act(async () => {
        await result.current.saveSearch('Test Search', filters);
      })
    ).rejects.toThrow('Authentication required');
  });
});
