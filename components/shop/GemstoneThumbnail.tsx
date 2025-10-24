import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Gemstone } from '@/lib/types/gemstone';
import { TreatmentIcon } from './TreatmentIcon';
import { PictogramWithTooltip } from './PictogramWithTooltip';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getColorBadgeStyle } from '@/lib/utils/colorBadge';

interface GemstoneThumbnailProps {
  gemstone: Gemstone;
  onOpenCard: (gemstone: Gemstone) => void;
}


export function GemstoneThumbnail({ gemstone, onOpenCard }: GemstoneThumbnailProps) {
  const t = useTranslations('shop');
  const adminT = useTranslations('admin');
  const colorStyle = gemstone.color ? getColorBadgeStyle(gemstone.color) : null;
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
      onClick={() => onOpenCard(gemstone)}
    >
      <CardContent className="p-3">
        {/* Bild */}
        <div className="relative mb-3">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            {(() => {
              const firstImage = gemstone.images?.[0];
              const isValidImage = firstImage && 
                typeof firstImage === 'string' && 
                firstImage.trim() !== '' && 
                (firstImage.startsWith('/') || firstImage.startsWith('http'));
              
              if (isValidImage) {
                return (
                  <div className="relative w-full h-full">
                    <Image
                      src={firstImage}
                      alt={gemstone.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Image load error for:', gemstone.name, 'Image:', firstImage);
                        // Zeige Platzhalter anstatt Fehler
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="image-placeholder absolute inset-0 hidden items-center justify-center text-muted-foreground bg-muted">
                      <span className="text-xs">Bild nicht verfügbar</span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-xs">Kein Bild</span>
                  </div>
                );
              }
            })()}
          </div>
          
          {/* Neu Badge oben links */}
          {gemstone.isNew && (
            <Badge className="absolute top-2 left-2 bg-orange-500 text-black text-xs font-bold px-2 py-1 shadow-sm">
              {adminT('isNew')}
            </Badge>
          )}
          
          {/* Preis Badge oben rechts */}
          <Badge className="absolute top-2 right-2 text-xs font-bold px-2 py-1 shadow-sm">
            €{gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
          </Badge>
          
            {/* Lab Zertifizierung Badge */}
            {gemstone.certification?.certified && gemstone.certification.lab && (
              <Badge className="absolute bottom-2 right-2 text-[10px] bg-slate-600/90 text-white px-1.5 py-0.5 shadow-sm flex items-center gap-1">
            <PictogramWithTooltip iconName="Award" size="sm" />
                {gemstone.certification.lab}
              </Badge>
            )}
          
          {/* Behandlungsmethode Badge */}
          {gemstone.treatment?.treated && gemstone.treatment.type && gemstone.treatment.type !== 'none' && (
            <div className="absolute bottom-2 left-2 z-10">
              <TreatmentIcon treatment={gemstone.treatment} size="lg-sm" showText={true} />
            </div>
          )}
          
          {/* Verkauft Badge - nur wenn nicht verfügbar */}
          {!gemstone.inStock && (
            <div className="absolute top-2 left-[28px] z-10">
              <div 
                className="inline-flex items-center justify-center rounded-md bg-red-500 text-white shadow-sm text-xs px-2 py-1 font-medium"
                role="status"
                aria-label="Dieser Edelstein ist verkauft"
              >
                Verkauft
              </div>
            </div>
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gray-800/50/0 group-hover:bg-gray-800/50/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Titel */}
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{gemstone.name}</h3>
        
        {/* Kategorie und Farbe */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <PictogramWithTooltip iconName="Tag" size="sm" />
            <span className="text-xs text-muted-foreground">{gemstone.category}</span>
          </div>
          {gemstone.color && colorStyle && (
            <div className="flex items-center gap-1">
              <PictogramWithTooltip iconName="Palette" size="sm" />
              <Badge 
                className={`text-[10px] px-0.5 py-0.5 ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border} border`}
              >
                {gemstone.color}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Kurze Beschreibung */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {gemstone.description}
        </p>

        {/* Wichtige Infos */}
        <div className="space-y-1 text-xs">
          {/* Herkunft */}
          <div className="flex items-center gap-1">
            <PictogramWithTooltip iconName="MapPin" size="sm" />
            <span className="text-muted-foreground">{t('origin')}:</span>
            <span className="font-medium truncate">{gemstone.origin}</span>
          </div>

          {/* Gewicht */}
          <div className="flex items-center gap-1">
            <PictogramWithTooltip iconName="Weight" size="sm" />
            <span className="text-muted-foreground">{t('weight')}:</span>
            <span className="font-medium">
              {gemstone.type === 'cut' && 'caratWeight' in gemstone ? `${gemstone.caratWeight} ct` : 
               gemstone.type === 'rough' && 'gramWeight' in gemstone ? `${gemstone.gramWeight} g` : 
               'N/A'}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
