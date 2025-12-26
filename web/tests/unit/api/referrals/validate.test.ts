/**
 * Referrals Validate API Tests
 * Tests for app/api/referrals/validate/route.ts
 *
 * Requirements covered: 5.2 (추천 코드 검증), C2 (Rate Limiting)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockWithRateLimit, mockValidateReferralCode } = vi.hoisted(() => ({
  mockWithRateLimit: vi.fn(),
  mockValidateReferralCode: vi.fn(),
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

// Mock rate limit
vi.mock('@/lib/api/rate-limit', () => ({
  withRateLimit: mockWithRateLimit,
}));

// Mock referral service
vi.mock('@/lib/services/referral.service', () => ({
  validateReferralCode: mockValidateReferralCode,
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

import { POST } from '@/app/api/referrals/validate/route';
import { NextRequest } from 'next/server';

describe('Referrals Validate API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWithRateLimit.mockResolvedValue({ success: true });
  });

  describe('POST /api/referrals/validate', () => {
    it('유효한 추천 코드에 대해 valid: true를 반환해야 함', async () => {
      mockValidateReferralCode.mockResolvedValue({ valid: true });

      const request = new NextRequest('http://localhost:3000/api/referrals/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'VALID123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(mockValidateReferralCode).toHaveBeenCalledWith('VALID123');
      expect(response.status).toBe(200);
      expect(response._data.valid).toBe(true);
    });

    it('존재하지 않는 추천 코드에 대해 valid: false를 반환해야 함', async () => {
      mockValidateReferralCode.mockResolvedValue({
        valid: false,
        error: '존재하지 않는 코드입니다',
      });

      const request = new NextRequest('http://localhost:3000/api/referrals/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'INVALID' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response._data.valid).toBe(false);
    });

    it('code 파라미터가 없으면 400 에러를 반환해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/referrals/validate', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('추천 코드를 입력');
    });

    it('코드 길이가 4자 미만이면 400 에러를 반환해야 함 (Brute Force 방지)', async () => {
      const request = new NextRequest('http://localhost:3000/api/referrals/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'ABC' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('유효하지 않은');
    });

    it('코드 길이가 20자 초과하면 400 에러를 반환해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/referrals/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'A'.repeat(21) }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('유효하지 않은');
    });

    it('Rate Limit 초과 시 429 응답을 반환해야 함', async () => {
      mockWithRateLimit.mockResolvedValue({
        success: false,
        response: {
          status: 429,
          _data: { error: '요청이 너무 많습니다.' },
        },
      });

      const request = new NextRequest('http://localhost:3000/api/referrals/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'VALID123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(mockWithRateLimit).toHaveBeenCalledWith('auth');
      expect(response.status).toBe(429);
    });

    it('서비스 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockValidateReferralCode.mockRejectedValue(new Error('DB error'));

      const request = new NextRequest('http://localhost:3000/api/referrals/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'VALID123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(response._data.error).toContain('서버 오류');
    });
  });
});
