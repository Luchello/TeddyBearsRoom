// ====================================
// TeddyBear's Room - User Measurements API
// 사용자 신체 사이즈 정보 조회/수정/삭제 API
// ====================================
//
// 🎯 용도:
// - GET: 현재 로그인 사용자의 신체 사이즈 정보 조회 (키, 몸무게, 성별, 의류 사이즈 등)
// - PATCH: 사용자의 신체 사이즈 정보 수정 또는 생성 (upsert)
// - DELETE: 사용자의 모든 신체 사이즈 정보 삭제
// - 로그인 필수 (Supabase Auth 기반)
// - 민감한 신체정보 보호: encryptedMeasurements로 추가 암호화 지원
//
// 📦 구조:
// - Validation Helpers: height, weight, shoeSize, gender 유효성 검사 함수
// - GET 핸들러: 로그인 확인 → Prisma select로 사이즈 정보 조회
// - PATCH 핸들러: 로그인 확인 → 유효성 검사 → Prisma upsert (생성 또는 수정)
// - DELETE 핸들러: 로그인 확인 → 모든 사이즈 정보를 null로 설정
// - 인증: Supabase 세션에서 user.id 추출
// - 응답: {success, data/message} 구조
//
// 🎨 디자인:
// - 인증 필수: 로그인하지 않은 사용자 401 Unauthorized
// - 범위 검사: height (100-250), weight (30-200), shoeSize (200-320)
// - 성별: MALE, FEMALE, OTHER 중 하나
// - 선택적 필드: 모든 필드가 선택사항 (업데이트할 것만 전송)
// - 에러: 400 Bad Request (유효성), 401 Unauthorized, 404 Not Found, 500 Internal Error
//
// 🔧 주요 기능:
// - GET: 조회 전용, 프로필 미존재 시 404 반환
// - PATCH: Upsert (create if not exists, update if exists)
// - DELETE: 모든 사이즈 필드를 null로 설정하여 삭제 표현
// - 암호화: encryptedMeasurements는 DB 레벨 pgcrypto 암호화 지원
// - 유효성 검사: 범위 체크 함수로 값 검증
//
// 📝 의존성:
// - Supabase: createClient (서버사이드), getUser (인증 확인)
// - Prisma: profile 모델 (findUnique, upsert, update)
// - NextResponse: API 응답 포맷
// - Prisma.ProfileUpdateInput: 타입 안전성
// ====================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { requireAuth, apiError, apiSuccess } from "@/lib/api/auth";
import { withRateLimit } from "@/lib/api/rate-limit";
import { z } from "zod";
import { logger } from "@/lib/logger";

// ====================================
// Input Validation Schemas (Zod)
// 모든 입력에 대한 엄격한 유효성 검사
// ====================================

/**
 * 의류 사이즈 enum
 */
const ClothingSizeEnum = z.enum(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);

/**
 * 성별 enum
 */
const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

/**
 * 신체 측정 정보 수정 요청 스키마
 * 모든 필드가 선택사항이며, 각 필드에 대해 엄격한 범위 및 타입 검증
 */
const UpdateMeasurementsSchema = z.object({
  // 키: 100cm ~ 250cm
  height: z
    .number()
    .min(100, "키는 100cm 이상이어야 합니다.")
    .max(250, "키는 250cm 이하여야 합니다.")
    .nullable()
    .optional(),

  // 몸무게: 30kg ~ 200kg
  weight: z
    .number()
    .min(30, "몸무게는 30kg 이상이어야 합니다.")
    .max(200, "몸무게는 200kg 이하여야 합니다.")
    .nullable()
    .optional(),

  // 성별: MALE, FEMALE, OTHER
  gender: GenderEnum.nullable().optional(),

  // 상의 사이즈: XS ~ XXXL
  topSize: ClothingSizeEnum.nullable().optional(),

  // 하의 사이즈: XS ~ XXXL
  bottomSize: ClothingSizeEnum.nullable().optional(),

  // 신발 사이즈: 200mm ~ 320mm
  shoeSize: z
    .number()
    .min(200, "신발 사이즈는 200mm 이상이어야 합니다.")
    .max(320, "신발 사이즈는 320mm 이하여야 합니다.")
    .nullable()
    .optional(),

  // 암호화된 측정 정보: 최대 10000자, Base64 형식만 허용
  encryptedMeasurements: z
    .string()
    .max(10000, "암호화된 데이터는 10000자 이하여야 합니다.")
    // Base64 또는 null만 허용
    .regex(
      /^[A-Za-z0-9+/=]*$/,
      "암호화된 데이터 형식이 올바르지 않습니다."
    )
    .nullable()
    .optional(),
}).strict(); // 정의되지 않은 필드 거부

/**
 * 사용자의 신체 사이즈 정보 조회 API 핸들러
 *
 * @description
 * GET /api/users/me/measurements에서 현재 로그인한 사용자의 신체 사이즈 정보를 조회합니다.
 * - Supabase Auth로 현재 사용자 확인 (로그인 필수)
 * - Prisma findUnique로 프로필 조회 (사이즈 정보만 선택)
 * - 프로필이 없으면 404 Not Found 응답
 * - 선택된 필드: height, weight, gender, topSize, bottomSize, shoeSize, encryptedMeasurements
 * - null coalescing (??): 없는 필드는 null로 응답
 *
 * @returns {Promise<NextResponse>} JSON 응답 {success, data} 또는 에러 응답
 *
 * @example
 * // 사용자의 신체 사이즈 정보 조회
 * GET /api/users/me/measurements
 * Headers: Authorization: Bearer [session_token]
 * Response: {success: true, data: {height, weight, gender, topSize, bottomSize, shoeSize, encryptedMeasurements}}
 */
export async function GET() {
  try {
    // ──────────────────────────────────────
    // Rate Limiting: 분당 30회 제한
    // ──────────────────────────────────────
    const rateLimitCheck = await withRateLimit("default");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // ──────────────────────────────────────
    // 인증 확인: 로그인하지 않은 사용자 차단
    // requireAuth() 헬퍼로 일관된 인증 처리
    // ──────────────────────────────────────
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;  // 타입 안전한 User 객체

    // ──────────────────────────────────────
    // 사용자의 신체 사이즈 정보 조회
    // select: 프로필 테이블에서 사이즈 관련 필드만 조회
    // 선택된 필드: height, weight, gender, topSize, bottomSize, shoeSize, encryptedMeasurements
    // 선택되지 않은 필드: id, email, name, avatar, subscriptionTier, points, createdAt (제외)
    // ──────────────────────────────────────
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },  // 조건: 현재 사용자 ID로 프로필 검색
      select: {
        height: true,                      // 키 (cm)
        weight: true,                      // 몸무게 (kg)
        gender: true,                      // 성별 (MALE, FEMALE, OTHER)
        topSize: true,                     // 상의 사이즈 (XS, S, M, L, XL)
        bottomSize: true,                  // 하의 사이즈 (XS, S, M, L, XL)
        shoeSize: true,                    // 신발 사이즈 (mm, 예: 260mm = 26cm)
        encryptedMeasurements: true,       // pgcrypto 암호화된 신체 정보
      },
    });

    // ──────────────────────────────────────
    // 404 Not Found 처리
    // 프로필이 존재하지 않으면 404 응답 반환
    // ──────────────────────────────────────
    if (!profile) {
      return apiError("프로필을 찾을 수 없습니다.", 404, "PROFILE_NOT_FOUND");
    }

    // ──────────────────────────────────────
    // 성공 응답: apiSuccess 헬퍼로 일관된 응답 형식
    // null coalescing (??): 없는 필드를 null로 변환
    // 클라이언트에서 필드의 존재 여부를 쉽게 확인 가능
    // ──────────────────────────────────────
    return apiSuccess({
      height: profile.height ?? null,                      // 키: 설정되면 숫자, 미설정 시 null
      weight: profile.weight ?? null,                      // 몸무게: 설정되면 숫자, 미설정 시 null
      gender: profile.gender ?? null,                      // 성별: 설정되면 문자열, 미설정 시 null
      topSize: profile.topSize ?? null,                    // 상의 사이즈: 설정되면 문자열, 미설정 시 null
      bottomSize: profile.bottomSize ?? null,              // 하의 사이즈: 설정되면 문자열, 미설정 시 null
      shoeSize: profile.shoeSize ?? null,                  // 신발 사이즈: 설정되면 숫자, 미설정 시 null
      encryptedMeasurements: profile.encryptedMeasurements ?? null,  // 암호화된 정보: 설정되면 문자열, 미설정 시 null
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리: apiError 헬퍼로 일관된 에러 응답
    // ──────────────────────────────────────
    logger.error("[API/users/me/measurements]", "Measurements GET Error:", error);
    return apiError("사이즈 정보를 불러오는데 실패했습니다.", 500, "MEASUREMENTS_FETCH_ERROR");
  }
}

/**
 * 사용자의 신체 사이즈 정보 수정/생성 API 핸들러 (Upsert)
 *
 * @description
 * PATCH /api/users/me/measurements에서 현재 로그인한 사용자의 신체 사이즈 정보를 수정하거나 생성합니다.
 * - Supabase Auth로 현재 사용자 확인 (로그인 필수)
 * - 요청 바디에서 필드 파싱 (모든 필드 선택사항)
 * - 각 필드 범위 검증 (height, weight, shoeSize, gender)
 * - Prisma upsert: 프로필 존재 시 업데이트, 미존재 시 생성
 * - 수정된 프로필 정보 반환 (GET과 동일한 형식)
 *
 * @param {Request} request - Next.js Request 객체 (JSON body 포함)
 * @returns {Promise<NextResponse>} JSON 응답 {success, data} 또는 에러 응답
 *
 * @example
 * // 신체 사이즈 정보 수정 (키와 몸무게만 변경)
 * PATCH /api/users/me/measurements
 * Headers: Authorization: Bearer [session_token]
 * Body: { height: 170, weight: 65 }
 * Response: {success: true, data: {height: 170, weight: 65, ...}}
 */
export async function PATCH(request: Request) {
  try {
    // ──────────────────────────────────────
    // Rate Limiting: 분당 30회 제한
    // ──────────────────────────────────────
    const rateLimitCheck = await withRateLimit("default");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // ──────────────────────────────────────
    // 인증 확인: 로그인하지 않은 사용자 차단
    // requireAuth() 헬퍼로 일관된 인증 처리
    // ──────────────────────────────────────
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;  // 타입 안전한 User 객체

    // ──────────────────────────────────────
    // 요청 바디 파싱 및 Zod 유효성 검사
    // 모든 필드에 대해 엄격한 타입 및 범위 검증
    // ──────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError("잘못된 JSON 형식입니다.", 400, "INVALID_JSON");
    }

    // Zod 스키마로 입력 검증
    const validationResult = UpdateMeasurementsSchema.safeParse(body);
    if (!validationResult.success) {
      // Zod 4.x: error.issues 사용 (error.errors 대신)
      const errorMessages = validationResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return apiError(errorMessages, 400, "VALIDATION_ERROR");
    }

    const {
      height,
      weight,
      gender,
      topSize,
      bottomSize,
      shoeSize,
      encryptedMeasurements,
    } = validationResult.data;

    // ──────────────────────────────────────
    // Upsert 데이터 빌드 (선택적 업데이트)
    // 제공된 필드만 포함 (undefined 필드는 제외)
    // 타입: Prisma.ProfileUpdateInput (타입 안전성)
    // ──────────────────────────────────────
    const updateData: Prisma.ProfileUpdateInput = {};  // 빈 객체에서 시작
    if (height !== undefined) updateData.height = height;  // 키 포함 (있을 때만)
    if (weight !== undefined) updateData.weight = weight;  // 몸무게 포함 (있을 때만)
    if (gender !== undefined) updateData.gender = gender;  // 성별 포함 (있을 때만)
    if (topSize !== undefined) updateData.topSize = topSize;  // 상의 사이즈 포함 (있을 때만)
    if (bottomSize !== undefined) updateData.bottomSize = bottomSize;  // 하의 사이즈 포함 (있을 때만)
    if (shoeSize !== undefined) updateData.shoeSize = shoeSize;  // 신발 사이즈 포함 (있을 때만)
    if (encryptedMeasurements !== undefined) {
      updateData.encryptedMeasurements = encryptedMeasurements;  // 암호화된 정보 포함 (있을 때만)
    }

    // ──────────────────────────────────────
    // Upsert 작업: 프로필 생성 또는 업데이트
    // - 프로필 존재: update (제공된 필드만 수정)
    // - 프로필 미존재: create (초기 데이터로 생성)
    // - select: 반환할 필드 지정 (사이즈 정보만)
    // ──────────────────────────────────────
    const updatedProfile = await prisma.profile.upsert({
      where: { id: user.id },  // 조건: 현재 사용자 ID로 검색
      update: updateData,  // 업데이트 데이터 (제공된 필드만)
      create: {
        id: user.id,  // Supabase auth user ID
        email: user.email || "",  // Supabase auth 이메일
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",  // 표시 이름
        height: height ?? undefined,  // 키 (있으면 포함, 없으면 제외)
        weight: weight ?? undefined,  // 몸무게 (있으면 포함, 없으면 제외)
        gender: gender ?? undefined,  // 성별 (있으면 포함, 없으면 제외)
        topSize: topSize ?? undefined,  // 상의 사이즈 (있으면 포함, 없으면 제외)
        bottomSize: bottomSize ?? undefined,  // 하의 사이즈 (있으면 포함, 없으면 제외)
        shoeSize: shoeSize ?? undefined,  // 신발 사이즈 (있으면 포함, 없으면 제외)
        encryptedMeasurements: encryptedMeasurements ?? undefined,  // 암호화된 정보 (있으면 포함, 없으면 제외)
      },
      select: {
        height: true,  // 반환: 키
        weight: true,  // 반환: 몸무게
        gender: true,  // 반환: 성별
        topSize: true,  // 반환: 상의 사이즈
        bottomSize: true,  // 반환: 하의 사이즈
        shoeSize: true,  // 반환: 신발 사이즈
        encryptedMeasurements: true,  // 반환: 암호화된 정보
      },
    });

    // ──────────────────────────────────────
    // 성공 응답: apiSuccess 헬퍼로 일관된 응답 형식
    // GET과 동일한 형식으로 반환
    // ──────────────────────────────────────
    return apiSuccess({
      height: updatedProfile.height ?? null,                      // 키: 설정되면 숫자, 미설정 시 null
      weight: updatedProfile.weight ?? null,                      // 몸무게: 설정되면 숫자, 미설정 시 null
      gender: updatedProfile.gender ?? null,                      // 성별: 설정되면 문자열, 미설정 시 null
      topSize: updatedProfile.topSize ?? null,                    // 상의 사이즈: 설정되면 문자열, 미설정 시 null
      bottomSize: updatedProfile.bottomSize ?? null,              // 하의 사이즈: 설정되면 문자열, 미설정 시 null
      shoeSize: updatedProfile.shoeSize ?? null,                  // 신발 사이즈: 설정되면 숫자, 미설정 시 null
      encryptedMeasurements: updatedProfile.encryptedMeasurements ?? null,  // 암호화된 정보: 설정되면 문자열, 미설정 시 null
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리: apiError 헬퍼로 일관된 에러 응답
    // ──────────────────────────────────────
    logger.error("[API/users/me/measurements]", "Measurements PATCH Error:", error);
    return apiError("사이즈 정보 업데이트에 실패했습니다.", 500, "MEASUREMENTS_UPDATE_ERROR");
  }
}

/**
 * 사용자의 신체 사이즈 정보 삭제 API 핸들러
 *
 * @description
 * DELETE /api/users/me/measurements에서 현재 로그인한 사용자의 모든 신체 사이즈 정보를 삭제합니다.
 * - Supabase Auth로 현재 사용자 확인 (로그인 필수)
 * - 모든 사이즈 필드를 null로 설정하여 삭제 표현 (soft delete pattern)
 * - 프로필 자체는 유지 (접근 가능)
 * - 삭제 완료 메시지 반환
 *
 * @returns {Promise<NextResponse>} JSON 응답 {success, message} 또는 에러 응답
 *
 * @example
 * // 사용자의 모든 신체 사이즈 정보 삭제
 * DELETE /api/users/me/measurements
 * Headers: Authorization: Bearer [session_token]
 * Response: {success: true, message: "사이즈 정보가 삭제되었습니다."}
 */
export async function DELETE() {
  try {
    // ──────────────────────────────────────
    // Rate Limiting: 분당 30회 제한
    // ──────────────────────────────────────
    const rateLimitCheck = await withRateLimit("default");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // ──────────────────────────────────────
    // 인증 확인: 로그인하지 않은 사용자 차단
    // requireAuth() 헬퍼로 일관된 인증 처리
    // ──────────────────────────────────────
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;  // 타입 안전한 User 객체

    // ──────────────────────────────────────
    // 모든 신체 사이즈 정보 삭제 (soft delete)
    // 프로필 자체는 유지, 모든 사이즈 필드만 null로 설정
    // 이렇게 함으로써 프로필 행은 유지되고 사이즈 정보만 제거됨
    // ──────────────────────────────────────
    await prisma.profile.update({
      where: { id: user.id },  // 조건: 현재 사용자 ID로 검색
      data: {
        height: null,                      // 키: null로 설정 (삭제)
        weight: null,                      // 몸무게: null로 설정 (삭제)
        gender: null,                      // 성별: null로 설정 (삭제)
        topSize: null,                     // 상의 사이즈: null로 설정 (삭제)
        bottomSize: null,                  // 하의 사이즈: null로 설정 (삭제)
        shoeSize: null,                    // 신발 사이즈: null로 설정 (삭제)
        encryptedMeasurements: null,       // 암호화된 정보: null로 설정 (삭제)
      },
    });

    // ──────────────────────────────────────
    // 성공 응답: 삭제 완료 메시지 반환
    // 데이터 조회 없이 바로 메시지만 반환
    // ──────────────────────────────────────
    return NextResponse.json({
      success: true,  // API 성공 플래그
      message: "사이즈 정보가 삭제되었습니다.",  // 사용자 친화적 메시지
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리: apiError 헬퍼로 일관된 에러 응답
    // ──────────────────────────────────────
    logger.error("[API/users/me/measurements]", "Measurements DELETE Error:", error);
    return apiError("사이즈 정보 삭제에 실패했습니다.", 500, "MEASUREMENTS_DELETE_ERROR");
  }
}
