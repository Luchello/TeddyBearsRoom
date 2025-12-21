/**
 * GET /api/referrals/stats
 * 내 추천 현황 조회
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getReferralStats,
  checkAmbassadorStatus,
} from "@/lib/services/referral.service";
import { REFERRAL_MILESTONES, AMBASSADOR_CONFIG } from "@/constants/referral";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [stats, ambassadorStatus] = await Promise.all([
      getReferralStats(user.id),
      checkAmbassadorStatus(user.id),
    ]);

    return NextResponse.json({
      ...stats,
      ambassador: ambassadorStatus,
      milestoneConfig: REFERRAL_MILESTONES,
      ambassadorConfig: {
        requiredReferrals: AMBASSADOR_CONFIG.requiredReferrals,
        benefits: AMBASSADOR_CONFIG.benefits,
      },
    });
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
