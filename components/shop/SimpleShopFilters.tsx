'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Gemstone, isCutGemstone } from '@/lib/types/gemstone';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SimpleShopFiltersProps {
  gemstones: Gemstone[];
  onFilter: (filteredGemstones: Gemstone[]) => void;
}

export function SimpleShopFilters({ gemstones, onFilter }: SimpleShopFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedCut, setSelectedCut] = useState<string>('all');
  const [selectedClarity, setSelectedClarity] = useState<string>('all');
  const [selectedTreatment, setSelectedTreatment] = useState<string>('all');
  const [selectedCertification, setSelectedCertification] = useState<string>('all');

  const safeGemstones = useMemo(() => gemstones ?? [], [gemstones]);
  const categories = Array.from(new Set(safeGemstones.map(g => g.category).filter(Boolean))).sort();
  const origins = Array.from(new Set(safeGemstones.map(g => g.origin).filter(Boolean))).sort();
  const cuts = Array.from(new Set(safeGemstones.filter(isCutGemstone).map(g => g.cut).filter(Boolean))).sort();
  const clarities = Array.from(new Set(safeGemstones.filter(isCutGemstone).map(g => g.clarity).filter(Boolean))).sort();
  const treatments = Array.from(new Set(safeGemstones.map(g => g.treatment?.type).filter(Boolean))).sort();
  const certifications = Array.from(new Set(safeGemstones.map(g => g.certification?.lab).filter(Boolean))).sort();

  const priceRanges = [
    { value: 'all', label: 'Preise' },
    { value: '0-100', label: 'Bis €100' },
    { value: '100-500', label: '€100 - €500' },
    { value: '500-1000', label: '€500 - €1.000' },
    { value: '1000-5000', label: '€1.000 - €5.000' },
    { value: '5000+', label: 'Über €5.000' }
  ];

  const applyFilters = useCallback(() => {
    let filtered = safeGemstones;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.category === selectedCategory);
    }

    if (selectedOrigin !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.origin === selectedOrigin);
    }

    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (selectedPriceRange === '5000+') {
        filtered = filtered.filter(gemstone => gemstone.price >= 5000);
      } else {
        filtered = filtered.filter(gemstone => 
          gemstone.price >= min && gemstone.price <= max
        );
      }
    }

    if (selectedCut !== 'all') {
      filtered = filtered.filter(gemstone => 
        isCutGemstone(gemstone) && gemstone.cut === selectedCut
      );
    }

    if (selectedClarity !== 'all') {
      filtered = filtered.filter(gemstone => 
        isCutGemstone(gemstone) && gemstone.clarity === selectedClarity
      );
    }

    if (selectedTreatment !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.treatment?.type === selectedTreatment);
    }

    if (selectedCertification !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.certification?.lab === selectedCertification);
    }

    onFilter(filtered);
  }, [safeGemstones, selectedCategory, selectedPriceRange, selectedOrigin, selectedCut, selectedClarity, selectedTreatment, selectedCertification, onFilter]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedOrigin('all');
    setSelectedCut('all');
    setSelectedClarity('all');
    setSelectedTreatment('all');
    setSelectedCertification('all');
    onFilter(safeGemstones);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedPriceRange !== 'all') count++;
    if (selectedOrigin !== 'all') count++;
    if (selectedCut !== 'all') count++;
    if (selectedClarity !== 'all') count++;
    if (selectedTreatment !== 'all') count++;
    if (selectedCertification !== 'all') count++;
    return count;
  };

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-3 py-2 border rounded-md bg-black text-white border-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="all">Kategorien</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <select
        value={selectedPriceRange}
        onChange={(e) => setSelectedPriceRange(e.target.value)}
        className="px-3 py-2 border rounded-md bg-black text-white border-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        {priceRanges.map(range => (
          <option key={range.value} value={range.value}>{range.label}</option>
        ))}
      </select>

      <select
        value={selectedOrigin}
        onChange={(e) => setSelectedOrigin(e.target.value)}
        className="px-3 py-2 border rounded-md bg-black text-white border-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="all">Herkünfte</option>
        {origins.map(origin => (
          <option key={origin} value={origin}>{origin}</option>
        ))}
      </select>

      <select
        value={selectedCut}
        onChange={(e) => setSelectedCut(e.target.value)}
        className="px-3 py-2 border rounded-md bg-black text-white border-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="all">Schliff-Formen</option>
        {cuts.map(cut => (
          <option key={cut} value={cut}>{cut}</option>
        ))}
      </select>

      <select
        value={selectedClarity}
        onChange={(e) => setSelectedClarity(e.target.value)}
        className="px-3 py-2 border rounded-md bg-black text-white border-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="all">Reinheitsgrade</option>
        {clarities.map(clarity => (
          <option key={clarity} value={clarity}>{clarity}</option>
        ))}
      </select>

      <select
        value={selectedTreatment}
        onChange={(e) => setSelectedTreatment(e.target.value)}
        className="px-3 py-2 border rounded-md bg-black text-white border-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="all">Behandlungen</option>
        {treatments.map(treatment => (
          <option key={treatment} value={treatment}>
            {treatment === 'none' ? 'Unbehandelt' : treatment}
          </option>
        ))}
      </select>

      <select
        value={selectedCertification}
        onChange={(e) => setSelectedCertification(e.target.value)}
        className="px-3 py-2 border rounded-md bg-black text-white border-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="all">Zertifikate</option>
        {certifications.map(cert => (
          <option key={cert} value={cert}>
            {cert === 'none' ? 'Kein Zertifikat' : cert}
          </option>
        ))}
      </select>

      {getActiveFiltersCount() > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center gap-2 bg-black text-white border-gray-600 hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
          Zurücksetzen
        </Button>
      )}
    </div>
  );
}
