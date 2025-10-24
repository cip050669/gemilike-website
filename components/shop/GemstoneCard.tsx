import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { Gemstone, isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';
import { MediaGallery } from './MediaGallery';
import { TreatmentIcon } from './TreatmentIcon';
import { WishlistButton } from '@/components/cart/WishlistButton';
import { PictogramWithTooltip } from './PictogramWithTooltip';
import { useTranslations } from 'next-intl';
import { getColorBadgeStyle, getColorIntensityBadgeStyle } from '@/lib/utils/colorBadge';

interface GemstoneCardProps {
  gemstone: Gemstone;
  onAddToCart: (gemstone: Gemstone) => void;
  isAdded: boolean;
  onQuickView?: (gemstone: Gemstone) => void;
}


export function GemstoneCard({ gemstone, onAddToCart, isAdded, onQuickView }: GemstoneCardProps) {
  const t = useTranslations('shop');
  const adminT = useTranslations('admin');
  const colorStyle = gemstone.color ? getColorBadgeStyle(gemstone.color) : null;
  const colorIntensityStyle = isCutGemstone(gemstone) && gemstone.colorIntensity 
    ? getColorIntensityBadgeStyle(gemstone.colorIntensity) 
    : null;
  
  return (
    <Card 
      className="flex flex-col hover:shadow-lg transition-shadow"
      role="article"
      aria-label={`Edelstein ${gemstone.name} - ${gemstone.category}`}
    >
      <CardHeader className="p-2 sm:p-3 pb-0 flex-shrink-0">
        {/* Media Gallery */}
        <div className="relative mb-4 overflow-hidden">
          <MediaGallery
            images={gemstone.images}
            videos={gemstone.videos}
            gemName={gemstone.name}
            className="rounded-lg max-h-[300px] object-contain"
            certification={gemstone.certification}
            inStock={gemstone.inStock}
          />
          
          {/* Neu Badge oben links */}
          {gemstone.isNew && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-gem-fire text-gem-bgDark shadow-sm text-xs font-bold px-2 py-1">
                {adminT('isNew')}
              </Badge>
            </div>
          )}
          
          {/* Wishlist Button oben rechts des Bildes */}
          <div className="absolute top-2 right-8 z-10">
            <WishlistButton
              item={{
                id: gemstone.id,
                name: gemstone.name,
                price: gemstone.price,
                image: gemstone.images?.[0],
                category: gemstone.category,
                origin: gemstone.origin ?? undefined,
              }}
              className="bg-gem-purple/90 hover:bg-gem-purple/80 shadow-sm h-6 w-6"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-3 flex flex-col">
        {/* Titel, Kategorie und Preis */}
        <div className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <CardTitle 
              className="text-base line-clamp-1 flex-1"
              id={`gemstone-title-${gemstone.id}`}
            >
              {gemstone.name}
            </CardTitle>
            <div 
              className="bg-gem-fire text-gem-bgDark px-2 py-1 rounded-md text-sm font-bold ml-2 flex-shrink-0"
              aria-label={`Preis: ${gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })} Euro`}
            >
              €{gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <CardDescription 
            className="text-xs text-gem-text2"
            aria-describedby={`gemstone-title-${gemstone.id}`}
          >
            {gemstone.category}
          </CardDescription>
        </div>

        {/* Beschreibung */}
        <p className="text-xs text-gem-text2 mb-3 line-clamp-2 flex-shrink-0">
          {gemstone.description}
        </p>

        {/* Spezifikationen */}
        <div className="space-y-1.5 text-xs" role="list" aria-label="Edelstein-Spezifikationen">
          {/* Raritäten */}
          {gemstone.rarity && gemstone.rarity !== 'none' && (
            <div className="flex items-center gap-2" role="listitem">
              {gemstone.rarity === 'seltenes' && <PictogramWithTooltip iconName="Sparkles" className="text-blue-500" />}
              {gemstone.rarity === 'außergewöhnliches' && <PictogramWithTooltip iconName="Sparkles" className="text-purple-500" />}
              {gemstone.rarity === 'großes' && <PictogramWithTooltip iconName="Sparkles" className="text-orange-500" />}
              {gemstone.rarity === 'besonders schön' && <PictogramWithTooltip iconName="Sparkles" className="text-amber-500" />}
              <span className="text-muted-foreground">Rarität:</span>
              <Badge 
                className={`text-[10px] px-2 py-0.5 border ${
                  gemstone.rarity === 'seltenes' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  gemstone.rarity === 'außergewöhnliches' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                  gemstone.rarity === 'großes' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                  gemstone.rarity === 'besonders schön' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}
                aria-label={`Rarität: ${gemstone.rarity}`}
              >
                {gemstone.rarity}
              </Badge>
            </div>
          )}

          {/* Kategorie */}
          <div className="flex items-center gap-2" role="listitem">
            <PictogramWithTooltip iconName="Tag" />
            <span className="text-muted-foreground">{t('category')}:</span>
            <span className="font-medium">{gemstone.category}</span>
          </div>

          {/* Entstehung */}
          <div className="flex items-center gap-2" role="listitem">
            <PictogramWithTooltip iconName="Award" />
            <span className="text-muted-foreground">Entstehung:</span>
            <span className="font-medium">{gemstone.originType || 'natürlich'}</span>
          </div>

          {/* Herkunft */}
          <div className="flex items-center gap-2" role="listitem">
            <PictogramWithTooltip iconName="MapPin" />
            <span className="text-muted-foreground">{t('origin')}:</span>
            <span className="font-medium">{gemstone.origin}</span>
          </div>

          {/* Gewicht */}
          <div className="flex items-center gap-2" role="listitem">
            <PictogramWithTooltip iconName="Weight" />
            <span className="text-muted-foreground">{t('weight')}:</span>
            <span className="font-medium">
              {isCutGemstone(gemstone) 
                ? `${gemstone.caratWeight} ct` 
                : `${gemstone.gramWeight} g`}
            </span>
          </div>

          {/* Abmessungen */}
          <div className="flex items-center gap-2" role="listitem">
            <PictogramWithTooltip iconName="Ruler" />
            <span className="text-muted-foreground">{t('size')}:</span>
            <span className="font-medium text-xs">
              {gemstone.dimensions.length} × {gemstone.dimensions.width} × {gemstone.dimensions.height} mm
            </span>
          </div>

          {/* Reinheit - nur für geschliffene Edelsteine */}
          {isCutGemstone(gemstone) && gemstone.clarity && (
            <div className="flex items-center gap-2" role="listitem">
              <PictogramWithTooltip iconName="Star" />
              <span className="text-muted-foreground">{t('clarity')}:</span>
              <span className="font-medium">{gemstone.clarity}</span>
            </div>
          )}

          {/* Farbe */}
          {gemstone.color && colorStyle && (
            <div className="flex items-center gap-2" role="listitem">
              <PictogramWithTooltip iconName="Palette" />
              <span className="text-muted-foreground">{t('color')}:</span>
              <Badge
                className={`text-[10px] px-1 py-0.5 ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border} border`}
                aria-label={`Farbe: ${gemstone.color}`}
              >
                {gemstone.color}
              </Badge>
            </div>
          )}

          {/* Farbsättigung */}
          {isCutGemstone(gemstone) && gemstone.colorIntensity && colorIntensityStyle && (
            <div className="flex items-center gap-2" role="listitem">
              <PictogramWithTooltip iconName="Droplets" />
              <span className="text-muted-foreground">Farbsättigung:</span>
              <Badge
                className={`text-[10px] px-1 py-0.5 ${colorIntensityStyle.bg} ${colorIntensityStyle.text} ${colorIntensityStyle.border} border`}
                aria-label={`Farbsättigung: ${gemstone.colorIntensity}`}
              >
                {gemstone.colorIntensity}
              </Badge>
            </div>
          )}

          {/* Helligkeitsskala - nur für geschliffene Edelsteine */}
          {isCutGemstone(gemstone) && gemstone.colorSaturation && (
            <div className="flex items-center gap-2" role="listitem">
              <PictogramWithTooltip iconName="CircleDot" />
              <span className="text-gem-text2">Helligkeit:</span>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 10 }, (_, i) => {
                  const level = i + 1;
                  const isCurrentLevel = level === gemstone.colorSaturation;
                  
                  // Farbskala von 1-10 von grau zu blau (wie im Adminpanel)
                  const getColorForLevel = (level: number) => {
                    const intensity = level / 10;
                    const grayValue = Math.floor(255 * (1 - intensity * 0.7)); // Von hellgrau zu dunkelgrau
                    return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                  };
                  
                  const colorForLevel = getColorForLevel(level);
                  
                  return (
                    <div
                      key={level}
                      className={`h-3 w-3 rounded-full transition-all duration-200 ${
                        isCurrentLevel
                          ? 'border border-gem-ice shadow-lg scale-[1.82]' // 10% kleiner (2.025 - 0.2 = 1.82)
                          : level >= 7 
                          ? '' // Keine Umrandung für Stufen 7-10
                          : 'border border-gem-iceDark/40'
                      }`}
                      style={{
                        backgroundColor: colorForLevel,
                        boxShadow: isCurrentLevel ? `0 0 8px ${colorForLevel}70, 0 0 16px ${colorForLevel}50` : undefined
                      }}
                      title={`Stufe ${level}${isCurrentLevel ? ' (aktuell)' : ''}`}
                    />
                  );
                })}
              </div>
              <div className="bg-gem-ice/20 border-2 border-gem-ice rounded-md px-2 py-1 shadow-sm">
                <span className="text-xs font-bold text-gem-ice">
                  {gemstone.colorSaturation}/10
                </span>
              </div>
            </div>
          )}

          {/* Schliff - nur für geschliffene Edelsteine */}
          {isCutGemstone(gemstone) && (
            <div className="flex items-center gap-2" role="listitem">
              <PictogramWithTooltip iconName="Gem" />
              <span className="text-muted-foreground">{t('cut')}:</span>
              <span className="font-medium">{gemstone.cut}</span>
            </div>
          )}

          {/* Form - nur für geschliffene Edelsteine */}
          {isCutGemstone(gemstone) && (
            <div className="flex items-center gap-2" role="listitem">
              <PictogramWithTooltip iconName="Shapes" />
              <span className="text-gem-text2">{t('form')}:</span>
              <span className="font-medium">{gemstone.cutForm || 'Nicht angegeben'}</span>
            </div>
          )}

          {/* Kristallform - nur für Rohsteine */}
          {isRoughGemstone(gemstone) && gemstone.crystalForm && (
            <div className="flex items-center gap-2" role="listitem">
              <PictogramWithTooltip iconName="Shapes" />
              <span className="text-gem-text2">Kristallform:</span>
              <span className="font-medium">{gemstone.crystalForm}</span>
            </div>
          )}


          {/* Spezifische Infos für Rohsteine */}
          {isRoughGemstone(gemstone) && (
            <div className="flex items-center gap-2" role="listitem">
              <PictogramWithTooltip iconName="Star" />
              <span className="text-gem-text2">{t('quality')}:</span>
              <span className="font-medium">{gemstone.crystalQuality}</span>
            </div>
          )}

          {/* Behandlung */}
          <div className="flex items-center gap-2" role="listitem">
            <PictogramWithTooltip iconName="FlaskConical" />
            <span className="text-gem-text2">{t('treatment')}:</span>
            <TreatmentIcon treatment={gemstone.treatment} size="lg-sm" showText={true} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 pt-0">
        <div className="flex gap-2 w-full">
          <Button
            className="flex-1 text-sm h-9"
            onClick={() => onAddToCart(gemstone)}
            disabled={isAdded || !gemstone.inStock}
            aria-label={
              !gemstone.inStock 
                ? `${t('soldOut')} - ${gemstone.name}`
                : isAdded 
                ? `${t('added')} - ${gemstone.name}`
                : `${t('addToCart')} - ${gemstone.name}`
            }
          >
            {!gemstone.inStock ? (
              t('soldOut')
            ) : isAdded ? (
              t('added')
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('addToCart')}
              </>
            )}
          </Button>
          
          {onQuickView && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuickView(gemstone)}
              className="flex-shrink-0 h-9 w-9"
              aria-label={`Schnellansicht für ${gemstone.name}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
