/**
 * Product Detail Page
 * TeddyBear's Room - Single Product View
 */

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductDetail as ProductDetailType } from "@/types";

// Mock product data - Replace with API call
const mockProduct: ProductDetailType = {
  id: "1",
  name: "프리미엄 실리콘 토이",
  slug: "premium-silicone-toy",
  description: "의료용 실리콘으로 제작된 프리미엄 제품입니다. 부드럽고 안전한 소재로 편안한 사용감을 제공합니다.",
  shortDescription: "부드럽고 안전한 프리미엄 실리콘",
  price: 89000,
  compareAtPrice: 120000,
  sku: "TBR-PST-001",
  barcode: null,
  inventory: 50,
  isActive: true,
  isFeatured: true,
  isNewArrival: true,
  categoryId: "1",
  brandId: "1",
  images: [
    { id: "1", url: "/placeholder-product.jpg", alt: "프리미엄 실리콘 토이", position: 0, productId: "1" },
    { id: "2", url: "/placeholder-product-2.jpg", alt: "프리미엄 실리콘 토이 상세", position: 1, productId: "1" },
    { id: "3", url: "/placeholder-product-3.jpg", alt: "프리미엄 실리콘 토이 패키지", position: 2, productId: "1" },
  ],
  variants: [
    { id: "v1", productId: "1", name: "스몰", sku: "TBR-PST-001-S", price: 89000, inventory: 20, position: 0, options: { size: "S" } },
    { id: "v2", productId: "1", name: "미디엄", sku: "TBR-PST-001-M", price: 99000, inventory: 30, position: 1, options: { size: "M" } },
    { id: "v3", productId: "1", name: "라지", sku: "TBR-PST-001-L", price: 109000, inventory: 0, position: 2, options: { size: "L" } },
  ],
  category: { id: "1", name: "토이", slug: "toys", description: "", parentId: null, position: 0, isActive: true },
  brand: { id: "1", name: "TBR Premium", slug: "tbr-premium", description: "", logoUrl: null, isActive: true },
  sizeRecommendations: [],
  reviews: [],
  averageRating: 4.5,
  reviewCount: 128,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function ProductDetailSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addSimpleItem } = useCartStore();
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [product, setProduct] = React.useState<ProductDetailType | null>(null);

  // Simulate API call
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProduct(mockProduct);
      if (mockProduct.variants.length > 0) {
        const availableVariant = mockProduct.variants.find((v) => v.inventory > 0);
        if (availableVariant) {
          setSelectedVariant(availableVariant.id);
        }
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [params.slug]);

  if (isLoading || !product) {
    return <ProductDetailSkeleton />;
  }

  const currentVariant = product.variants.find((v) => v.id === selectedVariant);
  const currentPrice = currentVariant?.price ?? product.price;
  const isOutOfStock = currentVariant ? currentVariant.inventory === 0 : product.inventory === 0;
  const discountPercent = product.compareAtPrice
    ? Math.round((1 - currentPrice / product.compareAtPrice) * 100)
    : 0;
  const innerCirclePrice = Math.round(currentPrice * 0.9);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addSimpleItem({
      productId: product.id,
      variantId: selectedVariant ?? undefined,
      name: product.name,
      variantName: currentVariant?.name,
      price: currentPrice,
      quantity,
      imageUrl: product.images[0]?.url ?? "/placeholder-product.jpg",
    });
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          홈
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">
          전체 상품
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <Image
              src={product.images[selectedImage]?.url ?? "/placeholder-product.jpg"}
              alt={product.images[selectedImage]?.alt ?? product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isNewArrival && (
              <Badge className="absolute top-4 left-4 bg-tbr-mint text-tbr-mint-foreground">
                NEW
              </Badge>
            )}
            {discountPercent > 0 && (
              <Badge className="absolute top-4 right-4 bg-tbr-pink text-tbr-pink-foreground">
                {discountPercent}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt ?? ""}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Name */}
          <div>
            {product.brand && (
              <Link
                href={`/brands/${product.brand.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {product.brand.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= Math.round(product.averageRating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={`w-4 h-4 ${
                    star <= Math.round(product.averageRating)
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium">{product.averageRating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount}개 리뷰)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {currentPrice.toLocaleString()}원
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.compareAtPrice.toLocaleString()}원
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="border-tbr-lavender text-tbr-lavender-foreground bg-tbr-lavender/20">
                이너 써클
              </Badge>
              <span className="text-tbr-lavender-foreground font-medium">
                {innerCirclePrice.toLocaleString()}원
              </span>
              <span className="text-muted-foreground">(10% 추가 할인)</span>
            </div>
          </div>

          <Separator />

          {/* Short Description */}
          <p className="text-muted-foreground">{product.shortDescription}</p>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">사이즈</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    disabled={variant.inventory === 0}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedVariant === variant.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : variant.inventory === 0
                        ? "border-muted bg-muted text-muted-foreground cursor-not-allowed"
                        : "border-input hover:border-primary"
                    }`}
                  >
                    {variant.name}
                    {variant.inventory === 0 && " (품절)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <label className="text-sm font-medium">수량</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="px-4 py-2 min-w-[48px] text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                총 {(currentPrice * quantity).toLocaleString()}원
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "품절" : "장바구니 담기"}
            </Button>
            <Button size="lg" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </Button>
          </div>

          {/* Benefits */}
          <div className="rounded-xl border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
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
                className="text-tbr-mint-foreground"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              <span>3만원 이상 무료배송 (이너 써클 회원)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
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
                className="text-tbr-mint-foreground"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <span>비밀 포장으로 안전하게 배송</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
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
                className="text-tbr-mint-foreground"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                <path d="M12 3v6" />
              </svg>
              <span>미개봉 상품 7일 이내 반품 가능</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              상품 설명
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              리뷰 ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              배송/교환/반품
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="py-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>{product.description}</p>
              {/* Add more detailed product description here */}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="py-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>아직 작성된 리뷰가 없습니다.</p>
              <p className="text-sm mt-1">첫 리뷰를 작성해주세요!</p>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="py-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">배송 안내</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 비밀 포장으로 상품명 노출 없이 안전하게 배송됩니다.</li>
                  <li>• 평일 오후 2시 이전 주문 시 당일 출고됩니다.</li>
                  <li>• 배송비: 3,000원 (3만원 이상 무료, 이너 써클 회원 3만원 이상 무료)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">교환/반품 안내</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 미개봉 상품에 한해 수령 후 7일 이내 반품 가능합니다.</li>
                  <li>• 위생 상품 특성상 개봉 후에는 교환/반품이 불가합니다.</li>
                  <li>• 단순 변심에 의한 반품 시 왕복 배송비는 고객 부담입니다.</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
