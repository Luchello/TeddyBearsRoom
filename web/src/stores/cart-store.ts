/**
 * Cart Store - Zustand with Persistence
 * TeddyBear's Room Shopping Cart State Management
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CartItem,
  CartState,
  CartTotals,
  AddToCartInput,
  SimpleAddToCartInput,
  AppliedCoupon,
  FREE_SHIPPING_THRESHOLD,
  INNER_CIRCLE_FREE_SHIPPING_THRESHOLD,
  INNER_CIRCLE_DISCOUNT_RATE,
} from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";
import { generateId } from "@/lib/utils";

// Constants
const CART_STORAGE_KEY = "tbr-cart";
const CART_VERSION = 1;

interface CartStore extends CartState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,
      isLoading: false,
      appliedCoupon: null,
      _hasHydrated: false,

      // Hydration
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      // Actions
      addItem: (
        input: AddToCartInput,
        product: Product,
        variant?: ProductVariant
      ) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === input.productId &&
              item.variantId === (input.variantId || null)
          );

          if (existingItemIndex > -1) {
            // Update quantity if item exists
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity:
                updatedItems[existingItemIndex].quantity + input.quantity,
            };
            return { items: updatedItems };
          }

          // Add new item
          const price = variant?.price ?? product.price;
          const originalPrice = variant?.compareAtPrice ?? product.compareAtPrice ?? price;
          const imageUrl = product.images?.[0]?.url ?? null;

          const newItem: CartItem = {
            id: generateId(),
            productId: input.productId,
            variantId: input.variantId || null,
            quantity: input.quantity,
            price,
            originalPrice,
            name: variant ? `${product.name} - ${variant.name}` : product.name,
            imageUrl,
            variant: variant
              ? {
                  id: variant.id,
                  name: variant.name,
                  options: variant.options,
                }
              : null,
          };

          return { items: [...state.items, newItem] };
        });
      },

      addSimpleItem: (input: SimpleAddToCartInput) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === input.productId &&
              item.variantId === (input.variantId || null)
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity:
                updatedItems[existingItemIndex].quantity + input.quantity,
            };
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            id: generateId(),
            productId: input.productId,
            variantId: input.variantId || null,
            quantity: input.quantity,
            price: input.price,
            originalPrice: input.originalPrice ?? input.price,
            name: input.variantName
              ? `${input.name} - ${input.variantName}`
              : input.name,
            imageUrl: input.imageUrl,
            variant: null,
          };

          return { items: [...state.items, newItem] };
        });
      },

      updateItem: (itemId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== itemId) };
          }

          return {
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      applyCoupon: async (code: string): Promise<boolean> => {
        set({ isLoading: true });

        try {
          // TODO: API call to validate coupon
          const response = await fetch("/api/coupons/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, subtotal: get().getSubtotal() }),
          });

          if (!response.ok) {
            set({ isLoading: false });
            return false;
          }

          const coupon: AppliedCoupon = await response.json();
          set({ appliedCoupon: coupon, isLoading: false });
          return true;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      // Computed
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getTotals: (isInnerCircle: boolean): CartTotals => {
        const { items, appliedCoupon } = get();
        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Inner Circle discount (10%)
        const innerCircleDiscount = isInnerCircle
          ? Math.round(subtotal * 0.1) // INNER_CIRCLE_DISCOUNT_RATE
          : 0;

        // Coupon discount
        let couponDiscount = 0;
        if (appliedCoupon) {
          switch (appliedCoupon.discountType) {
            case "PERCENTAGE":
              couponDiscount = Math.round(
                (subtotal - innerCircleDiscount) *
                  (appliedCoupon.discountValue / 100)
              );
              break;
            case "FIXED_AMOUNT":
              couponDiscount = appliedCoupon.discountValue;
              break;
            case "FREE_SHIPPING":
              // Handled in shipping calculation
              break;
          }
        }

        // Shipping calculation
        const freeShippingThreshold = isInnerCircle
          ? 30000 // INNER_CIRCLE_FREE_SHIPPING_THRESHOLD
          : 50000; // FREE_SHIPPING_THRESHOLD

        const afterDiscount = subtotal - innerCircleDiscount - couponDiscount;
        const isFreeShipping =
          afterDiscount >= freeShippingThreshold ||
          appliedCoupon?.discountType === "FREE_SHIPPING";

        const shipping = isFreeShipping ? 0 : 3000; // Base shipping cost

        // Tax (included in price in Korea)
        const tax = 0;

        // Total
        const total = afterDiscount + shipping + tax;
        const discount = innerCircleDiscount + couponDiscount;

        return {
          subtotal,
          discount,
          innerCircleDiscount,
          couponDiscount,
          shipping,
          freeShippingThreshold,
          isFreeShipping,
          tax,
          total,
          savings: discount,
        };
      },
    }),
    {
      name: CART_STORAGE_KEY,
      version: CART_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      migrate: (persistedState: unknown, version: number) => {
        if (version < CART_VERSION) {
          // Reset cart on version mismatch
          return { items: [], appliedCoupon: null };
        }
        return persistedState as CartStore;
      },
    }
  )
);

// Selector hooks for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);
export const useCartItemCount = () => useCartStore((state) => state.getItemCount());
export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    addSimpleItem: state.addSimpleItem,
    updateItem: state.updateItem,
    removeItem: state.removeItem,
    clearCart: state.clearCart,
    setIsOpen: state.setIsOpen,
  }));
