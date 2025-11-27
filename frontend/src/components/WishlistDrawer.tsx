"use client";

// ====================================
// TeddyBear's Room - Wishlist Drawer
// Slide-out wishlist panel
// ====================================

import { useEffect } from "react";
import Link from "next/link";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/contexts/ToastContext";

export function WishlistDrawer() {
  const {
    items,
    isOpen,
    closeWishlist,
    removeItem,
    clearWishlist,
  } = useWishlistStore();
  const { addItem: addToCart, openCart } = useCartStore();
  const { addToast } = useToast();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeWishlist();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeWishlist]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleAddToCart = (product: typeof items[0]["product"]) => {
    addToCart(product);
    addToast(`${product.name}을(를) 장바구니에 담았어요!`, "success");
    closeWishlist();
    openCart();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="찜 목록"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>💝</span> 찜 목록
          </h2>
          <button
            onClick={closeWishlist}
            className="p-2 rounded-xl hover:bg-accent transition-colors"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-140px)] overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <span className="text-6xl mb-4">💝</span>
              <p>찜한 상품이 없어요</p>
              <Button asChild variant="outline" className="mt-4 rounded-xl">
                <Link href="/products" onClick={closeWishlist}>
                  상품 둘러보기
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-xl bg-muted/50"
                >
                  {/* Product Image Placeholder */}
                  <Link
                    href={`/products/${item.product.id}`}
                    onClick={closeWishlist}
                    className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-3xl">🧸</span>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.id}`}
                      onClick={closeWishlist}
                    >
                      <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-primary font-bold mt-1">
                      {item.product.price.toLocaleString()}원
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleAddToCart(item.product)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        담기
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors ml-auto"
                        aria-label="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">찜한 상품</span>
              <span className="text-lg font-bold text-primary">
                {items.length}개
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="rounded-xl"
              >
                비우기
              </Button>
              <Button
                className="flex-1 rounded-xl"
                onClick={() => {
                  items.forEach((item) => addToCart(item.product));
                  addToast("모든 찜 상품을 장바구니에 담았어요!", "success");
                  closeWishlist();
                  openCart();
                }}
              >
                전체 담기
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
