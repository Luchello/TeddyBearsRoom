"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch - this pattern is officially recommended by next-themes
  // See: https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
      <span className={`text-lg transition-transform duration-300 ${isDark ? "animate-pulse-slow" : "animate-bounce-slow"}`}>
        {isDark ? "🌙" : "☀️"}
      </span>
    </Button>
  );
}
