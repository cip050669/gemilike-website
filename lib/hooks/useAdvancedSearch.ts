'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SearchFilters, SearchResult } from '@/app/api/search/advanced/route';
import { SavedSearch } from '@/app/api/search/saved/route';
import { Gemstone } from '@/lib/types/gemstone';

export interface UseAdvancedSearchReturn {
  // Search state
  isLoading: boolean;
  results: Gemstone[];
  totalCount: number;
  appliedFilters: string[];
  searchTime: number;
  suggestions: string[];
  error: string | null;
  
  // Saved searches
  savedSearches: SavedSearch[];
  isLoadingSavedSearches: boolean;
  
  // Actions
  search: (filters: SearchFilters) => Promise<void>;
  getSuggestions: (query: string) => Promise<string[]>;
  saveSearch: (name: string, filters: SearchFilters) => Promise<void>;
  loadSavedSearch: (searchId: string) => Promise<SearchFilters | null>;
  deleteSavedSearch: (searchId: string) => Promise<void>;
  clearResults: () => void;
}

export function useAdvancedSearch(): UseAdvancedSearchReturn {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Gemstone[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [searchTime, setSearchTime] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoadingSavedSearches, setIsLoadingSavedSearches] = useState(false);

  // Load saved searches on mount
  useEffect(() => {
    if (session?.user?.id) {
      loadSavedSearches();
    }
  }, [session?.user?.id]);

  const loadSavedSearches = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoadingSavedSearches(true);
    try {
      const response = await fetch('/api/search/saved');
      if (response.ok) {
        const data = await response.json();
        setSavedSearches(data.searches || []);
      } else {
        console.warn(`Failed to load saved searches: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    } finally {
      setIsLoadingSavedSearches(false);
    }
  }, [session?.user?.id]);

  const search = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/search/advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        // Try to get more specific error information
        let errorMessage = 'Search failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Search failed with status ${response.status}`;
        } catch {
          errorMessage = `Search failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data: SearchResult = await response.json();
      setResults(data.gemstones);
      setTotalCount(data.totalCount);
      setAppliedFilters(data.appliedFilters);
      setSearchTime(data.searchTime);
      setSuggestions(data.suggestions || []);
      
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Search failed');
      setResults([]);
      setTotalCount(0);
      setAppliedFilters([]);
      setSearchTime(0);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (query: string): Promise<string[]> => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return [];
    }

    try {
      const response = await fetch(`/api/search/advanced?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        const suggestions = data.suggestions || [];
        setSuggestions(suggestions);
        return suggestions;
      } else {
        console.warn(`Failed to get suggestions: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
    
    return [];
  }, []);

  const saveSearch = useCallback(async (name: string, filters: SearchFilters) => {
    if (!session?.user?.id) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch('/api/search/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, filters }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save search');
      }

      const data = await response.json();
      
      // Update local state
      setSavedSearches(prev => [data.search, ...prev]);
      
    } catch (error) {
      console.error('Save search error:', error);
      throw error;
    }
  }, [session?.user?.id]);

  const loadSavedSearch = useCallback(async (searchId: string): Promise<SearchFilters | null> => {
    const savedSearch = savedSearches.find(search => search.id === searchId);
    if (savedSearch) {
      // Increment usage count
      try {
        await fetch('/api/search/saved', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            id: searchId, 
            usageCount: savedSearch.usageCount + 1 
          }),
        });
      } catch (error) {
        console.error('Failed to update usage count:', error);
      }
      
      return savedSearch.filters;
    }
    return null;
  }, [savedSearches]);

  const deleteSavedSearch = useCallback(async (searchId: string) => {
    if (!session?.user?.id) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`/api/search/saved?id=${searchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete search');
      }

      // Update local state
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
      
    } catch (error) {
      console.error('Delete search error:', error);
      throw error;
    }
  }, [session?.user?.id]);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setAppliedFilters([]);
    setSearchTime(0);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    // Search state
    isLoading,
    results,
    totalCount,
    appliedFilters,
    searchTime,
    suggestions,
    error,
    
    // Saved searches
    savedSearches,
    isLoadingSavedSearches,
    
    // Actions
    search,
    getSuggestions,
    saveSearch,
    loadSavedSearch,
    deleteSavedSearch,
    clearResults,
  };
}
