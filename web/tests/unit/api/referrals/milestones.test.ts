/**
 * Referrals Milestones API Tests
 * Tests for app/api/referrals/milestones/route.ts
 *
 * Requirements covered: 5.5 (마일스톤 조회)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockGetUser, mockGetReferralStats } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetReferralStats: vi.fn(),
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
}));

// Mock constants
vi.mock('@/constants/referral', () => ({
  REFERRAL_MILESTONES: [
    { months: 3, points: 500, name: '3개월' },
    { months: 6, points: 1000, name: '6개월' },
    { months: 12, points: 2000, name: '12개월' },
  ],
  MAX_POINTS_PER_REFERRAL: 3500,
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

import { GET } from '@/app/api/referrals/milestones/route';

describe('Referrals Milestones API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockStats = {
    totalReferrals: 3,
    activeReferrals: 2,
    completedReferrals: 1,
    totalPointsEarned: 1500,
    unclaimedPoints: 500,
    referrals: [
      {
        id: 'ref-1',
        referee: { name: '홍길동', joinedAt: new Date('2024-01-01') },
        status: 'ACTIVE',
        subscriptionStartedAt: new Date('2024-01-15'),
        milestones: [
          { months: 3, claimed: true, achievedAt: new Date('2024-04-15'), claimedAt: new Date('2024-04-16') },
        ],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/referrals/milestones', () => {
    it('인증된 사용자에게 마일스톤 현황을 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetReferralStats.mockResolvedValue(mockStats);

      const response = await GET();

      expect(mockGetReferralStats).toHaveBeenCalledWith('user-123');
      expect(response.status).toBe(200);
      expect(response._data.totalReferrals).toBe(3);
      expect(response._data.maxPointsPerReferral).toBe(3500);
    });

    it('referrals 배열에 마일스톤 상태(pending/achieved/claimed)를 포함해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetReferralStats.mockResolvedValue(mockStats);

      const response = await GET();

      const referral = response._data.referrals[0];
      expect(referral.milestones).toHaveLength(3); // 3, 6, 12개월
      expect(referral.milestones[0].status).toBe('claimed'); // 3개월 - 이미 수령
      expect(referral.milestones[1].status).toBe('pending'); // 6개월 - 미달성
      expect(referral.milestones[2].status).toBe('pending'); // 12개월 - 미달성
    });

    it('구독 시작일로부터 경과 개월수를 계산해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetReferralStats.mockResolvedValue(mockStats);

      const response = await GET();

      const referral = response._data.referrals[0];
      expect(referral.monthsSubscribed).toBeDefined();
      expect(typeof referral.monthsSubscribed).toBe('number');
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
