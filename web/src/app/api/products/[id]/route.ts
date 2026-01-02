// ====================================
// TeddyBear's Room - Single Product Detail API
// 상품 상세 정보 조회 API (ID 기반)
// ====================================
//
// 🎯 용도:
// - ID를 기반으로 특정 상품의 상세 정보 조회
// - 프론트엔드 상품 상세 페이지에서 사용
// - 동적 라우트 [id]로 RESTful API 구현
//
// 📦 구조:
// - GET 핸들러: params.id 추출 (Promise 처리 필수)
// - Prisma findUnique(): ID로 단일 상품 조회
// - 404 처리: 상품 미존재 시 404 응답
// - JSON 응답: {success, data} 구조
//
// 🎨 디자인:
// - 동적 라우트: [id] 파라미터로 상품 ID 받음
// - 단일 상품 응답: 배열 아님, 단일 객체
// - 404 에러: 상품 없을 때 명확한 에러 응답
// - 500 에러: 데이터베이스 에러 시 500 응답
//
// 🔧 주요 기능:
// - ID 파라미터 파싱 (Next.js 15+ Promise 패턴)
// - Prisma findUnique로 효율적 단일 조회
// - 존재 여부 확인 + 404 처리
// - 에러 처리: try-catch로 500 에러 반환
// - 성인 상품 접근 제어 (성인인증 필요)
//
// 📝 의존성:
// - Prisma: product.findUnique() ORM
// - NextResponse: API 응답 포맷
// - NextServer: Request 및 params 타입
// - Adult Auth: optionalAdultVerification 헬퍼
// ====================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { optionalAdultVerification } from "@/lib/api/adult-auth";
import { apiError } from "@/lib/api/auth";
import { isAdultVerificationEnabled } from "@/lib/feature-flags";
import { ADULT_VERIFICATION, ERROR_MESSAGES } from "@/constants/adult-verification";

// 성인 전용 상품 카테고리 목록
// 참고: 성인용품 쇼핑몰이므로 기본적으로 모든 카테고리가 성인용
// 향후 비성인 카테고리(일반 상품, 건강용품 등) 추가 시 예외 처리 필요
const ADULT_ONLY_CATEGORIES: string[] = [
  // 현재는 모든 상품을 성인용으로 취급
  // 추후 비성인 카테고리 추가 시 이 배열에서 제외할 카테고리 정의
];

// 비성인 카테고리 (성인인증 없이 접근 가능)
const NON_ADULT_CATEGORIES: string[] = [
  // "general", "health", "beauty" 등 추가 가능
];

/**
 * 상품이 성인 전용인지 확인
 *
 * @param category - 상품 카테고리
 * @returns 성인 전용 상품이면 true
 *
 * @description
 * - TeddyBear's Room은 성인용품 쇼핑몰이므로 기본적으로 모든 상품이 성인용
 * - NON_ADULT_CATEGORIES에 포함된 카테고리만 비성인용으로 취급
 */
function isAdultOnlyProduct(category: string): boolean {
  // 비성인 카테고리에 포함되면 false
  if (NON_ADULT_CATEGORIES.includes(category)) {
    return false;
  }

  // 기본값: 모든 상품은 성인용
  return true;
}

/**
 * 특정 상품 상세 정보 조회 API 핸들러
 *
 * @description
 * GET /api/products/[id]에서 상품 ID를 받아 단일 상품의 상세 정보를 반환합니다.
 * - params.id는 Next.js 15+ 에서 Promise로 제공됨 (await 필수)
 * - Prisma findUnique로 ID 기반 단일 조회 (효율적)
 * - 상품이 없으면 404 Not Found 응답
 * - 데이터베이스 에러는 500 Internal Server Error
 *
 * @param {Request} request - Next.js Request 객체 (사용하지 않음)
 * @param {Object} params - Next.js 동적 라우트 파라미터 객체
 * @param {Promise<{id: string}>} params.params - 동적 라우트 params (Promise)
 * @returns {Promise<NextResponse>} JSON 응답 {success, data} 또는 에러 응답
 *
 * @example
 * // 상품 상세 조회
 * GET /api/products/prod_123
 * Response: {success: true, data: {id, name, price, ...}}
 *
 * // 상품 없을 때
 * GET /api/products/nonexistent_id
 * Response: {success: false, error: "상품을 찾을 수 없습니다."} (404)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Next.js 15+: params는 Promise
) {
  try {
    // ──────────────────────────────────────
    // 동적 라우트 파라미터 추출
    // Next.js 15+에서는 params가 Promise이므로 await 필수
    // ──────────────────────────────────────
    const { id } = await params;  // 상품 ID 추출 (문자열)

    // ──────────────────────────────────────
    // 데이터베이스에서 상품 조회
    // findUnique: 고유 ID로 단일 상품 조회 (가장 효율적)
    // 결과: Product 객체 또는 null
    // ──────────────────────────────────────
    const product = await prisma.product.findUnique({
      where: { id },  // 조건: id 필드로 정확히 일치하는 행 검색
    });

    // ──────────────────────────────────────
    // 404 Not Found 처리
    // 상품이 존재하지 않으면 404 응답 반환
    // ──────────────────────────────────────
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "상품을 찾을 수 없습니다.",  // 사용자 친화적 메시지
        },
        { status: 404 }  // HTTP 404 Not Found
      );
    }

    // ──────────────────────────────────────
    // 성인 상품 접근 제어
    // 성인 전용 상품은 성인인증이 필요합니다.
    // ──────────────────────────────────────
    if (isAdultVerificationEnabled() && isAdultOnlyProduct(product.category)) {
      const adultAuth = await optionalAdultVerification();

      // 로그인하지 않았거나 성인인증이 안 된 경우
      if (!adultAuth.isAuthenticated) {
        return apiError(
          "로그인이 필요합니다.",
          401,
          "UNAUTHORIZED"
        );
      }

      if (!adultAuth.isAdultVerified) {
        return apiError(
          ERROR_MESSAGES[ADULT_VERIFICATION.ERROR_CODES.ADULT_VERIFICATION_REQUIRED],
          403,
          ADULT_VERIFICATION.ERROR_CODES.ADULT_VERIFICATION_REQUIRED
        );
      }
    }

    // ──────────────────────────────────────
    // 성공 응답
    // {success: true, data: 상품 객체}
    // ──────────────────────────────────────
    return NextResponse.json({
      success: true,      // API 성공 플래그
      data: product,      // 조회된 상품 객체 (id, name, price, description 등)
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리
    // 데이터베이스 에러 또는 다른 예외 발생 시 500 응답
    // ──────────────────────────────────────
    logger.error("[API/products]", "Product Detail API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "상품을 불러오는데 실패했습니다.",  // 사용자 친화적 에러 메시지
      },
      { status: 500 }  // HTTP 500 Internal Server Error
    );
  }
}
