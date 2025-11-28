// ====================================
// TeddyBear's Room - Current User API
// GET /api/users/me - Get current user profile
// PATCH /api/users/me - Update current user profile
// ====================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

// GET - Get current user profile
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

    // Get or create profile
    let profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email || "",
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        subscriptionTier: profile.subscriptionTier.toLowerCase(),
        points: profile.points,
        createdAt: profile.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("User GET Error:", error);
    return NextResponse.json(
      { success: false, error: "프로필을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// PATCH - Update current user profile
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
    const { name, avatar } = body;

    const updateData: { name?: string; avatar?: string } = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        subscriptionTier: profile.subscriptionTier.toLowerCase(),
        points: profile.points,
        createdAt: profile.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("User PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "프로필 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}
