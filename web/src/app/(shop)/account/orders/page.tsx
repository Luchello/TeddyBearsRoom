/**
 * Orders Page
 * TeddyBear's Room - Order History
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Mock orders data - Replace with API call
const mockOrders = [
  {
    id: "TBR-20241209-001",
    status: "PAID",
    total: 116100,
    createdAt: new Date("2024-12-09"),
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
  },
  {
    id: "TBR-20241205-003",
    status: "SHIPPED",
    total: 89000,
    createdAt: new Date("2024-12-05"),
    trackingNumber: "123456789012",
    items: [
      {
        id: "3",
        name: "커플 바이브레이터",
        variantName: "핑크",
        quantity: 1,
        price: 89000,
        imageUrl: "/placeholder-product.jpg",
      },
    ],
  },
  {
    id: "TBR-20241128-002",
    status: "DELIVERED",
    total: 156000,
    createdAt: new Date("2024-11-28"),
    deliveredAt: new Date("2024-12-01"),
    items: [
      {
        id: "4",
        name: "마사지 캔들",
        variantName: "라벤더",
        quantity: 2,
        price: 28000,
        imageUrl: "/placeholder-product.jpg",
      },
      {
        id: "5",
        name: "실크 아이마스크",
        variantName: null,
        quantity: 1,
        price: 35000,
        imageUrl: "/placeholder-product.jpg",
      },
      {
        id: "6",
        name: "바디 페더",
        variantName: null,
        quantity: 1,
        price: 25000,
        imageUrl: "/placeholder-product.jpg",
      },
    ],
  },
  {
    id: "TBR-20241115-001",
    status: "DELIVERED",
    total: 67000,
    createdAt: new Date("2024-11-15"),
    deliveredAt: new Date("2024-11-18"),
    items: [
      {
        id: "7",
        name: "클리너 스프레이 200ml",
        variantName: null,
        quantity: 1,
        price: 12000,
        imageUrl: "/placeholder-product.jpg",
      },
      {
        id: "8",
        name: "보관 파우치 세트",
        variantName: "라지",
        quantity: 1,
        price: 25000,
        imageUrl: "/placeholder-product.jpg",
      },
    ],
  },
  {
    id: "TBR-20241020-004",
    status: "CANCELLED",
    total: 45000,
    createdAt: new Date("2024-10-20"),
    cancelledAt: new Date("2024-10-21"),
    items: [
      {
        id: "9",
        name: "러브 다이스",
        variantName: null,
        quantity: 1,
        price: 15000,
        imageUrl: "/placeholder-product.jpg",
      },
    ],
  },
];

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
  order: (typeof mockOrders)[0];
}

function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      {/* Order Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">{order.id}</span>
            {getOrderStatusBadge(order.status)}
          </div>
          <span className="text-sm text-muted-foreground">
            {order.createdAt.toLocaleDateString("ko-KR", {
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
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0" />
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
            </div>
          ))}

          {order.items.length > 2 && (
            <p className="text-sm text-muted-foreground">
              외 {order.items.length - 2}개 상품
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
              {order.total.toLocaleString()}원
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<typeof mockOrders>([]);
  const [activeTab, setActiveTab] = React.useState("all");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
        <p className="text-muted-foreground">
          주문 및 배송 현황을 확인하세요
        </p>
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
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <OrderSkeleton key={i} />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
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
