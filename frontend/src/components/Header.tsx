"use client";

// ====================================
// TeddyBear's Room - Cute Header
// Redesigned with hamburger menu for all devices
// ====================================

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  Ruler,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Home,
  Gift,
  Sparkles,
  Info,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CartButton } from "@/components/CartButton";
import { WishlistButton } from "@/components/WishlistButton";
import { useAuthStore } from "@/store/authStore";

// Navigation with 지뢰계 emojis ♡✧🎀
const navItems = [
  { name: "홈", href: "/", icon: Home, emoji: "♡" },
  { name: "상품", href: "/products", icon: ShoppingBag, emoji: "🎀" },
  { name: "구독", href: "/subscribe", icon: Crown, emoji: "✧" },
  { name: "기부", href: "/donation", icon: Gift, emoji: "💗" },
  { name: "소개", href: "/about", icon: Info, emoji: "🧸" },
];

// User menu items for authenticated users - 지뢰계 ♡
const userMenuItems = [
  { name: "내 사이즈", href: "/profile?tab=size", icon: Ruler, emoji: "✧" },
  { name: "주문내역", href: "/profile?tab=orders", icon: ShoppingBag, emoji: "🎀" },
  { name: "위시리스트", href: "/profile?tab=wishlist", icon: Heart, emoji: "♡" },
  { name: "설정", href: "/profile?tab=settings", icon: Settings, emoji: "☆" },
];

export function Header() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { isAuthenticated, user, openLoginModal, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo - TBR Official Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="TeddyBear's Room Logo"
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary leading-tight dark:neon-text">
              TeddyBear&apos;s Room
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              ✧ 당신만의 달콤한 공간 ♡
            </span>
          </div>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Actions - Always Visible */}
          <WishlistButton />
          <CartButton />
          <ThemeToggle />

          {/* Hamburger Menu Button - Always Visible */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-2xl border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
              >
                <Menu className="h-5 w-5 text-primary" />
                <span className="absolute -top-1 -right-1 text-xs animate-sparkle-twinkle">✧</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[320px] sm:w-[380px] border-l-2 border-primary/20 bg-background/98"
            >
              <SheetHeader className="border-b border-primary/20 pb-4 mb-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <span className="text-2xl animate-heart-beat">🎀</span>
                  <span className="text-primary font-bold">메뉴</span>
                  <span className="text-lg animate-sparkle-twinkle">✧</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-[calc(100%-80px)]">
                {/* User Section */}
                {isAuthenticated && user ? (
                  <div className="mb-6 p-4 rounded-2xl bg-primary/10 border-2 border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border-2 border-primary/30">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">🐻</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground flex items-center gap-1">
                          {user.name}
                          <span className="text-sm">님</span>
                          <Sparkles className="w-4 h-4 text-primary" />
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-primary font-medium mt-1">
                          💰 {user.points?.toLocaleString() || 0}P
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-2xl bg-muted/50 border-2 border-dashed border-primary/30">
                    <p className="text-sm text-muted-foreground text-center mb-3">
                      🎀 로그인하고 혜택을 받아보세요 ♡
                    </p>
                    <Button
                      className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_15px_rgba(255,182,193,0.3)]"
                      onClick={() => {
                        openLoginModal();
                        setSheetOpen(false);
                      }}
                    >
                      ✧ 로그인 / 회원가입
                    </Button>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1 mb-6">
                  <p className="text-xs font-bold text-muted-foreground px-2 mb-2 flex items-center gap-1">
                    <span>✧</span> 메뉴
                  </p>
                  {navItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="text-lg group-hover:animate-bounce-slow">
                        {item.emoji}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>

                {/* User Menu Items (if authenticated) */}
                {isAuthenticated && (
                  <div className="space-y-1 mb-6">
                    <p className="text-xs font-bold text-muted-foreground px-2 mb-2 flex items-center gap-1">
                      <span>♡</span> 마이페이지
                    </p>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                      >
                        <span className="text-lg group-hover:animate-bounce-slow">
                          {item.emoji}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="mt-auto pt-4 border-t border-primary/20">
                  {isAuthenticated ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all duration-300"
                      onClick={() => {
                        logout();
                        setSheetOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </Button>
                  ) : null}

                  {/* 지뢰계 Footer ♡ */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      Made with ♡ by TeddyBear&apos;s Room ✧
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
