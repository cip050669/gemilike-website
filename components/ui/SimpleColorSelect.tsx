'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColorOption {
  id: string;
  name: string;
  value: string;
  bg: string;
  text: string;
  border: string;
  isCustom: boolean;
}

interface SimpleColorSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  refreshTrigger?: number; // Optional: Trigger für manuelle Aktualisierung
}

// Standard-Farben als konstante Daten
const STANDARD_COLORS: ColorOption[] = [
  { id: 'blue', name: 'Blau', value: 'blau', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', isCustom: false },
  { id: 'red', name: 'Rot', value: 'rot', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', isCustom: false },
  { id: 'green', name: 'Grün', value: 'grün', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', isCustom: false },
  { id: 'yellow', name: 'Gelb', value: 'gelb', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', isCustom: false },
  { id: 'orange', name: 'Orange', value: 'orange', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', isCustom: false },
  { id: 'purple', name: 'Lila', value: 'lila', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', isCustom: false },
  { id: 'pink', name: 'Pink', value: 'pink', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', isCustom: false },
  { id: 'white', name: 'Weiß', value: 'weiß', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', isCustom: false },
  { id: 'black', name: 'Schwarz', value: 'schwarz', bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-700', isCustom: false },
  { id: 'brown', name: 'Braun', value: 'braun', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', isCustom: false },
  { id: 'transparent', name: 'Transparent', value: 'transparent', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200', isCustom: false },
];

export function SimpleColorSelect({ 
  value, 
  onValueChange, 
  placeholder = "Farbe auswählen...",
  className,
  refreshTrigger
}: SimpleColorSelectProps) {
  const [colors, setColors] = useState<ColorOption[]>(STANDARD_COLORS);
  const [isLoading, setIsLoading] = useState(false);

  // Lade Farben beim Mount und bei refreshTrigger-Änderungen
  useEffect(() => {
    loadColors();
  }, [refreshTrigger]);

  const loadColors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/colors');
      if (response.ok) {
        const data = await response.json();
        setColors(data.colors || STANDARD_COLORS);
      }
    } catch (error) {
      console.warn('Failed to load colors from API, using fallback:', error);
      setColors(STANDARD_COLORS);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedColor = colors.find(color => color.value === value);

  return (
    <div className={cn("space-y-2", className)}>
      <Select value={value || ""} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {selectedColor && (
              <div className="flex items-center gap-2">
                <Badge 
                  className={`text-xs px-2 py-1 ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border} border`}
                >
                  {selectedColor.name}
                </Badge>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Lade Farben...</span>
            </div>
          ) : (
            colors.map((color) => (
              <SelectItem key={color.id} value={color.value}>
                <div className="flex items-center gap-3 w-full">
                  <Badge 
                    className={`text-xs px-2 py-1 ${color.bg} ${color.text} ${color.border} border`}
                  >
                    {color.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {color.value}
                  </span>
                  {color.isCustom && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      Benutzerdefiniert
                    </span>
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {/* Vorschau der gewählten Farbe */}
      {selectedColor && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Vorschau:</span>
          <Badge 
            className={`text-xs px-2 py-1 ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border} border`}
          >
            {selectedColor.name}
          </Badge>
        </div>
      )}
    </div>
  );
}
