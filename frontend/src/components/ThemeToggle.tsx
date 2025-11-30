"use client";

// ====================================
// TeddyBear's Room - ThemeToggle 컴포넌트
// Light/Dark 모드 전환 버튼
// ====================================
//
// 🎯 용도:
// - 테마 토글 버튼 (Light ↔ Dark)
// - Header에서 사용
// - 시각적 피드백 (이모지 + 애니메이션)
//
// 📦 구조:
// - Button (shadcn/ui) 기반
// - useTheme 훅으로 테마 상태 접근
// - mounted 상태로 hydration mismatch 방지
//
// 🎨 디자인:
// - Light Mode: ☀️ 해 이모지 + bounce 애니메이션
// - Dark Mode: 🌙 달 이모지 + pulse 애니메이션 + neon glow
//
// 🔧 Hydration 처리:
// - SSR과 CSR의 테마 불일치 문제 해결
// - mounted 전: 기본 버튼 렌더링 (Skeleton)
// - mounted 후: 실제 테마 기반 UI 렌더링
//
// 📝 참고:
// - next-themes 공식 권장 패턴 적용
// - https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
// ====================================

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// ──────────────────────────────────────
// ThemeToggle 컴포넌트
// ──────────────────────────────────────

/**
 * 테마 토글 버튼 컴포넌트
 *
 * @description
 * Light/Dark 모드를 전환하는 버튼입니다.
 * - Hydration mismatch 방지 패턴 적용
 * - 다크 모드에서 네온 글로우 효과
 *
 * @example
 * // Header에서 사용
 * <div className="flex items-center gap-3">
 *   <WishlistButton />
 *   <CartButton />
 *   <ThemeToggle />
 * </div>
 */
export function ThemeToggle() {
  // ──────────────────────────────────────
  // Theme 상태 훅
  // - theme: 설정된 테마 ("light" | "dark" | "system")
  // - setTheme: 테마 변경 함수
  // - resolvedTheme: 실제 적용된 테마 ("light" | "dark")
  // ──────────────────────────────────────
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ──────────────────────────────────────
  // Hydration Mismatch 방지
  // - SSR에서는 테마 정보가 없음
  // - 클라이언트에서만 실제 테마 UI 표시
  // - next-themes 공식 권장 패턴
  // ──────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // ──────────────────────────────────────
  // Skeleton 렌더링 (mounted 전)
  // - 서버 렌더링 시 기본 버튼 표시
  // - Hydration 완료 전까지 유지
  // ──────────────────────────────────────
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl w-10 h-10"
        aria-label="테마 전환"
      >
        <span className="text-lg">🌙</span>
      </Button>
    );
  }

  // 현재 다크 모드 여부 확인
  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        rounded-xl w-10 h-10 transition-all duration-300
        ${isDark
          ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 neon-glow-subtle"
          : "hover:bg-accent/50"
        }
      `}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {/* 테마별 이모지 + 애니메이션 */}
      <span className={`text-lg transition-transform duration-300 ${isDark ? "animate-pulse-slow" : "animate-bounce-slow"}`}>
        {isDark ? "🌙" : "☀️"}
      </span>
    </Button>
  );
}
