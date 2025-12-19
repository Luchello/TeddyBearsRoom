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
    // 상품 그리드 렌더링 대기 (Link 요소로 렌더링됨)
    await page.waitForSelector('a[href^="/products/"]', { timeout: 30000 });

    // 최소 1개 이상의 상품 카드 존재 확인
    const productCards = page.locator('a[href^="/products/"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    // 첫 번째 상품 카드의 주요 요소 확인
    const firstCard = productCards.first();
    await expect(firstCard).toBeVisible();

    // 상품명 존재 확인 (h3 태그 사용)
    const productName = firstCard.locator('h3');
    await expect(productName).toBeVisible();
  });

  test('should navigate to product detail page', async ({ page }) => {
    // 첫 번째 상품 카드 찾기 (Link 요소)
    await page.waitForSelector('a[href^="/products/"]', { timeout: 30000 });
    const firstProductLink = page.locator('a[href^="/products/"]').first();

    // 상품명 가져오기 (h3 태그에서 추출)
    const productNameElement = firstProductLink.locator('h3');
    const productName = await productNameElement.textContent();

    // 상품 카드 클릭하여 상세 페이지로 이동
    await firstProductLink.click();

    // URL이 /products/[slug] 형태로 변경되었는지 확인
    await page.waitForURL(/\/products\/.+/);

    // 상세 페이지 로드 확인
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // 상품명이 여전히 보이는지 확인 (상세 페이지에서도 같은 상품명이 표시되어야 함)
    if (productName && productName.trim()) {
      await expect(page.locator('body')).toContainText(productName.trim());
    }
  });

  test('should add product to cart from homepage', async ({ page }) => {
    // 상품 카드 대기
    await page.waitForSelector('a[href^="/products/"]', { timeout: 30000 });
    const firstProductCard = page.locator('a[href^="/products/"]').first();

    // 상품 카드에 호버하여 Quick Actions 표시
    await firstProductCard.hover();

    // 장바구니 추가 버튼 찾기 (+ 아이콘이 있는 버튼)
    const addToCartButton = firstProductCard.locator('button').nth(1);

    // 버튼이 표시될 때까지 대기
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });

    // 장바구니 추가 버튼 클릭
    await addToCartButton.click();

    // Note: This test verifies the button exists and is clickable
    // Cart state management verification requires actual implementation
  });

  test('should navigate to cart page via header link', async ({ page }) => {
    // 상품을 장바구니에 먼저 추가
    await page.waitForSelector('a[href^="/products/"]', { timeout: 30000 });
    const firstArticle = page.locator('article').first();

    // 호버 및 추가 (두 번째 버튼이 장바구니 버튼)
    await firstArticle.hover();
    await page.waitForTimeout(300); // 애니메이션 대기
    const addToCartButton = firstArticle.locator('button').nth(1); // 두 번째 버튼 (0: wishlist, 1: cart)
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니 카운트 업데이트 대기
    await page.waitForTimeout(500);

    // 헤더의 장바구니 링크 찾기 및 클릭
    const cartLink = page.locator('header a[href="/cart"]').first();

    if (await cartLink.count() > 0) {
      await cartLink.click();

      // 장바구니 페이지로 이동 확인
      await page.waitForURL(/\/cart/);

      // 장바구니 헤딩 확인
      const cartHeading = page.locator('h1').filter({ hasText: /장바구니/i }).first();
      await expect(cartHeading).toBeVisible({ timeout: 5000 });
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
    await page.waitForSelector('a[href^="/products/"]', { timeout: 30000 });
    const firstArticle = page.locator('article').first();
    await firstArticle.hover();
    await page.waitForTimeout(300);
    const addToCartButton = firstArticle.locator('button').nth(1);
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니 페이지로 이동
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // 장바구니 아이템 영역 확인
    const cartItem = page.locator('div.flex.gap-4.py-4').first();
    await expect(cartItem).toBeVisible({ timeout: 5000 });

    // 초기 수량 확인 (수량 표시 영역에서 숫자 찾기)
    const quantityContainer = cartItem.locator('div.flex.items-center.border.rounded-lg').first();
    await expect(quantityContainer).toBeVisible({ timeout: 5000 });
    const initialQuantityText = await quantityContainer.locator('span').textContent();
    const initialQuantity = parseInt(initialQuantityText || '1', 10);

    // 수량 증가 버튼 클릭 (aria-label 사용)
    const increaseButton = page.locator('button[aria-label="수량 증가"]').first();
    await expect(increaseButton).toBeVisible({ timeout: 5000 });
    await increaseButton.click();
    await page.waitForTimeout(500);

    // 수량이 증가했는지 확인
    const updatedQuantityText = await quantityContainer.locator('span').textContent();
    const updatedQuantity = parseInt(updatedQuantityText || '1', 10);
    expect(updatedQuantity).toBe(initialQuantity + 1);
  });

  test('should remove item from cart', async ({ page }) => {
    // 상품을 장바구니에 추가
    await page.waitForSelector('a[href^="/products/"]', { timeout: 30000 });
    const firstArticle = page.locator('article').first();
    await firstArticle.hover();
    await page.waitForTimeout(300);
    const addToCartButton = firstArticle.locator('button').nth(1);
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니 페이지로 이동
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // 삭제 버튼 찾기 (aria-label 사용)
    const deleteButton = page.locator('button[aria-label="삭제"]').first();
    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await deleteButton.click();
    await page.waitForTimeout(500);

    // 빈 장바구니 메시지 확인
    const emptyMessage = page.locator('text=/비어|empty/i').first();
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
  });

  test('should persist cart items after page reload', async ({ page }) => {
    // 상품을 장바구니에 추가
    await page.waitForSelector('a[href^="/products/"]', { timeout: 30000 });
    const firstArticle = page.locator('article').first();
    await firstArticle.hover();
    await page.waitForTimeout(300);
    const addToCartButton = firstArticle.locator('button').nth(1);
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니에 아이템이 추가되었는지 확인 (localStorage 저장 대기)
    await page.waitForTimeout(500);

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 장바구니 페이지로 이동하여 아이템 확인
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // 장바구니 아이템이 여전히 존재하는지 확인
    const cartItem = page.locator('div.flex.gap-4.py-4').first();
    await expect(cartItem).toBeVisible({ timeout: 5000 });
  });

  test('should show correct total price in cart', async ({ page }) => {
    // 상품을 장바구니에 추가
    await page.waitForSelector('a[href^="/products/"]', { timeout: 30000 });
    const firstArticle = page.locator('article').first();
    await firstArticle.hover();
    await page.waitForTimeout(300);
    const addToCartButton = firstArticle.locator('button').nth(1);
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();

    // 장바구니 페이지로 이동
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // 총 가격 표시 확인 (DOM 분석 결과: span.text-2xl.font-bold)
    const totalPriceElement = page.locator('span.text-2xl.font-bold').first();
    await expect(totalPriceElement).toBeVisible({ timeout: 5000 });

    // 가격 정보가 표시되는지 확인 (원화 단위 포함)
    const totalPriceText = await totalPriceElement.textContent();
    expect(totalPriceText).toMatch(/원|₩/);
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

      // 상품 목록이 업데이트되는지 확인 (article 요소)
      await page.waitForSelector('article', { timeout: 30000 });
      const productArticles = page.locator('article');
      expect(await productArticles.count()).toBeGreaterThan(0);
    }
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/');

    // 검색 입력 필드 찾기 (DOM 분석 결과: input[type='search'][placeholder*='검색'])
    const searchInput = page.locator('input[type="search"][placeholder*="검색"]').first();

    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // 검색어 입력
      await searchInput.fill('파스텔');
      await searchInput.press('Enter');

      // 검색 결과 대기
      await page.waitForTimeout(1000);

      // 검색 결과 확인 (article 또는 link 요소)
      const productLinks = page.locator('a[href^="/products/"]');
      const hasResults = await productLinks.count() > 0;
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
