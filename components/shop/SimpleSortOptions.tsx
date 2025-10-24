'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { Gemstone } from '@/lib/types/gemstone';

export type SimpleSortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'popular';

interface SimpleSortOptionsProps {
  value: SimpleSortOption;
  onValueChange: (value: SimpleSortOption) => void;
}

export function SimpleSortOptions({ value, onValueChange }: SimpleSortOptionsProps) {
  const sortOptions = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-asc', label: 'Preis: Niedrig zu Hoch' },
    { value: 'price-desc', label: 'Preis: Hoch zu Niedrig' },
    { value: 'newest', label: 'Neueste zuerst' },
    { value: 'popular', label: 'Beliebteste' }
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[200px] bg-gray-800/50 text-white border-gray-600 hover:bg-gray-800">
          <SelectValue placeholder="Sortieren nach..." />
        </SelectTrigger>
        <SelectContent className="bg-gray-800/50 border-gray-600">
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-white hover:bg-gray-800 focus:bg-gray-800"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Sortierungs-Funktion
export function sortGemstones(gemstones: Gemstone[], sortOption: SimpleSortOption): Gemstone[] {
  const sorted = [...gemstones];
  
  switch (sortOption) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      // Fallback: nach ID sortieren (neueste zuerst)
      return sorted.sort((a, b) => b.id.localeCompare(a.id));
    case 'popular':
      // Fallback: nach Name sortieren
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}
