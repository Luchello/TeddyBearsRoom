"use client";

// ====================================
// TeddyBear's Room - WishlistDrawer 컴포넌트
// 위시리스트 슬라이드 패널 (Drawer)
// ====================================
//
// 🎯 용도:
// - 우측에서 슬라이드 인하는 위시리스트 패널
// - 찜한 상품 목록 표시
// - 장바구니로 이동 또는 개별/전체 삭제
//
// 📦 구조:
// - Backdrop: 반투명 배경 (클릭 시 닫힘)
// - Drawer: 우측 슬라이드 패널
// - Header: 제목 + 닫기 버튼
// - Content: 아이템 목록 (비어있으면 empty state)
// - Footer: 총 개수 + 비우기/전체담기 버튼
//
// 🎨 디자인:
// - animate-in slide-in-from-right 애니메이션
// - 반투명 backdrop-blur 배경
// - 둥근 모서리 + 그림자
//
// 🔧 주요 기능:
// - ESC 키로 닫기
// - 열릴 때 body scroll 잠금
// - 개별 상품 장바구니 담기
// - 개별 삭제 및 전체 비우기
// - 전체 담기 (모든 찜 상품 → 장바구니)
//
// 📝 의존성:
// - shadcn/ui: Button
// - lucide-react: X, Trash2, ShoppingCart
// - wishlistStore: 위시리스트 상태
// - cartStore: 장바구니 상태
// - ToastContext: 알림 표시
// ====================================

import { useEffect } from "react";
import Link from "next/link";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/contexts/ToastContext";

// ──────────────────────────────────────
// WishlistDrawer 컴포넌트
// ──────────────────────────────────────

/**
 * 위시리스트 드로어 컴포넌트
 *
 * @description
 * 우측에서 슬라이드 인하는 위시리스트 패널입니다.
 * - wishlistStore의 isOpen 상태로 표시/숨김 제어
 * - 장바구니 담기, 개별 삭제, 전체 비우기 기능
 * - ESC 키 또는 배경 클릭으로 닫기
 *
 * @example
 * // layout.tsx에서 전역 배치
 * <WishlistDrawer />
 *
 * // 열기는 wishlistStore의 toggleWishlist() 호출
 * const { toggleWishlist } = useWishlistStore();
 * <button onClick={toggleWishlist}>찜 목록 열기</button>
 */
export function WishlistDrawer() {
  // ──────────────────────────────────────
  // Store에서 필요한 상태/액션 가져오기
  // ──────────────────────────────────────
  const {
    items,            // 찜한 상품 배열
    isOpen,           // 드로어 열림 상태
    closeWishlist,    // 드로어 닫기
    removeItem,       // 상품 삭제
    clearWishlist,    // 전체 비우기
  } = useWishlistStore();

  // 장바구니 Store
  const { addItem: addToCart, openCart } = useCartStore();

  // Toast 알림
  const { addToast } = useToast();

  // ──────────────────────────────────────
  // ESC 키로 드로어 닫기
  // - isOpen 상태에서만 동작
  // ──────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeWishlist();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeWishlist]);

  // ──────────────────────────────────────
  // Body Scroll 잠금
  // - 드로어 열릴 때 배경 스크롤 방지
  // ──────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // cleanup: 컴포넌트 언마운트 시 복원
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ──────────────────────────────────────
  // 장바구니 담기 핸들러
  // - 상품을 장바구니에 추가
  // - Toast 알림 표시
  // - 위시리스트 닫고 장바구니 열기
  // ──────────────────────────────────────
  const handleAddToCart = (product: typeof items[0]["product"]) => {
    addToCart(product);
    addToast(`${product.name}을(를) 장바구니에 담았어요!`, "success");
    closeWishlist();
    openCart();
  };

  // 닫힌 상태면 렌더링 안 함
  if (!isOpen) return null;

  return (
    <>
      {/* ─────────────────────────────────────
          Backdrop
          - 반투명 검은 배경
          - 클릭 시 드로어 닫기
          ───────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────
          Drawer Panel
          - 우측에서 슬라이드 인
          - role="dialog"로 접근성 확보
          ───────────────────────────────────── */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="찜 목록"
      >
        {/* ─────────────────────────────────────
            Header
            - 제목 + 닫기 버튼
            ───────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>💝</span> 찜 목록
          </h2>
          <button
            onClick={closeWishlist}
            className="p-2 rounded-xl hover:bg-accent transition-colors"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ─────────────────────────────────────
            Content Area
            - 아이템 목록 또는 Empty State
            ───────────────────────────────────── */}
        <div className="flex flex-col h-[calc(100%-140px)] overflow-hidden">
          {items.length === 0 ? (
            /* ─────────────────────────────────────
               Empty State
               - 찜한 상품이 없을 때 표시
               ───────────────────────────────────── */
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <span className="text-6xl mb-4">💝</span>
              <p>찜한 상품이 없어요</p>
              <Button asChild variant="outline" className="mt-4 rounded-xl">
                <Link href="/products" onClick={closeWishlist}>
                  상품 둘러보기
                </Link>
              </Button>
            </div>
          ) : (
            /* ─────────────────────────────────────
               Items List
               - 스크롤 가능한 아이템 목록
               ───────────────────────────────────── */
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-xl bg-muted/50"
                >
                  {/* 상품 이미지 (링크 + 플레이스홀더) */}
                  <Link
                    href={`/products/${item.product.id}`}
                    onClick={closeWishlist}
                    className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-3xl">🧸</span>
                  </Link>

                  {/* 상품 정보 + 액션 버튼 */}
                  <div className="flex-1 min-w-0">
                    {/* 상품명 (링크) */}
                    <Link
                      href={`/products/${item.product.id}`}
                      onClick={closeWishlist}
                    >
                      <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    {/* 가격 */}
                    <p className="text-primary font-bold mt-1">
                      {item.product.price.toLocaleString()}원
                    </p>

                    {/* ─────────────────────────────────────
                        Action Buttons
                        - 장바구니 담기 + 삭제
                        ───────────────────────────────────── */}
                    <div className="flex items-center gap-2 mt-2">
                      {/* 장바구니 담기 */}
                      <button
                        onClick={() => handleAddToCart(item.product)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        담기
                      </button>
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors ml-auto"
                        aria-label="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────
            Footer (아이템이 있을 때만)
            - 총 개수 + 비우기/전체담기 버튼
            ───────────────────────────────────── */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
            {/* 총 개수 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">찜한 상품</span>
              <span className="text-lg font-bold text-primary">
                {items.length}개
              </span>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              {/* 비우기 버튼 */}
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="rounded-xl"
              >
                비우기
              </Button>
              {/* 전체 담기 버튼 */}
              <Button
                className="flex-1 rounded-xl"
                onClick={() => {
                  // 모든 찜 상품을 장바구니에 추가
                  items.forEach((item) => addToCart(item.product));
                  addToast("모든 찜 상품을 장바구니에 담았어요!", "success");
                  closeWishlist();
                  openCart();
                }}
              >
                전체 담기
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
