/**
 * Referrals Code API Tests
 * Tests for app/api/referrals/code/route.ts
 *
 * Requirements covered: 5.1 (추천 코드 조회/생성)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockGetUser, mockEnsureReferralCode } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockEnsureReferralCode: vi.fn(),
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

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: mockGetUser,
      },
    })
  ),
}));

// Mock referral service
vi.mock('@/lib/services/referral.service', () => ({
  ensureReferralCode: mockEnsureReferralCode,
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

import { GET } from '@/app/api/referrals/code/route';

describe('Referrals Code API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/referrals/code', () => {
    it('인증된 사용자에게 추천 코드와 shareUrl을 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockEnsureReferralCode.mockResolvedValue('ABC123');

      const response = await GET();

      expect(mockEnsureReferralCode).toHaveBeenCalledWith('user-123');
      expect(response.status).toBe(200);
      expect(response._data.code).toBe('ABC123');
      expect(response._data.shareUrl).toContain('ref=ABC123');
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const response = await GET();

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
    });

    it('추천 코드가 없으면 새로 생성해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockEnsureReferralCode.mockResolvedValue('NEW456');

      const response = await GET();

      expect(mockEnsureReferralCode).toHaveBeenCalled();
      expect(response._data.code).toBe('NEW456');
    });

    it('서비스 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockEnsureReferralCode.mockRejectedValue(new Error('Service error'));

      const response = await GET();

      expect(response.status).toBe(500);
      expect(response._data.error).toBe('Internal server error');
    });
  });
});
