/**
 * MilestoneTimeline Component
 * TeddyBear's Room Referral System
 *
 * Vertical timeline displaying subscription milestones with claim functionality.
 *
 * Visual Structure (Vertical Timeline):
 * ┌──────────────────────────────────────┐
 * │  3개월 유지                           │
 * ●──│  3,000P                              │
 * │  │  [수령 완료] 2024.06.15              │
 * │  └──────────────────────────────────────┘
 * │
 * │  ┌──────────────────────────────────────┐
 * │  │  6개월 유지                           │
 * ●──│  5,000P                              │
 * │  │  [보상 받기]                          │
 * │  └──────────────────────────────────────┘
 * │
 * │  ┌──────────────────────────────────────┐
 * │  │  12개월 유지 (최종)                   │
 * ○──│  10,000P                             │
 *    │  3개월 남음                           │
 *    └──────────────────────────────────────┘
 *
 * Status Colors:
 * - pending: gray border, empty circle
 * - achieved: green border + background, filled green circle
 * - claimed: blue border + background, filled blue circle
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Clock, Gift, Award } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

type MilestoneStatus = "pending" | "achieved" | "claimed";
type MilestoneMonths = 3 | 6 | 12;

interface MilestoneItem {
  months: MilestoneMonths;
  points: number;
  name: string;
  status: MilestoneStatus;
  achievedAt?: Date;
  claimedAt?: Date;
}

export interface MilestoneTimelineProps {
  /** Array of milestone data */
  milestones: MilestoneItem[];
  /** Current subscription months maintained */
  currentMonths: number;
  /** Callback when claiming a reward */
  onClaimReward?: (months: MilestoneMonths) => Promise<void>;
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
 * Get milestone label with suffix
 */
function getMilestoneLabel(months: MilestoneMonths): string {
  if (months === 12) {
    return `${months}개월 유지 (최종)`;
  }
  return `${months}개월 유지`;
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Timeline Indicator Circle
 */
interface TimelineIndicatorProps {
  status: MilestoneStatus;
  isLast: boolean;
}

function TimelineIndicator({ status, isLast }: TimelineIndicatorProps) {
  const baseClasses =
    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300";

  const statusClasses = {
    pending:
      "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800",
    achieved:
      "border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400",
    claimed:
      "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400",
  };

  const iconClasses = {
    pending: "text-gray-400 dark:text-gray-500",
    achieved: "text-white",
    claimed: "text-white",
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Circle indicator */}
      <div className={cn(baseClasses, statusClasses[status])}>
        {status === "pending" && (
          <Clock className={cn("h-4 w-4", iconClasses[status])} aria-hidden="true" />
        )}
        {status === "achieved" && (
          <Gift className={cn("h-4 w-4", iconClasses[status])} aria-hidden="true" />
        )}
        {status === "claimed" && (
          <Check className={cn("h-4 w-4", iconClasses[status])} aria-hidden="true" />
        )}
      </div>

      {/* Vertical connector line (not shown for last item) */}
      {!isLast && (
        <div
          className={cn(
            "w-0.5 flex-1 min-h-[60px]",
            status === "claimed"
              ? "bg-blue-300 dark:bg-blue-600"
              : status === "achieved"
              ? "bg-green-300 dark:bg-green-600"
              : "bg-gray-200 dark:bg-gray-700"
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/**
 * Milestone Card Content
 */
interface MilestoneCardProps {
  milestone: MilestoneItem;
  currentMonths: number;
  onClaim?: () => Promise<void>;
  isLoading?: boolean;
}

function MilestoneCard({
  milestone,
  currentMonths,
  onClaim,
  isLoading,
}: MilestoneCardProps) {
  const { months, points, name, status, achievedAt, claimedAt } = milestone;
  const remaining = getRemainingMonths(currentMonths, months);

  // Card border and background styles based on status
  const cardStyles = {
    pending:
      "border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/30",
    achieved:
      "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30",
    claimed:
      "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30",
  };

  return (
    <div
      className={cn(
        "flex-1 ml-4 rounded-xl border-2 p-4 transition-all duration-300",
        cardStyles[status]
      )}
    >
      {/* Header: Title + Points */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4
            className={cn(
              "font-semibold",
              status === "pending"
                ? "text-gray-600 dark:text-gray-400"
                : "text-foreground"
            )}
          >
            {getMilestoneLabel(months)}
          </h4>
          {name && (
            <p className="text-sm text-muted-foreground mt-0.5">{name}</p>
          )}
        </div>

        {/* Points badge */}
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold",
            status === "pending"
              ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              : status === "achieved"
              ? "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200"
              : "bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
          )}
        >
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          {points.toLocaleString()}P
        </div>
      </div>

      {/* Status section */}
      <div className="mt-3">
        {status === "pending" && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{remaining}개월 남음</span>
          </div>
        )}

        {status === "achieved" && onClaim && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onClaim}
            disabled={isLoading}
            isLoading={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
          >
            {isLoading ? "처리중..." : "보상 받기"}
          </Button>
        )}

        {status === "claimed" && claimedAt && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>수령 완료</span>
            <time
              dateTime={claimedAt.toISOString()}
              className="text-muted-foreground"
            >
              {formatDateKR(claimedAt)}
            </time>
          </div>
        )}

        {status === "claimed" && !claimedAt && achievedAt && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>수령 완료</span>
            <time
              dateTime={achievedAt.toISOString()}
              className="text-muted-foreground"
            >
              {formatDateKR(achievedAt)}
            </time>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function MilestoneTimeline({
  milestones,
  currentMonths,
  onClaimReward,
  className,
}: MilestoneTimelineProps) {
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

  // Sort milestones by months ascending (3 -> 6 -> 12)
  const sortedMilestones = [...milestones].sort((a, b) => a.months - b.months);

  return (
    <div
      className={cn("relative", className)}
      role="list"
      aria-label="마일스톤 타임라인"
    >
      {sortedMilestones.map((milestone, index) => {
        const isLast = index === sortedMilestones.length - 1;

        return (
          <div
            key={milestone.months}
            className={cn("flex", !isLast && "pb-4")}
            role="listitem"
            aria-label={`${getMilestoneLabel(milestone.months)} - ${
              milestone.status === "pending"
                ? `${getRemainingMonths(currentMonths, milestone.months)}개월 남음`
                : milestone.status === "achieved"
                ? "보상 수령 가능"
                : "수령 완료"
            }`}
          >
            {/* Timeline indicator (circle + connecting line) */}
            <TimelineIndicator status={milestone.status} isLast={isLast} />

            {/* Milestone card */}
            <MilestoneCard
              milestone={milestone}
              currentMonths={currentMonths}
              onClaim={
                onClaimReward
                  ? () => handleClaimReward(milestone.months)
                  : undefined
              }
              isLoading={claimingMilestone === milestone.months}
            />
          </div>
        );
      })}
    </div>
  );
}

// Re-export types for external use
export type { MilestoneStatus, MilestoneMonths, MilestoneItem };
