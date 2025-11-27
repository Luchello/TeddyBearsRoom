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
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 dark:from-primary/10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl dark:neon-text">
            전체 상품
          </h1>
          <p className="mt-2 text-muted-foreground">
            TeddyBear&apos;s Room의 파스텔 감성 아이템들을 만나보세요
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
