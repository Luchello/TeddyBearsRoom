/**
 * Adult Verification Service
 *
 * PASS 본인인증 비즈니스 로직
 * - 만 19세 이상 판정
 * - 인증 만료 여부 확인
 * - CI 해시 처리
 * - 인증 상태 조회/완료 처리
 * - 인증 이벤트 로그 생성
 */

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { ADULT_VERIFICATION } from "@/constants/adult-verification";
import type { VerificationStatus, VerificationEventType } from "@/types/adult-verification";

// ============================================================
// CONSTANTS
// ============================================================
const ADULT_AGE = ADULT_VERIFICATION.ADULT_AGE; // 19세
const VERIFICATION_EXPIRY_DAYS = ADULT_VERIFICATION.EXPIRY_DAYS; // 365일

// ============================================================
// TYPE DEFINITIONS
// ============================================================
export interface VerificationStatusResult {
  status: VerificationStatus;
  verifiedAt: Date | null;
}

export interface CompleteVerificationParams {
  profileId: string;
  txid: string;
  method: string;
  provider: string;
  ciHash: string;
}

export interface CreateVerificationLogParams {
  profileId: string;
  txid: string;
  eventType: VerificationEventType;
  failureCode?: string;
}

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * 성인 여부 확인 (만 19세 이상)
 *
 * @param birthDate - 생년월일 (YYYY-MM-DD 형식)
 * @returns 만 19세 이상이면 true, 미만이면 false
 *
 * @example
 * isAdult("2007-01-02") // 2026-01-02 기준 true (정확히 19세)
 * isAdult("2007-01-03") // 2026-01-02 기준 false (아직 18세)
 */
export function isAdult(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const today = new Date();

  // 기본 나이 계산 (년도 차이)
  let age = today.getFullYear() - birth.getFullYear();

  // 생일이 아직 안 왔으면 나이 1 감소
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= ADULT_AGE;
}

/**
 * 인증 만료 여부 확인
 *
 * @param verifiedAt - 인증 완료 일시 (null이면 미인증)
 * @returns 만료되었으면 true, 유효하면 false
 *
 * @description
 * - null이면 true (미인증 상태)
 * - 365일 경과 시 true (만료)
 * - 365일 미만이면 false (유효)
 */
export function isVerificationExpired(verifiedAt: Date | null): boolean {
  if (!verifiedAt) {
    return true; // 미인증은 만료로 취급
  }

  const expiryDate = new Date(verifiedAt);
  expiryDate.setDate(expiryDate.getDate() + VERIFICATION_EXPIRY_DAYS);

  const now = new Date();
  return now >= expiryDate;
}

/**
 * CI 해시 생성 (SHA-256 + salt)
 *
 * @param ci - 연계정보 (CI) 원문
 * @returns SHA-256 해시된 문자열 (64자리 hex)
 * @throws salt 환경변수가 없으면 에러
 *
 * @description
 * CI 원문은 저장하지 않고 해시만 저장
 * salt는 환경변수 ADULT_VERIFICATION_CI_SALT에서 가져옴
 */
export function hashCi(ci: string): string {
  const salt = process.env.ADULT_VERIFICATION_CI_SALT;

  if (!salt) {
    throw new Error("ADULT_VERIFICATION_CI_SALT environment variable is not set");
  }

  return crypto
    .createHash("sha256")
    .update(ci + salt)
    .digest("hex");
}

/**
 * 사용자 인증 상태 조회
 *
 * @param profileId - 프로필 ID
 * @returns 인증 상태 (PENDING, VERIFIED, EXPIRED, FAILED)와 인증 일시
 * @throws 프로필이 없으면 에러
 *
 * @description
 * - PENDING: isAdultVerified=false
 * - VERIFIED: isAdultVerified=true && 미만료
 * - EXPIRED: isAdultVerified=true && 365일 경과
 * - FAILED: 마지막 로그가 FAILED인 경우
 */
export async function getVerificationStatus(
  profileId: string
): Promise<VerificationStatusResult> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      isAdultVerified: true,
      adultVerifiedAt: true,
    },
  });

  if (!profile) {
    throw new Error(`Profile not found: ${profileId}`);
  }

  // 미인증 상태
  if (!profile.isAdultVerified) {
    return {
      status: "PENDING",
      verifiedAt: null,
    };
  }

  // 인증 완료 상태 - 만료 여부 확인
  if (isVerificationExpired(profile.adultVerifiedAt)) {
    return {
      status: "EXPIRED",
      verifiedAt: profile.adultVerifiedAt,
    };
  }

  // 인증 완료 및 유효
  return {
    status: "VERIFIED",
    verifiedAt: profile.adultVerifiedAt,
  };
}

/**
 * 인증 완료 처리
 *
 * @param params - 인증 완료 정보
 *
 * @description
 * Profile 업데이트:
 * - isAdultVerified: true
 * - adultVerifiedAt: 현재 시간
 * - adultVerifyMethod: 인증 방식 (PHONE)
 * - adultVerifyProvider: 제공사 (PORTONE_KCP, PORTONE_DANAL)
 * - adultVerifyTxid: 거래 ID
 * - ciHash: SHA-256 해시된 CI
 */
export async function completeVerification(
  params: CompleteVerificationParams
): Promise<void> {
  const { profileId, txid, method, provider, ciHash } = params;

  await prisma.profile.update({
    where: { id: profileId },
    data: {
      isAdultVerified: true,
      adultVerifiedAt: new Date(),
      adultVerifyMethod: method,
      adultVerifyProvider: provider,
      adultVerifyTxid: txid,
      ciHash: ciHash,
    },
  });
}

/**
 * 인증 이벤트 로그 생성
 *
 * @param params - 로그 생성 정보
 *
 * @description
 * AdultVerificationLog 레코드 생성:
 * - INITIATED: 인증 시작
 * - SUCCESS: 인증 성공
 * - FAILED: 인증 실패 (failureCode 포함)
 */
export async function createVerificationLog(
  params: CreateVerificationLogParams
): Promise<void> {
  const { profileId, txid, eventType, failureCode } = params;

  await prisma.adultVerificationLog.create({
    data: {
      profileId,
      txid,
      eventType,
      failureCode,
    },
  });
}

/**
 * 중복 콜백 확인
 *
 * @param txid - 본인인증 거래 ID
 * @returns 동일 txid로 SUCCESS 로그가 이미 있으면 true
 *
 * @description
 * 동일한 txid로 이미 SUCCESS 로그가 있는지 확인하여
 * 중복 콜백을 방지합니다.
 */
export async function isDuplicateCallback(txid: string): Promise<boolean> {
  const existingLog = await prisma.adultVerificationLog.findFirst({
    where: {
      txid,
      eventType: "SUCCESS",
    },
  });

  return existingLog !== null;
}
