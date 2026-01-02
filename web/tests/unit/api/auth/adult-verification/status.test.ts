/**
 * Adult Verification Status API Unit Tests
 * GET /api/auth/adult-verification/status
 *
 * TDD Red Phase: These tests should FAIL initially
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock Supabase client
const mockGetUser = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

// Mock Prisma client
const mockPrismaProfileFindUnique = vi.fn();
vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: mockPrismaProfileFindUnique,
    },
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('GET /api/auth/adult-verification/status', () => {
  const userId = 'test-user-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return 401 when user is not authenticated', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    // Import the route handler
    const { GET } = await import('@/app/api/auth/adult-verification/status/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/status');
    const response = await GET(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.code).toBe('UNAUTHORIZED');
  });

  it('should return PENDING status when user has not verified', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: false,
      adultVerifiedAt: null,
    });

    // Import the route handler
    const { GET } = await import('@/app/api/auth/adult-verification/status/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/status');
    const response = await GET(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('PENDING');
    expect(body.data.verifiedAt).toBeNull();
  });

  it('should return VERIFIED status when user has valid verification', async () => {
    // Arrange
    const recentVerifiedAt = new Date();
    recentVerifiedAt.setDate(recentVerifiedAt.getDate() - 10); // 10 days ago

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: true,
      adultVerifiedAt: recentVerifiedAt,
    });

    // Import the route handler
    const { GET } = await import('@/app/api/auth/adult-verification/status/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/status');
    const response = await GET(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('VERIFIED');
    expect(body.data.verifiedAt).not.toBeNull();
  });

  it('should return EXPIRED status when verification is older than 365 days', async () => {
    // Arrange
    const expiredVerifiedAt = new Date();
    expiredVerifiedAt.setDate(expiredVerifiedAt.getDate() - 400); // 400 days ago

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: true,
      adultVerifiedAt: expiredVerifiedAt,
    });

    // Import the route handler
    const { GET } = await import('@/app/api/auth/adult-verification/status/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/status');
    const response = await GET(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('EXPIRED');
    expect(body.data.verifiedAt).not.toBeNull();
  });

  it('should return 404 when profile does not exist', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce(null);

    // Import the route handler
    const { GET } = await import('@/app/api/auth/adult-verification/status/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/status');
    const response = await GET(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
  });

  it('should return verifiedAt as ISO string when verified', async () => {
    // Arrange
    const verifiedAt = new Date('2025-06-15T10:30:00.000Z');

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    });

    // Import the route handler
    const { GET } = await import('@/app/api/auth/adult-verification/status/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/status');
    const response = await GET(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.verifiedAt).toBe('2025-06-15T10:30:00.000Z');
  });

  it('should query profile with correct user id', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: false,
      adultVerifiedAt: null,
    });

    // Import the route handler
    const { GET } = await import('@/app/api/auth/adult-verification/status/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/status');
    await GET(request);

    // Assert
    expect(mockPrismaProfileFindUnique).toHaveBeenCalledWith({
      where: { id: userId },
      select: {
        isAdultVerified: true,
        adultVerifiedAt: true,
      },
    });
  });
});
