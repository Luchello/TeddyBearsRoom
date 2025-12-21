/**
 * ReferralMilestoneCard Component
 * TeddyBear's Room Referral System
 *
 * Displays individual referee milestone progress with claimable rewards.
 *
 * Visual Structure:
 * ┌──────────────────────────────────────────┐
 * │  [User Icon] [Referee Name]              │
 * │  Subscription started: YYYY.MM.DD (Xmo)  │
 * ├──────────────────────────────────────────┤
 * │  o──────●──────●──────o                  │
 * │  3M     6M    12M    End                 │
 * ├──────────────────────────────────────────┤
 * │  [v] 3mo maintained  3,000P  [Claimed]   │
 * │  [v] 6mo maintained  5,000P  [Claim]     │
 * │  [-] 12mo maintained 10,000P  3mo left   │
 * └──────────────────────────────────────────┘
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// Types
// ============================================================================

type MilestoneStatus = "pending" | "achieved" | "claimed";
type MilestoneMonths = 3 | 6 | 12;

interface Milestone {
  months: MilestoneMonths;
  points: number;
  status: MilestoneStatus;
  achievedAt?: Date;
}

export interface ReferralMilestoneCardProps {
  /** Unique referral ID */
  referralId: string;
  /** Display name of the referee */
  refereeName: string;
  /** Date when the referee started their subscription */
  subscriptionStartedAt: Date | null;
  /** Number of months the referee has been subscribed */
  monthsSubscribed: number;
  /** Array of milestone data with status */
  milestones: Milestone[];
  /** Callback when claiming a reward */
  onClaimReward?: (milestoneMonths: MilestoneMonths) => Promise<void>;
  /** Optional className for styling */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date to Korean locale string (YYYY.MM.DD)
 */
function formatDateKR(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
}

/**
 * Calculate remaining months until a milestone
 */
function getRemainingMonths(
  currentMonths: number,
  targetMonths: number
): number {
  return Math.max(0, targetMonths - currentMonths);
}

/**
 * Get milestone status icon SVG
 */
function getMilestoneIcon(status: MilestoneStatus): React.ReactNode {
  switch (status) {
    case "claimed":
      // Filled check circle
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-blue-500 dark:text-blue-400"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
    case "achieved":
      // Check circle outline (claimable)
      return (
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
          className="text-green-500 dark:text-green-400"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "pending":
    default:
      // Clock/timer icon
      return (
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
          className="text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
  }
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Progress Timeline Visualization
 *
 * ASCII representation:
 * o──────●──────●──────o
 * 3M     6M    12M    End
 */
interface ProgressTimelineProps {
  milestones: Milestone[];
  monthsSubscribed: number;
}

function ProgressTimeline({
  milestones,
  monthsSubscribed,
}: ProgressTimelineProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.months - b.months);

  // Calculate progress percentage (max at 12 months = 100%)
  const progressPercent = Math.min((monthsSubscribed / 12) * 100, 100);

  return (
    <div
      className="relative py-4"
      role="progressbar"
      aria-valuenow={monthsSubscribed}
      aria-valuemin={0}
      aria-valuemax={12}
      aria-label={`Subscription progress: ${monthsSubscribed} months`}
    >
      {/* Background track */}
      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-muted rounded-full" />

      {/* Progress fill */}
      <div
        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-green-400 to-green-500 dark:from-green-500 dark:to-green-400 rounded-full transition-all duration-500"
        style={{ width: `${progressPercent}%` }}
      />

      {/* Milestone markers */}
      <div className="relative flex justify-between items-center">
        {sortedMilestones.map((milestone) => {
          const position = (milestone.months / 12) * 100;
          const isReached = monthsSubscribed >= milestone.months;

          return (
            <div
              key={milestone.months}
              className="flex flex-col items-center"
              style={{
                position: "absolute",
                left: `${position}%`,
                transform: "translateX(-50%)",
              }}
            >
              {/* Marker dot */}
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all duration-300",
                  milestone.status === "claimed" &&
                    "bg-blue-500 border-blue-500 dark:bg-blue-400 dark:border-blue-400",
                  milestone.status === "achieved" &&
                    "bg-green-500 border-green-500 dark:bg-green-400 dark:border-green-400",
                  milestone.status === "pending" &&
                    isReached &&
                    "bg-green-300 border-green-400",
                  milestone.status === "pending" &&
                    !isReached &&
                    "bg-background border-muted-foreground/40"
                )}
              />
              {/* Month label */}
              <span className="mt-2 text-xs font-medium text-muted-foreground">
                {milestone.months}M
              </span>
            </div>
          );
        })}

        {/* End marker */}
        <div
          className="flex flex-col items-center"
          style={{
            position: "absolute",
            left: "100%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/20" />
          <span className="mt-2 text-xs text-muted-foreground">END</span>
        </div>

        {/* Start marker (invisible spacer) */}
        <div className="w-4 h-4 invisible" />
      </div>
    </div>
  );
}

/**
 * Individual Milestone Row
 */
interface MilestoneRowProps {
  milestone: Milestone;
  monthsSubscribed: number;
  onClaim?: () => Promise<void>;
  isLoading?: boolean;
}

function MilestoneRow({
  milestone,
  monthsSubscribed,
  onClaim,
  isLoading,
}: MilestoneRowProps) {
  const remaining = getRemainingMonths(monthsSubscribed, milestone.months);

  const statusLabelKR = {
    pending: `${remaining}개월 남음`,
    achieved: "수령 가능",
    claimed: "수령 완료",
  }[milestone.status];

  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-4 rounded-lg transition-colors",
        milestone.status === "achieved" &&
          "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800",
        milestone.status === "claimed" &&
          "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800",
        milestone.status === "pending" && "bg-muted/30"
      )}
    >
      {/* Left section: Icon + Description */}
      <div className="flex items-center gap-3">
        {getMilestoneIcon(milestone.status)}
        <div className="flex flex-col">
          <span
            className={cn(
              "text-sm font-medium",
              milestone.status === "pending" && "text-muted-foreground"
            )}
          >
            {milestone.months}개월 유지
          </span>
          <span className="text-xs text-muted-foreground">
            {milestone.points.toLocaleString()}P
          </span>
        </div>
      </div>

      {/* Right section: Status/Action */}
      <div className="flex items-center gap-2">
        {milestone.status === "pending" && (
          <Badge variant="outline" size="sm" className="text-muted-foreground">
            {statusLabelKR}
          </Badge>
        )}

        {milestone.status === "achieved" && onClaim && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onClaim}
            disabled={isLoading}
            isLoading={isLoading}
            className="min-w-[80px]"
          >
            {isLoading ? "처리중..." : "보상받기"}
          </Button>
        )}

        {milestone.status === "claimed" && (
          <Badge
            variant="secondary"
            size="sm"
            className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
          >
            수령완료
          </Badge>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ReferralMilestoneCard({
  referralId,
  refereeName,
  subscriptionStartedAt,
  monthsSubscribed,
  milestones,
  onClaimReward,
  className,
}: ReferralMilestoneCardProps) {
  const [claimingMilestone, setClaimingMilestone] =
    React.useState<MilestoneMonths | null>(null);

  const handleClaimReward = async (months: MilestoneMonths) => {
    if (!onClaimReward || claimingMilestone !== null) return;

    try {
      setClaimingMilestone(months);
      await onClaimReward(months);
    } finally {
      setClaimingMilestone(null);
    }
  };

  // Sort milestones by months
  const sortedMilestones = [...milestones].sort((a, b) => a.months - b.months);

  // Count achieved but unclaimed milestones
  const unclaimedCount = milestones.filter(
    (m) => m.status === "achieved"
  ).length;

  return (
    <Card
      className={cn("overflow-hidden", className)}
      data-referral-id={referralId}
    >
      <CardHeader className="pb-2">
        {/* Header: User info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* User avatar placeholder */}
            <div
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              aria-hidden="true"
            >
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
                className="text-muted-foreground"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div className="flex flex-col">
              <h3 className="font-semibold text-foreground">{refereeName}</h3>
              <p className="text-xs text-muted-foreground">
                {subscriptionStartedAt ? (
                  <>
                    구독 시작:{" "}
                    <time dateTime={subscriptionStartedAt.toISOString()}>
                      {formatDateKR(subscriptionStartedAt)}
                    </time>
                    <span className="ml-1">({monthsSubscribed}개월째)</span>
                  </>
                ) : (
                  "구독 대기 중"
                )}
              </p>
            </div>
          </div>

          {/* Unclaimed rewards indicator */}
          {unclaimedCount > 0 && (
            <Badge
              variant="accent"
              size="sm"
              className="animate-pulse bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
            >
              {unclaimedCount}개 보상 수령 가능
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Timeline */}
        <ProgressTimeline
          milestones={sortedMilestones}
          monthsSubscribed={monthsSubscribed}
        />

        {/* Milestone Rows */}
        <div className="space-y-2">
          {sortedMilestones.map((milestone) => (
            <MilestoneRow
              key={milestone.months}
              milestone={milestone}
              monthsSubscribed={monthsSubscribed}
              onClaim={
                onClaimReward
                  ? () => handleClaimReward(milestone.months)
                  : undefined
              }
              isLoading={claimingMilestone === milestone.months}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Re-export types for external use
export type { MilestoneStatus, MilestoneMonths, Milestone };
