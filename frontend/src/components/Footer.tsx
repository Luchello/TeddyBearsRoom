"use client";

// ====================================
// TeddyBear's Room - Footer 컴포넌트
// 뉴스레터, SNS, 링크, 결제/신뢰 배지
// ====================================
//
// 🎯 용도:
// - 모든 페이지 하단 푸터
// - 뉴스레터 구독 폼
// - SNS 링크 (Twitter)
// - Quick Links (Shop + Support 통합)
// - Company + Contact 정보
// - 결제 방법 (무통장입금, 카카오페이, 토스)
//
// 📦 구조 (P1 개선: 4컬럼 → 3컬럼 간소화):
// - Wave Divider (Top): 섹션 분리 장식
// - Newsletter Section: 이메일 구독 폼
// - Main Footer: 3컬럼 그리드
//   ├ Brand + Trust: 로고, 설명, 신뢰배지, SNS
//   ├ Quick Links: Shop + Support 통합
//   └ Company + Contact: 회사정보 + 고객센터
// - Payment: 결제수단 배지
// - Copyright: 사업자 정보 + 법적 고지
//
// 🎨 디자인:
// - Wave SVG로 부드러운 섹션 분리
// - 그라데이션 배경 + backdrop-blur
// - hover 애니메이션 (scale, translate)
// - 지뢰계 이모지 + 파스텔 톤
//
// 🔧 주요 기능:
// - 뉴스레터 폼 제출 + 성공 피드백
// - 반응형 그리드 레이아웃
// - 외부 링크 aria-label 접근성
//
// 📝 의존성:
// - shadcn/ui: Button, Input
// - lucide-react: 아이콘
// - data.ts: footerLinks 데이터
// ====================================

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Twitter,
  Mail,
  Heart,
  ShieldCheck,
  Package,
  Lock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { footerLinks } from "@/lib/data";

// ──────────────────────────────────────
// 결제 수단 목록 (주력: 무통장입금, 카카오페이, 토스)
// - 이모지 아이콘으로 표시
// ──────────────────────────────────────
const paymentMethods = [
  { name: "무통장입금", icon: "🏦" },
  { name: "카카오페이", icon: "🟡" },
  { name: "토스", icon: "🔵" },
];

// ──────────────────────────────────────
// 신뢰 배지 목록
// - 무지박스 배송, 안전결제, 개인정보보호
// ──────────────────────────────────────
const trustBadges = [
  { icon: Package, label: "무지박스 배송", emoji: "📦" },
  { icon: ShieldCheck, label: "안전결제", emoji: "🔒" },
  { icon: Lock, label: "개인정보보호", emoji: "🛡️" },
];

// ──────────────────────────────────────
// Footer 컴포넌트
// ──────────────────────────────────────

/**
 * 푸터 컴포넌트
 *
 * @description
 * 사이트 하단에 표시되는 종합 푸터입니다.
 * - 뉴스레터 구독
 * - SNS 링크
 * - 사이트맵 링크 (Shop, Support, Company)
 * - 결제 방법 및 신뢰 배지
 * - 사업자 정보 및 법적 고지
 *
 * @example
 * // layout.tsx에서 사용
 * <Header />
 * <main>{children}</main>
 * <Footer />
 */
export function Footer() {
  // 뉴스레터 폼 상태
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  /**
   * 뉴스레터 폼 제출 핸들러
   * @description 이메일 입력 후 구독 완료 메시지 표시 (3초 후 리셋)
   */
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // 3초 후 상태 리셋
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative pt-20 overflow-hidden">
      {/* ─────────────────────────────────────
          Wave Divider (Top)
          - 푸터 상단 물결 모양 장식
          ───────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[1px] z-10">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[50px] sm:h-[80px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────
          Newsletter Section
          - 이메일 구독 폼
          - 구독 완료 시 애니메이션 피드백
          ───────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#F0FFF0] via-[#E8FFE8] to-[#F0FFF0] py-16 border-b border-[#C8E6FF]">
        {/* 노이즈 텍스처 오버레이 */}
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-bounce-slow">💌</span>
              <div className="p-3 rounded-full bg-background shadow-sm border border-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Join the TBR Universe
            </h3>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              신상품 출시 알림, 시크릿 할인 코드, 그리고 <br className="sm:hidden" />
              <span className="text-primary font-medium">특별한 초대장</span>을 보내드려요 ✨
            </p>
          </div>

          {/* 구독 폼 */}
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1 group">
              <Input
                type="email"
                placeholder="이메일 주소를 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border-2 border-primary/20 bg-background/80 pl-12 pr-4 py-6 text-base focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 group-hover:border-primary/40"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50 group-hover:opacity-100 transition-opacity">
                📧
              </span>
            </div>
            <Button
              type="submit"
              className="rounded-2xl px-8 py-6 font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubscribed}
            >
              {isSubscribed ? (
                <>
                  <Heart className="h-5 w-5 mr-2 fill-current animate-ping" />
                  구독 완료!
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  구독하기
                </>
              )}
            </Button>
          </form>

          {/* 구독 성공 메시지 */}
          {isSubscribed && (
            <p className="text-center text-sm text-primary font-medium mt-4 animate-fade-in-up">
              🎉 환영합니다! 당신만의 달콤한 여정이 시작되었어요 💕
            </p>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────
          Main Footer Content
          - 4컬럼 그리드: 브랜드, Shop, Support, Company
          ───────────────────────────────────── */}
      <div className="bg-[#F0FFF0]/80 backdrop-blur-sm pt-16 pb-8 border-t-[3px]" style={{ borderImage: 'linear-gradient(90deg, #FF6B6B, #FFD93D, #4ECDC4, #45B7D1, #DDA0DD, #FF6B9D) 1' }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* ──────────────────────────────────────
              P1 개선: 4컬럼 → 3컬럼 구조 간소화
              - Brand + Trust | Shop + Support 통합 | Company + Contact
              ────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
            {/* ──────────────────────────────────────
                Brand Column + Trust Badges
                - 로고, 브랜드 설명, 신뢰 배지, SNS
                ────────────────────────────────────── */}
            <div className="space-y-6 lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="relative w-14 h-14 transition-transform duration-500 group-hover:rotate-12">
                  <Image
                    src="/tbr_logo.png"
                    alt="TeddyBear's Room Logo"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary transition-colors duration-300 group-hover:text-accent">
                    TeddyBear&apos;s Room
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                    Pastel Furry Universe
                  </span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                지뢰계 감성의 프라이빗 셀프케어 브랜드 ♡
                <br />
                <span className="text-primary font-medium">Made with Love & Fantasy ✧</span>
              </p>

              {/* Trust Badges - 브랜드 컬럼으로 이동 */}
              <div className="flex flex-wrap gap-2">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-medium text-muted-foreground"
                  >
                    <span>{badge.emoji}</span>
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* SNS Links */}
              <div className="flex gap-2">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-110 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* ──────────────────────────────────────
                Quick Links (Shop + Support 통합)
                ────────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5 uppercase tracking-wider opacity-80">
                <span className="text-lg">🛍️</span> Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {/* Shop Links */}
                {footerLinks.shop.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Support Links */}
                {footerLinks.support.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* ──────────────────────────────────────
                Company + Contact
                ────────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5 uppercase tracking-wider opacity-80">
                <span className="text-lg">🏢</span> Company
              </h3>
              <ul className="space-y-2 mb-6">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Contact Info */}
              <div className="pt-4 border-t border-primary/10 space-y-2">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>📞</span> 1588-0000
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>✉️</span> help@tbr.universe
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>🕐</span> 평일 10:00 - 18:00
                </p>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────
              Payment Methods (간소화 - Trust는 Brand로 이동)
              ───────────────────────────────────── */}
          <div className="mt-10 pt-6 border-t border-primary/10">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs text-muted-foreground mr-2">결제수단</span>
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 border border-primary/10 text-xs font-medium"
                  title={method.name}
                >
                  <span>{method.icon}</span>
                  <span className="opacity-70">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────
          Bottom Copyright
          - 법적 고지 및 사업자 정보
          ───────────────────────────────────── */}
      <div className="bg-[#E8FFE8]/60 border-t border-[#C8E6FF] py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <span>
                © {new Date().getFullYear()} TeddyBear&apos;s Room. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-primary transition-colors">이용약관</Link>
              <span className="opacity-30">|</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">개인정보처리방침</Link>
              <span className="opacity-30">|</span>
              <span className="text-primary/60 font-medium">19세 이상 전용</span>
            </div>
          </div>
          {/* 사업자 정보 */}
          <p className="mt-4 text-center text-[10px] text-muted-foreground/40 leading-relaxed">
            사업자등록번호: 000-00-00000 | 통신판매업신고: 제0000-서울강남-0000호 | 대표: 홍길동 <br className="hidden sm:block" />
            주소: 서울특별시 강남구 테헤란로 000 | 고객센터: 1588-0000 | 이메일: help@tbr.universe
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────
          Floating Decoration - P1 표준화
          - 데스크탑에서만 표시되는 장식 이모지
          - 표준: text-2xl, opacity-15, animate-float
          ───────────────────────────────────── */}
      <div className="absolute bottom-20 right-10 text-2xl opacity-15 animate-float pointer-events-none hidden lg:block">
        💕
      </div>
      <div
        className="absolute bottom-40 left-10 text-2xl opacity-15 animate-float pointer-events-none hidden lg:block"
        style={{ animationDelay: "1.5s" }}
      >
        ✨
      </div>
    </footer>
  );
}
