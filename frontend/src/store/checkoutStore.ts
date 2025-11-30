"use client";

// ====================================
// TeddyBear's Room - Checkout Store
// 결제/주문 상태 관리 (Zustand)
// ====================================
//
// 🎯 용도:
// - 주문 생성 및 관리
// - 배송 정보/결제 방법 저장
// - 결제 처리 상태 추적
//
// ⚠️ 현재 상태: Skeleton (스켈레톤)
// - TossPayments SDK 연동 예정
// - processPayment는 Mock 구현
//
// 📦 상태 구조:
// - currentOrder: Order | null (현재 주문)
// - isProcessing: boolean (결제 처리 중)
// - shippingAddress: string (배송 주소)
// - shippingMemo: string (배송 메모)
// - paymentMethod: "card" | "bank" | "virtual" (결제 방법)
//
// 🔧 주요 기능:
// - createOrder: 장바구니 → 주문 생성
// - processPayment: 결제 처리 (TODO: TossPayments)
// - completeOrder/cancelOrder: 주문 상태 변경
//
// 📝 사용 예시:
// ```tsx
// const { createOrder, processPayment, clearCheckout } = useCheckoutStore();
//
// // 1. 주문 생성
// const order = createOrder(cartItems);
//
// // 2. 결제 처리
// const success = await processPayment();
//
// // 3. 완료 후 초기화
// clearCheckout();
// ```
//
// 🔜 향후 계획:
// - TossPayments SDK 연동
// - 빌링키 기반 정기결제 (구독)
// - 결제 실패 시 재시도 로직
// ====================================

import { create } from "zustand";
import type { Order, OrderItem, OrderStatus, CheckoutState } from "@/lib/types";
import type { CartItem } from "@/lib/types";

// ──────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────

/**
 * Checkout Store 인터페이스
 * @description CheckoutState 확장 + 배송/결제 정보 + 액션 메서드
 */
interface CheckoutStore extends CheckoutState {
  // Shipping Info (배송 정보)
  shippingAddress: string;  // 배송 주소
  shippingMemo: string;     // 배송 메모 (예: "문 앞에 놓아주세요")

  // Payment (결제 정보)
  paymentMethod: "card" | "bank" | "virtual" | null; // 카드/계좌이체/가상계좌

  // Actions
  setShippingAddress: (address: string) => void;
  setShippingMemo: (memo: string) => void;
  setPaymentMethod: (method: "card" | "bank" | "virtual") => void;
  createOrder: (cartItems: CartItem[]) => Order;
  processPayment: () => Promise<boolean>;
  completeOrder: () => void;
  cancelOrder: () => void;
  clearCheckout: () => void;
}

// ──────────────────────────────────────
// 헬퍼 함수: 주문 ID 생성
// ──────────────────────────────────────

/**
 * 고유 주문 ID 생성
 *
 * @description
 * timestamp(base36) + random(6자리)로 고유 ID 생성
 * 형식: TBR-[timestamp]-[random]
 *
 * @returns string - 주문 ID (예: "TBR-M5FK2P-A1B2C3")
 *
 * @example
 * const orderId = generateOrderId();
 * // "TBR-M5FK2P-A1B2C3"
 */
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);  // Base36으로 압축
  const random = Math.random().toString(36).substring(2, 8); // 6자리 랜덤
  return `TBR-${timestamp}-${random}`.toUpperCase();
};

// ──────────────────────────────────────
// Store 생성
// ──────────────────────────────────────

/**
 * 결제/주문 Zustand Store
 *
 * @description
 * 체크아웃 프로세스를 관리합니다.
 * 현재는 Skeleton으로, TossPayments SDK 연동 예정입니다.
 *
 * ⚠️ persist를 사용하지 않음:
 * 결제 정보는 보안상 localStorage에 저장하지 않습니다.
 * 페이지 새로고침 시 초기화됩니다.
 *
 * @example
 * // 체크아웃 플로우
 * const { setShippingAddress, setPaymentMethod, createOrder, processPayment } = useCheckoutStore();
 *
 * // Step 1: 배송 정보 입력
 * setShippingAddress("서울시 강남구...");
 *
 * // Step 2: 결제 방법 선택
 * setPaymentMethod("card");
 *
 * // Step 3: 주문 생성
 * const order = createOrder(cartItems);
 *
 * // Step 4: 결제 처리
 * const success = await processPayment();
 */
export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  // ──────────────────────────────────────
  // 초기 상태
  // ──────────────────────────────────────
  currentOrder: null,
  isProcessing: false,
  shippingAddress: "",
  shippingMemo: "",
  paymentMethod: null,

  // ──────────────────────────────────────
  // Setters: 배송/결제 정보 설정
  // ──────────────────────────────────────
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setShippingMemo: (memo) => set({ shippingMemo: memo }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  // ──────────────────────────────────────
  // 주문 생성 (장바구니 → Order)
  // - CartItem[] → OrderItem[] 변환
  // - 총 금액 계산
  // - 주문 ID 생성
  // ──────────────────────────────────────
  createOrder: (cartItems) => {
    // CartItem → OrderItem 변환 (가격 계산 포함)
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price * item.quantity, // 소계
    }));

    // 총 금액 계산
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

    // Order 객체 생성
    const order: Order = {
      id: generateOrderId(),
      items: orderItems,
      totalPrice,
      status: "pending", // 초기 상태: 결제 대기
      shippingAddress: get().shippingAddress,
      createdAt: new Date().toISOString(),
    };

    set({ currentOrder: order });
    return order;
  },

  // ──────────────────────────────────────
  // 결제 처리 (Skeleton - TossPayments 연동 예정)
  // ⚠️ 현재는 Mock 구현 (2초 대기 후 성공)
  //
  // TODO: TossPayments SDK 연동
  // 1. TossPayments.init() 호출
  // 2. requestPayment() 실행
  // 3. 결과에 따라 order.status 업데이트
  // 4. 구독의 경우 빌링키 저장
  // ──────────────────────────────────────
  processPayment: async () => {
    const order = get().currentOrder;
    const paymentMethod = get().paymentMethod;

    // 유효성 검사
    if (!order || !paymentMethod) {
      return false;
    }

    set({ isProcessing: true });

    // TODO: TossPayments SDK 연동으로 교체
    // 현재는 Mock - 2초 대기 후 성공
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock 결과 (항상 성공)
    const success = true;

    if (success) {
      // 결제 성공 → 상태를 "paid"로 변경
      set({
        currentOrder: { ...order, status: "paid" as OrderStatus },
        isProcessing: false,
      });
    } else {
      // 결제 실패 → isProcessing만 해제
      set({ isProcessing: false });
    }

    return success;
  },

  // ──────────────────────────────────────
  // 주문 완료 (배송 완료 처리)
  // - status: "paid" → "shipped"
  // ──────────────────────────────────────
  completeOrder: () => {
    const order = get().currentOrder;
    if (order) {
      set({
        currentOrder: { ...order, status: "shipped" as OrderStatus },
      });
    }
  },

  // ──────────────────────────────────────
  // 주문 취소
  // - status → "cancelled"
  // ──────────────────────────────────────
  cancelOrder: () => {
    const order = get().currentOrder;
    if (order) {
      set({
        currentOrder: { ...order, status: "cancelled" as OrderStatus },
      });
    }
  },

  // ──────────────────────────────────────
  // 체크아웃 상태 초기화
  // - 결제 완료 후 또는 취소 후 호출
  // - 모든 상태를 초기값으로 리셋
  // ──────────────────────────────────────
  clearCheckout: () => {
    set({
      currentOrder: null,
      isProcessing: false,
      shippingAddress: "",
      shippingMemo: "",
      paymentMethod: null,
    });
  },
}));
