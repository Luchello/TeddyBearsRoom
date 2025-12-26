/**
 * Referrals Milestones Check API Tests
 * Tests for app/api/referrals/milestones/check/route.ts
 *
 * Requirements covered: 5.6 (POST /api/referrals/milestones/check)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockCheckAllMilestones } = vi.hoisted(() => ({
  mockCheckAllMilestones: vi.fn(),
}));

// Mock NextResponse
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>();
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data: unknown, init?: { status?: number }) => ({
        json: () => Promise.resolve(data),
        status: init?.status || 200,
        _data: data,
      })),
    },
  };
});

// Mock referral service
vi.mock('@/lib/services/referral.service', () => ({
  checkAllMilestones: () => mockCheckAllMilestones(),
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

// Import route handler AFTER mocks
import { POST } from '@/app/api/referrals/milestones/check/route';

describe('Referrals Milestones Check API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, CRON_SECRET: 'test-secret' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('POST /api/referrals/milestones/check', () => {
    it('유효한 CRON_SECRET으로 마일스톤 체크 성공해야 함', async () => {
      mockCheckAllMilestones.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/referrals/milestones/check', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-secret',
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.message).toBe('Milestone check completed');
      expect(response._data.duration).toBeDefined();
      expect(response._data.duration).toMatch(/\d+ms/);
    });

    it('잘못된 CRON_SECRET은 401 Unauthorized를 반환해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/referrals/milestones/check', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer wrong-secret',
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
    });

    it('Authorization 헤더가 없으면 401 Unauthorized를 반환해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/referrals/milestones/check', {
        method: 'POST',
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
    });

    it('Bearer 없이 토큰만 전달하면 401 Unauthorized를 반환해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/referrals/milestones/check', {
        method: 'POST',
        headers: {
          Authorization: 'test-secret',
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
    });

    it('CRON_SECRET 환경변수가 없으면 500 에러를 반환해야 함', async () => {
      delete process.env.CRON_SECRET;

      const request = new NextRequest('http://localhost:3000/api/referrals/milestones/check', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-secret',
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(response._data.error).toBe('Server configuration error');
    });

    it('checkAllMilestones 함수를 호출해야 함', async () => {
      mockCheckAllMilestones.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/referrals/milestones/check', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-secret',
        },
      });

      await POST(request);

      expect(mockCheckAllMilestones).toHaveBeenCalledTimes(1);
    });

    it('checkAllMilestones 서비스 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockCheckAllMilestones.mockRejectedValue(new Error('DB connection error'));

      const request = new NextRequest('http://localhost:3000/api/referrals/milestones/check', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-secret',
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(response._data.success).toBe(false);
      expect(response._data.error).toBe('Internal server error');
    });

    it('응답에 duration 필드가 ms 형식으로 포함되어야 함', async () => {
      mockCheckAllMilestones.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/referrals/milestones/check', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-secret',
        },
      });

      const response = await POST(request);

      expect(response._data.duration).toBeDefined();
      expect(typeof response._data.duration).toBe('string');
      expect(response._data.duration).toMatch(/^\d+ms$/);
    });
  });
});
