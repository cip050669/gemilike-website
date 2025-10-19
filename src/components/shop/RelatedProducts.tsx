'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '../../store/cart';
import { useWishlistStore } from '../../store/wishlist';

interface RelatedProductsProps {
  products: Product[];
  className?: string;
}

export default function RelatedProducts({ products, className }: RelatedProductsProps): JSX.Element {
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const handleAddToCart = (product: Product): void => {
    addToCart({
      id: product.id,
      productId: product.id,
      product,
      quantity: 1,
      price: product.price,
      total: product.price
    });
  };

  const handleWishlistToggle = (product: Product): void => {
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

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-2xl sm:text-3xl font-heading text-white mb-8">
        Ähnliche Produkte
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group bg-slate-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <Link href={`/de/shop/${product.slug}`}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => handleWishlistToggle(product)}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                </button>
                {product.featured && (
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{product.category}</span>
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-slate-400 ml-1">4.8</span>
                </div>
              </div>
              
              <Link href={`/de/shop/${product.slug}`}>
                <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-slate-300 text-xs mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-white">
                    €{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through ml-2">
                      €{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
