/**
 * Order Detail Page
 * TeddyBear's Room - 주문 상세 페이지
 */

"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

// API 응답 타입
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    category: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalPrice: number;
  shippingAddress: string | null;
  shippingMemo: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

function getOrderStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline" className="text-base px-3 py-1">결제 대기</Badge>;
    case "PAID":
      return <Badge className="bg-tbr-mint text-tbr-mint-foreground text-base px-3 py-1">결제 완료</Badge>;
    case "PREPARING":
      return <Badge className="bg-yellow-500 text-white text-base px-3 py-1">상품 준비중</Badge>;
    case "SHIPPED":
      return <Badge className="bg-blue-500 text-white text-base px-3 py-1">배송중</Badge>;
    case "DELIVERED":
      return <Badge variant="secondary" className="text-base px-3 py-1">배송 완료</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive" className="text-base px-3 py-1">취소됨</Badge>;
    default:
      return <Badge variant="outline" className="text-base px-3 py-1">{status}</Badge>;
  }
}

function getStatusDescription(status: string): string {
  switch (status) {
    case "PENDING":
      return "결제가 완료되지 않았습니다. 결제를 진행해주세요.";
    case "PAID":
      return "결제가 완료되었습니다. 상품 준비가 시작됩니다.";
    case "PREPARING":
      return "상품을 준비하고 있습니다. 곧 배송이 시작됩니다.";
    case "SHIPPED":
      return "상품이 배송 중입니다. 배송 조회로 위치를 확인하세요.";
    case "DELIVERED":
      return "상품이 배송 완료되었습니다. 만족스러운 쇼핑이 되셨길 바랍니다.";
    case "CANCELLED":
      return "주문이 취소되었습니다.";
    default:
      return "";
  }
}

function OrderDetailSkeleton() {
  return (
    <div className="container py-8 max-w-4xl">
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </div>
  );
}

// 취소 가능한 주문 상태
const CANCELLABLE_STATUSES = ["PENDING", "PAID"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const orderId = params.id as string;

  React.useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          if (res.status === 401) {
            router.push(`/login?redirect=/account/orders/${orderId}`);
            return;
          }
          if (res.status === 404) {
            setError("주문을 찾을 수 없습니다.");
            return;
          }
          throw new Error("주문 정보를 불러오는데 실패했습니다.");
        }
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          throw new Error(data.error || "주문 정보를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/account/orders/${orderId}`);
      } else {
        fetchOrder();
      }
    }
  }, [authLoading, isAuthenticated, router, orderId]);

  // 주문 취소 함수
  async function handleCancelOrder() {
    if (!order) return;

    const confirmed = window.confirm(
      "정말로 이 주문을 취소하시겠습니까?\n취소된 주문은 복구할 수 없습니다."
    );

    if (!confirmed) return;

    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "주문 취소에 실패했습니다.");
      }

      // 주문 상태 업데이트
      setOrder((prev) => prev ? { ...prev, status: "CANCELLED" } : null);
      alert("주문이 취소되었습니다.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "주문 취소에 실패했습니다.");
    } finally {
      setIsCancelling(false);
    }
  }

  // 취소 가능 여부 확인
  const canCancel = order && CANCELLABLE_STATUSES.includes(order.status);

  // 로딩 중
  if (authLoading || isLoading) {
    return <OrderDetailSkeleton />;
  }

  // 에러
  if (error || !order) {
    return (
      <div className="container py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/account" className="hover:text-foreground transition-colors">
            마이페이지
          </Link>
          <span>/</span>
          <Link href="/account/orders" className="hover:text-foreground transition-colors">
            주문 내역
          </Link>
          <span>/</span>
          <span className="text-foreground">주문 상세</span>
        </nav>
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-muted-foreground/50"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <p className="text-muted-foreground mb-4">{error || "주문을 찾을 수 없습니다."}</p>
          <Button asChild>
            <Link href="/account/orders">주문 내역으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const subtotal = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground transition-colors">
          마이페이지
        </Link>
        <span>/</span>
        <Link href="/account/orders" className="hover:text-foreground transition-colors">
          주문 내역
        </Link>
        <span>/</span>
        <span className="text-foreground">주문 상세</span>
      </nav>

      {/* Order Status Card */}
      <div className="rounded-2xl border bg-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">주문번호</p>
            <p className="font-mono text-lg">{order.id}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground mb-1">주문일시</p>
            <p>
              {orderDate.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              {orderDate.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {getOrderStatusBadge(order.status)}
            <span className="text-muted-foreground">{getStatusDescription(order.status)}</span>
          </div>
          {order.status === "SHIPPED" && (
            <Button variant="outline" size="sm">
              배송 조회
            </Button>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-2xl border bg-card mb-6">
        <div className="p-4 border-b">
          <h2 className="font-semibold">주문 상품</h2>
        </div>
        <div className="divide-y">
          {order.orderItems.map((item) => (
            <div key={item.id} className="p-4 flex gap-4">
              <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden relative">
                {item.product.imageUrl && item.product.imageUrl !== "/placeholder.jpg" ? (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium mb-1">{item.product.name}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  카테고리: {item.product.category}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    {item.price.toLocaleString()}원 × {item.quantity}개
                  </p>
                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="rounded-2xl border bg-card mb-6">
        <div className="p-4 border-b">
          <h2 className="font-semibold">결제 정보</h2>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">상품 금액</span>
            <span>{subtotal.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">배송비</span>
            <span>무료</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>총 결제 금액</span>
            <span className="text-primary">{order.totalPrice.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="rounded-2xl border bg-card mb-6">
        <div className="p-4 border-b">
          <h2 className="font-semibold">배송 정보</h2>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">배송지</p>
            <p>{order.shippingAddress || "배송지 정보 없음"}</p>
          </div>
          {order.shippingMemo && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">배송 메모</p>
              <p>{order.shippingMemo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" asChild className="flex-1">
          <Link href="/account/orders">주문 내역으로 돌아가기</Link>
        </Button>
        {order.status === "DELIVERED" && (
          <>
            <Button variant="outline" className="flex-1">
              리뷰 작성
            </Button>
            <Button className="flex-1">재구매</Button>
          </>
        )}
        {order.status === "PENDING" && (
          <Button className="flex-1">결제하기</Button>
        )}
        {canCancel && (
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? "취소 처리 중..." : "주문 취소"}
          </Button>
        )}
      </div>
    </div>
  );
}
