# Component Architecture Documentation

TeddyBear's Room - React Component Library

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENT HIERARCHY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐      │
│   │                         APP SHELL                                │      │
│   │   ┌─────────────────────────────────────────────────────────┐   │      │
│   │   │  Header                                                  │   │      │
│   │   │  ├── Logo                                               │   │      │
│   │   │  ├── Navigation                                         │   │      │
│   │   │  ├── SearchInput                                        │   │      │
│   │   │  └── ActionButtons (Cart, Wishlist, User)               │   │      │
│   │   └─────────────────────────────────────────────────────────┘   │      │
│   │                                                                  │      │
│   │   ┌─────────────────────────────────────────────────────────┐   │      │
│   │   │  Main Content                                            │   │      │
│   │   │  ├── Page-specific components                           │   │      │
│   │   │  └── Shared components                                  │   │      │
│   │   └─────────────────────────────────────────────────────────┘   │      │
│   │                                                                  │      │
│   │   ┌─────────────────────────────────────────────────────────┐   │      │
│   │   │  Footer                                                  │   │      │
│   │   └─────────────────────────────────────────────────────────┘   │      │
│   └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Organization

```
src/components/
├── ui/                   # Base UI primitives (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   ├── scroll-area.tsx
│   └── dropdown-menu.tsx
│
├── layout/               # App shell components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   └── mobile-menu.tsx
│
├── auth/                 # Authentication components
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── adult-verification.tsx
│
├── products/             # Product-related components
│   ├── product-card.tsx
│   ├── product-grid.tsx
│   ├── product-filters.tsx
│   ├── product-gallery.tsx
│   ├── product-info.tsx
│   ├── product-variants.tsx
│   └── size-recommendation.tsx
│
├── cart/                 # Cart components
│   ├── cart-item.tsx
│   ├── cart-summary.tsx
│   ├── cart-drawer.tsx
│   └── empty-cart.tsx
│
├── checkout/             # Checkout flow components
│   ├── shipping-form.tsx
│   ├── payment-form.tsx
│   ├── order-summary.tsx
│   └── coupon-input.tsx
│
├── account/              # Account components
│   ├── profile-form.tsx
│   ├── order-history.tsx
│   ├── measurement-form.tsx
│   └── subscription-card.tsx
│
└── shared/               # Shared/utility components
    ├── logo.tsx
    ├── price-display.tsx
    ├── quantity-selector.tsx
    ├── loading-spinner.tsx
    └── error-boundary.tsx
```

---

## Base UI Components (shadcn/ui)

### Button

```typescript
// src/components/ui/button.tsx

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Usage**
```tsx
<Button variant="default">기본 버튼</Button>
<Button variant="outline" size="sm">작은 아웃라인</Button>
<Button variant="ghost" size="icon"><HeartIcon /></Button>
<Button asChild><Link href="/products">상품 보기</Link></Button>
```

---

### Badge

```typescript
// src/components/ui/badge.tsx

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        // Custom variants
        new: "border-transparent bg-accent text-accent-foreground",
        sale: "border-transparent bg-red-500 text-white",
        soldout: "border-transparent bg-muted text-muted-foreground",
        innerCircle: "border-transparent bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Discount badge with percentage display
export function DiscountBadge({ discountPercent }: { discountPercent: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
      {discountPercent}% OFF
    </span>
  );
}
```

---

### Input & SearchInput

```typescript
// src/components/ui/input.tsx

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// Search variant with icon
export function SearchInput({ className, ...props }: InputProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-9", className)}
        placeholder="상품 검색..."
        {...props}
      />
    </div>
  );
}
```

---

## Layout Components

### Header

```typescript
// src/components/layout/header.tsx

"use client";

import { useState, useEffect } from "react";
import { useUIStore, useCartStore } from "@/stores";

// Hydration-safe hook to prevent SSR/CSR mismatch
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function Header({ className }: { className?: string }) {
  const isHydrated = useHydrated();
  const { isMobileMenuOpen, setMobileMenuOpen, isSearchOpen, setSearchOpen } = useUIStore();
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur",
      "supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu - Only render after hydration */}
            {isHydrated ? (
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <MenuIcon />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  {/* Navigation links */}
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon />
              </Button>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo width={40} height={48} />
              <span className="hidden sm:inline text-lg font-bold">
                TeddyBear&apos;s Room
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <SearchInput className="hidden md:block w-64" />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist"><HeartIcon /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <CartIcon />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

**Key Patterns**:
- `useHydrated()` hook prevents Radix UI Sheet hydration mismatch
- SSR placeholder rendered before hydration completes
- Cart count updates reactively via Zustand subscription

---

## Product Components

### ProductCard

```typescript
// src/components/products/product-card.tsx

"use client";

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  onAddToCart?: (product: ProductCardData) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  showQuickActions?: boolean;
}

export function ProductCard({
  product,
  className,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  showQuickActions = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl bg-card border transition-all duration-300",
        "hover:shadow-[var(--shadow-medium)] hover:border-primary/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug || product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-muted">
          {!imageError && product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "object-cover transition-transform duration-500",
                isHovered && "scale-105"
              )}
              onError={() => setImageError(true)}
            />
          ) : (
            <FallbackImage />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <Badge variant="new">NEW</Badge>}
            {hasDiscount && <DiscountBadge discountPercent={discountPercent} />}
            {product.isSoldOut && <Badge variant="soldout">품절</Badge>}
          </div>

          {/* Quick Actions (hover reveal) */}
          {showQuickActions && (
            <div className={cn(
              "absolute bottom-2 right-2 flex gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}>
              <Button variant="secondary" size="icon-sm" onClick={handleToggleWishlist}>
                <HeartIcon filled={isWishlisted} />
              </Button>
              {!product.isSoldOut && (
                <Button variant="secondary" size="icon-sm" onClick={handleAddToCart}>
                  <CartPlusIcon />
                </Button>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {product.brand && (
          <span className="text-xs text-muted-foreground mb-1">{product.brand}</span>
        )}
        <Link href={`/products/${product.slug}`} className="font-medium text-sm line-clamp-2">
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Inner Circle Price */}
          {product.innerCirclePrice && (
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="innerCircle" className="text-[10px]">이너 써클</Badge>
              <span className="text-sm font-medium text-primary">
                {formatPrice(product.innerCirclePrice)}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
```

**Features**:
- Responsive image sizing with Next.js Image
- Hover zoom effect with CSS transform
- Fallback image on load error
- Badge system (NEW, discount %, soldout)
- Inner Circle member price display
- Quick actions with hover reveal animation

---

### ProductGrid

```typescript
// src/components/products/product-grid.tsx

interface ProductGridProps {
  products: ProductCardData[];
  columns?: 2 | 3 | 4;
  onAddToCart?: (product: ProductCardData) => void;
  wishlistedIds?: Set<string>;
  onToggleWishlist?: (productId: string) => void;
}

export function ProductGrid({
  products,
  columns = 4,
  onAddToCart,
  wishlistedIds = new Set(),
  onToggleWishlist,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:gap-6", gridCols[columns])}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlistedIds.has(product.id)}
        />
      ))}
    </div>
  );
}
```

---

## Cart Components

### CartItem

```typescript
// src/components/cart/cart-item.tsx

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Image */}
      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <FallbackImage />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-medium line-clamp-2">{item.name}</h3>
        {item.variant && (
          <p className="text-sm text-muted-foreground">{item.variant.name}</p>
        )}

        <div className="mt-auto flex items-center justify-between">
          {/* Quantity Selector */}
          <QuantitySelector
            value={item.quantity}
            onChange={onUpdateQuantity}
            min={1}
            max={10}
          />

          {/* Price */}
          <div className="text-right">
            <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
            {item.originalPrice > item.price && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(item.originalPrice * item.quantity)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button variant="ghost" size="icon-sm" onClick={onRemove}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### CartSummary

```typescript
// src/components/cart/cart-summary.tsx

interface CartSummaryProps {
  totals: CartTotals;
  isInnerCircle?: boolean;
}

export function CartSummary({ totals, isInnerCircle = false }: CartSummaryProps) {
  return (
    <div className="rounded-2xl bg-muted/50 p-6 space-y-4">
      <h2 className="font-semibold text-lg">주문 요약</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>상품 합계</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>

        {totals.innerCircleDiscount > 0 && (
          <div className="flex justify-between text-primary">
            <span>이너 서클 할인 (10%)</span>
            <span>-{formatPrice(totals.innerCircleDiscount)}</span>
          </div>
        )}

        {totals.couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>쿠폰 할인</span>
            <span>-{formatPrice(totals.couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>배송비</span>
          <span>
            {totals.isFreeShipping ? (
              <span className="text-green-600">무료</span>
            ) : (
              formatPrice(totals.shipping)
            )}
          </span>
        </div>

        {!totals.isFreeShipping && (
          <p className="text-xs text-muted-foreground">
            {formatPrice(totals.freeShippingThreshold - totals.subtotal + totals.discount)} 더 담으면 무료배송!
          </p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-lg">
        <span>총 결제 금액</span>
        <span>{formatPrice(totals.total)}</span>
      </div>

      {totals.savings > 0 && (
        <p className="text-sm text-primary text-center">
          총 {formatPrice(totals.savings)} 할인 받았어요!
        </p>
      )}
    </div>
  );
}
```

---

## Homepage Sections

### HeroSection

```typescript
// Located in: src/app/(shop)/page.tsx

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Premium Pastel Furry Universe
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            TeddyBear&apos;s Room에
            <br />
            <span className="text-primary">오신 것을 환영해요</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            프리미엄 성인용품을 위한 파스텔 유니버스.
            당신만의 특별한 경험을 시작하세요.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">상품 둘러보기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/inner-circle">이너 서클 알아보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### RoommateSection (구독 프로모션)

```typescript
function RoommateSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <Badge variant="innerCircle" className="mb-4">이너 서클</Badge>
            <h2 className="text-3xl font-bold mb-4">
              Roommate 멤버십
            </h2>
            <p className="text-muted-foreground mb-6">
              월 9,900원으로 특별한 혜택을 누리세요.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "모든 상품 10% 할인",
                "3만원 이상 무료배송",
                "구독료 1% 기부 참여",
                "신상품 선공개 알림",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" asChild>
              <Link href="/inner-circle">
                멤버십 시작하기
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-primary">9,900</p>
                <p className="text-muted-foreground">원/월</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## Shared Components

### QuantitySelector

```typescript
// src/components/shared/quantity-selector.tsx

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center font-medium">{value}</span>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### PriceDisplay

```typescript
// src/components/shared/price-display.tsx

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  innerCirclePrice?: number;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  price,
  compareAtPrice,
  innerCirclePrice,
  size = "md",
}: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        {hasDiscount && (
          <span className="text-red-500 font-bold">{discountPercent}%</span>
        )}
        <span className={cn("font-bold", sizeClasses[size])}>
          {formatPrice(price)}
        </span>
        {hasDiscount && (
          <span className="text-muted-foreground line-through text-sm">
            {formatPrice(compareAtPrice)}
          </span>
        )}
      </div>

      {innerCirclePrice && (
        <div className="flex items-center gap-1">
          <Badge variant="innerCircle" className="text-[10px]">
            이너 써클
          </Badge>
          <span className="text-sm font-medium text-primary">
            {formatPrice(innerCirclePrice)}
          </span>
        </div>
      )}
    </div>
  );
}
```

---

## Component Patterns & Best Practices

### 1. Hydration Safety

```typescript
// Pattern: useHydrated hook
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

// Usage
function Component() {
  const isHydrated = useHydrated();

  return isHydrated ? <DynamicContent /> : <Placeholder />;
}
```

### 2. Optimistic Updates

```typescript
// Pattern: Zustand with optimistic UI
const addToCart = (item) => {
  // Optimistic update
  set((state) => ({ items: [...state.items, item] }));

  // Server sync (background)
  syncCartToServer(item).catch(() => {
    // Rollback on error
    set((state) => ({
      items: state.items.filter((i) => i.id !== item.id)
    }));
  });
};
```

### 3. Error Boundaries

```typescript
// Pattern: Component-level error boundary
export function ProductsSection() {
  return (
    <ErrorBoundary fallback={<ProductsError />}>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 4. Responsive Design

```typescript
// Pattern: Tailwind responsive variants
<div className={cn(
  "grid gap-4",
  "grid-cols-2",          // Mobile: 2 columns
  "sm:grid-cols-3",       // Tablet: 3 columns
  "lg:grid-cols-4",       // Desktop: 4 columns
  "xl:grid-cols-5"        // Large: 5 columns
)}>
```

---

**Last Updated**: 2025-12-17
