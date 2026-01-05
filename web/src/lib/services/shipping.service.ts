/**
 * Shipping Service
 *
 * TBR 배송비 계산 서비스
 *
 * 배송비 계산 우선순위:
 * 1. 금액 기준 무료 배송 (일반: 50K / 이너서클: 30K) -> 자동 적용
 * 2. 쿠폰 무료 배송 -> 쿠폰 적용 시
 * 3. 기본 배송비 3,000원
 */

import {
  FREE_SHIPPING_THRESHOLD,
  INNER_CIRCLE_FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "@/config/cart";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/**
 * 무료 배송 적용 사유
 */
export type FreeShippingReason =
  | "threshold"        // 금액 기준 달성
  | "inner_circle"     // 이너서클 금액 기준 달성
  | "coupon";          // 쿠폰 적용

/**
 * 배송비 계산 결과
 */
export interface ShippingCalculationResult {
  /** 최종 배송비 (0 = 무료) */
  shippingFee: number;
  /** 무료 배송 적용 여부 */
  isFreeShipping: boolean;
  /** 무료 배송 사유 (무료일 경우) */
  freeShippingReason?: FreeShippingReason;
  /** 현재 적용된 무료 배송 기준 금액 */
  freeShippingThreshold: number;
  /** 무료 배송까지 남은 금액 */
  amountToFreeShipping: number;
}

/**
 * 배송비 계산 입력 파라미터
 */
export interface ShippingCalculationInput {
  /** 장바구니 총액 (할인 적용 후) */
  cartTotal: number;
  /** 이너서클 구독자 여부 */
  isInnerCircle: boolean;
  /** 쿠폰 무료 배송 적용 여부 */
  hasFreeShippingCoupon?: boolean;
}

// ============================================================
// SHIPPING CALCULATION
// ============================================================

/**
 * 배송비 계산
 *
 * @description 기본 배송비 계산
 * @param cartTotal - 장바구니 총액 (할인 적용 후)
 * @param isInnerCircle - 이너서클 구독자 여부
 * @param hasFreeShippingCoupon - 쿠폰 무료 배송 적용 여부
 */
export function calculateShippingSync(
  cartTotal: number,
  isInnerCircle: boolean,
  hasFreeShippingCoupon: boolean = false
): ShippingCalculationResult {
  const threshold = isInnerCircle
    ? INNER_CIRCLE_FREE_SHIPPING_THRESHOLD
    : FREE_SHIPPING_THRESHOLD;

  // 1. 쿠폰 무료 배송
  if (hasFreeShippingCoupon) {
    return {
      shippingFee: 0,
      isFreeShipping: true,
      freeShippingReason: "coupon",
      freeShippingThreshold: threshold,
      amountToFreeShipping: 0,
    };
  }

  // 2. 금액 기준 무료 배송
  if (cartTotal >= threshold) {
    return {
      shippingFee: 0,
      isFreeShipping: true,
      freeShippingReason: isInnerCircle ? "inner_circle" : "threshold",
      freeShippingThreshold: threshold,
      amountToFreeShipping: 0,
    };
  }

  // 3. 기본 배송비
  return {
    shippingFee: SHIPPING_FEE,
    isFreeShipping: false,
    freeShippingThreshold: threshold,
    amountToFreeShipping: threshold - cartTotal,
  };
}

/**
 * 배송비 계산 (서버 사이드용)
 *
 * @description 전체 배송비 계산
 *
 * ```
 * 배송비 계산 플로우:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  cartTotal >= threshold?                                    │
 * │  ├─ YES → 무료 배송 (threshold/inner_circle)               │
 * │  └─ NO                                                      │
 * │       ├─ 쿠폰 무료 배송? → YES → 무료 배송 (coupon)        │
 * │       └─ NO → 기본 배송비 3,000원                          │
 * └─────────────────────────────────────────────────────────────┘
 * ```
 */
export async function calculateShipping(
  input: ShippingCalculationInput
): Promise<ShippingCalculationResult> {
  const {
    cartTotal,
    isInnerCircle,
    hasFreeShippingCoupon = false,
  } = input;

  return calculateShippingSync(cartTotal, isInnerCircle, hasFreeShippingCoupon);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * 무료 배송 사유 한글 변환
 */
export function getFreeShippingReasonLabel(reason: FreeShippingReason): string {
  const labels: Record<FreeShippingReason, string> = {
    threshold: "주문 금액 무료 배송",
    inner_circle: "이너서클 무료 배송",
    coupon: "쿠폰 무료 배송",
  };
  return labels[reason];
}

/**
 * 배송비 포맷팅
 */
export function formatShippingFee(fee: number): string {
  if (fee === 0) return "무료";
  return `${fee.toLocaleString()}원`;
}
