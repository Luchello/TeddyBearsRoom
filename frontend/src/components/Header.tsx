"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CartButton } from "@/components/CartButton";
import { WishlistButton } from "@/components/WishlistButton";
import { navigation } from "@/lib/data";
import { useAuthStore } from "@/store/authStore";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, openLoginModal, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/80 dark:border-primary/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
            <span className="text-2xl transition-transform duration-300 group-hover:animate-wiggle">🧸</span>
            <span className="text-xl font-bold text-primary dark:neon-text dark:neon-flicker">
              TeddyBear&apos;s Room
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <WishlistButton />
          <CartButton />
          <ThemeToggle />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <span className="sr-only">{mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
            <span
              className={`transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-90" : "rotate-0"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </span>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors dark:hover:neon-text"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button & Theme Toggle */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-3 lg:items-center">
          <WishlistButton />
          <CartButton />
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name || "회원"}님
              </span>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={logout}
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <Button
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle dark:hover:neon-glow"
              onClick={openLoginModal}
            >
              로그인
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile menu with animation */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 pb-4 dark:bg-card/95 dark:backdrop-blur">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block rounded-xl px-3 py-2 text-base font-medium text-foreground hover:bg-muted dark:hover:bg-primary/10 transition-all duration-200 ${
                mobileMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{
                transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <div
              className={`mt-4 flex items-center justify-between transition-all duration-200 ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: mobileMenuOpen ? `${navigation.length * 50}ms` : "0ms",
              }}
            >
              <span className="text-sm text-muted-foreground">
                {user?.name || "회원"}님 환영합니다
              </span>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <Button
              className={`mt-4 w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle transition-all duration-200 ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: mobileMenuOpen ? `${navigation.length * 50}ms` : "0ms",
              }}
              onClick={() => {
                openLoginModal();
                setMobileMenuOpen(false);
              }}
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
