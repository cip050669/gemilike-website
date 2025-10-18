'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Gemstone, isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';
import { MediaGallery } from './MediaGallery';
import { TreatmentIcon } from './TreatmentIcon';
import { WishlistButton } from './WishlistButton';
import { ShoppingCart, Eye, Award, Ruler, Weight, MapPin, Star, Gem, FlaskConical } from 'lucide-react';

interface QuickViewModalProps {
  gemstone: Gemstone | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (gemstone: Gemstone) => void;
  isAdded: boolean;
}

export function QuickViewModal({ gemstone, isOpen, onClose, onAddToCart, isAdded }: QuickViewModalProps) {
  const t = useTranslations('shop');
  
  if (!gemstone) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t('quickView')} - {gemstone.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Media Gallery */}
          <div className="space-y-4">
            <MediaGallery
              images={gemstone.images}
              videos={gemstone.videos}
              gemName={gemstone.name}
              className="rounded-lg"
              certification={gemstone.certification}
              inStock={gemstone.inStock}
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold">{gemstone.name}</h2>
                <WishlistButton gemstoneId={gemstone.id} />
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{gemstone.category}</Badge>
                <Badge variant={gemstone.type === 'cut' ? 'default' : 'secondary'}>
                  {gemstone.type === 'cut' ? t('cut') : t('rough')}
                </Badge>
                <Badge variant={gemstone.inStock ? 'default' : 'secondary'}>
                  {gemstone.inStock ? t('available') : t('soldOut')}
                </Badge>
              </div>
              
              <p className="text-3xl font-bold text-primary mb-4">
                €{gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </p>
              
              {gemstone.description && (
                <p className="text-muted-foreground mb-6">{gemstone.description}</p>
              )}
            </div>
            
            {/* Key Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">{t('keyDetails')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('origin')}:</span>
                    <span>{gemstone.origin}</span>
                  </div>
                  
                  {isCutGemstone(gemstone) && (
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t('caratWeight')}:</span>
                      <span>{gemstone.caratWeight} ct</span>
                    </div>
                  )}
                  
                  {isRoughGemstone(gemstone) && (
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t('gramWeight')}:</span>
                      <span>{gemstone.gramWeight} g</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('dimensions')}:</span>
                    <span>{gemstone.dimensions.length}×{gemstone.dimensions.width}×{gemstone.dimensions.height} mm</span>
                  </div>
                  
                  {gemstone.certification.certified && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t('certification')}:</span>
                      <span>{gemstone.certification.laboratory}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('treatment')}:</span>
                    <div className="flex items-center gap-1">
                      <TreatmentIcon treatment={gemstone.treatment} />
                      <span>{gemstone.treatment.treated ? gemstone.treatment.type : t('untreated')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={() => onAddToCart(gemstone)}
                disabled={!gemstone.inStock || isAdded}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isAdded ? t('added') : t('addToCart')}
              </Button>
              
              <Button variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                {t('viewDetails')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
