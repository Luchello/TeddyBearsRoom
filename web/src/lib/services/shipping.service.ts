/**
 * Shipping Service
 *
 * TBR 배송비 계산 및 앰버서더 무료 배송 통합 서비스
 *
 * 배송비 계산 우선순위:
 * 1. 금액 기준 무료 배송 (일반: 50K / 이너서클: 30K) -> 자동 적용
 * 2. 앰버서더 무료 배송 -> 사용자 선택 적용 (월 1회, 금액 미달시에도 사용 가능)
 * 3. 쿠폰 무료 배송 -> 쿠폰 적용 시
 * 4. 기본 배송비 3,000원
 */

import {
  checkFreeShippingAvailable,
  useFreeShipping as consumeFreeShipping,
} from "./ambassador.service";
import {
  FREE_SHIPPING_THRESHOLD,
  INNER_CIRCLE_FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "@/types/cart";
import { logger } from "@/lib/logger";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/**
 * 무료 배송 적용 사유
 */
export type FreeShippingReason =
  | "threshold"        // 금액 기준 달성
  | "inner_circle"     // 이너서클 금액 기준 달성
  | "ambassador"       // 앰버서더 무료 배송 사용
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
  /** 앰버서더 무료 배송 사용 가능 여부 */
  ambassadorFreeShippingAvailable: boolean;
  /** 앰버서더 무료 배송 다음 사용 가능 일시 */
  ambassadorNextAvailableAt: Date | null;
  /** 현재 적용된 무료 배송 기준 금액 */
  freeShippingThreshold: number;
  /** 무료 배송까지 남은 금액 */
  amountToFreeShipping: number;
}

/**
 * 배송비 계산 입력 파라미터
 */
export interface ShippingCalculationInput {
  /** 프로필 ID (로그인 사용자) */
  profileId?: string;
  /** 장바구니 총액 (할인 적용 후) */
  cartTotal: number;
  /** 이너서클 구독자 여부 */
  isInnerCircle: boolean;
  /** 쿠폰 무료 배송 적용 여부 */
  hasFreeShippingCoupon?: boolean;
  /** 앰버서더 무료 배송 적용 요청 */
  applyAmbassadorFreeShipping?: boolean;
}

/**
 * 앰버서더 무료 배송 적용 결과
 */
export interface ApplyAmbassadorFreeShippingResult {
  success: boolean;
  error?: string;
}

// ============================================================
// SHIPPING CALCULATION
// ============================================================

/**
 * 배송비 계산 (클라이언트 사이드용 - 앰버서더 정보 없이)
 *
 * @description 앰버서더 정보 없이 기본 배송비만 계산
 * @param cartTotal - 장바구니 총액 (할인 적용 후)
 * @param isInnerCircle - 이너서클 구독자 여부
 * @param hasFreeShippingCoupon - 쿠폰 무료 배송 적용 여부
 */
export function calculateShippingSync(
  cartTotal: number,
  isInnerCircle: boolean,
  hasFreeShippingCoupon: boolean = false
): Omit<ShippingCalculationResult, "ambassadorFreeShippingAvailable" | "ambassadorNextAvailableAt"> {
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
 * 배송비 계산 (서버 사이드용 - 앰버서더 정보 포함)
 *
 * @description 앰버서더 무료 배송 가능 여부를 포함한 전체 배송비 계산
 *
 * ```
 * 배송비 계산 플로우:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  cartTotal >= threshold?                                    │
 * │  ├─ YES → 무료 배송 (threshold/inner_circle)               │
 * │  └─ NO                                                      │
 * │       ├─ 쿠폰 무료 배송? → YES → 무료 배송 (coupon)        │
 * │       └─ 앰버서더 적용 요청?                                │
 * │            ├─ YES & 가능 → 무료 배송 (ambassador)          │
 * │            └─ NO → 기본 배송비 3,000원                      │
 * └─────────────────────────────────────────────────────────────┘
 * ```
 */
export async function calculateShipping(
  input: ShippingCalculationInput
): Promise<ShippingCalculationResult> {
  const {
    profileId,
    cartTotal,
    isInnerCircle,
    hasFreeShippingCoupon = false,
    applyAmbassadorFreeShipping = false,
  } = input;

  const threshold = isInnerCircle
    ? INNER_CIRCLE_FREE_SHIPPING_THRESHOLD
    : FREE_SHIPPING_THRESHOLD;

  // 앰버서더 무료 배송 가능 여부 확인 (로그인 사용자만)
  let ambassadorFreeShippingAvailable = false;
  let ambassadorNextAvailableAt: Date | null = null;

  if (profileId) {
    const freeShippingStatus = await checkFreeShippingAvailable(profileId);
    ambassadorFreeShippingAvailable = freeShippingStatus.available;
    ambassadorNextAvailableAt = freeShippingStatus.nextAvailableAt;
  }

  // 1. 금액 기준 무료 배송 (최우선)
  if (cartTotal >= threshold) {
    return {
      shippingFee: 0,
      isFreeShipping: true,
      freeShippingReason: isInnerCircle ? "inner_circle" : "threshold",
      ambassadorFreeShippingAvailable,
      ambassadorNextAvailableAt,
      freeShippingThreshold: threshold,
      amountToFreeShipping: 0,
    };
  }

  // 2. 쿠폰 무료 배송
  if (hasFreeShippingCoupon) {
    return {
      shippingFee: 0,
      isFreeShipping: true,
      freeShippingReason: "coupon",
      ambassadorFreeShippingAvailable,
      ambassadorNextAvailableAt,
      freeShippingThreshold: threshold,
      amountToFreeShipping: 0,
    };
  }

  // 3. 앰버서더 무료 배송 적용 요청 시
  if (applyAmbassadorFreeShipping && ambassadorFreeShippingAvailable) {
    return {
      shippingFee: 0,
      isFreeShipping: true,
      freeShippingReason: "ambassador",
      ambassadorFreeShippingAvailable: true,
      ambassadorNextAvailableAt: null,
      freeShippingThreshold: threshold,
      amountToFreeShipping: 0,
    };
  }

  // 4. 기본 배송비
  return {
    shippingFee: SHIPPING_FEE,
    isFreeShipping: false,
    ambassadorFreeShippingAvailable,
    ambassadorNextAvailableAt,
    freeShippingThreshold: threshold,
    amountToFreeShipping: threshold - cartTotal,
  };
}

// ============================================================
// AMBASSADOR FREE SHIPPING APPLICATION
// ============================================================

/**
 * 앰버서더 무료 배송 사용 처리
 *
 * @description 체크아웃 완료 시 호출하여 실제 사용 처리
 * @param profileId - 프로필 ID
 * @returns 성공/실패 결과
 *
 * @example
 * ```typescript
 * // 체크아웃 완료 시
 * if (ambassadorFreeShippingApplied) {
 *   const result = await applyAmbassadorFreeShipping(profileId);
 *   if (!result.success) {
 *     console.error(result.error);
 *   }
 * }
 * ```
 */
export async function applyAmbassadorFreeShipping(
  profileId: string
): Promise<ApplyAmbassadorFreeShippingResult> {
  try {
    const result = await consumeFreeShipping(profileId);
    return result;
  } catch (error) {
    logger.error("[ShippingService]", "Failed to apply ambassador free shipping:", error);
    return {
      success: false,
      error: "앰버서더 무료 배송 적용 중 오류가 발생했습니다",
    };
  }
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
    ambassador: "앰버서더 무료 배송",
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
