/**
 * Cart Page
 * TeddyBear's Room - Shopping Cart
 */

"use client";

import Link from "next/link";
import { useCartStore } from "@/stores";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, clearCart } = useCartStore();
  const isEmpty = items.length === 0;

  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--color-foreground)]">
            <span className="mr-2">🛒</span>나의 보물 상자
          </h1>
          {!isEmpty && (
            <p className="text-muted-foreground">
              {items.length}개의 상품이 담겨 있습니다
            </p>
          )}
        </div>
        {!isEmpty && (
          <Button variant="ghost" onClick={clearCart} className="text-destructive">
            전체 삭제
          </Button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 mb-6 text-6xl animate-bounce-soft">☁️</div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--color-foreground)]">보물 상자가 비어 있어요!</h2>
          <p className="text-[var(--color-muted-foreground)] mb-6">
            환상적인 아이템으로 상자를 채워보세요 ✨
          </p>
          <Button asChild variant="bubbly" className="px-8">
            <Link href="/products">보물 찾으러 가기 💎</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card-whimsy p-6 bg-white/70">
              {items.map((item, index) => (
                <div key={item.id}>
                  <CartItem item={item} />
                  {index < items.length - 1 && <Separator className="my-0" />}
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-4">
              <Button variant="ghost" asChild>
                <Link href="/products">← 쇼핑 계속하기</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
