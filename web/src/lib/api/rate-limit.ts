// ====================================
// TeddyBear's Room - Rate Limiting Utility
// API 요청 속도 제한 유틸리티
// ====================================
//
// 🎯 용도:
// - Brute Force 공격 방지 (로그인, 비밀번호 시도)
// - DoS 공격 완화
// - API 남용 방지
//
// 📦 구현:
// - 메모리 기반 (개발/단일 인스턴스용)
// - Upstash Redis 기반 (프로덕션/분산 환경용)
//
// 🔧 사용법:
// const { success, remaining } = await rateLimit(identifier);
// if (!success) return rateLimitResponse();
// ====================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";

// ──────────────────────────────────────
// Rate Limit 설정
// ──────────────────────────────────────

interface RateLimitConfig {
  /** 윈도우 당 최대 요청 수 */
  maxRequests: number;
  /** 시간 윈도우 (밀리초) */
  windowMs: number;
}

// 기본 설정: 분당 30회
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1분
};

// 엔드포인트별 설정
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // 인증 관련: 더 엄격 (분당 5회)
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000,
  },
  // 주문 생성: 중간 (분당 10회)
  orders: {
    maxRequests: 10,
    windowMs: 60 * 1000,
  },
  // 장바구니: 중간 (분당 20회)
  cart: {
    maxRequests: 20,
    windowMs: 60 * 1000,
  },
  // 일반 API: 기본 (분당 30회)
  default: DEFAULT_CONFIG,
};

// ──────────────────────────────────────
// 메모리 기반 Rate Limiter (개발용)
// 단일 인스턴스에서만 작동
// ──────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// 메모리 저장소 (Map)
const rateLimitStore = new Map<string, RateLimitEntry>();

// 주기적 정리 (1분마다)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);

/**
 * Rate Limit 체크 결과
 */
interface RateLimitResult {
  /** 요청 허용 여부 */
  success: boolean;
  /** 남은 요청 수 */
  remaining: number;
  /** 리셋 시간 (Unix timestamp) */
  resetTime: number;
  /** 현재 윈도우 내 요청 수 */
  count: number;
}

/**
 * 요청 클라이언트 식별자 추출
 * IP 주소 또는 사용자 ID 기반
 */
export async function getClientIdentifier(userId?: string): Promise<string> {
  if (userId) {
    return `user:${userId}`;
  }

  const headersList = await headers();
  // Vercel/Cloudflare에서 전달하는 실제 클라이언트 IP
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
  return `ip:${ip}`;
}

/**
 * Rate Limit 체크 (메모리 기반)
 *
 * @param identifier - 클라이언트 식별자 (IP 또는 user ID)
 * @param configKey - 설정 키 (auth, orders, default)
 * @returns RateLimitResult
 *
 * @example
 * const identifier = await getClientIdentifier(user?.id);
 * const { success, remaining } = await checkRateLimit(`orders:${identifier}`, "orders");
 * if (!success) {
 *   return rateLimitResponse(remaining);
 * }
 */
export function checkRateLimit(
  identifier: string,
  configKey: keyof typeof RATE_LIMIT_CONFIGS = "default"
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[configKey] || RATE_LIMIT_CONFIGS.default;
  const now = Date.now();
  const key = `${configKey}:${identifier}`;

  // 기존 엔트리 조회
  let entry = rateLimitStore.get(key);

  // 엔트리가 없거나 만료됨 → 새로 생성
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
      count: 1,
    };
  }

  // 요청 수 증가
  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const success = entry.count <= config.maxRequests;

  return {
    success,
    remaining,
    resetTime: entry.resetTime,
    count: entry.count,
  };
}

/**
 * Rate Limit 초과 응답 생성
 *
 * @param resetTime - 리셋 시간 (Unix timestamp)
 * @returns NextResponse (429 Too Many Requests)
 */
export function rateLimitResponse(resetTime?: number): NextResponse {
  const retryAfter = resetTime
    ? Math.ceil((resetTime - Date.now()) / 1000)
    : 60;

  return NextResponse.json(
    {
      success: false,
      error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "30",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(resetTime || Date.now() + 60000),
      },
    }
  );
}

/**
 * Rate Limit 헤더 추가 헬퍼
 *
 * @param response - 기존 응답
 * @param result - Rate Limit 결과
 * @param configKey - 설정 키
 * @returns 헤더가 추가된 응답
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult,
  configKey: keyof typeof RATE_LIMIT_CONFIGS = "default"
): NextResponse {
  const config = RATE_LIMIT_CONFIGS[configKey] || RATE_LIMIT_CONFIGS.default;

  response.headers.set("X-RateLimit-Limit", String(config.maxRequests));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(result.resetTime));

  return response;
}

// ──────────────────────────────────────
// 편의 함수: API 핸들러에서 사용
// ──────────────────────────────────────

/**
 * Rate Limit 미들웨어 래퍼
 *
 * @example
 * export async function POST(request: Request) {
 *   const rateLimitCheck = await withRateLimit("orders");
 *   if (!rateLimitCheck.success) {
 *     return rateLimitCheck.response;
 *   }
 *
 *   // 실제 로직...
 * }
 */
export async function withRateLimit(
  configKey: keyof typeof RATE_LIMIT_CONFIGS = "default",
  userId?: string
): Promise<{ success: true } | { success: false; response: NextResponse }> {
  const identifier = await getClientIdentifier(userId);
  const result = checkRateLimit(identifier, configKey);

  if (!result.success) {
    return {
      success: false,
      response: rateLimitResponse(result.resetTime),
    };
  }

  return { success: true };
}
