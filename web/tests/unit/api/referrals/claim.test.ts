/**
 * Referrals Claim API Tests
 * Tests for app/api/referrals/claim/route.ts
 *
 * Requirements covered: 5.4 (마일스톤 보상 수령)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockGetUser, mockClaimMilestoneReward } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockClaimMilestoneReward: vi.fn(),
}));

// Mock NextResponse and NextRequest
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      _data: data,
    })),
  },
  NextRequest: class NextRequest extends Request {
    constructor(input: string | URL, init?: RequestInit) {
      super(input, init);
    }
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
  claimMilestoneReward: mockClaimMilestoneReward,
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

import { POST } from '@/app/api/referrals/claim/route';
import { NextRequest } from 'next/server';

describe('Referrals Claim API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/referrals/claim', () => {
    it('유효한 rewardId로 보상 수령 성공해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockClaimMilestoneReward.mockResolvedValue({
        success: true,
        points: 500,
        message: '500 포인트가 지급되었습니다.',
      });

      const request = new NextRequest('http://localhost:3000/api/referrals/claim', {
        method: 'POST',
        body: JSON.stringify({ rewardId: 'reward-123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(mockClaimMilestoneReward).toHaveBeenCalledWith('reward-123', 'user-123');
      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.points).toBe(500);
    });

    it('이미 수령한 보상은 400 에러를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockClaimMilestoneReward.mockResolvedValue({
        success: false,
        error: '이미 수령한 보상입니다.',
      });

      const request = new NextRequest('http://localhost:3000/api/referrals/claim', {
        method: 'POST',
        body: JSON.stringify({ rewardId: 'reward-123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.success).toBe(false);
    });

    it('rewardId가 없으면 400 에러를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const request = new NextRequest('http://localhost:3000/api/referrals/claim', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('보상 ID가 필요합니다');
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const request = new NextRequest('http://localhost:3000/api/referrals/claim', {
        method: 'POST',
        body: JSON.stringify({ rewardId: 'reward-123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
    });

    it('타인의 보상 수령 시도는 실패해야 함 (권한 검증)', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockClaimMilestoneReward.mockResolvedValue({
        success: false,
        error: '권한이 없습니다.',
      });

      const request = new NextRequest('http://localhost:3000/api/referrals/claim', {
        method: 'POST',
        body: JSON.stringify({ rewardId: 'other-user-reward' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.success).toBe(false);
    });

    it('서비스 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockClaimMilestoneReward.mockRejectedValue(new Error('DB error'));

      const request = new NextRequest('http://localhost:3000/api/referrals/claim', {
        method: 'POST',
        body: JSON.stringify({ rewardId: 'reward-123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(response._data.error).toContain('서버 오류');
    });
  });
});
