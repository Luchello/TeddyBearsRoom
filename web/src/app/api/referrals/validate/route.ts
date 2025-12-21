/**
 * POST /api/referrals/validate
 * 추천 코드 유효성 검증
 *
 * SECURITY: Rate Limit 적용 (Brute Force 방지)
 * - auth 설정: 분당 5회 제한
 */

import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/api/rate-limit";
import { validateReferralCode } from "@/lib/services/referral.service";

export async function POST(request: NextRequest) {
  try {
    // Rate Limit 체크 (Brute Force 방지 - 분당 5회)
    const rateLimitCheck = await withRateLimit("auth");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "추천 코드를 입력해주세요" },
        { status: 400 }
      );
    }

    // 코드 길이 및 형식 기본 검증 (불필요한 DB 조회 방지)
    if (typeof code !== "string" || code.length < 4 || code.length > 20) {
      return NextResponse.json(
        { valid: false, error: "유효하지 않은 추천 코드입니다" },
        { status: 400 }
      );
    }

    const result = await validateReferralCode(code);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error validating referral code:", error);
    return NextResponse.json(
      { valid: false, error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
