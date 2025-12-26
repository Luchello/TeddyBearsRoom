/**
 * Auth Helper Tests
 * Tests for lib/api/auth.ts
 *
 * Requirements covered: C1 (Authentication), C5 (Response Format)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock NextResponse before imports
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
const mockGetUser = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: mockGetUser,
    },
  })),
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

import { requireAuth, optionalAuth, apiError, apiSuccess } from '@/lib/api/auth';

describe('Auth Helper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('인증된 사용자에 대해 success: true와 user 객체를 반환해야 함', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        aud: 'authenticated',
      };

      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await requireAuth();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.user).toEqual(mockUser);
        expect(result.user.id).toBe('user-123');
        expect(result.user.email).toBe('test@example.com');
      }
    });

    it('미인증 사용자에 대해 success: false와 401 응답을 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await requireAuth();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(401);
        const data = result.response._data as { error: string; code: string };
        expect(data.error).toBe('로그인이 필요합니다.');
        expect(data.code).toBe('UNAUTHORIZED');
      }
    });

    it('Supabase 에러 시 success: false와 401 응답을 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      });

      const result = await requireAuth();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(401);
      }
    });

    it('예외 발생 시 success: false와 500 응답을 반환해야 함', async () => {
      mockGetUser.mockRejectedValue(new Error('Connection failed'));

      const result = await requireAuth();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(500);
        const data = result.response._data as { code: string };
        expect(data.code).toBe('AUTH_ERROR');
      }
    });
  });

  describe('optionalAuth', () => {
    it('인증된 사용자에 대해 user 객체를 반환해야 함', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const user = await optionalAuth();

      expect(user).toEqual(mockUser);
    });

    it('미인증 사용자에 대해 null을 반환해야 함', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const user = await optionalAuth();

      expect(user).toBeNull();
    });

    it('에러 발생 시 null을 반환해야 함 (에러 throw 안함)', async () => {
      mockGetUser.mockRejectedValue(new Error('Connection failed'));

      const user = await optionalAuth();

      expect(user).toBeNull();
    });
  });

  describe('apiError', () => {
    it('기본 500 상태 코드로 에러 응답을 생성해야 함', () => {
      const response = apiError('서버 오류가 발생했습니다.');

      expect(response.status).toBe(500);
      const data = response._data as { success: boolean; error: string };
      expect(data.success).toBe(false);
      expect(data.error).toBe('서버 오류가 발생했습니다.');
    });

    it('지정된 상태 코드로 에러 응답을 생성해야 함', () => {
      const response = apiError('잘못된 요청입니다.', 400);

      expect(response.status).toBe(400);
    });

    it('에러 코드가 있으면 응답에 포함해야 함', () => {
      const response = apiError('리소스를 찾을 수 없습니다.', 404, 'NOT_FOUND');

      expect(response.status).toBe(404);
      const data = response._data as { code: string };
      expect(data.code).toBe('NOT_FOUND');
    });

    it('에러 코드가 없으면 응답에 code 필드가 없어야 함', () => {
      const response = apiError('에러 발생');

      const data = response._data as { code?: string };
      expect(data.code).toBeUndefined();
    });
  });

  describe('apiSuccess', () => {
    it('기본 200 상태 코드로 성공 응답을 생성해야 함', () => {
      const testData = { id: 1, name: 'Test' };
      const response = apiSuccess(testData);

      expect(response.status).toBe(200);
      const data = response._data as { success: boolean; data: typeof testData };
      expect(data.success).toBe(true);
      expect(data.data).toEqual(testData);
    });

    it('지정된 상태 코드로 성공 응답을 생성해야 함', () => {
      const testData = { created: true };
      const response = apiSuccess(testData, 201);

      expect(response.status).toBe(201);
    });

    it('다양한 데이터 타입을 래핑할 수 있어야 함', () => {
      // Array
      const arrayResponse = apiSuccess([1, 2, 3]);
      expect((arrayResponse._data as { data: number[] }).data).toEqual([1, 2, 3]);

      // String
      const stringResponse = apiSuccess('Hello');
      expect((stringResponse._data as { data: string }).data).toBe('Hello');

      // Null
      const nullResponse = apiSuccess(null);
      expect((nullResponse._data as { data: null }).data).toBeNull();
    });
  });
});
