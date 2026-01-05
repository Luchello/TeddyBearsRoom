/**
 * Adult Verification Initiate API
 * POST /api/auth/adult-verification/initiate
 *
 * 성인인증 시작 API
 * - 로그인 필수
 * - 이미 인증된 경우 ALREADY_VERIFIED 반환
 * - identityVerificationId 생성 및 반환
 * - 인증 시작 로그 기록
 */

import { requireAuth, apiError, apiSuccess } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { isVerificationExpired } from "@/lib/services/adult-verification.service";
import {
  ADULT_VERIFICATION,
  ERROR_MESSAGES,
  getConfiguredProvider,
  getChannelKey,
} from "@/constants/adult-verification";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    // 1. 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.user.id;

    // 2. 이미 인증된 경우 체크
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        isAdultVerified: true,
        adultVerifiedAt: true,
      },
    });

    // 이미 인증되어 있고, 만료되지 않은 경우
    if (profile?.isAdultVerified && !isVerificationExpired(profile.adultVerifiedAt)) {
      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.ALREADY_VERIFIED],
        400,
        ADULT_VERIFICATION.ERROR_CODES.ALREADY_VERIFIED
      );
    }

    // 3. identityVerificationId 생성 (user id + timestamp)
    const identityVerificationId = `adult-${userId}-${Date.now()}`;

    // 4. 인증 시작 로그 기록
    await prisma.adultVerificationLog.create({
      data: {
        profileId: userId,
        txid: identityVerificationId,
        eventType: ADULT_VERIFICATION.EVENT_TYPE.INITIATED,
      },
    });

    // 5. 본인인증 제공사 및 채널키 가져오기
    const provider = getConfiguredProvider();
    const channelKey = getChannelKey(provider);

    if (!channelKey) {
      logger.error(
        "[Adult Verification]",
        `Channel key not configured for provider: ${provider}`
      );
      return apiError(
        "본인인증 서비스가 설정되지 않았습니다.",
        500,
        ADULT_VERIFICATION.ERROR_CODES.PROVIDER_NOT_CONFIGURED
      );
    }

    logger.info(
      "[Adult Verification]",
      `Initiated for user: ${userId}, txid: ${identityVerificationId}, provider: ${provider}`
    );

    // 6. 응답 반환 (제공사 정보 포함)
    return apiSuccess({
      identityVerificationId,
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
      channelKey,
      provider,
    });
  } catch (error) {
    logger.error("[Adult Verification]", "Initiate error:", error);
    return apiError(
      ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.API_ERROR],
      500,
      ADULT_VERIFICATION.ERROR_CODES.API_ERROR
    );
  }
}
