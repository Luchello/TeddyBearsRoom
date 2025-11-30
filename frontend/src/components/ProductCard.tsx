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
    <Card className="group overflow-hidden rounded-3xl border-2 border-primary/20 bg-card transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,182,193,0.25)] hover:-translate-y-2 hover:border-primary/40 dark:neon-card dark:hover:border-primary/50 dark:hover:shadow-[0_0_40px_rgba(0,255,136,0.15)]">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl group-hover:animate-wiggle transition-transform drop-shadow-lg">🧸</span>
          </div>

          {/* Cute decorative elements */}
          <div className="absolute bottom-2 right-2 text-2xl opacity-30 group-hover:opacity-60 transition-opacity">✨</div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {isNew && (
              <span className="rounded-full bg-gradient-to-r from-secondary to-primary px-3 py-1 text-xs font-bold text-white shadow-lg animate-pulse dark:shadow-[0_0_15px_var(--secondary)]">
                ✨ NEW
              </span>
            )}
            {isBest && (
              <span className="rounded-full bg-gradient-to-r from-accent to-primary px-3 py-1 text-xs font-bold text-white shadow-lg dark:bg-accent/80">
                🏆 BEST
              </span>
            )}
            {discountPercent > 0 && (
              <span className="rounded-full bg-gradient-to-r from-destructive to-red-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
                💕 {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-10 shadow-lg hover:scale-110 ${
              wishlisted
                ? "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-[0_4px_15px_rgba(239,68,68,0.4)]"
                : "bg-white/90 text-muted-foreground hover:bg-white hover:text-red-500 dark:bg-card/90 dark:hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            }`}
            aria-label={wishlisted ? "찜 해제" : "찜하기"}
          >
            <Heart className={`h-4 w-4 transition-transform ${wishlisted ? "fill-current scale-110" : "group-hover:scale-110"}`} />
          </button>

          {/* Quick view overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              variant="secondary"
              className="rounded-2xl bg-white/95 text-foreground hover:bg-white shadow-xl dark:bg-card/95 dark:text-foreground dark:hover:bg-card"
            >
              👀 자세히 보기
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground dark:text-secondary/70 flex items-center gap-1">
          <span>📁</span> {category}
        </p>
        <Link href={`/products/${id}`}>
          <h3 className="mt-1 font-bold text-foreground line-clamp-2 hover:text-primary transition-colors dark:hover:neon-text">
            {name}
          </h3>
        </Link>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-primary dark:neon-text">
            💰 {price.toLocaleString()}원
          </span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="rounded-2xl shadow-lg"
          onClick={handleAddToCart}
        >
          🛒 담기
        </Button>
      </CardFooter>
    </Card>
  );
}
