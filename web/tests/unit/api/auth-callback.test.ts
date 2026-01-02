/**
 * OAuth Callback API Tests
 * Tests for app/api/auth/callback/route.ts
 *
 * Requirements covered: 1.1 (OAuth 콜백 처리)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url: string) => ({
      type: 'redirect',
      url,
      headers: new Map(),
    })),
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      _data: data,
    })),
  },
}));

// Mock Supabase client
const mockExchangeCodeForSession = vi.fn();
const mockGetUser = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
      getUser: mockGetUser,
    },
  })),
}));

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      upsert: vi.fn(() => Promise.resolve({})),
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

import { GET } from '@/app/api/auth/callback/route';

describe('OAuth Callback API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/auth/callback', () => {
    it('유효한 code로 세션 교환 성공 시 next 경로로 리다이렉트해야 함', async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' },
          },
        },
        error: null,
      });

      const request = new Request('http://localhost:3000/api/auth/callback?code=valid_code&next=/dashboard');

      await GET(request);

      expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid_code');
      expect(NextResponse.redirect).toHaveBeenCalled();

      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0][0];
      expect(redirectCall).toContain('/dashboard');
    });

    it('next 파라미터가 없으면 루트(/)로 리다이렉트해야 함', async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {},
          },
        },
        error: null,
      });

      const request = new Request('http://localhost:3000/api/auth/callback?code=valid_code');

      await GET(request);

      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0][0];
      expect(redirectCall).toMatch(/\/$/);
    });

    it('code 파라미터가 없으면 /auth-code-error?error=no_code로 리다이렉트해야 함', async () => {
      const request = new Request('http://localhost:3000/api/auth/callback');

      await GET(request);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0][0];
      expect(redirectCall).toContain('/auth-code-error');
      expect(redirectCall).toContain('error=no_code');
    });

    it('OAuth 에러 파라미터가 있으면 /auth-code-error로 리다이렉트해야 함', async () => {
      const request = new Request('http://localhost:3000/api/auth/callback?error=access_denied&error_description=User%20denied');

      await GET(request);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0][0];
      expect(redirectCall).toContain('/auth-code-error');
      expect(redirectCall).toContain('error=access_denied');
    });

    it('Open Redirect 방지: 외부 URL은 루트(/)로 리다이렉트해야 함', async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {},
          },
        },
        error: null,
      });

      const request = new Request('http://localhost:3000/api/auth/callback?code=valid_code&next=https://evil.com');

      await GET(request);

      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0][0];
      // next가 외부 URL이면 '/'로 변경됨 (startsWith('/') 체크)
      expect(redirectCall).not.toContain('evil.com');
    });

    it('세션 교환 실패 시 /auth-code-error로 리다이렉트해야 함', async () => {
      mockExchangeCodeForSession.mockResolvedValue({
        error: { message: 'Invalid code' },
      });

      const request = new Request('http://localhost:3000/api/auth/callback?code=invalid_code');

      await GET(request);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0][0];
      expect(redirectCall).toContain('/auth-code-error');
      expect(redirectCall).toContain('error=session_exchange_failed');
    });
  });
});
