'use client';

import { create } from 'zustand';
import type { WishlistSummary, WishlistItemDTO } from '@/lib/actions/wishlist';
import {
  getWishlistSummary,
  toggleWishlistItem,
  removeWishlistItem,
  clearWishlist as clearWishlistAction,
} from '@/lib/actions/wishlist';

type OptimisticWishlistItem = Partial<WishlistItemDTO> & { gemstoneId: string };

interface WishlistStoreState {
  summary: WishlistSummary | null;
  isLoading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  toggleItem: (gemstoneId: string, optimistic?: OptimisticWishlistItem) => Promise<void>;
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

const ensureWishlist = (summary: WishlistSummary | null): WishlistSummary => {
  if (summary) return summary;
  return {
    id: 'optimistic-wishlist',
    items: [],
    totalItems: 0,
  };
};

const optimisticToggle = (
  summary: WishlistSummary | null,
  gemstoneId: string,
  optimistic?: OptimisticWishlistItem
): WishlistSummary => {
  const base = ensureWishlist(summary);
  const exists = base.items.some((item) => item.gemstoneId === gemstoneId);

  let items: WishlistItemDTO[];
  if (exists) {
    items = base.items.filter((item) => item.gemstoneId !== gemstoneId);
  } else {
    const newItem: WishlistItemDTO = {
      id: `wishlist-optimistic-${Date.now()}`,
      gemstoneId,
      name: optimistic?.name ?? 'Edelstein',
      slug: optimistic?.slug ?? null,
      image: optimistic?.image ?? null,
      isSold: optimistic?.isSold ?? false,
      createdAt: optimistic?.createdAt ?? new Date(),
      gemstone: optimistic?.gemstone ?? null,
    };
    items = [...base.items, newItem];
  }

  return {
    ...base,
    items,
    totalItems: items.length,
  };
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

  toggleItem: async (gemstoneId: string, optimisticData?: OptimisticWishlistItem) => {
    const previousSummary = get().summary;
    const optimisticSummary = optimisticToggle(previousSummary, gemstoneId, optimisticData);
    set({
      summary: optimisticSummary,
      items: optimisticSummary.items,
      totalItems: optimisticSummary.totalItems,
      error: null,
      isLoading: true,
    });

    try {
      const summary = await toggleWishlistItem(gemstoneId);
      set({
        summary,
        items: summary.items,
        totalItems: summary.totalItems,
        isLoading: false,
      });
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      set({
        summary: previousSummary,
        items: previousSummary?.items ?? [],
        totalItems: previousSummary?.totalItems ?? 0,
        error: handleError(error),
        isLoading: false,
      });
    }
  },

  removeItem: async (gemstoneId: string) => {
    try {
      const current = get().summary;
      const wishlistItem = current?.items.find((item) => item.gemstoneId === gemstoneId);

      if (!wishlistItem) {
        return;
      }

      const optimisticSummary = optimisticToggle(current, gemstoneId);
      set({
        summary: optimisticSummary,
        items: optimisticSummary.items,
        totalItems: optimisticSummary.totalItems,
        error: null,
        isLoading: true,
      });

      const summary = await removeWishlistItem(wishlistItem.id);
      set({
        summary,
        items: summary.items,
        totalItems: summary.totalItems,
        isLoading: false,
      });
    } catch (error) {
      console.error('Wishlist remove error:', error);
      const fallback = get().summary;
      set({
        summary: fallback,
        items: fallback?.items ?? [],
        totalItems: fallback?.totalItems ?? 0,
        error: handleError(error),
        isLoading: false,
      });
    }
  },

  clearWishlist: async () => {
    const previousSummary = get().summary;
    set({
      summary: previousSummary ? { ...previousSummary, items: [], totalItems: 0 } : previousSummary,
      items: [],
      totalItems: 0,
      error: null,
      isLoading: true,
    });

    try {
      const summary = await clearWishlistAction();
      set({
        summary,
        items: summary.items,
        totalItems: summary.totalItems,
        isLoading: false,
      });
    } catch (error) {
      console.error('Wishlist clear error:', error);
      set({
        summary: previousSummary,
        items: previousSummary?.items ?? [],
        totalItems: previousSummary?.totalItems ?? 0,
        error: handleError(error),
        isLoading: false,
      });
    }
  },

  isInWishlist: (gemstoneId: string) => {
    const summary = get().summary;
    if (!summary) return false;
    return summary.items.some((item) => item.gemstoneId === gemstoneId);
  },
}));
