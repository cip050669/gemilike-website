'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw, Search, Star } from 'lucide-react';
import { Gemstone } from '@/lib/types/gemstone';

interface AdvancedFiltersProps {
  gemstones: Gemstone[];
  onFilter: (filtered: Gemstone[]) => void;
  onSearch: (query: string) => void;
}

interface FilterState {
  search: string;
  category: string;
  origin: string;
  priceRange: [number, number];
  weightRange: [number, number];
  treatment: string;
  certification: string;
  inStock: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function AdvancedFilters({ gemstones, onFilter, onSearch }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    origin: '',
    priceRange: [0, 10000],
    weightRange: [0, 100],
    treatment: '',
    certification: '',
    inStock: null,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  // Get unique values for filter options
  const categories = [...new Set(gemstones.map(g => g.category))];
  const origins = [...new Set(gemstones.map(g => g.origin))];
  const treatments = [...new Set(gemstones.map(g => g.treatment.type))];
  const certifications = [...new Set(gemstones.map(g => g.certification.lab).filter(Boolean))];

  const maxPrice = Math.max(...gemstones.map(g => g.price));
  const maxWeight = Math.max(
    ...gemstones.map(g => 
      'caratWeight' in g ? g.caratWeight : 'gramWeight' in g ? g.gramWeight : 0
    )
  );

  useEffect(() => {
    applyFilters();
  }, [filters, gemstones]);

  const applyFilters = () => {
    let filtered = [...gemstones];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(searchLower) ||
        g.category.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(g => g.category === filters.category);
    }

    // Origin filter
    if (filters.origin) {
      filtered = filtered.filter(g => g.origin === filters.origin);
    }

    // Price filter
    filtered = filtered.filter(g => 
      g.price >= filters.priceRange[0] && g.price <= filters.priceRange[1]
    );

    // Weight filter
    filtered = filtered.filter(g => {
      const weight = 'caratWeight' in g ? g.caratWeight : 'gramWeight' in g ? g.gramWeight : 0;
      return weight >= filters.weightRange[0] && weight <= filters.weightRange[1];
    });

    // Treatment filter
    if (filters.treatment) {
      filtered = filtered.filter(g => g.treatment.type === filters.treatment);
    }

    // Certification filter
    if (filters.certification) {
      filtered = filtered.filter(g => g.certification.lab === filters.certification);
    }

    // Stock filter
    if (filters.inStock !== null) {
      filtered = filtered.filter(g => g.inStock === filters.inStock);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'weight':
          aValue = 'caratWeight' in a ? a.caratWeight : 'gramWeight' in a ? a.gramWeight : 0;
          bValue = 'caratWeight' in b ? b.caratWeight : 'gramWeight' in b ? b.gramWeight : 0;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    onFilter(filtered);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      origin: '',
      priceRange: [0, maxPrice],
      weightRange: [0, maxWeight],
      treatment: '',
      certification: '',
      inStock: null,
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const saveSearch = () => {
    if (filters.search && !savedSearches.includes(filters.search)) {
      setSavedSearches([...savedSearches, filters.search]);
    }
  };

  const loadSavedSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const removeSavedSearch = (search: string) => {
    setSavedSearches(savedSearches.filter(s => s !== search));
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== null && 
    !(Array.isArray(value) && value[0] === 0 && value[1] === maxPrice) &&
    !(Array.isArray(value) && value[0] === 0 && value[1] === maxWeight)
  ).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Edelsteine suchen..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch(filters.search);
              }
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={() => onSearch(filters.search)}>
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={resetFilters}
          disabled={activeFiltersCount === 0}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Zurücksetzen
        </Button>
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Gespeicherte Suchen:</span>
          {savedSearches.map((search) => (
            <Badge
              key={search}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => loadSavedSearch(search)}
            >
              {search}
              <X
                className="h-3 w-3 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSavedSearch(search);
                }}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Erweiterte Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Kategorie</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Kategorien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alle Kategorien</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Origin Filter */}
              <div className="space-y-2">
                <Label>Herkunft</Label>
                <Select
                  value={filters.origin}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, origin: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Herkünfte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alle Herkünfte</SelectItem>
                    {origins.map((origin) => (
                      <SelectItem key={origin} value={origin}>
                        {origin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Treatment Filter */}
              <div className="space-y-2">
                <Label>Behandlung</Label>
                <Select
                  value={filters.treatment}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, treatment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Behandlungen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alle Behandlungen</SelectItem>
                    {treatments.map((treatment) => (
                      <SelectItem key={treatment} value={treatment}>
                        {treatment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Certification Filter */}
              <div className="space-y-2">
                <Label>Zertifizierung</Label>
                <Select
                  value={filters.certification}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, certification: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Zertifizierungen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alle Zertifizierungen</SelectItem>
                    {certifications.map((cert) => (
                      <SelectItem key={cert} value={cert}>
                        {cert}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stock Filter */}
              <div className="space-y-2">
                <Label>Verfügbarkeit</Label>
                <Select
                  value={filters.inStock === null ? '' : filters.inStock.toString()}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    inStock: value === '' ? null : value === 'true' 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alle</SelectItem>
                    <SelectItem value="true">Verfügbar</SelectItem>
                    <SelectItem value="false">Ausverkauft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="space-y-2">
                <Label>Sortieren nach</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Preis</SelectItem>
                    <SelectItem value="weight">Gewicht</SelectItem>
                    <SelectItem value="category">Kategorie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>
                Preis: von €{filters.priceRange[0].toLocaleString()} bis €{filters.priceRange[1].toLocaleString()}
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                max={maxPrice}
                step={100}
                className="w-full"
              />
            </div>

            {/* Weight Range */}
            <div className="space-y-2">
              <Label>
                Gewicht: von {filters.weightRange[0]} bis {filters.weightRange[1]} ct/g
              </Label>
              <Slider
                value={filters.weightRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, weightRange: value as [number, number] }))}
                max={maxWeight}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <Label>Reihenfolge:</Label>
              <Button
                variant={filters.sortOrder === 'asc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
              >
                Aufsteigend
              </Button>
              <Button
                variant={filters.sortOrder === 'desc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
              >
                Absteigend
              </Button>
            </div>

            {/* Save Search */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveSearch}
                disabled={!filters.search}
              >
                <Star className="h-4 w-4 mr-2" />
                Suche speichern
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
