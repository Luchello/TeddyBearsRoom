// ====================================
// TeddyBear's Room - User Measurements API
// GET /api/users/me/measurements - Get user size measurements
// PATCH /api/users/me/measurements - Update user size measurements
// DELETE /api/users/me/measurements - Clear all measurements
// ====================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Validation helpers
function validateHeight(value: number): boolean {
  return value >= 100 && value <= 250;
}

function validateWeight(value: number): boolean {
  return value >= 30 && value <= 200;
}

function validateShoeSize(value: number): boolean {
  return value >= 200 && value <= 320;
}

function validateGender(value: string): boolean {
  return ['MALE', 'FEMALE', 'OTHER'].includes(value);
}

// GET - Get user size measurements
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

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        height: true,
        weight: true,
        gender: true,
        topSize: true,
        bottomSize: true,
        shoeSize: true,
        encryptedMeasurements: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "프로필을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        height: profile.height ?? null,
        weight: profile.weight ?? null,
        gender: profile.gender ?? null,
        topSize: profile.topSize ?? null,
        bottomSize: profile.bottomSize ?? null,
        shoeSize: profile.shoeSize ?? null,
        encryptedMeasurements: profile.encryptedMeasurements ?? null,
      },
    });
  } catch (error) {
    console.error("Measurements GET Error:", error);
    return NextResponse.json(
      { success: false, error: "사이즈 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// PATCH - Update user size measurements
export async function PATCH(request: Request) {
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
    const {
      height,
      weight,
      gender,
      topSize,
      bottomSize,
      shoeSize,
      encryptedMeasurements,
    } = body;

    // Validate inputs
    const errors: string[] = [];

    if (height !== undefined && height !== null) {
      if (typeof height !== 'number' || !validateHeight(height)) {
        errors.push("키는 100cm ~ 250cm 사이여야 합니다.");
      }
    }

    if (weight !== undefined && weight !== null) {
      if (typeof weight !== 'number' || !validateWeight(weight)) {
        errors.push("몸무게는 30kg ~ 200kg 사이여야 합니다.");
      }
    }

    if (shoeSize !== undefined && shoeSize !== null) {
      if (typeof shoeSize !== 'number' || !validateShoeSize(shoeSize)) {
        errors.push("신발 사이즈는 200mm ~ 320mm 사이여야 합니다.");
      }
    }

    if (gender !== undefined && gender !== null && !validateGender(gender)) {
      errors.push("성별은 MALE, FEMALE, OTHER 중 하나여야 합니다.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Prisma.ProfileUpdateInput = {};
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (gender !== undefined) updateData.gender = gender;
    if (topSize !== undefined) updateData.topSize = topSize;
    if (bottomSize !== undefined) updateData.bottomSize = bottomSize;
    if (shoeSize !== undefined) updateData.shoeSize = shoeSize;
    if (encryptedMeasurements !== undefined) {
      updateData.encryptedMeasurements = encryptedMeasurements;
    }

    // Upsert profile (create if not exists, update if exists)
    const updatedProfile = await prisma.profile.upsert({
      where: { id: user.id },
      update: updateData,
      create: {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        height: height ?? undefined,
        weight: weight ?? undefined,
        gender: gender ?? undefined,
        topSize: topSize ?? undefined,
        bottomSize: bottomSize ?? undefined,
        shoeSize: shoeSize ?? undefined,
        encryptedMeasurements: encryptedMeasurements ?? undefined,
      },
      select: {
        height: true,
        weight: true,
        gender: true,
        topSize: true,
        bottomSize: true,
        shoeSize: true,
        encryptedMeasurements: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        height: updatedProfile.height ?? null,
        weight: updatedProfile.weight ?? null,
        gender: updatedProfile.gender ?? null,
        topSize: updatedProfile.topSize ?? null,
        bottomSize: updatedProfile.bottomSize ?? null,
        shoeSize: updatedProfile.shoeSize ?? null,
        encryptedMeasurements: updatedProfile.encryptedMeasurements ?? null,
      },
    });
  } catch (error) {
    console.error("Measurements PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "사이즈 정보 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}

// DELETE - Clear all measurements
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    await prisma.profile.update({
      where: { id: user.id },
      data: {
        height: null,
        weight: null,
        gender: null,
        topSize: null,
        bottomSize: null,
        shoeSize: null,
        encryptedMeasurements: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "사이즈 정보가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Measurements DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "사이즈 정보 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
