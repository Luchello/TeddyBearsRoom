/**
 * Footer Component
 * TeddyBear's Room - Site Footer with Newsletter and Payment Methods
 */

"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { name: "전체 상품", href: "/products" },
  { name: "베스트", href: "/products?sort=best" },
  { name: "신상품", href: "/products?sort=new" },
  { name: "이너 써클", href: "/inner-circle" },
  { name: "이용약관", href: "/terms" },
  { name: "개인정보처리방침", href: "/privacy" },
];

const companyLinks = [
  { name: "회사 소개", href: "/about" },
  { name: "자주 묻는 질문", href: "/support/faq" },
  { name: "배송 안내", href: "/support/shipping" },
  { name: "교환/반품", href: "/support/returns" },
  { name: "1:1 문의", href: "/support/contact" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/teddybearsroom",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/teddybearsroom",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@teddybearsroom",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  },
];

// Payment method icons
const PaymentIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "bank":
      return (
        <div className="w-12 h-8 rounded bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">
          무통장
        </div>
      );
    case "kakao":
      return (
        <div className="w-12 h-8 rounded bg-[#FEE500] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
            <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.69 1.72 5.06 4.307 6.424-.19.712-.687 2.57-.787 2.966-.123.488.18.482.377.35.155-.104 2.465-1.672 3.46-2.356.855.128 1.74.193 2.643.193 5.523 0 10-3.463 10-7.577C22 6.463 17.523 3 12 3z"/>
          </svg>
        </div>
      );
    case "toss":
      return (
        <div className="w-12 h-8 rounded bg-[#0064FF] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">toss</span>
        </div>
      );
    default:
      return null;
  }
};

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className={cn("border-t bg-muted/30", className)}>
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FFFBF8] to-[#F3E8FF]">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-3xl">
              <span>💌</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              뉴스레터 구독하기
            </h3>
            <p className="text-muted-foreground">
              새로운 상품과 특별한 혜택을 가장 먼저 받아보세요
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-pink-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                required
              />
              <Button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] text-white font-medium hover:shadow-lg transition-all"
              >
                {isSubscribed ? "구독 완료! ✓" : "구독하기"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold text-sm mb-4">결제 수단</h3>
            <div className="flex flex-wrap gap-2">
              <PaymentIcon type="bank" />
              <PaymentIcon type="kakao" />
              <PaymentIcon type="toss" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              안전한 결제를 보장합니다
            </p>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Follow Us</h3>
            <div className="flex items-center gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              고객센터: 1234-5678
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              평일 10:00-18:00
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Logo width={32} height={38} className="h-8 w-auto" />
              <div className="flex flex-col">
                <p className="font-semibold text-lg leading-tight">TeddyBear&apos;s Room</p>
                <p className="text-[9px] text-muted-foreground tracking-widest uppercase">
                  PASTEL FURRY UNIVERSE
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              사업자등록번호: 000-00-00000 | 통신판매업신고:
              제0000-서울강남-0000호
              <br />
              대표: 홍길동 | 주소: 서울특별시 강남구 테헤란로 000
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} TeddyBear&apos;s Room. All rights
              reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              본 사이트는 만 19세 이상만 이용 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
