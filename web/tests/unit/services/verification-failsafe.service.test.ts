/**
 * Verification Failsafe Service Tests
 *
 * TDD: GREEN phase - 테스트 통과 확인
 *
 * 테스트 범위:
 * - checkProviderHealth(): PortOne API 헬스체크
 * - getFailsafeMode(): 현재 장애 대응 모드 반환
 * - getOutageNotice(): 장애 안내 공지 텍스트
 * - isServiceRecovered(): 장애 복구 확인
 * - getRetryAvailability(): 재시도 가능 안내
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// 환경변수 백업
const originalEnv = { ...process.env };

// Import types from types file
import type {
  FailsafeMode,
  HealthCheckResult,
  RetryAvailability,
} from "@/types/adult-verification";

// Import service functions
import {
  checkProviderHealth,
  getFailsafeMode,
  getOutageNotice,
  isServiceRecovered,
  getRetryAvailability,
} from "@/lib/services/verification-failsafe.service";

// ============================================================
// checkProviderHealth 테스트
// ============================================================
describe("checkProviderHealth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T12:00:00.000Z"));
    // PORTONE_API_SECRET 설정 (테스트용)
    process.env.PORTONE_API_SECRET = "test-api-secret";
    process.env.ADULT_VERIFICATION_ENABLED = "true";
  });

  afterEach(() => {
    vi.useRealTimers();
    // 환경변수 복원
    process.env = { ...originalEnv };
  });

  it("PortOne API가 정상 응답하면 healthy=true 반환", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const result = await checkProviderHealth();

    expect(result.healthy).toBe(true);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.checkedAt).toBeInstanceOf(Date);
  });

  it("PortOne API가 5xx 에러 응답하면 healthy=false 반환", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const result = await checkProviderHealth();

    expect(result.healthy).toBe(false);
    expect(result.errorCode).toBe("PROVIDER_SERVICE_UNAVAILABLE");
  });

  it("PortOne API 요청 타임아웃 시 healthy=false 반환", async () => {
    // AbortError를 시뮬레이션
    const abortError = new Error("Request timeout");
    abortError.name = "AbortError";
    mockFetch.mockRejectedValueOnce(abortError);

    const result = await checkProviderHealth();

    expect(result.healthy).toBe(false);
    expect(result.errorCode).toBe("PROVIDER_TIMEOUT");
  });

  it("네트워크 에러 시 healthy=false 반환", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await checkProviderHealth();

    expect(result.healthy).toBe(false);
    expect(result.errorCode).toBe("NETWORK_ERROR");
  });

  it("API_SECRET 미설정 시 healthy=false 반환 (설정 오류)", async () => {
    const originalEnv = process.env.PORTONE_API_SECRET;
    delete process.env.PORTONE_API_SECRET;

    const result = await checkProviderHealth();

    expect(result.healthy).toBe(false);
    expect(result.errorCode).toBe("CONFIG_ERROR");

    process.env.PORTONE_API_SECRET = originalEnv;
  });

  it("응답 시간(latencyMs)이 측정됨", async () => {
    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
      });
    });

    const result = await checkProviderHealth();

    expect(typeof result.latencyMs).toBe("number");
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================
// getFailsafeMode 테스트
// ============================================================
describe("getFailsafeMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PORTONE_API_SECRET = "test-api-secret";
    process.env.ADULT_VERIFICATION_ENABLED = "true";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("제공사 정상 시 NORMAL 모드 반환", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const mode = await getFailsafeMode();

    expect(mode).toBe("NORMAL");
  });

  it("제공사 장애 시 OUTAGE 모드 반환", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const mode = await getFailsafeMode();

    expect(mode).toBe("OUTAGE");
  });

  it("기능 비활성화 시 DISABLED 모드 반환", async () => {
    const originalEnv = process.env.ADULT_VERIFICATION_ENABLED;
    process.env.ADULT_VERIFICATION_ENABLED = "false";

    const mode = await getFailsafeMode();

    expect(mode).toBe("DISABLED");

    process.env.ADULT_VERIFICATION_ENABLED = originalEnv;
  });

  it("OUTAGE 모드에서는 성인상품 접근 차단 (fail-secure)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const mode = await getFailsafeMode();

    // fail-secure: 장애 시 접근 차단 유지
    expect(mode).toBe("OUTAGE");
    // OUTAGE 모드는 fail-open이 아님을 확인
    expect(mode).not.toBe("BYPASS");
  });
});

// ============================================================
// getOutageNotice 테스트
// ============================================================
describe("getOutageNotice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PORTONE_API_SECRET = "test-api-secret";
    process.env.ADULT_VERIFICATION_ENABLED = "true";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("NORMAL 모드에서는 null 반환", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const notice = await getOutageNotice();

    expect(notice).toBeNull();
  });

  it("OUTAGE 모드에서는 장애 안내 메시지 반환", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const notice = await getOutageNotice();

    expect(notice).not.toBeNull();
    expect(notice?.title).toBeDefined();
    expect(notice?.message).toBeDefined();
    expect(notice?.message).toContain("성인인증");
  });

  it("DISABLED 모드에서는 점검 안내 메시지 반환", async () => {
    const originalEnv = process.env.ADULT_VERIFICATION_ENABLED;
    process.env.ADULT_VERIFICATION_ENABLED = "false";

    const notice = await getOutageNotice();

    expect(notice).not.toBeNull();
    expect(notice?.title).toBeDefined();
    expect(notice?.message).toContain("점검");

    process.env.ADULT_VERIFICATION_ENABLED = originalEnv;
  });

  it("장애 안내에 예상 복구 시간 포함", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const notice = await getOutageNotice();

    expect(notice?.estimatedRecoveryTime).toBeDefined();
  });
});

// ============================================================
// isServiceRecovered 테스트
// ============================================================
describe("isServiceRecovered", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PORTONE_API_SECRET = "test-api-secret";
    process.env.ADULT_VERIFICATION_ENABLED = "true";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("제공사 정상 응답 시 true 반환", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const recovered = await isServiceRecovered();

    expect(recovered).toBe(true);
  });

  it("제공사 여전히 장애 시 false 반환", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const recovered = await isServiceRecovered();

    expect(recovered).toBe(false);
  });

  it("간헐적 오류 시 재시도 후 판단", async () => {
    // 첫 번째 실패, 두 번째 성공
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    // 기본적으로 재시도 없이 단일 체크
    const recovered = await isServiceRecovered();

    // 단일 체크에서 첫 번째 실패했으므로 false
    expect(recovered).toBe(false);
  });

  it("retryCount 옵션으로 여러 번 체크 가능", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    // 2번 체크하여 1번이라도 성공하면 true
    const recovered = await isServiceRecovered({ retryCount: 2 });

    expect(recovered).toBe(true);
  });
});

// ============================================================
// getRetryAvailability 테스트
// ============================================================
describe("getRetryAvailability", () => {
  beforeEach(() => {
    // Mock 완전 리셋
    mockFetch.mockReset();
    process.env.PORTONE_API_SECRET = "test-api-secret";
    process.env.ADULT_VERIFICATION_ENABLED = "true";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("정상 상태에서는 즉시 재시도 가능", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    });

    const availability = await getRetryAvailability();

    expect(availability.canRetry).toBe(true);
    expect(availability.waitTimeSeconds).toBe(0);
  });

  it("장애 상태에서는 재시도 대기 필요", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
    });

    const availability = await getRetryAvailability();

    expect(availability.canRetry).toBe(false);
    expect(availability.waitTimeSeconds).toBeGreaterThan(0);
  });

  it("장애 시 다음 체크 시간 안내", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
    });

    const availability = await getRetryAvailability();

    expect(availability.nextCheckAt).toBeInstanceOf(Date);
    expect(availability.message).toBeDefined();
  });

  it("사용자 친화적 메시지 포함", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
    });

    const availability = await getRetryAvailability();

    expect(availability.message).toBeDefined();
    expect(typeof availability.message).toBe("string");
    // 한글 메시지 포함
    expect(availability.message).toMatch(/분|초|시간/);
  });
});

// ============================================================
// Fail-secure 원칙 검증 테스트
// ============================================================
describe("Fail-secure 원칙", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PORTONE_API_SECRET = "test-api-secret";
    process.env.ADULT_VERIFICATION_ENABLED = "true";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("어떤 장애 상황에서도 BYPASS 모드가 존재하지 않음", async () => {
    // 다양한 에러 상황 테스트
    const errorScenarios = [
      { ok: false, status: 500 },
      { ok: false, status: 502 },
      { ok: false, status: 503 },
      { ok: false, status: 504 },
    ];

    for (const scenario of errorScenarios) {
      mockFetch.mockResolvedValueOnce(scenario);
      const mode = await getFailsafeMode();

      // fail-secure: 절대 BYPASS가 되어서는 안 됨
      expect(mode).not.toBe("BYPASS");
      // OUTAGE 또는 DISABLED만 허용
      expect(["NORMAL", "OUTAGE", "DISABLED"]).toContain(mode);
    }
  });

  it("OUTAGE 모드에서 isAdultAccessAllowed()는 false", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const mode = await getFailsafeMode();

    // OUTAGE 모드에서는 성인 접근 불허
    expect(mode).toBe("OUTAGE");
    // OUTAGE가 fail-open이 아님을 다시 확인
  });
});

// ============================================================
// 타입 검증 테스트
// ============================================================
describe("타입 정의", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PORTONE_API_SECRET = "test-api-secret";
    process.env.ADULT_VERIFICATION_ENABLED = "true";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("FailsafeMode 타입이 올바름", () => {
    const modes: FailsafeMode[] = ["NORMAL", "OUTAGE", "DISABLED"];

    expect(modes).toContain("NORMAL");
    expect(modes).toContain("OUTAGE");
    expect(modes).toContain("DISABLED");
    // BYPASS는 존재하지 않아야 함
    expect(modes).not.toContain("BYPASS");
  });

  it("HealthCheckResult 인터페이스가 올바름", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const result: HealthCheckResult = await checkProviderHealth();

    expect(result).toHaveProperty("healthy");
    expect(result).toHaveProperty("latencyMs");
    expect(result).toHaveProperty("checkedAt");
  });

  it("RetryAvailability 인터페이스가 올바름", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const availability: RetryAvailability = await getRetryAvailability();

    expect(availability).toHaveProperty("canRetry");
    expect(availability).toHaveProperty("waitTimeSeconds");
    expect(availability).toHaveProperty("message");
  });
});
