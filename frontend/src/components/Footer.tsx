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
    <footer className="relative">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%]">
        <svg
          className="relative block w-full h-12 md:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className="fill-background"
            opacity=".25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            className="fill-background"
            opacity=".5"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-muted/30 dark:fill-card/50"
          />
        </svg>
      </div>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 dark:from-primary/5 dark:via-accent/5 dark:to-secondary/5 py-12 border-b-2 border-primary/10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="text-3xl animate-bounce-slow">💌</span>
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              특별한 소식을 받아보세요!
            </h3>
            <p className="text-sm text-muted-foreground">
              신상품, 할인 정보, 특별 이벤트를 가장 먼저 만나보세요 ✨
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="이메일 주소를 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border-2 border-primary/30 bg-background/80 pl-4 pr-10 py-3 focus:border-primary focus:ring-primary/20"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
                📧
              </span>
            </div>
            <Button
              type="submit"
              className="rounded-2xl px-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              disabled={isSubscribed}
            >
              {isSubscribed ? (
                <>
                  <Heart className="h-4 w-4 mr-2 fill-current" />
                  구독 완료!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  구독하기 ✨
                </>
              )}
            </Button>
          </form>

          {isSubscribed && (
            <p className="text-center text-sm text-primary font-medium mt-3 animate-fade-in">
              🎉 구독해주셔서 감사합니다! 곧 특별한 소식을 보내드릴게요 💕
            </p>
          )}
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="bg-muted/30 dark:bg-card/30 border-t border-primary/10">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src="/logo.png"
                    alt="TeddyBear's Room Logo"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary dark:neon-text">
                    TeddyBear&apos;s Room
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ✧ 당신만의 달콤한 공간 ♡
                  </span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                지뢰계 감성의 프라이빗 셀프케어 브랜드
                <br />
                <span className="text-primary">♡</span> Made with love ✧
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 text-white hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-xl bg-[#FEE500] text-[#3C1E1E] hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  aria-label="KakaoTalk"
                >
                  <KakaoIcon />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-xl bg-[#03C75A] text-white hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  aria-label="Naver Blog"
                >
                  <NaverBlogIcon />
                </a>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <span className="text-lg">🛍️</span> 쇼핑
              </h3>
              <ul className="space-y-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <span className="text-lg">💬</span> 고객지원
              </h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <span className="text-lg">🏢</span> 회사정보
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment & Trust Section */}
          <div className="mt-10 pt-8 border-t border-primary/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Payment Methods */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> 결제수단
                </p>
                <div className="flex gap-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.name}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-background/80 border border-primary/20 text-xs font-medium hover:border-primary/40 transition-colors"
                      title={method.name}
                    >
                      <span>{method.icon}</span>
                      <span className="hidden sm:inline">{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> 안심쇼핑
                </p>
                <div className="flex gap-2">
                  {trustBadges.map((badge) => (
                    <div
                      key={badge.label}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-xs font-medium"
                    >
                      <span>{badge.emoji}</span>
                      <span className="hidden sm:inline">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-muted/50 dark:bg-card/50 border-t border-primary/10 py-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 animate-bounce-slow">
                <Image
                  src="/logo.png"
                  alt="TBR"
                  fill
                  className="object-contain"
                />
              </div>
              <span>
                © {new Date().getFullYear()} TeddyBear&apos;s Room. All rights
                reserved.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-primary transition-colors">
                이용약관
              </Link>
              <span className="text-primary/30">|</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                개인정보처리방침
              </Link>
              <span className="text-primary/30">|</span>
              <span className="text-primary/70">19세 이상 전용</span>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-muted-foreground/70">
            사업자등록번호: 000-00-00000 | 통신판매업신고: 제0000-서울강남-0000호
            | 대표: 홍길동
            <br />
            주소: 서울특별시 강남구 테헤란로 000 | 고객센터: 1588-0000
          </p>
        </div>
      </div>

      {/* Floating Decoration */}
      <div className="absolute bottom-20 right-10 text-2xl opacity-10 animate-float pointer-events-none hidden lg:block">
        💕
      </div>
      <div
        className="absolute bottom-40 left-10 text-xl opacity-10 animate-float pointer-events-none hidden lg:block"
        style={{ animationDelay: "1s" }}
      >
        ✨
      </div>
    </footer>
  );
}
