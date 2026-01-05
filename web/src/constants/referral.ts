/**
 * Referral Milestone System Constants
 *
 * TBR 추천인 마일스톤 시스템
 * - 피추천인(B)의 구독 유지 기간에 따라 추천인(A)에게 보상
 * - 즉시 보상 없음, 마일스톤 기반 보상만 제공
 */

// ============================================================
// MILESTONE DEFINITIONS
// B의 구독 유지 기간 → A의 보상
// ============================================================

export const REFERRAL_MILESTONES = [
  {
    months: 3,
    points: 3000,
    name: "3개월 유지",
    description: "피추천인이 3개월간 구독을 유지했습니다",
  },
  {
    months: 6,
    points: 5000,
    name: "6개월 유지",
    description: "피추천인이 6개월간 구독을 유지했습니다",
  },
  {
    months: 12,
    points: 10000,
    name: "12개월 유지 (최종)",
    description: "피추천인이 1년간 구독을 유지했습니다! 최종 마일스톤 달성!",
  },
] as const;

// 총 최대 보상: 3,000 + 5,000 + 10,000 = 18,000P (추천인당)
export const MAX_POINTS_PER_REFERRAL = REFERRAL_MILESTONES.reduce(
  (sum, m) => sum + m.points,
  0
);

// ============================================================
// REFERRAL CODE CONFIG
// ============================================================

export const REFERRAL_CODE_CONFIG = {
  prefix: "TBR",
  length: 6, // prefix 제외 길이
  // 혼동되기 쉬운 문자 제외: 0, O, I, L, 1
  charset: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
} as const;

// ============================================================
// POINTS CONFIG
// ============================================================

export const POINTS_CONFIG = {
  // 포인트 만료 기간 (개월)
  expirationMonths: 12,

  // 포인트 사용 최소 단위
  minUsageUnit: 1000,

  // 최소 사용 가능 잔액
  minUsableBalance: 1000,
} as const;

// ============================================================
// TYPE EXPORTS
// ============================================================

export type ReferralMilestone = (typeof REFERRAL_MILESTONES)[number];
export type MilestoneMonths = ReferralMilestone["months"];
