/**
 * Ambassador Free Shipping API
 *
 * GET /api/ambassador/free-shipping
 * - 인증된 사용자의 앰버서더 무료 배송 사용 가능 여부 조회
 *
 * POST /api/ambassador/free-shipping
 * - 인증된 사용자의 앰버서더 무료 배송 사용 처리 (체크아웃 완료 시)
 *
 * SECURITY: 인증 필수, 본인 확인 (profileId === user.id)
 */

import { NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api/auth";
import { withRateLimit } from "@/lib/api/rate-limit";
import {
  checkFreeShippingAvailable,
  useFreeShipping as consumeFreeShipping,
} from "@/lib/services/ambassador.service";
import { logger } from "@/lib/logger";

/**
 * GET - 인증된 사용자의 앰버서더 무료 배송 가능 여부 조회
 */
export async function GET() {
  try {
    // 인증 검증
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;

    // Rate Limit 체크
    const rateLimitCheck = await withRateLimit("default", user.id);
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 인증된 사용자의 ID로 조회 (타인의 정보 접근 차단)
    const result = await checkFreeShippingAvailable(user.id);

    return NextResponse.json({
      available: result.available,
      nextAvailableAt: result.nextAvailableAt?.toISOString() || null,
    });
  } catch (error) {
    logger.error("[API/ambassador/free-shipping]", "Failed to check ambassador free shipping:", error);
    return apiError("무료 배송 가능 여부 확인에 실패했습니다.", 500);
  }
}

/**
 * POST - 인증된 사용자의 앰버서더 무료 배송 사용 처리
 */
export async function POST() {
  try {
    // 인증 검증
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;

    // Rate Limit 체크
    const rateLimitCheck = await withRateLimit("orders", user.id);
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 인증된 사용자의 ID로만 사용 처리 (타인의 혜택 사용 차단)
    const result = await consumeFreeShipping(user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("[API/ambassador/free-shipping]", "Failed to use ambassador free shipping:", error);
    return apiError("무료 배송 적용에 실패했습니다.", 500);
  }
}
