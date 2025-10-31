'use client';

import { create } from 'zustand';
import type { CartSummary, CartItemDTO } from '@/lib/actions/cart';
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearActiveCart,
  getCartSummary,
} from '@/lib/actions/cart';

type AsyncResult<T> = Promise<T | void>;

type OptimisticCartItem = Pick<
  CartItemDTO,
  'gemstoneId' | 'name' | 'price' | 'image' | 'category' | 'weight' | 'weightUnit' | 'origin'
> & {
  currency?: string;
};

interface CartStoreState {
  summary: CartSummary | null;
  items: CartItemDTO[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  toggleCart: () => void;
  fetchCart: () => AsyncResult<void>;
  addItem: (gemstoneId: string, quantity?: number, optimistic?: OptimisticCartItem) => AsyncResult<void>;
  updateQuantity: (cartItemId: string, quantity: number) => AsyncResult<void>;
  removeItem: (cartItemId: string) => AsyncResult<void>;
  clearCart: () => AsyncResult<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItems: () => CartSummary['items'];
}

const recomputeTotals = (items: CartItemDTO[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalQuantity, totalPrice };
};

const ensureSummary = (summary: CartSummary | null, currency: string): CartSummary => {
  if (summary) {
    return summary;
  }
  return {
    id: 'optimistic-cart',
    currency,
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  };
};

const optimisticAdd = (
  summary: CartSummary | null,
  gemstoneId: string,
  quantity: number,
  optimistic?: OptimisticCartItem
): CartSummary => {
  const currency = optimistic?.currency ?? summary?.currency ?? 'EUR';
  const base = ensureSummary(summary, currency);
  const existing = base.items.find((item) => item.gemstoneId === gemstoneId);

  let items: CartItemDTO[];
  if (existing) {
    items = base.items.map((item) =>
      item.gemstoneId === gemstoneId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    const newItem: CartItemDTO = {
      id: `optimistic-${Date.now()}`,
      gemstoneId,
      name: optimistic?.name ?? 'Edelstein',
      slug: null,
      quantity,
      price: optimistic?.price ?? 0,
      currency,
      image: optimistic?.image ?? null,
      isSold: false,
      category: optimistic?.category ?? null,
      weight: optimistic?.weight ?? null,
      weightUnit: optimistic?.weightUnit ?? 'ct',
      origin: optimistic?.origin ?? null,
    };
    items = [...base.items, newItem];
  }

  const { totalPrice, totalQuantity } = recomputeTotals(items);
  return {
    ...base,
    currency,
    items,
    totalPrice,
    totalQuantity,
  };
};

const optimisticUpdateQuantity = (
  summary: CartSummary | null,
  cartItemId: string,
  quantity: number
): CartSummary | null => {
  if (!summary) return summary;
  const existing = summary.items.find((item) => item.id === cartItemId);
  if (!existing) return summary;

  let items: CartItemDTO[];
  if (quantity <= 0) {
    items = summary.items.filter((item) => item.id !== cartItemId);
  } else {
    items = summary.items.map((item) =>
      item.id === cartItemId ? { ...item, quantity } : item
    );
  }

  const { totalPrice, totalQuantity } = recomputeTotals(items);
  return { ...summary, items, totalPrice, totalQuantity };
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unbekannter Fehler';
};

export const useCartStore = create<CartStoreState>((set, get) => ({
  summary: null,
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen, error: null })),

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const summary = await getCartSummary();
      set({ summary, items: summary.items, isLoading: false });
    } catch (error) {
      console.error('Cart fetch error:', error);
      set({ error: handleError(error), isLoading: false });
    }
  },

  addItem: async (gemstoneId: string, quantity = 1, optimisticData?: OptimisticCartItem) => {
    const previousSummary = get().summary;
    const optimisticSummary = optimisticAdd(previousSummary, gemstoneId, quantity, optimisticData);
    set({
      summary: optimisticSummary,
      items: optimisticSummary.items,
      error: null,
      isLoading: true,
    });

    try {
      const summary = await addCartItem(gemstoneId, quantity);
      set({ summary, items: summary.items, isLoading: false });
    } catch (error) {
      console.error('Cart add error:', error);
      set({ summary: previousSummary ?? null, items: previousSummary?.items ?? [], error: handleError(error), isLoading: false });
    }
  },

  updateQuantity: async (cartItemId: string, quantity: number) => {
    const previousSummary = get().summary;
    const optimisticSummary = optimisticUpdateQuantity(previousSummary, cartItemId, quantity);
    set({
      summary: optimisticSummary ?? null,
      items: optimisticSummary?.items ?? [],
      error: null,
      isLoading: true,
    });

    try {
      const summary = await updateCartItemQuantity(cartItemId, quantity);
      set({ summary, items: summary.items, isLoading: false });
    } catch (error) {
      console.error('Cart quantity update error:', error);
      set({
        summary: previousSummary ?? null,
        items: previousSummary?.items ?? [],
        error: handleError(error),
        isLoading: false,
      });
    }
  },

  removeItem: async (cartItemId: string) => {
    const previousSummary = get().summary;
    const optimisticSummary = optimisticUpdateQuantity(previousSummary, cartItemId, 0);
    set({
      summary: optimisticSummary ?? null,
      items: optimisticSummary?.items ?? [],
      error: null,
      isLoading: true,
    });

    try {
      const summary = await removeCartItem(cartItemId);
      set({ summary, items: summary.items, isLoading: false });
    } catch (error) {
      console.error('Cart remove error:', error);
      set({
        summary: previousSummary ?? null,
        items: previousSummary?.items ?? [],
        error: handleError(error),
        isLoading: false,
      });
    }
  },

  clearCart: async () => {
    const previousSummary = get().summary;
    set({
      summary: previousSummary ? { ...previousSummary, items: [], totalPrice: 0, totalQuantity: 0 } : previousSummary,
      items: [],
      error: null,
      isLoading: true,
    });

    try {
      const summary = await clearActiveCart();
      set({ summary, items: summary.items, isLoading: false });
    } catch (error) {
      console.error('Cart clear error:', error);
      set({
        summary: previousSummary ?? null,
        items: previousSummary?.items ?? [],
        error: handleError(error),
        isLoading: false,
      });
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
