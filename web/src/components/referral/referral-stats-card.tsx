/**
 * ReferralStatsCard Component
 * TeddyBear's Room Referral System
 *
 * Displays referral statistics summary with animated counters
 * and shareable referral code/link.
 *
 * Visual Structure:
 * ┌────────────────────────────────────────────────────────┐
 * │  내 추천 현황                                          │
 * ├────────────────────────────────────────────────────────┤
 * │                                                        │
 * │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │
 * │   │    12    │  │    8     │  │    4     │            │
 * │   │ 총 추천  │  │ 활성     │  │ 완료     │            │
 * │   └──────────┘  └──────────┘  └──────────┘            │
 * │                                                        │
 * │   ┌──────────────────────┐  ┌──────────────────────┐  │
 * │   │     156,000P         │  │      18,000P         │  │
 * │   │   총 획득 포인트     │  │   미수령 포인트      │  │
 * │   └──────────────────────┘  └──────────────────────┘  │
 * │                                                        │
 * ├────────────────────────────────────────────────────────┤
 * │  내 추천 코드: TBR2X4K9M  [복사]                        │
 * │                                                        │
 * │  https://teddybearsroom.com/join?ref=TBR2X4K9M        │
 * │                            [링크 복사] [공유하기]       │
 * └────────────────────────────────────────────────────────┘
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  Trophy,
  Coins,
  Copy,
  Share2,
  Check,
  Gift,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface ReferralStatsCardProps {
  /** Total number of referrals made */
  totalReferrals: number;
  /** Number of active referrals (currently subscribed) */
  activeReferrals: number;
  /** Number of completed referrals (all milestones achieved) */
  completedReferrals: number;
  /** Total points earned from referrals */
  totalPointsEarned: number;
  /** Points available to claim */
  unclaimedPoints: number;
  /** User's unique referral code */
  referralCode: string;
  /** Callback when referral code is copied */
  onCopyCode?: () => void;
  /** Optional className for styling */
  className?: string;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook for animated count-up effect
 * Animates from 0 to target value on mount
 */
function useCountUp(
  target: number,
  duration: number = 1500,
  enabled: boolean = true
): number {
  const [count, setCount] = React.useState(0);
  const startTime = React.useRef<number | null>(null);
  const rafId = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!enabled || target === 0) {
      setCount(target);
      return;
    }

    // Easing function for smooth animation (ease-out-cubic)
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      if (startTime.current === null) {
        startTime.current = currentTime;
      }

      const elapsed = currentTime - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [target, duration, enabled]);

  return count;
}

/**
 * Hook for copy to clipboard functionality
 */
function useCopyToClipboard(): [
  boolean,
  (text: string) => Promise<boolean>
] {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = React.useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset copied state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      logger.error("[ReferralStatsCard]", "Failed to copy to clipboard:", error);
      return false;
    }
  }, []);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [copied, copyToClipboard];
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Stat Box - Individual statistic display with icon
 */
interface StatBoxProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  variant?: "default" | "highlight" | "success";
  format?: "number" | "points";
  animationDelay?: number;
}

function StatBox({
  icon,
  value,
  label,
  variant = "default",
  format = "number",
  animationDelay = 0,
}: StatBoxProps) {
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const animatedValue = useCountUp(value, 1500, shouldAnimate);

  // Stagger animation start
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  const formattedValue =
    format === "points"
      ? `${animatedValue.toLocaleString()}P`
      : animatedValue.toLocaleString();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300",
        variant === "default" && "bg-muted/50",
        variant === "highlight" &&
          "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/30",
        variant === "success" &&
          "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/30"
      )}
    >
      <div
        className={cn(
          "mb-2 p-2 rounded-full",
          variant === "default" && "bg-muted text-muted-foreground",
          variant === "highlight" &&
            "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
          variant === "success" &&
            "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-2xl sm:text-3xl font-bold tabular-nums tracking-tight",
          variant === "highlight" && "text-amber-700 dark:text-amber-300",
          variant === "success" && "text-green-700 dark:text-green-300"
        )}
      >
        {formattedValue}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">
        {label}
      </span>
    </div>
  );
}

/**
 * Code Display - Referral code with copy button
 */
interface CodeDisplayProps {
  code: string;
  onCopy: () => void;
  copied: boolean;
}

function CodeDisplay({ code, onCopy, copied }: CodeDisplayProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-muted-foreground">내 추천 코드</span>
        <code className="text-lg sm:text-xl font-mono font-bold tracking-wider text-foreground truncate">
          {code}
        </code>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onCopy}
        className={cn(
          "shrink-0 min-w-[80px] transition-all duration-200",
          copied &&
            "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400"
        )}
        aria-label={copied ? "복사됨" : "추천 코드 복사"}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            복사됨
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-1" />
            복사
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Link Share Section - Referral link display with copy and share buttons
 */
interface LinkShareProps {
  referralCode: string;
  onCopyLink: () => void;
  linkCopied: boolean;
  onShare: () => void;
  canShare: boolean;
}

function LinkShare({
  referralCode,
  onCopyLink,
  linkCopied,
  onShare,
  canShare,
}: LinkShareProps) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://teddybearsroom.com";
  const referralLink = `${baseUrl}/join?ref=${referralCode}`;

  return (
    <div className="space-y-3">
      {/* Link display */}
      <div className="p-3 bg-muted/30 rounded-lg border border-dashed border-border">
        <p className="text-xs sm:text-sm text-muted-foreground break-all font-mono">
          {referralLink}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCopyLink}
          className={cn(
            "flex-1 transition-all duration-200",
            linkCopied &&
              "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400"
          )}
          aria-label={linkCopied ? "링크 복사됨" : "추천 링크 복사"}
        >
          {linkCopied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              복사됨
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              링크 복사
            </>
          )}
        </Button>

        {canShare && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onShare}
            className="flex-1"
            aria-label="추천 링크 공유하기"
          >
            <Share2 className="w-4 h-4 mr-1" />
            공유하기
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ReferralStatsCard({
  totalReferrals,
  activeReferrals,
  completedReferrals,
  totalPointsEarned,
  unclaimedPoints,
  referralCode,
  onCopyCode,
  className,
}: ReferralStatsCardProps) {
  // Copy states for code and link
  const [codeCopied, copyCode] = useCopyToClipboard();
  const [linkCopied, copyLink] = useCopyToClipboard();

  // Check if Web Share API is available
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  // Generate referral link
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://teddybearsroom.com";
  const referralLink = `${baseUrl}/join?ref=${referralCode}`;

  // Handle copy code
  const handleCopyCode = React.useCallback(async () => {
    const success = await copyCode(referralCode);
    if (success && onCopyCode) {
      onCopyCode();
    }
  }, [copyCode, referralCode, onCopyCode]);

  // Handle copy link
  const handleCopyLink = React.useCallback(async () => {
    await copyLink(referralLink);
  }, [copyLink, referralLink]);

  // Handle share via Web Share API
  const handleShare = React.useCallback(async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title: "TeddyBear's Room 추천",
        text: `TeddyBear's Room에서 함께해요! 추천 코드: ${referralCode}`,
        url: referralLink,
      });
    } catch (error) {
      // User cancelled or share failed - ignore AbortError
      if (error instanceof Error && error.name !== "AbortError") {
        logger.error("[ReferralStatsCard]", "Share failed:", error);
      }
    }
  }, [referralCode, referralLink]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Gift className="w-5 h-5 text-primary" />
          내 추천 현황
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Referral Count Stats - 3 columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <StatBox
            icon={<Users className="w-5 h-5" />}
            value={totalReferrals}
            label="총 추천"
            variant="default"
            animationDelay={0}
          />
          <StatBox
            icon={<UserCheck className="w-5 h-5" />}
            value={activeReferrals}
            label="활성"
            variant="default"
            animationDelay={100}
          />
          <StatBox
            icon={<Trophy className="w-5 h-5" />}
            value={completedReferrals}
            label="완료"
            variant="default"
            animationDelay={200}
          />
        </div>

        {/* Points Stats - 2 columns */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <StatBox
            icon={<Coins className="w-5 h-5" />}
            value={totalPointsEarned}
            label="총 획득 포인트"
            variant="highlight"
            format="points"
            animationDelay={300}
          />
          <StatBox
            icon={<Gift className="w-5 h-5" />}
            value={unclaimedPoints}
            label="미수령 포인트"
            variant={unclaimedPoints > 0 ? "success" : "default"}
            format="points"
            animationDelay={400}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t pt-6 bg-muted/20">
        {/* Referral Code Display */}
        <CodeDisplay
          code={referralCode}
          onCopy={handleCopyCode}
          copied={codeCopied}
        />

        {/* Referral Link Share */}
        <LinkShare
          referralCode={referralCode}
          onCopyLink={handleCopyLink}
          linkCopied={linkCopied}
          onShare={handleShare}
          canShare={canShare}
        />
      </CardFooter>
    </Card>
  );
}
