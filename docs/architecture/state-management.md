# State Management Documentation

TeddyBear's Room - Zustand Store Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐      │
│   │                    ZUSTAND STORES                                │      │
│   ├─────────────────────────────────────────────────────────────────┤      │
│   │                                                                  │      │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │      │
│   │  │  cart-store  │  │wishlist-store│  │   ui-store   │          │      │
│   │  │              │  │              │  │              │          │      │
│   │  │ • items[]    │  │ • items[]    │  │ • isMenuOpen │          │      │
│   │  │ • isOpen     │  │ • addItem()  │  │ • isSearchOpen│         │      │
│   │  │ • coupon     │  │ • removeItem()│ │ • modalState │          │      │
│   │  │ • addItem()  │  │              │  │              │          │      │
│   │  │ • getTotals()│  │              │  │              │          │      │
│   │  │              │  │              │  │              │          │      │
│   │  │   PERSIST    │  │   PERSIST    │  │   MEMORY     │          │      │
│   │  │  localStorage│  │  localStorage│  │   ONLY       │          │      │
│   │  └──────────────┘  └──────────────┘  └──────────────┘          │      │
│   │                                                                  │      │
│   └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐      │
│   │                    REACT QUERY (Server State)                    │      │
│   ├─────────────────────────────────────────────────────────────────┤      │
│   │                                                                  │      │
│   │  useQuery('products')     →  GET /api/products                  │      │
│   │  useQuery('product', id)  →  GET /api/products/:id              │      │
│   │  useQuery('orders')       →  GET /api/orders                    │      │
│   │  useMutation('order')     →  POST /api/orders                   │      │
│   │                                                                  │      │
│   └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Store Organization

```
src/stores/
├── index.ts            # Store exports
├── cart-store.ts       # Shopping cart state
├── wishlist-store.ts   # Wishlist state
├── ui-store.ts         # UI/UX state
└── auth-store.ts       # Auth state (optional)
```

---

## Cart Store

### Complete Implementation

```typescript
// src/stores/cart-store.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CartItem,
  CartState,
  CartTotals,
  AddToCartInput,
  SimpleAddToCartInput,
  AppliedCoupon,
} from "@/types/cart";
import {
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
      // ============================================================
      // STATE
      // ============================================================
      items: [],
      isOpen: false,
      isLoading: false,
      appliedCoupon: null,
      _hasHydrated: false,

      // ============================================================
      // HYDRATION
      // ============================================================
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      // ============================================================
      // ACTIONS
      // ============================================================

      /**
       * Add item with full product/variant objects
       * Used when product data is already available
       */
      addItem: (
        input: AddToCartInput,
        product: Product,
        variant?: ProductVariant
      ) => {
        set((state) => {
          // Check for existing item
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
          const originalPrice =
            variant?.compareAtPrice ?? product.compareAtPrice ?? price;
          const imageUrl = product.images?.[0]?.url ?? null;

          const newItem: CartItem = {
            id: generateId(),
            productId: input.productId,
            variantId: input.variantId || null,
            quantity: input.quantity,
            price,
            originalPrice,
            name: variant
              ? `${product.name} - ${variant.name}`
              : product.name,
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

      /**
       * Add item with minimal data (price, name already known)
       * Used for quick add from product cards
       */
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

      /**
       * Update item quantity
       * Removes item if quantity <= 0
       */
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

      /**
       * Remove item from cart
       */
      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      /**
       * Clear all items and coupon
       */
      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      // ============================================================
      // COUPON
      // ============================================================

      /**
       * Validate and apply coupon code
       */
      applyCoupon: async (code: string): Promise<boolean> => {
        set({ isLoading: true });

        try {
          const response = await fetch("/api/coupons/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              subtotal: get().getSubtotal(),
            }),
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

      /**
       * Remove applied coupon
       */
      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      // ============================================================
      // UI STATE
      // ============================================================

      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      // ============================================================
      // COMPUTED VALUES
      // ============================================================

      /**
       * Get total item count (sum of quantities)
       */
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      /**
       * Get subtotal (before discounts)
       */
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      /**
       * Calculate all totals including discounts and shipping
       * @param isInnerCircle - Whether user has Inner Circle membership
       */
      getTotals: (isInnerCircle: boolean): CartTotals => {
        const { items, appliedCoupon } = get();

        // Calculate subtotal
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
        const freeShippingThreshold = isInnerCircle
          ? INNER_CIRCLE_FREE_SHIPPING_THRESHOLD  // 30,000원
          : FREE_SHIPPING_THRESHOLD;               // 50,000원

        const afterDiscount = subtotal - innerCircleDiscount - couponDiscount;
        const isFreeShipping =
          afterDiscount >= freeShippingThreshold ||
          appliedCoupon?.discountType === "FREE_SHIPPING";

        const shipping = isFreeShipping ? 0 : 3000; // Base: 3,000원

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

    // ============================================================
    // PERSIST CONFIGURATION
    // ============================================================
    {
      name: CART_STORAGE_KEY,
      version: CART_VERSION,
      storage: createJSONStorage(() => localStorage),

      // Only persist items and coupon, not UI state
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),

      // Handle hydration completion
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },

      // Handle version migrations
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

// ============================================================
// SELECTOR HOOKS (Optimized re-renders)
// ============================================================

export const useCartItems = () => useCartStore((state) => state.items);
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);
export const useCartItemCount = () =>
  useCartStore((state) => state.getItemCount());
export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    addSimpleItem: state.addSimpleItem,
    updateItem: state.updateItem,
    removeItem: state.removeItem,
    clearCart: state.clearCart,
    setIsOpen: state.setIsOpen,
  }));
```

---

## Wishlist Store

```typescript
// src/stores/wishlist-store.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const WISHLIST_STORAGE_KEY = "tbr-wishlist";
const WISHLIST_VERSION = 1;

interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  _hasHydrated: boolean;
}

interface WishlistActions {
  setHasHydrated: (state: boolean) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      _hasHydrated: false,

      // Hydration
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Actions
      addItem: (productId: string) => {
        set((state) => {
          // Prevent duplicates
          if (state.items.some((item) => item.productId === productId)) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                id: crypto.randomUUID(),
                productId,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      toggleItem: (productId: string) => {
        const { items, addItem, removeItem } = get();
        const isWishlisted = items.some((item) => item.productId === productId);

        if (isWishlisted) {
          removeItem(productId);
        } else {
          addItem(productId);
        }
      },

      isWishlisted: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: WISHLIST_STORAGE_KEY,
      version: WISHLIST_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Selectors
export const useWishlistItems = () =>
  useWishlistStore((state) => state.items);
export const useWishlistItemCount = () =>
  useWishlistStore((state) => state.items.length);
export const useIsWishlisted = (productId: string) =>
  useWishlistStore((state) =>
    state.items.some((item) => item.productId === productId)
  );
```

---

## UI Store

```typescript
// src/stores/ui-store.ts

import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: unknown;
}

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;

  // Modal
  modal: ModalState;

  // Toast notifications (if not using external library)
  toasts: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>;
}

interface UIActions {
  setMobileMenuOpen: (isOpen: boolean) => void;
  setSearchOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;

  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;

  addToast: (type: UIState["toasts"][0]["type"], message: string) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  // Initial state
  isMobileMenuOpen: false,
  isSearchOpen: false,
  searchQuery: "",
  modal: { isOpen: false, type: null, data: null },
  toasts: [],

  // Actions
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  openModal: (type, data) =>
    set({ modal: { isOpen: true, type, data: data ?? null } }),

  closeModal: () =>
    set({ modal: { isOpen: false, type: null, data: null } }),

  addToast: (type, message) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), type, message },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

// Selectors
export const useMobileMenu = () =>
  useUIStore((state) => ({
    isOpen: state.isMobileMenuOpen,
    setOpen: state.setMobileMenuOpen,
  }));

export const useSearch = () =>
  useUIStore((state) => ({
    isOpen: state.isSearchOpen,
    query: state.searchQuery,
    setOpen: state.setSearchOpen,
    setQuery: state.setSearchQuery,
  }));

export const useModal = () =>
  useUIStore((state) => ({
    ...state.modal,
    open: state.openModal,
    close: state.closeModal,
  }));
```

---

## Store Exports

```typescript
// src/stores/index.ts

export { useCartStore, useCartItems, useCartIsOpen, useCartItemCount, useCartActions } from "./cart-store";
export { useWishlistStore, useWishlistItems, useWishlistItemCount, useIsWishlisted } from "./wishlist-store";
export { useUIStore, useMobileMenu, useSearch, useModal } from "./ui-store";
```

---

## Usage Patterns

### 1. Basic Store Access

```typescript
"use client";

import { useCartStore } from "@/stores";

function CartButton() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  return (
    <button onClick={() => setIsOpen(true)}>
      Cart ({itemCount})
    </button>
  );
}
```

### 2. Using Selector Hooks (Optimized)

```typescript
import { useCartItemCount, useCartActions } from "@/stores";

function ProductCard({ product }) {
  // Only re-renders when item count changes
  const itemCount = useCartItemCount();

  // Actions don't cause re-renders
  const { addSimpleItem } = useCartActions();

  const handleAddToCart = () => {
    addSimpleItem({
      productId: product.id,
      quantity: 1,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

### 3. Computed Values with Parameters

```typescript
import { useCartStore } from "@/stores";

function CheckoutSummary({ isInnerCircle }) {
  // Call getTotals with current membership status
  const totals = useCartStore((state) => state.getTotals(isInnerCircle));

  return (
    <div>
      <p>Subtotal: {formatPrice(totals.subtotal)}</p>
      {totals.innerCircleDiscount > 0 && (
        <p>Inner Circle Discount: -{formatPrice(totals.innerCircleDiscount)}</p>
      )}
      <p>Total: {formatPrice(totals.total)}</p>
    </div>
  );
}
```

### 4. Hydration-Safe Pattern

```typescript
"use client";

import { useCartStore, useCartItemCount } from "@/stores";

function CartBadge() {
  // Check hydration status
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const itemCount = useCartItemCount();

  // Show placeholder until hydrated
  if (!hasHydrated) {
    return <span className="cart-badge">-</span>;
  }

  return (
    <span className="cart-badge">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
```

### 5. Cross-Store Communication

```typescript
"use client";

import { useCartStore, useWishlistStore } from "@/stores";

function WishlistToCart({ productId }) {
  const { addSimpleItem } = useCartStore();
  const { removeItem: removeFromWishlist } = useWishlistStore();
  const wishlistItem = useWishlistStore((state) =>
    state.items.find((item) => item.productId === productId)
  );

  const moveToCart = async () => {
    // Fetch product details
    const product = await fetchProduct(productId);

    // Add to cart
    addSimpleItem({
      productId: product.id,
      quantity: 1,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl,
    });

    // Remove from wishlist
    removeFromWishlist(productId);
  };

  return <button onClick={moveToCart}>Move to Cart</button>;
}
```

---

## Constants & Types

```typescript
// src/types/cart.ts

// Shipping thresholds
export const FREE_SHIPPING_THRESHOLD = 50000;  // 5만원
export const INNER_CIRCLE_FREE_SHIPPING_THRESHOLD = 30000;  // 3만원

// Discount rates
export const INNER_CIRCLE_DISCOUNT_RATE = 0.1;  // 10%

// Types
export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  originalPrice: number;
  name: string;
  imageUrl: string | null;
  variant: {
    id: string;
    name: string;
    options: Record<string, string>;
  } | null;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  innerCircleDiscount: number;
  couponDiscount: number;
  shipping: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  tax: number;
  total: number;
  savings: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  appliedCoupon: AppliedCoupon | null;

  addItem: (input: AddToCartInput, product: Product, variant?: ProductVariant) => void;
  addSimpleItem: (input: SimpleAddToCartInput) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;

  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  setIsOpen: (isOpen: boolean) => void;

  getItemCount: () => number;
  getSubtotal: () => number;
  getTotals: (isInnerCircle: boolean) => CartTotals;
}
```

---

## Best Practices

### 1. Persist Only Necessary Data

```typescript
persist(store, {
  partialize: (state) => ({
    items: state.items,
    appliedCoupon: state.appliedCoupon,
    // Don't persist: isOpen, isLoading, _hasHydrated
  }),
})
```

### 2. Version and Migrate

```typescript
persist(store, {
  version: 1,
  migrate: (persistedState, version) => {
    if (version === 0) {
      // Migration from v0 to v1
      return { ...persistedState, newField: defaultValue };
    }
    return persistedState;
  },
})
```

### 3. Use Selectors for Performance

```typescript
// ❌ Bad: Re-renders on any state change
const state = useCartStore();

// ✅ Good: Re-renders only when items change
const items = useCartStore((state) => state.items);

// ✅ Best: Custom selector hook
const useCartItemCount = () =>
  useCartStore((state) => state.getItemCount());
```

### 4. Handle Hydration

```typescript
// Always check hydration for SSR-sensitive components
const hasHydrated = useCartStore((state) => state._hasHydrated);

if (!hasHydrated) {
  return <LoadingPlaceholder />;
}
```

---

**Last Updated**: 2025-12-17
