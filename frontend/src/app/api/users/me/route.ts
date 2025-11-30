// ====================================
// TeddyBear's Room - Current User API
// 현재 사용자 프로필 조회 및 수정 API
// ====================================
//
// 🎯 용도:
// - GET: 현재 로그인 사용자의 프로필 정보 조회
// - PATCH: 현재 로그인 사용자의 프로필 정보 수정 (이름, 아바타)
// - 로그인 필수 (Supabase Auth 기반)
// - GET은 자동 프로필 생성 (존재하지 않으면)
//
// 📦 구조:
// - GET 핸들러: 로그인 확인 → Prisma findUnique로 사용자 조회 → 없으면 생성
// - PATCH 핸들러: 로그인 확인 → 요청 바디 파싱 → Prisma update로 프로필 수정
// - 인증: Supabase 세션에서 user.id 추출
// - 응답: {success, data} 구조 (프로필 객체: id, email, name, avatar, subscriptionTier, points)
//
// 🎨 디자인:
// - 인증 필수: 로그인하지 않은 사용자 401 Unauthorized
// - GET: 프로필 자동 생성 (첫 접근 시 편의성)
// - PATCH: 수정할 필드만 선택적 업데이트 (name, avatar)
// - 에러: 400 Bad Request (유효성), 401 Unauthorized, 500 Internal Error
//
// 🔧 주요 기능:
// - GET: Supabase 세션 확인 → 사용자 프로필 조회 → 없으면 메타데이터로 자동 생성
// - PATCH: 요청 검증 → 수정할 필드만 업데이트 → 수정된 프로필 반환
// - 자동 프로필 생성: user_metadata.name 또는 이메일 로컬 부분 사용
// - 구독 정보 포함: subscriptionTier (NONE, PREMIUM 등), points (포인트)
//
// 📝 의존성:
// - Supabase: createClient (서버사이드), getUser (인증 확인)
// - Prisma: profile 모델 (findUnique, create, update)
// - NextResponse: API 응답 포맷
// ====================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

/**
 * 현재 사용자 프로필 조회 API 핸들러
 *
 * @description
 * GET /api/users/me에서 현재 로그인한 사용자의 프로필을 조회합니다.
 * - Supabase Auth로 현재 사용자 확인 (로그인 필수)
 * - 프로필이 없으면 Supabase 메타데이터로부터 자동 생성
 * - 프로필 정보: id, email, name, avatar, subscriptionTier, points, createdAt
 * - 구독 정보 포함 (구독 tier와 포인트)
 *
 * @returns {Promise<NextResponse>} JSON 응답 {success, data} 또는 에러 응답
 *
 * @example
 * // 사용자 프로필 조회
 * GET /api/users/me
 * Headers: Authorization: Bearer [session_token]
 * Response: {success: true, data: {id, email, name, avatar, subscriptionTier, points}}
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
        { success: false, error: "로그인이 필요합니다." },  // 사용자 친화적 메시지
        { status: 401 }  // HTTP 401 Unauthorized
      );
    }

    // ──────────────────────────────────────
    // 사용자 프로필 조회 또는 자동 생성
    // findUnique: 사용자 ID로 프로필 조회
    // 존재하지 않으면 메타데이터로부터 프로필 생성
    // ──────────────────────────────────────
    let profile = await prisma.profile.findUnique({
      where: { id: user.id },  // 조건: 현재 사용자의 profile ID 검색
    });

    // 프로필이 존재하지 않으면 자동 생성 (최초 접근 시)
    if (!profile) {
      // Supabase user_metadata에서 이름 추출 또는 이메일 로컬 부분 사용
      // 우선순위: user_metadata.name → 이메일@이전 부분 → "User" (기본값)
      profile = await prisma.profile.create({
        data: {
          id: user.id,  // Supabase auth user ID
          email: user.email || "",  // Supabase auth 이메일
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",  // 표시 이름
        },
      });
    }

    // ──────────────────────────────────────
    // 성공 응답: 프로필 정보 반환
    // subscriptionTier와 points는 구독 및 포인트 시스템 포함
    // ──────────────────────────────────────
    return NextResponse.json({
      success: true,  // API 성공 플래그
      data: {
        id: profile.id,  // 사용자 ID (= Supabase auth user ID)
        email: profile.email,  // 이메일
        name: profile.name,  // 표시 이름
        avatar: profile.avatar,  // 아바타 URL (선택사항)
        subscriptionTier: profile.subscriptionTier.toLowerCase(),  // 구독 tier (none, premium 등)
        points: profile.points,  // 누적 포인트
        createdAt: profile.createdAt.toISOString(),  // ISO 형식 생성 날짜
      },
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리
    // 데이터베이스 에러 또는 Supabase 에러 시 500 응답
    // ──────────────────────────────────────
    console.error("User GET Error:", error);  // 서버 로그에 상세 에러 기록
    return NextResponse.json(
      { success: false, error: "프로필을 불러오는데 실패했습니다." },  // 사용자 친화적 에러 메시지
      { status: 500 }  // HTTP 500 Internal Server Error
    );
  }
}

/**
 * 현재 사용자 프로필 수정 API 핸들러
 *
 * @description
 * PATCH /api/users/me에서 현재 로그인한 사용자의 프로필을 수정합니다.
 * - Supabase Auth로 현재 사용자 확인 (로그인 필수)
 * - 수정 가능한 필드: name (표시 이름), avatar (아바타 URL)
 * - 선택적 업데이트: 수정할 필드만 포함하면 그것만 업데이트
 * - 수정된 프로필 정보 반환 (GET과 동일한 형식)
 *
 * @param {Request} request - Next.js Request 객체 (JSON body 포함)
 * @returns {Promise<NextResponse>} JSON 응답 {success, data} 또는 에러 응답
 *
 * @example
 * // 사용자 프로필 수정 (이름만 변경)
 * PATCH /api/users/me
 * Headers: Authorization: Bearer [session_token]
 * Body: { name: "새로운 이름" }
 * Response: {success: true, data: {id, email, name, avatar, subscriptionTier, points}}
 *
 * // 아바타도 함께 수정
 * Body: { name: "새 이름", avatar: "https://..." }
 */
export async function PATCH(request: Request) {
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
    // 요청 바디 파싱 및 수정 필드 추출
    // name: 표시 이름 (선택사항)
    // avatar: 아바타 URL (선택사항)
    // ──────────────────────────────────────
    const body = await request.json();
    const { name, avatar } = body;

    // ──────────────────────────────────────
    // 수정 데이터 빌드 (선택적 업데이트)
    // 제공된 필드만 포함 (undefined 필드는 제외)
    // ──────────────────────────────────────
    const updateData: { name?: string; avatar?: string } = {};  // 타입 정의: name과 avatar만 수정 가능
    if (name) updateData.name = name;  // name이 제공되면 포함
    if (avatar) updateData.avatar = avatar;  // avatar가 제공되면 포함

    // ──────────────────────────────────────
    // 프로필 업데이트 (Prisma)
    // update: 기존 프로필의 지정 필드만 수정
    // 반환: 수정된 프로필 객체 (전체 필드)
    // ──────────────────────────────────────
    const profile = await prisma.profile.update({
      where: { id: user.id },  // 조건: 현재 사용자 ID로 검색
      data: updateData,  // 수정 데이터 (name, avatar 중 제공된 것)
    });

    // ──────────────────────────────────────
    // 성공 응답: 수정된 프로필 정보 반환
    // GET과 동일한 형식으로 전체 프로필 정보 반환
    // ──────────────────────────────────────
    return NextResponse.json({
      success: true,  // API 성공 플래그
      data: {
        id: profile.id,  // 사용자 ID (= Supabase auth user ID)
        email: profile.email,  // 이메일 (수정 불가)
        name: profile.name,  // 표시 이름 (수정됨)
        avatar: profile.avatar,  // 아바타 URL (수정됨, 선택사항)
        subscriptionTier: profile.subscriptionTier.toLowerCase(),  // 구독 tier (수정 불가)
        points: profile.points,  // 누적 포인트 (수정 불가)
        createdAt: profile.createdAt.toISOString(),  // ISO 형식 생성 날짜 (수정 불가)
      },
    });
  } catch (error) {
    // ──────────────────────────────────────
    // 에러 처리
    // 데이터베이스 에러 또는 Supabase 에러 시 500 응답
    // ──────────────────────────────────────
    console.error("User PATCH Error:", error);  // 서버 로그에 상세 에러 기록
    return NextResponse.json(
      { success: false, error: "프로필 업데이트에 실패했습니다." },  // 사용자 친화적 에러 메시지
      { status: 500 }  // HTTP 500 Internal Server Error
    );
  }
}
