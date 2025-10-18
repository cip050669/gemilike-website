'use client';

import { Palette } from 'lucide-react';

interface ColorSaturationScaleProps {
  saturation: number; // 1-10
  className?: string;
}

export function ColorSaturationScale({ saturation, className = '' }: ColorSaturationScaleProps) {
  const getSaturationColor = (level: number) => {
    const intensity = level / 10;
    const hue = 200; // Blau als Basis
    const saturation = Math.max(0.1, intensity);
    const lightness = Math.max(0.3, 0.8 - intensity * 0.3);
    
    return `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
  };

  const getSaturationLabel = (level: number) => {
    if (level <= 2) return 'Sehr blass';
    if (level <= 4) return 'Blass';
    if (level <= 6) return 'Mittel';
    if (level <= 8) return 'Intensiv';
    return 'Sehr intensiv';
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Piktogramm mit Farbsättigungswert */}
      <div className="flex flex-col items-center space-y-1">
        <div className="relative">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold rounded-full h-3 w-3 flex items-center justify-center">
            {saturation}
          </div>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">Sättigung</span>
      </div>
      
      {/* Farbsättigungsskala unterhalb des Piktogramms */}
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 10 }, (_, i) => {
          const level = i + 1;
          const isActive = level <= saturation;
          const color = getSaturationColor(level);
          
          return (
            <div
              key={level}
              className={`h-2 w-2 rounded-full border transition-all duration-200 ${
                isActive 
                  ? 'border-primary shadow-sm' 
                  : 'border-gray-300 bg-gray-100'
              }`}
              style={{
                backgroundColor: isActive ? color : undefined,
                boxShadow: isActive ? `0 0 2px ${color}40` : undefined
              }}
              title={`Stufe ${level}: ${getSaturationLabel(level)}`}
            />
          );
        })}
      </div>
      
      {/* Beschriftung unterhalb der Skala */}
      <div className="text-[9px] text-center text-muted-foreground">
        {getSaturationLabel(saturation)}
      </div>
    </div>
  );
}
