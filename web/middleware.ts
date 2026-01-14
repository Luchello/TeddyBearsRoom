// ====================================
// TeddyBear's Room - Next.js Middleware
// Handles Supabase session refresh
// ====================================

import { type NextRequest, NextResponse } from "next/server";
// import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Coming Soon 모드: Supabase 세션 처리 비활성화
  // TODO: 사이트 정식 오픈 시 아래 코드로 복원
  // return await updateSession(request);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
