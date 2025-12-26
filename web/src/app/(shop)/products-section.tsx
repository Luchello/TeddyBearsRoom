/**
 * Products Section - Client Component
 * Product cards with Quick View, Wishlist, and Add to Cart buttons
 * Whimsyshire Theme
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock products data
const products = [
  {
    id: "1",
    name: "파자마 컬렉션",
    category: "토이",
    price: 29000,
    originalPrice: 36000,
    rating: 5,
    reviews: 128,
    badges: ["NEW", "BEST", "-20%"],
    image: null,
  },
  {
    id: "2",
    name: "코지 나이트",
    category: "무드",
    price: 45000,
    rating: 5,
    reviews: 89,
    badges: ["NEW"],
    image: null,
  },
  {
    id: "3",
    name: "실크 터치",
    category: "케어",
    price: 32000,
    originalPrice: 38000,
    rating: 5,
    reviews: 256,
    badges: ["BEST", "-16%"],
    image: null,
  },
  {
    id: "4",
    name: "베어 허그",
    category: "라이프",
    price: 55000,
    rating: 5,
    reviews: 64,
    badges: [],
    image: null,
  },
];

import { useUIStore, useCartStore } from "@/stores";

// Product Card Component
interface ProductCardProps {
  product: typeof products[0];
}

// Icons
const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isDiscreetMode, openModal } = useUIStore();
  const { addSimpleItem } = useCartStore();

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addSimpleItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      imageUrl: product.image || "/logo.png",
    });
  };

  return (
    <div
      onClick={() => { }} // TODO: Navigate or open detail
      className="group card-premium block overflow-hidden cursor-pointer"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/5] bg-muted overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badges.map((badge, idx) => (
            <Badge
              key={idx}
              variant={badge === "NEW" ? "new" : badge === "BEST" ? "sale" : "default"}
              className="shadow-sm"
            >
              {badge}
            </Badge>
          ))}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
            "bg-background/80 backdrop-blur-sm shadow-md hover:scale-110",
            isWishlisted ? "text-primary fill-primary" : "text-foreground/40"
          )}
        >
          <HeartIcon filled={isWishlisted} />
        </button>

        {/* Product Image or Placeholder */}
        <div className={cn("absolute inset-0 transition-all duration-700", isDiscreetMode && "blur-private")}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-silk-texture silk-texture">
              <div className="relative w-32 h-32 opacity-20 saturate-0">
                <Image
                  src="/logo.png"
                  alt="TeddyBear's Room"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick View Button Overlay */}
        <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="default"
            size="sm"
            className="rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            onClick={(e) => {
              e.stopPropagation();
              openModal("product-quick-view", { product });
            }}
          >
            <EyeIcon />
            Quick View
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              {product.category}
            </p>
            <h3 className={cn(
              "font-medium text-foreground transition-colors line-clamp-1 text-lg",
              isDiscreetMode && "blur-[4px] select-none"
            )}>
              {isDiscreetMode ? "Premium Product" : product.name}
            </h3>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-lg hover:bg-foreground hover:text-background transition-colors"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">
              ₩{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through opacity-60">
                ₩{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-60">
            <span className="text-xs font-bold">★</span>
            <span className="text-xs">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Products Section Export
export function ProductsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-[var(--color-background)]">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-6 animate-reveal">
          <Badge variant="outline" className="px-6 py-2 border-primary/20 text-primary font-bold tracking-widest uppercase">
            Curated Pleasure
          </Badge>
          <h2 className="text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
            Selected for <span className="text-premium font-serif italic">You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            TeddyBear&quot;s Room의 정체성을 담은 감각적인 콜렉션.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="xl"
            className="rounded-full px-12 border-primary/10 hover:border-primary group"
            asChild
          >
            <Link href="/products" className="flex items-center gap-3">
              View All Collection
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
