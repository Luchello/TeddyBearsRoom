/**
 * Referral Milestones Page
 * TeddyBear's Room - /my/referral/milestones
 *
 * Displays user's referral milestones dashboard with:
 * - Ambassador badge status
 * - Referral statistics and code sharing
 * - Individual referee milestone cards
 * - Reward claiming functionality
 *
 * Page Structure:
 * +-------------------------------------------------------------+
 * |  Referral Milestones                                        |
 * |  -----------------------------------------------------------+
 * |                                                              |
 * |  [AmbassadorBadge - Ambassador Status]                       |
 * |                                                              |
 * |  +------------------------------------------------------+   |
 * |  |  ReferralStatsCard - Overall Stats + Referral Code    |   |
 * |  +------------------------------------------------------+   |
 * |                                                              |
 * |  My Referrals (Milestones per Referee)                       |
 * |  -----------------------------------------------------------+
 * |                                                              |
 * |  +---------------+  +---------------+  +---------------+    |
 * |  | Milestone     |  | Milestone     |  | Milestone     |    |
 * |  | Card #1       |  | Card #2       |  | Card #3       |    |
 * |  +---------------+  +---------------+  +---------------+    |
 * |                                                              |
 * |  (EmptyState when no referrals)                              |
 * |                                                              |
 * +-------------------------------------------------------------+
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Users, Share2 } from "lucide-react";

// Components
import { ReferralStatsCard } from "@/components/referral/referral-stats-card";
import { ReferralMilestoneCard } from "@/components/referral/referral-milestone-card";
import { AmbassadorBadge } from "@/components/referral/ambassador-badge";
import { Button } from "@/components/ui/button";
import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";

// Hooks
import { useReferralMilestones } from "@/hooks/use-referral-milestones";
import { useAmbassador } from "@/hooks/use-ambassador";
import { useToast } from "@/stores/ui-store";

// Types
import type { MilestoneMonths } from "@/components/referral/referral-milestone-card";

// ============================================================================
// Loading Skeleton
// ============================================================================

function MilestonesSkeleton() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Stats Card Skeleton */}
      <div className="mb-8">
        <CardSkeleton />
      </div>

      {/* Section Title */}
      <div className="mb-6">
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Milestone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Error State
// ============================================================================

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-destructive"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">
          데이터를 불러올 수 없습니다
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error.message || "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
        </p>
        <Button onClick={onRetry} variant="outline">
          다시 시도
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Users className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        아직 추천한 친구가 없습니다
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        추천 코드를 공유하여 친구를 초대하고, 함께 혜택을 누려보세요!
      </p>
      <Button asChild>
        <Link href="/my/referral">
          <Share2 className="w-4 h-4 mr-2" />
          추천 코드 공유하기
        </Link>
      </Button>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ReferralMilestonesPage() {
  const { referrals, stats, isLoading, error, claimReward, refresh } = useReferralMilestones();
  const { ambassador, isLoading: isAmbassadorLoading } = useAmbassador();
  const { toast } = useToast();

  /**
   * Handle reward claim with toast notification
   */
  const handleClaimReward = React.useCallback(
    async (referralId: string, milestoneMonths: MilestoneMonths) => {
      try {
        await claimReward(referralId, milestoneMonths);
        toast.success(
          "보상 수령 완료",
          `${milestoneMonths}개월 마일스톤 보상을 받았습니다!`
        );
      } catch (err) {
        toast.error(
          "보상 수령 실패",
          err instanceof Error ? err.message : "잠시 후 다시 시도해주세요."
        );
        throw err;
      }
    },
    [claimReward, toast]
  );

  /**
   * Handle copy code notification
   */
  const handleCopyCode = React.useCallback(() => {
    toast.success("복사 완료", "추천 코드가 클립보드에 복사되었습니다.");
  }, [toast]);

  // Loading state
  if (isLoading || isAmbassadorLoading) {
    return <MilestonesSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  // Calculate ambassador status
  const isAmbassador = ambassador?.isAmbassador ?? false;
  const totalReferrals = stats?.totalReferrals ?? 0;
  const requiredForAmbassador = 10;

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="shrink-0"
            aria-label="뒤로 가기"
          >
            <Link href="/my/referral">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">추천인 마일스톤</h1>
            <p className="text-muted-foreground mt-1">
              추천한 친구들의 구독 마일스톤을 확인하고 보상을 받으세요
            </p>
          </div>
        </div>

        {/* Ambassador Badge */}
        <AmbassadorBadge
          isAmbassador={isAmbassador}
          totalReferrals={totalReferrals}
          requiredReferrals={requiredForAmbassador}
          showProgress={!isAmbassador}
          size="md"
          className="shrink-0"
        />
      </div>

      {/* Stats Card */}
      {stats && (
        <div className="mb-8">
          <ReferralStatsCard
            totalReferrals={stats.totalReferrals}
            activeReferrals={stats.activeReferrals}
            completedReferrals={stats.completedReferrals}
            totalPointsEarned={stats.totalPointsEarned}
            unclaimedPoints={stats.unclaimedPoints}
            referralCode={stats.referralCode}
            onCopyCode={handleCopyCode}
          />
        </div>
      )}

      {/* Referrals Section */}
      <section aria-labelledby="referrals-heading">
        <h2
          id="referrals-heading"
          className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2"
        >
          <Users className="w-5 h-5 text-primary" />
          내 추천인 목록
          {referrals.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({referrals.length}명)
            </span>
          )}
        </h2>

        {referrals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {referrals.map((referral) => (
              <ReferralMilestoneCard
                key={referral.referralId}
                referralId={referral.referralId}
                refereeName={referral.refereeName}
                subscriptionStartedAt={referral.subscriptionStartedAt}
                monthsSubscribed={referral.monthsSubscribed}
                milestones={referral.milestones}
                onClaimReward={(milestoneMonths) =>
                  handleClaimReward(referral.referralId, milestoneMonths)
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Info Banner */}
      {referrals.length > 0 && (
        <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-muted/50 border border-border">
          <h3 className="font-medium mb-2">마일스톤 보상 안내</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              - 추천한 친구가 구독을 유지할 때마다 마일스톤 보상을 받을 수 있습니다.
            </li>
            <li>
              - 3개월 유지: 3,000P / 6개월 유지: 5,000P / 12개월 유지: 10,000P
            </li>
            <li>
              - 보상은 마일스톤 달성 시 자동으로 적립되며, 수령 버튼을 눌러 확정할 수 있습니다.
            </li>
            <li>
              - 10명 이상 추천 시 TBR 앰버서더로 승급되어 추가 혜택을 받을 수 있습니다.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
