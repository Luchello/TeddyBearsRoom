/**
 * Product Card Component
 * TeddyBear's Room - Product Display Card
 */

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Badge, DiscountBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductCardData } from "@/types";

// Icons
const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

const CartPlusIcon = () => (
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
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    <path d="M9 9h6" />
    <path d="M12 6v6" />
  </svg>
);

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  onAddToCart?: (product: ProductCardData) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  showQuickActions?: boolean;
}

/**
 * Custom comparison function for React.memo
 * Re-render only when relevant props change
 */
function arePropsEqual(
  prevProps: ProductCardProps,
  nextProps: ProductCardProps
): boolean {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.compareAtPrice === nextProps.product.compareAtPrice &&
    prevProps.product.isNew === nextProps.product.isNew &&
    prevProps.product.isSoldOut === nextProps.product.isSoldOut &&
    prevProps.isWishlisted === nextProps.isWishlisted &&
    prevProps.showQuickActions === nextProps.showQuickActions &&
    prevProps.className === nextProps.className
  );
}

function ProductCardComponent({
  product,
  className,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  showQuickActions = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
      ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
      100
    )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product.id);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl bg-white/70 backdrop-blur-sm border border-transparent transition-all duration-300",
        "hover:shadow-[var(--shadow-dream)] hover:border-[var(--color-magic-200)] hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link
        href={`/products/${product.slug || product.id}`}
        className="relative aspect-square overflow-hidden rounded-t-2xl bg-muted"
      >
        {!imageError && product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={75}
            className={cn(
              "object-cover transition-transform duration-500",
              isHovered && "scale-105"
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="relative w-36 h-36">
              <Image
                src="/logo.png"
                alt="TeddyBear's Room"
                fill
                sizes="144px"
                quality={75}
                className="object-contain drop-shadow-md transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge variant="new">NEW</Badge>}
          {hasDiscount && <DiscountBadge discountPercent={discountPercent} />}
          {product.isSoldOut && <Badge variant="soldout">품절</Badge>}
        </div>

        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div
            className={cn(
              "absolute bottom-2 right-2 flex gap-2 transition-all duration-300",
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            )}
          >
            <Button
              variant="secondary"
              size="icon-sm"
              className="rounded-full shadow-md"
              onClick={handleToggleWishlist}
            >
              <HeartIcon filled={isWishlisted} />
              <span className="sr-only">위시리스트</span>
            </Button>
            {!product.isSoldOut && (
              <Button
                variant="secondary"
                size="icon-sm"
                className="rounded-full shadow-md"
                onClick={handleAddToCart}
              >
                <CartPlusIcon />
                <span className="sr-only">장바구니에 담기</span>
              </Button>
            )}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand */}
        {product.brand && (
          <span className="text-xs text-muted-foreground mb-1">
            {product.brand}
          </span>
        )}

        {/* Name */}
        <Link
          href={`/products/${product.slug || product.id}`}
          className="font-medium text-sm leading-snug line-clamp-2 hover:text-[var(--color-primary)] transition-colors"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Inner Circle Price */}
          {product.innerCirclePrice && (
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="innerCircle" className="text-[10px] px-1.5 py-0 bg-[var(--color-magic-100)] text-[var(--color-magic-600)]">
                이너 써클
              </Badge>
              <span className="text-sm font-medium text-[var(--color-magic-600)]">
                {formatPrice(product.innerCirclePrice)}
              </span>
            </div>
          )}
        </div>

        {/* Rating (optional) */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-yellow-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-xs text-muted-foreground">
              {product.rating.toFixed(1)}
              {product.reviewCount !== undefined && ` (${product.reviewCount})`}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Memoized ProductCard component
 * Re-renders only when relevant props change (see arePropsEqual)
 */
const ProductCard = React.memo(ProductCardComponent, arePropsEqual);

export { ProductCard };
export default ProductCard;
