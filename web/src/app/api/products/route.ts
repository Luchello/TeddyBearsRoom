// ====================================
// TeddyBear's Room - Products API Routes
// 상품 목록 조회 API (필터링, 정렬, 페이지네이션)
// ====================================
//
// 🎯 용도:
// - 상품 목록을 카테고리/정렬/필터로 조회
// - 프론트엔드의 상품 페이지, 검색 결과에서 사용
// - 쿼리 파라미터로 동적 필터링 지원
//
// 📦 구조:
// - GET 핸들러: searchParams 파싱 (category, sort, new, best, page, limit)
// - where 절 빌드: 필터 조건 (카테고리, 신상품, 베스트)
// - orderBy 절 빌드: 정렬 옵션 (최신순, 가격 낮은순, 가격 높은순)
// - Prisma findMany(): 조건에 맞는 상품 조회 (with pagination)
// - JSON 응답: success, data, pagination 메타데이터
//
// 🎨 디자인:
// - Query Parameter 기반 필터링 (URL 쿼리스트링)
// - 다중 필터 조합 가능 (category + sort + new/best)
// - 기본 정렬: 최신순 (createdAt desc)
// - 기본 페이지네이션: page=1, limit=20 (max 100)
//
// 🔧 주요 기능:
// - category: "전체" 제외한 특정 카테고리만 필터
// - sort: "price-low", "price-high", "latest" 옵션
// - new: true이면 isNew=true 상품만 필터
// - best: true이면 isBest=true 상품만 필터
// - page: 페이지 번호 (1부터 시작, 기본값 1)
// - limit: 페이지당 항목 수 (기본 20, 최대 100)
// - 에러 처리: try-catch로 500 에러 반환
//
// 📝 의존성:
// - Prisma: product.findMany(), product.count() ORM
// - NextResponse: API 응답 포맷
// - NextServer: Request 타입
// ====================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * 상품 목록 조회 API 핸들러
 *
 * @description
 * GET /api/products에서 쿼리 파라미터를 기반으로 상품 목록을 조회합니다.
 * - 카테고리 필터: category 파라미터로 특정 카테고리 상품만 조회
 * - 정렬: sort 파라미터 (price-low, price-high, latest)
 * - 플래그: new=true (신상품), best=true (베스트상품)
 * - 페이지네이션: page (기본 1), limit (기본 20, 최대 100)
 * - 조합 필터링: 모든 파라미터를 AND 조건으로 결합
 *
 * @param {Request} request - Next.js Request 객체 (URL 쿼리스트링 포함)
 * @returns {Promise<NextResponse>} JSON 응답 {success, data, pagination} 또는 에러 응답
 *
 * @example
 * // 기본 조회 (최신순, 페이지 1, 20개)
 * GET /api/products
 *
 * // 페이지네이션
 * GET /api/products?page=2&limit=12
 *
 * // 카테고리 필터 + 페이지네이션
 * GET /api/products?category=바디토너&page=1&limit=24
 *
 * // 다중 필터
 * GET /api/products?category=바디토너&sort=price-low&new=true&page=1
 *
 * // 정렬 옵션
 * GET /api/products?sort=price-high  (가격 높은순)
 * GET /api/products?sort=price-low   (가격 낮은순)
 * GET /api/products?sort=latest      (최신순)
 */
export async function GET(request: Request) {
  try {
    // ──────────────────────────────────────
    // 쿼리 파라미터 파싱
    // URL에서 searchParams를 추출하여 필터 조건 변수로 저장
    // ──────────────────────────────────────
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");           // 카테고리 필터 (예: "바디토너", "윤활제")
    const sort = searchParams.get("sort");                   // 정렬 옵션 (price-low, price-high, latest)
    const showNew = searchParams.get("new") === "true";      // 신상품 플래그 (boolean)
    const showBest = searchParams.get("best") === "true";    // 베스트상품 플래그 (boolean)

    // ──────────────────────────────────────
    // 페이지네이션 파라미터 파싱
    // page: 1부터 시작 (기본값 1)
    // limit: 페이지당 항목 수 (기본 20, 최대 100)
    // ──────────────────────────────────────
    const DEFAULT_LIMIT = 20;
    const MAX_LIMIT = 100;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limitParam || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    // ──────────────────────────────────────
    // where 절 빌드 (필터 조건)
    // Prisma WHERE 절을 동적으로 생성
    // 파라미터가 없으면 빈 객체 (모든 상품 조회)
    // ──────────────────────────────────────
    const where: {
      category?: string;    // 카테고리 필터
      isNew?: boolean;      // 신상품 필터 (isNew = true)
      isBest?: boolean;     // 베스트상품 필터 (isBest = true)
    } = {};

    // 카테고리 필터: "전체"가 아니고 값이 있으면 where.category 추가
    // (AND 조건: 다른 필터와 함께 작동)
    if (category && category !== "전체") {
      where.category = category;
    }

    // 신상품 필터: showNew=true이면 where.isNew = true 추가
    if (showNew) {
      where.isNew = true;
    }

    // 베스트상품 필터: showBest=true이면 where.isBest = true 추가
    if (showBest) {
      where.isBest = true;
    }

    // ──────────────────────────────────────
    // orderBy 절 빌드 (정렬 조건)
    // sort 파라미터 값에 따라 다른 정렬 옵션 적용
    // 기본값: 최신순 (createdAt desc)
    // ──────────────────────────────────────
    let orderBy: { price?: "asc" | "desc"; createdAt?: "desc" } = { createdAt: "desc" };

    switch (sort) {
      case "price-low":
        // 가격 낮은순 정렬 (오름차순)
        orderBy = { price: "asc" };
        break;
      case "price-high":
        // 가격 높은순 정렬 (내림차순)
        orderBy = { price: "desc" };
        break;
      case "latest":
      default:
        // 최신순 정렬 (최신 상품부터, 기본값)
        orderBy = { createdAt: "desc" };
    }

    // ──────────────────────────────────────
    // 데이터베이스 조회 (병렬 실행)
    // 1. 필터 조건에 맞는 상품 조회 (with pagination)
    // 2. 전체 개수 조회 (페이지네이션 메타데이터용)
    // ──────────────────────────────────────
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,        // 필터 조건 (category, isNew, isBest)
        orderBy,      // 정렬 조건 (price asc/desc, createdAt desc)
        skip,         // 페이지네이션: 건너뛸 항목 수
        take: limit,  // 페이지네이션: 가져올 항목 수
      }),
      prisma.product.count({ where }),  // 필터 조건에 맞는 총 상품 수
    ]);

    // ──────────────────────────────────────
    // 페이지네이션 메타데이터 계산
    // ──────────────────────────────────────
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // ──────────────────────────────────────
    // 성공 응답
    // {success, data, pagination} 구조
    // 하위 호환성: count 필드 유지
    // ──────────────────────────────────────
    return NextResponse.json({
      success: true,                // API 성공 플래그
      data: products,               // 조회된 상품 배열
      count: products.length,       // 현재 페이지 상품 개수 (하위 호환성)
      pagination: {
        page,                       // 현재 페이지 번호
        limit,                      // 페이지당 항목 수
        totalCount,                 // 필터 조건에 맞는 전체 상품 수
        totalPages,                 // 전체 페이지 수
        hasNextPage,                // 다음 페이지 존재 여부
        hasPreviousPage,            // 이전 페이지 존재 여부
      },
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리
    // try-catch로 데이터베이스 에러 발생 시 처리
    // 500 Internal Server Error 반환 + 에러 로깅
    // ──────────────────────────────────────
    logger.error("[API/products]", "Products API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "상품 목록을 불러오는데 실패했습니다.",  // 사용자 친화적 에러 메시지
      },
      { status: 500 }  // HTTP 500 Internal Server Error
    );
  }
}
