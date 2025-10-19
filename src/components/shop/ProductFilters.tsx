'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface ProductFiltersProps {
  className?: string;
}

const categories = [
  'Alle Kategorien',
  'Diamanten',
  'Smaragde',
  'Rubine',
  'Saphire',
  'Amethyste',
  'Topase',
  'Opale'
];

const priceRanges = [
  { label: 'Alle Preise', value: '' },
  { label: 'Unter €100', value: '0-100' },
  { label: '€100 - €500', value: '100-500' },
  { label: '€500 - €1000', value: '500-1000' },
  { label: '€1000 - €5000', value: '1000-5000' },
  { label: 'Über €5000', value: '5000-999999' }
];

export default function ProductFilters({ className }: ProductFiltersProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle Kategorien');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCategoryChange = (category: string): void => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (price: string): void => {
    setSelectedPrice(price);
  };

  const clearFilters = (): void => {
    setSelectedCategory('Alle Kategorien');
    setSelectedPrice('');
  };

  const hasActiveFilters = selectedCategory !== 'Alle Kategorien' || selectedPrice !== '';

  return (
    <div className={`bg-slate-800/50 rounded-lg p-6 ${className || ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-slate-700 rounded-lg text-white"
        >
          <span>Filter anzeigen</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Kategorie</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Preisbereich</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="price"
                  value={range.value}
                  checked={selectedPrice === range.value}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Weitere Filter</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Nur verfügbare Produkte</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Zertifizierte Edelsteine</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Sonderangebote</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
