"use client";

// ====================================
// TeddyBear's Room - Cart Drawer
// Slide-out cart panel with items
// ====================================

import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCartStore();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeCart]);

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

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="장바구니"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🛒</span> 장바구니
          </h2>
          <button
            onClick={closeCart}
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
              <span className="text-6xl mb-4">🧸</span>
              <p>장바구니가 비어있어요</p>
              <Button asChild variant="outline" className="mt-4 rounded-xl">
                <Link href="/products" onClick={closeCart}>
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
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <span className="text-3xl">🧸</span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-primary font-bold mt-1">
                      {item.product.price.toLocaleString()}원
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 rounded-lg hover:bg-background transition-colors"
                        aria-label="수량 감소"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1 rounded-lg hover:bg-background transition-colors"
                        aria-label="수량 증가"
                      >
                        <Plus className="h-4 w-4" />
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
              <span className="text-muted-foreground">총 금액</span>
              <span className="text-xl font-bold text-primary">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearCart}
                className="rounded-xl"
              >
                비우기
              </Button>
              <Button className="flex-1 rounded-xl" onClick={closeCart}>
                주문하기
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
