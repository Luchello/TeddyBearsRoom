// ====================================
// TeddyBear's Room - Supabase Middleware Client
// Next.js Middleware 전용 세션 관리
// ====================================
//
// 🎯 용도:
// - 매 요청마다 세션 토큰 갱신
// - 보호된 경로 접근 제어
// - 인증되지 않은 사용자 리다이렉트
//
// 🔄 동작 흐름:
// 1. 모든 요청에서 middleware.ts (root) 호출
// 2. updateSession() 실행 → 세션 토큰 갱신
// 3. 보호된 경로 확인 → 미인증 시 리다이렉트
//
// ⚠️ 주의사항 (IMPORTANT):
// - createServerClient와 getUser() 사이에 로직 넣지 말 것
// - 그 사이 로직은 "무작위 로그아웃" 버그 유발 가능
//
// 📁 연관 파일:
// - middleware.ts (root): 이 함수를 호출하는 Next.js middleware
// ====================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase 세션 업데이트 및 보호 경로 체크
 *
 * @description
 * Next.js Middleware에서 호출되어:
 * 1. Supabase 세션 토큰을 자동 갱신
 * 2. 보호된 경로 접근 시 인증 확인
 * 3. 미인증 사용자를 로그인 페이지로 리다이렉트
 *
 * @param request - Next.js 요청 객체
 * @returns NextResponse - 수정된 응답 (쿠키 포함)
 *
 * @example
 * // middleware.ts (root)
 * import { updateSession } from "@/lib/supabase/middleware";
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 */
export async function updateSession(request: NextRequest) {
  // ──────────────────────────────────────
  // 1. 응답 객체 초기화
  // request를 복사하여 새 응답 생성
  // ──────────────────────────────────────
  let supabaseResponse = NextResponse.next({
    request,
  });

  // ──────────────────────────────────────
  // 2. Supabase 클라이언트 생성
  // 쿠키 읽기/쓰기 핸들러 설정
  // ──────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 요청에서 모든 쿠키 읽기
        getAll() {
          return request.cookies.getAll();
        },

        // 쿠키 설정 (세션 갱신 시)
        // 요청과 응답 모두에 쿠키 설정 필요
        setAll(cookiesToSet) {
          // Step 1: 요청 객체에 쿠키 설정
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Step 2: 새 응답 생성 (수정된 요청 포함)
          supabaseResponse = NextResponse.next({
            request,
          });

          // Step 3: 응답 객체에 쿠키 설정 (브라우저로 전달)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ──────────────────────────────────────
  // 3. 사용자 인증 상태 확인
  // ⚠️ IMPORTANT: createServerClient와 getUser() 사이에
  //    다른 로직을 넣지 마세요!
  //    → 무작위 로그아웃 버그 발생 가능
  // ──────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ──────────────────────────────────────
  // 4. 보호된 경로 체크
  // 로그인 필요한 페이지 목록
  // ──────────────────────────────────────
  const protectedPaths = [
    "/checkout",  // 결제 페이지
    "/account",   // 계정 설정
    "/orders",    // 주문 내역
  ];

  // 현재 경로가 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // ──────────────────────────────────────
  // 5. 미인증 사용자 리다이렉트
  // 보호된 경로 + 미로그인 → 홈으로 리다이렉트
  // ──────────────────────────────────────
  if (isProtectedPath && !user) {
    // 홈페이지로 리다이렉트 + 로그인 모달 트리거
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("login", "true"); // ?login=true → 로그인 모달 표시
    return NextResponse.redirect(url);
  }

  // ──────────────────────────────────────
  // 6. 정상 응답 반환
  // 갱신된 세션 쿠키 포함
  // ──────────────────────────────────────
  return supabaseResponse;
}
