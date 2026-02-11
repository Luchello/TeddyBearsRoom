import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";
import { ArrowRight, Heart, ShieldCheck, Truck, Sparkles, Gift, Star, Package } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ════════ HERO — 2-Column with Whimsyshire sky ════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#9ECFE8] via-[#C8E4F5] to-[#E8F2FB]" />
          {/* Sun glow */}
          <div className="absolute top-[8%] right-[10%] w-32 h-32 rounded-full bg-[#FFD97D]/30 blur-[60px]" />
          {/* CSS Clouds — subtle, no emoji */}
          <div className="absolute top-[12%] left-[5%] w-36 h-10 bg-white/50 rounded-full blur-sm" />
          <div className="absolute top-[12%] left-[7%] w-20 h-14 bg-white/50 rounded-full blur-sm -translate-y-2" />
          <div className="absolute top-[18%] right-[15%] w-28 h-8 bg-white/40 rounded-full blur-sm" />
          <div className="absolute top-[18%] right-[17%] w-16 h-11 bg-white/40 rounded-full blur-sm -translate-y-1.5" />
          <div className="absolute top-[8%] left-[42%] w-24 h-7 bg-white/30 rounded-full blur-sm" />
          {/* Soft teal/pink accents */}
          <div className="absolute bottom-[20%] left-0 w-[500px] h-[300px] bg-[#E8658A]/[0.04] rounded-full blur-[80px]" />
          <div className="absolute top-[30%] right-0 w-[400px] h-[300px] bg-[#56B4A9]/[0.04] rounded-full blur-[80px]" />
        </div>

        {/* Soft meadow hint at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#E8F5E8]/40 to-transparent" />

        {/* Rainbow divider */}
        <div className="absolute bottom-0 left-0 right-0 rainbow-line" />

        {/* Content — 2 columns */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full pt-28 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/50 backdrop-blur-sm text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8658A]" />
                Premium Self-Care Boutique
              </div>

              <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.92] tracking-[-0.04em] mb-8">
                <span className="block text-foreground">Soft Outside,</span>
                <span className="block rainbow-text mt-1">Wild Inside.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
                겉은 포근한 테디베어, 속은 대담한 자기 발견.<br />
                당신만의 프라이빗 유니버스에 오신 걸 환영합니다.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Button asChild size="lg" className="rounded-full text-base px-10 py-6 bg-[#E8658A] text-white hover:bg-[#D4506F] shadow-[0_8px_24px_rgba(232,101,138,0.3)] hover:shadow-[0_12px_32px_rgba(232,101,138,0.4)] transition-all duration-300 hover:-translate-y-0.5">
                  <Link href="/products">
                    컬렉션 보기 <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-full text-base px-10 py-6 text-foreground/70 hover:text-foreground hover:bg-white/50 transition-all">
                  <Link href="/about">브랜드 스토리</Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-[#E8658A]/20 to-[#56B4A9]/20" />
                    ))}
                  </div>
                  <span className="font-medium">2,400+ 회원</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1">
                  {[0,1,2,3,4].map(i => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#D4A853] fill-[#D4A853]" />
                  ))}
                  <span className="ml-1 font-medium">4.9</span>
                </div>
              </div>
            </div>

            {/* Right — Featured Cards */}
            <div className="space-y-4 hidden lg:block">
              {/* Best Seller Card */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 flex items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer">
                <div className="relative w-20 h-20 shrink-0 rounded-xl bg-gradient-to-br from-[#F5EEF8] to-[#E4F0FB] p-3">
                  <Image src="/tbr_logo.png" alt="Best Seller" fill className="object-contain group-hover:scale-110 transition-transform duration-500 p-2" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-[#E8658A] text-white px-2 py-0.5 rounded-full">Best Seller</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#56B4A9]">-20%</span>
                  </div>
                  <p className="font-bold text-foreground">파스텔 드림 컬렉션</p>
                  <p className="text-sm text-muted-foreground">가장 사랑받는 아이템</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#E8658A]">₩39,000</p>
                  <p className="text-xs text-muted-foreground line-through">₩49,000</p>
                </div>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: '토이', color: 'from-[#F5EEF8] to-[#FFE8F0]', count: '24' },
                  { name: '무드', color: 'from-[#E4F0FB] to-[#EEF0FF]', count: '18' },
                  { name: '케어', color: 'from-[#FFE8F0] to-[#FFF0E8]', count: '32' },
                  { name: '라이프', color: 'from-[#E8F5E8] to-[#E4F0FB]', count: '15' },
                ].map((cat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${cat.color} rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
                    <p className="text-2xl font-black text-foreground/80 group-hover:text-foreground transition-colors">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cat.count}개 상품</p>
                  </div>
                ))}
              </div>

              {/* Promo */}
              <div className="bg-gradient-to-r from-[#E8658A]/10 via-[#D4A853]/10 to-[#56B4A9]/10 rounded-2xl p-5 flex items-center justify-between border border-[#E8658A]/10">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-[#E8658A]" />
                  <div>
                    <p className="font-bold text-sm text-foreground">첫 구매 15% 할인</p>
                    <p className="text-xs text-muted-foreground">코드: <span className="font-mono font-bold text-[#E8658A]">WHIMSY15</span></p>
                  </div>
                </div>
                <Button asChild size="sm" className="rounded-full bg-[#E8658A] text-white hover:bg-[#D4506F] text-xs px-4">
                  <Link href="/products">적용하기</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TRUST BAR ════════ */}
      <section className="py-14 bg-white border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, title: '비밀 보장 배송', desc: '무표기 포장, 개인정보 100% 보호', accent: '#E8658A' },
              { icon: <Truck className="w-5 h-5" />, title: '무료 배송', desc: '₩30,000 이상 주문 시 전국 무료', accent: '#56B4A9' },
              { icon: <Heart className="w-5 h-5" />, title: '품질 보증', desc: '인체공학 설계, 안전 인증 소재', accent: '#D4A853' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300" style={{ background: `${item.accent}12`, color: item.accent }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-0.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURED PRODUCTS ════════ */}
      <section className="py-24 bg-[#FAFBFF]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#E8658A] mb-3">Curated Selection</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">이달의 컬렉션</h2>
            </div>
            <Button asChild variant="ghost" className="group text-sm font-medium text-muted-foreground hover:text-foreground p-0 h-auto">
              <Link href="/products" className="flex items-center gap-2">
                전체 보기 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Rainbow divider */}
      <div className="mx-auto max-w-6xl px-6"><div className="rainbow-line" /></div>

      {/* ════════ SUBSCRIPTION ════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Visual (Gift box concept) */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-[#E8658A]/8 via-[#F5EEF8] to-[#E4F0FB] overflow-hidden relative border border-[#E8658A]/10">
                {/* Decorative circles */}
                <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-[#56B4A9]/8" />
                <div className="absolute bottom-12 left-8 w-16 h-16 rounded-full bg-[#D4A853]/8" />
                <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-[#E8658A]/5" />

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 mb-6">
                    <Image src="/tbr_logo.png" alt="Mystery Box" fill className="object-contain" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-sm">
                    <p className="text-sm font-bold text-foreground">Monthly Mystery Box</p>
                  </div>
                </div>

                {/* Price tag */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From</p>
                  <p className="text-xl font-black text-[#E8658A]">₩9,900<span className="text-xs font-medium text-muted-foreground">/월</span></p>
                </div>

                {/* Satisfaction badge */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#E8658A] fill-[#E8658A]" />
                    <div>
                      <p className="text-xs font-bold text-foreground">100%</p>
                      <p className="text-[10px] text-muted-foreground">만족 보장</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Copy */}
            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#56B4A9] mb-3">Roommate Membership</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-snug mb-4">
                  매달 도착하는<br />시크릿 셀프케어 박스
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-lg">
                  당신의 취향을 분석해 가장 완벽한 아이템을 큐레이션합니다.
                  구독자 전용 할인, 선출시 체험, 무료 배송까지.
                </p>
              </div>

              <ul className="space-y-3">
                {subscriptionBenefits.slice(0, 4).map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#56B4A9]/15 text-[#56B4A9] flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-foreground">{benefit.title}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button asChild size="lg" className="rounded-full px-10 py-6 text-base bg-[#E8658A] text-white hover:bg-[#D4506F] shadow-[0_8px_24px_rgba(232,101,138,0.3)] hover:shadow-[0_12px_32px_rgba(232,101,138,0.4)] transition-all duration-300 hover:-translate-y-0.5">
                  <Link href="/subscribe">
                    <Sparkles className="mr-2 w-4 h-4" />
                    구독 시작하기
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground pt-3">언제든 해지 가능 · 첫 달 10% 할인</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <Testimonials />

      {/* ════════ CLOSING CTA — compact ════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6FAFF] to-[#E4F0FB]" />
        <div className="absolute top-0 left-0 right-0 rainbow-line" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            새로운 자신을 만나보세요.
          </h2>
          <p className="text-muted-foreground mb-8">TeddyBear&apos;s Room에서 시작하는 프라이빗 셀프케어.</p>
          <Button asChild size="lg" className="rounded-full text-base px-10 py-6 bg-[#E8658A] text-white hover:bg-[#D4506F] shadow-[0_8px_24px_rgba(232,101,138,0.3)] transition-all duration-300 hover:-translate-y-0.5">
            <Link href="/products">
              쇼핑 시작하기 <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
