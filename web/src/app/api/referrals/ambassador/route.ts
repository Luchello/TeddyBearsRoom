/**
 * GET /api/referrals/ambassador
 * 앰버서더 상태 조회
 *
 * - 현재 사용자의 앰버서더 상태 반환
 * - 자격 조건, 혜택, 무료 배송 가능 여부 포함
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getOrCreateAmbassadorStatus,
  checkFreeShippingAvailable,
} from "@/lib/services/ambassador.service";
import { AMBASSADOR_CONFIG } from "@/constants/referral";
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

    // 앰버서더 상태 조회 (없으면 CANDIDATE로 생성)
    const ambassadorStatus = await getOrCreateAmbassadorStatus(user.id);

    // 무료 배송 가용 여부 확인
    const freeShippingResult = await checkFreeShippingAvailable(user.id);

    // 앰버서더 자격까지 남은 추천 수
    const remainingForQualification = Math.max(
      0,
      AMBASSADOR_CONFIG.requiredReferrals - ambassadorStatus.totalReferrals
    );

    // 앰버서더 여부
    const isAmbassador = ambassadorStatus.status === "ACTIVE";

    return NextResponse.json({
      isAmbassador,
      status: ambassadorStatus.status,
      totalReferrals: ambassadorStatus.totalReferrals,
      remainingForQualification,
      qualifiedAt: ambassadorStatus.qualifiedAt?.toISOString() ?? undefined,
      benefits: {
        newProductEarlyAccess: isAmbassador
          ? AMBASSADOR_CONFIG.benefits.newProductEarlyAccess
          : false,
        monthlyFreeShipping: isAmbassador
          ? AMBASSADOR_CONFIG.benefits.monthlyFreeShipping
          : 0,
        freeShippingAvailable: freeShippingResult.available,
        nextFreeShippingAt:
          freeShippingResult.nextAvailableAt?.toISOString() ?? undefined,
      },
    });
  } catch (error) {
    logger.error("[API/referrals/ambassador]", "Error getting ambassador status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
