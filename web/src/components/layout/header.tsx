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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchInput } from "@/components/ui/input";

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

const UserIcon = () => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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
  const { isMobileMenuOpen, setMobileMenuOpen, isSearchOpen, setSearchOpen } =
    useUIStore();
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      {/* Top Bar - Announcement */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-8 items-center justify-center text-xs sm:text-sm">
          <span>🎁 이너 써클 가입 시 첫 구매 15% 할인</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <MenuIcon />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>메뉴</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <Link
                      href="/auth/login"
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      로그인
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                TeddyBear&apos;s Room
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:block w-64">
              <SearchInput placeholder="상품 검색..." />
            </div>

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(!isSearchOpen)}
            >
              <SearchIcon />
              <span className="sr-only">검색</span>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <HeartIcon />
                <span className="sr-only">위시리스트</span>
              </Link>
            </Button>

            {/* User */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth/login">
                <UserIcon />
                <span className="sr-only">계정</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <CartIcon />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
                <span className="sr-only">장바구니</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <SearchInput placeholder="상품 검색..." className="w-full" />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
