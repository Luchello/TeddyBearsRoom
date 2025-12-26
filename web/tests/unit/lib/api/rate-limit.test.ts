/**
 * Rate Limiter Tests
 * Tests for lib/api/rate-limit.ts
 *
 * Requirements covered: C2 (Rate Limiting)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      headers: new Map(Object.entries(init?.headers || {})),
      _data: data,
    })),
  },
}));

// Mock next/headers
const mockHeaders = new Map<string, string>();
vi.mock('next/headers', () => ({
  headers: vi.fn(() => Promise.resolve({
    get: (key: string) => mockHeaders.get(key) || null,
  })),
}));

import {
  checkRateLimit,
  getClientIdentifier,
  rateLimitResponse,
  withRateLimit,
  RATE_LIMIT_CONFIGS,
} from '@/lib/api/rate-limit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaders.clear();
    // Rate limit store is module-scoped, so we need to wait between tests
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('RATE_LIMIT_CONFIGS', () => {
    it('auth 설정이 분당 5회로 되어 있어야 함', () => {
      expect(RATE_LIMIT_CONFIGS.auth).toEqual({
        maxRequests: 5,
        windowMs: 60 * 1000,
      });
    });

    it('orders 설정이 분당 10회로 되어 있어야 함', () => {
      expect(RATE_LIMIT_CONFIGS.orders).toEqual({
        maxRequests: 10,
        windowMs: 60 * 1000,
      });
    });

    it('default 설정이 분당 30회로 되어 있어야 함', () => {
      expect(RATE_LIMIT_CONFIGS.default).toEqual({
        maxRequests: 30,
        windowMs: 60 * 1000,
      });
    });
  });

  describe('getClientIdentifier', () => {
    it('userId가 제공되면 user: prefix를 붙여 반환해야 함', async () => {
      const identifier = await getClientIdentifier('user-123');
      expect(identifier).toBe('user:user-123');
    });

    it('userId가 없으면 x-forwarded-for 헤더에서 IP를 추출해야 함', async () => {
      mockHeaders.set('x-forwarded-for', '192.168.1.1, 10.0.0.1');

      const identifier = await getClientIdentifier();
      expect(identifier).toBe('ip:192.168.1.1');
    });

    it('x-forwarded-for가 없으면 x-real-ip를 사용해야 함', async () => {
      mockHeaders.set('x-real-ip', '10.0.0.5');

      const identifier = await getClientIdentifier();
      expect(identifier).toBe('ip:10.0.0.5');
    });

    it('IP 헤더가 없으면 "unknown"을 사용해야 함', async () => {
      const identifier = await getClientIdentifier();
      expect(identifier).toBe('ip:unknown');
    });
  });

  describe('checkRateLimit', () => {
    it('첫 요청은 성공하고 remaining이 maxRequests - 1이어야 함', () => {
      const uniqueId = `test-first-${Date.now()}`;
      const result = checkRateLimit(uniqueId, 'default');

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(29); // 30 - 1
      expect(result.count).toBe(1);
    });

    it('제한 내 요청은 모두 성공해야 함', () => {
      const uniqueId = `test-within-${Date.now()}`;

      // 5회 요청 (auth 설정 사용)
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(uniqueId, 'auth');
        expect(result.success).toBe(true);
        expect(result.count).toBe(i + 1);
        expect(result.remaining).toBe(4 - i);
      }
    });

    it('제한 초과 요청은 실패해야 함', () => {
      const uniqueId = `test-exceed-${Date.now()}`;

      // 5회까지 성공
      for (let i = 0; i < 5; i++) {
        checkRateLimit(uniqueId, 'auth');
      }

      // 6번째 요청은 실패
      const result = checkRateLimit(uniqueId, 'auth');
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.count).toBe(6);
    });

    it('윈도우 리셋 후 요청이 다시 허용되어야 함', () => {
      const uniqueId = `test-reset-${Date.now()}`;

      // 5회 모두 사용
      for (let i = 0; i < 5; i++) {
        checkRateLimit(uniqueId, 'auth');
      }

      // 6번째는 실패
      expect(checkRateLimit(uniqueId, 'auth').success).toBe(false);

      // 1분 후 (윈도우 리셋)
      vi.advanceTimersByTime(60 * 1000 + 1);

      // 다시 성공
      const result = checkRateLimit(uniqueId, 'auth');
      expect(result.success).toBe(true);
      expect(result.count).toBe(1);
      expect(result.remaining).toBe(4);
    });

    it('다른 설정 키는 독립적으로 동작해야 함', () => {
      const uniqueId = `test-independent-${Date.now()}`;

      // auth로 5회 사용
      for (let i = 0; i < 5; i++) {
        checkRateLimit(uniqueId, 'auth');
      }
      expect(checkRateLimit(uniqueId, 'auth').success).toBe(false);

      // orders는 여전히 사용 가능
      const ordersResult = checkRateLimit(uniqueId, 'orders');
      expect(ordersResult.success).toBe(true);
    });
  });

  describe('rateLimitResponse', () => {
    it('429 상태 코드로 응답을 반환해야 함', () => {
      const response = rateLimitResponse();

      expect(response.status).toBe(429);
    });

    it('에러 메시지와 코드를 포함해야 함', () => {
      const response = rateLimitResponse();
      const data = response._data as { error: string; code: string };

      expect(data.error).toBe('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      expect(data.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('resetTime이 제공되면 retryAfter를 계산해야 함', () => {
      const futureTime = Date.now() + 30000; // 30초 후
      const response = rateLimitResponse(futureTime);
      const data = response._data as { retryAfter: number };

      expect(data.retryAfter).toBeLessThanOrEqual(30);
      expect(data.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('withRateLimit', () => {
    it('제한 내 요청은 success: true를 반환해야 함', async () => {
      mockHeaders.set('x-forwarded-for', `test-with-${Date.now()}`);

      const result = await withRateLimit('default');
      expect(result.success).toBe(true);
    });

    it('제한 초과 시 success: false와 response를 반환해야 함', async () => {
      const uniqueIp = `test-with-exceed-${Date.now()}`;
      mockHeaders.set('x-forwarded-for', uniqueIp);

      // 5회 사용 (auth 설정)
      for (let i = 0; i < 5; i++) {
        await withRateLimit('auth');
      }

      // 6번째 요청
      const result = await withRateLimit('auth');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(429);
      }
    });

    it('userId가 제공되면 user 기반으로 제한해야 함', async () => {
      const userId = `user-test-${Date.now()}`;

      // 5회 사용 (auth 설정)
      for (let i = 0; i < 5; i++) {
        await withRateLimit('auth', userId);
      }

      // 6번째 요청 실패
      const result = await withRateLimit('auth', userId);
      expect(result.success).toBe(false);

      // 다른 userId는 성공
      const otherResult = await withRateLimit('auth', 'other-user');
      expect(otherResult.success).toBe(true);
    });
  });
});
