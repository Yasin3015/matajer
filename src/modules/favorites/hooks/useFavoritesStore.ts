import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/core/types';

interface FavoritesState {
  /** Favorites keyed by storeSlug */
  favorites: Record<string, Product[]>;
  getFavorites: (storeSlug: string) => Product[];
  isFavorite: (storeSlug: string, productId: string) => boolean;
  toggleFavorite: (storeSlug: string, product: Product) => void;
  removeFromFavorites: (storeSlug: string, productId: string) => void;
  clearFavorites: (storeSlug: string) => void;
  getFavoritesCount: (storeSlug: string) => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},

      getFavorites: (storeSlug) => get().favorites[storeSlug] ?? [],

      isFavorite: (storeSlug, productId) =>
        (get().favorites[storeSlug] ?? []).some((p) => p.id === productId),

      toggleFavorite: (storeSlug, product) => {
        set((state) => {
          const existing = state.favorites[storeSlug] ?? [];
          const alreadySaved = existing.some((p) => p.id === product.id);
          const updated = alreadySaved
            ? existing.filter((p) => p.id !== product.id)
            : [...existing, product];
          return { favorites: { ...state.favorites, [storeSlug]: updated } };
        });
      },

      removeFromFavorites: (storeSlug, productId) => {
        set((state) => ({
          favorites: {
            ...state.favorites,
            [storeSlug]: (state.favorites[storeSlug] ?? []).filter(
              (p) => p.id !== productId,
            ),
          },
        }));
      },

      clearFavorites: (storeSlug) => {
        set((state) => ({
          favorites: { ...state.favorites, [storeSlug]: [] },
        }));
      },

      getFavoritesCount: (storeSlug) =>
        (get().favorites[storeSlug] ?? []).length,
    }),
    { name: 'matajer-favorites' },
  ),
);
