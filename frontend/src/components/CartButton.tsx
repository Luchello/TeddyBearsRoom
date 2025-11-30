"use client";

// ====================================
// TeddyBear's Room - CartButton 컴포넌트
// Header 장바구니 아이콘 버튼
// ====================================
//
// 🎯 용도:
// - Header에서 장바구니 열기 버튼
// - 담긴 아이템 수량 배지 표시
// - 클릭 시 CartDrawer 토글
//
// 📦 구조:
// - button: 클릭 영역
// - ShoppingCart 아이콘 (lucide-react)
// - 수량 배지 (1개 이상일 때만 표시)
//
// 🎨 디자인:
// - 아이콘: ShoppingCart (lucide-react)
// - 배지: 우측 상단 (absolute -top-1 -right-1)
// - 99개 초과 시 "99+" 표시
// - zoom-in 애니메이션 (배지 등장 시)
//
// 🔧 주요 기능:
// - toggleCart: CartDrawer 열기/닫기
// - getTotalItems: 장바구니 아이템 총 수량 계산
//
// 📝 의존성:
// - lucide-react: ShoppingCart 아이콘
// - cartStore: 장바구니 상태 및 액션
// ====================================

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

// ──────────────────────────────────────
// CartButton 컴포넌트
// ──────────────────────────────────────

/**
 * 장바구니 버튼 컴포넌트
 *
 * @description
 * Header에 표시되는 장바구니 아이콘 버튼입니다.
 * - 클릭 시 CartDrawer 열기
 * - 담긴 아이템 수량 배지 표시
 * - 99개 초과 시 "99+" 표시
 *
 * @example
 * // Header 우측 액션 영역
 * <div className="flex items-center gap-1">
 *   <WishlistButton />
 *   <CartButton />
 * </div>
 */
export function CartButton() {
  // ──────────────────────────────────────
  // Store에서 필요한 액션/상태 가져오기
  // - toggleCart: 장바구니 드로어 열기/닫기
  // - getTotalItems: 장바구니 아이템 총 수량
  // ──────────────────────────────────────
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 rounded-xl hover:bg-accent transition-colors"
      aria-label={`장바구니 (${totalItems}개)`}
    >
      {/* 장바구니 아이콘 */}
      <ShoppingCart className="h-5 w-5" />

      {/* ─────────────────────────────────────
          수량 배지
          - 1개 이상일 때만 표시
          - 99개 초과 시 "99+" 표시
          - zoom-in 애니메이션
          ───────────────────────────────────── */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-in zoom-in duration-200">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
