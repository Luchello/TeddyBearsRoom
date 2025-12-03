"use client";

// ====================================
// TeddyBear's Room - WishlistButton 컴포넌트
// Header 위시리스트(찜) 아이콘 버튼
// ====================================
//
// 🎯 용도:
// - Header에서 위시리스트 열기 버튼
// - 찜한 아이템 수량 배지 표시
// - 클릭 시 WishlistDrawer 토글
//
// 📦 구조:
// - button: 클릭 영역
// - Heart 아이콘 (lucide-react)
// - 수량 배지 (1개 이상일 때만 표시)
//
// 🎨 디자인:
// - 아이콘: Heart (lucide-react)
// - hover 시 primary 색상으로 변경
// - 배지: 빨간색 배경 (bg-red-500)
// - 99개 초과 시 "99+" 표시
//
// 🔧 주요 기능:
// - toggleWishlist: WishlistDrawer 열기/닫기
// - items.length: 찜한 아이템 수량
//
// 📝 의존성:
// - lucide-react: Heart 아이콘
// - wishlistStore: 위시리스트 상태 및 액션
// ====================================

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

// ──────────────────────────────────────
// WishlistButton 컴포넌트
// ──────────────────────────────────────

/**
 * 위시리스트 버튼 컴포넌트
 *
 * @description
 * Header에 표시되는 위시리스트(찜) 아이콘 버튼입니다.
 * - 클릭 시 WishlistDrawer 열기
 * - 찜한 아이템 수량 배지 표시
 * - hover 시 하트 색상 변경
 *
 * @example
 * // Header 우측 액션 영역 (Desktop)
 * <div className="hidden sm:flex items-center gap-1">
 *   <WishlistButton />
 *   <CartButton />
 * </div>
 */
export function WishlistButton() {
  // ──────────────────────────────────────
  // Store에서 필요한 상태/액션 가져오기
  // - items: 찜한 상품 배열
  // - toggleWishlist: 드로어 열기/닫기
  // ──────────────────────────────────────
  const { items, toggleWishlist } = useWishlistStore();
  const itemCount = items.length;

  return (
    <button
      onClick={toggleWishlist}
      className="relative p-2.5 rounded-xl hover:bg-muted transition-colors group min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label={`찜 목록 (${itemCount}개)`}
    >
      {/* 하트 아이콘 - hover 시 색상 변경, 44px+ 터치 타겟 (WCAG 2.5.5) */}
      <Heart className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />

      {/* ─────────────────────────────────────
          수량 배지
          - 1개 이상일 때만 표시
          - 빨간색 배경 (위시리스트 = 하트 = 빨강)
          - 99개 초과 시 "99+" 표시
          ───────────────────────────────────── */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
