"use client";

// ====================================
// TeddyBear's Room - Wishlist Store
// 위시리스트 상태 관리 (Zustand + localStorage persist)
// ====================================
//
// 🎯 용도:
// - 위시리스트(찜하기) 아이템 관리
// - localStorage에 자동 저장 (persist middleware)
// - 위시리스트 UI 상태 관리
//
// 📦 상태 구조:
// - items: WishlistItem[] (상품 + 추가 시각)
// - isOpen: boolean (위시리스트 드로어 표시 여부)
//
// 🔧 주요 기능:
// - addItem/removeItem: 위시리스트 추가/제거
// - toggleItem: 토글 (있으면 제거, 없으면 추가)
// - isWishlisted: 특정 상품이 위시리스트에 있는지 확인
//
// 💾 영속성:
// - localStorage 키: "tbr-wishlist"
// - addedAt 타임스탬프로 추가 순서 추적
//
// 📝 사용 예시:
// ```tsx
// const { items, toggleItem, isWishlisted } = useWishlistStore();
// const isFavorite = isWishlisted(productId);
// <HeartButton onClick={() => toggleItem(product)} />
// ```
// ====================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WishlistItem } from "@/lib/types";

// ──────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────

/**
 * 위시리스트 Store 인터페이스
 * @description 상태(state)와 액션(actions)을 모두 포함
 */
interface WishlistState {
  // State
  items: WishlistItem[];  // 위시리스트 아이템 목록
  isOpen: boolean;        // 드로어 표시 여부

  // Item Actions
  addItem: (product: Product) => void;      // 위시리스트에 추가
  removeItem: (productId: string) => void;  // 위시리스트에서 제거
  toggleItem: (product: Product) => void;   // 토글 (추가/제거)
  isWishlisted: (productId: string) => boolean; // 존재 여부 확인
  clearWishlist: () => void;                // 위시리스트 비우기

  // UI Actions
  openWishlist: () => void;   // 드로어 열기
  closeWishlist: () => void;  // 드로어 닫기
  toggleWishlist: () => void; // 드로어 토글

  // Getters
  getTotalItems: () => number; // 총 아이템 수
}

// ──────────────────────────────────────
// Store 생성
// ──────────────────────────────────────

/**
 * 위시리스트 Zustand Store
 *
 * @description
 * persist middleware로 localStorage에 자동 저장됩니다.
 * - 키: "tbr-wishlist"
 * - addedAt 필드로 추가 시점 기록
 *
 * @example
 * // 하트 버튼 컴포넌트에서 사용
 * const { isWishlisted, toggleItem } = useWishlistStore();
 *
 * <button onClick={() => toggleItem(product)}>
 *   {isWishlisted(product.id) ? "❤️" : "🤍"}
 * </button>
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      // ──────────────────────────────────────
      // 초기 상태
      // ──────────────────────────────────────
      items: [],
      isOpen: false,

      // ──────────────────────────────────────
      // 위시리스트에 추가
      // - 이미 있으면 무시 (중복 방지)
      // - addedAt: 추가 시점 타임스탬프
      // ──────────────────────────────────────
      addItem: (product) => {
        const exists = get().items.some((item) => item.product.id === product.id);
        if (!exists) {
          set((state) => ({
            items: [...state.items, { product, addedAt: Date.now() }],
          }));
        }
      },

      // ──────────────────────────────────────
      // 위시리스트에서 제거
      // - productId로 필터링
      // ──────────────────────────────────────
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      // ──────────────────────────────────────
      // 토글: 있으면 제거, 없으면 추가
      // - UI에서 하트 버튼 클릭 시 사용
      // ──────────────────────────────────────
      toggleItem: (product) => {
        const exists = get().items.some((item) => item.product.id === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      // ──────────────────────────────────────
      // 존재 여부 확인
      // - 하트 아이콘 채움 여부 결정에 사용
      // ──────────────────────────────────────
      isWishlisted: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },

      // ──────────────────────────────────────
      // UI 액션: 드로어 제어
      // ──────────────────────────────────────
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),

      // ──────────────────────────────────────
      // 위시리스트 비우기 & 총 개수
      // ──────────────────────────────────────
      clearWishlist: () => set({ items: [] }),
      getTotalItems: () => get().items.length,
    }),
    {
      name: "tbr-wishlist", // localStorage 키
    }
  )
);
