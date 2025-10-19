'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '../../store/cart';
import { useWishlistStore } from '../../store/wishlist';

interface ProductGridProps {
  products: Product[];
  filters: {
    category?: string;
    price?: string;
    sort?: string;
    search?: string;
  };
}

export default function ProductGrid({ products, filters }: ProductGridProps): JSX.Element {
  const [sortBy, setSortBy] = useState<string>(filters.sort || 'name');
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number);
      if (min && product.price < min) return false;
      if (max && product.price > max) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

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

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <p className="text-slate-300">
          {sortedProducts.length} Produkt{sortedProducts.length !== 1 ? 'e' : ''} gefunden
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2"
        >
          <option value="name">Name A-Z</option>
          <option value="price-low">Preis: Niedrig zu Hoch</option>
          <option value="price-high">Preis: Hoch zu Niedrig</option>
          <option value="newest">Neueste zuerst</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="group bg-slate-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
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
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{product.category}</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-slate-400 ml-1">4.8</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">
                    €{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through ml-2">
                      €{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  In den Warenkorb
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">Keine Produkte gefunden</p>
          <p className="text-slate-500 text-sm mt-2">
            Versuchen Sie andere Filter oder Suchbegriffe
          </p>
        </div>
      )}
    </div>
  );
}
