'use client';

import { create } from 'zustand';
import type { CartSummary } from '@/lib/actions/cart';
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearActiveCart,
  getCartSummary,
} from '@/lib/actions/cart';

type AsyncResult<T> = Promise<T | void>;

interface CartStoreState {
  summary: CartSummary | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  toggleCart: () => void;
  fetchCart: () => AsyncResult<void>;
  addItem: (gemstoneId: string, quantity?: number) => AsyncResult<void>;
  updateQuantity: (cartItemId: string, quantity: number) => AsyncResult<void>;
  removeItem: (cartItemId: string) => AsyncResult<void>;
  clearCart: () => AsyncResult<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItems: () => CartSummary['items'];
}

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unbekannter Fehler';
};

export const useCartStore = create<CartStoreState>((set, get) => ({
  summary: null,
  isOpen: false,
  isLoading: false,
  error: null,

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const summary = await getCartSummary();
      set({ summary, isLoading: false });
    } catch (error) {
      console.error('Cart fetch error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  addItem: async (gemstoneId: string, quantity = 1) => {
    try {
      set({ isLoading: true, error: null });
      const summary = await addCartItem(gemstoneId, quantity);
      set({ summary, isLoading: false });
    } catch (error) {
      console.error('Cart add error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  updateQuantity: async (cartItemId: string, quantity: number) => {
    try {
      set({ isLoading: true, error: null });
      const summary = await updateCartItemQuantity(cartItemId, quantity);
      set({ summary, isLoading: false });
    } catch (error) {
      console.error('Cart quantity update error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  removeItem: async (cartItemId: string) => {
    try {
      set({ isLoading: true, error: null });
      const summary = await removeCartItem(cartItemId);
      set({ summary, isLoading: false });
    } catch (error) {
      console.error('Cart remove error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const summary = await clearActiveCart();
      set({ summary, isLoading: false });
    } catch (error) {
      console.error('Cart clear error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  getTotalItems: () => {
    const summary = get().summary;
    if (!summary) return 0;
    return summary.totalQuantity;
  },

  getTotalPrice: () => {
    const summary = get().summary;
    if (!summary) return 0;
    return summary.totalPrice;
  },

  getItems: () => {
    const summary = get().summary;
    return summary?.items ?? [];
  },
}));
