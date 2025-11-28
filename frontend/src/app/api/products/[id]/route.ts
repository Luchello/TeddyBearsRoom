// ====================================
// TeddyBear's Room - Single Product API
// GET /api/products/[id] - Get product by ID
// ====================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "상품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Product API Error:", error);
    return NextResponse.json(
      { success: false, error: "상품을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
