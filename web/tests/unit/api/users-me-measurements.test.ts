/**
 * Users/Me/Measurements API Tests
 * Tests for app/api/users/me/measurements/route.ts
 *
 * Requirements covered: 2.3 (측정 정보 조회), 2.4 (측정 정보 수정), 2.5 (측정 정보 삭제)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockRequireAuth, mockPrismaProfile } = vi.hoisted(() => ({
  mockRequireAuth: vi.fn(),
  mockPrismaProfile: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
    update: vi.fn(),
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

import { GET, PATCH, DELETE } from '@/app/api/users/me/measurements/route';

describe('Users/Me/Measurements API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' },
  };

  const mockMeasurements = {
    height: 175,
    weight: 70,
    gender: 'MALE',
    topSize: 'L',
    bottomSize: 'M',
    shoeSize: 270,
    encryptedMeasurements: 'SGVsbG8gV29ybGQ=',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/users/me/measurements', () => {
    it('측정 정보가 있으면 200 OK와 측정 데이터를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.findUnique.mockResolvedValue(mockMeasurements);

      const response = await GET();

      expect(mockPrismaProfile.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: {
          height: true,
          weight: true,
          gender: true,
          topSize: true,
          bottomSize: true,
          shoeSize: true,
          encryptedMeasurements: true,
        },
      });
      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.data.height).toBe(175);
      expect(response._data.data.weight).toBe(70);
      expect(response._data.data.gender).toBe('MALE');
      expect(response._data.data.topSize).toBe('L');
      expect(response._data.data.bottomSize).toBe('M');
      expect(response._data.data.shoeSize).toBe(270);
    });

    it('프로필이 없으면 404 Not Found를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.findUnique.mockResolvedValue(null);

      const response = await GET();

      expect(response.status).toBe(404);
      expect(response._data.success).toBe(false);
      expect(response._data.error).toBe('프로필을 찾을 수 없습니다.');
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

  describe('PATCH /api/users/me/measurements', () => {
    it('유효한 데이터로 측정 정보를 수정해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.upsert.mockResolvedValue({
        ...mockMeasurements,
        height: 180,
        weight: 75,
      });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: 180, weight: 75 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(mockPrismaProfile.upsert).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.data.height).toBe(180);
      expect(response._data.data.weight).toBe(75);
    });

    it('키가 100cm 미만이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: 50 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('100cm 이상');
    });

    it('키가 250cm 초과이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: 300 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('250cm 이하');
    });

    it('신발 사이즈가 200mm 미만이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ shoeSize: 150 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('200mm 이상');
    });

    it('신발 사이즈가 320mm 초과이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ shoeSize: 400 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('320mm 이하');
    });

    it('몸무게가 30kg 미만이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ weight: 20 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('30kg 이상');
    });

    it('몸무게가 200kg 초과이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ weight: 250 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('200kg 이하');
    });

    it('잘못된 성별 값이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ gender: 'INVALID' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
    });

    it('유효한 성별 값으로 수정해야 함 (MALE)', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.upsert.mockResolvedValue({
        ...mockMeasurements,
        gender: 'MALE',
      });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ gender: 'MALE' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(response._data.data.gender).toBe('MALE');
    });

    it('유효한 성별 값으로 수정해야 함 (FEMALE)', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.upsert.mockResolvedValue({
        ...mockMeasurements,
        gender: 'FEMALE',
      });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ gender: 'FEMALE' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(response._data.data.gender).toBe('FEMALE');
    });

    it('유효한 성별 값으로 수정해야 함 (OTHER)', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.upsert.mockResolvedValue({
        ...mockMeasurements,
        gender: 'OTHER',
      });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ gender: 'OTHER' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(response._data.data.gender).toBe('OTHER');
    });

    it('잘못된 상의 사이즈 값이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ topSize: 'INVALID' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
    });

    it('잘못된 하의 사이즈 값이면 400 Bad Request를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ bottomSize: 'INVALID' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
    });

    it('유효한 의류 사이즈로 수정해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.upsert.mockResolvedValue({
        ...mockMeasurements,
        topSize: 'XL',
        bottomSize: 'L',
      });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ topSize: 'XL', bottomSize: 'L' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(response._data.data.topSize).toBe('XL');
      expect(response._data.data.bottomSize).toBe('L');
    });

    it('잘못된 JSON 형식은 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('JSON');
    });

    it('정의되지 않은 필드가 포함되면 400 에러를 반환해야 함 (strict 모드)', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: 175, unknownField: 'value' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({
        success: false,
        response: {
          status: 401,
          _data: { success: false, error: '로그인이 필요합니다.' },
        },
      });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: 175 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(401);
    });

    it('null 값으로 측정 정보를 초기화할 수 있어야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.upsert.mockResolvedValue({
        height: null,
        weight: null,
        gender: null,
        topSize: null,
        bottomSize: null,
        shoeSize: null,
        encryptedMeasurements: null,
      });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ height: null, weight: null }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(response._data.data.height).toBe(null);
      expect(response._data.data.weight).toBe(null);
    });

    it('암호화된 측정 정보는 유효한 Base64만 허용해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ encryptedMeasurements: 'invalid!@#base64' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
    });

    it('유효한 Base64 암호화 데이터를 수정할 수 있어야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.upsert.mockResolvedValue({
        ...mockMeasurements,
        encryptedMeasurements: 'SGVsbG9Xb3JsZA==',
      });

      const request = new Request('http://localhost:3000/api/users/me/measurements', {
        method: 'PATCH',
        body: JSON.stringify({ encryptedMeasurements: 'SGVsbG9Xb3JsZA==' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(response._data.data.encryptedMeasurements).toBe('SGVsbG9Xb3JsZA==');
    });
  });

  describe('DELETE /api/users/me/measurements', () => {
    it('측정 정보가 있으면 200 OK와 삭제 메시지를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProfile.update.mockResolvedValue({
        height: null,
        weight: null,
        gender: null,
        topSize: null,
        bottomSize: null,
        shoeSize: null,
        encryptedMeasurements: null,
      });

      const response = await DELETE();

      expect(mockPrismaProfile.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          height: null,
          weight: null,
          gender: null,
          topSize: null,
          bottomSize: null,
          shoeSize: null,
          encryptedMeasurements: null,
        },
      });
      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.message).toBe('사이즈 정보가 삭제되었습니다.');
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({
        success: false,
        response: {
          status: 401,
          _data: { success: false, error: '로그인이 필요합니다.' },
        },
      });

      const response = await DELETE();

      expect(response.status).toBe(401);
    });
  });
});
