/**
 * Footer Component
 * TeddyBear's Room - Site Footer
 */

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  shop: {
    title: "쇼핑하기",
    links: [
      { name: "전체 상품", href: "/products" },
      { name: "베스트", href: "/products?sort=best" },
      { name: "신상품", href: "/products?sort=new" },
      { name: "세일", href: "/products?sale=true" },
    ],
  },
  support: {
    title: "고객 지원",
    links: [
      { name: "자주 묻는 질문", href: "/support/faq" },
      { name: "배송 안내", href: "/support/shipping" },
      { name: "교환/반품", href: "/support/returns" },
      { name: "1:1 문의", href: "/support/contact" },
    ],
  },
  company: {
    title: "회사 정보",
    links: [
      { name: "회사 소개", href: "/about" },
      { name: "이용약관", href: "/terms" },
      { name: "개인정보처리방침", href: "/privacy" },
      { name: "채용", href: "/careers" },
    ],
  },
  innerCircle: {
    title: "이너 써클",
    links: [
      { name: "프로그램 소개", href: "/inner-circle" },
      { name: "혜택 안내", href: "/inner-circle/benefits" },
      { name: "가입하기", href: "/inner-circle/join" },
    ],
  },
};

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

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t bg-muted/30", className)}>
      <div className="container py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
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
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <p className="font-semibold text-lg mb-1">TeddyBear&apos;s Room</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              사업자등록번호: 000-00-00000 | 통신판매업신고:
              제0000-서울강남-0000호
              <br />
              대표: 홍길동 | 주소: 서울특별시 강남구 테헤란로 000
              <br />
              고객센터: 1234-5678 (평일 10:00-18:00)
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TeddyBear&apos;s Room. All rights
            reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            본 사이트는 만 19세 이상만 이용 가능합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
