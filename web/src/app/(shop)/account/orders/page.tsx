/**
 * Orders Page
 * TeddyBear's Room - Order History
 *
 * 실제 API에서 주문 데이터를 가져와 표시
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
      return <Badge variant="outline">결제 대기</Badge>;
    case "PAID":
      return <Badge className="bg-tbr-mint text-tbr-mint-foreground">결제 완료</Badge>;
    case "PREPARING":
      return <Badge className="bg-yellow-500 text-white">상품 준비중</Badge>;
    case "SHIPPED":
      return <Badge className="bg-blue-500 text-white">배송중</Badge>;
    case "DELIVERED":
      return <Badge variant="secondary">배송 완료</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">취소됨</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function OrderSkeleton() {
  return (
    <div className="rounded-2xl border bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-4">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const orderDate = new Date(order.createdAt);

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      {/* Order Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">{order.id.slice(0, 8)}...</span>
            {getOrderStatusBadge(order.status)}
          </div>
          <span className="text-sm text-muted-foreground">
            {orderDate.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4">
        <div className="space-y-4">
          {order.orderItems.slice(0, 2).map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden relative">
                {item.product.imageUrl && item.product.imageUrl !== "/placeholder.jpg" ? (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.product.name}</p>
                <p className="text-sm">
                  {item.price.toLocaleString()}원 × {item.quantity}
                </p>
              </div>
            </div>
          ))}

          {order.orderItems.length > 2 && (
            <p className="text-sm text-muted-foreground">
              외 {order.orderItems.length - 2}개 상품
            </p>
          )}
        </div>
      </div>

      {/* Order Footer */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm text-muted-foreground">결제 금액</span>
            <span className="ml-2 font-bold">
              {order.totalPrice.toLocaleString()}원
            </span>
          </div>
          <div className="flex gap-2">
            {order.status === "SHIPPED" && (
              <Button variant="outline" size="sm">
                배송 조회
              </Button>
            )}
            {order.status === "DELIVERED" && (
              <>
                <Button variant="outline" size="sm">
                  리뷰 작성
                </Button>
                <Button variant="outline" size="sm">
                  재구매
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/account/orders/${order.id}`}>상세보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("all");

  // 주문 목록 fetch
  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login?redirect=/account/orders");
            return;
          }
          throw new Error("주문 목록을 불러오는데 실패했습니다.");
        }
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          throw new Error(data.error || "주문 목록을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/account/orders");
      } else {
        fetchOrders();
      }
    }
  }, [authLoading, isAuthenticated, router]);

  const filteredOrders = React.useMemo(() => {
    if (activeTab === "all") return orders;
    if (activeTab === "processing") {
      return orders.filter((o) =>
        ["PENDING", "PAID", "PREPARING", "SHIPPED"].includes(o.status)
      );
    }
    if (activeTab === "completed") {
      return orders.filter((o) => o.status === "DELIVERED");
    }
    if (activeTab === "cancelled") {
      return orders.filter((o) => o.status === "CANCELLED");
    }
    return orders;
  }, [orders, activeTab]);

  // 로딩 중
  if (authLoading || isLoading) {
    return (
      <div className="container py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/account" className="hover:text-foreground transition-colors">
            마이페이지
          </Link>
          <span>/</span>
          <span className="text-foreground">주문 내역</span>
        </nav>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">주문 내역</h1>
          <p className="text-muted-foreground">주문 및 배송 현황을 확인하세요</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground transition-colors">
          마이페이지
        </Link>
        <span>/</span>
        <span className="text-foreground">주문 내역</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">주문 내역</h1>
        <p className="text-muted-foreground">주문 및 배송 현황을 확인하세요</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto mb-6">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            전체
          </TabsTrigger>
          <TabsTrigger value="processing" className="flex-1 sm:flex-none">
            진행중
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 sm:flex-none">
            완료
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1 sm:flex-none">
            취소
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border bg-card p-12 text-center">
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
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-muted-foreground mb-4">
                {activeTab === "all"
                  ? "아직 주문 내역이 없습니다"
                  : `${
                      activeTab === "processing"
                        ? "진행중인"
                        : activeTab === "completed"
                        ? "완료된"
                        : "취소된"
                    } 주문이 없습니다`}
              </p>
              <Button asChild>
                <Link href="/products">쇼핑하러 가기</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
