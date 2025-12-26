/**
 * Orders API Tests
 * Tests for app/api/orders/route.ts
 *
 * Requirements covered: 4.1 (주문 생성), 4.2 (주문 조회), C3 (Zod 검증)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockRequireAuth, mockPrismaOrder, mockPrismaProduct } = vi.hoisted(() => ({
  mockRequireAuth: vi.fn(),
  mockPrismaOrder: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  mockPrismaProduct: {
    findMany: vi.fn(),
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
    order: mockPrismaOrder,
    product: mockPrismaProduct,
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

import { GET, POST } from '@/app/api/orders/route';

describe('Orders API', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockOrders = [
    {
      id: 'order-1',
      profileId: 'user-123',
      totalPrice: 50000,
      status: 'PENDING',
      orderItems: [
        {
          productId: 'prod-1',
          quantity: 2,
          price: 25000,
          product: { id: 'prod-1', name: '상품 1' },
        },
      ],
      createdAt: new Date('2024-01-01'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/orders', () => {
    it('인증된 사용자의 주문 목록을 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaOrder.findMany.mockResolvedValue(mockOrders);

      const response = await GET();

      expect(mockPrismaOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { profileId: 'user-123' },
          include: expect.objectContaining({
            orderItems: expect.objectContaining({
              include: { product: true },
            }),
          }),
        })
      );
      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
    });

    it('주문 목록은 최신순으로 정렬되어야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaOrder.findMany.mockResolvedValue(mockOrders);

      await GET();

      expect(mockPrismaOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      );
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

  describe('POST /api/orders', () => {
    it('유효한 주문 요청으로 주문을 생성해야 함', async () => {
      const validProducts = [
        { id: '123e4567-e89b-12d3-a456-426614174001', name: '상품 1', price: 25000 },
        { id: '123e4567-e89b-12d3-a456-426614174002', name: '상품 2', price: 15000 },
      ];

      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProduct.findMany.mockResolvedValue(validProducts);
      mockPrismaOrder.create.mockResolvedValue({
        id: 'order-new',
        profileId: 'user-123',
        totalPrice: 65000, // 25000*2 + 15000*1
        orderItems: [],
      });

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            { productId: '123e4567-e89b-12d3-a456-426614174001', quantity: 2 },
            { productId: '123e4567-e89b-12d3-a456-426614174002', quantity: 1 },
          ],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockPrismaOrder.create).toHaveBeenCalled();
    });

    it('빈 items 배열은 400 에러를 반환해야 함 (Zod 검증)', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({ items: [] }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('주문 상품이 없습니다');
    });

    it('유효하지 않은 productId(UUID)는 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: 'invalid-uuid', quantity: 1 }],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('유효하지 않은 상품 ID');
    });

    it('수량이 0 이하면 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 0 }],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('최소 1개 이상');
    });

    it('수량이 99 초과하면 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 100 }],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('최대 99개');
    });

    it('존재하지 않는 상품 ID로 주문 시 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });
      mockPrismaProduct.findMany.mockResolvedValue([]); // 상품 없음

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 1 }],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.code).toBe('PRODUCT_NOT_FOUND');
    });

    it('한 번에 50개 초과 상품 주문은 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      // 유효한 UUID 형식으로 51개 상품 생성
      const items = Array.from({ length: 51 }, (_, i) => ({
        productId: `123e4567-e89b-12d3-a456-${i.toString().padStart(12, '0')}`,
        quantity: 1,
      }));

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({ items }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('최대 50개');
    });

    it('배송주소가 500자 초과하면 400 에러를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({ success: true, user: mockUser });

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 1 }],
          shippingAddress: 'A'.repeat(501),
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response._data.error).toContain('최대 500자');
    });

    it('미인증 사용자에 대해 401 Unauthorized를 반환해야 함', async () => {
      mockRequireAuth.mockResolvedValue({
        success: false,
        response: {
          status: 401,
          _data: { success: false, error: '로그인이 필요합니다.' },
        },
      });

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 1 }],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });
  });
});
