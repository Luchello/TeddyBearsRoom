/**
 * Adult Verification Initiate API Unit Tests
 * POST /api/auth/adult-verification/initiate
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
const mockPrismaAdultVerificationLogCreate = vi.fn();
vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: mockPrismaProfileFindUnique,
    },
    adultVerificationLog: {
      create: mockPrismaAdultVerificationLogCreate,
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

describe('POST /api/auth/adult-verification/initiate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set environment variables
    vi.stubEnv('NEXT_PUBLIC_PORTONE_STORE_ID', 'test-store-id');
    vi.stubEnv('NEXT_PUBLIC_PORTONE_CHANNEL_KEY', 'test-channel-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return 401 when user is not authenticated', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/initiate/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/initiate', {
      method: 'POST',
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.code).toBe('UNAUTHORIZED');
  });

  it('should return ALREADY_VERIFIED when user already has valid adult verification', async () => {
    // Arrange
    const userId = 'test-user-id';
    const recentVerifiedAt = new Date(); // Just verified

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: true,
      adultVerifiedAt: recentVerifiedAt,
    });

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/initiate/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/initiate', {
      method: 'POST',
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.code).toBe('ALREADY_VERIFIED');
    expect(body.error).toBe('이미 성인인증이 완료되었습니다.');
  });

  it('should allow re-verification when previous verification is expired', async () => {
    // Arrange
    const userId = 'test-user-id';
    // Expired verification (more than 365 days ago)
    const expiredVerifiedAt = new Date();
    expiredVerifiedAt.setDate(expiredVerifiedAt.getDate() - 400);

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: true,
      adultVerifiedAt: expiredVerifiedAt,
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/initiate/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/initiate', {
      method: 'POST',
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('identityVerificationId');
    expect(body.data).toHaveProperty('storeId', 'test-store-id');
    expect(body.data).toHaveProperty('channelKey', 'test-channel-key');
  });

  it('should return identityVerificationId, storeId, and channelKey on success', async () => {
    // Arrange
    const userId = 'test-user-id';

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: false,
      adultVerifiedAt: null,
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/initiate/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/initiate', {
      method: 'POST',
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('identityVerificationId');
    expect(body.data.identityVerificationId).toContain(userId);
    expect(body.data).toHaveProperty('storeId', 'test-store-id');
    expect(body.data).toHaveProperty('channelKey', 'test-channel-key');
  });

  it('should create INITIATED log when verification starts', async () => {
    // Arrange
    const userId = 'test-user-id';

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValueOnce({
      isAdultVerified: false,
      adultVerifiedAt: null,
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/initiate/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/initiate', {
      method: 'POST',
    });
    await POST(request);

    // Assert
    expect(mockPrismaAdultVerificationLogCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        profileId: userId,
        eventType: 'INITIATED',
      }),
    });
  });

  it('should generate unique identityVerificationId for each request', async () => {
    // Arrange
    const userId = 'test-user-id';

    mockGetUser.mockResolvedValue({
      data: { user: { id: userId } },
      error: null,
    });
    mockPrismaProfileFindUnique.mockResolvedValue({
      isAdultVerified: false,
      adultVerifiedAt: null,
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValue({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/initiate/route');

    // Act
    const request1 = new NextRequest('http://localhost/api/auth/adult-verification/initiate', {
      method: 'POST',
    });
    const request2 = new NextRequest('http://localhost/api/auth/adult-verification/initiate', {
      method: 'POST',
    });

    const response1 = await POST(request1);
    const body1 = await response1.json();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const response2 = await POST(request2);
    const body2 = await response2.json();

    // Assert
    expect(body1.data.identityVerificationId).not.toBe(body2.data.identityVerificationId);
  });
});
