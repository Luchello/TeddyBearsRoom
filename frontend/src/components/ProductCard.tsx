"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
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

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function formatKRW(value: number) {
  return value.toLocaleString();
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
  const hydrated = useHydrated();

  const { addItem, openCart } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addToast } = useToast();

  const wishlisted = hydrated ? isWishlisted(id) : false;
  const [added, setAdded] = useState(false);

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product: Product = {
      id,
      name,
      price,
      originalPrice,
      imageUrl,
      category,
      isNew,
      isBest,
    };
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    addToast(`${name}을(를) 장바구니에 담았어요!`, "success");
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product: Product = {
      id,
      name,
      price,
      originalPrice,
      imageUrl,
      category,
      isNew,
      isBest,
    };
    toggleItem(product);
    addToast(
      wishlisted ? `${name}을(를) 찜 목록에서 제거했어요` : `${name}을(를) 찜했어요!`,
      wishlisted ? "info" : "success"
    );
  };

  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-premium">
      <Link href={`/products/${id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/40">
          {/* Placeholder gradient under image */}
          <div className="absolute inset-0 media-gradient opacity-60" />

          <Image
            src={imageUrl || "/tbr_logo.png"}
            alt={name}
            fill
            className="object-contain p-8 sm:p-10 transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 80vw, 320px"
          />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {isNew ? (
              <span className="inline-flex h-6 items-center rounded-full bg-foreground px-3 text-[10px] font-semibold tracking-[0.16em] text-background">
                NEW
              </span>
            ) : null}
            {isBest ? (
              <span className="inline-flex h-6 items-center rounded-full bg-background/80 px-3 text-[10px] font-semibold tracking-[0.16em] text-foreground border border-border backdrop-blur">
                BEST
              </span>
            ) : null}
            {discountPercent > 0 ? (
              <span className="inline-flex h-6 items-center rounded-full bg-destructive px-3 text-[10px] font-semibold tracking-[0.1em] text-destructive-foreground">
                -{discountPercent}%
              </span>
            ) : null}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-all hover:bg-background"
            aria-label={wishlisted ? "찜 해제" : "찜하기"}
          >
            <Heart
              className={
                wishlisted
                  ? "h-4 w-4 text-[#E05252] fill-[#E05252]"
                  : "h-4 w-4 text-muted-foreground"
              }
            />
          </button>

          {/* Quick add (hover) */}
          <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <Button
              type="button"
              onClick={handleAddToCart}
              className="h-11 w-full rounded-full bg-accent text-accent-foreground hover:opacity-90"
            >
              {added ? "Added" : "Quick Add"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                {category}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground leading-snug line-clamp-2">
                {name}
              </h3>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-lg font-semibold text-foreground">
                ₩{formatKRW(price)}
              </p>
              {originalPrice ? (
                <p className="text-xs text-muted-foreground line-through">
                  ₩{formatKRW(originalPrice)}
                </p>
              ) : (
                <div className="h-[1rem]" />
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[#E8B4B8]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-xs text-muted-foreground">4.9</span>
            </div>

            <span className="text-xs text-muted-foreground">View details</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
