import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Cart } from '@/lib/types';

interface CartStore extends Cart {
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isOpen: boolean;
  getTotalItems: () => number;
  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      currency: 'EUR',
      isOpen: false,

      addToCart: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.productId === item.productId);
        
        if (existingItem) {
          set(state => ({
            items: state.items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity, total: (i.quantity + item.quantity) * i.price }
                : i
            )
          }));
        } else {
          set(state => ({
            items: [...state.items, { ...item, id: `${item.productId}-${Date.now()}` }]
          }));
        }
        
        get().calculateTotals();
      },

      removeFromCart: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }));
        get().calculateTotals();
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity, total: quantity * item.price }
              : item
          )
        }));
        get().calculateTotals();
      },

      clearCart: () => {
        set({ items: [] });
        get().calculateTotals();
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      calculateTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((total, item) => total + item.total, 0);
        const tax = subtotal * 0.19; // 19% MwSt
        const shipping = subtotal > 100 ? 0 : 9.99; // Kostenloser Versand ab €100
        const total = subtotal + tax + shipping;

        set({ subtotal, tax, shipping, total });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);
