// ====================================
// TeddyBear's Room - Cart API Routes
// 장바구니 관리 API (조회, 추가, 수정, 삭제)
// ====================================
//
// 용도:
// - GET: 현재 로그인 사용자의 장바구니 조회
// - POST: 장바구니에 상품 추가
// - PATCH: 장바구니 상품 수량 수정
// - DELETE: 장바구니에서 상품 삭제
// - 로그인 필수 (Supabase Auth 기반)
// - 성인 상품 추가 시 성인인증 체크
//
// ====================================

import prisma from "@/lib/prisma";
import { z } from "zod";
import { requireAuth, apiError, apiSuccess } from "@/lib/api/auth";
import { requireAdultVerification } from "@/lib/api/adult-auth";
import { withRateLimit } from "@/lib/api/rate-limit";
import { logger } from "@/lib/logger";
import { isAdultVerificationEnabled } from "@/lib/feature-flags";

// ──────────────────────────────────────
// 성인 상품 판별 로직
// ──────────────────────────────────────

// 비성인 카테고리 (성인인증 없이 장바구니 추가 가능)
const NON_ADULT_CATEGORIES: string[] = [
  // "general", "health", "beauty" 등 추가 가능
];

/**
 * 상품이 성인 전용인지 확인
 */
function isAdultOnlyProduct(category: string): boolean {
  if (NON_ADULT_CATEGORIES.includes(category)) {
    return false;
  }
  // 기본값: 모든 상품은 성인용 (성인용품 쇼핑몰)
  return true;
}

// ──────────────────────────────────────
// Zod Validation Schemas
// ──────────────────────────────────────

/**
 * 장바구니 추가 요청 스키마
 */
const AddToCartSchema = z.object({
  productId: z.string().uuid("유효하지 않은 상품 ID입니다."),
  quantity: z
    .number()
    .int("수량은 정수여야 합니다.")
    .min(1, "수량은 최소 1개 이상이어야 합니다.")
    .max(99, "수량은 최대 99개까지 가능합니다.")
    .default(1),
});

/**
 * 장바구니 수정 요청 스키마
 */
const UpdateCartSchema = z.object({
  cartItemId: z.string().uuid("유효하지 않은 장바구니 항목 ID입니다."),
  quantity: z
    .number()
    .int("수량은 정수여야 합니다.")
    .min(1, "수량은 최소 1개 이상이어야 합니다.")
    .max(99, "수량은 최대 99개까지 가능합니다."),
});

/**
 * 장바구니 삭제 요청 스키마 (쿼리 파라미터)
 */
const DeleteCartSchema = z.object({
  cartItemId: z.string().uuid("유효하지 않은 장바구니 항목 ID입니다."),
});

// ──────────────────────────────────────
// GET: 장바구니 조회
// ──────────────────────────────────────

/**
 * 사용자의 장바구니 목록 조회 API 핸들러
 *
 * @description
 * GET /api/cart에서 현재 로그인한 사용자의 장바구니를 조회합니다.
 */
export async function GET() {
  try {
    // Rate Limiting
    const rateLimitCheck = await withRateLimit("default");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;

    // 장바구니 조회 (상품 정보 포함)
    const cartItems = await prisma.cartItem.findMany({
      where: { profileId: user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(cartItems);
  } catch (error) {
    logger.error("[API/cart]", "Cart GET Error:", error);
    return apiError("장바구니를 불러오는데 실패했습니다.", 500, "CART_FETCH_ERROR");
  }
}

// ──────────────────────────────────────
// POST: 장바구니에 상품 추가
// ──────────────────────────────────────

/**
 * 장바구니에 상품 추가 API 핸들러
 *
 * @description
 * POST /api/cart에서 장바구니에 상품을 추가합니다.
 * - 성인 상품 추가 시 성인인증 체크
 * - 이미 있는 상품이면 수량 증가
 */
export async function POST(request: Request) {
  try {
    // Rate Limiting
    const rateLimitCheck = await withRateLimit("cart");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;

    // 요청 바디 파싱 및 검증
    const body = await request.json();
    const parseResult = AddToCartSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return apiError(
        `${firstIssue.message} (필드: ${firstIssue.path.join(".")})`,
        400,
        "VALIDATION_ERROR"
      );
    }

    const { productId, quantity } = parseResult.data;

    // 상품 조회
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return apiError("상품을 찾을 수 없습니다.", 404, "PRODUCT_NOT_FOUND");
    }

    // ──────────────────────────────────────
    // 성인 상품 추가 시 성인인증 체크
    // ──────────────────────────────────────
    if (isAdultVerificationEnabled() && isAdultOnlyProduct(product.category)) {
      const adultAuthResult = await requireAdultVerification();
      if (!adultAuthResult.success) {
        // 성인인증 필요 또는 만료 에러 반환
        return adultAuthResult.response;
      }
    }

    // 재고 확인
    if (product.stock < quantity) {
      return apiError(
        `재고가 부족합니다. (현재 재고: ${product.stock}개)`,
        400,
        "INSUFFICIENT_STOCK"
      );
    }

    // 이미 장바구니에 있는지 확인
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        profileId_productId: {
          profileId: user.id,
          productId: productId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      // 이미 있으면 수량 증가
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity > 99) {
        return apiError(
          "장바구니 상품 수량은 최대 99개까지 가능합니다.",
          400,
          "MAX_QUANTITY_EXCEEDED"
        );
      }

      if (newQuantity > product.stock) {
        return apiError(
          `재고가 부족합니다. (현재 재고: ${product.stock}개)`,
          400,
          "INSUFFICIENT_STOCK"
        );
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      // 새로 추가
      cartItem = await prisma.cartItem.create({
        data: {
          profileId: user.id,
          productId: productId,
          quantity: quantity,
        },
        include: { product: true },
      });
    }

    return apiSuccess(cartItem, 201);
  } catch (error) {
    logger.error("[API/cart]", "Cart POST Error:", error);
    return apiError("장바구니에 상품을 추가하는데 실패했습니다.", 500, "CART_ADD_ERROR");
  }
}

// ──────────────────────────────────────
// PATCH: 장바구니 수량 수정
// ──────────────────────────────────────

/**
 * 장바구니 상품 수량 수정 API 핸들러
 *
 * @description
 * PATCH /api/cart에서 장바구니 상품의 수량을 수정합니다.
 */
export async function PATCH(request: Request) {
  try {
    // Rate Limiting
    const rateLimitCheck = await withRateLimit("cart");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;

    // 요청 바디 파싱 및 검증
    const body = await request.json();
    const parseResult = UpdateCartSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return apiError(
        `${firstIssue.message} (필드: ${firstIssue.path.join(".")})`,
        400,
        "VALIDATION_ERROR"
      );
    }

    const { cartItemId, quantity } = parseResult.data;

    // 장바구니 항목 조회 (소유권 확인)
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        profileId: user.id,
      },
      include: { product: true },
    });

    if (!cartItem) {
      return apiError("장바구니 항목을 찾을 수 없습니다.", 404, "CART_ITEM_NOT_FOUND");
    }

    // 재고 확인
    if (cartItem.product.stock < quantity) {
      return apiError(
        `재고가 부족합니다. (현재 재고: ${cartItem.product.stock}개)`,
        400,
        "INSUFFICIENT_STOCK"
      );
    }

    // 수량 업데이트
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });

    return apiSuccess(updatedCartItem);
  } catch (error) {
    logger.error("[API/cart]", "Cart PATCH Error:", error);
    return apiError("장바구니 수정에 실패했습니다.", 500, "CART_UPDATE_ERROR");
  }
}

// ──────────────────────────────────────
// DELETE: 장바구니에서 상품 삭제
// ──────────────────────────────────────

/**
 * 장바구니 상품 삭제 API 핸들러
 *
 * @description
 * DELETE /api/cart?cartItemId=xxx에서 장바구니 상품을 삭제합니다.
 */
export async function DELETE(request: Request) {
  try {
    // Rate Limiting
    const rateLimitCheck = await withRateLimit("cart");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;

    // 쿼리 파라미터에서 cartItemId 추출
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("cartItemId");

    // 검증
    const parseResult = DeleteCartSchema.safeParse({ cartItemId });
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return apiError(
        `${firstIssue.message}`,
        400,
        "VALIDATION_ERROR"
      );
    }

    // 장바구니 항목 조회 (소유권 확인)
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: parseResult.data.cartItemId,
        profileId: user.id,
      },
    });

    if (!cartItem) {
      return apiError("장바구니 항목을 찾을 수 없습니다.", 404, "CART_ITEM_NOT_FOUND");
    }

    // 삭제
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    logger.error("[API/cart]", "Cart DELETE Error:", error);
    return apiError("장바구니 삭제에 실패했습니다.", 500, "CART_DELETE_ERROR");
  }
}
