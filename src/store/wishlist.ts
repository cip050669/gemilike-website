import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistItem } from '@/lib/types';

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.productId === item.productId);
        
        if (!existingItem) {
          set(state => ({
            items: [...state.items, { ...item, id: `${item.productId}-${Date.now()}` }]
          }));
        }
      },

      removeFromWishlist: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item.productId === productId);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.length;
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);
