/**
 * Adult Verification Verify API Unit Tests
 * POST /api/auth/adult-verification/verify
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
const mockPrismaProfileUpdate = vi.fn();
const mockPrismaAdultVerificationLogCreate = vi.fn();
const mockPrismaAdultVerificationLogFindFirst = vi.fn();
vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: mockPrismaProfileFindUnique,
      update: mockPrismaProfileUpdate,
    },
    adultVerificationLog: {
      create: mockPrismaAdultVerificationLogCreate,
      findFirst: mockPrismaAdultVerificationLogFindFirst,
    },
  },
}));

// Mock PortOne API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('POST /api/auth/adult-verification/verify', () => {
  const userId = 'test-user-id';
  const identityVerificationId = `adult-${userId}-123456`;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('PORTONE_API_SECRET', 'test-api-secret');
    vi.stubEnv('ADULT_VERIFICATION_CI_SALT', 'test-salt-value-12345678901234567890');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return 401 when user is not authenticated', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.code).toBe('UNAUTHORIZED');
  });

  it('should return error when identityVerificationId is not provided', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it('should return VERIFICATION_NOT_FOUND when PortOne API returns error', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Not found' }),
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.code).toBe('VERIFICATION_NOT_FOUND');
  });

  it('should return NOT_VERIFIED when PortOne status is not VERIFIED', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: identityVerificationId,
        status: 'READY', // Not verified yet
      }),
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.code).toBe('NOT_VERIFIED');
  });

  it('should return UNDERAGE when user is under 19 years old', async () => {
    // Arrange
    // User born 18 years ago (under 19)
    const underageBirthDate = new Date();
    underageBirthDate.setFullYear(underageBirthDate.getFullYear() - 18);
    underageBirthDate.setMonth(underageBirthDate.getMonth() + 1); // Still under 19

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: identityVerificationId,
        status: 'VERIFIED',
        verifiedCustomer: {
          ci: 'test-ci-value',
          di: 'test-di-value',
          name: 'Test User',
          gender: 'MALE',
          birthDate: underageBirthDate.toISOString().split('T')[0],
        },
      }),
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.code).toBe('UNDERAGE');
    expect(body.error).toBe('만 19세 이상만 이용 가능합니다.');
  });

  it('should verify successfully when user is 19 years old or older', async () => {
    // Arrange
    // User born 19 years ago (exactly 19)
    const adultBirthDate = new Date();
    adultBirthDate.setFullYear(adultBirthDate.getFullYear() - 19);
    adultBirthDate.setMonth(adultBirthDate.getMonth() - 1); // Already turned 19

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: identityVerificationId,
        status: 'VERIFIED',
        verifiedCustomer: {
          ci: 'test-ci-value',
          di: 'test-di-value',
          name: 'Test User',
          gender: 'MALE',
          birthDate: adultBirthDate.toISOString().split('T')[0],
        },
      }),
    });
    mockPrismaProfileUpdate.mockResolvedValueOnce({});
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.verified).toBe(true);
    expect(body.data).toHaveProperty('verifiedAt');
  });

  it('should update Profile with verification data on success', async () => {
    // Arrange
    const adultBirthDate = new Date();
    adultBirthDate.setFullYear(adultBirthDate.getFullYear() - 25);

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: identityVerificationId,
        status: 'VERIFIED',
        verifiedCustomer: {
          ci: 'test-ci-value',
          di: 'test-di-value',
          name: 'Test User',
          gender: 'MALE',
          birthDate: adultBirthDate.toISOString().split('T')[0],
        },
      }),
    });
    mockPrismaProfileUpdate.mockResolvedValueOnce({});
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    await POST(request);

    // Assert
    expect(mockPrismaProfileUpdate).toHaveBeenCalledWith({
      where: { id: userId },
      data: expect.objectContaining({
        isAdultVerified: true,
        adultVerifyMethod: 'PHONE',
        adultVerifyTxid: identityVerificationId,
      }),
    });
    expect(mockPrismaProfileUpdate.mock.calls[0][0].data).toHaveProperty('adultVerifiedAt');
    expect(mockPrismaProfileUpdate.mock.calls[0][0].data).toHaveProperty('ciHash');
  });

  it('should create SUCCESS log on successful verification', async () => {
    // Arrange
    const adultBirthDate = new Date();
    adultBirthDate.setFullYear(adultBirthDate.getFullYear() - 25);

    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: identityVerificationId,
        status: 'VERIFIED',
        verifiedCustomer: {
          ci: 'test-ci-value',
          di: 'test-di-value',
          name: 'Test User',
          gender: 'MALE',
          birthDate: adultBirthDate.toISOString().split('T')[0],
        },
      }),
    });
    mockPrismaProfileUpdate.mockResolvedValueOnce({});
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    await POST(request);

    // Assert
    expect(mockPrismaAdultVerificationLogCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        profileId: userId,
        txid: identityVerificationId,
        eventType: 'SUCCESS',
      }),
    });
  });

  it('should create FAILED log with failure code on verification failure', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: identityVerificationId,
        status: 'FAILED',
      }),
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    await POST(request);

    // Assert
    expect(mockPrismaAdultVerificationLogCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        profileId: userId,
        txid: identityVerificationId,
        eventType: 'FAILED',
        failureCode: 'NOT_VERIFIED',
      }),
    });
  });

  it('should call PortOne API with correct authorization header', async () => {
    // Arrange
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: userId } },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: identityVerificationId,
        status: 'READY',
      }),
    });
    mockPrismaAdultVerificationLogCreate.mockResolvedValueOnce({});

    // Import the route handler
    const { POST } = await import('@/app/api/auth/adult-verification/verify/route');

    // Act
    const request = new NextRequest('http://localhost/api/auth/adult-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ identityVerificationId }),
    });
    await POST(request);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'PortOne test-api-secret',
        }),
      })
    );
  });
});
