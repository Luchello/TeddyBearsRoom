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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">장바구니</h1>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground/50 mb-6"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">장바구니가 비어 있어요</h2>
          <p className="text-muted-foreground mb-6">
            마음에 드는 상품을 담아보세요
          </p>
          <Button asChild>
            <Link href="/products">쇼핑하러 가기</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-card p-6">
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
