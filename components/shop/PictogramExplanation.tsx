'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PictogramDescription } from '@/lib/types/pictogram-descriptions';

interface PictogramExplanationProps {
  className?: string;
}

export function PictogramExplanation({ className = '' }: PictogramExplanationProps) {
  const t = useTranslations('shop');
  const [descriptions, setDescriptions] = useState<PictogramDescription[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDescriptions = async () => {
      try {
        const response = await fetch('/api/admin/pictogram-descriptions', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.descriptions) {
            // Sort by order and filter active descriptions
            const sortedDescriptions = data.descriptions
              .filter((desc: PictogramDescription) => desc.isActive)
              .sort((a: PictogramDescription, b: PictogramDescription) => a.order - b.order);
            setDescriptions(sortedDescriptions);
          }
        }
      } catch (error) {
        console.error('Error loading pictogram descriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDescriptions();
  }, []);

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Sparkles,
      Tag,
      MapPin,
      Weight,
      Ruler,
      Star,
      Palette,
      Droplets,
      CircleDot,
    };
    
    const IconComponent = iconMap[iconName] || Info;
    return <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
  };

  if (loading) {
    return (
      <div className={`bg-muted/20 border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-muted-foreground">Lade Erklärungen...</span>
        </div>
      </div>
    );
  }

  if (descriptions.length === 0) {
    return (
      <div className={`bg-muted/20 border border-border rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Keine Piktogramm-Erklärungen verfügbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-muted/20 border border-border rounded-lg ${className}`}>
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-4 h-auto hover:bg-muted/30"
      >
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-primary" />
          <span className="font-medium text-left">
            {t('pictogramExplanation')}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t('pictogramExplanationText')}
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {descriptions.map((description) => (
                <div
                  key={description.id}
                  className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg border border-border/50"
                >
                  {getIconComponent(description.icon)}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {description.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {description.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
