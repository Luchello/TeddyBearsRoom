/**
 * GET /api/cron/referral-milestones
 *
 * Vercel Cron Job - 매일 자정 실행
 * 1. 모든 활성 추천 관계의 마일스톤 체크
 * 2. 앰버서더 자격 업데이트
 *
 * 보안: CRON_SECRET 환경변수로 인증
 *
 * @see vercel.json - crons 설정
 */

import { NextResponse } from "next/server";
import {
  checkAllMilestones,
  updateAllAmbassadorStatuses,
} from "@/lib/services/referral.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 최대 60초 (Vercel Pro 기준)

export async function GET(request: Request) {
  const startTime = Date.now();

  // Authorization 헤더로 Cron 요청 검증
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET environment variable is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.warn("Unauthorized cron job attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[Cron] Starting referral-milestones job...");

    // 1. 마일스톤 체크
    await checkAllMilestones();

    // 2. 앰버서더 자격 업데이트
    const ambassadorResult = await updateAllAmbassadorStatuses();

    const duration = Date.now() - startTime;

    console.log(`[Cron] Job completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      results: {
        milestones: "checked",
        ambassadors: {
          updated: ambassadorResult.updated,
          newAmbassadors: ambassadorResult.newAmbassadors,
        },
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("[Cron] Job failed:", error);

    return NextResponse.json(
      {
        error: "Internal error",
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
      },
      { status: 500 }
    );
  }
}
