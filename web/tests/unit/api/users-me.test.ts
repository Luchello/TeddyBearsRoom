/**
 * Users/Me API Tests
 * Tests for app/api/users/me/route.ts
 *
 * Requirements covered: 2.1 (프로필 조회), 2.2 (프로필 수정), C4 (보안)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockRequireAuth, mockPrismaProfile, mockPrismaOrder, mockPrismaWishlistItem } = vi.hoisted(() => ({
  mockRequireAuth: vi.fn(),
  mockPrismaProfile: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  mockPrismaOrder: {
    aggregate: vi.fn(),
    findMany: vi.fn(),
  },
  mockPrismaWishlistItem: {
    count: vi.fn(),
  },
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

// Mock auth helper
vi.mock('@/lib/api/auth', () => ({
  requireAuth: () => mockRequireAuth(),
  apiError: (message: string, status: number = 500, code?: string) => ({
    json: () => Promise.resolve({ success: false, error: message, code }),
    status,
    _data: { success: false, error: message, code },
  }),
  apiSuccess: (data: unknown, status: number = 200) => ({
    json: () => Promise.resolve({ success: true, data }),
    status,
    _data: { success: true, data },
  }),
}));

// Mock rate limit
vi.mock('@/lib/api/rate-limit', () => ({
  withRateLimit: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    profile: mockPrismaProfile,
    order: mockPrismaOrder,
    wishlistItem: mockPrismaWishlistItem,
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

import { GET, PATCH } from '@/app/api/users/me/route';

describe('Users/Me API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' },
  };

  const mockProfile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
    subscriptionTier: 'NONE',
    points: 0,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/users/me', () => {
    // GET 테스트용 기본 mock 설정 헬퍼
    const setupGetMocks = () => {
      mockPrismaOrder.aggregate.mockResolvedValue({
        _count: 5,
        _sum: { totalPrice: 100000 },
      });
      mockPrismaWishlistItem.count.mockResolvedValue(3);
      mockPrismaOrder.findMany.mockResolvedValue([]);
    };

    it('기존 프로필이 있으면 200 OK와 프로필 데이터를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.findUnique.mockResolvedValue(mockProfile);
      setupGetMocks();

      const response = await GET();

      expect(mockPrismaProfile.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.data.id).toBe('user-123');
      expect(response._data.data.email).toBe('test@example.com');
    });

    it('프로필이 없으면 자동 생성 후 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.findUnique.mockResolvedValue(null);
      mockPrismaProfile.create.mockResolvedValue(mockProfile);
      setupGetMocks();

      const response = await GET();

      expect(mockPrismaProfile.create).toHaveBeenCalledWith({
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      expect(response.status).toBe(200);
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({
        success: false,
        response: {
          status: 401,
          _data: { success: false, error: '로그인이 필요합니다.' },
        },
      });

      const response = await GET();

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/users/me', () => {
    it('유효한 이름으로 프로필을 수정해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.update.mockResolvedValue({
        ...mockProfile,
        name: '새로운이름',
      });

      const request = new Request('http://localhost:3000/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ name: '새로운이름' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(mockPrismaProfile.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { name: '새로운이름' },
      });
      expect(response.status).toBe(200);
    });

    it('허용된 호스트의 아바타 URL로 프로필을 수정해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.update.mockResolvedValue({
        ...mockProfile,
        avatar: 'https://images.unsplash.com/photo.jpg',
      });

      const request = new Request('http://localhost:3000/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ avatar: 'https://images.unsplash.com/photo.jpg' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
    });

    it('비허용 호스트의 아바타 URL은 SSRF 방지로 거부해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ avatar: 'https://evil.com/image.jpg' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('허용되지 않은');
    });

    it('HTML 태그가 포함된 이름은 XSS 방지로 거부해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ name: '<script>alert(1)</script>' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('특수문자');
    });

    it('빈 요청은 수정할 필드 없음 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('수정할 필드가 없습니다');
    });

    it('잘못된 JSON 형식은 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me', {
        method: 'PATCH',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('JSON');
    });
  });
});
