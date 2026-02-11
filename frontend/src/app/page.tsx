import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";
import { ArrowRight, Heart, ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════
          HERO — Immersive Sky
          Full-viewport, ethereal gradient with
          bold typography as the focal point.
          ════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Sky gradient — layered for depth */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#C1E0F7] via-[#E4F0FB] to-[#F6FAFF]" />
          {/* Soft radial highlight */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-white/40 rounded-full blur-[120px]" />
          {/* Warm accent glow */}
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-[#E8658A]/[0.06] rounded-full blur-[100px]" />
          <div className="absolute top-20 right-0 w-[500px] h-[400px] bg-[#56B4A9]/[0.05] rounded-full blur-[100px]" />
        </div>

        {/* Rainbow line at bottom — elegant divider */}
        <div className="absolute bottom-0 left-0 right-0 rainbow-line" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center pt-24 pb-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-white/60 backdrop-blur-sm text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8658A]" />
            Premium Self-Care Boutique
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[0.95] tracking-[-0.04em] mb-8">
            <span className="block text-foreground">Soft Outside,</span>
            <span className="block rainbow-text">Wild Inside.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            겉은 포근한 테디베어, 속은 대담한 자기 발견.
            <br className="hidden sm:block" />
            당신만의 프라이빗 유니버스에 오신 걸 환영합니다.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="rounded-full text-base px-10 py-6 bg-foreground text-white hover:bg-foreground/90 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-0.5">
              <Link href="/products">
                컬렉션 보기 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-full text-base px-10 py-6 text-foreground/70 hover:text-foreground hover:bg-white/50 transition-all duration-300">
              <Link href="/about">브랜드 스토리</Link>
            </Button>
          </div>

          {/* Social proof strip */}
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
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
                <svg key={i} className="w-3.5 h-3.5 text-[#D4A853] fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
              ))}
              <span className="ml-1 font-medium">4.9</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-foreground/15 flex justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-foreground/30" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TRUST BAR — 3 pillars
          ════════════════════════════════════ */}
      <section className="py-16 bg-white border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, title: '비밀 보장 배송', desc: '무표기 포장, 개인정보 100% 보호' },
              { icon: <Truck className="w-5 h-5" />, title: '무료 배송', desc: '₩30,000 이상 주문 시 전국 무료' },
              { icon: <Heart className="w-5 h-5" />, title: '품질 보증', desc: '인체공학 설계, 안전 인증 소재' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground/60 group-hover:bg-[#E8658A]/10 group-hover:text-[#E8658A] transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-0.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FEATURED PRODUCTS
          Clean grid, generous spacing
          ════════════════════════════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#E8658A] mb-3">Curated Selection</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">이달의 컬렉션</h2>
            </div>
            <Button asChild variant="ghost" className="group text-sm font-medium text-muted-foreground hover:text-foreground p-0 h-auto">
              <Link href="/products" className="flex items-center gap-2">
                전체 보기
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Rainbow divider */}
      <div className="mx-auto max-w-6xl px-6"><div className="rainbow-line" /></div>

      {/* ════════════════════════════════════
          SUBSCRIPTION CTA
          ════════════════════════════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left — Visual */}
            <div className="lg:col-span-2 relative">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#E4F0FB] via-[#F6FAFF] to-[#F5EEF8] overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-40 h-40 opacity-80">
                    <Image src="/tbr_logo.png" alt="TBR" fill className="object-contain" />
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-premium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8658A]/10 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-[#E8658A] fill-current" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Satisfaction</p>
                      <p className="text-sm font-bold text-foreground">100% 만족 보장</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Copy */}
            <div className="lg:col-span-3 space-y-8">
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
                <Button asChild size="lg" className="rounded-full px-10 py-6 text-base shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-0.5">
                  <Link href="/subscribe">
                    <Sparkles className="mr-2 w-4 h-4" />
                    월 ₩9,900으로 시작하기
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground pt-2">언제든 해지 가능 · 첫 달 10% 할인</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════ */}
      <Testimonials />

      {/* ════════════════════════════════════
          CLOSING CTA
          ════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6FAFF] via-[#EEF2F9] to-[#E4F0FB]" />
        <div className="absolute top-0 left-0 right-0 rainbow-line" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            당신의 비밀 유니버스가<br />기다리고 있어요.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            지금 TeddyBear&apos;s Room에서 새로운 자신을 만나보세요.
          </p>
          <Button asChild size="lg" className="rounded-full text-base px-12 py-7 bg-foreground text-white hover:bg-foreground/90 shadow-premium-lg transition-all duration-300 hover:-translate-y-0.5">
            <Link href="/products">
              쇼핑 시작하기 <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
