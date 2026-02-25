"use client";

import Link from "next/link";
import { useCallback } from "react";
import { ArrowUp, CreditCard, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { footerLinks } from "@/lib/data";

const social = [
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "YouTube", href: "#", icon: Youtube },
];

const payments = ["VISA", "Mastercard", "AMEX", "KakaoPay", "Toss"];

export function Footer() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="relative bg-[#0F0F1A] text-[#F0EDE8]">
      {/* Top rail */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-14 sm:py-16">
        {/* Top: columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <p className="font-display text-2xl leading-tight">TeddyBear&apos;s Room</p>
            <p className="text-sm text-[#F0EDE8]/70 leading-relaxed">
              Soft outside, wild inside. 프리미엄 인티머시 웰니스 셀렉트샵.
              당신의 프라이버시와 안전을 최우선으로 합니다.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
                  rel="noreferrer"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shopping */}
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#F0EDE8]/60 mb-4">
              Shopping
            </p>
            <ul className="space-y-2">
              {footerLinks.shop.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#F0EDE8]/75 hover:text-[#F0EDE8] transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#F0EDE8]/60 mb-4">
              Support
            </p>
            <ul className="space-y-2">
              {[...footerLinks.support, { name: "FAQ", href: "/faq" }].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#F0EDE8]/75 hover:text-[#F0EDE8] transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-[#F0EDE8]/75 hover:text-[#F0EDE8] transition-colors"
                >
                  배송 안내
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-[#F0EDE8]/75 hover:text-[#F0EDE8] transition-colors"
                >
                  반품/교환
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Legal */}
          <div className="col-span-2 lg:col-span-1">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#F0EDE8]/60 mb-4">
              Contact
            </p>
            <div className="space-y-2 text-sm text-[#F0EDE8]/75">
              <p>help@tbr.universe</p>
              <p>1588-0000 · 평일 10:00–18:00</p>
              <div className="pt-4 space-y-2">
                <Link href="/terms" className="block hover:text-[#F0EDE8] transition-colors">
                  이용약관
                </Link>
                <Link href="/privacy" className="block hover:text-[#F0EDE8] transition-colors">
                  개인정보처리방침
                </Link>
                <p className="text-xs text-[#F0EDE8]/55">19세 이상 전용</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment row */}
        <div className="mt-14 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-sm text-[#F0EDE8]/70">
              <CreditCard className="h-4 w-4" />
              <span>Payment methods</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {payments.map((p) => (
                <div
                  key={p}
                  className="h-9 px-3 inline-flex items-center rounded-full bg-white/5 border border-white/10 text-xs text-[#F0EDE8]/75"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business info + back to top */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <p className="text-[11px] leading-relaxed text-[#F0EDE8]/55">
            © {new Date().getFullYear()} TeddyBear&apos;s Room. All rights reserved.
            <br />
            사업자등록번호: 000-00-00000 · 통신판매업신고: 제0000-서울강남-0000호 · 대표: 홍길동
            <br />
            주소: 서울특별시 강남구 테헤란로 000 · 고객센터: 1588-0000 · 이메일: help@tbr.universe
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={scrollToTop}
            className="h-11 rounded-full border-white/15 bg-white/5 text-[#F0EDE8] hover:bg-white/10 hover:text-[#F0EDE8]"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}
