/**
 * Ambassador Dashboard Page
 * TeddyBear's Room - TBR Ambassador Status and Benefits
 *
 * Page Layout:
 * +-----------------------------------------------------------+
 * |  TBR Ambassador                                           |
 * |  ---------------------------------------------------------|
 * |                                                           |
 * |  +-------------------------------------------------------+|
 * |  |                                                       ||
 * |  |           [Large AmbassadorBadge]                     ||
 * |  |           "TBR Ambassador" or "Ambassador Candidate"  ||
 * |  |                                                       ||
 * |  |  (Ambassador: Welcome message)                        ||
 * |  |  (Candidate: X/10 referrals - progress bar)           ||
 * |  |                                                       ||
 * |  +-------------------------------------------------------+|
 * |                                                           |
 * |  +-------------------------------------------------------+|
 * |  |  AmbassadorBenefitsCard - Benefits Status             ||
 * |  |  +-- New Product Preview [Active/Inactive]            ||
 * |  |  +-- Monthly Free Shipping [Available/Next: 01/01]    ||
 * |  |  +-- [Use Free Shipping] button                       ||
 * |  +-------------------------------------------------------+|
 * |                                                           |
 * |  +-------------------------------------------------------+|
 * |  |  ReferralStatsCard - Referral Summary                 ||
 * |  |  +-- Total / Active / Completed                       ||
 * |  |  +-- Referral code + Share button                     ||
 * |  +-------------------------------------------------------+|
 * |                                                           |
 * |  ---------------------------------------------------------|
 * |  [View Milestone Details] -> /my/referral/milestones link |
 * |                                                           |
 * +-----------------------------------------------------------+
 */

"use client";

import Link from "next/link";
import { useAmbassador } from "@/hooks/use-ambassador";
import { useReferralMilestones } from "@/hooks/use-referral-milestones";
import { AmbassadorBadge } from "@/components/referral/ambassador-badge";
import { AmbassadorBenefitsCard } from "@/components/referral/ambassador-benefits-card";
import { ReferralStatsCard } from "@/components/referral/referral-stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/stores";
import { ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { AMBASSADOR_QUALIFICATION_THRESHOLD } from "@/types/referral";

// ============================================================================
// Page Metadata - Note: Client components cannot export metadata
// For metadata, create a separate metadata.ts or use generateMetadata in layout
// ============================================================================

// ============================================================================
// Loading Skeleton Component
// ============================================================================

function AmbassadorPageSkeleton() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Hero Section Skeleton */}
      <Card>
        <CardContent className="py-12 flex flex-col items-center gap-4">
          <Skeleton className="h-24 w-48 rounded-xl" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>

      {/* Benefits Card Skeleton */}
      <Card>
        <CardContent className="py-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      {/* Stats Card Skeleton */}
      <Card>
        <CardContent className="py-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Error Component
// ============================================================================

interface AmbassadorPageErrorProps {
  error: Error;
  onRetry: () => void;
}

function AmbassadorPageError({ error, onRetry }: AmbassadorPageErrorProps) {
  return (
    <div className="container max-w-4xl py-8">
      <Card className="border-destructive/50">
        <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">
              데이터를 불러올 수 없습니다
            </h2>
            <p className="text-muted-foreground mb-4">
              {error.message || "잠시 후 다시 시도해 주세요."}
            </p>
          </div>
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Hero Section Component
// ============================================================================

interface HeroSectionProps {
  isAmbassador: boolean;
  totalReferrals: number;
  requiredReferrals: number;
}

function HeroSection({
  isAmbassador,
  totalReferrals,
  requiredReferrals,
}: HeroSectionProps) {
  const remainingReferrals = Math.max(0, requiredReferrals - totalReferrals);
  const progressPercent = Math.min((totalReferrals / requiredReferrals) * 100, 100);

  return (
    <Card className="overflow-hidden">
      <CardContent className="py-12">
        {/* Badge Section */}
        <div className="flex flex-col items-center gap-6">
          <AmbassadorBadge
            isAmbassador={isAmbassador}
            totalReferrals={totalReferrals}
            requiredReferrals={requiredReferrals}
            size="lg"
            showProgress={!isAmbassador}
          />

          {/* Status Message */}
          {isAmbassador ? (
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                TBR 앰버서더로 활동 중입니다
              </h2>
              <p className="text-muted-foreground">
                지금까지 {totalReferrals}명을 추천해 주셨어요. 감사합니다!
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                앰버서더까지 {remainingReferrals}명 남았어요!
              </h2>
              <p className="text-muted-foreground">
                {totalReferrals}명 추천 완료 / {requiredReferrals}명 필요
              </p>

              {/* Extended Progress Bar */}
              <div className="w-full max-w-xs mx-auto">
                <div
                  className="h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700"
                  role="progressbar"
                  aria-valuenow={totalReferrals}
                  aria-valuemin={0}
                  aria-valuemax={requiredReferrals}
                  aria-label={`앰버서더 진행률 ${Math.round(progressPercent)}%`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-amber-400 to-yellow-400"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round(progressPercent)}% 달성
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function AmbassadorPage() {
  const { toast } = useToast();

  // Fetch ambassador and milestone data
  const {
    ambassador,
    isAmbassador,
    isLoading: isAmbassadorLoading,
    error: ambassadorError,
    useFreeShipping: applyFreeShipping,
    refetch: refetchAmbassador,
  } = useAmbassador();

  const {
    stats,
    isLoading: isStatsLoading,
    error: statsError,
    refresh: refreshStats,
  } = useReferralMilestones();

  // Combined loading state
  const isLoading = isAmbassadorLoading || isStatsLoading;

  // Combined error state
  const error = ambassadorError || statsError;

  // Combined refetch
  const handleRetry = async () => {
    await Promise.all([refetchAmbassador(), refreshStats()]);
  };

  // Handle free shipping usage
  const handleUseFreeShipping = async () => {
    const result = await applyFreeShipping();

    if (result.success) {
      toast.success(
        "무료 배송 적용 완료",
        "다음 주문에서 무료 배송이 적용됩니다."
      );
    } else {
      toast.error(
        "무료 배송 적용 실패",
        result.error || "잠시 후 다시 시도해 주세요."
      );
    }
  };

  // Loading state
  if (isLoading) {
    return <AmbassadorPageSkeleton />;
  }

  // Error state
  if (error) {
    return <AmbassadorPageError error={error} onRetry={handleRetry} />;
  }

  // Derive data from hooks
  const totalReferrals = ambassador?.totalReferrals ?? stats?.totalReferrals ?? 0;
  const activeReferrals = stats?.activeReferrals ?? 0;
  const completedReferrals = stats?.completedReferrals ?? 0;
  const totalPointsEarned = stats?.totalPointsEarned ?? 0;
  const unclaimedPoints = stats?.unclaimedPoints ?? 0;

  // Mock referral code - In production, fetch from user profile or API
  const referralCode = "TBR" + (ambassador?.totalReferrals ?? 0).toString().padStart(4, "0") + "X";

  // Benefits data
  const benefits = ambassador?.benefits ?? {
    newProductEarlyAccess: false,
    monthlyFreeShipping: 0,
    freeShippingAvailable: false,
    nextFreeShippingAt: undefined,
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">TBR 앰버서더</h1>
        <p className="text-muted-foreground">
          앰버서더 혜택과 추천 현황을 확인하세요
        </p>
      </div>

      {/* Hero Section - Ambassador Badge and Status */}
      <HeroSection
        isAmbassador={isAmbassador}
        totalReferrals={totalReferrals}
        requiredReferrals={AMBASSADOR_QUALIFICATION_THRESHOLD}
      />

      {/* Ambassador Benefits Card */}
      <AmbassadorBenefitsCard
        isAmbassador={isAmbassador}
        benefits={benefits}
        onUseFreeShipping={handleUseFreeShipping}
      />

      {/* Referral Stats Card */}
      <ReferralStatsCard
        totalReferrals={totalReferrals}
        activeReferrals={activeReferrals}
        completedReferrals={completedReferrals}
        totalPointsEarned={totalPointsEarned}
        unclaimedPoints={unclaimedPoints}
        referralCode={referralCode}
        onCopyCode={() => {
          toast.success("추천 코드 복사 완료", "친구에게 공유해 보세요!");
        }}
      />

      {/* Separator and Milestone Link */}
      <Separator />

      <div className="flex justify-center">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/my/referral/milestones">
            마일스톤 상세 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
