/**
 * MilestoneProgressBar Component
 * TeddyBear's Room - Referral Milestone Progress Visualization
 *
 * Displays subscription milestone progress with animated markers
 *
 * Visual Structure:
 * ┌───────────────────────────────────────────────────────┐
 * │  0M    3M         6M              12M                 │
 * │  ├─────●──────────●───────────────○───┤              │
 * │        ✓          ✓                                   │
 * │     3,000P     5,000P          10,000P               │
 * └───────────────────────────────────────────────────────┘
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Milestone point rewards configuration
const MILESTONE_REWARDS: Record<number, number> = {
  3: 3000,
  6: 5000,
  12: 10000,
};

interface Milestone {
  months: number;
  achieved: boolean;
}

interface MilestoneProgressBarProps {
  /** Current subscription months maintained */
  currentMonths: number;
  /** Milestone data with achievement status */
  milestones: Milestone[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Formats points with locale-aware thousands separator
 */
function formatPoints(points: number): string {
  return new Intl.NumberFormat("ko-KR").format(points) + "P";
}

/**
 * Calculates progress percentage based on current months
 * Max progress is 12 months (100%)
 */
function calculateProgress(currentMonths: number): number {
  const maxMonths = 12;
  return Math.min((currentMonths / maxMonths) * 100, 100);
}

/**
 * Calculates marker position percentage on the progress bar
 */
function calculateMarkerPosition(months: number): number {
  const maxMonths = 12;
  return (months / maxMonths) * 100;
}

/**
 * CheckIcon - Displayed for achieved milestones
 */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * MilestoneMarker - Individual milestone point on the progress bar
 */
interface MilestoneMarkerProps {
  milestone: Milestone;
  position: number;
  reward: number;
  isCurrentTarget: boolean;
}

function MilestoneMarker({
  milestone,
  position,
  reward,
  isCurrentTarget,
}: MilestoneMarkerProps) {
  const { months, achieved } = milestone;

  return (
    <div
      className="absolute -translate-x-1/2 flex flex-col items-center"
      style={{ left: `${position}%` }}
    >
      {/* Month label - above the bar */}
      <span
        className={cn(
          "text-xs font-medium mb-2 transition-colors duration-300",
          achieved
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground"
        )}
      >
        {months}M
      </span>

      {/* Milestone marker circle */}
      <div
        className={cn(
          "relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500",
          achieved
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "bg-background border-muted-foreground/30",
          isCurrentTarget && !achieved && "animate-pulse border-primary"
        )}
        role="img"
        aria-label={
          achieved
            ? `${months}개월 마일스톤 달성 완료`
            : `${months}개월 마일스톤 미달성`
        }
      >
        {achieved ? (
          <CheckIcon className="text-white" />
        ) : (
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isCurrentTarget
                ? "bg-primary animate-ping"
                : "bg-muted-foreground/30"
            )}
          />
        )}

        {/* Pulse animation ring for achieved milestones */}
        {achieved && (
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
        )}
      </div>

      {/* Points reward - below the bar */}
      <span
        className={cn(
          "text-xs font-medium mt-2 transition-colors duration-300",
          achieved
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground"
        )}
      >
        {formatPoints(reward)}
      </span>
    </div>
  );
}

/**
 * MilestoneProgressBar
 * Horizontal progress bar with milestone markers for referral tracking
 */
export function MilestoneProgressBar({
  currentMonths,
  milestones,
  className,
}: MilestoneProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = React.useState(0);
  const progressRef = React.useRef<HTMLDivElement>(null);

  // Animate progress on mount and when currentMonths changes
  React.useEffect(() => {
    // Small delay to trigger CSS transition
    const timer = setTimeout(() => {
      setAnimatedProgress(calculateProgress(currentMonths));
    }, 100);

    return () => clearTimeout(timer);
  }, [currentMonths]);

  // Sort milestones by months for consistent rendering
  const sortedMilestones = React.useMemo(
    () => [...milestones].sort((a, b) => a.months - b.months),
    [milestones]
  );

  // Find the next unachieved milestone (current target)
  const nextMilestone = React.useMemo(
    () => sortedMilestones.find((m) => !m.achieved),
    [sortedMilestones]
  );

  // Calculate the maximum milestone month for percentage calculation
  const maxMilestoneMonth = React.useMemo(
    () => Math.max(...sortedMilestones.map((m) => m.months), 12),
    [sortedMilestones]
  );

  return (
    <div
      className={cn("w-full py-4", className)}
      role="progressbar"
      aria-valuenow={currentMonths}
      aria-valuemin={0}
      aria-valuemax={maxMilestoneMonth}
      aria-label={`구독 유지 ${currentMonths}개월 / ${maxMilestoneMonth}개월`}
    >
      {/* Progress bar container */}
      <div className="relative">
        {/* Milestone markers layer */}
        <div className="relative h-24">
          {sortedMilestones.map((milestone) => (
            <MilestoneMarker
              key={milestone.months}
              milestone={milestone}
              position={calculateMarkerPosition(milestone.months)}
              reward={MILESTONE_REWARDS[milestone.months] ?? 0}
              isCurrentTarget={nextMilestone?.months === milestone.months}
            />
          ))}
        </div>

        {/* Track container - positioned below markers */}
        <div
          ref={progressRef}
          className="relative h-2 bg-muted rounded-full overflow-hidden mt-[-52px]"
        >
          {/* Animated progress fill */}
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600",
              "transition-[width] duration-1000 ease-out"
            )}
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer effect on the progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>

          {/* Current position indicator */}
          {animatedProgress > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-emerald-500 rounded-full shadow-sm transition-[left] duration-1000 ease-out"
              style={{ left: `calc(${animatedProgress}% - 6px)` }}
            />
          )}
        </div>

        {/* Start marker (0M) */}
        <div className="absolute left-0 -translate-x-1/2 flex flex-col items-center -top-0">
          <span className="text-xs text-muted-foreground mb-2">0M</span>
          <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-500" />
        </div>
      </div>

      {/* Progress summary text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{currentMonths}개월</span> 구독 유지 중
          {nextMilestone && (
            <>
              <span className="mx-1">|</span>
              다음 마일스톤까지{" "}
              <span className="font-medium text-primary">
                {nextMilestone.months - currentMonths}개월
              </span>
            </>
          )}
        </p>
      </div>

      {/* Screen reader only: detailed progress info */}
      <div className="sr-only">
        <p>
          현재 {currentMonths}개월 구독 유지 중입니다.
          {sortedMilestones.map((m) => (
            <span key={m.months}>
              {m.months}개월 마일스톤: {m.achieved ? "달성 완료" : "미달성"},{" "}
              {formatPoints(MILESTONE_REWARDS[m.months] ?? 0)} 포인트.
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

// CSS for shimmer animation - add to your global styles or tailwind config
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }

export default MilestoneProgressBar;
