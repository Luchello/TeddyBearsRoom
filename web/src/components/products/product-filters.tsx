/**
 * Product Filters Component
 * TeddyBear's Room - Product Filtering Sidebar/Sheet
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useFilterStore, SORT_OPTIONS } from "@/stores/filter-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// Icons
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const GridIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" x2="21" y1="6" y2="6" />
    <line x1="8" x2="21" y1="12" y2="12" />
    <line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" />
    <line x1="3" x2="3.01" y1="12" y2="12" />
    <line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);

// Mock categories - will be replaced with actual data
const categories = [
  { id: "vibrators", name: "바이브레이터" },
  { id: "dildos", name: "딜도" },
  { id: "couples", name: "커플 아이템" },
  { id: "wellness", name: "웰니스" },
  { id: "lubricants", name: "러브젤" },
  { id: "accessories", name: "액세서리" },
];

// Mock brands
const brands = [
  { id: "brand1", name: "브랜드 A" },
  { id: "brand2", name: "브랜드 B" },
  { id: "brand3", name: "브랜드 C" },
];

// Price ranges
const priceRanges = [
  { id: "under-30000", name: "3만원 이하", min: 0, max: 30000 },
  { id: "30000-50000", name: "3~5만원", min: 30000, max: 50000 },
  { id: "50000-100000", name: "5~10만원", min: 50000, max: 100000 },
  { id: "over-100000", name: "10만원 이상", min: 100000, max: Infinity },
];

interface ProductFiltersProps {
  className?: string;
  totalCount?: number;
}

export function ProductFilters({
  className,
  totalCount = 0,
}: ProductFiltersProps) {
  const {
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    selectedCategories,
    toggleCategory,
    selectedBrands,
    toggleBrand,
    priceRange,
    setPriceRange,
    clearAllFilters,
  } = useFilterStore();

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange !== null;

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">카테고리</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              label={category.name}
              checked={selectedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">가격대</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <Checkbox
              key={range.id}
              label={range.name}
              checked={
                priceRange?.min === range.min && priceRange?.max === range.max
              }
              onChange={() => {
                if (
                  priceRange?.min === range.min &&
                  priceRange?.max === range.max
                ) {
                  setPriceRange(null);
                } else {
                  setPriceRange({ min: range.min, max: range.max });
                }
              }}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">브랜드</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <Checkbox
              key={brand.id}
              label={brand.name}
              checked={selectedBrands.includes(brand.id)}
              onChange={() => toggleBrand(brand.id)}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            className="w-full"
            onClick={clearAllFilters}
          >
            필터 초기화
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Left: Filter Button (Mobile) + Count */}
      <div className="flex items-center gap-3">
        {/* Mobile Filter Sheet */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="sm" className="gap-2">
              <FilterIcon />
              필터
              {hasActiveFilters && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {selectedCategories.length +
                    selectedBrands.length +
                    (priceRange !== null ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>필터</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto max-h-[calc(100vh-180px)]">
              {filterContent}
            </div>
            <SheetFooter className="mt-4">
              <Button className="w-full">
                {totalCount}개 상품 보기
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Product Count */}
        <p className="text-sm text-muted-foreground">
          총 <span className="font-medium text-foreground">{totalCount}</span>개
        </p>
      </div>

      {/* Right: Sort + View Mode */}
      <div className="flex items-center gap-2">
        {/* Sort Select */}
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            className="rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <GridIcon />
            <span className="sr-only">그리드 보기</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            className="rounded-l-none"
            onClick={() => setViewMode("list")}
          >
            <ListIcon />
            <span className="sr-only">리스트 보기</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Desktop Sidebar version
export function ProductFiltersSidebar({ className }: { className?: string }) {
  const {
    selectedCategories,
    toggleCategory,
    selectedBrands,
    toggleBrand,
    priceRange,
    setPriceRange,
    clearAllFilters,
  } = useFilterStore();

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange !== null;

  return (
    <aside className={cn("hidden lg:block w-[240px] shrink-0", className)}>
      <div className="sticky top-24 space-y-6">
        <h2 className="font-bold text-lg">필터</h2>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3">카테고리</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                label={category.name}
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="font-semibold mb-3">가격대</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <Checkbox
                key={range.id}
                label={range.name}
                checked={
                  priceRange?.min === range.min && priceRange?.max === range.max
                }
                onChange={() => {
                  if (
                    priceRange?.min === range.min &&
                    priceRange?.max === range.max
                  ) {
                    setPriceRange(null);
                  } else {
                    setPriceRange({ min: range.min, max: range.max });
                  }
                }}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div>
          <h3 className="font-semibold mb-3">브랜드</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <Checkbox
                key={brand.id}
                label={brand.name}
                checked={selectedBrands.includes(brand.id)}
                onChange={() => toggleBrand(brand.id)}
              />
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <>
            <Separator />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => clearAllFilters()}
            >
              필터 초기화
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}

export default ProductFilters;
