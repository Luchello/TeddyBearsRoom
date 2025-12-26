/**
 * Products API Tests
 * Tests for app/api/products/route.ts
 *
 * Requirements covered: 3.1 (상품 목록), 3.2 (상품 상세)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockPrismaProduct } = vi.hoisted(() => ({
  mockPrismaProduct: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
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

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
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

import { GET } from '@/app/api/products/route';

describe('Products API', () => {
  const mockProducts = [
    {
      id: 'prod-1',
      name: '상품 1',
      price: 10000,
      category: '바디토너',
      isNew: true,
      isBest: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'prod-2',
      name: '상품 2',
      price: 20000,
      category: '바디토너',
      isNew: false,
      isBest: true,
      createdAt: new Date('2024-01-02'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('기본 조회 시 페이지네이션 기본값(page=1, limit=20)으로 반환해야 함', async () => {
      mockPrismaProduct.findMany.mockResolvedValue(mockProducts);
      mockPrismaProduct.count.mockResolvedValue(2);

      const request = new Request('http://localhost:3000/api/products');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.pagination.page).toBe(1);
      expect(response._data.pagination.limit).toBe(20);
    });

    it('카테고리 필터가 적용되어야 함', async () => {
      mockPrismaProduct.findMany.mockResolvedValue([mockProducts[0]]);
      mockPrismaProduct.count.mockResolvedValue(1);

      const request = new Request('http://localhost:3000/api/products?category=바디토너');
      await GET(request);

      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: '바디토너' }),
        })
      );
    });

    it('신상품 필터(new=true)가 적용되어야 함', async () => {
      mockPrismaProduct.findMany.mockResolvedValue([mockProducts[0]]);
      mockPrismaProduct.count.mockResolvedValue(1);

      const request = new Request('http://localhost:3000/api/products?new=true');
      await GET(request);

      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isNew: true }),
        })
      );
    });

    it('베스트상품 필터(best=true)가 적용되어야 함', async () => {
      mockPrismaProduct.findMany.mockResolvedValue([mockProducts[1]]);
      mockPrismaProduct.count.mockResolvedValue(1);

      const request = new Request('http://localhost:3000/api/products?best=true');
      await GET(request);

      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isBest: true }),
        })
      );
    });

    it('가격 낮은순 정렬(sort=price-low)이 적용되어야 함', async () => {
      mockPrismaProduct.findMany.mockResolvedValue(mockProducts);
      mockPrismaProduct.count.mockResolvedValue(2);

      const request = new Request('http://localhost:3000/api/products?sort=price-low');
      await GET(request);

      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { price: 'asc' },
        })
      );
    });

    it('가격 높은순 정렬(sort=price-high)이 적용되어야 함', async () => {
      mockPrismaProduct.findMany.mockResolvedValue(mockProducts);
      mockPrismaProduct.count.mockResolvedValue(2);

      const request = new Request('http://localhost:3000/api/products?sort=price-high');
      await GET(request);

      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { price: 'desc' },
        })
      );
    });

    it('페이지네이션 파라미터(page, limit)가 적용되어야 함', async () => {
      mockPrismaProduct.findMany.mockResolvedValue(mockProducts);
      mockPrismaProduct.count.mockResolvedValue(50);

      const request = new Request('http://localhost:3000/api/products?page=2&limit=12');
      const response = await GET(request);

      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 12, // (page-1) * limit = 1 * 12
          take: 12,
        })
      );
      expect(response._data.pagination.page).toBe(2);
      expect(response._data.pagination.limit).toBe(12);
    });

    it('limit이 100을 초과하면 100으로 제한되어야 함', async () => {
      mockPrismaProduct.findMany.mockResolvedValue(mockProducts);
      mockPrismaProduct.count.mockResolvedValue(2);

      const request = new Request('http://localhost:3000/api/products?limit=500');
      const response = await GET(request);

      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        })
      );
      expect(response._data.pagination.limit).toBe(100);
    });

    it('데이터베이스 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockPrismaProduct.findMany.mockRejectedValue(new Error('DB Error'));

      const request = new Request('http://localhost:3000/api/products');
      const response = await GET(request);

      expect(response.status).toBe(500);
      expect(response._data.success).toBe(false);
    });
  });
});
