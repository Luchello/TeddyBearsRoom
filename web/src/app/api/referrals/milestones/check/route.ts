/**
 * POST /api/referrals/milestones/check
 * 마일스톤 체크 (Cron Job 또는 Webhook에서 호출)
 *
 * Vercel Cron 설정 예시 (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/referrals/milestones/check",
 *     "schedule": "0 0 * * *"  // 매일 자정
 *   }]
 * }
 *
 * SECURITY: CRON_SECRET 인증 필수 (개발/프로덕션 모두)
 * - GET 메서드 제거 (브라우저 직접 접근 차단)
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAllMilestones } from "@/lib/services/referral.service";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Cron Job 인증 (모든 환경에서 필수)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // CRON_SECRET 미설정 시 서버 설정 오류
    if (!cronSecret) {
      logger.error("[Cron/milestones/check]", "CRON_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 인증 검증 (개발/프로덕션 모두 동일하게 적용)
    if (authHeader !== `Bearer ${cronSecret}`) {
      logger.warn("[Cron/milestones/check]", "Unauthorized milestone check attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("[Cron/milestones/check]", "Starting milestone check...");
    const startTime = Date.now();

    await checkAllMilestones();

    const duration = Date.now() - startTime;
    logger.info("[Cron/milestones/check]", `Milestone check completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: "Milestone check completed",
      duration: `${duration}ms`,
    });
  } catch (error) {
    logger.error("[Cron/milestones/check]", "Error in milestone check:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET 메서드 제거 - 보안상 POST만 허용
