"use client";

// ====================================
// TeddyBear's Room - Product Filter Hook
// URL-based filtering and sorting logic
// ====================================

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { Product, SortOption } from "@/lib/types";

interface UseProductFilterReturn {
  category: string;
  sort: SortOption;
  showNew: boolean;
  showBest: boolean;
  setCategory: (category: string) => void;
  setSort: (sort: SortOption) => void;
  toggleNew: () => void;
  toggleBest: () => void;
  resetFilters: () => void;
  filterProducts: (products: Product[]) => Product[];
}

export function useProductFilter(): UseProductFilterReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read from URL
  const category = searchParams.get("category") || "전체";
  const sort = (searchParams.get("sort") as SortOption) || "latest";
  const showNew = searchParams.get("new") === "true";
  const showBest = searchParams.get("best") === "true";

  // Update URL helper
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "전체" || value === "latest") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Setters
  const setCategory = useCallback(
    (newCategory: string) => updateParams({ category: newCategory }),
    [updateParams]
  );

  const setSort = useCallback(
    (newSort: SortOption) => updateParams({ sort: newSort }),
    [updateParams]
  );

  const toggleNew = useCallback(
    () => updateParams({ new: showNew ? null : "true" }),
    [updateParams, showNew]
  );

  const toggleBest = useCallback(
    () => updateParams({ best: showBest ? null : "true" }),
    [updateParams, showBest]
  );

  const resetFilters = useCallback(
    () => router.push(pathname, { scroll: false }),
    [router, pathname]
  );

  // Filter & Sort logic
  const filterProducts = useMemo(
    () => (products: Product[]) => {
      let result = [...products];

      // Category filter
      if (category !== "전체") {
        result = result.filter((p) => p.category === category);
      }

      // New filter
      if (showNew) {
        result = result.filter((p) => p.isNew);
      }

      // Best filter
      if (showBest) {
        result = result.filter((p) => p.isBest);
      }

      // Sort
      switch (sort) {
        case "popular":
          // Prioritize best sellers
          result.sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0));
          break;
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "latest":
        default:
          // Keep original order (assumes data is sorted by latest)
          break;
      }

      return result;
    },
    [category, sort, showNew, showBest]
  );

  return {
    category,
    sort,
    showNew,
    showBest,
    setCategory,
    setSort,
    toggleNew,
    toggleBest,
    resetFilters,
    filterProducts,
  };
}
