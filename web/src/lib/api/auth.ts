// ====================================
// TeddyBear's Room - API Auth Helper
// 재사용 가능한 인증 검증 유틸리티
// ====================================
//
// 🎯 용도:
// - API Route에서 반복되는 인증 로직 추상화
// - 일관된 인증 에러 응답 형식 제공
// - 타입 안전한 사용자 정보 반환
//
// 📦 사용 패턴:
//   const authResult = await requireAuth();
//   if (!authResult.success) return authResult.response;
//   const user = authResult.user;  // 타입 안전한 User 객체
//
// ====================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * 인증 성공 결과 타입
 */
interface AuthSuccess {
  success: true;
  user: User;
}

/**
 * 인증 실패 결과 타입
 */
interface AuthFailure {
  success: false;
  response: NextResponse;
}

/**
 * 인증 검증 결과 Union 타입
 */
export type AuthResult = AuthSuccess | AuthFailure;

/**
 * API Route에서 인증을 검증하는 헬퍼 함수
 *
 * @description
 * Supabase Auth를 사용하여 현재 요청의 인증 상태를 확인합니다.
 * - 성공: { success: true, user: User } 반환
 * - 실패: { success: false, response: NextResponse } 반환
 *
 * @example
 * ```typescript
 * export async function GET() {
 *   const authResult = await requireAuth();
 *   if (!authResult.success) return authResult.response;
 *
 *   const user = authResult.user;
 *   // user.id, user.email 등 사용 가능
 * }
 * ```
 *
 * @returns {Promise<AuthResult>} 인증 결과 객체
 */
export async function requireAuth(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        success: false,
        response: NextResponse.json(
          {
            success: false,
            error: "로그인이 필요합니다.",
            code: "UNAUTHORIZED",
          },
          { status: 401 }
        ),
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "인증 확인 중 오류가 발생했습니다.",
          code: "AUTH_ERROR",
        },
        { status: 500 }
      ),
    };
  }
}

/**
 * 선택적 인증 검증 헬퍼
 *
 * @description
 * 인증이 필수가 아닌 API에서 사용합니다.
 * 로그인되어 있으면 user를 반환하고, 아니면 null을 반환합니다.
 * 에러는 발생하지 않습니다.
 *
 * @example
 * ```typescript
 * export async function GET() {
 *   const user = await optionalAuth();
 *   // user가 null일 수 있음 (비로그인 상태)
 * }
 * ```
 *
 * @returns {Promise<User | null>} 사용자 객체 또는 null
 */
export async function optionalAuth(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * 일관된 API 에러 응답 생성 헬퍼
 *
 * @param message - 사용자 친화적 에러 메시지
 * @param status - HTTP 상태 코드 (기본 500)
 * @param code - 에러 코드 (선택)
 * @returns NextResponse 에러 응답
 */
export function apiError(
  message: string,
  status: number = 500,
  code?: string
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(code && { code }),
    },
    { status }
  );
}

/**
 * 일관된 API 성공 응답 생성 헬퍼
 *
 * @param data - 응답 데이터
 * @param status - HTTP 상태 코드 (기본 200)
 * @returns NextResponse 성공 응답
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}
