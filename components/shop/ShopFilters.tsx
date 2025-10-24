'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Gemstone, isCutGemstone } from '@/lib/types/gemstone';

interface ShopFiltersProps {
  gemstones: Gemstone[];
  onFilter: (filteredGemstones: Gemstone[]) => void;
}

export function ShopFilters({ gemstones, onFilter }: ShopFiltersProps) {
  const t = useTranslations('shop');
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [weightRange, setWeightRange] = useState<number[]>([0, 100]);
  const [selectedTreatment, setSelectedTreatment] = useState<string>('all');
  const [selectedCertification, setSelectedCertification] = useState<string>('all');
  const [selectedCut, setSelectedCut] = useState<string>('all');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Get unique values for filter options
  const categories = Array.from(new Set(gemstones.map(g => g.category))).sort();
  const origins = Array.from(new Set(gemstones.map(g => g.origin))).sort();
  const treatments = Array.from(
    new Set(
      gemstones.map((g) => (g.treatment.treated ? g.treatment.type : 'untreated'))
    )
  ).filter(Boolean);
  const cuts = Array.from(
    new Set(
      gemstones.filter(isCutGemstone).map((g) => g.cut).filter(Boolean)
    )
  ).sort();
  const forms = Array.from(
    new Set(
      gemstones.filter(isCutGemstone).map((g) => g.cutForm).filter(Boolean)
    )
  ).sort();
  const maxPrice = Math.max(...gemstones.map(g => g.price));
  const maxWeight = Math.max(...gemstones.map(g => 
    'caratWeight' in g ? g.caratWeight : g.gramWeight
  ));

  const applyFilters = () => {
    let filtered = gemstones;

    // Search term (only category)
    if (searchTerm) {
      filtered = filtered.filter(gemstone =>
        gemstone.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.category === selectedCategory);
    }

    // Origin filter
    if (selectedOrigin !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.origin === selectedOrigin);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.type === selectedType);
    }

    // Price range
    filtered = filtered.filter(gemstone => 
      gemstone.price >= priceRange[0] && gemstone.price <= priceRange[1]
    );

    // Weight range
    filtered = filtered.filter(gemstone => {
      const weight = 'caratWeight' in gemstone ? gemstone.caratWeight : gemstone.gramWeight;
      return weight >= weightRange[0] && weight <= weightRange[1];
    });

    // Treatment filter
    if (selectedTreatment !== 'all') {
      if (selectedTreatment === 'untreated') {
        filtered = filtered.filter(gemstone => !gemstone.treatment.treated);
      } else {
        filtered = filtered.filter(gemstone => 
          gemstone.treatment.treated && gemstone.treatment.type === selectedTreatment
        );
      }
    }

    // Certification filter
    if (selectedCertification !== 'all') {
      if (selectedCertification === 'certified') {
        filtered = filtered.filter(gemstone => gemstone.certification.certified);
      } else if (selectedCertification === 'uncertified') {
        filtered = filtered.filter(gemstone => !gemstone.certification.certified);
      } else {
        filtered = filtered.filter(gemstone => 
          gemstone.certification.certified && gemstone.certification.lab === selectedCertification
        );
      }
    }

    // Cut filter (only for cut gemstones)
    if (selectedCut !== 'all') {
      filtered = filtered.filter(
        (gemstone) => isCutGemstone(gemstone) && gemstone.cut === selectedCut
      );
    }

    // Form filter (only for cut gemstones)
    if (selectedForm !== 'all') {
      filtered = filtered.filter(
        (gemstone) => isCutGemstone(gemstone) && gemstone.cutForm === selectedForm
      );
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(gemstone => gemstone.inStock);
    }

    onFilter(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedOrigin('all');
    setSelectedType('all');
    setPriceRange([0, maxPrice]);
    setWeightRange([0, maxWeight]);
    setSelectedTreatment('all');
    setSelectedCertification('all');
    setSelectedCut('all');
    setSelectedForm('all');
    setInStockOnly(false);
    onFilter(gemstones);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedOrigin !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (weightRange[0] > 0 || weightRange[1] < maxWeight) count++;
    if (selectedTreatment !== 'all') count++;
    if (selectedCertification !== 'all') count++;
    if (selectedCut !== 'all') count++;
    if (selectedForm !== 'all') count++;
    if (inStockOnly) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex gap-4 mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          {t('filters')}
          {activeFiltersCount > 0 && (
            <div className="ml-1 bg-secondary text-secondary-foreground text-sm px-2 py-1 h-8 min-w-8 rounded-md flex items-center justify-center">
              {activeFiltersCount}
            </div>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="flex items-center gap-2"
          disabled={activeFiltersCount === 0}
        >
          <RotateCcw className="h-4 w-4" />
          {t('clearFilters')}
        </Button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <Card className="scale-75 origin-top">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              {t('filters')}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <Label htmlFor="category">{t('category')}</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Alle ${t('category').toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')} {t('category')}</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Origin Filter */}
              <div>
                <Label htmlFor="origin">{t('origin')}</Label>
                <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Herkünfte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Herkünfte</SelectItem>
                    {origins.map(origin => (
                      <SelectItem key={origin} value={origin}>
                        {origin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div>
                <Label htmlFor="type">{t('type')}</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
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

              {/* Treatment Filter */}
              <div>
                <Label htmlFor="treatment">Behandlung</Label>
                <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Behandlungen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Behandlungen</SelectItem>
                    <SelectItem value="untreated">Unbehandelt</SelectItem>
                    {treatments.map(treatment => (
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

              {/* Cut Filter */}
              <div>
                <Label htmlFor="cut">Schliff</Label>
                <Select value={selectedCut} onValueChange={setSelectedCut}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Schliffe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Schliffe</SelectItem>
                    {cuts.map(cut => (
                      <SelectItem key={cut} value={cut}>
                        {t(`cutTypes.${cut}`) || cut}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Form Filter */}
              <div>
                <Label htmlFor="form">{t('form')}</Label>
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Alle ${t('form')}en`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle {t('form')}en</SelectItem>
                    {forms.map(form => (
                      <SelectItem key={form} value={form}>
                        {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Certification Filter */}
              <div>
                <Label htmlFor="certification">Zertifizierung</Label>
                <Select value={selectedCertification} onValueChange={setSelectedCertification}>
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

              {/* Stock Filter */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <Label htmlFor="inStock">Nur verfügbare Artikel</Label>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label>Preis: von €{priceRange[0].toLocaleString()} bis €{priceRange[1].toLocaleString()}</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={maxPrice}
                min={0}
                step={100}
                className="mt-2"
              />
            </div>

            {/* Weight Range */}
            <div>
              <Label>
                Gewicht: von {weightRange[0]} bis {weightRange[1]} {gemstones.some(g => 'caratWeight' in g) ? 'ct' : 'g'}
              </Label>
              <Slider
                value={weightRange}
                onValueChange={setWeightRange}
                max={maxWeight}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>

            {/* Apply Filters Button */}
            <div className="flex gap-1">
              <div 
                onClick={applyFilters} 
                className="flex-1 h-8 text-sm px-1 py-0 bg-primary text-primary-foreground rounded cursor-pointer flex items-center justify-center hover:bg-primary/90"
              >
{t('applyFilters')}
              </div>
              <div 
                onClick={resetFilters} 
                className="flex-1 h-8 text-sm px-1 py-0 border border-input bg-gray-800/50 text-foreground rounded cursor-pointer flex items-center justify-center hover:bg-accent"
              >
{t('clearFilters')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
