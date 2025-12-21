# Research Report: Subscription Milestone & Referral System

**Date**: 2025-12-20
**Depth**: Ultrathink (Exhaustive)
**Confidence Level**: High (95%)

---

## Executive Summary

TeddyBear's Room의 Inner Circle (Roommate) 구독 프로그램을 강화하기 위한 **마일스톤 시스템**과 **추천인 시스템** 설계 연구 보고서입니다.

### Key Findings

| 영역 | 핵심 인사이트 | 기대 효과 |
|------|--------------|----------|
| 마일스톤 | 게이미피케이션으로 고객 유지율 30% 향상 | 구독 이탈 감소 |
| 추천인 | 양면 보상(Give & Get)이 90%+ 프로그램에서 사용 | 바이럴 성장 |
| 티어 시스템 | 진행 기반 티어가 재구매 의사 47% 증가 | LTV 향상 |

---

## 1. Market Research Results

### 1.1 Gamification Statistics (2024-2025)

```
┌─────────────────────────────────────────────────────────────┐
│  게이미피케이션 시장 규모: $95.5B by 2030 (Projected)       │
├─────────────────────────────────────────────────────────────┤
│  참여도 증가: +47% (with gamification)                      │
│  유지율 향상: +30% (gamified loyalty programs)              │
│  전환율 증가: +7x (proper gamification implementation)      │
│  재구매 의향: 80%+ (loyalty program members)                │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Referral Program Benchmarks

| 기업 | 전략 | 결과 |
|------|------|------|
| Dropbox | Give Storage, Get Storage | 3,900% 성장 (15개월) |
| PayPal | $20 양면 보상 | 일 10% 성장, 5M 유저 (6개월) |
| A Box of Stories | 리퍼럴 + 구독박스 | 3,000% ROI, 리퍼럴률 7-8% |
| Slack | 간편한 초대 시스템 | 바이럴 계수 8.5 |

### 1.3 Viral Coefficient Formula

```
K = i × c

where:
  K = Viral Coefficient (바이럴 계수)
  i = Invitations per user (사용자당 초대 수)
  c = Conversion rate (전환율)

K > 1 = Exponential Growth (지수 성장)
K < 1 = Requires paid acquisition (유료 획득 필요)

Target: K ≥ 1.2 for sustainable organic growth
```

---

## 2. Database Schema Design

### 2.1 New Models

```prisma
// ====== MILESTONE SYSTEM ======

model MilestoneDefinition {
  id              String   @id @default(uuid())
  code            String   @unique  // "SUB_1M", "SUB_6M", "SPEND_100K"
  name            String
  description     String?
  category        MilestoneCategory

  // Condition
  conditionType   ConditionType
  conditionValue  Int

  // Reward
  rewardType      RewardType
  rewardValue     Int
  rewardData      Json?

  // Display
  badgeIcon       String?
  sortOrder       Int      @default(0)
  isActive        Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  achievements    MilestoneAchievement[]

  @@map("milestone_definitions")
}

model MilestoneAchievement {
  id              String   @id @default(uuid())
  profileId       String
  milestoneId     String

  achievedAt      DateTime @default(now())
  rewardClaimed   Boolean  @default(false)
  rewardClaimedAt DateTime?

  profile         Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  milestone       MilestoneDefinition @relation(fields: [milestoneId], references: [id])

  @@unique([profileId, milestoneId])
  @@map("milestone_achievements")
}

// ====== REFERRAL SYSTEM ======

model Referral {
  id              String   @id @default(uuid())
  referrerId      String
  refereeId       String
  referralCode    String

  status          ReferralStatus @default(PENDING)

  referrerRewarded    Boolean   @default(false)
  referrerRewardedAt  DateTime?
  refereeRewarded     Boolean   @default(false)
  refereeRewardedAt   DateTime?

  refereeFirstOrderId String?
  refereeFirstOrderAt DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  referrer        Profile  @relation("ReferrerRelation", fields: [referrerId], references: [id])
  referee         Profile  @relation("RefereeRelation", fields: [refereeId], references: [id])

  @@unique([refereeId])
  @@map("referrals")
}

// ====== POINTS SYSTEM ======

model PointTransaction {
  id          String   @id @default(uuid())
  profileId   String
  amount      Int
  balance     Int

  type        PointTransactionType
  reason      String
  referenceId String?

  expiresAt   DateTime?
  createdAt   DateTime @default(now())

  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId, createdAt(sort: Desc)])
  @@map("point_transactions")
}

// ====== ENUMS ======

enum MilestoneCategory {
  SUBSCRIPTION
  SPENDING
  ENGAGEMENT
  REFERRAL
  SPECIAL
}

enum ConditionType {
  SUBSCRIPTION_MONTHS
  TOTAL_SPEND
  ORDERS_COUNT
  REFERRAL_COUNT
  REFERRAL_SPEND
  REVIEW_COUNT
}

enum RewardType {
  POINTS
  DISCOUNT_COUPON
  FREE_SHIPPING
  FREE_PRODUCT
  BADGE
  TIER_UPGRADE
}

enum ReferralStatus {
  PENDING
  CONVERTED
  REWARDED
  EXPIRED
  CANCELLED
}

enum PointTransactionType {
  EARN_MILESTONE
  EARN_REFERRAL
  EARN_ORDER
  EARN_REVIEW
  EARN_EVENT
  USE_ORDER
  EXPIRE
  ADMIN_ADJUST
}
```

### 2.2 Profile Model Extensions

```prisma
model Profile {
  // ... existing fields ...

  // Referral System
  referralCode        String?  @unique
  referredBy          String?
  totalReferrals      Int      @default(0)
  totalReferralPoints Int      @default(0)

  // Relations
  referralsMade       Referral[] @relation("ReferrerRelation")
  referralReceived    Referral?  @relation("RefereeRelation")
  milestones          MilestoneAchievement[]
  pointTransactions   PointTransaction[]
}
```

---

## 3. Milestone Definitions

### 3.1 Subscription Milestones

```
┌─────────────────────────────────────────────────────────────┐
│  SUB_1M   │ 첫 달 완주      │ 1개월  │ 1,000P   │ 🌱       │
│  SUB_3M   │ 한 분기 동행    │ 3개월  │ 3,000P   │ 🌿       │
│  SUB_6M   │ 반년의 여정     │ 6개월  │ 15% 쿠폰 │ 🌳       │
│  SUB_12M  │ 1년 함께        │ 12개월 │ 15,000P  │ 🏆       │
│  SUB_24M  │ 레전드 룸메이트 │ 24개월 │ 티어UP   │ 👑       │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Spending Milestones

```
┌─────────────────────────────────────────────────────────────┐
│  SPEND_50K  │ 5만원 구매   │ ₩50,000   │ 500P     │ 🛒     │
│  SPEND_100K │ 10만원 구매  │ ₩100,000  │ 1,500P   │ 💎     │
│  SPEND_500K │ 50만원 구매  │ ₩500,000  │ 20% 쿠폰 │ 🌟     │
│  SPEND_1M   │ 100만원 구매 │ ₩1,000,000│ 특별선물 │ 💫     │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Referral Milestones

```
┌─────────────────────────────────────────────────────────────┐
│  REF_1  │ 첫 추천       │ 1명   │ 2,000P   │ 🤝         │
│  REF_5  │ 인플루언서    │ 5명   │ 10,000P  │ 📢         │
│  REF_10 │ TBR 홍보대사  │ 10명  │ 25% 쿠폰 │ 🎖️         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Referral System Design

### 4.1 Reward Structure (Give & Get)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   "Give 3,000, Get 5,000"                                   │
│                                                              │
│   ┌─────────────┐              ┌─────────────┐              │
│   │  Referrer   │              │   Referee   │              │
│   │  (추천자)   │              │  (피추천자) │              │
│   └──────┬──────┘              └──────┬──────┘              │
│          │                            │                      │
│          │    Share Code: TBR2X4K9M   │                      │
│          └────────────────────────────┤                      │
│                                       ▼                      │
│                              ┌────────────────┐              │
│                              │ 회원가입 완료   │              │
│                              │ +3,000P 즉시   │              │
│                              └───────┬────────┘              │
│                                      │                       │
│                                      ▼                       │
│                              ┌────────────────┐              │
│                              │ 첫 주문 완료   │              │
│                              │ (30일 이내)    │              │
│                              └───────┬────────┘              │
│          ┌───────────────────────────┘                       │
│          ▼                                                   │
│   ┌──────────────┐                                           │
│   │ +5,000P 지급 │                                           │
│   │ 마일스톤체크 │                                           │
│   └──────────────┘                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Configuration Constants

```typescript
// src/constants/referral.ts
export const REFERRAL_CONFIG = {
  // Rewards
  REFEREE_SIGNUP_POINTS: 3000,
  REFERRER_CONVERSION_POINTS: 5000,

  // Limits
  CONVERSION_DAYS: 30,
  MAX_REFERRALS_PER_DAY: 10,
  MIN_ORDER_AMOUNT: 30000,

  // Code Format
  CODE_PREFIX: 'TBR',
  CODE_LENGTH: 6,

  // Share URL
  SHARE_URL_TEMPLATE: 'https://teddybearsroom.com/join?ref={code}',
} as const;
```

### 4.3 Referral Code Generation

```typescript
const generateReferralCode = (): string => {
  // Exclude confusing characters: 0, O, I, L, 1
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomPart = Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  return `TBR${randomPart}`;  // e.g., TBR2X4K9M
};
```

---

## 5. Implementation Architecture

### 5.1 Directory Structure

```
web/src/
├── app/
│   ├── api/
│   │   ├── milestones/
│   │   │   ├── check/route.ts
│   │   │   └── claim/route.ts
│   │   ├── referrals/
│   │   │   ├── code/route.ts
│   │   │   ├── validate/route.ts
│   │   │   └── stats/route.ts
│   │   └── points/
│   │       ├── balance/route.ts
│   │       └── history/route.ts
│   └── (shop)/
│       └── my/
│           ├── milestones/page.tsx
│           ├── referral/page.tsx
│           └── points/page.tsx
├── lib/
│   └── services/
│       ├── milestone.service.ts
│       ├── referral.service.ts
│       └── points.service.ts
├── components/
│   ├── milestones/
│   ├── referral/
│   └── points/
└── constants/
    ├── milestones.ts
    └── referral.ts
```

### 5.2 Trigger Points

```
┌─────────────────────────────────────────────────────────────┐
│                    Milestone Check Triggers                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Subscription Payment Success                             │
│     └─ Webhook: BILLING_SUCCESS → checkMilestones()         │
│                                                              │
│  2. Order Completed                                          │
│     └─ Order.status → PAID → checkMilestones()              │
│                                                              │
│  3. Referral Converted                                       │
│     └─ Referral.status → CONVERTED → checkMilestones()      │
│                                                              │
│  4. Daily Scheduler (Vercel Cron)                            │
│     └─ 매일 자정 → 전체 구독자 마일스톤 체크                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Service Layer

```typescript
// lib/services/milestone.service.ts
class MilestoneService {
  async checkMilestones(profileId: string): Promise<Achievement[]> {
    const profile = await getProfileWithStats(profileId);
    const definitions = await getActiveMilestones();

    const newAchievements: Achievement[] = [];

    for (const milestone of definitions) {
      if (await this.isAlreadyAchieved(profileId, milestone.id)) continue;
      if (this.meetsCondition(profile, milestone)) {
        const achievement = await this.createAchievement(profileId, milestone);
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  async claimReward(profileId: string, achievementId: string): Promise<boolean> {
    return await transaction(async (tx) => {
      const achievement = await tx.milestoneAchievement.findUnique({
        where: { id: achievementId },
        include: { milestone: true }
      });

      if (!achievement || achievement.rewardClaimed) return false;

      await this.grantReward(tx, profileId, achievement.milestone);

      await tx.milestoneAchievement.update({
        where: { id: achievementId },
        data: { rewardClaimed: true, rewardClaimedAt: new Date() }
      });

      return true;
    });
  }
}
```

---

## 6. Implementation Phases

### Phase 1: Database & Core (3-4 days)

- [ ] Prisma schema migration
- [ ] Referral code generation on signup
- [ ] Referral validation API
- [ ] Points transaction service

### Phase 2: Milestone System (2-3 days)

- [ ] Milestone definitions seed data
- [ ] Milestone check logic
- [ ] Webhook integration
- [ ] Claim reward API

### Phase 3: UI/UX (3-4 days)

- [ ] My Milestones page
- [ ] My Referral page (code share, stats)
- [ ] Points history page
- [ ] Progress indicators & badges

### Phase 4: Polish (1-2 days)

- [ ] Notification system
- [ ] Share integrations (KakaoTalk, SMS)
- [ ] Admin dashboard

**Total Estimated: 1-2 weeks**

---

## 7. Success Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Referral Share Rate | 15-30% | 공유 수 / 전체 구독자 |
| Referral Conversion Rate | 10-25% | 전환 수 / 가입 수 |
| Milestone Engagement | 60%+ | 마일스톤 확인 비율 |
| Subscription Retention | +15% | 6개월 유지율 향상 |
| Viral Coefficient | ≥ 1.0 | K = i × c |

---

## 8. Sources

### Gamification & Milestones
- [Userpilot - Gamification Examples in SaaS](https://userpilot.com/blog/gamification-example-saas/)
- [Shopify - How Ecommerce Gamification Drives Sales](https://www.shopify.com/blog/ecommerce-gamification)
- [Growave - Gamification in Loyalty Programs](https://www.growave.io/blog/gamification-loyalty-programs)
- [Loyoly - Tiered Loyalty Programs: 12 Examples](https://www.loyoly.io/blog/tiered-loyalty-programs)
- [Yotpo - ECommerce Gamification Skyrockets Customer Retention](https://www.yotpo.com/blog/customer-loyalty-ecommerce-gamification/)

### Referral Programs
- [Referral Factory - Double Sided Referral Program](https://referral-factory.com/learn/double-sided-referral-program)
- [Viral Loops - Dropbox Marketing: 3900% Growth](https://viral-loops.com/blog/dropbox-grew-3900-simple-referral-program/)
- [Viral Loops - Subscription Box Referral Program](https://viral-loops.com/blog/subscription-box-referral-program-2/)
- [Impact - Referral Program Guide 2025](https://impact.com/referral/7-proven-strategies-for-growth/)
- [Friendbuy - Choosing the Right Incentive Structure](https://www.friendbuy.com/blog/referral-incentive-structure)
- [ReferralCandy - A Box of Stories Case Study](https://www.referralcandy.com/case-studies/a-box-of-stories)

---

**Report Generated**: 2025-12-20
**Status**: Ready for Implementation
