import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
import { footerLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 dark:bg-card/30 dark:border-primary/10">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:animate-wiggle">🧸</span>
              <span className="text-lg font-bold text-primary dark:neon-text dark:neon-flicker">
                TeddyBear&apos;s Room
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              파스텔 감성의 프라이빗 셀프케어 브랜드
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors dark:hover:neon-text"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors dark:hover:neon-text"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">쇼핑</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors dark:hover:neon-text"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">고객지원</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors dark:hover:neon-text"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">회사정보</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors dark:hover:neon-text"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border dark:border-primary/10 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} TeddyBear&apos;s Room. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground dark:text-primary/50">
            본 사이트는 성인용품을 판매하며, 19세 이상만 이용 가능합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
