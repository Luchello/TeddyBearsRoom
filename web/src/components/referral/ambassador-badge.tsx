/**
 * AmbassadorBadge Component
 * TeddyBear's Room Referral System
 *
 * Displays TBR Ambassador status with progress indicator for candidates.
 *
 * Visual Design:
 * ┌─────────────────────────────────────┐
 * │  Ambassador (Gold Gradient):        │
 * │  ┌─────────────────┐                │
 * │  │  ★ TBR 앰버서더  │ <- shimmer    │
 * │  │  12명 추천 달성  │               │
 * │  └─────────────────┘                │
 * │                                     │
 * │  Candidate (Slate Gray):            │
 * │  ┌─────────────────┐                │
 * │  │  ☆ 앰버서더 후보 │               │
 * │  │  7/10명 추천    │                │
 * │  │  [████████░░]   │ <- progress    │
 * │  └─────────────────┘                │
 * └─────────────────────────────────────┘
 */

import * as React from "react";
import { Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Size variants for the badge container
const badgeSizeVariants = cva(
  "relative inline-flex flex-col items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105",
  {
    variants: {
      size: {
        sm: "px-3 py-2 gap-0.5",
        md: "px-4 py-3 gap-1",
        lg: "px-6 py-4 gap-1.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// Text size variants
const textSizeVariants = {
  sm: {
    title: "text-xs font-semibold",
    subtitle: "text-[10px]",
    icon: "h-3 w-3",
  },
  md: {
    title: "text-sm font-semibold",
    subtitle: "text-xs",
    icon: "h-4 w-4",
  },
  lg: {
    title: "text-base font-bold",
    subtitle: "text-sm",
    icon: "h-5 w-5",
  },
} as const;

// Progress bar size variants
const progressSizeVariants = {
  sm: "h-1 w-16",
  md: "h-1.5 w-20",
  lg: "h-2 w-24",
} as const;

export interface AmbassadorBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeSizeVariants> {
  /** Whether the user has achieved ambassador status */
  isAmbassador: boolean;
  /** Total number of successful referrals */
  totalReferrals: number;
  /** Number of referrals required for ambassador status */
  requiredReferrals?: number;
  /** Whether to show the progress bar for candidates */
  showProgress?: boolean;
}

export function AmbassadorBadge({
  isAmbassador,
  totalReferrals,
  requiredReferrals = 10,
  size = "md",
  showProgress = true,
  className,
  ...props
}: AmbassadorBadgeProps) {
  const sizeKey = size ?? "md";
  const textStyles = textSizeVariants[sizeKey];
  const progressSize = progressSizeVariants[sizeKey];

  // Calculate progress percentage (capped at 100%)
  const progressPercent = Math.min((totalReferrals / requiredReferrals) * 100, 100);

  // Ambassador styles with gold gradient and shimmer effect
  const ambassadorStyles = cn(
    // Gold gradient background
    "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400",
    // Text color
    "text-amber-900",
    // Shimmer animation (uses animate-shimmer-bg from globals.css)
    "animate-shimmer-bg bg-[length:200%_100%]",
    // Shadow for depth
    "shadow-lg shadow-amber-200/50",
    // Dark mode adjustments
    "dark:from-amber-500 dark:via-yellow-400 dark:to-amber-500",
    "dark:text-amber-950",
    "dark:shadow-amber-400/30"
  );

  // Candidate styles with slate gray background
  const candidateStyles = cn(
    // Slate gray background
    "bg-gradient-to-r from-slate-200 to-slate-300",
    // Text color
    "text-slate-700",
    // Subtle shadow
    "shadow-md shadow-slate-200/50",
    // Dark mode adjustments
    "dark:from-slate-700 dark:to-slate-600",
    "dark:text-slate-200",
    "dark:shadow-slate-800/50"
  );

  return (
    <div
      className={cn(
        badgeSizeVariants({ size }),
        isAmbassador ? ambassadorStyles : candidateStyles,
        className
      )}
      role="status"
      aria-label={
        isAmbassador
          ? `TBR 앰버서더, ${totalReferrals}명 추천 달성`
          : `앰버서더 후보, ${totalReferrals}/${requiredReferrals}명 추천`
      }
      {...props}
    >
      {/* Title Row */}
      <div className="flex items-center gap-1.5">
        {isAmbassador ? (
          <Star className={cn(textStyles.icon, "fill-current")} aria-hidden="true" />
        ) : (
          <Award className={textStyles.icon} aria-hidden="true" />
        )}
        <span className={textStyles.title}>
          {isAmbassador ? "TBR 앰버서더" : "앰버서더 후보"}
        </span>
      </div>

      {/* Subtitle - Referral Count */}
      <span className={cn(textStyles.subtitle, "opacity-80")}>
        {isAmbassador
          ? `${totalReferrals}명 추천 달성`
          : `${totalReferrals}/${requiredReferrals}명 추천`}
      </span>

      {/* Progress Bar - Only for candidates when showProgress is true */}
      {!isAmbassador && showProgress && (
        <div
          className={cn(
            progressSize,
            "mt-1 rounded-full overflow-hidden",
            "bg-slate-400/30 dark:bg-slate-500/30"
          )}
          role="progressbar"
          aria-valuenow={totalReferrals}
          aria-valuemin={0}
          aria-valuemax={requiredReferrals}
          aria-label={`추천 진행률 ${Math.round(progressPercent)}%`}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              "bg-gradient-to-r from-amber-400 to-yellow-400",
              "dark:from-amber-500 dark:to-yellow-500"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Shimmer animation is defined in globals.css:
 * - .animate-shimmer-bg - Background position animation for gold gradient
 *
 * @see web/src/app/globals.css
 */

export default AmbassadorBadge;
