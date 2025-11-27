"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/contexts/ToastContext";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  isNew?: boolean;
  isBest?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  category,
  isNew,
  isBest,
}: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addToast } = useToast();
  const wishlisted = isWishlisted(id);

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product: Product = { id, name, price, originalPrice, imageUrl, category, isNew, isBest };
    addItem(product);
    addToast(`${name}을(를) 장바구니에 담았어요!`, "success");
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product: Product = { id, name, price, originalPrice, imageUrl, category, isNew, isBest };
    toggleItem(product);
    addToast(
      wishlisted ? `${name}을(를) 찜 목록에서 제거했어요` : `${name}을(를) 찜했어요!`,
      wishlisted ? "info" : "success"
    );
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:neon-card dark:hover:border-primary/50">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted dark:bg-muted/50">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
            <span className="text-6xl group-hover:animate-wiggle transition-transform">🧸</span>
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {isNew && (
              <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground dark:neon-glow-subtle dark:shadow-[0_0_10px_var(--secondary)]">
                NEW
              </span>
            )}
            {isBest && (
              <span className="rounded-lg bg-accent px-2 py-1 text-xs font-medium text-accent-foreground dark:bg-accent/80">
                BEST
              </span>
            )}
            {discountPercent > 0 && (
              <span className="rounded-lg bg-destructive px-2 py-1 text-xs font-medium text-white">
                {discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
              wishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500 dark:bg-card/80"
            }`}
            aria-label={wishlisted ? "찜 해제" : "찜하기"}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100 dark:group-hover:bg-black/40">
            <Button
              variant="secondary"
              className="rounded-xl bg-white/90 text-foreground hover:bg-white dark:bg-card/90 dark:text-foreground dark:hover:bg-card dark:neon-glow-subtle"
            >
              자세히 보기
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground dark:text-secondary/70">{category}</p>
        <Link href={`/products/${id}`}>
          <h3 className="mt-1 font-medium text-foreground line-clamp-2 hover:text-primary transition-colors dark:hover:neon-text">
            {name}
          </h3>
        </Link>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary dark:neon-text">
            {price.toLocaleString()}원
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle dark:hover:neon-glow"
          onClick={handleAddToCart}
        >
          담기
        </Button>
      </CardFooter>
    </Card>
  );
}
