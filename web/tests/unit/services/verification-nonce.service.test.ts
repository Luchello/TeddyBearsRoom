/**
 * Verification Nonce Service Tests
 *
 * TDD: RED phase - 실패하는 테스트 작성
 *
 * State/Nonce 생성 및 검증 서비스 테스트
 * - 10분 유효 기간
 * - 일회성 사용 (사용 후 삭제)
 * - Map 기반 메모리 저장
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Import will fail initially (RED phase) - implement the service to make it pass
import {
  generateNonce,
  validateNonce,
  clearExpiredNonces,
  NONCE_EXPIRY_MS,
} from "@/lib/services/verification-nonce.service";

describe("Verification Nonce Service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    // Clear all nonces between tests
    clearExpiredNonces(true); // force clear all
  });

  // ============================================================
  // generateNonce 테스트
  // ============================================================
  describe("generateNonce", () => {
    it("고유한 nonce 문자열을 생성해야 함", () => {
      const nonce = generateNonce();

      expect(typeof nonce).toBe("string");
      expect(nonce.length).toBeGreaterThan(0);
    });

    it("매번 다른 nonce를 생성해야 함", () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      const nonce3 = generateNonce();

      expect(nonce1).not.toBe(nonce2);
      expect(nonce2).not.toBe(nonce3);
      expect(nonce1).not.toBe(nonce3);
    });

    it("URL-safe 문자열이어야 함", () => {
      const nonce = generateNonce();

      // URL-safe base64 문자열 패턴 (alphanumeric, -, _)
      expect(nonce).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it("충분한 길이의 nonce를 생성해야 함 (최소 32자)", () => {
      const nonce = generateNonce();

      expect(nonce.length).toBeGreaterThanOrEqual(32);
    });
  });

  // ============================================================
  // validateNonce 테스트
  // ============================================================
  describe("validateNonce", () => {
    it("유효한 nonce면 true 반환", () => {
      const nonce = generateNonce();

      const result = validateNonce(nonce);

      expect(result).toBe(true);
    });

    it("존재하지 않는 nonce면 false 반환", () => {
      const result = validateNonce("non-existent-nonce");

      expect(result).toBe(false);
    });

    it("일회성 사용: 검증 후 다시 사용 불가", () => {
      const nonce = generateNonce();

      // 첫 번째 검증 - 성공
      expect(validateNonce(nonce)).toBe(true);

      // 두 번째 검증 - 실패 (이미 사용됨)
      expect(validateNonce(nonce)).toBe(false);
    });

    it("빈 문자열은 false 반환", () => {
      expect(validateNonce("")).toBe(false);
    });

    it("null/undefined는 false 반환", () => {
      expect(validateNonce(null as unknown as string)).toBe(false);
      expect(validateNonce(undefined as unknown as string)).toBe(false);
    });
  });

  // ============================================================
  // 만료 테스트
  // ============================================================
  describe("Nonce 만료", () => {
    it("10분 이내면 유효", () => {
      const nonce = generateNonce();

      // 9분 59초 경과
      vi.advanceTimersByTime(9 * 60 * 1000 + 59 * 1000);

      expect(validateNonce(nonce)).toBe(true);
    });

    it("10분 경과 후 만료", () => {
      const nonce = generateNonce();

      // 10분 1초 경과
      vi.advanceTimersByTime(10 * 60 * 1000 + 1000);

      expect(validateNonce(nonce)).toBe(false);
    });

    it("NONCE_EXPIRY_MS 상수가 10분(600000ms)이어야 함", () => {
      expect(NONCE_EXPIRY_MS).toBe(10 * 60 * 1000);
    });
  });

  // ============================================================
  // clearExpiredNonces 테스트
  // ============================================================
  describe("clearExpiredNonces", () => {
    it("만료된 nonce만 제거", () => {
      const oldNonce = generateNonce();

      // 11분 경과
      vi.advanceTimersByTime(11 * 60 * 1000);

      const newNonce = generateNonce();

      // 만료된 nonce 정리
      const clearedCount = clearExpiredNonces();

      // oldNonce는 제거됨
      expect(clearedCount).toBe(1);

      // newNonce는 여전히 유효
      expect(validateNonce(newNonce)).toBe(true);
    });

    it("force=true면 모든 nonce 제거", () => {
      generateNonce();
      generateNonce();
      generateNonce();

      const clearedCount = clearExpiredNonces(true);

      expect(clearedCount).toBe(3);
    });
  });

  // ============================================================
  // 동시성 테스트
  // ============================================================
  describe("동시성", () => {
    it("여러 nonce를 동시에 관리 가능", () => {
      const nonces = Array.from({ length: 100 }, () => generateNonce());

      // 모든 nonce가 고유해야 함
      const uniqueNonces = new Set(nonces);
      expect(uniqueNonces.size).toBe(100);

      // 모든 nonce가 유효해야 함
      nonces.forEach((nonce) => {
        expect(validateNonce(nonce)).toBe(true);
      });

      // 모든 nonce가 사용되어 더 이상 유효하지 않음
      nonces.forEach((nonce) => {
        expect(validateNonce(nonce)).toBe(false);
      });
    });
  });
});
