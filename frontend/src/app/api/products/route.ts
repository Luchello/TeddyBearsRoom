// ====================================
// TeddyBear's Room - Products API
// GET /api/products - List all products
// ====================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const showNew = searchParams.get("new") === "true";
    const showBest = searchParams.get("best") === "true";

    // Build where clause
    const where: {
      category?: string;
      isNew?: boolean;
      isBest?: boolean;
    } = {};

    if (category && category !== "전체") {
      where.category = category;
    }
    if (showNew) {
      where.isNew = true;
    }
    if (showBest) {
      where.isBest = true;
    }

    // Build orderBy clause
    let orderBy: { price?: "asc" | "desc"; createdAt?: "desc" } = { createdAt: "desc" };

    switch (sort) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "latest":
      default:
        orderBy = { createdAt: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { success: false, error: "상품 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
