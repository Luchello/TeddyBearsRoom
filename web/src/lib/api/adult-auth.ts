// ====================================
// TeddyBear's Room - Adult Verification Auth Helper
// 성인인증 필수 API 보호 헬퍼
// ====================================
//
// 사용 패턴:
//   const authResult = await requireAdultVerification();
//   if (!authResult.success) return authResult.response;
//   const { userId, profileId, isAdultVerified } = authResult;
//
// ====================================

import { NextResponse } from "next/server";
import { requireAuth, apiError } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { isVerificationExpired } from "@/lib/services/adult-verification.service";
import { ADULT_VERIFICATION, ERROR_MESSAGES } from "@/constants/adult-verification";
import { isAdultVerificationEnabled } from "@/lib/feature-flags";

/**
 * 성인인증 검증 성공 결과 타입
 */
interface AdultAuthSuccess {
  success: true;
  userId: string;
  profileId: string;
  isAdultVerified: boolean;
}

/**
 * 성인인증 검증 실패 결과 타입
 */
interface AdultAuthFailure {
  success: false;
  response: NextResponse;
}

/**
 * 성인인증 검증 결과 Union 타입
 */
export type AdultAuthResult = AdultAuthSuccess | AdultAuthFailure;

/**
 * API Route에서 성인인증을 검증하는 헬퍼 함수
 *
 * @description
 * 로그인 확인 후 성인인증 상태를 확인합니다.
 * - 로그인 체크 (기존 requireAuth 활용)
 * - 성인인증 체크 (isAdultVerified)
 * - 만료 체크 (isVerificationExpired)
 * - ADULT_VERIFICATION_ENABLED=false 면 체크 스킵
 *
 * @example
 * ```typescript
 * export async function GET() {
 *   const authResult = await requireAdultVerification();
 *   if (!authResult.success) return authResult.response;
 *
 *   // authResult.userId, authResult.profileId, authResult.isAdultVerified 사용 가능
 * }
 * ```
 *
 * @returns {Promise<AdultAuthResult>} 인증 결과 객체
 */
export async function requireAdultVerification(): Promise<AdultAuthResult> {
  // 1. 로그인 체크 (기존 requireAuth 활용)
  const authResult = await requireAuth();
  if (!authResult.success) {
    return {
      success: false,
      response: authResult.response,
    };
  }

  const userId = authResult.user.id;

  // 2. 기능 플래그 체크 - 비활성화 시 인증 체크 스킵
  if (!isAdultVerificationEnabled()) {
    return {
      success: true,
      userId,
      profileId: userId,
      isAdultVerified: true, // 기능 비활성화 시 인증된 것으로 처리
    };
  }

  // 3. 프로필에서 성인인증 상태 조회
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isAdultVerified: true,
      adultVerifiedAt: true,
    },
  });

  // 프로필이 없는 경우 (정상적이지 않은 상태)
  if (!profile) {
    return {
      success: false,
      response: apiError(
        "프로필을 찾을 수 없습니다.",
        404,
        "PROFILE_NOT_FOUND"
      ),
    };
  }

  // 4. 성인인증 미완료 체크
  if (!profile.isAdultVerified) {
    return {
      success: false,
      response: apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.ADULT_VERIFICATION_REQUIRED],
        403,
        ADULT_VERIFICATION.ERROR_CODES.ADULT_VERIFICATION_REQUIRED
      ),
    };
  }

  // 5. 만료 체크 (1년)
  if (isVerificationExpired(profile.adultVerifiedAt)) {
    return {
      success: false,
      response: apiError(
        ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.ADULT_VERIFICATION_EXPIRED],
        403,
        ADULT_VERIFICATION.ERROR_CODES.ADULT_VERIFICATION_EXPIRED
      ),
    };
  }

  // 6. 성공
  return {
    success: true,
    userId,
    profileId: profile.id,
    isAdultVerified: true,
  };
}

/**
 * 선택적 성인인증 검증 헬퍼
 *
 * @description
 * 성인인증이 필수가 아닌 API에서 사용합니다.
 * 로그인되어 있고 성인인증이 완료된 경우에만 true를 반환합니다.
 * 에러는 발생하지 않습니다.
 *
 * @example
 * ```typescript
 * export async function GET() {
 *   const adultAuth = await optionalAdultVerification();
 *   if (adultAuth.isAdultVerified) {
 *     // 성인 전용 콘텐츠 표시
 *   }
 * }
 * ```
 *
 * @returns {Promise<{isAuthenticated: boolean, isAdultVerified: boolean, userId?: string}>}
 */
export async function optionalAdultVerification(): Promise<{
  isAuthenticated: boolean;
  isAdultVerified: boolean;
  userId?: string;
}> {
  // 1. 로그인 체크
  const authResult = await requireAuth();
  if (!authResult.success) {
    return {
      isAuthenticated: false,
      isAdultVerified: false,
    };
  }

  const userId = authResult.user.id;

  // 2. 기능 플래그 체크
  if (!isAdultVerificationEnabled()) {
    return {
      isAuthenticated: true,
      isAdultVerified: true,
      userId,
    };
  }

  // 3. 프로필 조회
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      isAdultVerified: true,
      adultVerifiedAt: true,
    },
  });

  if (!profile) {
    return {
      isAuthenticated: true,
      isAdultVerified: false,
      userId,
    };
  }

  // 4. 성인인증 상태 확인
  const isAdultVerified =
    profile.isAdultVerified && !isVerificationExpired(profile.adultVerifiedAt);

  return {
    isAuthenticated: true,
    isAdultVerified,
    userId,
  };
}
