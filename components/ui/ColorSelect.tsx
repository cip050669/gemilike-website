'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
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

interface ColorSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ColorSelect({ 
  value, 
  onValueChange, 
  placeholder = "Farbe auswählen...",
  className 
}: ColorSelectProps) {
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lade Farben beim Mount
  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    // Standard-Farben als Fallback
    const fallbackColors: ColorOption[] = [
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

    try {
      const response = await fetch('/api/admin/colors');
      if (response.ok) {
        const data = await response.json();
        setColors(data.colors || fallbackColors);
      } else {
        // API nicht verfügbar oder nicht authentifiziert, verwende Fallback
        setColors(fallbackColors);
      }
    } catch (error) {
      console.warn('Failed to load colors from API, using fallback:', error);
      // Fallback zu Standard-Farben
      setColors(fallbackColors);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedColor = colors.find(color => color.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedColor ? (
            <div className="flex items-center gap-2">
              <Badge 
                className={`text-xs px-2 py-1 ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border} border`}
              >
                {selectedColor.name}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Farbe suchen..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Lade Farben..." : "Keine Farbe gefunden."}
            </CommandEmpty>
            <CommandGroup>
              {colors.map((color) => (
                <CommandItem
                  key={color.id}
                  value={color.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
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
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === color.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
