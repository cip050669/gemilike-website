'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import { Button } from '@/components/ui/button';

export default function Cart(): JSX.Element {
  const { 
    items, 
    subtotal, 
    tax, 
    shipping, 
    total, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCartStore();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 z-50 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Warenkorb ({items.length})
            </h2>
            <button
              onClick={closeCart}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Ihr Warenkorb ist leer</p>
                <p className="text-slate-500 text-sm mt-2">
                  Fügen Sie Produkte hinzu, um sie hier zu sehen
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-800/50 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-2">
                        {item.product.category}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm text-white w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            €{item.total.toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-700 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Zwischensumme</span>
                  <span className="text-white">€{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">MwSt. (19%)</span>
                  <span className="text-white">€{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Versand</span>
                  <span className="text-white">
                    {shipping === 0 ? 'Kostenlos' : `€${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-slate-700 pt-2">
                  <span className="text-white">Gesamt</span>
                  <span className="text-white">€{total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Zur Kasse
                </Button>
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Warenkorb leeren
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
