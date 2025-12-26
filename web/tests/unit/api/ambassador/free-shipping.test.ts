/**
 * Ambassador Free Shipping API Tests
 * Tests for app/api/ambassador/free-shipping/route.ts
 *
 * Requirements covered: 6.1 (앰버서더 무료 배송 확인), 6.2 (앰버서더 무료 배송 사용)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockRequireAuth, mockWithRateLimit, mockCheckFreeShippingAvailable, mockUseFreeShipping } =
  vi.hoisted(() => ({
    mockRequireAuth: vi.fn(),
    mockWithRateLimit: vi.fn(),
    mockCheckFreeShippingAvailable: vi.fn(),
    mockUseFreeShipping: vi.fn(),
  }));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      _data: data,
    })),
  },
}));

// Mock auth helper
vi.mock('@/lib/api/auth', () => ({
  requireAuth: () => mockRequireAuth(),
  apiError: (message: string, status: number = 500) => ({
    json: () => Promise.resolve({ success: false, error: message }),
    status,
    _data: { success: false, error: message },
  }),
}));

// Mock rate limit
vi.mock('@/lib/api/rate-limit', () => ({
  withRateLimit: mockWithRateLimit,
}));

// Mock ambassador service
vi.mock('@/lib/services/ambassador.service', () => ({
  checkFreeShippingAvailable: mockCheckFreeShippingAvailable,
  useFreeShipping: mockUseFreeShipping,
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import { GET, POST } from '@/app/api/ambassador/free-shipping/route';

describe('Ambassador Free Shipping API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockWithRateLimit.mockResolvedValue({ success: true });
  });

  describe('GET /api/ambassador/free-shipping', () => {
    it('무료 배송 사용 가능 시 available: true를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockCheckFreeShippingAvailable.mockResolvedValue({
        available: true,
        nextAvailableAt: null,
      });

      const response = await GET();

      expect(mockCheckFreeShippingAvailable).toHaveBeenCalledWith('user-123');
      expect(response.status).toBe(200);
      expect(response._data.available).toBe(true);
    });

    it('무료 배송 사용 불가 시 available: false와 nextAvailableAt을 반환해야 함', async () => {
      const nextDate = new Date('2024-02-01');
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockCheckFreeShippingAvailable.mockResolvedValue({
        available: false,
        nextAvailableAt: nextDate,
      });

      const response = await GET();

      expect(response._data.available).toBe(false);
      expect(response._data.nextAvailableAt).toBe(nextDate.toISOString());
    });

    it('인증된 사용자만 본인의 정보를 조회해야 함 (BOLA 방지)', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockCheckFreeShippingAvailable.mockResolvedValue({ available: true });

      await GET();

      // 본인 ID로만 조회
      expect(mockCheckFreeShippingAvailable).toHaveBeenCalledWith('user-123');
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({
        success: false,
        response: {
          status: 401,
          _data: { success: false, error: '로그인이 필요합니다.' },
        },
      });

      const response = await GET();

      expect(response.status).toBe(401);
    });

    it('Rate Limit 초과 시 429 응답을 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockWithRateLimit.mockResolvedValue({
        success: false,
        response: {
          status: 429,
          _data: { error: '요청이 너무 많습니다.' },
        },
      });

      const response = await GET();

      expect(response.status).toBe(429);
    });
  });

  describe('POST /api/ambassador/free-shipping', () => {
    it('무료 배송 사용 성공 시 success: true를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockUseFreeShipping.mockResolvedValue({ success: true });

      const response = await POST();

      expect(mockUseFreeShipping).toHaveBeenCalledWith('user-123');
      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
    });

    it('이미 사용한 경우 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockUseFreeShipping.mockResolvedValue({
        success: false,
        error: '이번 달 무료 배송을 이미 사용했습니다.',
      });

      const response = await POST();

      expect(response.status).toBe(400);
      expect(response._data.success).toBe(false);
    });

    it('앰버서더가 아닌 경우 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockUseFreeShipping.mockResolvedValue({
        success: false,
        error: '앰버서더만 이용 가능합니다.',
      });

      const response = await POST();

      expect(response.status).toBe(400);
      expect(response._data.success).toBe(false);
    });

    it('인증된 사용자만 본인의 혜택을 사용해야 함 (BOLA 방지)', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockUseFreeShipping.mockResolvedValue({ success: true });

      await POST();

      // 본인 ID로만 사용
      expect(mockUseFreeShipping).toHaveBeenCalledWith('user-123');
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({
        success: false,
        response: {
          status: 401,
          _data: { success: false, error: '로그인이 필요합니다.' },
        },
      });

      const response = await POST();

      expect(response.status).toBe(401);
    });

    it('Rate Limit(orders)을 적용해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockUseFreeShipping.mockResolvedValue({ success: true });

      await POST();

      expect(mockWithRateLimit).toHaveBeenCalledWith('orders', 'user-123');
    });
  });
});
