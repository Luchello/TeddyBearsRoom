"use client";

// ====================================
// TeddyBear's Room - Profile Page
// User profile management with size measurements
// ====================================

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  Ruler,
  Heart,
  ShoppingBag,
  Crown,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/contexts/ToastContext";
import SizeMeasurementForm from "@/components/SizeMeasurementForm";
import type { SizeMeasurements } from "@/lib/types";

// Wrapper component with Suspense boundary for useSearchParams
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

// Main profile content with useSearchParams
function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
  const { addToast } = useToast();

  // Get tab from URL query parameter, default to "size"
  const tabFromUrl = searchParams.get("tab") || "size";
  const validTabs = ["size", "orders", "wishlist", "settings"];
  const activeTab = validTabs.includes(tabFromUrl) ? tabFromUrl : "size";

  const [measurements, setMeasurements] = useState<SizeMeasurements | undefined>();
  const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch measurements on mount
  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!isAuthenticated) return;

      setIsLoadingMeasurements(true);
      try {
        const response = await fetch("/api/users/me/measurements");
        const result = await response.json();

        if (result.success) {
          setMeasurements(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch measurements:", error);
      } finally {
        setIsLoadingMeasurements(false);
      }
    };

    fetchMeasurements();
  }, [isAuthenticated]);

  const handleSaveMeasurements = async (data: SizeMeasurements) => {
    try {
      const response = await fetch("/api/users/me/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setMeasurements(result.data);
        addToast("사이즈 정보가 저장되었습니다.", "success");
      } else {
        throw new Error(result.error || "저장 실패");
      }
    } catch (error) {
      addToast("사이즈 정보 저장에 실패했습니다.", "error");
      throw error;
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    addToast("로그아웃되었습니다.", "info");
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  const subscriptionLabel = {
    none: { text: "일반 회원", variant: "secondary" as const },
    standard: { text: "스탠다드 멤버", variant: "default" as const },
    premium: { text: "프리미엄 멤버", variant: "default" as const },
  };

  const tierInfo = subscriptionLabel[user.subscriptionTier] || subscriptionLabel.none;

  return (
    <div className="min-h-screen bg-background py-8 lg:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Profile Header */}
        <Card className="rounded-2xl border-border mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-foreground">
                    {user.name}
                  </h1>
                  <Badge variant={tierInfo.variant} className="flex items-center gap-1">
                    {user.subscriptionTier === "premium" && (
                      <Crown className="w-3 h-3" />
                    )}
                    {tierInfo.text}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  보유 포인트: <span className="text-primary font-medium">{user.points.toLocaleString()}P</span>
                </p>
              </div>

              {/* Logout Button */}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => router.push(`/profile?tab=${value}`)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="size" className="flex items-center gap-2 py-2">
              <Ruler className="w-4 h-4" />
              <span className="hidden sm:inline">사이즈</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 py-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">주문내역</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2 py-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">위시리스트</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">설정</span>
            </TabsTrigger>
          </TabsList>

          {/* Size Tab */}
          <TabsContent value="size">
            <SizeMeasurementForm
              initialData={measurements}
              onSave={handleSaveMeasurements}
              isLoading={isLoadingMeasurements}
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  주문 내역
                </CardTitle>
                <CardDescription>
                  최근 주문 내역을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>아직 주문 내역이 없습니다.</p>
                  <Button variant="link" onClick={() => router.push("/products")}>
                    상품 둘러보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  위시리스트
                </CardTitle>
                <CardDescription>
                  찜한 상품을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>아직 위시리스트가 비어있습니다.</p>
                  <Button variant="link" onClick={() => router.push("/products")}>
                    상품 둘러보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  계정 설정
                </CardTitle>
                <CardDescription>
                  계정 정보를 관리하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">멤버십 관리</p>
                    <p className="text-sm text-muted-foreground">
                      현재 플랜: {tierInfo.text}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => router.push("/subscribe")}>
                    업그레이드
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">알림 설정</p>
                    <p className="text-sm text-muted-foreground">
                      이메일 및 푸시 알림
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-destructive">계정 삭제</p>
                    <p className="text-sm text-muted-foreground">
                      계정을 영구적으로 삭제합니다
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" disabled>
                    삭제하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
