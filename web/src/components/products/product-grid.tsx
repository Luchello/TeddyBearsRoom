/**
 * Product Grid Component
 * TeddyBear's Room - Product Listing Grid
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import type { ProductCardData } from "@/types";

interface ProductGridProps {
  products: ProductCardData[];
  className?: string;
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
  skeletonCount?: number;
  onAddToCart?: (product: ProductCardData) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistedIds?: string[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  className,
  columns = 4,
  isLoading = false,
  skeletonCount = 8,
  onAddToCart,
  onToggleWishlist,
  wishlistedIds = [],
  emptyMessage = "상품이 없습니다.",
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (isLoading) {
    return (
      <div className={cn("grid gap-4 md:gap-6", gridCols[columns], className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/50 mb-4"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:gap-6", gridCols[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlistedIds.includes(product.id)}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
