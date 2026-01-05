/**
 * GET /api/referrals/stats
 * 내 추천 현황 조회
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getReferralStats } from "@/lib/services/referral.service";
import { REFERRAL_MILESTONES } from "@/constants/referral";
import { logger } from "@/lib/logger";

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

    return NextResponse.json({
      ...stats,
      milestoneConfig: REFERRAL_MILESTONES,
    });
  } catch (error) {
    logger.error("[API/referrals/stats]", "Error getting referral stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
