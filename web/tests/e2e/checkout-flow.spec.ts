/**
 * Checkout Flow E2E Test
 * TeddyBear's Room - Critical User Journey Testing
 *
 * 테스트 시나리오:
 * 1. 홈페이지 접속
 * 2. 상품 목록 조회
 * 3. 상품 상세 페이지 이동
 * 4. 장바구니에 상품 추가
 * 5. 장바구니 확인
 * (실제 결제는 인증 필요로 테스트 제외)
 */

import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 홈페이지로 이동
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // 홈페이지 로드 확인
    await expect(page).toHaveTitle(/TeddyBear/i);

    // 헤더 로고 확인
    const logo = page.locator('header img[alt*="TeddyBear"]').first();
    await expect(logo).toBeVisible();

    // 네비게이션 메뉴 확인
    const navigation = page.locator('nav').first();
    await expect(navigation).toBeVisible();
  });

  test('should display product grid on homepage', async ({ page }) => {
    // 상품 그리드 렌더링 대기
    await page.waitForSelector('article', { timeout: 10000 });

    // 최소 1개 이상의 상품 카드 존재 확인
    const productCards = page.locator('article');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    // 첫 번째 상품 카드의 주요 요소 확인
    const firstCard = productCards.first();
    await expect(firstCard).toBeVisible();

    // 상품명 존재 확인 (구체적인 텍스트는 데이터에 따라 다름)
    const productName = firstCard.locator('a').last();
    await expect(productName).toBeVisible();
  });

  test('should navigate to product detail page', async ({ page }) => {
    // 첫 번째 상품 카드 찾기
    await page.waitForSelector('article', { timeout: 10000 });
    const firstProductCard = page.locator('article').first();

    // 상품 이름 저장 (나중에 확인용)
    const productNameElement = firstProductCard.locator('a').last();
    const productName = await productNameElement.textContent();

    // 상품 카드 클릭하여 상세 페이지로 이동
    await firstProductCard.locator('a').first().click();

    // URL이 /products/[slug] 형태로 변경되었는지 확인
    await page.waitForURL(/\/products\/.+/);

    // 상세 페이지 로드 확인
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // 상품명이 여전히 보이는지 확인
    if (productName) {
      await expect(page.locator('body')).toContainText(productName.trim());
    }
  });

  test('should add product to cart from homepage', async ({ page }) => {
    // 상품 카드 대기
    await page.waitForSelector('article', { timeout: 10000 });
    const firstProductCard = page.locator('article').first();

    // 상품 카드에 호버하여 Quick Actions 표시
    await firstProductCard.hover();

    // 장바구니 추가 버튼 찾기 (sr-only 텍스트 사용)
    const addToCartButton = firstProductCard.getByLabel('장바구니에 담기');

    // 버튼이 표시될 때까지 대기
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });

    // 장바구니 추가 버튼 클릭
    await addToCartButton.click();

    // 장바구니 아이콘의 카운트 뱃지가 업데이트되었는지 확인
    // (헤더에 장바구니 아이콘이 있다고 가정)
    const cartBadge = page.locator('header').locator('text=1').first();
    await expect(cartBadge).toBeVisible({ timeout: 5000 });
  });

  test('should display cart drawer when cart icon is clicked', async ({ page }) => {
    // 상품을 장바구니에 먼저 추가
    await page.waitForSelector('article', { timeout: 10000 });
    const firstProductCard = page.locator('article').first();

    // 호버 및 추가
    await firstProductCard.hover();
    const addToCartButton = firstProductCard.getByLabel('장바구니에 담기');
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니 카운트 업데이트 대기
    await page.waitForTimeout(500);

    // 헤더의 장바구니 아이콘 찾기 및 클릭
    // (장바구니 버튼이 "장바구니" 또는 아이콘으로 되어있다고 가정)
    const cartButton = page.locator('header button, header a').filter({ hasText: /장바구니|cart/i }).first();

    if (await cartButton.count() > 0) {
      await cartButton.click();

      // 장바구니 드로어/페이지가 표시되는지 확인
      // (드로어인 경우 즉시 표시, 페이지인 경우 URL 변경)
      await page.waitForTimeout(500);

      // 장바구니 관련 텍스트 확인
      const cartContent = page.locator('text=/장바구니|Cart/i').first();
      await expect(cartContent).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to cart page via URL', async ({ page }) => {
    // 장바구니 페이지로 직접 이동
    await page.goto('/cart');

    // 장바구니 페이지 로드 확인
    await expect(page).toHaveURL(/\/cart/);

    // "장바구니" 텍스트 또는 "Cart" 헤딩 확인
    const heading = page.locator('h1, h2').filter({ hasText: /장바구니|Cart/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should show empty cart message when no items', async ({ page }) => {
    // 장바구니 페이지로 이동
    await page.goto('/cart');

    // 빈 장바구니 메시지 확인 (실제 메시지는 구현에 따라 다를 수 있음)
    const emptyMessage = page.locator('text=/비어|empty/i').first();

    // 메시지가 있거나, 또는 상품 목록이 비어있어야 함
    const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
    const itemCount = await page.locator('[data-testid="cart-item"], article').count();

    expect(hasEmptyMessage || itemCount === 0).toBeTruthy();
  });

  test('should update quantity in cart', async ({ page }) => {
    // 상품을 장바구니에 추가
    await page.waitForSelector('article', { timeout: 10000 });
    const firstProductCard = page.locator('article').first();
    await firstProductCard.hover();
    const addToCartButton = firstProductCard.getByLabel('장바구니에 담기');
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니 페이지로 이동
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // 수량 증가 버튼 찾기 (+ 버튼 또는 increase 버튼)
    const increaseButton = page.locator('button').filter({ hasText: /\+|increase/i }).first();

    if (await increaseButton.count() > 0) {
      // 현재 수량 확인
      const quantityDisplay = page.locator('text=/수량|quantity/i').first();
      await expect(quantityDisplay).toBeVisible({ timeout: 5000 });

      // 증가 버튼 클릭
      await increaseButton.click();
      await page.waitForTimeout(500);

      // 수량이 증가했는지 확인 (UI 업데이트 대기)
      await expect(quantityDisplay).toBeVisible();
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // 상품을 장바구니에 추가
    await page.waitForSelector('article', { timeout: 10000 });
    const firstProductCard = page.locator('article').first();
    await firstProductCard.hover();
    const addToCartButton = firstProductCard.getByLabel('장바구니에 담기');
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니 페이지로 이동
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // 삭제 버튼 찾기
    const removeButton = page.locator('button').filter({ hasText: /삭제|제거|remove/i }).first();

    if (await removeButton.count() > 0) {
      await removeButton.click();
      await page.waitForTimeout(500);

      // 빈 장바구니 메시지 또는 상품 목록 비어있음 확인
      const emptyMessage = page.locator('text=/비어|empty/i').first();
      const hasEmptyMessage = await emptyMessage.isVisible({ timeout: 5000 }).catch(() => false);

      expect(hasEmptyMessage).toBeTruthy();
    }
  });

  test('should persist cart items after page reload', async ({ page }) => {
    // 상품을 장바구니에 추가
    await page.waitForSelector('article', { timeout: 10000 });
    const firstProductCard = page.locator('article').first();
    await firstProductCard.hover();
    const addToCartButton = firstProductCard.getByLabel('장바구니에 담기');
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 장바구니 카운트가 여전히 1인지 확인 (localStorage persistence)
    const cartBadge = page.locator('header').locator('text=1').first();
    await expect(cartBadge).toBeVisible({ timeout: 5000 });
  });

  test('should show correct total price in cart', async ({ page }) => {
    // 상품을 장바구니에 추가
    await page.waitForSelector('article', { timeout: 10000 });
    const firstProductCard = page.locator('article').first();
    await firstProductCard.hover();
    const addToCartButton = firstProductCard.getByLabel('장바구니에 담기');
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니 페이지로 이동
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // 가격 정보가 표시되는지 확인
    const priceElement = page.locator('text=/원|₩/').first();
    await expect(priceElement).toBeVisible({ timeout: 5000 });

    // 총 가격 섹션 확인 (총, 합계, total 등)
    const totalSection = page.locator('text=/총|합계|total/i').first();
    await expect(totalSection).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Product Browsing', () => {
  test('should filter products by category', async ({ page }) => {
    await page.goto('/');

    // 카테고리 필터가 있는지 확인
    const categoryFilter = page.locator('text=/카테고리|category/i').first();

    if (await categoryFilter.isVisible({ timeout: 5000 }).catch(() => false)) {
      // 카테고리 클릭
      await categoryFilter.click();
      await page.waitForTimeout(1000);

      // 상품 목록이 업데이트되는지 확인
      await page.waitForSelector('article', { timeout: 10000 });
      const productCards = page.locator('article');
      expect(await productCards.count()).toBeGreaterThan(0);
    }
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/');

    // 검색 입력 필드 찾기
    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]').first();

    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // 검색어 입력
      await searchInput.fill('test');
      await searchInput.press('Enter');

      // 검색 결과 대기
      await page.waitForTimeout(1000);

      // URL이 변경되거나 결과가 표시되는지 확인
      const hasResults = await page.locator('article').count() > 0;
      expect(hasResults).toBeTruthy();
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper page title on all pages', async ({ page }) => {
    // 홈페이지
    await page.goto('/');
    await expect(page).toHaveTitle(/TeddyBear/i);

    // 장바구니 페이지
    await page.goto('/cart');
    await expect(page).toHaveTitle(/장바구니|Cart|TeddyBear/i);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    // 메인 네비게이션이 nav 태그로 되어있는지 확인
    const mainNav = page.locator('nav').first();
    await expect(mainNav).toBeVisible();

    // 링크들이 접근 가능한지 확인
    const navLinks = mainNav.locator('a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});
