"use client";

// ====================================
// TeddyBear's Room - Wishlist Button
// Heart icon with count badge for header
// ====================================

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

export function WishlistButton() {
  const { items, toggleWishlist } = useWishlistStore();
  const itemCount = items.length;

  return (
    <button
      onClick={toggleWishlist}
      className="relative p-2 rounded-xl hover:bg-muted transition-colors group"
      aria-label={`찜 목록 (${itemCount}개)`}
    >
      <Heart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
