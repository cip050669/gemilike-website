'use client';

import { create } from 'zustand';
import type { WishlistSummary } from '@/lib/actions/wishlist';
import {
  getWishlistSummary,
  toggleWishlistItem,
  removeWishlistItem,
  clearWishlist as clearWishlistAction,
} from '@/lib/actions/wishlist';

interface WishlistStoreState {
  summary: WishlistSummary | null;
  isLoading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  toggleItem: (gemstoneId: string) => Promise<void>;
  removeItem: (gemstoneId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (gemstoneId: string) => boolean;
  items: WishlistSummary['items'];
  totalItems: number;
}

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unbekannter Fehler';
};

export const useWishlistStore = create<WishlistStoreState>((set, get) => ({
  summary: null,
  isLoading: false,
  error: null,
  items: [],
  totalItems: 0,

  fetchWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      const summary = await getWishlistSummary();
      set({
        summary,
        items: summary.items,
        totalItems: summary.totalItems,
        isLoading: false,
      });
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  toggleItem: async (gemstoneId: string) => {
    try {
      set({ isLoading: true, error: null });
      const summary = await toggleWishlistItem(gemstoneId);
      set({
        summary,
        items: summary.items,
        totalItems: summary.totalItems,
        isLoading: false,
      });
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  removeItem: async (gemstoneId: string) => {
    try {
      const current = get().summary;
      const wishlistItem = current?.items.find((item) => item.gemstoneId === gemstoneId);

      if (!wishlistItem) {
        return;
      }

      set({ isLoading: true, error: null });
      const summary = await removeWishlistItem(wishlistItem.id);
      set({
        summary,
        items: summary.items,
        totalItems: summary.totalItems,
        isLoading: false,
      });
    } catch (error) {
      console.error('Wishlist remove error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  clearWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      const summary = await clearWishlistAction();
      set({
        summary,
        items: summary.items,
        totalItems: summary.totalItems,
        isLoading: false,
      });
    } catch (error) {
      console.error('Wishlist clear error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  isInWishlist: (gemstoneId: string) => {
    const summary = get().summary;
    if (!summary) return false;
    return summary.items.some((item) => item.gemstoneId === gemstoneId);
  },
}));
