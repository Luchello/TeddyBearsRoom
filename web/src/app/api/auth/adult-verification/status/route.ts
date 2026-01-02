/**
 * Adult Verification Status API
 * GET /api/auth/adult-verification/status
 *
 * 성인인증 상태 조회 API
 * - 현재 인증 상태 반환 (PENDING, VERIFIED, EXPIRED)
 * - 인증 완료 일시 포함
 */

import { requireAuth, apiError, apiSuccess } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { isVerificationExpired } from "@/lib/services/adult-verification.service";
import { ADULT_VERIFICATION, ERROR_MESSAGES } from "@/constants/adult-verification";
import { logger } from "@/lib/logger";
import type { VerificationStatus } from "@/types/adult-verification";

export async function GET() {
  try {
    // 1. 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.user.id;

    // 2. Profile 조회
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        isAdultVerified: true,
        adultVerifiedAt: true,
      },
    });

    // 프로필이 없는 경우
    if (!profile) {
      return apiError("프로필을 찾을 수 없습니다.", 404, "PROFILE_NOT_FOUND");
    }

    // 3. 상태 판정
    let status: VerificationStatus;
    let verifiedAt: string | null = null;

    if (!profile.isAdultVerified) {
      // 미인증 상태
      status = "PENDING";
    } else if (isVerificationExpired(profile.adultVerifiedAt)) {
      // 만료 상태
      status = "EXPIRED";
      verifiedAt = profile.adultVerifiedAt?.toISOString() ?? null;
    } else {
      // 인증 완료 및 유효
      status = "VERIFIED";
      verifiedAt = profile.adultVerifiedAt?.toISOString() ?? null;
    }

    logger.info("[Adult Verification]", `Status check for user ${userId}: ${status}`);

    return apiSuccess({
      status,
      verifiedAt,
    });
  } catch (error) {
    logger.error("[Adult Verification]", "Status check error:", error);
    return apiError(
      ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.API_ERROR],
      500,
      ADULT_VERIFICATION.ERROR_CODES.API_ERROR
    );
  }
}
