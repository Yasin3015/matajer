import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/core/types';

interface CartState {
  // carts keyed by storeSlug
  carts: Record<string, CartItem[]>;
  getCart: (storeSlug: string) => CartItem[];
  addToCart: (storeSlug: string, product: Product, quantity?: number) => void;
  removeFromCart: (storeSlug: string, productId: string) => void;
  updateQuantity: (storeSlug: string, productId: string, quantity: number) => void;
  clearCart: (storeSlug: string) => void;
  getTotal: (storeSlug: string) => number;
  getItemCount: (storeSlug: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: {},

      getCart: (storeSlug) => get().carts[storeSlug] ?? [],

      addToCart: (storeSlug, product, quantity = 1) => {
        set((state) => {
          const existing = state.carts[storeSlug] ?? [];
          const itemIndex = existing.findIndex((i) => i.product.id === product.id);
          let updated: CartItem[];
          if (itemIndex >= 0) {
            updated = existing.map((item, i) =>
              i === itemIndex ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            updated = [...existing, { product, quantity }];
          }
          return { carts: { ...state.carts, [storeSlug]: updated } };
        });
      },

      removeFromCart: (storeSlug, productId) => {
        set((state) => ({
          carts: {
            ...state.carts,
            [storeSlug]: (state.carts[storeSlug] ?? []).filter((i) => i.product.id !== productId),
          },
        }));
      },

      updateQuantity: (storeSlug, productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(storeSlug, productId);
          return;
        }
        set((state) => ({
          carts: {
            ...state.carts,
            [storeSlug]: (state.carts[storeSlug] ?? []).map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          },
        }));
      },

      clearCart: (storeSlug) => {
        set((state) => ({
          carts: { ...state.carts, [storeSlug]: [] },
        }));
      },

      getTotal: (storeSlug) =>
        (get().carts[storeSlug] ?? []).reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      getItemCount: (storeSlug) =>
        (get().carts[storeSlug] ?? []).reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'matajer-cart' }
  )
);
