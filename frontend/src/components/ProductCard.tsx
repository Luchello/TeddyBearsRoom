"use client";

// ====================================
// TeddyBear's Room - ProductCard 컴포넌트
// 상품 카드 UI (그리드 표시용)
// ====================================
//
// 🎯 용도:
// - 상품 목록에서 개별 상품 표시
// - 장바구니 추가, 위시리스트 토글
// - Quick View 오버레이
//
// 📦 구조:
// - Furry Ears: hover 시 나타나는 귀 장식
// - Main Card: 이미지 + 배지 + 위시리스트 버튼
// - CardContent: 카테고리, 이름, 가격, 장바구니 버튼
//
// 🎨 디자인:
// - 지뢰계(Jirai-kei) 감성 귀 장식
// - hover 시 scale + shadow 효과
// - Light/Dark 모드 분기 이미지
// - 꼬리 흔들기 애니메이션
//
// 🔧 주요 기능:
// - handleAddToCart: 장바구니 추가 + Toast 알림
// - handleToggleWishlist: 위시리스트 토글 + Toast 알림
// - discountPercent: 할인율 자동 계산
//
// 📝 의존성:
// - shadcn/ui: Card, Button
// - lucide-react: Heart 아이콘
// - cartStore, wishlistStore: 상태 관리
// - ToastContext: 알림 표시
// ====================================

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/contexts/ToastContext";
import type { Product } from "@/lib/types";

// ──────────────────────────────────────
// Props 타입 정의
// ──────────────────────────────────────

/**
 * ProductCard Props
 * @description 상품 카드에 필요한 데이터
 */
interface ProductCardProps {
  id: string;            // 상품 고유 ID
  name: string;          // 상품명
  price: number;         // 판매가
  originalPrice?: number; // 정가 (할인 표시용)
  imageUrl: string;      // 상품 이미지 URL
  category: string;      // 카테고리명
  isNew?: boolean;       // NEW 배지 표시
  isBest?: boolean;      // BEST 배지 표시
}

// ──────────────────────────────────────
// ProductCard 컴포넌트
// ──────────────────────────────────────

/**
 * 상품 카드 컴포넌트
 *
 * @description
 * 상품 목록 그리드에서 사용되는 카드 컴포넌트입니다.
 * - 상품 이미지, 이름, 가격 표시
 * - 장바구니/위시리스트 버튼
 * - hover 시 지뢰계 스타일 귀 장식
 *
 * @param props - ProductCardProps
 *
 * @example
 * <ProductCard
 *   id="prod-001"
 *   name="허니 바이브레이터"
 *   price={59000}
 *   originalPrice={79000}
 *   imageUrl="/products/honey.jpg"
 *   category="바이브레이터"
 *   isNew
 *   isBest
 * />
 */
export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  category,
  isNew,
  isBest,
}: ProductCardProps) {
  // ──────────────────────────────────────
  // Store 및 Context Hooks
  // ──────────────────────────────────────
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addToast } = useToast();

  // 현재 상품의 위시리스트 상태
  const wishlisted = isWishlisted(id);

  // ──────────────────────────────────────
  // 할인율 계산
  // - originalPrice가 있으면 할인율 계산
  // - 없으면 0%
  // ──────────────────────────────────────
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // ──────────────────────────────────────
  // 장바구니 추가 핸들러
  // - 이벤트 전파 방지 (Link 내부 클릭)
  // - Product 객체 생성 후 addItem 호출
  // - Toast 알림 + 장바구니 드로어 열기
  // ──────────────────────────────────────
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product: Product = { id, name, price, originalPrice, imageUrl, category, isNew, isBest };
    addItem(product);
    addToast(`${name}을(를) 장바구니에 담았어요!`, "success");
    openCart();
  };

  // ──────────────────────────────────────
  // 위시리스트 토글 핸들러
  // - 이벤트 전파 방지
  // - 현재 상태에 따라 추가/제거 메시지 분기
  // ──────────────────────────────────────
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product: Product = { id, name, price, originalPrice, imageUrl, category, isNew, isBest };
    toggleItem(product);
    addToast(
      wishlisted ? `${name}을(를) 찜 목록에서 제거했어요` : `${name}을(를) 찜했어요!`,
      wishlisted ? "info" : "success"
    );
  };

  return (
    <Card className="group relative overflow-visible rounded-[2rem] border-0 bg-transparent transition-all duration-500 hover:-translate-y-2">
      {/* ─────────────────────────────────────
          Furry Ears (지뢰계 귀 장식)
          - P1 최적화: hover 효과 단순화로 제거
          - 과도한 동시 애니메이션 방지
          ───────────────────────────────────── */}

      {/* ─────────────────────────────────────
          Main Card Content
          - 이미지 영역 + 배지 + 버튼
          - hover 시 shadow 강화
          ───────────────────────────────────── */}
      <div className="relative z-10 overflow-hidden rounded-[2rem] border border-primary/10 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(255,182,193,0.3)] dark:bg-card/80 dark:border-primary/30 dark:group-hover:shadow-[0_0_30px_rgba(255,105,180,0.2)]">
        <Link href={`/products/${id}`}>
          {/* ─────────────────────────────────────
              Image Area
              - 1:1 비율 (aspect-square)
              - Light/Dark 로고 분기
              ───────────────────────────────────── */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white via-primary/5 to-accent/5 dark:from-neutral-900 dark:via-primary/10 dark:to-neutral-800">
            {/* 상품 이미지 (현재는 로고로 대체) */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative w-full h-full">
                <Image
                  src="/tbr_logo.png"
                  alt={name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl dark:hidden"
                />
                <Image
                  src="/tbr_logo_dark.png"
                  alt={name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl hidden dark:block"
                />
              </div>
            </div>

            {/* Tail (꼬리 - hover 시 흔들림)
                - P1 최적화: hover 효과 단순화로 제거
                - 과도한 동시 애니메이션 방지
            */}

            {/* ─────────────────────────────────────
                Badges (NEW, BEST, 할인율)
                - 좌측 상단 세로 배치
                ───────────────────────────────────── */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {isNew && (
                <span className="rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-lg dark:bg-primary dark:text-black">
                  NEW
                </span>
              )}
              {isBest && (
                <span className="rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-foreground shadow-lg border border-primary/20 dark:bg-black/80 dark:text-primary dark:border-primary">
                  BEST
                </span>
              )}
              {discountPercent > 0 && (
                <span className="rounded-full bg-destructive/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* ─────────────────────────────────────
                Wishlist Button (하트)
                - 우측 상단
                - wishlisted 상태에 따라 스타일 변경
                ───────────────────────────────────── */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 z-10 hover:scale-110 ${wishlisted
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500 shadow-sm backdrop-blur-sm dark:bg-black/50 dark:text-white/70"
                }`}
              aria-label={wishlisted ? "찜 해제" : "찜하기"}
            >
              <Heart className={`h-4 w-4 transition-transform ${wishlisted ? "fill-current" : ""}`} />
            </button>

            {/* ─────────────────────────────────────
                Quick View Overlay
                - hover 시 표시
                - 클릭 시 상품 상세로 이동 (Link)
                ───────────────────────────────────── */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover:opacity-100">
              <Button
                variant="secondary"
                className="rounded-full bg-white text-black hover:bg-white/90 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              >
                Quick View
              </Button>
            </div>
          </div>
        </Link>

        {/* ─────────────────────────────────────
            Card Content (상품 정보)
            - 카테고리, 별점, 상품명, 가격, 장바구니 버튼
            ───────────────────────────────────── */}
        <CardContent className="p-5">
          {/* 카테고리 + 별점 */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {category}
            </p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-[10px] text-yellow-400">★</span>
              ))}
            </div>
          </div>

          {/* 상품명 */}
          <Link href={`/products/${id}`}>
            <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* 가격 + 장바구니 버튼 */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              {/* 판매가 */}
              <span className="text-xl font-black text-foreground dark:text-primary">
                {price.toLocaleString()}
              </span>
              {/* 정가 (할인 시) */}
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* 장바구니 추가 버튼 */}
            <Button
              size="icon"
              className="rounded-full w-10 h-10 shadow-md bg-foreground text-background hover:bg-primary hover:text-foreground transition-colors dark:bg-white dark:text-black dark:hover:bg-primary"
              onClick={handleAddToCart}
            >
              <span className="text-lg">+</span>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
