/**
 * Homepage
 * TeddyBear's Room - "Soft Outside, Wild Inside"
 * Premium Pastel Aesthetic - Matching Live Site
 */

"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductsSection } from "./products-section";
import { HeroCircle } from "./hero-circle";

// ============================================================
// STAR ICON - React State-based fallback (prevents DOM manipulation)
// ============================================================
const StarIcon = memo(function StarIcon() {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return <span className="text-lg text-[#FFD700]">★</span>;
  }

  return (
    <Image
      src="/star.svg"
      alt=""
      width={24}
      height={24}
      className="w-6 h-6"
      onError={() => setUseFallback(true)}
    />
  );
});

// ============================================================
// SPARKLE ICON - React State-based fallback
// ============================================================
const SparkleIcon = memo(function SparkleIcon() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null; // Hide on error
  }

  return (
    <Image
      src="/sparkle.svg"
      alt=""
      width={40}
      height={40}
      className="inline-block w-8 h-8 sm:w-10 sm:h-10"
      onError={() => setHasError(true)}
    />
  );
});

// ============================================================
// HERO SECTION - Premium Pastel Luxury
// ============================================================
function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Multi-layer Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />

      {/* Decorative Orbs - Enhanced Pastel Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#FFD6E0] opacity-40 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#E8D5F2] opacity-50 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFF0F3] opacity-60 blur-[80px]" />

        {/* Floating Decorations - Refined */}
        <span className="absolute top-[12%] left-[15%] text-5xl opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>♡</span>
        <span className="absolute top-[20%] right-[12%] text-4xl opacity-15 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}>✧</span>
        <span className="absolute bottom-[25%] left-[8%] text-3xl opacity-20 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}>🎀</span>
        <span className="absolute bottom-[15%] right-[20%] text-4xl opacity-15 animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>☆</span>
        <span className="absolute top-[40%] right-[8%] text-3xl opacity-10 animate-pulse" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}>♡</span>
      </div>

      <div className="container relative z-10 px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Premium Typography */}
          <div className="text-center lg:text-left space-y-8">
            {/* Premium Badge */}
            <div className="inline-flex">
              <Badge className="bg-white/80 backdrop-blur-sm text-[#E8879C] border border-[#FFD6E0] px-5 py-2 text-sm font-medium shadow-lg">
                <span className="mr-2 opacity-70">✧</span>
                TBR Universe Collection
                <span className="ml-2 opacity-70">✧</span>
              </Badge>
            </div>

            {/* Headline - Luxury Typography */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="block text-[#4A4A4A]">Soft Outside,</span>
                <span className="flex items-center gap-3 bg-gradient-to-r from-[#FF8FAB] via-[#C9A8E2] to-[#8BD4C0] bg-clip-text text-transparent">
                  Wild Inside.
                  <SparkleIcon />
                </span>
              </h1>
            </div>

            {/* Subtitle - Refined */}
            <p className="text-lg sm:text-xl text-[#6B6B6B] leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
              일상의 귀여움 뒤에 숨겨진 당신만의 본능.
              <br />
              <span className="text-[#E8879C]">파스텔 무드</span> 프라이빗 셀프케어를 경험하세요.
            </p>

            {/* CTA Buttons - Premium */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] hover:from-[#FFA5B8] hover:to-[#D898B8] text-white px-10 py-6 text-base shadow-lg shadow-pink-200/50 border-0 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-pink-300/50 hover:-translate-y-1"
                asChild
              >
                <Link href="/products" className="flex items-center gap-3">
                  Explore Collection
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#E8D5F2] hover:bg-[#F3E8FF]/50 text-[#8B7AA8] px-10 py-6 text-base rounded-2xl transition-all duration-300 hover:-translate-y-1 bg-white/50 backdrop-blur-sm"
                asChild
              >
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Right Visual - Theme-Aware Interactive Element */}
          <div className="relative hidden lg:flex items-center justify-center">
            <HeroCircle />
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

// ============================================================
// ROOMMATE SECTION - Matching Live Site Layout
// ============================================================
function RoommateSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF8] via-[#FFF5F7] to-[#F3E8FF]" />

      {/* Decorative Orbs */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-[#E8D5F2] rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] bg-[#FFD6E0] rounded-full blur-[100px] opacity-35" />

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[40px] p-10 sm:p-14 shadow-2xl border border-[#FFE8EE]/50 relative overflow-hidden">
            {/* Inner Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#FFE8EE] to-transparent rounded-full blur-[60px] opacity-60" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFE8EE] to-[#FFD6E0] flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎁</span>
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2D2D] leading-tight">
                    Become a
                    <br />
                    <span className="bg-gradient-to-r from-[#E8879C] via-[#C9A8E2] to-[#8BD4C0] bg-clip-text text-transparent">
                      Roommate
                    </span>
                  </h2>
                </div>

                {/* Description */}
                <p className="text-[#6B6B6B] text-lg leading-relaxed">
                  매달 도착하는 시크릿 박스.
                  <br />
                  당신의 취향을 분석해 가장 완벽한 경험을 선물합니다.
                </p>

                {/* Benefits List */}
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[#4A4A4A]">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#7DD3C0] to-[#5BC4B0] flex items-center justify-center text-white text-sm font-bold">✓</span>
                    10% 상시 할인
                  </li>
                  <li className="flex items-center gap-3 text-[#4A4A4A]">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#7DD3C0] to-[#5BC4B0] flex items-center justify-center text-white text-sm font-bold">✓</span>
                    1% 기부 참여
                  </li>
                  <li className="flex items-center gap-3 text-[#4A4A4A]">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#7DD3C0] to-[#5BC4B0] flex items-center justify-center text-white text-sm font-bold">✓</span>
                    무료 배송
                  </li>
                </ul>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#E8879C] to-[#C9A8E2] hover:from-[#D87790] hover:to-[#B898D2] text-white px-10 py-6 text-base shadow-lg shadow-pink-200/50 border-0 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  asChild
                >
                  <Link href="/subscribe" className="flex items-center gap-2">
                    Roommate 되기
                    <span className="text-lg">🏠</span>
                  </Link>
                </Button>
              </div>

              {/* Right Visual - Mystery Box */}
              <div className="relative flex items-center justify-center">
                <div className="relative">
                  {/* Mystery Box Badge */}
                  <div className="absolute -top-4 -left-4 z-20 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-[#FFE8EE]">
                    <span className="text-2xl mr-2">🎁</span>
                    <span className="text-sm font-semibold text-[#4A4A4A]">Mystery Box</span>
                  </div>

                  {/* Main Box Visual */}
                  <div className="w-[280px] h-[320px] sm:w-[320px] sm:h-[360px] bg-gradient-to-br from-[#FFF5F7] to-[#FFE8EE] rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden border border-[#FFD6E0]/30">
                    {/* TBR Logo in Box */}
                    <div className="relative w-32 h-32">
                      <Image
                        src="/logo.png"
                        alt="TBR Mystery Box"
                        fill
                        sizes="128px"
                        className="object-contain drop-shadow-lg"
                        priority={false}
                      />
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 text-2xl opacity-30">✧</div>
                    <div className="absolute bottom-4 left-4 text-2xl opacity-30">♡</div>
                  </div>

                  {/* Satisfaction Badge */}
                  <div className="absolute -bottom-4 -right-4 z-20 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-[#E8FFF5]">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7DD3C0] to-[#5BC4B0] flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-[#5BC4B0]">Satisfaction</p>
                        <p className="text-sm font-bold text-[#2D2D2D]">100% Guaranteed</p>
                      </div>
                    </div>
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
// CUSTOMER REVIEWS - CAROUSEL WITH 4 REVIEWS
// ============================================================
function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const reviews = [
    {
      id: 1,
      content: "포장이 정말 꼼꼼하고 예뻐요! 무지박스 배송이라 프라이버시도 완벽하게 지켜지네요. 파스텔 감성 제품들이 너무 귀여워서 방 분위기가 확 바뀌었어요 ♡",
      author: "김**",
      verified: true,
      product: "베어 컴포트 세트",
      date: "2025.11.15",
      emoji: "🐰",
    },
    {
      id: 2,
      content: "구독 서비스 진짜 좋아요! 매달 새로운 제품을 합리적인 가격에 받아볼 수 있어서 만족스러워요. 기부 투표 기능도 너무 좋은 취지인 것 같아요 ✨",
      author: "이**",
      verified: true,
      product: "스탠다드 멤버십",
      date: "2025.11.12",
      emoji: "🦊",
    },
    {
      id: 3,
      content: "사이즈 추천 기능 덕분에 딱 맞는 제품을 선택할 수 있었어요. 고민 없이 구매했는데 정말 잘 맞아서 놀랐어요! 앞으로도 자주 이용할게요 🧸",
      author: "박**",
      verified: true,
      product: "코지 라운지웨어",
      date: "2025.11.08",
      emoji: "🐻",
    },
    {
      id: 4,
      content: "디자인이 너무 예쁘고 품질도 좋아요. 다크모드에서 보는 네온 디자인이 진짜 감각적이에요! 친구들한테도 추천했어요 💖",
      author: "최**",
      verified: true,
      product: "네온 무드 컬렉션",
      date: "2025.11.05",
      emoji: "🐱",
    },
  ];

  const stats = [
    { icon: "⭐", value: "4.9", label: "평균 평점" },
    { icon: "💬", value: "2,000+", label: "리뷰 수" },
    { icon: "💕", value: "98%", label: "만족도" },
    { icon: "🔄", value: "95%", label: "재구매율" },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFFBF8] to-[#FFF5F7]" />
      <div className="absolute top-[20%] left-[5%] w-[300px] h-[300px] bg-[#FFE8EE] rounded-full blur-[100px] opacity-30" />
      <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-[#F3E8FF] rounded-full blur-[120px] opacity-30" />

      {/* Floating Decorations */}
      <span className="absolute top-[8%] left-[10%] text-4xl opacity-10">♡</span>
      <span className="absolute top-[15%] right-[15%] text-3xl opacity-8">✧</span>
      <span className="absolute bottom-[12%] left-[20%] text-3xl opacity-10">🎀</span>
      <span className="absolute bottom-[20%] right-[10%] text-2xl opacity-8">☆</span>

      <div className="container relative z-10">
        {/* Section Header - Premium */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
            <span className="text-xl opacity-60">✧</span>
            <span className="text-2xl">💌</span>
            <span className="text-xl opacity-60">✧</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D]">
            고객님들의 솔직한 후기 <span className="text-[#FFB5C5]">♡</span>
          </h2>
          <p className="text-[#6B6B6B] text-lg">
            TeddyBear&apos;s Room과 함께한 분들의 이야기를 들어보세요 ✧
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mb-16">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-[#FFE8EE] flex items-center justify-center hover:bg-white transition-all hover:scale-110"
            aria-label="Previous review"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-[#FFE8EE] flex items-center justify-center hover:bg-white transition-all hover:scale-110"
            aria-label="Next review"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* Reviews Carousel */}
          <div className="overflow-hidden px-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#FFE8EE]/50">
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-[#4A4A4A] mb-6 leading-relaxed text-center text-lg">
                      &ldquo;{review.content}&rdquo;
                    </p>

                    {/* Author - Premium */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#FFE8EE]">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE8EE] to-[#FFD6E0] flex items-center justify-center text-2xl shadow-inner">
                        {review.emoji}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#2D2D2D]">{review.author}</span>
                          {review.verified && (
                            <span className="text-xs bg-[#E8FFF5] text-[#5BC4B0] px-2 py-0.5 rounded-full font-medium">구매인증 ✓</span>
                          )}
                        </div>
                        <div className="text-xs text-[#8B8B8B]">
                          {review.product} • {review.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] w-8'
                    : 'bg-[#E5E5E5] hover:bg-[#FFD6E0]'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats - Premium */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-[#FFE8EE]/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[#2D2D2D] mb-1">{stat.value}</div>
              <div className="text-sm text-[#8B8B8B]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MAIN PAGE EXPORT
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
