// ====================================
// TeddyBear's Room - Supabase Server Client
// 서버 사이드 Supabase 인스턴스
// ====================================
//
// 🎯 용도:
// - API Routes에서 인증된 요청 처리
// - Server Components에서 데이터 페칭
// - 서버 사이드 보안 작업 (민감한 데이터 처리)
//
// ⚠️ 주의사항:
// - 서버에서만 사용 (클라이언트 컴포넌트에서 사용 X)
// - async 함수 (cookies()가 Promise 반환)
// - Server Components에서 setAll 실패는 무시됨 (middleware에서 처리)
//
// 📝 사용 예시:
// ```tsx
// // API Route
// import { createClient } from "@/lib/supabase/server";
// export async function GET() {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
// }
// ```
//
// 🔐 보안:
// - 쿠키 기반 세션으로 사용자 인증 상태 확인
// - RLS(Row Level Security) 정책이 적용된 쿼리 실행
// ====================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase 서버 클라이언트 생성 (async)
 *
 * @description
 * Server Components와 API Routes에서 사용하는 Supabase 인스턴스.
 * Next.js의 cookies() API를 통해 세션 쿠키를 관리합니다.
 *
 * @returns Promise<SupabaseClient> - Supabase 서버 클라이언트
 *
 * @example
 * // Server Component에서 사용
 * const supabase = await createClient();
 * const { data } = await supabase.from("products").select("*");
 *
 * @example
 * // API Route에서 인증 확인
 * const supabase = await createClient();
 * const { data: { user }, error } = await supabase.auth.getUser();
 * if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function createClient() {
  // Next.js 15+: cookies()가 Promise 반환
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,      // Supabase 프로젝트 URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // 공개 API 키 (RLS 적용)
    {
      cookies: {
        // ──────────────────────────────────────
        // 쿠키 읽기: 모든 쿠키 반환
        // Supabase 세션 토큰 확인용
        // ──────────────────────────────────────
        getAll() {
          return cookieStore.getAll();
        },

        // ──────────────────────────────────────
        // 쿠키 쓰기: 세션 갱신 시 호출
        // Server Components에서는 쓰기 불가 (무시됨)
        // API Routes에서는 정상 작동
        // ──────────────────────────────────────
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서 호출 시 에러 발생
            // → middleware.ts에서 세션 갱신하므로 무시 가능
            // 참고: middleware.ts의 updateSession() 함수
          }
        },
      },
    }
  );
}
