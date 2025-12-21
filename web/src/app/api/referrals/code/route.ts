/**
 * GET /api/referrals/code
 * 내 추천 코드 조회 (없으면 생성)
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureReferralCode } from "@/lib/services/referral.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const code = await ensureReferralCode(user.id);

    return NextResponse.json({
      code,
      shareUrl: `https://teddybearsroom.com/join?ref=${code}`,
    });
  } catch (error) {
    console.error("Error getting referral code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
