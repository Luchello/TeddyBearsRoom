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
  freeShippingReason?: FreeShippingReason;
  ambassadorFreeShippingAvailable: boolean;
  ambassadorFreeShippingApplied: boolean;
  amountToFreeShipping: number;
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

  // Ambassador Free Shipping State
  ambassadorShipping: AmbassadorShippingState;

  // Actions
  addItem: (input: AddToCartInput, product: Product, variant?: ProductVariant) => void;
  addSimpleItem: (input: SimpleAddToCartInput) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  setIsOpen: (isOpen: boolean) => void;

  // Ambassador Free Shipping Actions
  checkAmbassadorFreeShipping: (profileId: string) => Promise<void>;
  applyAmbassadorFreeShipping: (apply: boolean) => void;
  resetAmbassadorShipping: () => void;

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
export const SHIPPING_FEE = 3000; // 기본 배송비

// Ambassador Free Shipping Types
export type FreeShippingReason =
  | "threshold"        // 금액 기준 달성
  | "inner_circle"     // 이너서클 금액 기준 달성
  | "ambassador"       // 앰버서더 무료 배송 사용
  | "coupon";          // 쿠폰 적용

export interface AmbassadorShippingState {
  /** 앰버서더 무료 배송 사용 가능 여부 */
  available: boolean;
  /** 앰버서더 무료 배송 적용 여부 (사용자 선택) */
  applied: boolean;
  /** 다음 사용 가능 일시 */
  nextAvailableAt: Date | null;
  /** 로딩 상태 */
  isLoading: boolean;
}
