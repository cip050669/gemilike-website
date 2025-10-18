import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Gemstone } from '@/lib/types/gemstone';

interface CartItem {
  id: string;
  gemstone: Gemstone;
  quantity: number;
  notes?: string;
  addedAt: Date;
  variant?: {
    id: string;
    name: string;
    price: number;
  };
}

interface PersistentCartStore {
  items: CartItem[];
  addItem: (gemstone: Gemstone, quantity?: number, notes?: string, variant?: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemCount: () => number;
  applyCoupon: (couponCode: string) => Promise<{ success: boolean; message: string; discount?: number }>;
  removeCoupon: () => void;
  coupon: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null;
  syncWithServer: (userId: string) => Promise<void>;
  saveCartToServer: (userId: string) => Promise<void>;
  loadCartFromServer: (userId: string) => Promise<void>;
  isSyncing: boolean;
  lastSynced: Date | null;
  autoSave: boolean;
  setAutoSave: (enabled: boolean) => void;
}

export const usePersistentCartStore = create<PersistentCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isSyncing: false,
      lastSynced: null,
      autoSave: true,
      
      addItem: (gemstone: Gemstone, quantity = 1, notes?: string, variant?: any) => {
        set((state) => {
          const existingItem = state.items.find(item => 
            item.gemstone.id === gemstone.id && 
            (!variant || item.variant?.id === variant.id)
          );
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          const newItem: CartItem = {
            id: `${gemstone.id}-${variant?.id || 'default'}-${Date.now()}`,
            gemstone,
            quantity,
            notes,
            addedAt: new Date(),
            variant
          };
          
          return {
            items: [...state.items, newItem]
          };
        });
      },
      
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },
      
      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        }));
      },
      
      updateNotes: (id: string, notes: string) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, notes } : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [], coupon: null });
      },
      
      getTotalPrice: () => {
        const subtotal = get().items.reduce((total, item) => {
          const price = item.variant?.price || item.gemstone.price;
          return total + (price * item.quantity);
        }, 0);
        
        if (get().coupon) {
          const { discount, type } = get().coupon!;
          if (type === 'percentage') {
            return subtotal * (1 - discount / 100);
          } else {
            return Math.max(0, subtotal - discount);
          }
        }
        
        return subtotal;
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getItemCount: () => {
        return get().items.length;
      },
      
      applyCoupon: async (couponCode: string) => {
        try {
          const response = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: couponCode }),
          });
          
          if (response.ok) {
            const coupon = await response.json();
            set({ coupon });
            return { success: true, message: 'Gutschein angewendet', discount: coupon.discount };
          } else {
            const error = await response.json();
            return { success: false, message: error.error || 'Ungültiger Gutschein' };
          }
        } catch (error) {
          return { success: false, message: 'Fehler beim Anwenden des Gutscheins' };
        }
      },
      
      removeCoupon: () => {
        set({ coupon: null });
      },
      
      syncWithServer: async (userId: string) => {
        try {
          const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              items: get().items
            }),
          });
          
          if (response.ok) {
            const serverCart = await response.json();
            set({ items: serverCart.items, lastSynced: new Date() });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      },

      saveCartToServer: async (userId: string) => {
        if (!get().autoSave) return;
        
        set({ isSyncing: true });
        try {
          const response = await fetch('/api/cart/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              items: get().items,
              coupon: get().coupon
            }),
          });
          
          if (response.ok) {
            set({ lastSynced: new Date() });
          }
        } catch (error) {
          console.error('Error saving cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      loadCartFromServer: async (userId: string) => {
        set({ isSyncing: true });
        try {
          const response = await fetch(`/api/cart/load?userId=${userId}`);
          
          if (response.ok) {
            const serverCart = await response.json();
            set({ 
              items: serverCart.items || [], 
              coupon: serverCart.coupon || null,
              lastSynced: new Date()
            });
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      setAutoSave: (enabled: boolean) => {
        set({ autoSave: enabled });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        coupon: state.coupon
      }),
    }
  )
);
