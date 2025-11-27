"use client";

// ====================================
// TeddyBear's Room - Product Filter
// Category, sort, and tag filter UI
// ====================================

import { Button } from "@/components/ui/button";
import { productCategories } from "@/lib/data";
import { useProductFilter } from "@/hooks/useProductFilter";
import type { SortOption } from "@/lib/types";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "price-low", label: "낮은 가격순" },
  { value: "price-high", label: "높은 가격순" },
];

interface ProductFilterProps {
  totalCount: number;
}

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
      {/* Category Filters */}
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

      {/* Tag Filters */}
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

      {/* Sort & Count */}
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
