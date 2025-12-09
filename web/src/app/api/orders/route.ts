// ====================================
// TeddyBear's Room - Orders API Routes
// 주문 관리 API (조회, 생성)
// ====================================
//
// 🎯 용도:
// - GET: 현재 로그인 사용자의 주문 목록 조회
// - POST: 새로운 주문 생성 (장바구니 → 주문으로)
// - 로그인 필수 (Supabase Auth 기반)
//
// 📦 구조:
// - GET 핸들러: 로그인 확인 → Prisma findMany로 사용자 주문 조회
// - POST 핸들러: 로그인 확인 → 요청 바디 파싱 → 상품 검증 → 주문 생성
// - 인증: Supabase 세션에서 user.id 추출
// - 응답: {success, data} 구조 (성공) 또는 에러 메시지
//
// 🎨 디자인:
// - 인증 필수: 로그인하지 않은 사용자 401 Unauthorized
// - GET: 최신순 정렬, orderItems 및 product 정보 포함
// - POST: items 배열 필수, 가격 계산, 주문 생성
// - 에러: 400 Bad Request (유효성), 401 Unauthorized, 500 Internal Error
//
// 🔧 주요 기능:
// - GET: Supabase 세션 확인 → 사용자의 모든 주문 조회
// - POST: 요청 검증 → 각 상품 가격 확인 → 총액 계산 → 주문 저장
// - 트랜잭션: Prisma create로 order + orderItems 동시 생성
// - 응답: orderItems와 product 정보 포함 (상세 주문 정보)
//
// 📝 의존성:
// - Supabase: createClient (서버사이드), getUser (인증 확인)
// - Prisma: order, orderItems, product 모델
// - NextResponse: API 응답 포맷
// ====================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

/**
 * 사용자의 주문 목록 조회 API 핸들러
 *
 * @description
 * GET /api/orders에서 현재 로그인한 사용자의 모든 주문을 조회합니다.
 * - Supabase Auth로 현재 사용자 확인 (로그인 필수)
 * - Prisma findMany로 사용자의 모든 주문 조회
 * - orderItems와 product 정보를 포함 (nested include)
 * - 최신순 정렬 (createdAt desc)
 *
 * @returns {Promise<NextResponse>} JSON 응답 {success, data} 또는 에러 응답
 *
 * @example
 * // 사용자의 주문 목록 조회
 * GET /api/orders
 * Headers: Authorization: Bearer [session_token]
 * Response: {success: true, data: [{id, totalPrice, orderItems: [{product}]}]}
 */
export async function GET() {
  try {
    // ──────────────────────────────────────
    // Supabase 서버 클라이언트 생성 및 사용자 확인
    // 서버사이드 클라이언트로 쿠키 기반 세션 인증
    // ──────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();  // 현재 로그인 사용자 정보

    // ──────────────────────────────────────
    // 인증 확인: 로그인하지 않은 사용자 차단
    // ──────────────────────────────────────
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "로그인이 필요합니다.",  // 사용자 친화적 메시지
        },
        { status: 401 }  // HTTP 401 Unauthorized
      );
    }

    // ──────────────────────────────────────
    // 사용자의 주문 목록 조회
    // findMany: 사용자 ID로 조건 필터링, orderItems와 product 정보 포함
    // include: nested association 정보도 함께 로드
    // orderBy: 최신 주문부터 표시 (createdAt desc)
    // ──────────────────────────────────────
    const orders = await prisma.order.findMany({
      where: { profileId: user.id },  // 조건: 현재 사용자의 주문만 조회
      include: {
        orderItems: {                   // 포함: 주문 항목들
          include: {
            product: true,              // 포함: 각 항목의 상품 정보
          },
        },
      },
      orderBy: { createdAt: "desc" },  // 정렬: 최신 주문부터
    });

    // ──────────────────────────────────────
    // 성공 응답
    // ──────────────────────────────────────
    return NextResponse.json({
      success: true,      // API 성공 플래그
      data: orders,       // 조회된 주문 배열 (orderItems 및 product 정보 포함)
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리
    // 데이터베이스 에러 또는 Supabase 에러 시 500 응답
    // ──────────────────────────────────────
    console.error("Orders GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "주문 목록을 불러오는데 실패했습니다.",  // 사용자 친화적 에러 메시지
      },
      { status: 500 }  // HTTP 500 Internal Server Error
    );
  }
}

/**
 * 새로운 주문 생성 API 핸들러
 *
 * @description
 * POST /api/orders에서 장바구니 항목들로부터 새로운 주문을 생성합니다.
 * - Supabase Auth로 현재 사용자 확인 (로그인 필수)
 * - 요청 바디에서 items 배열 파싱 및 유효성 검사
 * - 각 상품의 현재 가격을 DB에서 확인 (가격 변동 대응)
 * - 총액 계산 (상품가 × 수량)
 * - Prisma create로 order + orderItems를 단일 트랜잭션으로 생성
 * - orderItems와 product 정보를 포함한 상세 주문 정보 반환
 *
 * @param {Request} request - Next.js Request 객체 (JSON body 포함)
 * @returns {Promise<NextResponse>} JSON 응답 {success, data} 또는 에러 응답
 *
 * @example
 * // 주문 생성 예시
 * POST /api/orders
 * Headers: Authorization: Bearer [session_token]
 * Body: {
 *   items: [
 *     { productId: "prod_123", quantity: 2 },
 *     { productId: "prod_456", quantity: 1 }
 *   ],
 *   shippingAddress: "서울시 강남구...",
 *   shippingMemo: "배송 참고사항"
 * }
 * Response: {success: true, data: {id, totalPrice, orderItems: [{product}]}}
 */
export async function POST(request: Request) {
  try {
    // ──────────────────────────────────────
    // Supabase 서버 클라이언트 생성 및 사용자 확인
    // 서버사이드 클라이언트로 쿠키 기반 세션 인증
    // ──────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();  // 현재 로그인 사용자 정보

    // ──────────────────────────────────────
    // 인증 확인: 로그인하지 않은 사용자 차단
    // ──────────────────────────────────────
    if (!user) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },  // 사용자 친화적 메시지
        { status: 401 }  // HTTP 401 Unauthorized
      );
    }

    // ──────────────────────────────────────
    // 요청 바디 파싱 및 값 추출
    // items: 주문에 포함할 상품 배열 [{productId, quantity}, ...]
    // shippingAddress: 배송 주소
    // shippingMemo: 배송 시 참고사항 메모
    // ──────────────────────────────────────
    const body = await request.json();
    const { items, shippingAddress, shippingMemo } = body;

    // ──────────────────────────────────────
    // 주문 상품 유효성 검사
    // items 배열이 필수이고, 비어있으면 안됨
    // ──────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "주문 상품이 없습니다." },  // 사용자 친화적 에러 메시지
        { status: 400 }  // HTTP 400 Bad Request
      );
    }

    // ──────────────────────────────────────
    // 총액 계산 및 주문 항목 빌드
    // 각 상품을 DB에서 조회하여 현재 가격 확인
    // 장바구니와 DB의 가격 불일치 대응 (가격 변동 대응)
    // ──────────────────────────────────────
    let totalPrice = 0;  // 주문 총액 누적
    const orderItems = [];  // 주문 항목 배열 (create용)

    // 각 상품별로 가격 확인 및 총액 계산
    for (const item of items) {
      // 상품 ID로 DB에서 상품 조회
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      // 상품이 존재하지 않으면 400 에러 응답
      if (!product) {
        return NextResponse.json(
          { success: false, error: `상품을 찾을 수 없습니다: ${item.productId}` },  // 어떤 상품이 없는지 명시
          { status: 400 }  // HTTP 400 Bad Request
        );
      }

      // 항목 총액: 상품 가격 × 주문 수량
      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;  // 전체 총액에 누적

      // orderItems 배열에 주문 항목 추가
      // 현재 DB의 가격을 사용 (클라이언트에서 보낸 가격 무시)
      orderItems.push({
        productId: product.id,  // 상품 ID
        quantity: item.quantity,  // 주문 수량
        price: product.price,  // 현재 상품 가격 (DB에서 조회한 가격)
      });
    }

    // ──────────────────────────────────────
    // 주문 생성 (트랜잭션)
    // Prisma create로 order와 orderItems를 동시에 생성
    // include로 생성된 주문의 orderItems와 product 정보도 함께 로드
    // ──────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        profileId: user.id,  // 현재 사용자 ID (프로필 외래키)
        totalPrice,  // 계산된 총액
        shippingAddress,  // 배송 주소
        shippingMemo,  // 배송 참고사항
        orderItems: {
          create: orderItems,  // orderItems 중첩 생성 (order와 동시 생성)
        },
      },
      include: {
        orderItems: {  // 포함: 주문 항목들
          include: {
            product: true,  // 포함: 각 항목의 상품 정보 (상품명, 가격 등)
          },
        },
      },
    });

    // ──────────────────────────────────────
    // 성공 응답
    // 생성된 주문 정보 (orderItems와 product 정보 포함) 반환
    // ──────────────────────────────────────
    return NextResponse.json({
      success: true,  // API 성공 플래그
      data: order,  // 생성된 주문 객체 (id, totalPrice, orderItems 포함)
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리
    // 데이터베이스 에러 또는 Supabase 에러 시 500 응답
    // ──────────────────────────────────────
    console.error("Orders POST Error:", error);  // 서버 로그에 상세 에러 기록
    return NextResponse.json(
      {
        success: false,
        error: "주문 생성에 실패했습니다.",  // 사용자 친화적 에러 메시지
      },
      { status: 500 }  // HTTP 500 Internal Server Error
    );
  }
}
