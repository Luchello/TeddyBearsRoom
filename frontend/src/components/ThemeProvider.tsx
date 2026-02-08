"use client";

// ====================================
// TeddyBear's Room - ThemeProvider (다크모드 전용)
// next-themes 제거 — 순수 CSS 다크모드
// ====================================

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
