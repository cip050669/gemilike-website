'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, X, RotateCcw, Sparkles, Save, Loader2 } from 'lucide-react';
import { Gemstone, isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';

interface AdvancedSearchProps {
  gemstones: Gemstone[];
  onFilter: (filters: SearchFilters) => void;
  onSaveSearch?: (searchName: string, filters: SearchFilters) => void;
  savedSearches?: SavedSearch[];
  onLoadSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  // Text search
  searchTerm: string;
  
  // Basic filters
  category: string;
  origin: string;
  type: string;
  
  // Price and weight
  priceRange: [number, number];
  weightRange: [number, number];
  
  // Quality filters
  treatment: string;
  certification: string;
  inStockOnly: boolean;
  
  // Advanced filters
  color: string;
  clarity: string;
  cutQuality: string;
  symmetry: string;
  polish: string;
  colorGrade: string;
  colorIntensity: string;
  crystalQuality: string;
  transparency: string;
  
  // Dimensions
  dimensionsRange: {
    length: [number, number];
    width: [number, number];
    height: [number, number];
  };
  
  // Special features
  hasVideos: boolean;
  hasCertificates: boolean;
  estimatedYieldRange: [number, number];
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
}

const defaultFilters: SearchFilters = {
  searchTerm: '',
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

export function AdvancedSearch({ 
  gemstones, 
  onFilter, 
  onSaveSearch, 
  savedSearches = [],
  onLoadSearch 
}: AdvancedSearchProps) {
  useTranslations('shop');
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Calculate dynamic ranges based on available data
  const dataRanges = useMemo(() => {
    const maxPrice = Math.max(0, ...gemstones.map((g) => g.price));
    const maxWeight = Math.max(
      0,
      ...gemstones.map((g) => (isCutGemstone(g) ? g.caratWeight : g.gramWeight))
    );
    const maxLength = Math.max(0, ...gemstones.map((g) => g.dimensions.length));
    const maxWidth = Math.max(0, ...gemstones.map((g) => g.dimensions.width));
    const maxHeight = Math.max(0, ...gemstones.map((g) => g.dimensions.height));
    const maxYield = Math.max(
      0,
      ...gemstones.filter(isRoughGemstone).map((g) => g.estimatedCaratYield ?? 0)
    );

    return {
      maxPrice,
      maxWeight,
      maxLength,
      maxWidth,
      maxHeight,
      maxYield,
    };
  }, [gemstones]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(gemstones.map(g => g.category))).sort();
    const origins = Array.from(new Set(gemstones.map(g => g.origin))).sort();
    const colors = Array.from(new Set(gemstones.map(g => g.color).filter(Boolean))).sort();
    const treatments = Array.from(new Set(gemstones.map(g => 
      g.treatment.treated ? g.treatment.type : 'untreated'
    ))).filter(Boolean);
    
    // Cut-specific options
    const clarities = Array.from(new Set(
      gemstones.filter(isCutGemstone).map(g => g.clarity)
    )).sort();
    const cutQualities = Array.from(new Set(
      gemstones.filter(isCutGemstone).map(g => g.cutQuality).filter(Boolean)
    )).sort();
    const symmetries = Array.from(new Set(
      gemstones.filter(isCutGemstone).map(g => g.symmetry).filter(Boolean)
    )).sort();
    const polishes = Array.from(new Set(
      gemstones.filter(isCutGemstone).map(g => g.polish).filter(Boolean)
    )).sort();
    const colorGrades = Array.from(new Set(
      gemstones.filter(isCutGemstone).map(g => g.colorGrade).filter(Boolean)
    )).sort();
    const colorIntensities = Array.from(new Set(
      gemstones.filter(isCutGemstone).map(g => g.colorIntensity).filter(Boolean)
    )).sort();
    
    // Rough-specific options
    const crystalQualities = Array.from(new Set(
      gemstones.filter(isRoughGemstone).map(g => g.crystalQuality)
    )).sort();
    const transparencies = Array.from(new Set(
      gemstones.filter(isRoughGemstone).map(g => g.transparency).filter(Boolean)
    )).sort();

    return {
      categories,
      origins,
      colors,
      treatments,
      clarities,
      cutQualities,
      symmetries,
      polishes,
      colorGrades,
      colorIntensities,
      crystalQualities,
      transparencies,
    };
  }, [gemstones]);

  const applyFilters = async () => {
    setIsLoading(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...gemstones];

    // Text search (searches in name, description, and category)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((gemstone) =>
        gemstone.name.toLowerCase().includes(searchLower) ||
        (gemstone.description && gemstone.description.toLowerCase().includes(searchLower)) ||
        gemstone.category.toLowerCase().includes(searchLower) ||
        (gemstone.color && gemstone.color.toLowerCase().includes(searchLower))
      );
    }
    // Basic filters
    if (filters.category !== 'all') {
      filtered = filtered.filter((gemstone) => gemstone.category === filters.category);
    }

    if (filters.origin !== 'all') {
      filtered = filtered.filter((gemstone) => gemstone.origin === filters.origin);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter((gemstone) => gemstone.type === filters.type);
    }

    if (filters.color !== 'all') {
      filtered = filtered.filter((gemstone) => gemstone.color === filters.color);
    }

    // Price and weight ranges
    filtered = filtered.filter((gemstone) => 
      gemstone.price >= filters.priceRange[0] && gemstone.price <= filters.priceRange[1]
    );

    filtered = filtered.filter((gemstone) => {
      const weight = isCutGemstone(gemstone) ? gemstone.caratWeight : gemstone.gramWeight;
      return weight >= filters.weightRange[0] && weight <= filters.weightRange[1];
    });

    // Quality filters
    if (filters.treatment !== 'all') {
      if (filters.treatment === 'untreated') {
        filtered = filtered.filter((gemstone) => !gemstone.treatment.treated);
      } else {
        filtered = filtered.filter((gemstone) => 
          gemstone.treatment.treated && gemstone.treatment.type === filters.treatment
        );
      }
    }

    if (filters.certification !== 'all') {
      if (filters.certification === 'certified') {
        filtered = filtered.filter((gemstone) => gemstone.certification.certified);
      } else if (filters.certification === 'uncertified') {
        filtered = filtered.filter((gemstone) => !gemstone.certification.certified);
      } else {
        filtered = filtered.filter((gemstone) => 
          gemstone.certification.certified && gemstone.certification.lab === filters.certification
        );
      }
    }

    // Cut-specific filters
    if (filters.clarity !== 'all') {
      filtered = filtered.filter((gemstone) => 
        isCutGemstone(gemstone) && gemstone.clarity === filters.clarity
      );
    }

    if (filters.cutQuality !== 'all') {
      filtered = filtered.filter((gemstone) => 
        isCutGemstone(gemstone) && gemstone.cutQuality === filters.cutQuality
      );
    }

    if (filters.symmetry !== 'all') {
      filtered = filtered.filter((gemstone) => 
        isCutGemstone(gemstone) && gemstone.symmetry === filters.symmetry
      );
    }

    if (filters.polish !== 'all') {
      filtered = filtered.filter((gemstone) => 
        isCutGemstone(gemstone) && gemstone.polish === filters.polish
      );
    }

    if (filters.colorGrade !== 'all') {
      filtered = filtered.filter((gemstone) => 
        isCutGemstone(gemstone) && gemstone.colorGrade === filters.colorGrade
      );
    }

    if (filters.colorIntensity !== 'all') {
      filtered = filtered.filter((gemstone) => 
        isCutGemstone(gemstone) && gemstone.colorIntensity === filters.colorIntensity
      );
    }

    // Rough-specific filters
    if (filters.crystalQuality !== 'all') {
      filtered = filtered.filter((gemstone) => 
        isRoughGemstone(gemstone) && gemstone.crystalQuality === filters.crystalQuality
      );
    }

    if (filters.transparency !== 'all') {
      filtered = filtered.filter((gemstone) => 
        isRoughGemstone(gemstone) && gemstone.transparency === filters.transparency
      );
    }

    // Dimension filters
    filtered = filtered.filter((gemstone) => 
      gemstone.dimensions.length >= filters.dimensionsRange.length[0] &&
      gemstone.dimensions.length <= filters.dimensionsRange.length[1] &&
      gemstone.dimensions.width >= filters.dimensionsRange.width[0] &&
      gemstone.dimensions.width <= filters.dimensionsRange.width[1] &&
      gemstone.dimensions.height >= filters.dimensionsRange.height[0] &&
      gemstone.dimensions.height <= filters.dimensionsRange.height[1]
    );

    // Special features
    filtered = filtered
      .filter((gemstone) => !filters.hasVideos || (gemstone.videos && gemstone.videos.length > 0))
      .filter((gemstone) => {
        if (!filters.hasCertificates) {
          return true;
        }
        return (
          gemstone.certification.certified &&
          Boolean(gemstone.certification.certificateUrl)
        );
      })
      .filter((gemstone) => {
        if (filters.estimatedYieldRange[0] > 0 || filters.estimatedYieldRange[1] < dataRanges.maxYield) {
          if (isRoughGemstone(gemstone) && gemstone.estimatedCaratYield) {
            return (
              gemstone.estimatedCaratYield >= filters.estimatedYieldRange[0] &&
              gemstone.estimatedCaratYield <= filters.estimatedYieldRange[1]
            );
          }
          return false;
        }
        return true;
      })
      .filter((gemstone) => (!filters.inStockOnly ? true : gemstone.inStock));

    onFilter(filtered);
    setIsLoading(false);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.category !== 'all') count++;
    if (filters.origin !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.color !== 'all') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < dataRanges.maxPrice) count++;
    if (filters.weightRange[0] > 0 || filters.weightRange[1] < dataRanges.maxWeight) count++;
    if (filters.treatment !== 'all') count++;
    if (filters.certification !== 'all') count++;
    if (filters.clarity !== 'all') count++;
    if (filters.cutQuality !== 'all') count++;
    if (filters.symmetry !== 'all') count++;
    if (filters.polish !== 'all') count++;
    if (filters.colorGrade !== 'all') count++;
    if (filters.colorIntensity !== 'all') count++;
    if (filters.crystalQuality !== 'all') count++;
    if (filters.transparency !== 'all') count++;
    if (filters.hasVideos) count++;
    if (filters.hasCertificates) count++;
    if (filters.inStockOnly) count++;
    return count;
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim() && onSaveSearch) {
      onSaveSearch(saveSearchName.trim(), filters);
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    if (onLoadSearch) {
      onLoadSearch(savedSearch.filters);
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Suche nach Name, Beschreibung, Kategorie oder Farbe..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyFilters();
              }
            }}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Erweiterte Suche
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="flex items-center gap-2"
          disabled={activeFiltersCount === 0}
        >
          <RotateCcw className="h-4 w-4" />
          Zurücksetzen
        </Button>
        {onSaveSearch && (
          <Button 
            variant="outline" 
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-2"
            disabled={activeFiltersCount === 0}
          >
            <Save className="h-4 w-4" />
            Suche speichern
          </Button>
        )}
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Gespeicherte Suchen:</Label>
          <div className="flex gap-2 flex-wrap">
            {savedSearches.map((search) => (
              <Button
                key={search.id}
                variant="outline"
                size="sm"
                onClick={() => handleLoadSearch(search)}
                className="text-xs"
              >
                {search.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {isOpen && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Erweiterte Suchfilter
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Grundlagen</TabsTrigger>
                <TabsTrigger value="quality">Qualität</TabsTrigger>
                <TabsTrigger value="dimensions">Abmessungen</TabsTrigger>
                <TabsTrigger value="special">Besonderheiten</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <Label htmlFor="category">Kategorie</Label>
                    <Select value={filters.category} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, category: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Kategorien" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Kategorien</SelectItem>
                        {filterOptions.categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Origin Filter */}
                  <div>
                    <Label htmlFor="origin">Herkunft</Label>
                    <Select value={filters.origin} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, origin: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Herkünfte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Herkünfte</SelectItem>
                        {filterOptions.origins.map(origin => (
                          <SelectItem key={origin} value={origin}>
                            {origin}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <Label htmlFor="type">Typ</Label>
                    <Select value={filters.type} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, type: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Typen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Typen</SelectItem>
                        <SelectItem value="cut">Geschliffen</SelectItem>
                        <SelectItem value="rough">Roh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <Label htmlFor="color">Farbe</Label>
                    <Select value={filters.color} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, color: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Farben" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Farben</SelectItem>
                        {filterOptions.colors.map(color => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label>Preis: €{filters.priceRange[0].toLocaleString()} - €{filters.priceRange[1].toLocaleString()}</Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                    max={dataRanges.maxPrice}
                    min={0}
                    step={100}
                    className="mt-2"
                  />
                </div>

                {/* Weight Range */}
                <div>
                  <Label>
                    Gewicht: {filters.weightRange[0]} - {filters.weightRange[1]} {gemstones.some(g => isCutGemstone(g)) ? 'ct' : 'g'}
                  </Label>
                  <Slider
                    value={filters.weightRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, weightRange: value as [number, number] }))}
                    max={dataRanges.maxWeight}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Treatment Filter */}
                  <div>
                    <Label htmlFor="treatment">Behandlung</Label>
                    <Select value={filters.treatment} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, treatment: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Behandlungen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Behandlungen</SelectItem>
                        <SelectItem value="untreated">Unbehandelt</SelectItem>
                        {filterOptions.treatments.map(treatment => (
                          <SelectItem key={treatment} value={treatment}>
                            {treatment === 'heated' ? 'Erhitzt' :
                             treatment === 'oiled' ? 'Geölt' :
                             treatment === 'irradiated' ? 'Bestrahlt' :
                             treatment === 'diffused' ? 'Diffundiert' :
                             treatment === 'filled' ? 'Gefüllt' :
                             treatment === 'coated' ? 'Beschichtet' :
                             treatment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Certification Filter */}
                  <div>
                    <Label htmlFor="certification">Zertifizierung</Label>
                    <Select value={filters.certification} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, certification: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Zertifizierungen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Zertifizierungen</SelectItem>
                        <SelectItem value="certified">Zertifiziert</SelectItem>
                        <SelectItem value="uncertified">Nicht zertifiziert</SelectItem>
                        <SelectItem value="GIA">GIA</SelectItem>
                        <SelectItem value="IGI">IGI</SelectItem>
                        <SelectItem value="Gübelin">Gübelin</SelectItem>
                        <SelectItem value="GRS">GRS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clarity Filter (Cut only) */}
                  <div>
                    <Label htmlFor="clarity">Reinheit</Label>
                    <Select value={filters.clarity} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, clarity: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Reinheitsgrade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Reinheitsgrade</SelectItem>
                        {filterOptions.clarities.map(clarity => (
                          <SelectItem key={clarity} value={clarity}>
                            {clarity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cut Quality Filter (Cut only) */}
                  <div>
                    <Label htmlFor="cutQuality">Schliffqualität</Label>
                    <Select value={filters.cutQuality} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, cutQuality: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Schliffqualitäten" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Schliffqualitäten</SelectItem>
                        {filterOptions.cutQualities.map(quality => (
                          <SelectItem key={quality} value={quality}>
                            {quality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Symmetry Filter (Cut only) */}
                  <div>
                    <Label htmlFor="symmetry">Symmetrie</Label>
                    <Select value={filters.symmetry} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, symmetry: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Symmetrien" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Symmetrien</SelectItem>
                        {filterOptions.symmetries.map(symmetry => (
                          <SelectItem key={symmetry} value={symmetry}>
                            {symmetry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Polish Filter (Cut only) */}
                  <div>
                    <Label htmlFor="polish">Politur</Label>
                    <Select value={filters.polish} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, polish: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Polituren" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Polituren</SelectItem>
                        {filterOptions.polishes.map(polish => (
                          <SelectItem key={polish} value={polish}>
                            {polish}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color Grade Filter (Cut only) */}
                  <div>
                    <Label htmlFor="colorGrade">Farbgrad</Label>
                    <Select value={filters.colorGrade} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, colorGrade: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Farbgrade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Farbgrade</SelectItem>
                        {filterOptions.colorGrades.map(grade => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color Intensity Filter (Cut only) */}
                  <div>
                    <Label htmlFor="colorIntensity">Farbintensität</Label>
                    <Select value={filters.colorIntensity} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, colorIntensity: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Farbintensitäten" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Farbintensitäten</SelectItem>
                        {filterOptions.colorIntensities.map(intensity => (
                          <SelectItem key={intensity} value={intensity}>
                            {intensity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Crystal Quality Filter (Rough only) */}
                  <div>
                    <Label htmlFor="crystalQuality">Kristallqualität</Label>
                    <Select value={filters.crystalQuality} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, crystalQuality: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Kristallqualitäten" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Kristallqualitäten</SelectItem>
                        {filterOptions.crystalQualities.map(quality => (
                          <SelectItem key={quality} value={quality}>
                            {quality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transparency Filter (Rough only) */}
                  <div>
                    <Label htmlFor="transparency">Transparenz</Label>
                    <Select value={filters.transparency} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, transparency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Transparenzen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Transparenzen</SelectItem>
                        {filterOptions.transparencies.map(transparency => (
                          <SelectItem key={transparency} value={transparency}>
                            {transparency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dimensions" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {/* Length Range */}
                  <div>
                    <Label>Länge: {filters.dimensionsRange.length[0]} - {filters.dimensionsRange.length[1]} mm</Label>
                    <Slider
                      value={filters.dimensionsRange.length}
                      onValueChange={(value) => setFilters(prev => ({ 
                        ...prev, 
                        dimensionsRange: { ...prev.dimensionsRange, length: value as [number, number] }
                      }))}
                      max={dataRanges.maxLength}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  {/* Width Range */}
                  <div>
                    <Label>Breite: {filters.dimensionsRange.width[0]} - {filters.dimensionsRange.width[1]} mm</Label>
                    <Slider
                      value={filters.dimensionsRange.width}
                      onValueChange={(value) => setFilters(prev => ({ 
                        ...prev, 
                        dimensionsRange: { ...prev.dimensionsRange, width: value as [number, number] }
                      }))}
                      max={dataRanges.maxWidth}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  {/* Height Range */}
                  <div>
                    <Label>Höhe: {filters.dimensionsRange.height[0]} - {filters.dimensionsRange.height[1]} mm</Label>
                    <Slider
                      value={filters.dimensionsRange.height}
                      onValueChange={(value) => setFilters(prev => ({ 
                        ...prev, 
                        dimensionsRange: { ...prev.dimensionsRange, height: value as [number, number] }
                      }))}
                      max={dataRanges.maxHeight}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="special" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {/* Special Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasVideos"
                        checked={filters.hasVideos}
                        onChange={(e) => setFilters(prev => ({ ...prev, hasVideos: e.target.checked }))}
                      />
                      <Label htmlFor="hasVideos">Nur mit Videos</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasCertificates"
                        checked={filters.hasCertificates}
                        onChange={(e) => setFilters(prev => ({ ...prev, hasCertificates: e.target.checked }))}
                      />
                      <Label htmlFor="hasCertificates">Nur mit Zertifikaten</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="inStockOnly"
                        checked={filters.inStockOnly}
                        onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                      />
                      <Label htmlFor="inStockOnly">Nur verfügbare Artikel</Label>
                    </div>
                  </div>

                  {/* Estimated Yield Range (Rough only) */}
                  <div>
                    <Label>
                      Geschätzte Ausbeute: {filters.estimatedYieldRange[0]} - {filters.estimatedYieldRange[1]} ct
                    </Label>
                    <Slider
                      value={filters.estimatedYieldRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, estimatedYieldRange: value as [number, number] }))}
                      max={dataRanges.maxYield}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Apply Filters Button */}
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={applyFilters} 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suche läuft...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Filter anwenden
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetFilters}
                disabled={activeFiltersCount === 0}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Zurücksetzen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Suche speichern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="searchName">Name der Suche</Label>
                <Input
                  id="searchName"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="z.B. 'Hochwertige Smaragde'"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveSearch} disabled={!saveSearchName.trim()}>
                  Speichern
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
