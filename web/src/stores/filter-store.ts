/**
 * Filter Store - Zustand
 * Product Filtering State for TeddyBear's Room
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductSortBy, PriceRange } from "@/types";

// Sort options
export type SortOption = {
  value: string;
  label: string;
  sortBy: ProductSortBy;
  sortOrder: "asc" | "desc";
};

export const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "최신순", sortBy: "createdAt", sortOrder: "desc" },
  { value: "oldest", label: "오래된순", sortBy: "createdAt", sortOrder: "asc" },
  { value: "price-low", label: "낮은 가격순", sortBy: "price", sortOrder: "asc" },
  { value: "price-high", label: "높은 가격순", sortBy: "price", sortOrder: "desc" },
  { value: "name-asc", label: "이름순 (ㄱ-ㅎ)", sortBy: "name", sortOrder: "asc" },
  { value: "name-desc", label: "이름순 (ㅎ-ㄱ)", sortBy: "name", sortOrder: "desc" },
];

// View modes
export type ViewMode = "grid" | "list";

interface FilterState {
  // Category & Brand
  selectedCategories: string[];
  selectedBrands: string[];
  setSelectedCategories: (categories: string[]) => void;
  setSelectedBrands: (brands: string[]) => void;
  toggleCategory: (categoryId: string) => void;
  toggleBrand: (brandId: string) => void;

  // Price Range
  priceRange: PriceRange | null;
  setPriceRange: (range: PriceRange | null) => void;

  // Tags
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Sorting
  sortOption: string;
  setSortOption: (option: string) => void;
  getSortParams: () => { sortBy: ProductSortBy; sortOrder: "asc" | "desc" };

  // View Mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Availability
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;

  // Special Filters
  onSaleOnly: boolean;
  setOnSaleOnly: (value: boolean) => void;
  featuredOnly: boolean;
  setFeaturedOnly: (value: boolean) => void;

  // Actions
  clearAllFilters: () => void;
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

const FILTER_STORAGE_KEY = "tbr-filters";
const FILTER_VERSION = 1;

const initialState = {
  selectedCategories: [],
  selectedBrands: [],
  priceRange: null,
  selectedTags: [],
  searchQuery: "",
  sortOption: "newest",
  viewMode: "grid" as ViewMode,
  inStockOnly: false,
  onSaleOnly: false,
  featuredOnly: false,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Category & Brand
      setSelectedCategories: (categories) =>
        set({ selectedCategories: categories }),
      setSelectedBrands: (brands) => set({ selectedBrands: brands }),
      toggleCategory: (categoryId) =>
        set((state) => ({
          selectedCategories: state.selectedCategories.includes(categoryId)
            ? state.selectedCategories.filter((id) => id !== categoryId)
            : [...state.selectedCategories, categoryId],
        })),
      toggleBrand: (brandId) =>
        set((state) => ({
          selectedBrands: state.selectedBrands.includes(brandId)
            ? state.selectedBrands.filter((id) => id !== brandId)
            : [...state.selectedBrands, brandId],
        })),

      // Price Range
      setPriceRange: (range) => set({ priceRange: range }),

      // Tags
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),

      // Search
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Sorting
      setSortOption: (option) => set({ sortOption: option }),
      getSortParams: () => {
        const option = SORT_OPTIONS.find((o) => o.value === get().sortOption);
        return option
          ? { sortBy: option.sortBy, sortOrder: option.sortOrder }
          : { sortBy: "createdAt" as ProductSortBy, sortOrder: "desc" as const };
      },

      // View Mode
      setViewMode: (mode) => set({ viewMode: mode }),

      // Availability
      setInStockOnly: (value) => set({ inStockOnly: value }),

      // Special Filters
      setOnSaleOnly: (value) => set({ onSaleOnly: value }),
      setFeaturedOnly: (value) => set({ featuredOnly: value }),

      // Actions
      clearAllFilters: () =>
        set({
          selectedCategories: [],
          selectedBrands: [],
          priceRange: null,
          selectedTags: [],
          searchQuery: "",
          inStockOnly: false,
          onSaleOnly: false,
          featuredOnly: false,
        }),

      hasActiveFilters: () => {
        const state = get();
        return (
          state.selectedCategories.length > 0 ||
          state.selectedBrands.length > 0 ||
          state.priceRange !== null ||
          state.selectedTags.length > 0 ||
          state.searchQuery !== "" ||
          state.inStockOnly ||
          state.onSaleOnly ||
          state.featuredOnly
        );
      },

      getActiveFilterCount: () => {
        const state = get();
        let count = 0;
        count += state.selectedCategories.length;
        count += state.selectedBrands.length;
        count += state.selectedTags.length;
        if (state.priceRange) count += 1;
        if (state.searchQuery) count += 1;
        if (state.inStockOnly) count += 1;
        if (state.onSaleOnly) count += 1;
        if (state.featuredOnly) count += 1;
        return count;
      },
    }),
    {
      name: FILTER_STORAGE_KEY,
      version: FILTER_VERSION,
      storage: createJSONStorage(() => sessionStorage), // Use session storage for filters
      partialize: (state) => ({
        sortOption: state.sortOption,
        viewMode: state.viewMode,
      }),
    }
  )
);

// Note: Selector hooks removed as unused. Use useFilterStore directly.
// If needed in future, recreate with: useFilterStore((state) => ({ ... }))
