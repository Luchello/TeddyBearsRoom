/**
 * Homepage
 * TeddyBear's Room - "Soft Outside, Wild Inside"
 * 지뢰계 감성 프라이빗 셀프케어
 */

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ============================================================
// HERO SECTION - "Soft Outside, Wild Inside"
// ============================================================
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-beige-50 to-lavender-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-pink-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-lavender-200/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-beige-200/30 blur-3xl" />
        {/* Floating decorations */}
        <span className="absolute top-[15%] left-[20%] text-4xl animate-bounce opacity-40" style={{ animationDelay: '0.5s' }}>♡</span>
        <span className="absolute top-[25%] right-[15%] text-3xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>✧</span>
        <span className="absolute bottom-[30%] left-[10%] text-2xl animate-bounce opacity-35" style={{ animationDelay: '1.5s' }}>🎀</span>
        <span className="absolute bottom-[20%] right-[25%] text-3xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>☆</span>
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-pink-100 text-pink-600 border-pink-200 px-4 py-1.5">
              ✧ TBR Universe Collection ✧
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              <span className="block text-foreground">Soft Outside,</span>
              <span className="block bg-gradient-to-r from-pink-500 via-lavender-500 to-mint-500 bg-clip-text text-transparent">
                Wild Inside.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              일상의 귀여움 뒤에 숨겨진 당신만의 본능.
              <br />
              지뢰계 감성 프라이빗 셀프케어를 경험하세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8" asChild>
                <Link href="/products" className="flex items-center gap-2">
                  Explore Collection
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-pink-200 hover:bg-pink-50" asChild>
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Right Visual - Interactive Cards */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Main Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100 to-lavender-100 border border-pink-200/50 flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <div className="text-6xl mb-2">🧸</div>
                  <span className="text-sm text-pink-600 font-medium">Touch Me</span>
                </div>
              </div>
              {/* Orbiting badge */}
              <div className="absolute -top-4 -right-4 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Enter The Void ✧
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CURATED PLEASURE - PRODUCT CARDS SECTION
// ============================================================
function ProductsSection() {
  const products = [
    {
      id: 1,
      name: "파스텔 드림 컬렉션 - 소프트 터치",
      category: "토이",
      price: 39000,
      originalPrice: 49000,
      badges: ["NEW", "BEST"],
      discount: 20,
      rating: 5,
      image: "/placeholder-product.jpg",
    },
    {
      id: 2,
      name: "코지 나이트 아로마 캔들 세트",
      category: "무드",
      price: 28000,
      badges: ["NEW"],
      rating: 5,
      image: "/placeholder-product.jpg",
    },
    {
      id: 3,
      name: "실크 터치 마사지 오일",
      category: "케어",
      price: 32000,
      originalPrice: 38000,
      badges: ["BEST"],
      discount: 16,
      rating: 5,
      image: "/placeholder-product.jpg",
    },
    {
      id: 4,
      name: "베어 허그 쿠션 세트",
      category: "라이프",
      price: 45000,
      rating: 5,
      image: "/placeholder-product.jpg",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Curated Pleasure</h2>
            <p className="text-muted-foreground">
              엄선된 아이템으로 당신의 취향을 발견하세요.
              <br className="hidden sm:block" />
              귀여움 속에 숨겨진 기능을 탐험해보세요.
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium group"
          >
            View All Products
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ product }: { product: {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badges?: string[];
  discount?: number;
  rating: number;
  image: string;
}}) {
  return (
    <div className="group">
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square mb-3 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-beige-50 border border-pink-100">
        {/* Placeholder for product image */}
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
          🧸
        </div>

        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  badge === 'NEW' ? 'bg-mint-500 text-white' :
                  badge === 'BEST' ? 'bg-pink-500 text-white' :
                  'bg-gray-900 text-white'
                }`}
              >
                {badge}
              </span>
            ))}
            {product.discount && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                -{product.discount}%
              </span>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-500">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick View Button */}
        <button className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          Quick View
        </button>
      </Link>

      {/* Product Info */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{product.category}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs text-yellow-400">★</span>
            ))}
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold">{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors">
            <span className="text-pink-600 font-medium">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BECOME A ROOMMATE - SUBSCRIPTION SECTION
// ============================================================
function RoommateSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-lavender-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">🏠</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Become a
            </h2>
            <h2 className="text-3xl sm:text-4xl font-bold text-pink-500 mb-6">
              Roommate
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              매달 도착하는 시크릿 박스.
              <br />
              당신의 취향을 분석해 가장 완벽한 경험을 선물합니다.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center text-sm">✓</span>
                <span>10% 상시 할인</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center text-sm">✓</span>
                <span>1% 기부 참여</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center text-sm">✓</span>
                <span>무료 배송</span>
              </li>
            </ul>

            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6" asChild>
              <Link href="/subscribe">
                Roommate 되기 🏠
              </Link>
            </Button>
          </div>

          {/* Right Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Mystery Box Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
                <div className="text-center mb-4">
                  <span className="text-6xl">🎁</span>
                </div>
                <p className="text-center font-medium text-pink-600">Mystery Box</p>
              </div>

              {/* Satisfaction Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-pink-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="text-xs text-muted-foreground">Satisfaction</p>
                    <p className="text-sm font-bold text-pink-600">100% Guaranteed</p>
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
// CUSTOMER REVIEWS SECTION
// ============================================================
function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      content: "포장이 정말 꼼꼼하고 예뻐요! 무지박스 배송이라 프라이버시도 완벽하게 지켜지네요. 지뢰계 감성 제품들이 너무 귀여워서 방 분위기가 확 바뀌었어요 ♡",
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
  ];

  const stats = [
    { icon: "⭐", value: "4.9", label: "평균 평점" },
    { icon: "💬", value: "2,000+", label: "리뷰 수" },
    { icon: "💕", value: "98%", label: "만족도" },
    { icon: "🔄", value: "95%", label: "재구매율" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-50 relative overflow-hidden">
      {/* Floating decorations */}
      <span className="absolute top-[10%] left-[5%] text-3xl opacity-20">♡</span>
      <span className="absolute top-[20%] right-[10%] text-2xl opacity-15">✧</span>
      <span className="absolute bottom-[15%] left-[15%] text-3xl opacity-20">🎀</span>
      <span className="absolute bottom-[25%] right-[5%] text-2xl opacity-15">☆</span>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl opacity-60">✧</span>
            <span className="text-2xl">💌</span>
            <span className="text-xl opacity-60">✧</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            고객님들의 솔직한 후기 ♡
          </h2>
          <p className="text-muted-foreground">
            TeddyBear&apos;s Room과 함께한 분들의 이야기를 들어보세요 ✧
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                &ldquo;{review.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">
                  {review.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{review.author}</span>
                    {review.verified && (
                      <span className="text-xs text-mint-600">구매인증 ✓</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {review.product} • {review.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-pink-100"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-pink-600">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// NEWSLETTER SECTION
// ============================================================
function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-100 via-lavender-100 to-mint-100">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-pink-400">💕</span>
            <span className="text-2xl">📧</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold mb-3">
            Join the TBR Universe
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            신상품 출시 알림, 시크릿 할인 코드, 그리고 특별한 초대장을 보내드려요 ✨
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="이메일 주소를 입력해주세요"
                className="w-full px-4 py-3 pl-10 rounded-full border border-pink-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">📧</span>
            </div>
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
              구독하기
            </Button>
          </form>
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
      <RoommateSection />
      <ReviewsSection />
      <NewsletterSection />
    </>
  );
}
