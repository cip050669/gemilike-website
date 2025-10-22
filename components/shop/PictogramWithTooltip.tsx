'use client';

import { Tooltip } from '@/components/ui/tooltip';
import { usePictogramDescriptions } from '@/lib/hooks/usePictogramDescriptions';
import { 
  Sparkles, 
  Tag, 
  MapPin, 
  Weight, 
  Ruler, 
  Star, 
  Palette, 
  Droplets, 
  CircleDot,
  Gem,
  Shapes,
  FlaskConical,
  Award,
  Info
} from 'lucide-react';

interface PictogramWithTooltipProps {
  iconName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PictogramWithTooltip({ 
  iconName, 
  className = '', 
  size = 'sm' 
}: PictogramWithTooltipProps) {
  const { getDescriptionByIcon, getTitleByIcon } = usePictogramDescriptions();
  
  const description = getDescriptionByIcon(iconName);
  const title = getTitleByIcon(iconName);
  
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Sparkles,
      Tag,
      MapPin,
      Weight,
      Ruler,
      Star,
      Palette,
      Droplets,
      CircleDot,
      Gem,
      Shapes,
      FlaskConical,
      Award,
    };
    
    const IconComponent = iconMap[iconName] || Info;
    return IconComponent;
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'md':
        return 'h-4 w-4';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-3 w-3';
    }
  };

  const getIconColor = (iconName: string) => {
    const colorMap: { [key: string]: string } = {
      Sparkles: 'text-yellow-400',      // Rarität - Gold
      Tag: 'text-blue-500',            // Kategorie - Blau
      Award: 'text-purple-500',        // Entstehung - Lila
      MapPin: 'text-green-500',        // Herkunft - Grün
      Weight: 'text-orange-500',       // Gewicht - Orange
      Ruler: 'text-cyan-500',         // Größe - Cyan
      Star: 'text-pink-500',          // Reinheit - Pink
      Palette: 'text-indigo-500',      // Farbe - Indigo
      Droplets: 'text-teal-500',      // Farbintensität - Teal
      CircleDot: 'text-emerald-500',  // Farbsättigung - Smaragd
      Gem: 'text-amber-500',          // Schliff - Bernstein
      Shapes: 'text-violet-500',      // Form - Violett
      FlaskConical: 'text-red-500',   // Behandlung - Rot
    };
    
    return colorMap[iconName] || 'text-muted-foreground';
  };

  const IconComponent = getIconComponent(iconName);
  const tooltipContent = description ? `${title}: ${description}` : title || '';

  const iconColor = getIconColor(iconName);

  if (!tooltipContent) {
    return (
      <IconComponent 
        className={`${getSizeClasses(size)} ${iconColor} flex-shrink-0 ${className}`} 
        aria-hidden="true" 
      />
    );
  }

  return (
    <Tooltip content={tooltipContent} position="top" delay={200}>
      <IconComponent 
        className={`${getSizeClasses(size)} ${iconColor} flex-shrink-0 cursor-help ${className}`} 
        aria-hidden="true" 
      />
    </Tooltip>
  );
}
