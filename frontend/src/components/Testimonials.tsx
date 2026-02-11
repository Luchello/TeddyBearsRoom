"use client";

// ====================================
// TeddyBear's Room - Testimonials 컴포넌트
// 고객 후기 캐러셀 (Carousel)
// ====================================
//
// 🎯 용도:
// - 실제 고객 후기 및 리뷰 표시
// - 5초 자동 재생 캐러셀
// - 좌/우 네비게이션 버튼
// - 도트 페이지네이션
// - 통계 (평점, 리뷰 수, 만족도, 재구매율)
//
// 📦 구조:
// - Section Header: 🎀 지뢰계 장식 + 제목
// - Carousel: 고객 후기 카드
// - Navigation Buttons: 좌/우 화살표 버튼
// - Dot Navigation: 페이지네이션 도트
// - Stats Row: 4개 통계 (평점, 리뷰 수, 만족도, 재구매율)
//
// 🎨 디자인:
// - 배경 그라데이션: secondary/accent 색상
// - 지뢰계 장식: ♡, ✧, 🎀, ☆ 애니메이션
// - 카드 그라데이션: pink-400 → 9D4EDD (다크모드)
// - 별점: yellow-400 채움
// - 호버 효과: -translate-y-1
//
// 🔧 주요 기능:
// - isAutoPlaying: 자동 재생 상태 (버튼 클릭 시 정지)
// - currentIndex: 현재 표시되는 항목 인덱스
// - setInterval 5초마다 다음 항목으로 이동
// - transform translateX로 부드러운 슬라이드
//
// 📝 의존성:
// - shadcn/ui: Card, CardContent, Button
// - lucide-react: Star, ChevronLeft, ChevronRight, Quote
// ====================================

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

// ──────────────────────────────────────
// 샘플 고객 후기 데이터
// ──────────────────────────────────────

/**
 * 고객 후기 샘플 데이터
 * - id: 고유 식별자
 * - name: 고객명 (마스킹)
 * - avatar: 아바타 이모지
 * - rating: 별점 (1-5)
 * - date: 작성 날짜
 * - content: 후기 내용
 * - product: 구매 상품명
 * - verified: 구매 인증 여부
 */
const testimonials = [
  {
    id: 1,
    name: "김**",
    avatar: "🐰",
    rating: 5,
    date: "2025.11.15",
    content:
      "포장이 정말 꼼꼼하고 예뻐요! 무지박스 배송이라 프라이버시도 완벽하게 지켜지네요. 지뢰계 감성 제품들이 너무 귀여워서 방 분위기가 확 바뀌었어요 ♡",
    product: "베어 컴포트 세트",
    verified: true,
  },
  {
    id: 2,
    name: "이**",
    avatar: "🦊",
    rating: 5,
    date: "2025.11.12",
    content:
      "구독 서비스 진짜 좋아요! 매달 새로운 제품을 합리적인 가격에 받아볼 수 있어서 만족스러워요. 기부 투표 기능도 너무 좋은 취지인 것 같아요 ✨",
    product: "스탠다드 멤버십",
    verified: true,
  },
  {
    id: 3,
    name: "박**",
    avatar: "🐻",
    rating: 5,
    date: "2025.11.08",
    content:
      "사이즈 추천 기능 덕분에 딱 맞는 제품을 선택할 수 있었어요. 고민 없이 구매했는데 정말 잘 맞아서 놀랐어요! 앞으로도 자주 이용할게요 🧸",
    product: "코지 라운지웨어",
    verified: true,
  },
  {
    id: 4,
    name: "최**",
    avatar: "🐱",
    rating: 4,
    date: "2025.11.05",
    content:
      "디자인이 너무 예쁘고 품질도 좋아요. 다크모드에서 보는 네온 디자인이 진짜 감각적이에요! 친구들한테도 추천했어요 💖",
    product: "네온 무드 컬렉션",
    verified: true,
  },
];

// ──────────────────────────────────────
// Testimonials 컴포넌트
// ──────────────────────────────────────

/**
 * 고객 후기 캐러셀 컴포넌트
 *
 * @description
 * 고객 후기를 자동 재생 캐러셀로 표시합니다.
 * - 5초마다 다음 항목으로 자동 이동
 * - 좌/우 버튼으로 수동 네비게이션 가능
 * - 도트로 페이지 지정 가능
 * - 하단에 통계 카드 4개 표시
 * - 지뢰계 스타일 장식 요소
 *
 * @example
 * // 메인 페이지 또는 상품 페이지에 배치
 * <Testimonials />
 */
export function Testimonials() {
  // ──────────────────────────────────────
  // 캐러셀 상태
  // ──────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // ──────────────────────────────────────
  // 자동 재생: 5초마다 다음 항목으로
  // ──────────────────────────────────────
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // ──────────────────────────────────────
  // 네비게이션 핸들러
  // - handlePrev: 이전 항목으로 이동
  // - handleNext: 다음 항목으로 이동
  // - handleDotClick: 특정 항목으로 이동
  // 모두 자동 재생 정지 후 실행
  // ──────────────────────────────────────
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary/10 via-background to-accent/10 relative overflow-hidden">
      {/* ─────────────────────────────────────
          지뢰계 장식 요소 (♡✧🎀☆)
          - pointer-events-none: 클릭 불가
          - opacity-15: 순하고 은은한 투명도
          - 다양한 애니메이션과 delay
          ───────────────────────────────────── */}
      <div className="absolute top-10 left-10 text-4xl opacity-15 animate-heart-beat pointer-events-none">
        ♡
      </div>
      <div
        className="absolute bottom-10 right-10 text-3xl opacity-15 animate-sparkle-twinkle pointer-events-none"
        style={{ animationDelay: "1s" }}
      >
        ✧
      </div>
      <div
        className="absolute top-1/2 right-20 text-2xl opacity-15 animate-ribbon-flutter pointer-events-none hidden lg:block"
        style={{ animationDelay: "2s" }}
      >
        🎀
      </div>
      <div
        className="absolute top-1/3 left-16 text-xl opacity-10 animate-sparkle-twinkle pointer-events-none hidden lg:block"
        style={{ animationDelay: "0.5s" }}
      >
        ☆
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* ─────────────────────────────────────
            섹션 헤더
            - 지뢰계 이모지 애니메이션 (✧💌✧)
            - 다크모드: 그라데이션 텍스트 (FF69B4 → 9D4EDD)
            ───────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl animate-sparkle-twinkle">✧</span>
            <span className="text-4xl animate-heart-beat">💌</span>
            <span className="text-3xl animate-sparkle-twinkle" style={{ animationDelay: '0.5s' }}>✧</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            고객님들의 솔직한 후기 ♡
          </h2>
          <p className="text-muted-foreground">
            TeddyBear&apos;s Room과 함께한 분들의 이야기를 들어보세요 ✧
          </p>
        </div>

        {/* ─────────────────────────────────────
            후기 캐러셀
            - transform translateX로 부드러운 슬라이드
            - duration-500: 500ms 애니메이션
            ───────────────────────────────────── */}
        <div className="relative">
          {/* ─────────────────────────────────────
              좌/우 네비게이션 버튼
              - md:flex: 태블릿 이상에서만 표시
              - border-2 border-primary/30: 연한 border
              - hover:bg-primary/10: 호버 효과
              ───────────────────────────────────── */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full border-2 border-primary/30 bg-background/80 backdrop-blur hover:bg-primary/10 hover:border-primary transition-all duration-300 hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5 text-primary" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full border-2 border-primary/30 bg-background/80 backdrop-blur hover:bg-primary/10 hover:border-primary transition-all duration-300 hidden md:flex"
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </Button>

          {/* ─────────────────────────────────────
              카드 컨테이너 (Slide)
              ───────────────────────────────────── */}
          <div className="overflow-hidden px-4 md:px-12">
            {/* 슬라이드 애니메이션: translateX로 이동 */}
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                // 개별 후기 카드
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-2 md:px-4"
                >
                  <Card className="mx-auto max-w-2xl rounded-3xl border-2 border-primary/20 bg-card/70 backdrop-blur transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,182,193,0.25)]">
                    <CardContent className="p-6 md:p-8">
                      {/* ─────────────────────────────────────
                          인용 아이콘 (Quote)
                          - 원형 배경: primary/accent 그라데이션
                          ───────────────────────────────────── */}
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                          <Quote className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      {/* ─────────────────────────────────────
                          후기 내용 (텍스트)
                          - 가운데 정렬
                          - leading-relaxed: 행간 넉넉함
                          ───────────────────────────────────── */}
                      <p className="text-center text-foreground leading-relaxed mb-6 text-lg">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>

                      {/* ─────────────────────────────────────
                          별점 표시 (5개 별)
                          - rating 이하: yellow-400 (채움)
                          - 나머지: muted (회색)
                          ───────────────────────────────────── */}
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>

                      {/* ─────────────────────────────────────
                          작성자 정보
                          - 아바타, 이름, 구매인증, 상품명, 날짜
                          ───────────────────────────────────── */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-2xl border-2 border-primary/20">
                          {testimonial.avatar}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {testimonial.name}
                            </span>
                            {testimonial.verified && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                                구매인증 ✓
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{testimonial.product}</span>
                            <span>•</span>
                            <span>{testimonial.date}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────
              도트 페이지네이션
              - 클릭하면 해당 항목으로 이동
              - 현재 페이지: 활성화 (w-8), 나머지: w-3
              - 호버 시 bg-primary/50로 변화
              ───────────────────────────────────── */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────
            통계 행 (Stats Row)
            - 4개 통계: 평점, 리뷰 수, 만족도, 재구매율
            - 반응형: 2열(모바일) → 4열(데스크톱)
            - 호버: -translate-y-1 (위로 올라감)
            ───────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "4.9", label: "평균 평점", emoji: "⭐" },
            { value: "2,000+", label: "리뷰 수", emoji: "💬" },
            { value: "98%", label: "만족도", emoji: "💕" },
            { value: "95%", label: "재구매율", emoji: "🔄" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-2xl bg-card/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-2xl mb-1 block">{stat.emoji}</span>
              <span className="text-2xl font-bold text-primary block">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
