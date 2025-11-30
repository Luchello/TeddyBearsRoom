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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary/10 transition-colors duration-500">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8 relative z-10">
        {/* Logo - TBR Official Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Image
              src="/logo.png"
              alt="TeddyBear's Room Logo"
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary leading-tight dark:text-neon-glow transition-all duration-300 group-hover:text-accent">
              TeddyBear&apos;s Room
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block font-medium tracking-widest">
              PASTEL FURRY UNIVERSE
            </span>
          </div>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Actions - Always Visible */}
          <div className="hidden sm:flex items-center gap-1">
            <WishlistButton />
            <CartButton />
          </div>
          <div className="sm:hidden flex items-center gap-1">
            <CartButton />
          </div>
          <ThemeToggle />

          {/* Hamburger Menu Button - Always Visible */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110 hover:rotate-12"
              >
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[320px] sm:w-[380px] border-l-2 border-primary/20 bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader className="border-b border-primary/10 pb-6 mb-6">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <span className="text-3xl animate-bounce-cute">🧸</span>
                  <div className="flex flex-col">
                    <span className="text-primary font-bold text-xl">MENU</span>
                    <span className="text-xs text-muted-foreground font-normal">Welcome to TBR Universe</span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-[calc(100%-100px)]">
                {/* User Section */}
                {isAuthenticated && user ? (
                  <div className="mb-8 p-5 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary/20"></div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-14 h-14 rounded-full bg-white dark:bg-black/20 p-1 border-2 border-primary/20 shadow-sm">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                            🐻
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-foreground flex items-center gap-1">
                          {user.name}
                          <span className="text-xs font-normal text-muted-foreground">님</span>
                        </p>
                        <p className="text-sm text-primary font-medium mt-0.5">
                          💎 {user.points?.toLocaleString() || 0} P
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 p-6 rounded-3xl bg-muted/30 border border-dashed border-primary/30 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      로그인하고 더 많은 혜택을 받아보세요!
                      <br />
                      <span className="text-xs opacity-70">(신규 가입 시 3,000P 즉시 지급)</span>
                    </p>
                    <Button
                      className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
                      onClick={() => {
                        openLoginModal();
                        setSheetOpen(false);
                      }}
                    >
                      로그인 / 회원가입
                    </Button>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2 mb-8">
                  <p className="text-xs font-bold text-muted-foreground px-4 mb-3 uppercase tracking-wider opacity-70">
                    Navigation
                  </p>
                  {navItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-background shadow-sm flex items-center justify-center text-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 border border-border/50">
                        {item.emoji}
                      </div>
                      <span className="font-medium text-lg">{item.name}</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                        🐾
                      </div>
                    </Link>
                  ))}
                </div>

                {/* User Menu Items (if authenticated) */}
                {isAuthenticated && (
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold text-muted-foreground px-4 mb-3 uppercase tracking-wider opacity-70">
                      My Personal
                    </p>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-2xl text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center text-base group-hover:scale-110 transition-transform duration-300">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="mt-auto pt-6 border-t border-primary/10">
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      onClick={() => {
                        logout();
                        setSheetOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      로그아웃
                    </Button>
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-[10px] text-muted-foreground/50 font-mono">
                      © 2025 TBR UNIVERSE
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[99%] z-40">
        <svg className="relative block w-[calc(100%+1.3px)] h-[24px] text-background/80 dark:text-background/80 fill-current" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </header>
  );
}
