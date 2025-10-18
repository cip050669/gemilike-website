'use client';

import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 
  | 'name-asc' 
  | 'name-desc' 
  | 'price-asc' 
  | 'price-desc' 
  | 'weight-asc' 
  | 'weight-desc' 
  | 'date-newest' 
  | 'date-oldest';

interface SortOptionsProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  className?: string;
}

export function SortOptions({ value, onValueChange, className }: SortOptionsProps) {
  const t = useTranslations('shop');
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t('sortBy')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">{t('sortNameAsc')}</SelectItem>
          <SelectItem value="name-desc">{t('sortNameDesc')}</SelectItem>
          <SelectItem value="price-asc">{t('sortPriceAsc')}</SelectItem>
          <SelectItem value="price-desc">{t('sortPriceDesc')}</SelectItem>
          <SelectItem value="weight-asc">{t('sortWeightAsc')}</SelectItem>
          <SelectItem value="weight-desc">{t('sortWeightDesc')}</SelectItem>
          <SelectItem value="date-newest">{t('sortDateNewest')}</SelectItem>
          <SelectItem value="date-oldest">{t('sortDateOldest')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function sortGemstones(gemstones: any[], sortOption: SortOption) {
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
    case 'weight-asc':
      return sorted.sort((a, b) => {
        const weightA = 'caratWeight' in a ? a.caratWeight : a.gramWeight;
        const weightB = 'caratWeight' in b ? b.caratWeight : b.gramWeight;
        return weightA - weightB;
      });
    case 'weight-desc':
      return sorted.sort((a, b) => {
        const weightA = 'caratWeight' in a ? a.caratWeight : a.gramWeight;
        const weightB = 'caratWeight' in b ? b.caratWeight : b.gramWeight;
        return weightB - weightA;
      });
    case 'date-newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'date-oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    default:
      return sorted;
  }
}
