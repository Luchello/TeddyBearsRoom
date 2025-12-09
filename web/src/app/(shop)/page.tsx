/**
 * Homepage
 * TeddyBear's Room - Main Landing Page
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-beige-100 via-pink-50 to-lavender-50 dark:from-beige-950 dark:via-pink-950 dark:to-lavender-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-pink-200 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-lavender-200 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-mint-200 blur-3xl" />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <Badge variant="premium" className="mb-4">
            이너 써클 신규 가입 15% 할인
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            당신만의 특별한
            <br />
            <span className="text-gradient bg-gradient-to-r from-pink-500 via-primary to-lavender-500 bg-clip-text text-transparent">
              프라이빗 공간
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            TeddyBear&apos;s Room에서
            <br className="sm:hidden" /> 안전하고 편안하게 쇼핑하세요
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/products">쇼핑 시작하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/inner-circle">이너 써클 알아보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: "프라이버시 보호",
      description: "철저한 개인정보 보호와 익명 배송으로 안심하세요",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: "안전 인증 제품",
      description: "식약처 인증 제품만 엄선하여 판매합니다",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
      title: "전문 큐레이션",
      description: "당신에게 딱 맞는 제품을 추천해 드립니다",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      ),
      title: "빠른 무료 배송",
      description: "3만원 이상 구매 시 무료 배송",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            왜 TeddyBear&apos;s Room인가요?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            당신의 프라이버시와 만족을 최우선으로 생각합니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border hover:border-primary/20 hover:shadow-[var(--shadow-medium)] transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
  const categories = [
    { name: "바이브레이터", href: "/products?category=vibrators", emoji: "✨" },
    { name: "딜도", href: "/products?category=dildos", emoji: "💫" },
    { name: "커플 아이템", href: "/products?category=couples", emoji: "💕" },
    { name: "웰니스", href: "/products?category=wellness", emoji: "🌸" },
    { name: "러브젤", href: "/products?category=lubricants", emoji: "💧" },
    { name: "액세서리", href: "/products?category=accessories", emoji: "🎀" },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            카테고리 둘러보기
          </h2>
          <p className="text-muted-foreground">
            원하는 카테고리를 선택해 쇼핑을 시작하세요
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center p-6 rounded-2xl bg-card border hover:border-primary/20 hover:shadow-[var(--shadow-medium)] transition-all group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.emoji}
              </span>
              <span className="font-medium text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Inner Circle CTA Section
function InnerCircleCTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-100 via-lavender-100 to-mint-100 dark:from-pink-950 dark:via-lavender-950 dark:to-mint-950 p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <Badge variant="innerCircle" className="mb-4">
              이너 써클
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              특별한 혜택의 시작
            </h2>
            <p className="text-muted-foreground mb-6">
              이너 써클 회원이 되어 10% 상시 할인, 무료 배송, 그리고 사회 공헌
              프로그램에 참여하세요.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <span className="text-primary">✓</span> 모든 상품 10% 상시 할인
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-primary">✓</span> 3만원 이상 무료 배송
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-primary">✓</span> 구매 금액의 1% 기부 참여
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-primary">✓</span> 신상품 우선 알림
              </li>
            </ul>
            <Button asChild>
              <Link href="/inner-circle">월 9,900원으로 시작하기</Link>
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-lavender-200/50 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <InnerCircleCTA />
    </>
  );
}
