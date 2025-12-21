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

import prisma from "@/lib/prisma";
import { z } from "zod";
import { requireAuth, apiError, apiSuccess } from "@/lib/api/auth";
import { withRateLimit } from "@/lib/api/rate-limit";
import { logger } from "@/lib/logger";

// ──────────────────────────────────────
// Zod Validation Schemas
// 주문 생성 요청 유효성 검사
// ──────────────────────────────────────

/**
 * 주문 항목 스키마
 * productId: UUID 형식의 상품 ID (필수)
 * quantity: 1~99 범위의 양의 정수 (필수)
 */
const OrderItemSchema = z.object({
  productId: z.string().uuid("유효하지 않은 상품 ID입니다."),
  quantity: z
    .number()
    .int("수량은 정수여야 합니다.")
    .min(1, "수량은 최소 1개 이상이어야 합니다.")
    .max(99, "수량은 최대 99개까지 가능합니다."),
});

/**
 * 주문 생성 요청 스키마
 * items: 최소 1개 이상의 주문 항목 배열 (필수)
 * shippingAddress: 배송 주소 (선택, 최대 500자)
 * shippingMemo: 배송 메모 (선택, 최대 200자)
 */
const CreateOrderSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, "주문 상품이 없습니다.")
    .max(50, "한 번에 최대 50개 상품까지 주문 가능합니다."),
  shippingAddress: z
    .string()
    .max(500, "주소는 최대 500자까지 입력 가능합니다.")
    .optional(),
  shippingMemo: z
    .string()
    .max(200, "배송 메모는 최대 200자까지 입력 가능합니다.")
    .optional(),
});

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
    // 성공 응답: apiSuccess 헬퍼로 일관된 응답 형식
    // ──────────────────────────────────────
    return apiSuccess(orders);
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리: apiError 헬퍼로 일관된 에러 응답
    // ──────────────────────────────────────
    logger.error("[API/orders]", "Orders GET Error:", error);
    return apiError("주문 목록을 불러오는데 실패했습니다.", 500, "ORDERS_FETCH_ERROR");
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
    // Rate Limiting: 분당 10회 제한 (주문 생성은 더 엄격)
    // ──────────────────────────────────────
    const rateLimitCheck = await withRateLimit("orders");
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
    // CreateOrderSchema로 타입 안전한 검증 수행
    // ──────────────────────────────────────
    const body = await request.json();
    const parseResult = CreateOrderSchema.safeParse(body);

    if (!parseResult.success) {
      // Zod validation 실패: 첫 번째 에러 메시지 반환
      // Zod 4.x: error.issues 사용 (error.errors 대신)
      const firstIssue = parseResult.error.issues[0];
      return apiError(
        `${firstIssue.message} (필드: ${firstIssue.path.join(".")})`,
        400,
        "VALIDATION_ERROR"
      );
    }

    // 검증된 데이터 추출 (타입 안전)
    const { items, shippingAddress, shippingMemo } = parseResult.data;

    // ──────────────────────────────────────
    // 총액 계산 및 주문 항목 빌드
    // N+1 쿼리 방지: 모든 상품을 단일 쿼리로 조회
    // 장바구니와 DB의 가격 불일치 대응 (가격 변동 대응)
    // ──────────────────────────────────────

    // 모든 상품 ID 추출 (중복 제거)
    // Zod 검증으로 items 타입이 보장됨
    const productIds = [...new Set(items.map((item) => item.productId))];

    // 단일 쿼리로 모든 상품 조회 (N+1 → 1 쿼리)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // O(1) 조회를 위한 Map 생성
    const productMap = new Map(products.map((p) => [p.id, p]));

    // 존재하지 않는 상품 확인
    const missingProductIds = productIds.filter((id) => !productMap.has(id));
    if (missingProductIds.length > 0) {
      return apiError(
        `상품을 찾을 수 없습니다: ${missingProductIds.join(", ")}`,
        400,
        "PRODUCT_NOT_FOUND"
      );
    }

    // 총액 계산 및 주문 항목 빌드
    let totalPrice = 0;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,  // 현재 DB 가격 사용 (클라이언트 가격 무시)
      };
    });

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
    // 성공 응답: apiSuccess 헬퍼로 일관된 응답 형식
    // 생성된 주문 정보 (orderItems와 product 정보 포함) 반환
    // ──────────────────────────────────────
    return apiSuccess(order, 201);  // HTTP 201 Created
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리: apiError 헬퍼로 일관된 에러 응답
    // ──────────────────────────────────────
    logger.error("[API/orders]", "Orders POST Error:", error);
    return apiError("주문 생성에 실패했습니다.", 500, "ORDER_CREATE_ERROR");
  }
}
