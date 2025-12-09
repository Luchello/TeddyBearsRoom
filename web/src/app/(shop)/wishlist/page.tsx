/**
 * Wishlist Page
 * TeddyBear's Room - Saved Products
 */

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Mock wishlist data - Replace with API call
const mockWishlistItems = [
  {
    id: "1",
    name: "프리미엄 실리콘 토이",
    slug: "premium-silicone-toy",
    price: 89000,
    compareAtPrice: 120000,
    imageUrl: "/placeholder-product.jpg",
    isNewArrival: true,
    inStock: true,
  },
  {
    id: "2",
    name: "커플 바이브레이터",
    slug: "couple-vibrator",
    price: 159000,
    compareAtPrice: null,
    imageUrl: "/placeholder-product.jpg",
    isNewArrival: false,
    inStock: true,
  },
  {
    id: "3",
    name: "럭셔리 마사지 캔들",
    slug: "luxury-massage-candle",
    price: 45000,
    compareAtPrice: 55000,
    imageUrl: "/placeholder-product.jpg",
    isNewArrival: true,
    inStock: false,
  },
  {
    id: "4",
    name: "실크 아이마스크 세트",
    slug: "silk-eyemask-set",
    price: 38000,
    compareAtPrice: null,
    imageUrl: "/placeholder-product.jpg",
    isNewArrival: false,
    inStock: true,
  },
  {
    id: "5",
    name: "바디 페더",
    slug: "body-feather",
    price: 25000,
    compareAtPrice: null,
    imageUrl: "/placeholder-product.jpg",
    isNewArrival: false,
    inStock: true,
  },
];

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border bg-card overflow-hidden">
          <Skeleton className="aspect-square" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WishlistPage() {
  const { addSimpleItem } = useCartStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [items, setItems] = React.useState<typeof mockWishlistItems>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockWishlistItems);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    // TODO: Call API to remove from wishlist
  };

  const handleAddToCart = (item: (typeof mockWishlistItems)[0]) => {
    addSimpleItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    });
  };

  const handleAddAllToCart = () => {
    const availableItems = items.filter((item) => item.inStock);
    availableItems.forEach((item) => {
      addSimpleItem({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
      });
    });
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground transition-colors">
          마이페이지
        </Link>
        <span>/</span>
        <span className="text-foreground">위시리스트</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">위시리스트</h1>
          {!isLoading && items.length > 0 && (
            <p className="text-muted-foreground">
              {items.length}개의 상품이 저장되어 있습니다
            </p>
          )}
        </div>
        {!isLoading && items.length > 0 && (
          <Button onClick={handleAddAllToCart}>
            전체 장바구니 담기
          </Button>
        )}
      </div>

      {isLoading ? (
        <WishlistSkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground/50 mb-6"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">위시리스트가 비어 있어요</h2>
          <p className="text-muted-foreground mb-6">
            마음에 드는 상품을 하트 버튼을 눌러 저장해보세요
          </p>
          <Button asChild>
            <Link href="/products">쇼핑하러 가기</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const discountPercent = item.compareAtPrice
              ? Math.round((1 - item.price / item.compareAtPrice) * 100)
              : 0;

            return (
              <div
                key={item.id}
                className="group rounded-2xl border bg-card overflow-hidden"
              >
                {/* Image */}
                <Link href={`/products/${item.slug}`} className="block relative">
                  <div className="aspect-square relative bg-muted">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className={`object-cover ${
                        !item.inStock ? "opacity-50" : ""
                      }`}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {item.isNewArrival && (
                        <Badge className="bg-tbr-mint text-tbr-mint-foreground">
                          NEW
                        </Badge>
                      )}
                      {discountPercent > 0 && (
                        <Badge className="bg-tbr-pink text-tbr-pink-foreground">
                          {discountPercent}% OFF
                        </Badge>
                      )}
                      {!item.inStock && (
                        <Badge variant="secondary">품절</Badge>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(item.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-tbr-pink-foreground"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </button>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium hover:underline line-clamp-2 mb-2 block"
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-bold">
                      {item.price.toLocaleString()}원
                    </span>
                    {item.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {item.compareAtPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    disabled={!item.inStock}
                    onClick={() => handleAddToCart(item)}
                  >
                    {item.inStock ? "장바구니 담기" : "품절"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
