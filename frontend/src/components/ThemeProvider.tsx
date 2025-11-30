"use client";

// ====================================
// TeddyBear's Room - ThemeProvider 컴포넌트
// next-themes 기반 테마 Context Provider
// ====================================
//
// 🎯 용도:
// - 앱 전역 테마(Light/Dark) 상태 관리
// - next-themes 라이브러리 래핑
// - 시스템 테마 자동 감지 지원
//
// 📦 구조:
// - NextThemesProvider를 감싸는 래퍼 컴포넌트
// - class 속성으로 테마 적용 (Tailwind dark: 접두사 활용)
//
// 🎨 테마 설정:
// - defaultTheme: "light" (기본값)
// - enableSystem: true (시스템 테마 자동 감지)
// - attribute: "class" (HTML class로 테마 적용)
//
// 🔧 동작 원리:
// 1. NextThemesProvider가 <html> 태그에 class 추가
// 2. Light: class="light", Dark: class="dark"
// 3. Tailwind의 dark: 접두사가 자동 활성화
//
// 📝 사용:
// ```tsx
// // layout.tsx에서 앱 전체 감싸기
// <ThemeProvider>
//   <App />
// </ThemeProvider>
// ```
// ====================================

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

// ──────────────────────────────────────
// ThemeProvider 컴포넌트
// ──────────────────────────────────────

/**
 * 테마 Provider 컴포넌트
 *
 * @description
 * next-themes의 ThemeProvider를 래핑하여
 * TBR 앱의 테마 설정을 적용합니다.
 *
 * @param children - 자식 컴포넌트
 * @param props - ThemeProviderProps (next-themes)
 *
 * @example
 * // app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ThemeProvider>
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"              // HTML class 속성으로 테마 적용
      defaultTheme="light"           // 기본 테마: Light Mode
      enableSystem                   // OS 테마 설정 자동 감지
      disableTransitionOnChange={false}  // 테마 변경 시 트랜지션 허용
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
