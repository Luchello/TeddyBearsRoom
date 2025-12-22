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
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add to cart functionality
    void product.name; // Placeholder for cart integration
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-[var(--color-card)] rounded-3xl overflow-hidden border border-transparent hover:border-[var(--color-magic-200)] transition-all duration-500 hover:shadow-[var(--shadow-dream)] hover:-translate-y-2 backdrop-blur-sm"
    >
      {/* Image Area */}
      <div className="relative aspect-square bg-[var(--color-muted)] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badges.map((badge, idx) => (
            <Badge
              key={idx}
              className={cn(
                "text-xs font-bold px-2.5 py-1 shadow-md badge-cloud",
                badge === "NEW" && "text-[var(--color-secondary-foreground)] bg-[var(--color-secondary)]",
                badge === "BEST" && "text-[var(--color-primary-foreground)] bg-[var(--color-primary)]",
                badge.startsWith("-") && "text-[var(--color-destructive-foreground)] bg-[var(--color-destructive)]"
              )}
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
            "bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-110",
            isWishlisted ? "text-[var(--color-primary)]" : "text-gray-400 hover:text-[var(--color-primary)]"
          )}
        >
          <HeartIcon filled={isWishlisted} />
        </button>

        {/* Add to Cart + Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-[var(--gradient-magic)] text-white shadow-lg hover:shadow-xl hover:scale-110"
        >
          <PlusIcon />
        </button>

        {/* Quick View Button - appears on hover, positioned below logo */}
        <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Quick view modal
            }}
            className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg text-sm font-medium text-gray-800 flex items-center gap-2 hover:bg-white transition-colors"
          >
            <EyeIcon />
            Quick View
          </button>
        </div>

        {/* Product Image or Placeholder */}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-36 h-36 opacity-80">
              <Image
                src="/logo.png"
                alt="TeddyBear's Room"
                fill
                sizes="144px"
                className="object-contain drop-shadow-md"
                priority={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[var(--color-accent)]">★</span>
          <span className="text-sm font-medium text-[var(--color-foreground)]">{product.rating}</span>
          <span className="text-sm text-[var(--color-muted-foreground)]">({product.reviews})</span>
        </div>

        {/* Category */}
        <p className="text-xs text-[var(--color-muted-foreground)] mb-1 uppercase tracking-wider">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-[var(--color-foreground)] mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--color-foreground)]">
            ₩{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-[var(--color-muted-foreground)] line-through">
                ₩{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-[var(--color-destructive)]">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// Main Products Section Export
export function ProductsSection() {
  return (
    <section className="py-28 relative overflow-hidden bg-[var(--color-background)]">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-background)_0%,var(--color-dream-50)_100%)]" />

      {/* Decorative Elements */}
      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] bg-[var(--color-love-50)] rounded-full blur-[100px] opacity-40" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-[var(--color-magic-50)] rounded-full blur-[120px] opacity-30" />
      <span className="absolute top-[15%] left-[8%] text-4xl opacity-15">✧</span>
      <span className="absolute top-[25%] right-[12%] text-3xl opacity-10">♡</span>
      <span className="absolute bottom-[20%] right-[8%] text-3xl opacity-15">🎀</span>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full px-5 py-2 shadow-sm border bg-white/80 backdrop-blur-sm border-[var(--color-love-100)]">
            <span className="text-xl opacity-60">✧</span>
            <span className="text-2xl">🧸</span>
            <span className="text-xl opacity-60">✧</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)]">
            Curated Pleasure
          </h2>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            TeddyBear&apos;s Room의 신상품을 만나보세요
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:-translate-y-1 bg-[var(--gradient-magic)] text-white shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-xl"
          >
            View All Products
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
