// ====================================
// TeddyBear's Room - LatexBackground 컴포넌트
// 다크모드 전용 라텍스/광택 배경 효과
// ====================================
//
// 🎯 용도:
// - Dark Mode 전용 배경 이펙트 (고급스러운 광택감)
// - 성인용품 사이트의 페티시/감각적 이미지 연출
// - 고정 배경으로 스크롤할 때도 일정한 시각 효과 제공
// - Matrix Neon 그리드 + 물방울/땀 효과로 Jirai-kei 감성 강화
//
// 📦 구조:
// - LatexBackground: 최상단 컨테이너 (fixed inset-0, pointer-events-none)
//   - Base Latex Shine: 라텍스 광택 기본 배경
//     - bg-neutral-950: 검정 베이스
//     - radial-gradient: 중앙 밝음 → 외곽 검정 그라디언트
//     - 회전하는 ellipse 광택 오버레이
//   - Water Droplets/Sweat Effect: 물방울/땀 흩어짐 (3개 위치)
//     - rounded-full: 원형 물방울
//     - 내부 광택(inset) + 그림자 효과로 입체감
//   - Matrix Neon Grid Overlay: 네온 그린 격자 무늬
//     - linear-gradient: 50px × 50px 그리드
//     - mask-image: ellipse로 중앙에서 페이드아웃
//
// 🎨 디자인:
// - Dark Mode Only: opacity-0 light, opacity-100 dark
// - 색상: 검정(#0a0a0a) + 네온 그린(#FF69B4)
// - 광택감: 라텍스의 반사광 표현 (radial-gradient)
// - 질감: 물방울 + 그리드로 페티시 감성 강화
// - 고정 배경: fixed inset-0 (스크롤 시 동적 고정)
//
// 🔧 주요 기능:
// - pointer-events-none: 배경이 마우스 클릭을 방해하지 않음
// - z-[-1]: 콘텐츠 뒤에 배치
// - overflow-hidden: 배경이 화면 밖으로 나가지 않음
// - transition-opacity: Light/Dark 전환 시 부드러운 opacity 변화
// - Static Droplets: 애니메이션 없이 고정된 물방울 (성능 우선)
//
// 📝 의존성:
// - React: React.ReactElement 반환
// - Tailwind CSS: fixed, inset-0, gradient, shadow 유틸리티
// - Dark Mode: dark: 프리픽스로 다크모드 조건 처리
// ====================================

import React from 'react';

// ──────────────────────────────────────
// LatexBackground 컴포넌트
// ──────────────────────────────────────

/**
 * 라텍스/광택 배경 이펙트 컴포넌트
 *
 * @description
 * Dark Mode 전용 고급스러운 배경 이펙트입니다.
 * - 라텍스의 광택감을 radial-gradient로 표현
 * - 물방울/땀 효과로 물리적인 현실감 강화
 * - Matrix Neon 그리드로 지뢰계(Jirai-kei) 감성 연출
 * - 고정 배경(fixed)으로 스크롤 시에도 일정한 시각 효과 유지
 * - pointer-events-none으로 상호작용 차단 (배경용)
 *
 * @returns {React.ReactElement} 라텍스 배경 JSX
 *
 * @example
 * // layout.tsx 또는 page.tsx의 body 내에 배치
 * import { LatexBackground } from "@/components/ui/latex-background";
 *
 * export default function RootLayout() {
 *   return (
 *     <html>
 *       <body>
 *         <LatexBackground />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 */
export const LatexBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-1000">
      {/* ─────────────────────────────────────
          라텍스 광택 기본 배경
          - bg-neutral-950: 검정색(#0f0f0f) 베이스
          - 내부에 2개 레이어: 광택 + 그라디언트
          ───────────────────────────────────── */}
      <div className="absolute inset-0 bg-neutral-950">
        {/* 라텍스 광택 그라디언트
            - radial-gradient(circle): 원형 그라디언트
            - 중앙: rgba(50,50,50,1) 밝은 회색
            - 외곽: rgba(5,5,5,1) 거의 검정
            - opacity-80: 80% 투명도로 살짝 투명하게
            - mix-blend-overlay: 오버레이 블렌드 모드 (광택감 강화) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,1)_0%,rgba(5,5,5,1)_100%)] opacity-80 mix-blend-overlay" />

        {/* 회전하는 광택 오버레이 (반사광 표현)
            - ellipse_at_center: 타원형 그라디언트
            - 중앙: rgba(255,255,255,0.03) 거의 투명한 흰색
            - 50%에서 transparent로 페이드아웃
            - 200% 크기 + rotate-45: 큰 타원을 45도 회전
            - 동적 반사광 표현으로 라텍스의 입체감 강화 */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)] rotate-45 pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────
          물방울/땀 효과 (페티시 감성)
          - 3개의 정적 물방울 다양한 위치에 배치
          - opacity-30: 전체 물방울 영역 30% 투명도
          ───────────────────────────────────── */}
      <div className="absolute inset-0 opacity-30">
        {/* 물방울 1: 좌측 상단 (w-2 h-2)
            - top-[10%] left-[20%]: 위치 결정
            - rounded-full: 완벽한 원형
            - bg-white/10: 흰색 10% 투명도
            - shadow 조합: inset(내부 광택) + outer(입체 그림자)
              → inset_1px_1px_2px_rgba(255,255,255,0.3): 위쪽 흰색 광택(습기 표현)
              → 2px_2px_4px_rgba(0,0,0,0.5): 아래쪽 검정 그림자(입체감) */}
        <div className="absolute top-[10%] left-[20%] w-2 h-2 rounded-full bg-white/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),2px_2px_4px_rgba(0,0,0,0.5)]" />

        {/* 물방울 2: 우측 상단 (w-3 h-3, 중간 크기)
            - top-[30%] left-[80%]: 오른쪽 상단 배치
            - w-3 h-3: 물방울 1보다 큼 (원근감)
            - 동일한 shadow 효과로 입체감 표현 */}
        <div className="absolute top-[30%] left-[80%] w-3 h-3 rounded-full bg-white/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),2px_2px_4px_rgba(0,0,0,0.5)]" />

        {/* 물방울 3: 좌측 하단 (w-4 h-4, 가장 큼)
            - top-[70%] left-[15%]: 왼쪽 하단 배치
            - w-4 h-4: 가장 큰 물방울 (최전방 위치 표현)
            - 동일한 shadow 효과로 입체감 강화 */}
        <div className="absolute top-[70%] left-[15%] w-4 h-4 rounded-full bg-white/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),2px_2px_4px_rgba(0,0,0,0.5)]" />

        {/* 애니메이션 물방울: 선택사항
            - 현재 static droplets 만 사용 (성능 우선)
            - 추후 keyframe animation 추가 가능
              예: animate-drip, animate-sweat 등 */}
      </div>

      {/* ─────────────────────────────────────
          Matrix Neon 그리드 오버레이 (지뢰계 감성)
          - linear-gradient 2개 조합: 수평선 + 수직선
            1. 수평선: rgba(255,105,180,0.03) 1px 간격
            2. 수직선: 90deg (90도 회전) rgba(255,105,180,0.03) 1px 간격
          - bg-[size:50px_50px]: 50px × 50px 그리드
          - mask-image: ellipse로 중앙에서 주변으로 페이드아웃
            → ellipse_at_center: 중앙 기준
            → black_40%: 중앙 40% 범위는 검정(완전 표시)
            → transparent_100%: 100% 거리에서 투명(완전 숨김)
            → 부드러운 원형 페이드아웃 효과 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,105,180,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,105,180,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
    </div>
  );
};
