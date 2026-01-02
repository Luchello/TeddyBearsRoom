/**
 * Order Detail API
 * TeddyBear's Room - 주문 상세 조회/취소 API
 */

import prisma from "@/lib/prisma";
import { requireAuth, apiError, apiSuccess } from "@/lib/api/auth";
import { withRateLimit } from "@/lib/api/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

// UUID 검증 스키마
const OrderIdSchema = z.string().uuid("유효하지 않은 주문 ID입니다.");

// 취소 가능한 주문 상태
const CANCELLABLE_STATUSES = ["PENDING", "PAID"] as const;

/**
 * 주문 상세 조회 API
 * GET /api/orders/[id]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate Limiting
    const rateLimitCheck = await withRateLimit("default");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;
    const { id } = await params;

    // ID 유효성 검사
    const idValidation = OrderIdSchema.safeParse(id);
    if (!idValidation.success) {
      return apiError("유효하지 않은 주문 ID입니다.", 400, "INVALID_ORDER_ID");
    }

    // 주문 조회 (본인 주문만)
    const order = await prisma.order.findFirst({
      where: {
        id: id,
        profileId: user.id, // 본인 주문만 조회 가능
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return apiError("주문을 찾을 수 없습니다.", 404, "ORDER_NOT_FOUND");
    }

    return apiSuccess(order);
  } catch (error) {
    logger.error("[API/orders/[id]]", "Order GET Error:", error);
    return apiError("주문 정보를 불러오는데 실패했습니다.", 500, "ORDER_FETCH_ERROR");
  }
}

/**
 * 주문 취소 API
 * PATCH /api/orders/[id]
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate Limiting
    const rateLimitCheck = await withRateLimit("default");
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 인증 확인
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    const user = authResult.user;
    const { id } = await params;

    // ID 유효성 검사
    const idValidation = OrderIdSchema.safeParse(id);
    if (!idValidation.success) {
      return apiError("유효하지 않은 주문 ID입니다.", 400, "INVALID_ORDER_ID");
    }

    // 요청 바디 파싱
    const body = await request.json();
    const { action } = body;

    if (action !== "cancel") {
      return apiError("지원하지 않는 작업입니다.", 400, "INVALID_ACTION");
    }

    // 주문 조회 (본인 주문만)
    const order = await prisma.order.findFirst({
      where: {
        id: id,
        profileId: user.id,
      },
    });

    if (!order) {
      return apiError("주문을 찾을 수 없습니다.", 404, "ORDER_NOT_FOUND");
    }

    // 취소 가능 상태 확인
    if (!CANCELLABLE_STATUSES.includes(order.status as typeof CANCELLABLE_STATUSES[number])) {
      return apiError(
        "이 주문은 취소할 수 없습니다. 배송 준비 중 이후에는 고객센터로 문의해주세요.",
        400,
        "ORDER_NOT_CANCELLABLE"
      );
    }

    // 주문 취소 처리
    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status: "CANCELLED" },
    });

    logger.info("[API/orders/[id]]", `Order cancelled: ${id} by user: ${user.id}`);

    return apiSuccess({
      message: "주문이 취소되었습니다.",
      order: updatedOrder,
    });
  } catch (error) {
    logger.error("[API/orders/[id]]", "Order PATCH Error:", error);
    return apiError("주문 취소에 실패했습니다.", 500, "ORDER_CANCEL_ERROR");
  }
}
