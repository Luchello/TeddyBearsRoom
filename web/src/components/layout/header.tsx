/**
 * Header Component
 * TeddyBear's Room - Main Navigation Header
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUIStore, useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchInput } from "@/components/ui/input";
import { AuthButton } from "@/components/layout/auth-button";

// ============================================================
// Client-Only Wrapper - Prevents hydration mismatch for Radix components
// Uses useSyncExternalStore pattern to avoid ESLint set-state-in-effect warning
// ============================================================
const emptySubscribe = () => () => { };
function useHydrated() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,  // Client: always hydrated
    () => false  // Server: not hydrated
  );
}

// Icons as inline SVGs for performance
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CartIcon = () => (
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
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const HeartIcon = () => (
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
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const navigation = [
  { name: "전체 상품", href: "/products" },
  { name: "베스트", href: "/products?sort=best" },
  { name: "신상품", href: "/products?sort=new" },
  { name: "이너 써클", href: "/inner-circle" },
];

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const isHydrated = useHydrated();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen, isSearchOpen, setSearchOpen, isDiscreetMode, setDiscreetMode } =
    useUIStore();
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b py-2"
          : "bg-transparent py-4",
        className
      )}
      role="banner"
    >
      {/* Main Header */}
      <div className="container px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            {isHydrated ? (
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/5 rounded-full">
                    <MenuIcon />
                    <span className="sr-only">메뉴 열기</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-r-0 shadow-2xl">
                  <SheetHeader className="text-left pb-8 border-b">
                    <SheetTitle className="text-2xl font-bold tracking-tight">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-6 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-xl font-medium text-foreground/80 hover:text-primary transition-all hover:translate-x-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="border-t pt-8 mt-4 space-y-4">
                      <Link
                        href="/login"
                        className="flex items-center gap-2 text-xl font-medium text-foreground/80 hover:text-primary transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        로그인
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon />
              </Button>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
              <Logo width={40} height={48} className="h-10 w-auto filter drop-shadow-sm" priority />
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                  TeddyBear&apos;s Room
                </span>
                <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase leading-tight font-bold">
                  Skin & Silk Lifestyle
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10" role="navigation" aria-label="메인 네비게이션">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-foreground/70 hover:text-primary transition-all relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:block w-56 lg:w-64">
              <SearchInput placeholder="Search moments..." className="input-glass h-10 rounded-full" />
            </div>

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setSearchOpen(!isSearchOpen)}
            >
              <SearchIcon />
            </Button>

            {/* Profile/Wishlist for Desktop */}
            <div className="hidden sm:flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="/wishlist">
                  <HeartIcon />
                </Link>
              </Button>
              <AuthButton />
            </div>

            {/* Discreet Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all",
                isDiscreetMode ? "text-primary bg-primary/10" : "hover:bg-primary/5"
              )}
              onClick={() => setDiscreetMode(!isDiscreetMode)}
              title={isDiscreetMode ? "Discreet Mode Off" : "Discreet Mode On"}
            >
              {isDiscreetMode ? (
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
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
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
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative rounded-full bg-primary/5 hover:bg-primary/10" asChild>
              <Link href="/cart">
                <CartIcon />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-lg border-2 border-background">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-reveal">
            <SearchInput placeholder="Search moments..." className="w-full input-glass rounded-full h-12" />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
