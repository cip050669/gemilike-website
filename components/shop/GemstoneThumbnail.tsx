import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Gemstone } from '@/lib/types/gemstone';
import { TreatmentIcon } from './TreatmentIcon';
import { PictogramWithTooltip } from './PictogramWithTooltip';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getColorBadgeStyle } from '@/lib/utils/colorBadge';
import { formatPrice } from '@/lib/utils/price';

interface GemstoneThumbnailProps {
  gemstone: Gemstone;
  onOpenCard: (gemstone: Gemstone) => void;
}

export function GemstoneThumbnail({ gemstone, onOpenCard }: GemstoneThumbnailProps) {
  const t = useTranslations('shop');
  const formatWeightValue = (value?: number | null, unit?: 'ct' | 'g') => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 'N/A';
    const formatted = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(value);
    return `${formatted} ${unit ?? 'ct'}`;
  };
  const adminT = useTranslations('admin');
  const colorStyle = gemstone.color ? getColorBadgeStyle(gemstone.color) : null;

  return (
    <div
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group rounded-lg border border-gem-iceDark/20 bg-gem-bgDark/80 shadow-sm backdrop-blur-sm gemstone-thumbnail-wrapper"
      onClick={() => onOpenCard(gemstone)}
      onDoubleClick={() => onOpenCard(gemstone)}
      style={
        {
          '--color-text-primary': '#000000',
          color: '#000000',
        } as React.CSSProperties & { '--color-text-primary': string }
      }
    >
      <div
        className="p-3 gemstone-thumbnail-content"
        style={
          {
            '--color-text-primary': '#000000',
            color: '#000000',
          } as React.CSSProperties & { '--color-text-primary': string }
        }
      >
        {/* Bild */}
        <div className="relative mb-3">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            {(() => {
              const firstImage = gemstone.images?.[0];
              const isValidImage =
                firstImage &&
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
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const placeholder = target.parentElement?.querySelector(
                          '.image-placeholder'
                        ) as HTMLElement | null;
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
              }

              return (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-xs">Kein Bild</span>
                </div>
              );
            })()}
          </div>

          {gemstone.isNew && (
            <Badge className="absolute top-2 left-2 bg-orange-500 text-black text-xs font-bold px-2 py-1 shadow-sm">
              {adminT('isNew')}
            </Badge>
          )}

          <Badge className="absolute top-2 right-2 text-xs font-bold px-2 py-1 shadow-sm">
            {formatPrice(gemstone.price, gemstone.currency)}
          </Badge>

          {gemstone.certification?.certified && gemstone.certification.lab && (
            <Badge className="absolute bottom-2 right-2 text-[10px] bg-slate-600/90 text-white px-1.5 py-0.5 shadow-sm flex items-center gap-1">
              <PictogramWithTooltip iconName="Award" size="sm" />
              {gemstone.certification.lab}
            </Badge>
          )}

          {gemstone.treatment?.treated &&
            gemstone.treatment.type &&
            gemstone.treatment.type !== 'none' && (
              <div className="absolute bottom-2 left-2 z-10">
                <TreatmentIcon treatment={gemstone.treatment} size="lg-sm" showText={true} />
              </div>
            )}

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

          <div className="absolute inset-0 bg-gray-800/50/0 group-hover:bg-gray-800/50/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <h3
          className="font-semibold text-sm mb-1 line-clamp-1 !text-black"
          style={{ color: 'black' } as React.CSSProperties}
        >
          {gemstone.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <PictogramWithTooltip iconName="Tag" size="sm" />
            <span className="text-xs !text-black" style={{ color: 'black' } as React.CSSProperties}>
              {gemstone.category}
            </span>
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

        <p
          className="text-xs !text-black mb-3 line-clamp-2"
          style={{ color: 'black' } as React.CSSProperties}
        >
          {gemstone.description}
        </p>

        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1">
            <PictogramWithTooltip iconName="MapPin" size="sm" />
            <span className="text-muted-foreground">{t('origin')}:</span>
            <span className="font-medium truncate">{gemstone.origin}</span>
          </div>

          <div className="flex items-center gap-1">
            <PictogramWithTooltip iconName="Weight" size="sm" />
            <span className="text-muted-foreground">{t('weight')}:</span>
            <span className="font-medium">
              {gemstone.type === 'cut' && 'caratWeight' in gemstone
                ? formatWeightValue(gemstone.caratWeight, 'ct')
                : gemstone.type === 'rough' && 'gramWeight' in gemstone
                  ? formatWeightValue(gemstone.gramWeight, 'g')
                  : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
