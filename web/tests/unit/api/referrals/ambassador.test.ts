/**
 * Referrals Ambassador API Tests
 * Tests for app/api/referrals/ambassador/route.ts
 *
 * Requirements covered: 5.7 (앰버서더 상태 조회)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockGetUser, mockGetOrCreateAmbassadorStatus, mockCheckFreeShippingAvailable } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetOrCreateAmbassadorStatus: vi.fn(),
  mockCheckFreeShippingAvailable: vi.fn(),
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

// Mock ambassador service
vi.mock('@/lib/services/ambassador.service', () => ({
  getOrCreateAmbassadorStatus: (...args: unknown[]) => mockGetOrCreateAmbassadorStatus(...args),
  checkFreeShippingAvailable: (...args: unknown[]) => mockCheckFreeShippingAvailable(...args),
}));

// Mock constants
vi.mock('@/constants/referral', () => ({
  AMBASSADOR_CONFIG: {
    requiredReferrals: 10,
    benefits: {
      newProductEarlyAccess: true,
      monthlyFreeShipping: 1,
    },
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

import { GET } from '@/app/api/referrals/ambassador/route';

describe('Referrals Ambassador API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  // 앰버서더 활성 상태
  const activeAmbassador = {
    status: 'ACTIVE',
    totalReferrals: 15,
    qualifiedAt: new Date('2024-06-01'),
  };

  // 앰버서더 후보 상태
  const candidateAmbassador = {
    status: 'CANDIDATE',
    totalReferrals: 5,
    qualifiedAt: null,
  };

  // 무료 배송 가능
  const freeShippingAvailable = {
    available: true,
    nextAvailableAt: null,
  };

  // 무료 배송 불가 (이미 사용)
  const freeShippingUsed = {
    available: false,
    nextAvailableAt: new Date('2024-02-01'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/referrals/ambassador', () => {
    it('앰버서더 활성 상태를 올바르게 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockResolvedValue(activeAmbassador);
      mockCheckFreeShippingAvailable.mockResolvedValue(freeShippingAvailable);

      const response = await GET();

      expect(mockGetOrCreateAmbassadorStatus).toHaveBeenCalledWith('user-123');
      expect(mockCheckFreeShippingAvailable).toHaveBeenCalledWith('user-123');
      expect(response.status).toBe(200);
      expect(response._data.isAmbassador).toBe(true);
      expect(response._data.status).toBe('ACTIVE');
      expect(response._data.totalReferrals).toBe(15);
      expect(response._data.remainingForQualification).toBe(0);
      expect(response._data.qualifiedAt).toBe('2024-06-01T00:00:00.000Z');
    });

    it('앰버서더 활성 상태일 때 혜택이 활성화되어야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockResolvedValue(activeAmbassador);
      mockCheckFreeShippingAvailable.mockResolvedValue(freeShippingAvailable);

      const response = await GET();

      expect(response._data.benefits.newProductEarlyAccess).toBe(true);
      expect(response._data.benefits.monthlyFreeShipping).toBe(1);
      expect(response._data.benefits.freeShippingAvailable).toBe(true);
      expect(response._data.benefits.nextFreeShippingAt).toBeUndefined();
    });

    it('앰버서더 후보 상태(자격 미달)를 올바르게 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockResolvedValue(candidateAmbassador);
      mockCheckFreeShippingAvailable.mockResolvedValue(freeShippingAvailable);

      const response = await GET();

      expect(response.status).toBe(200);
      expect(response._data.isAmbassador).toBe(false);
      expect(response._data.status).toBe('CANDIDATE');
      expect(response._data.totalReferrals).toBe(5);
      expect(response._data.remainingForQualification).toBe(5); // 10 - 5 = 5
      expect(response._data.qualifiedAt).toBeUndefined();
    });

    it('앰버서더 후보 상태일 때 혜택이 비활성화되어야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockResolvedValue(candidateAmbassador);
      mockCheckFreeShippingAvailable.mockResolvedValue(freeShippingAvailable);

      const response = await GET();

      expect(response._data.benefits.newProductEarlyAccess).toBe(false);
      expect(response._data.benefits.monthlyFreeShipping).toBe(0);
    });

    it('무료 배송 불가 상태(이미 사용)를 올바르게 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockResolvedValue(activeAmbassador);
      mockCheckFreeShippingAvailable.mockResolvedValue(freeShippingUsed);

      const response = await GET();

      expect(response.status).toBe(200);
      expect(response._data.benefits.freeShippingAvailable).toBe(false);
      expect(response._data.benefits.nextFreeShippingAt).toBe('2024-02-01T00:00:00.000Z');
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const response = await GET();

      expect(response.status).toBe(401);
      expect(response._data.error).toBe('Unauthorized');
      expect(mockGetOrCreateAmbassadorStatus).not.toHaveBeenCalled();
      expect(mockCheckFreeShippingAvailable).not.toHaveBeenCalled();
    });

    it('getOrCreateAmbassadorStatus 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockRejectedValue(new Error('DB error'));

      const response = await GET();

      expect(response.status).toBe(500);
      expect(response._data.error).toBe('Internal server error');
    });

    it('checkFreeShippingAvailable 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockResolvedValue(activeAmbassador);
      mockCheckFreeShippingAvailable.mockRejectedValue(new Error('DB error'));

      const response = await GET();

      expect(response.status).toBe(500);
      expect(response._data.error).toBe('Internal server error');
    });

    it('추천 수가 10명 이상이면 remainingForQualification이 0이어야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockResolvedValue({
        status: 'ACTIVE',
        totalReferrals: 25,
        qualifiedAt: new Date('2024-06-01'),
      });
      mockCheckFreeShippingAvailable.mockResolvedValue(freeShippingAvailable);

      const response = await GET();

      expect(response._data.remainingForQualification).toBe(0);
    });

    it('추천 수가 0명이면 remainingForQualification이 10이어야 함', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockGetOrCreateAmbassadorStatus.mockResolvedValue({
        status: 'CANDIDATE',
        totalReferrals: 0,
        qualifiedAt: null,
      });
      mockCheckFreeShippingAvailable.mockResolvedValue(freeShippingAvailable);

      const response = await GET();

      expect(response._data.remainingForQualification).toBe(10);
    });
  });
});
