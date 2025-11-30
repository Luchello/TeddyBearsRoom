// ====================================
// TeddyBear's Room - Utility Functions
// 공통 유틸리티 함수 모음
// ====================================

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn (classNames) - Tailwind CSS 클래스 병합 유틸리티
 *
 * @description
 * clsx와 tailwind-merge를 결합하여 조건부 클래스와 Tailwind 충돌을 해결합니다.
 *
 * 사용 예시:
 * ```tsx
 * // 조건부 클래스 적용
 * cn("base-class", isActive && "active-class", { "conditional": condition })
 *
 * // Tailwind 충돌 해결 (뒤의 p-4가 적용됨)
 * cn("p-2", "p-4") // → "p-4"
 *
 * // 컴포넌트에서 className prop 병합
 * cn("default-styles", className)
 * ```
 *
 * @param inputs - 클래스 문자열, 객체, 배열 등 clsx가 지원하는 모든 형태
 * @returns 병합되고 중복이 제거된 클래스 문자열
 *
 * @see https://github.com/lukeed/clsx - clsx 라이브러리
 * @see https://github.com/dcastil/tailwind-merge - tailwind-merge 라이브러리
 */
export function cn(...inputs: ClassValue[]) {
  // 1. clsx: 조건부 클래스 처리 (falsy 값 제거, 객체/배열 평탄화)
  // 2. twMerge: Tailwind 클래스 충돌 해결 (예: "p-2 p-4" → "p-4")
  return twMerge(clsx(inputs))
}
