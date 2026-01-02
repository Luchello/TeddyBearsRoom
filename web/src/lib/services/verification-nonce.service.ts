/**
 * Verification Nonce Service
 *
 * State/Nonce 생성 및 검증 서비스
 * - 10분 유효 기간
 * - 일회성 사용 (사용 후 삭제)
 * - Map 기반 메모리 저장 (Redis 불필요)
 *
 * @description
 * PASS 본인인증 콜백의 CSRF 방지를 위한 nonce 관리
 * - 인증 시작 시 nonce 생성
 * - 콜백 수신 시 nonce 검증 및 소비
 */

import crypto from "crypto";

// ============================================================
// CONSTANTS
// ============================================================
/**
 * Nonce 유효 기간 (10분)
 */
export const NONCE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// ============================================================
// TYPE DEFINITIONS
// ============================================================
interface NonceEntry {
  createdAt: number;
}

// ============================================================
// STATE (Memory Storage)
// ============================================================
const nonceStore = new Map<string, NonceEntry>();

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * 고유한 nonce 문자열을 생성
 *
 * @returns URL-safe nonce 문자열 (최소 32자)
 *
 * @description
 * - crypto.randomBytes를 사용하여 암호학적으로 안전한 랜덤 생성
 * - URL-safe base64 인코딩 (alphanumeric, -, _)
 * - 생성된 nonce는 메모리에 저장되어 검증에 사용
 */
export function generateNonce(): string {
  // 24 bytes -> 32 characters in base64
  const buffer = crypto.randomBytes(24);
  const nonce = buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  // Store in memory with creation timestamp
  nonceStore.set(nonce, {
    createdAt: Date.now(),
  });

  return nonce;
}

/**
 * nonce 유효성 검증
 *
 * @param nonce - 검증할 nonce 문자열
 * @returns 유효하면 true, 무효하면 false
 *
 * @description
 * - 존재하지 않는 nonce: false
 * - 만료된 nonce (10분 경과): false
 * - 유효한 nonce: true (검증 후 삭제 - 일회성)
 */
export function validateNonce(nonce: string): boolean {
  // Null/undefined/empty check
  if (!nonce) {
    return false;
  }

  const entry = nonceStore.get(nonce);

  // Nonce not found
  if (!entry) {
    return false;
  }

  const now = Date.now();
  const age = now - entry.createdAt;

  // Expired check
  if (age >= NONCE_EXPIRY_MS) {
    nonceStore.delete(nonce);
    return false;
  }

  // Valid - consume (one-time use)
  nonceStore.delete(nonce);
  return true;
}

/**
 * 만료된 nonce 정리
 *
 * @param force - true면 모든 nonce 제거
 * @returns 제거된 nonce 수
 *
 * @description
 * - 주기적으로 호출하여 메모리 정리
 * - force=true: 테스트용 전체 초기화
 */
export function clearExpiredNonces(force: boolean = false): number {
  if (force) {
    const count = nonceStore.size;
    nonceStore.clear();
    return count;
  }

  const now = Date.now();
  let clearedCount = 0;

  for (const [nonce, entry] of nonceStore.entries()) {
    const age = now - entry.createdAt;
    if (age >= NONCE_EXPIRY_MS) {
      nonceStore.delete(nonce);
      clearedCount++;
    }
  }

  return clearedCount;
}
