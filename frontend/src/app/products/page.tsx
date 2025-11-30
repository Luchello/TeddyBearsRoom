"use client";

// ====================================
// TeddyBear's Room - Products Page
// Product listing with filter and sort
// ====================================

import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilter } from "@/components/ProductFilter";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { allProducts } from "@/lib/data";
import { useProductFilter } from "@/hooks/useProductFilter";

function ProductGrid() {
  const { filterProducts } = useProductFilter();
  const filteredProducts = filterProducts(allProducts);

  if (filteredProducts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
        <span className="text-6xl mb-4">🧸</span>
        <p className="text-lg font-medium">조건에 맞는 상품이 없어요</p>
        <p className="text-sm mt-1">다른 필터를 선택해보세요</p>
      </div>
    );
  }

  return (
    <>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </>
  );
}

function ProductGridSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

function FilteredProductsContent() {
  const { filterProducts } = useProductFilter();
  const filteredProducts = filterProducts(allProducts);

  return (
    <>
      {/* Filters */}
      <div className="mb-8">
        <ProductFilter totalCount={filteredProducts.length} />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero - 지뢰계 스타일 ♡ */}
      <section className="bg-gradient-to-b from-primary/10 via-secondary/5 to-background py-12 dark:from-primary/15 dark:via-secondary/5 relative overflow-hidden">
        {/* 지뢰계 floating decorations ♡✧🎀 */}
        <div className="absolute top-8 left-8 text-3xl opacity-20 animate-sparkle-twinkle pointer-events-none">✧</div>
        <div className="absolute top-12 right-12 text-2xl opacity-15 animate-heart-beat pointer-events-none">♡</div>
        <div className="absolute bottom-8 right-1/4 text-xl opacity-15 animate-ribbon-flutter pointer-events-none">🎀</div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl animate-soft-float">🎀</span>
            <h1 className="text-3xl font-bold text-foreground lg:text-4xl dark:text-transparent dark:bg-gradient-to-r dark:from-[#FF69B4] dark:to-[#9D4EDD] dark:bg-clip-text">
              전체 상품
            </h1>
            <span className="text-2xl animate-sparkle-twinkle">✧</span>
          </div>
          <p className="mt-2 text-muted-foreground">
            TeddyBear&apos;s Room의 지뢰계 감성 아이템들을 만나보세요 ♡
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Suspense fallback={<ProductGridSkeleton />}>
            <FilteredProductsContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
