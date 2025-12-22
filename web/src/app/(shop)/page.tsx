/**
 * Homepage
 * TeddyBear's Room - "Soft Whimsyshire" Theme
 */

"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductsSection } from "./products-section";
import { HeroCircle } from "./hero-circle";

// ============================================================
// ICONS
// ============================================================
const SparkleIcon = memo(function SparkleIcon() {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;
  return (
    <Image
      src="/sparkle.svg"
      alt=""
      width={40}
      height={40}
      className="inline-block w-8 h-8 sm:w-10 sm:h-10 animate-pulse"
      onError={() => setHasError(true)}
    />
  );
});

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-[var(--color-dream-50)]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-love-50)_0%,var(--color-dream-100)_50%,var(--color-magic-50)_100%)] opacity-80" />

      {/* Cloud Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-[var(--color-love-200)] opacity-30 blur-[120px] animate-float" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-[var(--color-dream-200)] opacity-30 blur-[150px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--color-magic-200)] opacity-20 blur-[100px]" />

        {/* Whimsy Particles */}
        <div className="absolute top-[15%] left-[10%] text-4xl opacity-40 animate-bounce-soft">☁️</div>
        <div className="absolute bottom-[20%] right-[15%] text-4xl opacity-40 animate-bounce-soft" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-[25%] right-[25%] text-2xl opacity-60 animate-pulse text-[var(--color-primary)]">♥</div>
      </div>

      <div className="container relative z-10 px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex animate-bounce-soft">
              <Badge className="badge-cloud shadow-lg backdrop-blur-md">
                <span className="mr-2">🌈</span>
                Welcome to Whimsyshire
                <span className="ml-2">☁️</span>
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-[var(--color-foreground)]">
                <span className="block opacity-80">Dreamy Soft,</span>
                <span className="flex items-center gap-3 text-rainbow">
                  Wildly Cute.
                  <SparkleIcon />
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-[var(--color-foreground)]/70 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
              솜사탕 같은 일상 속 숨겨진 환상의 세계.
              <br />
              <strong className="text-[var(--color-primary)]">TeddyBear&apos;s Room</strong>에서 마법 같은 편안함을 만나보세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                size="lg"
                variant="bubbly"
                className="text-base px-10 py-6"
                asChild
              >
                <Link href="/products" className="flex items-center gap-3">
                  Start Dreaming
                  <span className="text-xl">🦄</span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-[var(--color-magic-200)] text-[var(--color-magic-500)] hover:bg-[var(--color-magic-50)] px-10 py-6 text-base"
                asChild
              >
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:flex items-center justify-center">
            <HeroCircle />
            {/* Extra Sparkles around HeroCircle */}
            <div className="absolute -top-10 -right-10 text-6xl animate-pulse opacity-50">✨</div>
            <div className="absolute -bottom-10 -left-10 text-5xl animate-bounce-soft opacity-50">🌟</div>
          </div>
        </div>
      </div>

      {/* Cloud Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
    </section>
  );
}

// ============================================================
// ROOMMATE SECTION
// ============================================================
function RoommateSection() {
  return (
    <section className="py-28 relative overflow-hidden bg-[var(--color-dream-50)]">
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="card-whimsy p-10 sm:p-14 relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-love-100)] flex items-center justify-center shadow-inner text-3xl">
                  🎁
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] leading-tight">
                    Become a <br />
                    <span className="text-rainbow">Roommate</span>
                  </h2>
                </div>

                <p className="text-[var(--color-foreground)]/80 text-lg leading-relaxed">
                  매달 무지개 너머에서 도착하는 시크릿 박스.
                  <br />
                  당신의 취향을 저격할 환상적인 아이템들을 만나보세요.
                </p>

                <ul className="space-y-3">
                  {['10% 상시 할인', '1% 기부 참여', '무료 배송'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--color-foreground)]/80 font-medium">
                      <span className="w-6 h-6 rounded-full bg-[var(--color-fresh-300)] flex items-center justify-center text-white text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  variant="bubbly"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href="/subscribe" className="flex items-center gap-2 justify-center">
                    Roommate 신청하기
                    <span>🏠</span>
                  </Link>
                </Button>
              </div>

              {/* Right Visual */}
              <div className="relative flex items-center justify-center">
                <div className="relative animate-float">
                  <div className="w-[300px] h-[340px] bg-gradient-to-br from-[var(--color-love-50)] to-[var(--color-magic-50)] rounded-3xl shadow-[var(--shadow-dream)] border border-[var(--color-magic-100)] flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for Box Image */}
                    <div className="text-6xl">📦</div>
                    <div className="absolute top-4 right-4 text-2xl opacity-40">✨</div>
                    <div className="absolute bottom-4 left-4 text-2xl opacity-40">💖</div>
                  </div>

                  {/* Badge */}
                  <div className="absolute -bottom-6 -right-6 badge-cloud px-6 py-3 shadow-xl">
                    <p className="text-xs font-semibold text-[var(--color-fresh-500)]">Satisfaction</p>
                    <p className="text-lg font-bold text-[var(--color-foreground)]">100% Cotton</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// REVIEWS SECTION
// ============================================================
function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    { id: 1, content: "너무 몽글몽글하고 귀여워요! 박스를 열자마자 행복해졌어요.", author: "Cloud**", emoji: "☁️" },
    { id: 2, content: "색감이 미쳤어요... 진짜 화면보다 실물이 100배 더 예뿜 ㅠㅠ", author: "Pink**", emoji: "🦄" },
    { id: 3, content: "친구 선물로 줬는데 포장이 예뻐서 뜯기 아깝다고 하네요 ㅎㅎ", author: "Star**", emoji: "⭐" },
  ];

  const nextSlide = useCallback(() => setCurrentIndex((p) => (p + 1) % reviews.length), [reviews.length]);
  const prevSlide = useCallback(() => setCurrentIndex((p) => (p - 1 + reviews.length) % reviews.length), [reviews.length]);

  return (
    <section className="py-28 relative overflow-hidden bg-[var(--color-background)]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-magic-200)] to-transparent opacity-50" />

      <div className="container relative z-10">
        <div className="text-center mb-16 space-y-4">
          <Badge className="badge-cloud mx-auto">
            <span>💌 Real Reviews</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)]">
            행복한 <span className="text-[var(--color-love-500)]">구름 위</span> 후기들
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto px-12">
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition z-10">←</button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition z-10">→</button>

          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <div className="card-whimsy p-8 text-center bg-white/60">
                    <div className="text-4xl mb-6">{review.emoji}</div>
                    <p className="text-xl text-[var(--color-foreground)]/80 mb-6 font-medium">&ldquo;{review.content}&rdquo;</p>
                    <p className="text-sm font-bold text-[var(--color-magic-600)]">- {review.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <ReviewsSection />
      <RoommateSection />
    </>
  );
}
