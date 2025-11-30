"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Instagram,
  Twitter,
  Mail,
  MessageCircle,
  BookOpen,
  Heart,
  ShieldCheck,
  Package,
  Lock,
  CreditCard,
  Sparkles,
  Send,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { footerLinks } from "@/lib/data";

// Korean SNS Custom Icons
const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.876l-.857 3.214a.5.5 0 00.748.544l3.722-2.481C10.41 17.384 11.19 17.5 12 17.5c5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
  </svg>
);

const NaverBlogIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
  </svg>
);

// Payment Method Icons
const paymentMethods = [
  { name: "신용카드", icon: "💳" },
  { name: "카카오페이", icon: "🟡" },
  { name: "네이버페이", icon: "🟢" },
  { name: "토스", icon: "🔵" },
];

// Trust Badges
const trustBadges = [
  { icon: Package, label: "무지박스 배송", emoji: "📦" },
  { icon: ShieldCheck, label: "안전결제", emoji: "🔒" },
  { icon: Lock, label: "개인정보보호", emoji: "🛡️" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative pt-20 overflow-hidden">
      {/* Wave Divider (Top) */}
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

      {/* Newsletter Section */}
      <section className="relative bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 dark:from-primary/10 dark:via-accent/10 dark:to-secondary/10 py-16 border-b border-primary/10">
        <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
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

          {isSubscribed && (
            <p className="text-center text-sm text-primary font-medium mt-4 animate-fade-in-up">
              🎉 환영합니다! 당신만의 달콤한 여정이 시작되었어요 💕
            </p>
          )}
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="bg-muted/20 dark:bg-black/40 backdrop-blur-sm pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="relative w-16 h-16 transition-transform duration-500 group-hover:rotate-12">
                  <Image
                    src="/tbr_logo.png"
                    alt="TeddyBear's Room Logo"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-primary dark:text-neon-glow transition-colors duration-300 group-hover:text-accent">
                    TeddyBear&apos;s Room
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                    Pastel Furry Universe
                  </span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                일상을 특별하게 만드는 마법 같은 순간.<br />
                지뢰계 감성의 프라이빗 셀프케어 브랜드,<br />
                테디베어즈 룸에 오신 것을 환영합니다.
                <br />
                <span className="text-primary font-bold mt-2 inline-block">♡ Made with Love & Fantasy ✧</span>
              </p>

              {/* Social Links */}
              <div className="flex gap-3 pt-2">
                {[
                  { icon: Instagram, color: "from-pink-500 to-purple-500", label: "Instagram" },
                  { icon: Twitter, color: "from-blue-400 to-blue-600", label: "Twitter" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${social.color} text-white hover:scale-110 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
                <a
                  href="#"
                  className="p-2.5 rounded-xl bg-[#FEE500] text-[#3C1E1E] hover:scale-110 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  aria-label="KakaoTalk"
                >
                  <KakaoIcon />
                </a>
                <a
                  href="#"
                  className="p-2.5 rounded-xl bg-[#03C75A] text-white hover:scale-110 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  aria-label="Naver Blog"
                >
                  <NaverBlogIcon />
                </a>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6 uppercase tracking-wider opacity-80">
                <span className="text-lg">🛍️</span> Shop
              </h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6 uppercase tracking-wider opacity-80">
                <span className="text-lg">💬</span> Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6 uppercase tracking-wider opacity-80">
                <span className="text-lg">🏢</span> Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment & Trust Section */}
          <div className="mt-12 pt-8 border-t border-primary/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Payment Methods */}
              <div className="flex flex-wrap justify-center gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-primary/10 text-xs font-medium hover:border-primary/30 transition-colors shadow-sm"
                    title={method.name}
                  >
                    <span className="text-base">{method.icon}</span>
                    <span className="hidden sm:inline opacity-80">{method.name}</span>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-2">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 text-xs font-medium text-primary/80"
                  >
                    <span>{badge.emoji}</span>
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-muted/30 dark:bg-black/60 border-t border-primary/5 py-8">
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
          <p className="mt-4 text-center text-[10px] text-muted-foreground/40 leading-relaxed">
            사업자등록번호: 000-00-00000 | 통신판매업신고: 제0000-서울강남-0000호 | 대표: 홍길동 <br className="hidden sm:block" />
            주소: 서울특별시 강남구 테헤란로 000 | 고객센터: 1588-0000 | 이메일: help@tbr.universe
          </p>
        </div>
      </div>

      {/* Floating Decoration (Hidden on mobile) */}
      <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-float pointer-events-none hidden lg:block blur-[1px]">
        💕
      </div>
      <div
        className="absolute bottom-40 left-10 text-3xl opacity-20 animate-float pointer-events-none hidden lg:block blur-[1px]"
        style={{ animationDelay: "1.5s" }}
      >
        ✨
      </div>
    </footer>
  );
}
