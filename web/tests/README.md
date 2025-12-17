# TeddyBear's Room - Testing Suite

## Overview

This testing suite provides comprehensive test coverage for the TeddyBear's Room e-commerce platform using:
- **Vitest** for unit and integration tests
- **Playwright** for end-to-end (E2E) testing
- **Testing Library** for component testing

## Project Structure

```
tests/
├── setup.ts                    # Global test setup and mocks
├── unit/                       # Unit tests
│   ├── cart-store.test.ts     # Zustand store tests
│   └── product-card.test.tsx  # Component tests
└── e2e/                        # E2E tests
    └── checkout-flow.spec.ts  # Critical user journey tests
```

## Available Scripts

### Unit Tests (Vitest)
```bash
npm run test            # Run tests in watch mode
npm run test:ui         # Open Vitest UI dashboard
npm run test:run        # Run tests once (CI mode)
npm run test:coverage   # Generate coverage report
```

### E2E Tests (Playwright)
```bash
npm run test:e2e               # Run all E2E tests
npm run test:e2e:ui            # Run with Playwright UI
npm run test:e2e:headed        # Run with visible browser
npm run test:e2e:debug         # Run in debug mode
npm run playwright:install     # Install browser binaries
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
npm run playwright:install
```

### 2. Run Unit Tests
```bash
npm run test
```

### 3. Run E2E Tests
```bash
# Start dev server first
npm run dev

# In another terminal
npm run test:e2e
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: All critical user flows
- **E2E Tests**: Core user journeys (browse, cart, checkout)

## Configuration Files

### vitest.config.ts
- Environment: happy-dom
- Path aliases: matches tsconfig.json
- Coverage provider: v8
- Timeout: 10 seconds

### playwright.config.ts
- Base URL: http://localhost:3000
- Browser: Chromium (for speed)
- Retries: 2 in CI, 0 locally
- Video: retain on failure only

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/stores/cart-store';

describe('Cart Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [], appliedCoupon: null });
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore);

    act(() => {
      result.current.addItem(input, product);
    });

    expect(result.current.items).toHaveLength(1);
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('should complete checkout flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=상품명');
  await page.click('text=장바구니에 담기');
  await page.goto('/cart');

  expect(await page.locator('text=장바구니').isVisible()).toBeTruthy();
});
```

## Known Issues & Next Steps

### Current Issues
1. **Next.js 16 + React 19 Compatibility**: Some component tests fail due to mock incompatibilities with the latest Next.js/React versions
2. **Zustand Hydration**: Store tests need special handling for localStorage persistence
3. **Component Mocking**: Next.js Image and Link components require better mocking strategies

### Recommended Next Steps
1. **Simplify Component Tests**: Focus on testing props and user interactions rather than implementation details
2. **Add API Mocking**: Use MSW (Mock Service Worker) for API route testing
3. **Increase Coverage**: Add tests for:
   - Checkout flow components
   - Product filtering logic
   - Authentication flows
   - Payment integration (mocked)
4. **CI/CD Integration**: Add tests to GitHub Actions workflow
5. **Visual Regression**: Consider adding Playwright visual comparison tests

## Test Development Best Practices

### Unit Tests
- Test behavior, not implementation
- Keep tests isolated and independent
- Use descriptive test names
- Mock external dependencies
- Aim for 80%+ coverage on critical paths

### E2E Tests
- Test critical user journeys
- Use semantic selectors (role, label) over CSS selectors
- Keep tests reliable (avoid flaky tests)
- Use page objects for complex flows
- Test happy path + error scenarios

### Component Tests
- Test user-facing behavior
- Verify accessibility (ARIA labels, keyboard navigation)
- Test edge cases (loading, error states)
- Check responsive behavior
- Validate form validation

## Debugging Tips

### Vitest
```bash
# Run specific test file
npx vitest tests/unit/cart-store.test.ts

# Run tests matching pattern
npx vitest --grep "should add item"

# Update snapshots
npx vitest -u
```

### Playwright
```bash
# Debug mode (pause execution)
npx playwright test --debug

# Run specific test
npx playwright test tests/e2e/checkout-flow.spec.ts

# Generate test code
npx playwright codegen http://localhost:3000

# View test report
npx playwright show-report
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

## Support

For questions or issues, please:
1. Check existing test examples in `tests/` directory
2. Review this README and configuration files
3. Consult the official documentation links above
4. Contact the development team

---

**Last Updated**: 2025-12-17
**Version**: 1.0.0
