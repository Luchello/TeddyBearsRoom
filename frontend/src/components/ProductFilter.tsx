"use client";

// ====================================
// TeddyBear's Room - ProductFilter 컴포넌트
// 상품 목록 필터링 UI (카테고리, 정렬, 태그)
// ====================================
//
// 🎯 용도:
// - 카테고리별 상품 필터링 (전체, 바이브레이터 등)
// - NEW/BEST 태그 필터
// - 정렬 옵션 (최신순, 인기순, 가격순)
// - 총 상품 개수 표시
//
// 📦 구조:
// - Category Filters: 카테고리 버튼 그룹
// - Tag Filters: NEW/BEST 토글 버튼
// - Sort & Count: 정렬 드롭다운 + 상품 개수
//
// 🎨 디자인:
// - 둥근 버튼 (rounded-xl, rounded-full)
// - 선택 상태: primary 색상 + 다크모드 neon glow
// - 미선택 상태: outline/muted 스타일
//
// 🔧 주요 기능:
// - useProductFilter 훅으로 상태 관리
// - URL 쿼리 파라미터 동기화
// - 반응형 레이아웃 (flex-wrap)
//
// 📝 의존성:
// - shadcn/ui: Button
// - useProductFilter: 필터 상태 훅
// - lib/data: productCategories 목록
// - lib/types: SortOption 타입
// ====================================

import { Button } from "@/components/ui/button";
import { productCategories } from "@/lib/data";
import { useProductFilter } from "@/hooks/useProductFilter";
import type { SortOption } from "@/lib/types";

// ──────────────────────────────────────
// 정렬 옵션 상수
// ──────────────────────────────────────

/**
 * 정렬 옵션 목록
 * - latest: 최신순 (기본값)
 * - popular: 인기순
 * - price-low: 낮은 가격순
 * - price-high: 높은 가격순
 */
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "price-low", label: "낮은 가격순" },
  { value: "price-high", label: "높은 가격순" },
];

// ──────────────────────────────────────
// Props 타입 정의
// ──────────────────────────────────────

interface ProductFilterProps {
  /** 필터링된 총 상품 개수 */
  totalCount: number;
}

// ──────────────────────────────────────
// ProductFilter 컴포넌트
// ──────────────────────────────────────

/**
 * 상품 필터 컴포넌트
 *
 * @description
 * 상품 목록 페이지에서 필터링/정렬 UI를 제공합니다.
 * - 카테고리 버튼으로 상품 분류 필터링
 * - NEW/BEST 태그로 특별 상품 필터
 * - 정렬 드롭다운으로 순서 변경
 *
 * @param totalCount - 현재 필터 조건에 맞는 총 상품 수
 *
 * @example
 * <ProductFilter totalCount={filteredProducts.length} />
 */
export function ProductFilter({ totalCount }: ProductFilterProps) {
  const {
    category,
    sort,
    showNew,
    showBest,
    setCategory,
    setSort,
    toggleNew,
    toggleBest,
  } = useProductFilter();

  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────
          Category Filters
          - 카테고리별 필터 버튼 그룹
          - 선택된 카테고리: primary 색상
          ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {productCategories.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "default" : "outline"}
            onClick={() => setCategory(cat)}
            className={`rounded-xl ${
              category === cat
                ? "bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle"
                : "border-border hover:bg-muted"
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* ─────────────────────────────────────
          Tag Filters
          - NEW: 신상품 필터 (secondary 색상)
          - BEST: 인기 상품 필터 (accent 색상)
          ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={toggleNew}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            showNew
              ? "bg-secondary text-secondary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          ✨ NEW
        </button>
        <button
          onClick={toggleBest}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            showBest
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          🔥 BEST
        </button>
      </div>

      {/* ─────────────────────────────────────
          Sort & Count Section
          - 왼쪽: 총 상품 개수 표시
          - 오른쪽: 정렬 드롭다운 선택
          ───────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-muted-foreground">
          총{" "}
          <span className="font-medium text-foreground">{totalCount}</span>
          개의 상품
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-card"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
