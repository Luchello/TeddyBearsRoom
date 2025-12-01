"use client";

// ====================================
// TeddyBear's Room - Product Detail
// Dynamic product page with add to cart
// ====================================

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { allProducts } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/contexts/ToastContext";
import { ProductCard } from "@/components/ProductCard";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const product = allProducts.find((p) => p.id === id);
  const { addItem, openCart } = useCartStore();
  const { addToast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">😢</span>
        <h1 className="text-2xl font-bold mb-2">상품을 찾을 수 없어요</h1>
        <p className="text-muted-foreground mb-4">
          요청하신 상품이 존재하지 않거나 삭제되었어요.
        </p>
        <Button asChild className="rounded-xl">
          <Link href="/products">상품 목록으로</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    addToast(`${product.name}을(를) 장바구니에 담았어요!`, "success");
    openCart();
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Related products (same category, excluding current)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>상품 목록</span>
          </Link>
        </nav>

        {/* Product Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden dark:bg-black/40 dark:backdrop-blur-md dark:border dark:border-primary/50 dark:shadow-[0_0_30px_rgba(0,255,65,0.2)] relative">
              <div className="relative w-3/4 h-3/4 animate-float">
                <img
                  src="/tbr_logo.png"
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-xl dark:hidden"
                />
                <img
                  src="/tbr_logo_dark.png"
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-xl hidden dark:block"
                />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold shadow-sm">
                  NEW
                </span>
              )}
              {product.isBest && (
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                  BEST
                </span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                className="p-3 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors shadow-lg dark:bg-black/50 dark:hover:bg-black/70 dark:text-primary dark:border dark:border-primary/30"
                aria-label="찜하기"
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                className="p-3 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors shadow-lg dark:bg-black/50 dark:hover:bg-black/70 dark:text-primary dark:border dark:border-primary/30"
                aria-label="공유하기"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category */}
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm dark:bg-primary/20 dark:text-primary">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground lg:text-4xl dark:text-white dark:drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary dark:text-primary dark:drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]">
                {product.price.toLocaleString()}원
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString()}원
                </span>
              )}
            </div>

            {/* Description */}
            <Card className="rounded-2xl border-border bg-muted/30 dark:bg-black/40 dark:backdrop-blur-md dark:border-primary/30">
              <CardContent className="p-4">
                <p className="text-muted-foreground leading-relaxed dark:text-gray-300">
                  TeddyBear&apos;s Room에서 엄선한 프리미엄 상품입니다.
                  파스텔 감성과 함께 특별한 시간을 만들어보세요.
                  모든 상품은 프라이버시 포장으로 안전하게 배송됩니다.
                </p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-muted/50 dark:bg-black/40 dark:backdrop-blur-sm dark:border dark:border-primary/20">
                <span className="text-2xl">🚚</span>
                <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">무료배송</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50 dark:bg-black/40 dark:backdrop-blur-sm dark:border dark:border-primary/20">
                <span className="text-2xl">🔒</span>
                <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">프라이버시</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50 dark:bg-black/40 dark:backdrop-blur-sm dark:border dark:border-primary/20">
                <span className="text-2xl">💝</span>
                <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">포인트 적립</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 rounded-xl text-lg h-14 dark:bg-primary dark:text-black dark:hover:bg-primary/90 dark:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                장바구니 담기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl h-14 dark:border-primary/50 dark:text-primary dark:hover:bg-primary/10"
                onClick={handleAddToCart}
              >
                바로 구매
              </Button>
            </div>

            {/* Subscription Notice */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 dark:bg-black/60 dark:backdrop-blur-md dark:border-primary/40">
              <p className="text-sm dark:text-gray-300">
                <span className="font-bold text-primary dark:text-primary dark:drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]">🐻 구독자 혜택</span>
                <br />
                스탠다드 구독 시 5% 포인트 적립, 프리미엄 구독 시 10% 적립!
              </p>
              <Link
                href="/subscribe"
                className="text-sm text-primary hover:underline mt-2 inline-block dark:text-primary"
              >
                구독 혜택 자세히 보기 →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">함께 보면 좋은 상품</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
