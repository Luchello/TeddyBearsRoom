# Cart Drawer 구조 분석 (2025-12-17)

## 주요 발견사항

### 1. CartDrawer 컴포넌트 상태: 존재 ✅
- 위치: `web/src/components/cart/cart-drawer.tsx`
- 상태: 완전히 구현됨 (138 lines)
- 기능: Zustand store의 `isOpen` 상태로 제어되는 side sheet drawer

### 2. Header 컴포넌트 구조
- 위치: `web/src/components/layout/header.tsx` (284 lines)
- 장바구니 버튼: `<Button variant="ghost" size="icon" asChild>`
- **링크 타입**: `<Link href="/cart">` (페이지 네비게이션)
- 클릭 동작: `/cart` 페이지로 직접 이동 (drawer 열지 않음)

### 3. Cart Store (`useCartStore`)
- 상태: `isOpen: boolean` 보유
- 액션: `setIsOpen(isOpen: boolean)` 메서드 존재
- **문제**: Header에서 setIsOpen을 호출하지 않음

### 4. E2E 테스트 현황
- 파일: `web/tests/e2e/checkout-flow.spec.ts`
- "should display cart drawer when cart icon is clicked" 테스트: **존재하지 않음**
- 관련 테스트: `'should navigate to cart page via header link'` (page URL 테스트)

## 아키텍처 분석

```
Header Cart Button
    └─> Links to /cart page (현재 구현)
    
CartDrawer Component (미사용)
    └─> useCartStore.setIsOpen() 대기 중
    └─> Sheet open={isOpen} onOpenChange={setIsOpen}
```

## 결론
- CartDrawer 컴포넌트는 구현되어 있지만 Header와 통합되지 않음
- 현재 아키텍처는 cart page navigation (링크 기반)
- 테스트 실패는 테스트 코드가 존재하지 않음 (실제로는 존재하는 테스트와 기능 mismatch)
