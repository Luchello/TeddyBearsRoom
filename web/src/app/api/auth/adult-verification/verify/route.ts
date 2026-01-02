/**
 * Adult Verification Verify API
 * POST /api/auth/adult-verification/verify
 *
 * 성인인증 검증 API
 * - PortOne API로 결과 조회
 * - 상태 검증 (VERIFIED 확인)
 * - 연령 확인 (만 19세 이상)
 * - CI 해시 생성 및 저장
 * - Profile 업데이트
 * - 성공/실패 로그 기록
 */

import { NextRequest } from "next/server";
import { requireAuth, apiError, apiSuccess } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { isAdult, hashCi } from "@/lib/services/adult-verification.service";
import { ADULT_VERIFICATION, ERROR_MESSAGES } from "@/constants/adult-verification";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.user.id;

    // 2. Request body 파싱
    let body: { identityVerificationId?: string };
    try {
      body = await request.json();
    } catch {
      return apiError("잘못된 요청 형식입니다.", 400, "INVALID_REQUEST");
    }

    const { identityVerificationId } = body;

    if (!identityVerificationId) {
      return apiError(
        "identityVerificationId가 필요합니다.",
        400,
        "MISSING_IDENTITY_VERIFICATION_ID"
      );
    }

    // 3. PortOne API로 결과 조회
    const apiSecret = process.env.PORTONE_API_SECRET;
    if (!apiSecret) {
      logger.error("[Adult Verification]", "PORTONE_API_SECRET not configured");
      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.API_ERROR],
        500,
        ADULT_VERIFICATION.ERROR_CODES.API_ERROR
      );
    }

    const portoneUrl = `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}`;

    const portoneResponse = await fetch(portoneUrl, {
      method: "GET",
      headers: {
        Authorization: `PortOne ${apiSecret}`,
        "Content-Type": "application/json",
      },
    });

    if (!portoneResponse.ok) {
      logger.error("[Adult Verification]", `PortOne API error: ${portoneResponse.status}`);

      await prisma.adultVerificationLog.create({
        data: {
          profileId: userId,
          txid: identityVerificationId,
          eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
          failureCode: ADULT_VERIFICATION.ERROR_CODES.API_ERROR,
        },
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.VERIFICATION_NOT_FOUND],
        400,
        ADULT_VERIFICATION.ERROR_CODES.VERIFICATION_NOT_FOUND
      );
    }

    const verification = await portoneResponse.json();

    // 4. 상태 확인 (VERIFIED만 통과)
    if (verification.status !== "VERIFIED") {
      await prisma.adultVerificationLog.create({
        data: {
          profileId: userId,
          txid: identityVerificationId,
          eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
          failureCode: ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED,
        },
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED],
        400,
        ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED
      );
    }

    const { verifiedCustomer } = verification;

    if (!verifiedCustomer) {
      await prisma.adultVerificationLog.create({
        data: {
          profileId: userId,
          txid: identityVerificationId,
          eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
          failureCode: ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED,
        },
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED],
        400,
        ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED
      );
    }

    // 5. 연령 확인 (만 19세 이상)
    if (!isAdult(verifiedCustomer.birthDate)) {
      await prisma.adultVerificationLog.create({
        data: {
          profileId: userId,
          txid: identityVerificationId,
          eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
          failureCode: ADULT_VERIFICATION.ERROR_CODES.UNDERAGE,
        },
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.UNDERAGE],
        403,
        ADULT_VERIFICATION.ERROR_CODES.UNDERAGE
      );
    }

    // 6. CI 해시 생성
    const ciHash = hashCi(verifiedCustomer.ci);

    // 7. Profile 업데이트
    const verifiedAt = new Date();

    await prisma.profile.update({
      where: { id: userId },
      data: {
        isAdultVerified: true,
        adultVerifiedAt: verifiedAt,
        adultVerifyMethod: ADULT_VERIFICATION.METHOD.PHONE,
        adultVerifyProvider: ADULT_VERIFICATION.PROVIDER.PORTONE_KCP,
        adultVerifyTxid: identityVerificationId,
        ciHash: ciHash,
      },
    });

    // 8. 성공 로그 기록
    await prisma.adultVerificationLog.create({
      data: {
        profileId: userId,
        txid: identityVerificationId,
        eventType: ADULT_VERIFICATION.EVENT_TYPE.SUCCESS,
      },
    });

    logger.info("[Adult Verification]", `Verified successfully for user: ${userId}`);

    return apiSuccess({
      verified: true,
      verifiedAt: verifiedAt.toISOString(),
    });
  } catch (error) {
    logger.error("[Adult Verification]", "Verify error:", error);
    return apiError(
      ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.API_ERROR],
      500,
      ADULT_VERIFICATION.ERROR_CODES.API_ERROR
    );
  }
}
