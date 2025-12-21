/**
 * Order Confirmation Page
 * TeddyBear's Room - Post-Purchase Success
 */

"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Mock order data - Replace with API call using orderId
const mockOrder = {
  id: "TBR-20241209-001",
  status: "PAID",
  items: [
    {
      id: "1",
      name: "프리미엄 실리콘 토이",
      variantName: "미디엄",
      quantity: 1,
      price: 99000,
      imageUrl: "/placeholder-product.jpg",
    },
    {
      id: "2",
      name: "수용성 러브젤 250ml",
      variantName: null,
      quantity: 2,
      price: 15000,
      imageUrl: "/placeholder-product.jpg",
    },
  ],
  subtotal: 129000,
  discount: 12900,
  shippingCost: 0,
  total: 116100,
  shipping: {
    name: "김테디",
    phone: "010-1234-5678",
    address: "서울특별시 강남구 테헤란로 123",
    addressDetail: "101동 1001호",
    zipcode: "06234",
    method: "standard",
    memo: "경비실에 맡겨주세요",
  },
  payment: {
    method: "card",
    cardName: "삼성카드",
    cardNumber: "**** **** **** 1234",
  },
  isInnerCircle: true,
  createdAt: new Date(),
  estimatedDelivery: "2024-12-12",
};

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // In real implementation, fetch order using orderId
  // TODO: Replace mockOrder with API call: GET /api/orders/${orderId}
  const order = orderId ? mockOrder : mockOrder; // orderId used for future API call

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-mint-200/20 flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-mint-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            주문이 완료되었습니다!
          </h1>
          <p className="text-muted-foreground">
            주문해주셔서 감사합니다. 곧 배송이 시작됩니다.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="rounded-2xl border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">주문번호</p>
              <p className="font-mono font-semibold">{order.id}</p>
            </div>
            <Badge className="bg-mint-200 text-mint-500">
              결제 완료
            </Badge>
          </div>

          <Separator className="my-4" />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold">주문 상품</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  {item.variantName && (
                    <p className="text-sm text-muted-foreground">
                      {item.variantName}
                    </p>
                  )}
                  <p className="text-sm">
                    {item.price.toLocaleString()}원 × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Price Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">상품 금액</span>
              <span>{order.subtotal.toLocaleString()}원</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-pink-500">
                <span className="flex items-center gap-1">
                  할인
                  {order.isInnerCircle && (
                    <Badge
                      variant="outline"
                      className="text-xs border-lavender-300"
                    >
                      이너 써클 10%
                    </Badge>
                  )}
                </span>
                <span>-{order.discount.toLocaleString()}원</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">배송비</span>
              <span>
                {order.shippingCost === 0
                  ? "무료"
                  : `${order.shippingCost.toLocaleString()}원`}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>결제 금액</span>
              <span>{order.total.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-semibold mb-4">배송 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">받는 분</span>
                <span>{order.shipping.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">연락처</span>
                <span>{order.shipping.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주소</span>
                <span className="text-right">
                  ({order.shipping.zipcode})<br />
                  {order.shipping.address}<br />
                  {order.shipping.addressDetail}
                </span>
              </div>
              {order.shipping.memo && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">배송 메모</span>
                  <span>{order.shipping.memo}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">예상 배송일</span>
                <span className="font-medium text-mint-500">
                  {order.estimatedDelivery}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 수단</span>
                <span>신용/체크카드</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">카드 정보</span>
                <span>
                  {order.payment.cardName}<br />
                  {order.payment.cardNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 일시</span>
                <span>
                  {order.createdAt.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="rounded-xl bg-muted/50 p-4 mb-6">
          <div className="flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-mint-500 flex-shrink-0 mt-0.5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            <div className="text-sm">
              <p className="font-medium mb-1">비밀 포장으로 안전하게 배송됩니다</p>
              <p className="text-muted-foreground">
                상품명이 노출되지 않는 무지 박스로 배송되며, 송장에도 상품 정보가
                표시되지 않습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" asChild>
            <Link href="/account/orders">주문 내역 보기</Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/products">쇼핑 계속하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmationSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        <Skeleton className="h-96 rounded-2xl mb-6" />
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
