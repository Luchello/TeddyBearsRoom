import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";
import {
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Star,
  Quote,
} from "lucide-react";

const categories = [
  { name: "Toys", href: "/products?category=toys", img: "/images/cat-toys.webp" },
  { name: "Mood", href: "/products?category=mood", img: "/images/cat-mood.webp" },
  { name: "Care", href: "/products?category=care", img: "/images/cat-care.webp" },
  { name: "Body", href: "/products?category=body", img: "/images/cat-body.webp" },
  { name: "Lifestyle", href: "/products?category=lifestyle", img: "/images/cat-lifestyle.webp" },
  { name: "Gifts", href: "/products?category=gifts", img: "/images/cat-gifts.webp" },
];

const reviews = [
  {
    name: "H",
    title: "포장부터 안심이 됐어요",
    body: "무표기 포장이라 정말 편했습니다. 제품도 촉감이 매끈하고, 사용 설명이 깔끔하게 정리되어 있어요.",
    rating: 5,
  },
  {
    name: "J",
    title: "과하지 않고 세련된 셀렉션",
    body: "딱 필요한 것들만 모아둔 느낌. 디자인도 과장되지 않아서 선물로도 부담이 없었습니다.",
    rating: 5,
  },
  {
    name: "S",
    title: "배송이 정말 빠릅니다",
    body: "오후에 주문했는데 다음날 도착했어요. 상담도 친절했고, 교환 안내가 명확했습니다.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image src="/images/hero-mood.webp" alt="" fill className="object-cover" priority />
          {/* Deep navy overlay → transparent */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F1A]/80 via-[#0F0F1A]/50 to-[#0F0F1A]/30" />
        </div>

        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.22em] uppercase text-white/70">
                Premium Intimacy Wellness Boutique
              </p>
              <h1 className="font-display text-white mt-4 text-4xl sm:text-6xl lg:text-7xl leading-[0.95]">
                Soft Outside,
                <br />
                Wild Inside.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
                당신만의 프라이빗 유니버스.
                <br />
                은은하고 안전한 셀프케어를 위한 큐레이션을 제공합니다.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white text-[#0F0F1A] hover:bg-white/90"
                >
                  <Link href="/products">
                    컬렉션 보기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/about">브랜드 스토리</Link>
                </Button>

                <div className="mt-5 sm:mt-0 sm:ml-4 inline-flex items-center gap-3 text-xs text-white/65">
                  <div className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Discreet</span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-current" />
                    <span>4.9 avg</span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "비밀배송", sub: "무표기 포장", icon: Package },
                  { label: "안전소재", sub: "검증된 소재", icon: ShieldCheck },
                  { label: "당일출고", sub: "빠른 발송", icon: Truck },
                  { label: "무료교환", sub: "간편 절차", icon: RefreshCcw },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="glass rounded-2xl px-4 py-3 border-white/15"
                  >
                    <div className="flex items-center gap-2">
                      <b.icon className="h-4 w-4 text-white/85" />
                      <p className="text-sm text-white font-medium">{b.label}</p>
                    </div>
                    <p className="text-xs text-white/65 mt-1">{b.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-10 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package, title: "비밀배송", desc: "무표기 포장" },
              { icon: ShieldCheck, title: "안전소재", desc: "검증된 소재" },
              { icon: Truck, title: "당일출고", desc: "주문 후 빠른 발송" },
              { icon: RefreshCcw, title: "무료교환", desc: "간편한 교환" },
            ].map((t) => (
              <div key={t.title} className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-2xl bg-muted flex items-center justify-center">
                  <t.icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES — bento */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Categories
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display text-foreground">
                Curated, not crowded.
              </h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/products" className="text-muted-foreground hover:text-foreground">
                전체 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-6 gap-4">
            {categories.map((cat, idx) => {
              const span =
                idx === 0
                  ? "md:col-span-3 md:row-span-2"
                  : idx === 1
                    ? "md:col-span-3"
                    : idx === 2
                      ? "md:col-span-2"
                      : idx === 3
                        ? "md:col-span-2"
                        : idx === 4
                          ? "md:col-span-2 md:row-span-2"
                          : "md:col-span-4";

              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`group relative overflow-hidden rounded-3xl border border-border ${span}`}
                >
                  <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                  <div className="relative p-8 min-h-[180px] flex flex-col justify-end">
                    <p className="text-white/70 text-xs tracking-[0.2em] uppercase">
                      Category
                    </p>
                    <p className="mt-2 text-white text-2xl sm:text-3xl font-display">
                      {cat.name}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-white/80 text-sm">
                      <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-white/70 transition-colors">
                        Explore
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* BESTSELLERS — horizontal snap */}
      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Bestsellers
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display text-foreground">
                Loved by members.
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/products">Shop all</Link>
            </Button>
          </div>

          <div className="mt-10 -mx-4 md:-mx-6 px-4 md:px-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 md:scroll-px-6 [-webkit-overflow-scrolling:touch] overscroll-x-contain">
            <div className="flex gap-4 min-w-max pb-2">
              {featuredProducts.map((p) => (
                <div key={p.id} className="w-[280px] sm:w-[320px] snap-center">
                  <ProductCard {...p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[32px] border border-border">
                <div className="aspect-[16/10] relative">
                  <Image src="/images/brand-story.webp" alt="Brand story" fill className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A]/55 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white/70 text-xs tracking-[0.2em] uppercase">
                    TeddyBear&apos;s Room
                  </p>
                  <p className="text-white text-2xl sm:text-3xl font-display mt-2">
                    Private wellness, designed to feel calm.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Brand story
              </p>
              <h3 className="mt-3 text-3xl font-display text-foreground leading-tight">
                Minimal, discreet,
                <br />
                and thoughtfully selected.
              </h3>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                TeddyBear&apos;s Room은 과장된 자극 대신, 일상의 리듬을 지키는
                섬세한 셀프케어를 제안합니다. 제품의 소재, 포장, 사용 경험까지
                처음부터 끝까지 조용히, 그러나 확실하게.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-accent text-accent-foreground hover:opacity-90">
                  <Link href="/about">
                    더 알아보기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/products">쇼핑하기</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS — dark */}
      <section className="relative py-24 text-[#F0EDE8] overflow-hidden">
        <Image src="/images/review-bg.webp" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#0F0F1A]/85" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#F0EDE8]/60">
                Reviews
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display">
                Trust is built quietly.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full sm:w-auto">
              {[{ v: "4.9", k: "평점" }, { v: "24h", k: "평균 배송" }, { v: "10k+", k: "누적 주문" }].map((s) => (
                <div key={s.k} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-2xl font-semibold">{s.v}</p>
                  <p className="text-xs text-[#F0EDE8]/60 mt-1">{s.k}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div
                key={r.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{r.title}</p>
                    <div className="mt-2 flex items-center gap-1 text-[#E8B4B8]">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <Quote className="h-5 w-5 text-white/35" />
                </div>
                <p className="mt-5 text-sm text-[#F0EDE8]/75 leading-relaxed">
                  {r.body}
                </p>
                <p className="mt-6 text-xs text-[#F0EDE8]/55">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION CTA — lavender */}
      <section className="py-16 sm:py-24 bg-[#C8A2C8]/15">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Subscription
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display text-foreground">
                매달 도착하는
                <br />
                시크릿 큐레이션.
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                구독자 전용 혜택으로 더 조용하고, 더 안전하게. 취향 기반 추천부터
                전용 할인까지.
              </p>

              <Button asChild className="mt-10 rounded-full bg-accent text-accent-foreground hover:opacity-90">
                <Link href="/subscribe">
                  구독 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="lg:col-span-7">
              <div className="surface p-8 sm:p-10">
                <div className="grid sm:grid-cols-2 gap-4">
                  {subscriptionBenefits.map((b, idx) => (
                    <div
                      key={`${b.title}-${idx}`}
                      className="rounded-2xl border border-border bg-background/60 p-5"
                    >
                      <p className="text-sm font-semibold text-foreground">{b.title}</p>
                      {b.desc ? (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {b.desc}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="rounded-[32px] border border-border overflow-hidden">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-7 p-10 sm:p-12">
                <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  Newsletter
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-display text-foreground">
                  신규 가입 10% 할인
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed max-w-xl">
                  신상품 소식과 멤버 전용 혜택을 가장 먼저 받아보세요.
                  과장 없는 정보만, 필요한 만큼만 전달합니다.
                </p>

                <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
                  <input
                    type="email"
                    required
                    placeholder="이메일 주소"
                    className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button type="submit" className="h-12 rounded-full bg-accent text-accent-foreground hover:opacity-90">
                    구독하기
                  </Button>
                </form>
                <p className="mt-4 text-xs text-muted-foreground">
                  구독은 언제든 해지할 수 있습니다.
                </p>
              </div>

              <div className="lg:col-span-5 relative">
                <Image src="/images/newsletter-bg.webp" alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#1A1A2E]/60" />
                <div className="relative p-10 sm:p-12 h-full flex flex-col justify-end">
                  <p className="text-white/70 text-xs tracking-[0.2em] uppercase">Members only</p>
                  <p className="mt-2 text-white text-2xl font-display">Quiet perks, delivered.</p>
                  <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-sm">
                    비밀배송 · 빠른 교환 · 구독자 전용 오퍼
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
