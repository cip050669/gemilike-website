import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Gemstone } from '@/lib/types/gemstone';

interface WishlistItem {
  gemstoneId: string;
  gemstone: Gemstone;
  addedAt: Date;
  notes?: string;
}

interface PersistentWishlistStore {
  items: WishlistItem[];
  addItem: (gemstone: Gemstone, notes?: string) => void;
  removeItem: (gemstoneId: string) => void;
  isInWishlist: (gemstoneId: string) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
  syncWithServer: (userId: string) => Promise<void>;
}

export const usePersistentWishlistStore = create<PersistentWishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (gemstone: Gemstone, notes?: string) => {
        set((state) => {
          const existingItem = state.items.find(item => item.gemstoneId === gemstone.id);
          if (existingItem) {
            return state; // Already in wishlist
          }
          
          return {
            items: [
              ...state.items,
              {
                gemstoneId: gemstone.id,
                gemstone,
                addedAt: new Date(),
                notes
              }
            ]
          };
        });
      },
      
      removeItem: (gemstoneId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.gemstoneId !== gemstoneId)
        }));
      },
      
      isInWishlist: (gemstoneId: string) => {
        return get().items.some(item => item.gemstoneId === gemstoneId);
      },
      
      getWishlistCount: () => {
        return get().items.length;
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      syncWithServer: async (userId: string) => {
        try {
          // Sync local wishlist with server
          const response = await fetch('/api/wishlist/sync', {
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
            const serverWishlist = await response.json();
            set({ items: serverWishlist.items });
          }
        } catch (error) {
          console.error('Error syncing wishlist:', error);
        }
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
