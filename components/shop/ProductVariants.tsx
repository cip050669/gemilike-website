'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gemstone } from '@/lib/types/gemstone';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  weight?: number;
  dimensions?: string;
  inStock: boolean;
  stock: number;
  sku?: string;
}

interface ProductVariantsProps {
  gemstone: Gemstone;
  variants?: ProductVariant[];
  onVariantSelect?: (variant: ProductVariant) => void;
  onAddToCart?: (variant: ProductVariant, quantity: number) => void;
}

export function ProductVariants({ 
  gemstone, 
  variants = [], 
  onVariantSelect,
  onAddToCart 
}: ProductVariantsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
    onVariantSelect?.(variant);
  };

  const handleAddToCart = () => {
    if (selectedVariant && onAddToCart) {
      onAddToCart(selectedVariant, quantity);
    }
  };

  // If no variants, show the base gemstone
  if (variants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verfügbare Optionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Standard</p>
              <p className="text-sm text-muted-foreground">
                {gemstone.dimensions.length} × {gemstone.dimensions.width} × {gemstone.dimensions.height} mm
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">€{gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
              <Badge variant={gemstone.inStock ? "default" : "secondary"}>
                {gemstone.inStock ? "Verfügbar" : "Ausverkauft"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verfügbare Varianten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Variant Selection */}
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedVariant?.id === variant.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleVariantSelect(variant)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{variant.name}</p>
                  {variant.dimensions && (
                    <p className="text-sm text-muted-foreground">
                      {variant.dimensions}
                    </p>
                  )}
                  {variant.weight && (
                    <p className="text-sm text-muted-foreground">
                      {variant.weight} {gemstone.type === 'cut' ? 'ct' : 'g'}
                    </p>
                  )}
                  {variant.sku && (
                    <p className="text-xs text-muted-foreground">
                      SKU: {variant.sku}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    €{variant.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge variant={variant.inStock ? "default" : "secondary"}>
                    {variant.inStock ? "Verfügbar" : "Ausverkauft"}
                  </Badge>
                  {variant.stock > 0 && variant.stock < 10 && (
                    <p className="text-xs text-orange-600 mt-1">
                      Nur noch {variant.stock} verfügbar
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quantity and Add to Cart */}
        {selectedVariant && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Menge:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!selectedVariant.inStock || quantity >= selectedVariant.stock}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gesamtpreis:</p>
                <p className="text-xl font-bold">
                  €{(selectedVariant.price * quantity).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant.inStock}
                className="px-6"
              >
                {selectedVariant.inStock ? 'In den Warenkorb' : 'Ausverkauft'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
