"use client";

// ====================================
// TeddyBear's Room - Product Filter Hook
// URL 기반 상품 필터링/정렬 훅
// ====================================
//
// 🎯 용도:
// - 상품 목록의 필터/정렬 상태를 URL에 저장
// - 카테고리, 정렬, NEW/BEST 필터 관리
// - URL 공유 시 필터 상태 유지
//
// 🔗 URL 파라미터:
// - ?category=향수      → 카테고리 필터
// - ?sort=price-low    → 정렬 옵션
// - ?new=true          → 신상품만
// - ?best=true         → 베스트만
//
// 📦 반환값:
// - category, sort, showNew, showBest: 현재 필터 상태
// - setCategory, setSort, toggleNew, toggleBest: 필터 변경 함수
// - resetFilters: 필터 초기화
// - filterProducts: 상품 배열 필터/정렬 함수
//
// 🔧 동작 원리:
// 1. useSearchParams로 URL에서 필터 상태 읽기
// 2. 변경 시 router.push로 URL 업데이트 (scroll: false)
// 3. filterProducts 함수로 실제 필터링/정렬 수행
//
// 📝 사용 예시:
// ```tsx
// const { category, setCategory, filterProducts } = useProductFilter();
// const filteredProducts = filterProducts(allProducts);
// ```
// ====================================

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { Product, SortOption } from "@/lib/types";

// ──────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────

/**
 * useProductFilter 훅 반환 타입
 * @description 필터 상태(값) + 필터 변경(액션) + 필터 적용(함수)
 */
interface UseProductFilterReturn {
  // 현재 필터 상태 (URL에서 읽음)
  category: string;       // 선택된 카테고리 ("전체" 또는 카테고리명)
  sort: SortOption;       // 정렬 옵션 ("latest", "popular", "price-low", "price-high")
  showNew: boolean;       // 신상품만 표시 여부
  showBest: boolean;      // 베스트만 표시 여부

  // 필터 변경 액션 (URL 업데이트)
  setCategory: (category: string) => void;
  setSort: (sort: SortOption) => void;
  toggleNew: () => void;   // showNew 토글
  toggleBest: () => void;  // showBest 토글
  resetFilters: () => void; // 모든 필터 초기화

  // 상품 필터/정렬 적용 함수
  filterProducts: (products: Product[]) => Product[];
}

// ──────────────────────────────────────
// Hook 정의
// ──────────────────────────────────────

/**
 * 상품 필터 Custom Hook
 *
 * @description
 * URL 기반으로 상품 필터/정렬 상태를 관리합니다.
 * - 필터 상태가 URL에 저장되어 공유/북마크 가능
 * - 뒤로가기 시 이전 필터 상태 복원
 *
 * @returns UseProductFilterReturn - 필터 상태 및 액션
 *
 * @example
 * function ProductsPage() {
 *   const { category, sort, filterProducts, setCategory } = useProductFilter();
 *   const filteredProducts = filterProducts(allProducts);
 *
 *   return (
 *     <CategoryFilter selected={category} onChange={setCategory} />
 *     <ProductGrid products={filteredProducts} />
 *   );
 * }
 */
export function useProductFilter(): UseProductFilterReturn {
  // Next.js Navigation Hooks
  const searchParams = useSearchParams();  // URL 쿼리 파라미터 읽기
  const router = useRouter();              // URL 변경용
  const pathname = usePathname();          // 현재 경로 (쿼리 제외)

  // ──────────────────────────────────────
  // URL에서 필터 상태 읽기
  // - 없으면 기본값 사용
  // ──────────────────────────────────────
  const category = searchParams.get("category") || "전체";
  const sort = (searchParams.get("sort") as SortOption) || "latest";
  const showNew = searchParams.get("new") === "true";
  const showBest = searchParams.get("best") === "true";

  // ──────────────────────────────────────
  // URL 파라미터 업데이트 헬퍼
  // - 기본값이면 파라미터 삭제 (URL 깔끔하게)
  // - scroll: false로 스크롤 위치 유지
  // ──────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        // 기본값이면 URL에서 제거 (깔끔한 URL 유지)
        if (value === null || value === "" || value === "전체" || value === "latest") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      // scroll: false → 필터 변경 시 스크롤 위치 유지
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // ──────────────────────────────────────
  // 필터 변경 액션들
  // - useCallback으로 메모이제이션
  // ──────────────────────────────────────

  // 카테고리 변경
  const setCategory = useCallback(
    (newCategory: string) => updateParams({ category: newCategory }),
    [updateParams]
  );

  // 정렬 변경
  const setSort = useCallback(
    (newSort: SortOption) => updateParams({ sort: newSort }),
    [updateParams]
  );

  // NEW 필터 토글 (true ↔ null)
  const toggleNew = useCallback(
    () => updateParams({ new: showNew ? null : "true" }),
    [updateParams, showNew]
  );

  // BEST 필터 토글 (true ↔ null)
  const toggleBest = useCallback(
    () => updateParams({ best: showBest ? null : "true" }),
    [updateParams, showBest]
  );

  // 모든 필터 초기화 (쿼리 파라미터 없이 경로만)
  const resetFilters = useCallback(
    () => router.push(pathname, { scroll: false }),
    [router, pathname]
  );

  // ──────────────────────────────────────
  // 상품 필터/정렬 함수
  // - 현재 필터 상태 기반으로 상품 배열 변환
  // - useMemo로 메모이제이션 (필터 상태 변경 시만 재생성)
  // ──────────────────────────────────────
  const filterProducts = useMemo(
    () => (products: Product[]) => {
      let result = [...products]; // 원본 배열 복사

      // 1. 카테고리 필터 (전체가 아니면 필터링)
      if (category !== "전체") {
        result = result.filter((p) => p.category === category);
      }

      // 2. NEW 필터 (신상품만)
      if (showNew) {
        result = result.filter((p) => p.isNew);
      }

      // 3. BEST 필터 (베스트만)
      if (showBest) {
        result = result.filter((p) => p.isBest);
      }

      // 4. 정렬
      switch (sort) {
        case "popular":
          // 인기순: 베스트 상품을 앞으로
          result.sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0));
          break;
        case "price-low":
          // 가격 낮은순
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          // 가격 높은순
          result.sort((a, b) => b.price - a.price);
          break;
        case "latest":
        default:
          // 최신순: 원본 순서 유지 (데이터가 이미 최신순 정렬 가정)
          break;
      }

      return result;
    },
    [category, sort, showNew, showBest] // 필터 상태가 변경되면 함수 재생성
  );

  // ──────────────────────────────────────
  // 반환값
  // ──────────────────────────────────────
  return {
    // 현재 상태
    category,
    sort,
    showNew,
    showBest,
    // 변경 액션
    setCategory,
    setSort,
    toggleNew,
    toggleBest,
    resetFilters,
    // 필터 적용 함수
    filterProducts,
  };
}
