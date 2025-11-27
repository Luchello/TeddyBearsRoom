"use client";

// ====================================
// TeddyBear's Room - Wishlist Store
// Zustand store for wishlist with persist
// ====================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WishlistItem } from "@/lib/types";

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const exists = get().items.some((item) => item.product.id === product.id);
        if (!exists) {
          set((state) => ({
            items: [...state.items, { product, addedAt: Date.now() }],
          }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      toggleItem: (product) => {
        const exists = get().items.some((item) => item.product.id === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isWishlisted: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),
      clearWishlist: () => set({ items: [] }),
      getTotalItems: () => get().items.length,
    }),
    {
      name: "tbr-wishlist",
    }
  )
);
