/**
 * Cart Types for TeddyBear's Room
 */

import type { Product, ProductVariant } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  originalPrice: number;
  name: string;
  variantName?: string;
  imageUrl: string | null;
  variant: CartItemVariant | null;
  product?: Product;
}

export interface CartItemVariant {
  id: string;
  name: string;
  options: {
    name: string;
    value: string;
  }[];
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  isInnerCircle: boolean;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
  discountAmount: number;
}

// Cart Actions
export interface AddToCartInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  itemId: string;
  quantity: number;
}

export interface RemoveFromCartInput {
  itemId: string;
}

export interface ApplyCouponInput {
  code: string;
}

// Cart Calculations
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

// Simple add item input for quick cart operations
export interface SimpleAddToCartInput {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string | null;
  quantity: number;
}

// Cart State for Zustand
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  appliedCoupon: AppliedCoupon | null;

  // Actions
  addItem: (input: AddToCartInput, product: Product, variant?: ProductVariant) => void;
  addSimpleItem: (input: SimpleAddToCartInput) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  setIsOpen: (isOpen: boolean) => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotals: (isInnerCircle: boolean) => CartTotals;
}

// Cart Persistence
export interface PersistedCartState {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
}

// Free Shipping Config
export const FREE_SHIPPING_THRESHOLD = 50000; // 5만원
export const INNER_CIRCLE_FREE_SHIPPING_THRESHOLD = 30000; // 3만원 (이너 써클)
export const INNER_CIRCLE_DISCOUNT_RATE = 0.1; // 10% 할인
