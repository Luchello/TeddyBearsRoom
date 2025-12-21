import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getReferralStats } from "@/lib/services/referral.service";
import {
  REFERRAL_MILESTONES,
  MAX_POINTS_PER_REFERRAL,
} from "@/constants/referral";

/**
 * GET /api/referrals/milestones
 *
 * 현재 사용자의 추천 마일스톤 전체 현황 조회
 *
 * Response Schema:
 * {
 *   totalReferrals: number;
 *   activeReferrals: number;
 *   completedReferrals: number;
 *   totalPointsEarned: number;
 *   unclaimedPoints: number;
 *   maxPointsPerReferral: number;
 *   referrals: Array<{
 *     id: string;
 *     referee: { name: string; joinedAt: string; };
 *     status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
 *     subscriptionStartedAt: string | null;
 *     monthsSubscribed: number;
 *     milestones: Array<{
 *       months: 3 | 6 | 12;
 *       points: number;
 *       name: string;
 *       status: 'pending' | 'achieved' | 'claimed';
 *       achievedAt?: string;
 *       claimedAt?: string;
 *     }>;
 *   }>;
 * }
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getReferralStats(user.id);

    // Transform referrals to match the required response schema
    const transformedReferrals = stats.referrals.map((referral) => {
      // Calculate months subscribed from subscription start date
      const monthsSubscribed = referral.subscriptionStartedAt
        ? getMonthsDifference(
            new Date(referral.subscriptionStartedAt),
            new Date()
          )
        : 0;

      // Create milestone records with proper status
      const milestonesWithStatus = REFERRAL_MILESTONES.map((milestone) => {
        // Find if this milestone has been achieved (exists in milestoneRewards)
        const achievedMilestone = referral.milestones.find(
          (m) => m.months === milestone.months
        );

        if (achievedMilestone) {
          // Milestone has been achieved
          return {
            months: milestone.months as 3 | 6 | 12,
            points: milestone.points,
            name: milestone.name,
            status: achievedMilestone.claimed
              ? ("claimed" as const)
              : ("achieved" as const),
            achievedAt: achievedMilestone.achievedAt?.toISOString(),
            claimedAt: achievedMilestone.claimedAt?.toISOString(),
          };
        }

        // Milestone not yet achieved
        return {
          months: milestone.months as 3 | 6 | 12,
          points: milestone.points,
          name: milestone.name,
          status: "pending" as const,
        };
      });

      return {
        id: referral.id,
        referee: {
          name: referral.referee.name,
          joinedAt:
            referral.referee.joinedAt instanceof Date
              ? referral.referee.joinedAt.toISOString()
              : referral.referee.joinedAt,
        },
        status: referral.status as "ACTIVE" | "COMPLETED" | "CANCELLED",
        subscriptionStartedAt: referral.subscriptionStartedAt
          ? referral.subscriptionStartedAt instanceof Date
            ? referral.subscriptionStartedAt.toISOString()
            : referral.subscriptionStartedAt
          : null,
        monthsSubscribed,
        milestones: milestonesWithStatus,
      };
    });

    return NextResponse.json({
      totalReferrals: stats.totalReferrals,
      activeReferrals: stats.activeReferrals,
      completedReferrals: stats.completedReferrals,
      totalPointsEarned: stats.totalPointsEarned,
      unclaimedPoints: stats.unclaimedPoints,
      maxPointsPerReferral: MAX_POINTS_PER_REFERRAL,
      referrals: transformedReferrals,
    });
  } catch (error) {
    console.error("Error getting referral milestones:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Calculate the difference in months between two dates
 */
function getMonthsDifference(startDate: Date, endDate: Date): number {
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  // Consider the day of month for more accurate calculation
  if (endDate.getDate() < startDate.getDate()) {
    return Math.max(0, months - 1);
  }

  return Math.max(0, months);
}
