/**
 * Admin Auth Helper
 *
 * 관리자 권한 제어 유틸리티
 * - Role enum: GUEST, USER, ADMIN, SUPER_ADMIN
 * - requireAdminRole(minRole): 최소 권한 검증
 *
 * @description
 * API Route에서 관리자 권한을 검증할 때 사용합니다.
 * 인증 로그 조회: ADMIN 이상
 * 수동 상태 변경: SUPER_ADMIN만
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import type { User } from "@supabase/supabase-js";

// ============================================================
// ROLE ENUM
// ============================================================

/**
 * 사용자 역할 enum
 * 숫자 값이 클수록 높은 권한
 */
export enum Role {
  GUEST = 0,
  USER = 1,
  ADMIN = 2,
  SUPER_ADMIN = 3,
}

// 문자열 -> Role 매핑
const roleStringToEnum: Record<string, Role> = {
  GUEST: Role.GUEST,
  USER: Role.USER,
  ADMIN: Role.ADMIN,
  SUPER_ADMIN: Role.SUPER_ADMIN,
};

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/**
 * 관리자 인증 성공 결과 타입
 */
interface AdminAuthSuccess {
  success: true;
  user: User;
  role: Role;
}

/**
 * 관리자 인증 실패 결과 타입
 */
interface AdminAuthFailure {
  success: false;
  response: NextResponse;
}

/**
 * 관리자 인증 결과 Union 타입
 */
export type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * 관리자 권한 검증 헬퍼 함수
 *
 * @param minRole - 최소 요구 권한 (기본값: Role.ADMIN)
 * @returns AdminAuthResult
 *
 * @example
 * ```typescript
 * // ADMIN 이상 권한 필요
 * export async function GET() {
 *   const authResult = await requireAdminRole(Role.ADMIN);
 *   if (!authResult.success) return authResult.response;
 *   // authResult.user, authResult.role 사용 가능
 * }
 *
 * // SUPER_ADMIN만 허용
 * export async function POST() {
 *   const authResult = await requireAdminRole(Role.SUPER_ADMIN);
 *   if (!authResult.success) return authResult.response;
 * }
 * ```
 */
export async function requireAdminRole(
  minRole: Role = Role.ADMIN
): Promise<AdminAuthResult> {
  try {
    // 1. Supabase Auth 확인
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

    // 2. Profile에서 role 조회
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    // 프로필이 없으면 GUEST로 처리
    const roleString = profile?.role ?? "GUEST";
    const userRole = roleStringToEnum[roleString] ?? Role.GUEST;

    // 3. 권한 확인
    if (userRole < minRole) {
      return {
        success: false,
        response: NextResponse.json(
          {
            success: false,
            error: "접근 권한이 없습니다.",
            code: "FORBIDDEN",
          },
          { status: 403 }
        ),
      };
    }

    return {
      success: true,
      user,
      role: userRole,
    };
  } catch (error) {
    logger.error("[API/AdminAuth]", "Admin auth verification error:", error);
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
