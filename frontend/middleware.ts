// TeddyBear's Room - Next.js Middleware
// Dev mode: bypass Supabase when not available

import { type NextRequest, NextResponse } from "next/server";

/**
 * Check if Supabase environment variables are valid (not dummy values)
 */
function isSupabaseAvailable(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if URL and key exist and are not dummy localhost values
  if (!url || !key) return false;
  if (url.includes("localhost")) return false;
  if (key === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0") {
    return false; // Supabase demo key
  }

  return true;
}

export async function middleware(request: NextRequest) {
  // Skip Supabase middleware if not configured properly
  if (!isSupabaseAvailable()) {
    return NextResponse.next();
  }

  try {
    const { updateSession } = await import("@/lib/supabase/middleware");
    return await updateSession(request);
  } catch {
    // Supabase error — pass through
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
