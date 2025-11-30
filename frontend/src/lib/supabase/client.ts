// ====================================
// TeddyBear's Room - Supabase Browser Client
// 클라이언트 사이드 Supabase 인스턴스
// ====================================
//
// 🎯 용도:
// - React 컴포넌트 내에서 Supabase 접근
// - 클라이언트 사이드 인증 (로그인/로그아웃)
// - 실시간 구독 (Realtime subscriptions)
// - 클라이언트 사이드 데이터 페칭
//
// ⚠️ 주의사항:
// - 브라우저에서만 사용 (Server Components에서 사용 X)
// - NEXT_PUBLIC_ 환경변수만 접근 가능 (공개 키)
// - 민감한 작업은 server.ts 사용
//
// 📝 사용 예시:
// ```tsx
// import { createClient } from "@/lib/supabase/client";
// const supabase = createClient();
// const { data, error } = await supabase.auth.signInWithPassword({...});
// ```
// ====================================

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase 브라우저 클라이언트 생성
 *
 * @description
 * 클라이언트 컴포넌트에서 사용하는 Supabase 인스턴스 생성 함수.
 * createBrowserClient는 @supabase/ssr 패키지에서 제공하며,
 * 브라우저 환경에 최적화된 클라이언트를 반환합니다.
 *
 * @returns Supabase 브라우저 클라이언트 인스턴스
 *
 * @example
 * // React 컴포넌트에서 사용
 * const supabase = createClient();
 *
 * // 사용자 정보 가져오기
 * const { data: { user } } = await supabase.auth.getUser();
 *
 * // 로그아웃
 * await supabase.auth.signOut();
 */
export function createClient() {
  // createBrowserClient: 브라우저 환경 전용
  // - 쿠키 기반 세션 관리 자동 처리
  // - PKCE flow 지원 (OAuth 인증)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,      // Supabase 프로젝트 URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // 공개 API 키 (RLS 적용)
  );
}
