/**
 * Cart Drawer Component
 * TeddyBear's Room - Mini Cart Slide-out
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "./cart-item";
import { useCartStore } from "@/stores";

interface CartDrawerProps {
  className?: string;
}

export function CartDrawer({ className }: CartDrawerProps) {
  const { items, isOpen, setIsOpen, getTotals, clearCart } = useCartStore();
  const totals = getTotals(false);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className={cn("flex flex-col w-full sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            장바구니
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({itemCount}개)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/50 mb-4"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <p className="text-muted-foreground mb-4">장바구니가 비어 있어요</p>
            <Button variant="outline" onClick={() => setIsOpen(false)} asChild>
              <Link href="/products">쇼핑하러 가기</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} compact />
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            {/* Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">상품 금액</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">배송비</span>
                <span>
                  {totals.shipping === 0 ? (
                    <span className="text-primary">무료</span>
                  ) : (
                    formatPrice(totals.shipping)
                  )}
                </span>
              </div>
              {totals.shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formatPrice(30000 - totals.subtotal)} 더 구매 시 무료배송
                </p>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">총 결제금액</span>
                <span className="text-xl font-bold">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>

            <SheetFooter className="mt-4 flex-col gap-2 sm:flex-col">
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  결제하기
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/cart">장바구니 보기</Link>
              </Button>
              <button
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                장바구니 비우기
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;
