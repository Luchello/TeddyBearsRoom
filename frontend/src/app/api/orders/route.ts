// ====================================
// TeddyBear's Room - Orders API
// POST /api/orders - Create new order
// GET /api/orders - List user's orders
// ====================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

// GET - List user's orders
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { profileId: user.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Orders GET Error:", error);
    return NextResponse.json(
      { success: false, error: "주문 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shippingAddress, shippingMemo } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "주문 상품이 없습니다." },
        { status: 400 }
      );
    }

    // Calculate total price
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `상품을 찾을 수 없습니다: ${item.productId}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        profileId: user.id,
        totalPrice,
        shippingAddress,
        shippingMemo,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Orders POST Error:", error);
    return NextResponse.json(
      { success: false, error: "주문 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
