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
    <Card className="group relative overflow-visible rounded-[2rem] border-0 bg-transparent transition-all duration-500 hover:-translate-y-2">
      {/* Furry Ears (Hidden by default, pop up on hover) */}
      <div className="absolute -top-3 left-8 w-10 h-10 bg-primary/20 dark:bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-4 group-hover:rotate-[-15deg] z-0" />
      <div className="absolute -top-3 right-8 w-10 h-10 bg-primary/20 dark:bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-4 group-hover:rotate-[15deg] z-0" />

      {/* Main Card Content */}
      <div className="relative z-10 overflow-hidden rounded-[2rem] border border-primary/10 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(255,182,193,0.3)] dark:bg-card/80 dark:border-primary/30 dark:group-hover:shadow-[0_0_30px_rgba(255,105,180,0.2)]">
        <Link href={`/products/${id}`}>
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white via-primary/5 to-accent/5 dark:from-neutral-900 dark:via-primary/10 dark:to-neutral-800">
            {/* Placeholder for product image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl group-hover:scale-110 transition-transform duration-500 drop-shadow-xl filter grayscale-[0.2] group-hover:grayscale-0">🧸</span>
            </div>

            {/* Tail (Wags on hover) */}
            <div className="absolute bottom-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 origin-bottom-left group-hover:animate-tail-wag">
              ☁️
            </div>

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {isNew && (
                <span className="rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-lg dark:bg-primary dark:text-black">
                  NEW
                </span>
              )}
              {isBest && (
                <span className="rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-foreground shadow-lg border border-primary/20 dark:bg-black/80 dark:text-primary dark:border-primary">
                  BEST
                </span>
              )}
              {discountPercent > 0 && (
                <span className="rounded-full bg-destructive/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 z-10 hover:scale-110 ${wishlisted
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                  : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500 shadow-sm backdrop-blur-sm dark:bg-black/50 dark:text-white/70"
                }`}
              aria-label={wishlisted ? "찜 해제" : "찜하기"}
            >
              <Heart className={`h-4 w-4 transition-transform ${wishlisted ? "fill-current" : ""}`} />
            </button>

            {/* Quick view overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover:opacity-100">
              <Button
                variant="secondary"
                className="rounded-full bg-white text-black hover:bg-white/90 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              >
                Quick View
              </Button>
            </div>
          </div>
        </Link>

        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {category}
            </p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-[10px] text-yellow-400">★</span>
              ))}
            </div>
          </div>
          <Link href={`/products/${id}`}>
            <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-black text-foreground dark:text-primary">
                {price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <Button
              size="icon"
              className="rounded-full w-10 h-10 shadow-md bg-foreground text-background hover:bg-primary hover:text-foreground transition-colors dark:bg-white dark:text-black dark:hover:bg-primary"
              onClick={handleAddToCart}
            >
              <span className="text-lg">+</span>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
