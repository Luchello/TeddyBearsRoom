/**
 * Referrals Stats API Tests
 * Tests for app/api/referrals/stats/route.ts
 *
 * Requirements covered: 5.3 (추천 현황 조회)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockGetUser, mockGetReferralStats, mockCheckAmbassadorStatus } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetReferralStats: vi.fn(),
  mockCheckAmbassadorStatus: vi.fn(),
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
  getReferralStats: mockGetReferralStats,
  checkAmbassadorStatus: mockCheckAmbassadorStatus,
}));

// Mock constants
vi.mock('@/constants/referral', () => ({
  REFERRAL_MILESTONES: [
    { months: 3, points: 500, name: '3개월' },
    { months: 6, points: 1000, name: '6개월' },
    { months: 12, points: 2000, name: '12개월' },
  ],
  AMBASSADOR_CONFIG: {
    requiredReferrals: 10,
    benefits: ['무료배송', '추가할인'],
  },
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

import { GET } from '@/app/api/referrals/stats/route';

describe('Referrals Stats API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockStats = {
    totalReferrals: 5,
    activeReferrals: 3,
    completedReferrals: 2,
    totalPointsEarned: 2500,
    unclaimedPoints: 500,
    referrals: [],
  };

  const mockAmbassador = {
    isAmbassador: false,
    referralsUntilAmbassador: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/referrals/stats', () => {
    it('인증된 사용자에게 추천 현황과 앰버서더 상태를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetReferralStats.mockResolvedValue(mockStats);
      mockCheckAmbassadorStatus.mockResolvedValue(mockAmbassador);

      const response = await GET();

      expect(mockGetReferralStats).toHaveBeenCalledWith('user-123');
      expect(mockCheckAmbassadorStatus).toHaveBeenCalledWith('user-123');
      expect(response.status).toBe(200);
      expect(response._data.totalReferrals).toBe(5);
      expect(response._data.ambassador).toEqual(mockAmbassador);
    });

    it('마일스톤 설정과 앰버서더 설정을 포함해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetReferralStats.mockResolvedValue(mockStats);
      mockCheckAmbassadorStatus.mockResolvedValue(mockAmbassador);

      const response = await GET();

      expect(response._data.milestoneConfig).toBeDefined();
      expect(response._data.milestoneConfig.length).toBe(3);
      expect(response._data.ambassadorConfig.requiredReferrals).toBe(10);
    });

    it('getReferralStats와 checkAmbassadorStatus를 병렬로 호출해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const statsPromise = new Promise((resolve) => {
        setTimeout(() => resolve(mockStats), 100);
      });
      const ambassadorPromise = new Promise((resolve) => {
        setTimeout(() => resolve(mockAmbassador), 100);
      });

      mockGetReferralStats.mockReturnValue(statsPromise);
      mockCheckAmbassadorStatus.mockReturnValue(ambassadorPromise);

      const start = Date.now();
      await GET();
      const duration = Date.now() - start;

      // 병렬 호출이면 100ms + alpha, 순차 호출이면 200ms 이상
      expect(duration).toBeLessThan(200);
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const response = await GET();

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
    });

    it('서비스 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetReferralStats.mockRejectedValue(new Error('DB error'));

      const response = await GET();

      expect(response.status).toBe(500);
      expect(response._data.error).toBe('Internal server error');
    });
  });
});
