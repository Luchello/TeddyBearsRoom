/**
 * Register Initiate API
 * POST /api/auth/register/initiate
 *
 * 회원가입 시작 API (v2.0 성인인증 선행 방식)
 * - 이메일 중복 체크
 * - 비밀번호 강도 검증
 * - 등록 토큰 생성 (email + password 암호화)
 * - identityVerificationId 생성
 * - INITIATED 로그 기록
 * - SDK 정보 반환 (KCP/다날 채널 지원)
 */

import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  createRegistrationToken,
  logVerificationEvent,
} from "@/lib/services/adult-verification.service";
import {
  ADULT_VERIFICATION,
  getConfiguredProvider,
  getChannelKey,
} from "@/constants/adult-verification";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // 1. Request body 파싱
    let body: { email?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return apiError("잘못된 요청 형식입니다.", 400, "INVALID_REQUEST");
    }

    const { email, password } = body;

    // 2. 이메일 형식 검증
    if (!email || !email.includes("@")) {
      return apiError(
        "유효한 이메일 주소를 입력해주세요.",
        400,
        "INVALID_EMAIL"
      );
    }

    // 이메일 형식 추가 검증 (기본적인 정규식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiError(
        "유효한 이메일 주소를 입력해주세요.",
        400,
        "INVALID_EMAIL"
      );
    }

    // 3. 비밀번호 강도 검증
    if (!password || password.length < 8) {
      return apiError(
        "비밀번호는 8자 이상이어야 합니다.",
        400,
        "WEAK_PASSWORD"
      );
    }

    // 4. 이메일 중복 체크 (Supabase Admin API - listUsers로 필터링)
    const supabase = createSupabaseAdminClient();

    // listUsers는 필터를 지원하지 않으므로 직접 auth.users 테이블 조회
    // 또는 createUser 시도 후 에러 처리로 대체
    const { data: existingUsers, error: lookupError } =
      await supabase.from("auth.users").select("id").eq("email", email).limit(1);

    // auth.users 테이블에 직접 접근 불가능한 경우,
    // signUp 시도로 중복 체크 (실패 시 이메일 존재)
    if (lookupError) {
      // auth.users에 직접 접근 불가하므로 다른 방법 시도
      // Profile 테이블에서 이메일 확인 (이미 가입된 사용자)
      const { data: existingProfile } = await supabase
        .from("Profile")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (existingProfile && existingProfile.length > 0) {
        return apiError(
          "이미 사용 중인 이메일입니다.",
          400,
          "EMAIL_ALREADY_EXISTS"
        );
      }
      // Profile에 없으면 진행 (createUser에서 최종 중복 체크)
    } else if (existingUsers && existingUsers.length > 0) {
      return apiError(
        "이미 사용 중인 이메일입니다.",
        400,
        "EMAIL_ALREADY_EXISTS"
      );
    }

    // 5. 등록 토큰 생성 (email + password 암호화)
    const registrationToken = await createRegistrationToken({ email, password });

    // 6. identityVerificationId 생성
    const identityVerificationId = `reg-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    // 7. INITIATED 로그 기록 (profileId 없음 - 아직 계정 미생성)
    await logVerificationEvent({
      txid: identityVerificationId,
      eventType: ADULT_VERIFICATION.EVENT_TYPE.INITIATED,
    });

    // 8. 본인인증 제공사 및 채널키 가져오기
    const provider = getConfiguredProvider();
    const channelKey = getChannelKey(provider);

    if (!channelKey) {
      logger.error(
        "[Register Initiate]",
        `Channel key not configured for provider: ${provider}`
      );
      return apiError(
        "본인인증 서비스가 설정되지 않았습니다.",
        500,
        ADULT_VERIFICATION.ERROR_CODES.PROVIDER_NOT_CONFIGURED
      );
    }

    logger.info(
      "[Register Initiate]",
      `Registration initiated for email: ${email}, txid: ${identityVerificationId}, provider: ${provider}`
    );

    // 9. SDK 정보 반환 (제공사 정보 포함)
    return apiSuccess({
      identityVerificationId,
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
      channelKey,
      registrationToken,
      provider, // 클라이언트에서 제공사 정보 활용 가능
    });
  } catch (error) {
    logger.error("[Register Initiate]", "Error:", error);
    return apiError("회원가입 시작에 실패했습니다.", 500, "INITIATE_FAILED");
  }
}
