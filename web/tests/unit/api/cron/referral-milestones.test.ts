/**
 * Cron Referral Milestones API Tests
 * Tests for app/api/cron/referral-milestones/route.ts
 *
 * Requirements covered: 7.1 (Cron Job 보안), 7.2 (마일스톤 체크)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockCheckAllMilestones, mockUpdateAllAmbassadorStatuses } = vi.hoisted(() => ({
  mockCheckAllMilestones: vi.fn(),
  mockUpdateAllAmbassadorStatuses: vi.fn(),
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

// Mock referral service
vi.mock('@/lib/services/referral.service', () => ({
  checkAllMilestones: mockCheckAllMilestones,
  updateAllAmbassadorStatuses: mockUpdateAllAmbassadorStatuses,
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

import { GET } from '@/app/api/cron/referral-milestones/route';

describe('Cron Referral Milestones API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, CRON_SECRET: 'test-cron-secret' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GET /api/cron/referral-milestones', () => {
    it('유효한 CRON_SECRET으로 인증된 요청은 성공해야 함', async () => {
      mockCheckAllMilestones.mockResolvedValue(undefined);
      mockUpdateAllAmbassadorStatuses.mockResolvedValue({
        updated: 5,
        newAmbassadors: 2,
      });

      const request = new Request('http://localhost:3000/api/cron/referral-milestones', {
        headers: { authorization: 'Bearer test-cron-secret' },
      });

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.results.ambassadors.updated).toBe(5);
      expect(response._data.results.ambassadors.newAmbassadors).toBe(2);
    });

    it('잘못된 CRON_SECRET은 401 Unauthorized를 반환해야 함', async () => {
      const request = new Request('http://localhost:3000/api/cron/referral-milestones', {
        headers: { authorization: 'Bearer wrong-secret' },
      });

      const response = await GET(request);

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
    });

    it('Authorization 헤더가 없으면 401 Unauthorized를 반환해야 함', async () => {
      const request = new Request('http://localhost:3000/api/cron/referral-milestones');

      const response = await GET(request);

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
    });

    it('CRON_SECRET 환경변수가 없으면 500 에러를 반환해야 함', async () => {
      delete process.env.CRON_SECRET;

      const request = new Request('http://localhost:3000/api/cron/referral-milestones', {
        headers: { authorization: 'Bearer test-cron-secret' },
      });

      const response = await GET(request);

      expect(response.status).toBe(500);
      expect(response._data.error).toBe('Server configuration error');
    });

    it('checkAllMilestones와 updateAllAmbassadorStatuses를 순차 호출해야 함', async () => {
      mockCheckAllMilestones.mockResolvedValue(undefined);
      mockUpdateAllAmbassadorStatuses.mockResolvedValue({
        updated: 0,
        newAmbassadors: 0,
      });

      const request = new Request('http://localhost:3000/api/cron/referral-milestones', {
        headers: { authorization: 'Bearer test-cron-secret' },
      });

      await GET(request);

      expect(mockCheckAllMilestones).toHaveBeenCalled();
      expect(mockUpdateAllAmbassadorStatuses).toHaveBeenCalled();
    });

    it('응답에 timestamp와 duration을 포함해야 함', async () => {
      mockCheckAllMilestones.mockResolvedValue(undefined);
      mockUpdateAllAmbassadorStatuses.mockResolvedValue({
        updated: 0,
        newAmbassadors: 0,
      });

      const request = new Request('http://localhost:3000/api/cron/referral-milestones', {
        headers: { authorization: 'Bearer test-cron-secret' },
      });

      const response = await GET(request);

      expect(response._data.timestamp).toBeDefined();
      expect(response._data.duration).toBeDefined();
      expect(response._data.duration).toMatch(/\d+ms/);
    });

    it('서비스 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockCheckAllMilestones.mockRejectedValue(new Error('DB error'));

      const request = new Request('http://localhost:3000/api/cron/referral-milestones', {
        headers: { authorization: 'Bearer test-cron-secret' },
      });

      const response = await GET(request);

      expect(response.status).toBe(500);
      expect(response._data.error).toBe('Internal error');
      expect(response._data.timestamp).toBeDefined();
    });
  });
});
