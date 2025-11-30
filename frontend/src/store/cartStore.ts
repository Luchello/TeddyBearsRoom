// ====================================
// TeddyBear's Room - Cart Store
// 장바구니 상태 관리 (Zustand + localStorage persist)
// ====================================
//
// 🎯 용도:
// - 장바구니 아이템 CRUD 관리
// - localStorage에 자동 저장 (persist middleware)
// - 장바구니 UI 상태 (열기/닫기) 관리
//
// 📦 상태 구조:
// - items: CartItem[] (상품 + 수량)
// - isOpen: boolean (장바구니 드로어 표시 여부)
//
// 🔧 주요 기능:
// - addItem: 상품 추가 (이미 있으면 수량 증가)
// - removeItem: 상품 제거
// - updateQuantity: 수량 변경 (0 이하면 자동 제거)
// - getTotalItems/getTotalPrice: 계산된 값
//
// 💾 영속성:
// - localStorage 키: "tbr-cart"
// - 페이지 새로고침해도 장바구니 유지
//
// 📝 사용 예시:
// ```tsx
// const { items, addItem, getTotalPrice } = useCartStore();
// addItem(product); // 장바구니에 추가
// const total = getTotalPrice(); // 총 금액 계산
// ```
// ====================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem } from "@/lib/types";

// ──────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────

/**
 * 장바구니 Store 인터페이스
 * @description 상태(state)와 액션(actions)을 모두 포함
 */
interface CartState {
  // State
  items: CartItem[];      // 장바구니 아이템 목록
  isOpen: boolean;        // 장바구니 드로어 표시 여부

  // Item Actions
  addItem: (product: Product) => void;                       // 상품 추가
  removeItem: (productId: string) => void;                   // 상품 제거
  updateQuantity: (productId: string, quantity: number) => void; // 수량 변경
  clearCart: () => void;                                     // 장바구니 비우기

  // UI Actions
  toggleCart: () => void;  // 드로어 토글
  openCart: () => void;    // 드로어 열기
  closeCart: () => void;   // 드로어 닫기

  // Getters (계산된 값)
  getTotalItems: () => number;   // 총 아이템 수 (수량 합계)
  getTotalPrice: () => number;   // 총 금액 (원)
}

// ──────────────────────────────────────
// Store 생성
// ──────────────────────────────────────

/**
 * 장바구니 Zustand Store
 *
 * @description
 * persist middleware로 localStorage에 자동 저장됩니다.
 * - 키: "tbr-cart"
 * - 페이지 새로고침 시 자동 복원
 *
 * @example
 * // 컴포넌트에서 사용
 * const items = useCartStore((state) => state.items);
 * const addItem = useCartStore((state) => state.addItem);
 *
 * // 또는 구조분해
 * const { items, addItem } = useCartStore();
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ──────────────────────────────────────
      // 초기 상태
      // ──────────────────────────────────────
      items: [],
      isOpen: false,

      // ──────────────────────────────────────
      // 상품 추가
      // - 이미 있는 상품: 수량 +1
      // - 새 상품: items 배열에 추가
      // ──────────────────────────────────────
      addItem: (product: Product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          // 기존 상품: 수량 증가
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // 새 상품: 배열에 추가 (수량 1)
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },

      // ──────────────────────────────────────
      // 상품 제거
      // - productId로 필터링하여 제거
      // ──────────────────────────────────────
      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      // ──────────────────────────────────────
      // 수량 변경
      // - quantity <= 0: 상품 제거
      // - quantity > 0: 수량 업데이트
      // ──────────────────────────────────────
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          // 수량 0 이하면 제거
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      // ──────────────────────────────────────
      // 장바구니 비우기
      // ──────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ──────────────────────────────────────
      // UI 액션: 드로어 제어
      // ──────────────────────────────────────
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // ──────────────────────────────────────
      // Getter: 총 아이템 수
      // - 각 상품의 수량을 모두 합산
      // ──────────────────────────────────────
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // ──────────────────────────────────────
      // Getter: 총 금액 (원)
      // - 각 상품의 (가격 × 수량)을 합산
      // ──────────────────────────────────────
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "tbr-cart", // localStorage 키
    }
  )
);
