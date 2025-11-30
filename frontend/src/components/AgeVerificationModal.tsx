"use client";

// ====================================
// TeddyBear's Room - AgeVerificationModal 컴포넌트
// 성인 인증 모달 (19세 이상 확인)
// ====================================
//
// 🎯 용도:
// - 사이트 첫 진입 시 성인 인증 확인
// - 정보통신망법 및 청소년보호법 준수
// - localStorage 기반 인증 상태 저장 (다시 노출 안 함)
// - 비거부 시 구글로 리다이렉트
//
// 📦 구조:
// - BackdropOverlay: fixed inset-0 배경 (모달 외 클릭 시 닫기 불가)
// - BackgroundEffects: Light/Dark 모드별 배경 이펙트
//   - Light: 구름 효과 + 파스텔 blob
//   - Dark: Matrix 그리드 + 라텍스 효과
// - ModalContent: 중앙 콘텐츠 영역
//   - 🔞 Emoji + 애니메이션
//   - 제목 + 서브텍스트
//   - 설명 문구
//   - 버튼 2개 (확인, 거부)
//   - 법적 고지문
//
// 🎨 디자인:
// - Entrance: opacity-0 → opacity-100 (500ms 전환)
// - Exit: opacity-100 → opacity-0 (500ms 전환)
// - Light Mode: 클라우드 배경 (파스텔 색상)
// - Dark Mode: Matrix 그리드 (네온 그린 #00FF41)
// - 🔞 Emoji: bounce-slow 애니메이션
//
// 🔧 주요 기능:
// - 초기 진입: localStorage "age-verified" 확인
// - 미인증: 모달 표시, body overflow hidden
// - 확인 클릭: 인증 저장 → 500ms 후 모달 닫기 (exit animation)
// - 거부 클릭: google.com으로 리다이렉트
//
// 📝 의존성:
// - React: useState, useEffect
// - shadcn/ui: Button
// - lucide-react: ShieldCheck, Ban
// - localStorage: "age-verified" 키 사용
// ====================================

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Ban } from "lucide-react";

// ──────────────────────────────────────
// AgeVerificationModal 컴포넌트
// ──────────────────────────────────────

/**
 * 성인 인증 모달 컴포넌트
 *
 * @description
 * 사이트 첫 방문 시 19세 이상 성인 인증을 요청하는 모달입니다.
 * - localStorage에 "age-verified" 플래그로 한 번만 표시
 * - 확인: localStorage에 저장 후 모달 닫기
 * - 거부: 구글로 리다이렉트 (청소년 보호)
 * - Light/Dark 모드별 배경 이펙트 제공
 *
 * @example
 * // App 또는 layout에서 전역 사용
 * <AgeVerificationModal />
 *
 * // localStorage 초기화해서 다시 보고 싶으면:
 * localStorage.removeItem("age-verified");
 */
export function AgeVerificationModal() {
    // ──────────────────────────────────────
    // 모달 상태 관리
    // ──────────────────────────────────────
    /** 모달 열림/닫힘 상태 */
    const [isOpen, setIsOpen] = useState(false);
    /** 모달 종료 애니메이션 실행 여부 */
    const [isExiting, setIsExiting] = useState(false);

    // ──────────────────────────────────────
    // 초기 로드: localStorage "age-verified" 확인
    // ──────────────────────────────────────
    useEffect(() => {
        // localStorage에서 인증 상태 확인
        const verified = localStorage.getItem("age-verified");
        if (!verified) {
            // 미인증 시: 모달 표시 + 배경 스크롤 잠금
            setIsOpen(true);
            document.body.style.overflow = "hidden";
        }
    }, []);

    // ──────────────────────────────────────
    // 확인 버튼 핸들러
    // ──────────────────────────────────────
    /**
     * "네, 성인입니다" 버튼 클릭 시 호출
     * 1. isExiting 상태로 변경 → 500ms exit animation 시작
     * 2. 500ms 후: localStorage 저장 + 모달 닫기 + 배경 스크롤 복구
     */
    const handleVerify = () => {
        setIsExiting(true);
        setTimeout(() => {
            // 인증 상태 저장 (다시 표시 안 함)
            localStorage.setItem("age-verified", "true");
            // 모달 닫기
            setIsOpen(false);
            // 배경 스크롤 복구
            document.body.style.overflow = "";
        }, 500); // Exit animation 완료 대기 (500ms)
    };

    // ──────────────────────────────────────
    // 거부 버튼 핸들러
    // ──────────────────────────────────────
    /**
     * "아니요" 버튼 클릭 시 호출
     * 청소년 보호 정책: 미성년자는 구글로 리다이렉트
     */
    const handleReject = () => {
        window.location.href = "https://www.google.com";
    };

    if (!isOpen) return null;

    return (
        <>
          {/* ─────────────────────────────────────
              배경 오버레이 (모달 배경)
              - fixed inset-0: 전체 화면 차단
              - backdrop-blur-xl: 블러 효과
              - exit animation: opacity-0 (500ms)
              ───────────────────────────────────── */}
          <div
              className={`fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl transition-opacity duration-500 ${isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
          >
              {/* ─────────────────────────────────────
                  배경 이펙트 (Light/Dark 모드별 분기)
                  ───────────────────────────────────── */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Light Mode: 클라우드 배경 (파스텔 색상) */}
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/noise.png')] opacity-10 mix-blend-overlay dark:opacity-0" />
                  {/* 왼쪽 상단 파스텔 블롭 (animate-float) */}
                  <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float dark:hidden" />
                  {/* 오른쪽 하단 파스텔 블롭 (animate-float 2s 딜레이) */}
                  <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float dark:hidden" style={{ animationDelay: "2s" }} />

                  {/* Dark Mode: Matrix 그리드 + 라텍스 효과 */}
                  {/* 어두운 그라디언트 배경 */}
                  <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                  {/* 네온 그린 그리드 패턴 (30px × 30px) */}
                  <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
              </div>

              {/* ─────────────────────────────────────
                  모달 콘텐츠 (중앙 정렬)
                  max-w-lg: 최대 너비 제한
                  ───────────────────────────────────── */}
              <div className="relative w-full max-w-lg p-8 mx-4 text-center">
                {/* 🔞 Emoji 애니메이션 섹션
                    - absolute glow: 배경 빛 효과 (blur-xl)
                    - animate-bounce-slow: 부드러운 상하 바운싱 (1.5s)
                    - text-6xl: 큰 이모지 크기
                    - animate-pulse dark:bg-primary/40: 다크모드 펄싱 */}
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse dark:bg-primary/40" />
                    <span className="relative text-6xl animate-bounce-slow block">🔞</span>
                </div>

                {/* 제목 섹션
                    - text-3xl font-black: 큰 굵은 제목
                    - Gatekeeper Protocol: 서브타이틀 (text-lg, uppercase, tracking-widest)
                    - 19세 이상이신가요?: 메인 질문 (text-foreground/dark:text-white) */}
                <h2 className="text-3xl font-black mb-4 text-foreground dark:text-white tracking-tight">
                    <span className="block text-lg font-medium text-muted-foreground mb-2 uppercase tracking-widest">
                        Gatekeeper Protocol
                    </span>
                    19세 이상이신가요?
                </h2>

                {/* 설명 문구
                    - "시크릿 유니버스": 강조 텍스트 (text-primary font-bold)
                    - leading-relaxed: 편한 줄간격
                    - 성인만을 위한 사이트임을 명확히 전달 */}
                <p className="text-muted-foreground mb-10 leading-relaxed">
                    이곳은 성인만을 위한 <span className="text-primary font-bold">시크릿 유니버스</span>입니다.<br />
                    입장하시려면 성인 인증이 필요합니다.
                </p>

                {/* 버튼 행 (flex-col sm:flex-row)
                    - 모바일: 세로 정렬 (full width)
                    - 태블릿+: 가로 정렬 (gap-4)
                    - 두 개의 대형 버튼 (size="lg" py-6) */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* 확인 버튼 "네, 성인입니다"
                        - bg-primary hover:bg-primary/90: Primary 색상
                        - hover:scale-105: 호버 시 확대
                        - shadow-lg shadow-primary/25: 아래쪽 그림자
                        - ShieldCheck 아이콘 + group-hover:animate-pulse: 호버 시 펄싱 */}
                    <Button
                        onClick={handleVerify}
                        size="lg"
                        className="rounded-full text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-300 group"
                    >
                        <ShieldCheck className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                        네, 성인입니다
                    </Button>

                    {/* 거부 버튼 "아니요"
                        - variant="outline": 외곽선 스타일
                        - border-2: 굵은 테두리
                        - hover:bg-muted: 호버 시 배경 변화
                        - Ban 아이콘: 거부 의미 */}
                    <Button
                        onClick={handleReject}
                        variant="outline"
                        size="lg"
                        className="rounded-full text-lg px-10 py-6 border-2 hover:bg-muted transition-all duration-300"
                    >
                        <Ban className="mr-2 h-5 w-5" />
                        아니요
                    </Button>
                </div>

                {/* 법적 고지문
                    - text-xs: 작은 텍스트 (보조 정보)
                    - text-muted-foreground/50: 매우 희미한 색상
                    - 정보통신망법 및 청소년보호법 준수 명시 */}
                <p className="mt-8 text-xs text-muted-foreground/50">
                    본 사이트는 정보통신망법 및 청소년보호법의 규정을 준수합니다.
                </p>
            </div>
        </div>
    );
}
