/**
 * Hooks Barrel Export
 * TeddyBear's Room - Custom React Hooks
 */

// Auth Hooks
export { useAuth, useUser, useIsAuthenticated } from './use-auth'
export type { AuthState, UseAuthReturn } from './use-auth'

// Referral Hooks
export { useReferralMilestones } from './use-referral-milestones'
export type {
  ReferralMilestone,
  ReferralStats,
  UseReferralMilestonesReturn,
} from './use-referral-milestones'

// Adult Verification Hooks
export { useAdultVerification } from './use-adult-verification'
export type { UseAdultVerificationReturn } from './use-adult-verification'
