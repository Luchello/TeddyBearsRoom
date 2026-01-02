/**
 * Account Page
 * TeddyBear's Room - User Dashboard
 *
 * 실제 사용자 데이터를 API에서 가져와 표시
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

// API 응답 타입
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  subscriptionTier: string;
  points: number;
  createdAt: string;
  stats: {
    totalOrders: number;
    totalSpent: number;
    savedAmount: number;
    wishlistCount: number;
  };
  recentOrders: Array<{
    id: string;
    status: string;
    total: number;
    createdAt: string;
    itemCount: number;
  }>;
}

const menuItems = [
  {
    icon: (
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
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    label: "주문 내역",
    href: "/account/orders",
    description: "주문 및 배송 현황 확인",
    disabled: false,
  },
  {
    icon: (
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
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    label: "위시리스트",
    href: "/wishlist",
    description: "찜한 상품 목록",
    disabled: false,
  },
  {
    icon: (
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
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "회원 정보",
    href: "/account/profile",
    description: "개인정보 및 비밀번호 변경",
    disabled: true,
  },
  {
    icon: (
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
      >
        <path d="M12 2v20" />
        <path d="m17 5-5-3-5 3" />
        <path d="m17 19-5 3-5-3" />
        <path d="M2 12h20" />
        <path d="m5 7-3 5 3 5" />
        <path d="m19 7 3 5-3 5" />
      </svg>
    ),
    label: "신체 정보",
    href: "/account/measurements",
    description: "사이즈 추천을 위한 정보 관리",
    disabled: true,
  },
  {
    icon: (
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
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    label: "배송지 관리",
    href: "/account/addresses",
    description: "자주 쓰는 배송지 설정",
    disabled: true,
  },
  {
    icon: (
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
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
    label: "이너 써클",
    href: "/account/inner-circle",
    description: "멤버십 관리 및 혜택 확인",
    disabled: true,
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

// 로딩 스켈레톤 컴포넌트
function AccountSkeleton() {
  return (
    <div className="container py-8">
      {/* Welcome Section Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-3xl" />
        ))}
      </div>

      {/* Menu Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자 프로필 데이터 fetch
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login?redirect=/account");
            return;
          }
          throw new Error("프로필을 불러오는데 실패했습니다.");
        }
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        } else {
          throw new Error(data.error || "프로필을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/account");
      } else {
        fetchProfile();
      }
    }
  }, [authLoading, isAuthenticated, router]);

  // 로딩 중
  if (authLoading || isLoading) {
    return <AccountSkeleton />;
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

  // 프로필이 없으면 (이론적으로 도달하지 않음)
  if (!profile) {
    return null;
  }

  const isInnerCircle = profile.subscriptionTier !== "none";
  const displayName = profile.name || profile.email.split("@")[0];

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-love-100)] flex items-center justify-center text-3xl animate-bounce-soft border-4 border-white shadow-md overflow-hidden relative">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={displayName}
                fill
                sizes="64px"
                className="rounded-full object-cover"
              />
            ) : (
              "📔"
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
                {displayName}님의 비밀 다이어리
              </h1>
              {isInnerCircle && (
                <Badge className="bg-[var(--color-magic-500)] text-white hover:bg-[var(--color-magic-600)]">
                  이너 써클
                </Badge>
              )}
            </div>
            <p className="text-[var(--color-muted-foreground)]">{profile.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          disabled
          className="rounded-full border-[var(--color-primary)] text-[var(--color-primary)] opacity-60 cursor-not-allowed"
        >
          프로필 꾸미기 (준비 중)
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-3xl border-none bg-[var(--color-dream-50)] p-4 text-center shadow-sm hover:scale-105 transition-transform">
          <p className="text-2xl font-bold text-[var(--color-secondary-foreground)]">
            {profile.stats.totalOrders}
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)]">총 주문</p>
        </div>
        <div className="rounded-3xl border-none bg-[var(--color-love-50)] p-4 text-center shadow-sm hover:scale-105 transition-transform">
          <p className="text-2xl font-bold text-[var(--color-primary-foreground)]">
            {profile.stats.totalSpent >= 10000
              ? `${(profile.stats.totalSpent / 10000).toFixed(1)}만원`
              : `${profile.stats.totalSpent.toLocaleString()}원`}
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)]">누적 구매</p>
        </div>
        <div className="rounded-3xl border-none bg-[var(--color-magic-50)] p-4 text-center shadow-sm hover:scale-105 transition-transform">
          <p className="text-2xl font-bold text-[var(--color-magic-600)]">
            {profile.stats.savedAmount >= 1000
              ? `${(profile.stats.savedAmount / 1000).toFixed(0)}천원`
              : `${profile.stats.savedAmount.toLocaleString()}원`}
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)]">절약 금액 💰</p>
        </div>
        <div className="rounded-3xl border-none bg-[var(--color-fresh-50)] p-4 text-center shadow-sm hover:scale-105 transition-transform">
          <p className="text-2xl font-bold text-[var(--color-fresh-600)]">
            {profile.stats.wishlistCount}
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)]">위시리스트</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">마이페이지</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menuItems.map((item) =>
              item.disabled ? (
                <div
                  key={item.href}
                  className="rounded-2xl border bg-card p-4 opacity-60 cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{item.label}</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      준비 중
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border bg-card p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    {item.icon}
                  </div>
                  <p className="font-medium mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">최근 주문</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account/orders">전체보기</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card">
            {profile.recentOrders.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>아직 주문 내역이 없습니다</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/products">쇼핑하러 가기</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {profile.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href="/account/orders"
                    className="block p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono">{order.id.slice(0, 8)}...</span>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("ko-KR")} · {order.itemCount}개
                        상품
                      </span>
                      <span className="font-medium">{order.total.toLocaleString()}원</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inner Circle Banner */}
      {isInnerCircle ? (
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-tbr-lavender/30 to-tbr-pink/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-tbr-lavender text-tbr-lavender-foreground">🏠 Roommate</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(profile.createdAt).toLocaleDateString("ko-KR")}부터 멤버
                </span>
              </div>
              <p className="font-semibold">
                이번 달{" "}
                {profile.stats.savedAmount >= 1000
                  ? `${(profile.stats.savedAmount / 1000).toFixed(0)}천원`
                  : `${profile.stats.savedAmount.toLocaleString()}원`}
                을 절약했어요!
              </p>
            </div>
            <Button variant="outline" disabled className="opacity-60 cursor-not-allowed">
              혜택 확인 (준비 중)
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-tbr-lavender/30 to-tbr-pink/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold mb-1">이너 써클에 가입하고 10% 할인 받으세요</p>
              <p className="text-sm text-muted-foreground">월 9,900원으로 모든 혜택을 누리세요</p>
            </div>
            <Button asChild>
              <Link href="/inner-circle">자세히 보기</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
