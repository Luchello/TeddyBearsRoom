/**
 * Product Detail API Tests
 * Tests for app/api/products/[id]/route.ts
 *
 * Requirements covered: 3.2 (상품 상세 조회)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted for mock objects to avoid hoisting issues
const { mockPrismaProduct, mockOptionalAdultVerification, mockIsAdultVerificationEnabled } = vi.hoisted(() => ({
  mockPrismaProduct: {
    findUnique: vi.fn(),
  },
  mockOptionalAdultVerification: vi.fn(),
  mockIsAdultVerificationEnabled: vi.fn(),
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

// Mock feature-flags (성인인증 기능 비활성화)
vi.mock('@/lib/feature-flags', () => ({
  isAdultVerificationEnabled: mockIsAdultVerificationEnabled,
}));

// Mock adult-auth
vi.mock('@/lib/api/adult-auth', () => ({
  optionalAdultVerification: mockOptionalAdultVerification,
}));

// Mock api/auth
vi.mock('@/lib/api/auth', () => ({
  apiError: vi.fn((message: string, status: number, code?: string) => ({
    json: () => Promise.resolve({ success: false, error: message, code }),
    status,
    _data: { success: false, error: message, code },
  })),
}));

import { GET } from '@/app/api/products/[id]/route';

describe('Product Detail API', () => {
  const mockProduct = {
    id: 'prod-1',
    name: '테스트 상품',
    price: 29000,
    description: '상품 설명',
    category: '바디토너',
    isNew: true,
    isBest: false,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 기본적으로 성인인증 기능 비활성화 (테스트 단순화)
    mockIsAdultVerificationEnabled.mockReturnValue(false);
    // 성인인증 성공으로 mock (성인인증 활성화 테스트용)
    mockOptionalAdultVerification.mockResolvedValue({
      isAuthenticated: true,
      isAdultVerified: true,
      userId: 'test-user-id',
    });
  });

  describe('GET /api/products/[id]', () => {
    it('존재하는 상품 ID로 조회 시 200과 상품 데이터를 반환해야 함', async () => {
      mockPrismaProduct.findUnique.mockResolvedValue(mockProduct);

      const request = new Request('http://localhost:3000/api/products/prod-1');
      const response = await GET(request, { params: Promise.resolve({ id: 'prod-1' }) });

      expect(response.status).toBe(200);
      expect(response._data.success).toBe(true);
      expect(response._data.data).toEqual(mockProduct);
      expect(mockPrismaProduct.findUnique).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
      });
    });

    it('존재하지 않는 상품 ID로 조회 시 404 에러를 반환해야 함', async () => {
      mockPrismaProduct.findUnique.mockResolvedValue(null);

      const request = new Request('http://localhost:3000/api/products/invalid-id');
      const response = await GET(request, { params: Promise.resolve({ id: 'invalid-id' }) });

      expect(response.status).toBe(404);
      expect(response._data.success).toBe(false);
      expect(response._data.error).toBe('상품을 찾을 수 없습니다.');
    });

    it('데이터베이스 에러 발생 시 500 에러를 반환해야 함', async () => {
      mockPrismaProduct.findUnique.mockRejectedValue(new Error('DB Error'));

      const request = new Request('http://localhost:3000/api/products/prod-1');
      const response = await GET(request, { params: Promise.resolve({ id: 'prod-1' }) });

      expect(response.status).toBe(500);
      expect(response._data.success).toBe(false);
      expect(response._data.error).toBe('상품을 불러오는데 실패했습니다.');
    });

    it('다른 ID로 조회 시 해당 ID로 findUnique를 호출해야 함', async () => {
      const anotherProduct = { ...mockProduct, id: 'prod-2', name: '다른 상품' };
      mockPrismaProduct.findUnique.mockResolvedValue(anotherProduct);

      const request = new Request('http://localhost:3000/api/products/prod-2');
      const response = await GET(request, { params: Promise.resolve({ id: 'prod-2' }) });

      expect(response.status).toBe(200);
      expect(response._data.data.id).toBe('prod-2');
      expect(mockPrismaProduct.findUnique).toHaveBeenCalledWith({
        where: { id: 'prod-2' },
      });
    });
  });
});
