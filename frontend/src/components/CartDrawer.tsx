"use client";

// ====================================
// TeddyBear's Room - CartDrawer 컴포넌트
// 장바구니 슬라이드 패널 (Drawer)
// ====================================
//
// 🎯 용도:
// - 우측에서 슬라이드 인하는 장바구니 패널
// - 장바구니 아이템 목록 표시
// - 수량 조절 및 삭제 기능
// - 총 금액 계산 및 주문하기 버튼
//
// 📦 구조:
// - Backdrop: 반투명 배경 (클릭 시 닫힘)
// - Drawer: 우측 슬라이드 패널
// - Header: 제목 + 닫기 버튼
// - Content: 아이템 목록 (비어있으면 empty state)
// - Footer: 총 금액 + 비우기/주문하기 버튼
//
// 🎨 디자인:
// - animate-in slide-in-from-right 애니메이션
// - 반투명 backdrop-blur 배경
// - 둥근 모서리 + 그림자
//
// 🔧 주요 기능:
// - ESC 키로 닫기
// - 열릴 때 body scroll 잠금
// - 수량 조절 (-, +)
// - 개별 삭제 및 전체 비우기
//
// 📝 의존성:
// - shadcn/ui: Button
// - lucide-react: X, Minus, Plus, Trash2
// - cartStore: 장바구니 상태
// ====================================

import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

// ──────────────────────────────────────
// CartDrawer 컴포넌트
// ──────────────────────────────────────

/**
 * 장바구니 드로어 컴포넌트
 *
 * @description
 * 우측에서 슬라이드 인하는 장바구니 패널입니다.
 * - cartStore의 isOpen 상태로 표시/숨김 제어
 * - 아이템 수량 조절 및 삭제 가능
 * - ESC 키 또는 배경 클릭으로 닫기
 *
 * @example
 * // layout.tsx에서 전역 배치
 * <CartDrawer />
 *
 * // 열기는 cartStore의 openCart() 호출
 * const { openCart } = useCartStore();
 * <button onClick={openCart}>장바구니 열기</button>
 */
export function CartDrawer() {
  // ──────────────────────────────────────
  // Store에서 필요한 상태/액션 가져오기
  // ──────────────────────────────────────
  const {
    items,           // 장바구니 아이템 배열
    isOpen,          // 드로어 열림 상태
    closeCart,       // 드로어 닫기
    removeItem,      // 아이템 삭제
    updateQuantity,  // 수량 변경
    clearCart,       // 전체 비우기
    getTotalPrice,   // 총 금액 계산
  } = useCartStore();

  // ──────────────────────────────────────
  // ESC 키로 드로어 닫기
  // - isOpen 상태에서만 동작
  // ──────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeCart]);

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

  // 닫힌 상태면 렌더링 안 함
  if (!isOpen) return null;

  // 총 금액 계산
  const totalPrice = getTotalPrice();

  return (
    <>
      {/* ─────────────────────────────────────
          Backdrop
          - 반투명 검은 배경
          - 클릭 시 드로어 닫기
          ───────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={closeCart}
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
        aria-label="장바구니"
      >
        {/* ─────────────────────────────────────
            Header
            - 제목 + 닫기 버튼
            ───────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🛒</span> 장바구니
          </h2>
          <button
            onClick={closeCart}
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
               - 장바구니가 비어있을 때 표시
               ───────────────────────────────────── */
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <span className="text-6xl mb-4">🧸</span>
              <p>장바구니가 비어있어요</p>
              <Button asChild variant="outline" className="mt-4 rounded-xl">
                <Link href="/products" onClick={closeCart}>
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
                  {/* 상품 이미지 (플레이스홀더) */}
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <span className="text-3xl">🧸</span>
                  </div>

                  {/* 상품 정보 + 수량 컨트롤 */}
                  <div className="flex-1 min-w-0">
                    {/* 상품명 */}
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </h3>
                    {/* 가격 */}
                    <p className="text-primary font-bold mt-1">
                      {item.product.price.toLocaleString()}원
                    </p>

                    {/* ─────────────────────────────────────
                        Quantity Controls
                        - -, 수량, + 버튼
                        - 삭제 버튼 (우측)
                        ───────────────────────────────────── */}
                    <div className="flex items-center gap-2 mt-2">
                      {/* 수량 감소 */}
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 rounded-lg hover:bg-background transition-colors"
                        aria-label="수량 감소"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      {/* 현재 수량 */}
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      {/* 수량 증가 */}
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1 rounded-lg hover:bg-background transition-colors"
                        aria-label="수량 증가"
                      >
                        <Plus className="h-4 w-4" />
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
            - 총 금액 + 비우기/주문하기 버튼
            ───────────────────────────────────── */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
            {/* 총 금액 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">총 금액</span>
              <span className="text-xl font-bold text-primary">
                {totalPrice.toLocaleString()}원
              </span>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              {/* 비우기 버튼 */}
              <Button
                variant="outline"
                onClick={clearCart}
                className="rounded-xl"
              >
                비우기
              </Button>
              {/* 주문하기 버튼 */}
              <Button className="flex-1 rounded-xl" onClick={closeCart}>
                주문하기
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
