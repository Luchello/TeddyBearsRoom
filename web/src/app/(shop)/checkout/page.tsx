/**
 * Checkout Page
 * TeddyBear's Room - Order Checkout
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/stores";
import { CheckoutForm } from "@/components/checkout";
import { CartSummary } from "@/components/cart/cart-summary";
import { CartItem } from "@/components/cart/cart-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const isEmpty = items.length === 0;

  // TODO: Get from auth context
  const isInnerCircle = false;

  const handleCheckoutSubmit = async (data: unknown) => {
    console.log("Checkout data:", data);

    // TODO: Implement actual checkout via TossPayments
    // 1. Create order in database
    // 2. Initialize TossPayments SDK
    // 3. Process payment
    // 4. On success, clear cart and redirect to order confirmation

    // Mock success
    await new Promise((resolve) => setTimeout(resolve, 1500));
    clearCart();
    router.push("/orders/confirmation?orderId=mock-order-id");
  };

  if (isEmpty) {
    return (
      <div className="container py-8">
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
          <h2 className="text-xl font-semibold mb-2">결제할 상품이 없습니다</h2>
          <p className="text-muted-foreground mb-6">
            장바구니에 상품을 담아주세요
          </p>
          <Button asChild>
            <Link href="/products">쇼핑하러 가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">결제하기</h1>
        <p className="text-muted-foreground">
          배송 정보와 결제 수단을 입력해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm
            onSubmit={handleCheckoutSubmit}
            isInnerCircle={isInnerCircle}
          />
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Cart Items Preview */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="font-bold mb-4">주문 상품</h3>
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} compact />
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4">
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link href="/cart">장바구니 수정</Link>
                </Button>
              </div>
            </div>

            {/* Summary */}
            <CartSummary
              showCheckoutButton={false}
              isInnerCircle={isInnerCircle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
