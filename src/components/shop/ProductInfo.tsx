'use client';

import { useState } from 'react';
import { Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '../../store/cart';
import { useWishlistStore } from '../../store/wishlist';

interface ProductInfoProps {
  product: Product;
  className?: string;
}

export default function ProductInfo({ product, className }: ProductInfoProps): JSX.Element {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const handleAddToCart = (): void => {
    addToCart({
      id: product.id,
      productId: product.id,
      product,
      quantity,
      price: product.price,
      total: product.price * quantity
    });
  };

  const handleWishlistToggle = (): void => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        product,
        addedAt: new Date().toISOString()
      });
    }
  };

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Product Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-slate-400">{product.category}</span>
          {product.featured && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{discountPercentage}%
            </span>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-display text-white mb-4">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-white ml-1">4.8</span>
            <span className="text-slate-400 ml-1">(24 Bewertungen)</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-white">
          €{product.price.toLocaleString()}
        </span>
        {product.originalPrice && (
          <span className="text-xl text-slate-400 line-through">
            €{product.originalPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <p className="text-slate-300 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Product Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Menge
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-600 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-white hover:bg-slate-700"
              >
                -
              </button>
              <span className="px-4 py-2 text-white border-x border-slate-600">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-white hover:bg-slate-700"
              >
                +
              </button>
            </div>
            <span className="text-sm text-slate-400">
              {product.stock > 0 ? `${product.stock} verfügbar` : 'Nicht verfügbar'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            {product.stock > 0 ? 'In den Warenkorb' : 'Nicht verfügbar'}
          </button>
          <button
            onClick={handleWishlistToggle}
            className={`p-3 rounded-lg border transition-colors ${
              isInWishlist(product.id)
                ? 'bg-red-500 border-red-500 text-white'
                : 'border-slate-600 text-slate-300 hover:border-slate-500'
            }`}
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-3 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-500 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-sm font-medium text-white">Kostenloser Versand</p>
            <p className="text-xs text-slate-400">Innerhalb Deutschlands</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm font-medium text-white">Sichere Zahlung</p>
            <p className="text-xs text-slate-400">SSL-verschlüsselt</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-sm font-medium text-white">30 Tage Rückgabe</p>
            <p className="text-xs text-slate-400">Kostenlos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
