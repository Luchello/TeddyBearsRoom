/**
 * Vitest Setup File
 * Global mocks and test utilities for TeddyBear's Room
 */

import '@testing-library/jest-dom';
import * as React from 'react';
import { vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';

// Type definitions for mocks
interface MockImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

interface MockLinkProps {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  [key: string]: unknown;
}

// Mock Next.js Router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    toString: vi.fn(),
  })),
  useParams: vi.fn(() => ({})),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ fill, ...props }: MockImageProps) => {
    return React.createElement('img', {
      ...props,
      style: fill ? { position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 } : props.style
    });
  },
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: MockLinkProps) => {
    return React.createElement('a', { ...props, href }, children);
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

global.localStorage = localStorageMock as Storage;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) { }
  disconnect(): void { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(target: Element): void { }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unobserve(target: Element): void { }
}
global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(callback: ResizeObserverCallback) { }
  disconnect(): void { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(target: Element, options?: ResizeObserverOptions): void { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unobserve(target: Element): void { }
}
global.ResizeObserver = MockResizeObserver;

// Reset mocks before each test
if (typeof beforeEach !== 'undefined') {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });
}
