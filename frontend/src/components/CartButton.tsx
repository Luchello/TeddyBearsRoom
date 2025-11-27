"use client";

// ====================================
// TeddyBear's Room - Cart Button
// Header cart icon with item count
// ====================================

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function CartButton() {
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 rounded-xl hover:bg-accent transition-colors"
      aria-label={`장바구니 (${totalItems}개)`}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-in zoom-in duration-200">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
