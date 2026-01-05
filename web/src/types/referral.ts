/**
 * Referral & Milestone Types for TeddyBear's Room
 *
 * 추천인 마일스톤 시스템 타입 정의
 * - 추천인(referrer)이 피추천인(referee)을 등록하면 Referral 생성
 * - 피추천인의 구독 유지 기간에 따라 마일스톤 달성
 * - 마일스톤 달성 시 포인트 지급
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Referral Flow                                              │
 * │                                                             │
 * │  Referrer ──invite──> Referee ──subscribe──> Milestones    │
 * │     │                    │                       │          │
 * │     └── earns points <───┴── 3/6/12 months ──────┘          │
 * └─────────────────────────────────────────────────────────────┘
 */

// =============================================================================
// Milestone Types
// =============================================================================

/**
 * 마일스톤 개월 수 타입
 * - 3개월: Bronze (500 포인트)
 * - 6개월: Silver (1,000 포인트)
 * - 12개월: Gold (2,000 포인트)
 */
export type MilestoneMonths = 3 | 6 | 12;

/**
 * 마일스톤 상태
 * - pending: 아직 달성하지 않음
 * - achieved: 달성했으나 포인트 미수령
 * - claimed: 포인트 수령 완료
 */
export type MilestoneStatus = "pending" | "achieved" | "claimed";

/**
 * 개별 마일스톤 진행 상황
 */
export interface MilestoneProgress {
  /** 마일스톤 개월 수 */
  months: MilestoneMonths;
  /** 지급 포인트 */
  points: number;
  /** 마일스톤 이름 (예: "Bronze", "Silver", "Gold") */
  name: string;
  /** 마일스톤 설명 */
  description: string;
  /** 현재 상태 */
  status: MilestoneStatus;
  /** 달성 일시 (achieved 또는 claimed 상태일 때) */
  achievedAt?: Date;
  /** 포인트 수령 일시 (claimed 상태일 때) */
  claimedAt?: Date;
}

// =============================================================================
// Referral Status Types
// =============================================================================

/**
 * 단일 추천 건의 마일스톤 현황
 * 추천인 대시보드에서 각 피추천인별 진행 상황 표시용
 */
export interface ReferralMilestoneStatus {
  /** Referral 레코드 ID */
  referralId: string;
  /** 피추천인 ID */
  refereeId: string;
  /** 피추천인 표시명 (마스킹된 이름 또는 닉네임) */
  refereeName: string;
  /** 피추천인의 구독 시작일 (null이면 아직 구독 전) */
  subscriptionStartedAt: Date | null;
  /** 구독 유지 개월 수 */
  monthsSubscribed: number;
  /** 각 마일스톤별 진행 상황 */
  milestones: MilestoneProgress[];
}

// =============================================================================
// Statistics Types
// =============================================================================

/**
 * 추천인의 전체 통계
 * 마이페이지 추천 현황 대시보드용
 */
export interface ReferralStats {
  /** 총 추천 수 (모든 상태 포함) */
  totalReferrals: number;
  /** 활성 추천 수 (피추천인이 현재 구독 중) */
  activeReferrals: number;
  /** 완료된 추천 수 (12개월 마일스톤 달성) */
  completedReferrals: number;
  /** 누적 획득 포인트 */
  totalPointsEarned: number;
  /** 미수령 포인트 (achieved 상태 마일스톤 합계) */
  unclaimedPoints: number;
  /** 각 추천별 상세 현황 */
  referrals: ReferralMilestoneStatus[];
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * 마일스톤 포인트 수령 API 응답
 */
export interface ClaimMilestoneResponse {
  /** 성공 여부 */
  success: boolean;
  /** 수령한 포인트 (성공 시) */
  points?: number;
  /** 에러 메시지 (실패 시) */
  error?: string;
}

/**
 * 추천 코드 생성 API 응답
 */
export interface GenerateReferralCodeResponse {
  /** 성공 여부 */
  success: boolean;
  /** 생성된 추천 코드 */
  code?: string;
  /** 추천 코드 만료일 */
  expiresAt?: Date;
  /** 에러 메시지 (실패 시) */
  error?: string;
}

/**
 * 추천 코드 검증 API 응답
 */
export interface ValidateReferralCodeResponse {
  /** 유효 여부 */
  valid: boolean;
  /** 추천인 정보 (유효할 때) */
  referrer?: {
    id: string;
    name: string;
  };
  /** 에러 메시지 (무효할 때) */
  error?: string;
}

// =============================================================================
// Input Types
// =============================================================================

/**
 * 마일스톤 포인트 수령 요청
 */
export interface ClaimMilestoneInput {
  /** Referral ID */
  referralId: string;
  /** 마일스톤 개월 수 */
  months: MilestoneMonths;
}

/**
 * 추천 코드 적용 요청
 */
export interface ApplyReferralCodeInput {
  /** 추천 코드 */
  code: string;
}

// =============================================================================
// Constants
// =============================================================================

/**
 * 마일스톤 포인트 설정
 *
 * ┌──────────────────────────────────────────┐
 * │  Milestone   │  Months  │  Points        │
 * ├──────────────┼──────────┼────────────────┤
 * │  Bronze      │    3     │    500         │
 * │  Silver      │    6     │  1,000         │
 * │  Gold        │   12     │  2,000         │
 * └──────────────┴──────────┴────────────────┘
 */
export const MILESTONE_CONFIG: Record<
  MilestoneMonths,
  { name: string; points: number; description: string }
> = {
  3: {
    name: "Bronze",
    points: 500,
    description: "3개월 구독 유지 달성",
  },
  6: {
    name: "Silver",
    points: 1000,
    description: "6개월 구독 유지 달성",
  },
  12: {
    name: "Gold",
    points: 2000,
    description: "12개월 구독 유지 달성",
  },
} as const;
