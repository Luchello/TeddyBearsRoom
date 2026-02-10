"use client";

// ====================================
// TeddyBear's Room - Header 컴포넌트
// 반응형 네비게이션 헤더 + 햄버거 메뉴
// ====================================
//
// 🎯 용도:
// - 모든 페이지 상단 고정 네비게이션
// - 햄버거 메뉴 (Sheet) 기반 통합 메뉴
// - 장바구니/위시리스트 퀵 액세스
// - Light/Dark 모드 토글
//
// 📦 구조:
// - Logo: TBR 공식 로고 (light/dark 분기)
// - Quick Actions: 위시리스트, 장바구니, 테마 토글
// - Sheet Menu: 전체 네비게이션 + 사용자 메뉴
//
// 🎨 디자인:
// - sticky 상단 고정 + backdrop-blur
// - Wave Divider로 섹션 분리
// - 지뢰계(Jirai-kei) 이모지 스타일
//
// 🔧 주요 기능:
// - 인증 상태에 따른 UI 분기 (로그인/로그아웃)
// - 반응형: sm 이하에서 위시리스트 숨김
// - ESC 키로 Sheet 닫기 지원
//
// 📝 의존성:
// - shadcn/ui: Button, Sheet
// - lucide-react: 아이콘
// - authStore: 인증 상태
// - CartButton, WishlistButton: 퀵 액세스 버튼
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
// ThemeToggle removed — dark mode only
import { CartButton } from "@/components/CartButton";
import { WishlistButton } from "@/components/WishlistButton";
import { useAuthStore } from "@/store/authStore";

// ──────────────────────────────────────
// 네비게이션 아이템 정의
// - 지뢰계 이모지로 귀여움 강조
// - 각 아이템: name(표시명), href(경로), icon(lucide), emoji(지뢰계)
// ──────────────────────────────────────
const navItems = [
  { name: "홈", href: "/", icon: Home, emoji: "♡" },
  { name: "상품", href: "/products", icon: ShoppingBag, emoji: "🎀" },
  { name: "구독", href: "/subscribe", icon: Crown, emoji: "✧" },
  { name: "기부", href: "/donation", icon: Gift, emoji: "💗" },
  { name: "소개", href: "/about", icon: Info, emoji: "🧸" },
];

// ──────────────────────────────────────
// 인증 사용자용 메뉴 아이템
// - 프로필 하위 탭으로 라우팅
// - ?tab=xxx 쿼리 파라미터 사용
// ──────────────────────────────────────
const userMenuItems = [
  { name: "내 사이즈", href: "/profile?tab=size", icon: Ruler, emoji: "✧" },
  { name: "주문내역", href: "/profile?tab=orders", icon: ShoppingBag, emoji: "🎀" },
  { name: "위시리스트", href: "/profile?tab=wishlist", icon: Heart, emoji: "♡" },
  { name: "설정", href: "/profile?tab=settings", icon: Settings, emoji: "☆" },
];

// ──────────────────────────────────────
// Header 컴포넌트
// ──────────────────────────────────────

/**
 * 메인 헤더 컴포넌트
 *
 * @description
 * 모든 페이지 상단에 표시되는 네비게이션 헤더입니다.
 * - 로고 + 퀵 액션 버튼 + 햄버거 메뉴로 구성
 * - 인증 상태에 따라 사용자 정보/로그인 버튼 분기
 * - Wave Divider로 시각적 섹션 분리
 *
 * @example
 * // layout.tsx에서 사용
 * <Header />
 * <main>{children}</main>
 * <Footer />
 */
export function Header() {
  // Sheet 열림/닫힘 상태 (햄버거 메뉴)
  const [sheetOpen, setSheetOpen] = useState(false);

  // 인증 상태 및 액션 (Zustand Store)
  const { isAuthenticated, user, openLoginModal, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary/10 transition-colors duration-500">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8 relative z-10">
        {/* ─────────────────────────────────────
            Logo Section
            - Light/Dark 모드별 로고 분기
            - hover 시 scale + rotate 효과
            ───────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            {/* Light Mode 로고 */}
            <Image
              src="/tbr_logo.png"
              alt="TeddyBear's Room Logo"
              fill
              className="object-contain drop-shadow-md dark:hidden"
              priority
            />
            {/* Dark Mode 로고 (Matrix Neon 스타일) */}
            <Image
              src="/tbr_logo_dark.png"
              alt="TeddyBear's Room Logo"
              fill
              className="object-contain drop-shadow-md hidden dark:block"
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

        {/* ─────────────────────────────────────
            Right Side Actions
            - 퀵 액세스 버튼 (위시리스트, 장바구니)
            - 테마 토글
            - 햄버거 메뉴 버튼
            ───────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Desktop: 위시리스트 + 장바구니 */}
          <div className="hidden sm:flex items-center gap-1">
            <WishlistButton />
            <CartButton />
          </div>
          {/* Mobile: 장바구니만 (위시리스트는 메뉴에서) */}
          <div className="sm:hidden flex items-center gap-1">
            <CartButton />
          </div>
          {/* ThemeToggle removed — dark only */}

          {/* ─────────────────────────────────────
              햄버거 메뉴 (Sheet)
              - shadcn/ui Sheet 컴포넌트 사용
              - 우측에서 슬라이드 인
              ───────────────────────────────────── */}
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
              {/* Sheet 헤더 */}
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
                {/* ─────────────────────────────────────
                    User Section
                    - 인증됨: 사용자 정보 + 포인트 표시
                    - 비인증: 로그인 버튼
                    ───────────────────────────────────── */}
                {isAuthenticated && user ? (
                  <div className="mb-8 p-5 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 relative overflow-hidden group">
                    {/* 배경 블러 효과 */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary/20"></div>

                    <div className="flex items-center gap-4 relative z-10">
                      {/* 아바타 */}
                      <div className="w-14 h-14 rounded-full bg-white dark:bg-black/20 p-1 border-2 border-primary/20 shadow-sm">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={56}
                            height={56}
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
                        {/* 포인트 표시 */}
                        <p className="text-sm text-primary font-medium mt-0.5">
                          💎 {user.points?.toLocaleString() || 0} P
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 비인증 상태: 로그인 유도 */
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

                {/* ─────────────────────────────────────
                    Navigation Links
                    - 메인 네비게이션 항목들
                    ───────────────────────────────────── */}
                <div className="space-y-2 mb-8">
                  <p className="text-xs font-bold text-muted-foreground px-4 mb-3 uppercase tracking-wider opacity-70">
                    Navigation
                  </p>
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 group dark:hover:drop-shadow-[0_0_8px_rgba(255,105,180,0.5)]"
                    >
                      {/* 이모지 아이콘 박스 */}
                      <div className="w-10 h-10 rounded-xl bg-background shadow-sm flex items-center justify-center text-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 border border-border/50">
                        {item.emoji}
                      </div>
                      <span className="font-medium text-lg">{item.name}</span>
                      {/* hover 시 발자국 표시 */}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                        🐾
                      </div>
                    </Link>
                  ))}
                </div>

                {/* ─────────────────────────────────────
                    User Menu Items (인증된 경우만)
                    - 프로필 하위 메뉴들
                    ───────────────────────────────────── */}
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

                {/* ─────────────────────────────────────
                    Bottom Actions
                    - 로그아웃 버튼 (인증된 경우)
                    - Copyright
                    ───────────────────────────────────── */}
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

      {/* ─────────────────────────────────────
          Wave Divider
          - 헤더 하단 물결 모양 장식
          - SVG path로 구현
          ───────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[99%] z-40">
        <svg className="relative block w-[calc(100%+1.3px)] h-[24px] text-background/80 dark:text-background/80 fill-current" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </header>
  );
}
