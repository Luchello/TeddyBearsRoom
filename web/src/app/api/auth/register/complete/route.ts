/**
 * Register Complete API
 * POST /api/auth/register/complete
 *
 * 회원가입 완료 API (v2.0 성인인증 선행 방식)
 * - 등록 토큰 검증 및 복호화
 * - 중복 인증 체크 (동일 txid SUCCESS 로그)
 * - PortOne API로 인증 결과 조회
 * - 연령 확인 (만 19세 이상)
 * - CI 해시 생성
 * - Supabase Auth 사용자 생성
 * - Profile 생성 (성인인증 정보 포함)
 * - 성공 로그 기록
 * - 세션 생성 및 반환
 */

import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import {
  decryptRegistrationToken,
  fetchPortOneVerification,
  isDuplicateCallback,
  isAdult,
  hashCi,
  logVerificationEvent,
} from "@/lib/services/adult-verification.service";
import {
  ADULT_VERIFICATION,
  ERROR_MESSAGES,
  getProviderFullName,
} from "@/constants/adult-verification";
import { logger } from "@/lib/logger";

/**
 * PortOne channel 정보에서 provider 추출
 * 예: { pgProvider: "KCP" } -> "PORTONE_KCP"
 */
function extractProvider(
  channel?: { pgProvider?: string } | null
): string {
  if (!channel?.pgProvider) {
    return getProviderFullName("KCP"); // 기본값: PORTONE_KCP
  }

  const pgProvider = channel.pgProvider.toUpperCase();

  // pgProvider 값에 따라 매핑
  if (pgProvider.includes("KCP")) {
    return getProviderFullName("KCP");
  }
  if (pgProvider.includes("DANAL")) {
    return getProviderFullName("DANAL");
  }

  // 알 수 없는 경우 원본 반환 (PORTONE_ 접두사 추가)
  return `PORTONE_${pgProvider}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Request body 파싱
    let body: { registrationToken?: string; identityVerificationId?: string };
    try {
      body = await request.json();
    } catch {
      return apiError("잘못된 요청 형식입니다.", 400, "INVALID_REQUEST");
    }

    const { registrationToken, identityVerificationId } = body;

    // 2. 필수 파라미터 검증
    if (!registrationToken) {
      return apiError(
        "등록 토큰이 필요합니다.",
        400,
        "MISSING_REGISTRATION_TOKEN"
      );
    }

    if (!identityVerificationId) {
      return apiError(
        "identityVerificationId가 필요합니다.",
        400,
        "MISSING_IDENTITY_VERIFICATION_ID"
      );
    }

    // 3. 등록 토큰 검증 및 복호화
    const registrationData = await decryptRegistrationToken(registrationToken);

    if (!registrationData) {
      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.TOKEN_EXPIRED],
        400,
        ADULT_VERIFICATION.ERROR_CODES.TOKEN_EXPIRED
      );
    }

    const { email, password } = registrationData;

    // 4. 중복 인증 체크 (동일 txid로 이미 SUCCESS 로그가 있는지)
    const isDuplicate = await isDuplicateCallback(identityVerificationId);
    if (isDuplicate) {
      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.DUPLICATE_CALLBACK],
        400,
        ADULT_VERIFICATION.ERROR_CODES.DUPLICATE_CALLBACK
      );
    }

    // 5. PortOne API로 인증 결과 조회
    const verification = await fetchPortOneVerification(identityVerificationId);

    if (!verification) {
      await logVerificationEvent({
        txid: identityVerificationId,
        eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
        failureCode: ADULT_VERIFICATION.ERROR_CODES.API_ERROR,
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.VERIFICATION_NOT_FOUND],
        400,
        ADULT_VERIFICATION.ERROR_CODES.VERIFICATION_NOT_FOUND
      );
    }

    // 6. 인증 상태 확인 (VERIFIED만 통과)
    if (verification.status !== "VERIFIED") {
      await logVerificationEvent({
        txid: identityVerificationId,
        eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
        failureCode: ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED,
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED],
        400,
        ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED
      );
    }

    const { verifiedCustomer } = verification;

    if (!verifiedCustomer) {
      await logVerificationEvent({
        txid: identityVerificationId,
        eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
        failureCode: ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED,
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED],
        400,
        ADULT_VERIFICATION.ERROR_CODES.NOT_VERIFIED
      );
    }

    // 7. 연령 확인 (만 19세 이상)
    if (!isAdult(verifiedCustomer.birthDate)) {
      await logVerificationEvent({
        txid: identityVerificationId,
        eventType: ADULT_VERIFICATION.EVENT_TYPE.UNDERAGE,
        failureCode: ADULT_VERIFICATION.ERROR_CODES.UNDERAGE,
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.UNDERAGE],
        403,
        ADULT_VERIFICATION.ERROR_CODES.UNDERAGE
      );
    }

    // 8. CI 해시 생성
    const ciHash = hashCi(verifiedCustomer.ci);

    // 9. Supabase Auth 사용자 생성
    const supabase = createSupabaseAdminClient();
    const { data: authData, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // 이메일 인증 건너뛰기 (본인인증으로 대체)
      });

    if (createError || !authData.user) {
      logger.error("[Register Complete]", "User creation error:", createError);

      await logVerificationEvent({
        txid: identityVerificationId,
        eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
        failureCode: ADULT_VERIFICATION.ERROR_CODES.REGISTRATION_FAILED,
      });

      // 이미 존재하는 이메일인 경우
      if (createError?.message.includes("already")) {
        return apiError(
          "이미 사용 중인 이메일입니다.",
          400,
          "EMAIL_ALREADY_EXISTS"
        );
      }

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.REGISTRATION_FAILED],
        500,
        ADULT_VERIFICATION.ERROR_CODES.REGISTRATION_FAILED
      );
    }

    const userId = authData.user.id;
    const verifiedAt = new Date();

    // 10. Provider 추출 (channel 정보에서)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = extractProvider((verification as any).channel);

    // 11. Profile 생성 (성인인증 정보 포함)
    try {
      await prisma.profile.create({
        data: {
          id: userId,
          email,
          // 성인인증 정보
          isAdultVerified: true,
          adultVerifiedAt: verifiedAt,
          adultVerifyMethod: ADULT_VERIFICATION.METHOD.PHONE,
          adultVerifyProvider: provider,
          adultVerifyTxid: identityVerificationId,
          ciHash: ciHash,
        },
      });
    } catch (profileError) {
      logger.error("[Register Complete]", "Profile creation error:", profileError);

      // 사용자는 생성되었으나 프로필 생성 실패
      // 롤백을 위해 사용자 삭제 시도
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (deleteError) {
        logger.error("[Register Complete]", "User cleanup error:", deleteError);
      }

      await logVerificationEvent({
        txid: identityVerificationId,
        eventType: ADULT_VERIFICATION.EVENT_TYPE.FAILED,
        failureCode: ADULT_VERIFICATION.ERROR_CODES.REGISTRATION_FAILED,
      });

      return apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.REGISTRATION_FAILED],
        500,
        ADULT_VERIFICATION.ERROR_CODES.REGISTRATION_FAILED
      );
    }

    // 12. 성공 로그 기록 (이제 profileId 있음)
    await logVerificationEvent({
      profileId: userId,
      txid: identityVerificationId,
      eventType: ADULT_VERIFICATION.EVENT_TYPE.SUCCESS,
    });

    logger.info(
      "[Register Complete]",
      `Registration completed for user: ${userId}, email: ${email}`
    );

    // 13. 세션 생성 (signInWithPassword로 로그인)
    // Admin API에서는 직접 세션을 생성할 수 없으므로
    // 클라이언트에서 자동 로그인하도록 토큰 정보 반환
    // 참고: Supabase Admin API는 access/refresh token을 직접 반환하지 않음
    // 클라이언트에서 signInWithPassword를 호출해야 함

    return apiSuccess({
      user: {
        id: userId,
        email,
      },
      // 클라이언트에서 자동 로그인을 위한 힌트
      // 실제 세션은 클라이언트에서 signInWithPassword로 생성
      requiresLogin: true,
    });
  } catch (error) {
    logger.error("[Register Complete]", "Error:", error);
    return apiError(
      ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.REGISTRATION_FAILED],
      500,
      ADULT_VERIFICATION.ERROR_CODES.REGISTRATION_FAILED
    );
  }
}
