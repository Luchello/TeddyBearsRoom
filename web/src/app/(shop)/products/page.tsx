/**
 * Products Page
 * TeddyBear's Room - Product Listing
 */

import { Suspense } from "react";
import { ProductGrid, ProductFilters, ProductFiltersSidebar } from "@/components/products";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import type { ProductCardData } from "@/types";

// Mock products - will be replaced with API call
const mockProducts: ProductCardData[] = [
  {
    id: "1",
    name: "프리미엄 실리콘 바이브레이터",
    slug: "premium-silicone-vibrator",
    price: 89000,
    compareAtPrice: 129000,
    imageUrl: "/images/products/product-1.jpg",
    imageAlt: "프리미엄 실리콘 바이브레이터",
    category: "바이브레이터",
    brand: "Brand A",
    isNew: true,
    isSale: true,
    isFeatured: true,
    isSoldOut: false,
    innerCirclePrice: 80100,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "커플용 리모트 바이브레이터",
    slug: "couple-remote-vibrator",
    price: 149000,
    compareAtPrice: null,
    imageUrl: "/images/products/product-2.jpg",
    imageAlt: "커플용 리모트 바이브레이터",
    category: "커플용",
    brand: "Brand B",
    isNew: false,
    isSale: false,
    isFeatured: false,
    isSoldOut: false,
    innerCirclePrice: 134100,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "미니 립스틱 바이브레이터",
    slug: "mini-lipstick-vibrator",
    price: 39000,
    compareAtPrice: 49000,
    imageUrl: "/images/products/product-3.jpg",
    imageAlt: "미니 립스틱 바이브레이터",
    category: "바이브레이터",
    brand: "Brand C",
    isNew: false,
    isSale: true,
    isFeatured: false,
    isSoldOut: false,
    innerCirclePrice: 35100,
    rating: 4.5,
    reviewCount: 256,
  },
  {
    id: "4",
    name: "워터베이스 러브젤 200ml",
    slug: "waterbased-lubricant-200ml",
    price: 19000,
    compareAtPrice: null,
    imageUrl: "/images/products/product-4.jpg",
    imageAlt: "워터베이스 러브젤",
    category: "러브젤",
    brand: "Brand D",
    isNew: false,
    isSale: false,
    isFeatured: false,
    isSoldOut: false,
    innerCirclePrice: 17100,
    rating: 4.9,
    reviewCount: 512,
  },
  {
    id: "5",
    name: "프리미엄 실리콘 딜도",
    slug: "premium-silicone-dildo",
    price: 79000,
    compareAtPrice: null,
    imageUrl: "/images/products/product-5.jpg",
    imageAlt: "프리미엄 실리콘 딜도",
    category: "딜도",
    brand: "Brand A",
    isNew: true,
    isSale: false,
    isFeatured: true,
    isSoldOut: false,
    innerCirclePrice: 71100,
    rating: 4.7,
    reviewCount: 78,
  },
  {
    id: "6",
    name: "석션 바이브레이터",
    slug: "suction-vibrator",
    price: 99000,
    compareAtPrice: 139000,
    imageUrl: "/images/products/product-6.jpg",
    imageAlt: "석션 바이브레이터",
    category: "바이브레이터",
    brand: "Brand B",
    isNew: false,
    isSale: true,
    isFeatured: false,
    isSoldOut: true,
    innerCirclePrice: 89100,
    rating: 4.9,
    reviewCount: 345,
  },
  {
    id: "7",
    name: "마사지 오일 세트",
    slug: "massage-oil-set",
    price: 35000,
    compareAtPrice: null,
    imageUrl: "/images/products/product-7.jpg",
    imageAlt: "마사지 오일 세트",
    category: "마사지",
    brand: "Brand E",
    isNew: false,
    isSale: false,
    isFeatured: false,
    isSoldOut: false,
    innerCirclePrice: 31500,
    rating: 4.4,
    reviewCount: 67,
  },
  {
    id: "8",
    name: "실리콘 콕링 세트",
    slug: "silicone-cockring-set",
    price: 29000,
    compareAtPrice: null,
    imageUrl: "/images/products/product-8.jpg",
    imageAlt: "실리콘 콕링 세트",
    category: "남성용",
    brand: "Brand C",
    isNew: false,
    isSale: false,
    isFeatured: false,
    isSoldOut: false,
    innerCirclePrice: 26100,
    rating: 4.3,
    reviewCount: 45,
  },
];

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function ProductsList() {
  // TODO: Replace with actual API call
  // const products = await fetchProducts(searchParams);
  const products = mockProducts;

  return (
    <ProductGrid
      products={products}
      columns={4}
      emptyMessage="조건에 맞는 상품이 없습니다."
    />
  );
}

export default function ProductsPage() {
  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">전체 상품</h1>
        <p className="text-muted-foreground">
          TeddyBear&apos;s Room의 모든 상품을 만나보세요
        </p>
      </div>

      {/* Filters Bar */}
      <ProductFilters totalCount={mockProducts.length} className="mb-6" />

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Sidebar Filters (Desktop) */}
        <ProductFiltersSidebar />

        {/* Products Grid */}
        <div className="flex-1">
          <Suspense fallback={<ProductsLoading />}>
            <ProductsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
