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
  AmbassadorShippingState,
  FreeShippingReason,
} from "@/types/cart";
import {
  FREE_SHIPPING_THRESHOLD,
  INNER_CIRCLE_FREE_SHIPPING_THRESHOLD,
  INNER_CIRCLE_DISCOUNT_RATE,
  SHIPPING_FEE,
} from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";
import { generateId } from "@/lib/utils";

// Constants
const CART_STORAGE_KEY = "tbr-cart";
const CART_VERSION = 2; // Bumped for ambassador shipping state

// Default ambassador shipping state
const DEFAULT_AMBASSADOR_SHIPPING: AmbassadorShippingState = {
  available: false,
  applied: false,
  nextAvailableAt: null,
  isLoading: false,
};

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
      ambassadorShipping: DEFAULT_AMBASSADOR_SHIPPING,
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
        set({
          items: [],
          appliedCoupon: null,
          ambassadorShipping: DEFAULT_AMBASSADOR_SHIPPING,
        });
      },

      // Ambassador Free Shipping Actions
      checkAmbassadorFreeShipping: async (profileId: string) => {
        set((state) => ({
          ambassadorShipping: { ...state.ambassadorShipping, isLoading: true },
        }));

        try {
          const response = await fetch(`/api/ambassador/free-shipping?profileId=${profileId}`);

          if (!response.ok) {
            set((state) => ({
              ambassadorShipping: {
                ...state.ambassadorShipping,
                available: false,
                isLoading: false,
              },
            }));
            return;
          }

          const data = await response.json();
          set((state) => ({
            ambassadorShipping: {
              ...state.ambassadorShipping,
              available: data.available,
              nextAvailableAt: data.nextAvailableAt ? new Date(data.nextAvailableAt) : null,
              isLoading: false,
            },
          }));
        } catch {
          set((state) => ({
            ambassadorShipping: {
              ...state.ambassadorShipping,
              available: false,
              isLoading: false,
            },
          }));
        }
      },

      applyAmbassadorFreeShipping: (apply: boolean) => {
        const { ambassadorShipping } = get();

        // Only allow applying if available
        if (apply && !ambassadorShipping.available) {
          return;
        }

        set((state) => ({
          ambassadorShipping: {
            ...state.ambassadorShipping,
            applied: apply,
          },
        }));
      },

      resetAmbassadorShipping: () => {
        set({ ambassadorShipping: DEFAULT_AMBASSADOR_SHIPPING });
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
        const { items, appliedCoupon, ambassadorShipping } = get();
        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Inner Circle discount (10%)
        const innerCircleDiscount = isInnerCircle
          ? Math.round(subtotal * INNER_CIRCLE_DISCOUNT_RATE)
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
        // ┌─────────────────────────────────────────────────────────────┐
        // │  배송비 계산 우선순위:                                      │
        // │  1. 금액 기준 무료 배송 (50K/30K) -> 자동 적용              │
        // │  2. 쿠폰 무료 배송 -> 자동 적용                             │
        // │  3. 앰버서더 무료 배송 -> 사용자 선택 적용                   │
        // │  4. 기본 배송비 3,000원                                     │
        // └─────────────────────────────────────────────────────────────┘
        const freeShippingThreshold = isInnerCircle
          ? INNER_CIRCLE_FREE_SHIPPING_THRESHOLD
          : FREE_SHIPPING_THRESHOLD;

        const afterDiscount = subtotal - innerCircleDiscount - couponDiscount;

        // Determine free shipping status and reason
        let isFreeShipping = false;
        let freeShippingReason: FreeShippingReason | undefined;

        // Priority 1: Threshold-based free shipping
        if (afterDiscount >= freeShippingThreshold) {
          isFreeShipping = true;
          freeShippingReason = isInnerCircle ? "inner_circle" : "threshold";
        }
        // Priority 2: Coupon free shipping
        else if (appliedCoupon?.discountType === "FREE_SHIPPING") {
          isFreeShipping = true;
          freeShippingReason = "coupon";
        }
        // Priority 3: Ambassador free shipping (user-selected)
        else if (ambassadorShipping.applied && ambassadorShipping.available) {
          isFreeShipping = true;
          freeShippingReason = "ambassador";
        }

        const shipping = isFreeShipping ? 0 : SHIPPING_FEE;
        const amountToFreeShipping = isFreeShipping
          ? 0
          : Math.max(0, freeShippingThreshold - afterDiscount);

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
          freeShippingReason,
          ambassadorFreeShippingAvailable: ambassadorShipping.available,
          ambassadorFreeShippingApplied: ambassadorShipping.applied,
          amountToFreeShipping,
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
        // Note: ambassadorShipping is NOT persisted
        // It should be re-fetched on each session
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      migrate: (persistedState: unknown, version: number) => {
        if (version < CART_VERSION) {
          // Reset cart on version mismatch (v1 -> v2 migration)
          return {
            items: [],
            appliedCoupon: null,
            ambassadorShipping: DEFAULT_AMBASSADOR_SHIPPING,
          };
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

// Ambassador Free Shipping Selectors
export const useAmbassadorShipping = () =>
  useCartStore((state) => state.ambassadorShipping);

export const useAmbassadorShippingActions = () =>
  useCartStore((state) => ({
    checkAmbassadorFreeShipping: state.checkAmbassadorFreeShipping,
    applyAmbassadorFreeShipping: state.applyAmbassadorFreeShipping,
    resetAmbassadorShipping: state.resetAmbassadorShipping,
  }));
