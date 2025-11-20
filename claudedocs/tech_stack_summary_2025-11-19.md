# TeddyBear'sRoom - 최종 확정 기술 스택

**작성일**: 2025-11-19
**결정**: Next.js Full Stack 개발 전략 채택

---

## 📋 개발 전략 결정

### 핵심 결정 사항
- **WordPress MVP 전략 폐기** → **Next.js Full Stack 직접 개발**
- **출시 목표**: 5-7주 (WordPress와 동일)
- **개발 방식**: Claude Code를 활용한 solo development
- **차별화 기능**: 3가지 핵심 기능 포함 (구독, 스마트 추천, 기부 투표)

### 결정 배경
1. **동일한 출시 시간**: WordPress 커스터마이징과 Next.js 신규 개발 모두 5-7주 소요
2. **낮은 운영비**: 5-10만원/월 (WordPress 60만원/월 대비 절감)
3. **차별화 기능 구현 용이**: 커스텀 개발로 독특한 기능 구현 가능
4. **Claude Code 완벽 호환**: 모든 개발을 Claude Code가 지원
5. **미래 확장성**: 완전한 제어권과 확장 가능성 확보

---

## 🎨 Frontend Stack

### Core Framework
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Analytics**: Google Analytics 4 + Hotjar

### 선택 이유
- **Next.js 14**: SSR/SSG 지원, SEO 최적화, 빠른 성능
- **TypeScript**: 타입 안정성, 코드 품질 향상
- **Tailwind CSS**: 빠른 개발 속도, 반응형 디자인
- **shadcn/ui**: 접근성이 뛰어난 미리 제작된 컴포넌트
- **Zustand**: 간단하고 가벼운 상태 관리
- **React Hook Form**: 성능 최적화된 폼 관리

---

## ⚙️ Backend Stack

### Core Backend
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Realtime**: Supabase Realtime

### 선택 이유
- **Next.js API Routes**: Frontend와 동일 프로젝트, 배포 단순화
- **Supabase**: PostgreSQL 기반, 관리형 서비스, 자동 백업
- **Prisma**: 타입 안전 ORM, 마이그레이션 관리
- **Supabase Auth**: 소셜 로그인, 이메일 인증 내장
- **Supabase Realtime**: 실시간 기능 (투표 시스템 등)

---

## 💳 Payment & Integration

### Payment
- **결제 시스템**: TossPayments SDK
- **통합 방식**: 직접 SDK 통합
- **지원 기능**: 일반 결제 + 정기 결제(빌링)

### External Services
- **Notion API**: 프로젝트 문서 동기화
- **Email**: Resend (트랜잭션 이메일)
- **SMS**: Aligo 또는 NCP SMS

### 선택 이유
- **TossPayments**: 국내 최저 수수료, 정기결제 지원, 안정성
- **Resend**: 개발자 친화적 API, 합리적 가격
- **Aligo/NCP**: 국내 SMS 서비스, 안정적 전송

---

## ☁️ Infrastructure

### Hosting & Deployment
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Domain**: TeddyBearsRoom.shop (.shop TLD)
- **Monitoring**: Vercel Analytics + Sentry

### 선택 이유
- **Vercel**: Next.js 최적화, 자동 스케일링, 글로벌 CDN
- **Vercel Edge Network**: 전 세계 빠른 응답 속도
- **.shop TLD**: E-commerce에 최적화된 도메인
- **Sentry**: 에러 추적 및 모니터링

---

## 🏗️ 핵심 기능 아키텍처

### 1. 구독 멤버십 시스템

**Database Schema** (Supabase):
```typescript
subscriptions:
  - id: uuid
  - user_id: references auth.users
  - tier: 'entry' | 'premium'  // 엔트리(19,900원) vs 프리미엄(29,900원)
  - status: 'active' | 'paused' | 'cancelled'
  - next_billing_date: timestamp
  - points_multiplier: 2 | 4  // 포인트 적립 배수
  - donation_percentage: 5 | 10  // 기부 비율(%)
```

**TossPayments 통합**:
- 정기결제(빌링키) 자동화
- 결제 실패 시 재시도 로직
- 구독 일시정지/재개 기능
- 티어 변경 처리

---

### 2. 스마트 사이즈 추천 시스템

**Privacy-First Architecture**:
```typescript
size_recommendations:
  - id: uuid
  - user_id: references auth.users
  - encrypted_measurements: jsonb  // AES-256 암호화
  - product_preferences: jsonb
  - recommendation_history: jsonb[]
```

**보안 설계**:
- 민감 정보는 서버에서 암호화 저장
- 클라이언트에서만 복호화 (사용자 키 기반)
- 추천 알고리즘은 암호화된 상태로 실행
- 개인정보보호법 완벽 준수

---

### 3. 기부 투표 시스템

**Real-time Voting with Supabase**:
```typescript
donation_votes:
  - id: uuid
  - month: date
  - foundation_id: uuid
  - vote_count: integer
  - tier_weighted_score: decimal  // 프리미엄 회원 2배 가중치
```

**Supabase Realtime 활용**:
- 실시간 투표 현황 업데이트
- 월별 자동 집계
- 티어별 가중치 적용 (엔트리 1배, 프리미엄 2배)
- 투명한 결과 공개

---

## 📅 개발 로드맵

### Week 1-2: Foundation
**목표**: 프로젝트 기반 구축

- Next.js 14 프로젝트 초기화
- Supabase 프로젝트 생성 및 설정
- Prisma schema 정의
- 기본 라우팅 구조 설정

**Core Pages**:
- 홈페이지
- 제품 목록/상세
- 장바구니
- 회원가입/로그인

---

### Week 3-4: E-commerce Core
**목표**: 기본 쇼핑몰 기능 완성

**Features**:
- TossPayments 결제 통합
- 주문 프로세스 구현
- 회원 마이페이지
- 관리자 대시보드 (기본)

**Database**:
- 제품 관리 시스템
- 재고 추적
- 주문 상태 관리

---

### Week 5-6: Differentiators (차별화 기능)
**목표**: 3가지 핵심 차별화 기능 구현

**구독 시스템**:
- TossPayments 정기결제 설정
- 구독 관리 UI (일시정지/재개/취소)
- 포인트 시스템 (2배/4배 적립)

**스마트 추천**:
- 사이즈 입력 폼
- 추천 알고리즘 구현
- 개인정보 암호화 시스템

**기부 투표**:
- 실시간 투표 인터페이스
- Supabase Realtime 집계
- 월별 투표 리포트

---

### Week 7: Polish & Launch
**목표**: 출시 준비 및 배포

**Final Steps**:
- 성능 최적화 (Lighthouse 90+ 목표)
- SEO 설정 및 메타데이터
- 보안 점검 (OWASP Top 10)
- Vercel 배포 및 모니터링 설정
- 도메인 연결 (TeddyBearsRoom.shop)

---

## 💰 비용 분석

### 초기 개발 비용
- **개발자 인건비**: 0원 (본인 직접 개발)
- **Claude Code**: 이미 구독 중
- **도메인**: 약 30,000원/년

**Total 초기 비용**: ~30,000원

---

### 월 운영비 (예상)

#### Infrastructure (고정비)
- **Vercel Pro**: $20/월 (약 26,000원)
- **Supabase Pro**: $25/월 (약 32,500원)

#### Services (변동비)
- **TossPayments**: 거래당 2.9% + 200원 (거래 발생 시만)
- **Resend**: 무료 (월 3,000통) → Pro $20/월 (필요 시)
- **SMS**: 건당 15-20원 (발송 시만)

#### Analytics
- **Google Analytics**: 무료
- **Hotjar**: 무료 (기본 플랜)
- **Sentry**: 무료 (Developer 플랜)

**Total 월 운영비**: 약 **5-10만원** (트래픽에 따라 변동)

---

## 🎯 성공 기준

### MVP Launch Success (Week 7)
- ✅ 기본 e-commerce 기능 100% 작동
- ✅ 구독 시스템 정상 작동
- ✅ 스마트 추천 기능 구현
- ✅ 기부 투표 시스템 작동
- ✅ 결제 성공률 > 99%

### Technical Success
- ✅ Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
- ✅ 0 critical security issues
- ✅ < 2초 page load time
- ✅ 99.9% uptime (Vercel SLA)

### Business Success
- ✅ 차별화 기능 3개 모두 구현
- ✅ 유지보수 가능한 코드베이스
- ✅ Claude Code로 지속 개발 가능
- ✅ 월 운영비 10만원 이하 유지

---

## ⚠️ 리스크 관리

### Technical Risks

**Learning Curve** (Low Risk)
- **리스크**: React/Next.js 경험 부족
- **완화**: Claude Code가 모든 코드 작성 지원
- **백업**: shadcn/ui로 UI 복잡도 감소

**Scalability** (Low Risk)
- **리스크**: 트래픽 증가 시 성능 저하
- **완화**: Vercel 자동 스케일링, Supabase 자동 백업
- **백업**: Edge functions for performance

### Business Risks

**Time to Market** (Medium Risk)
- **목표**: 5-7주 출시
- **완화**: MVP 기능 우선 구현, 차별화 기능 포함
- **백업**: 필요 시 일부 기능 Phase 2로 이월

**Maintenance** (Low Risk)
- **리스크**: 장기 유지보수 부담
- **완화**: Claude Code로 지속 관리, Vercel/Supabase 관리형 서비스
- **백업**: 자동화된 모니터링 및 알림

---

## 📚 참고 문서

### 프로젝트 문서
- **CLAUDE.md**: 전체 프로젝트 가이드
- **기술 스택 연구 보고서**: 각 기술 선택의 상세 근거

### 외부 문서
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TossPayments 개발 가이드](https://docs.tosspayments.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

## ✅ 다음 단계

### Immediate Actions
1. ✅ 기술 스택 확정 완료
2. ⏳ Notion 페이지에 이 내용 복사
3. ⏳ 개발 환경 설정 시작
4. ⏳ Supabase 프로젝트 생성
5. ⏳ Vercel 계정 설정

### Week 1 시작 준비
- [ ] Next.js 14 프로젝트 초기화
- [ ] GitHub repository 생성
- [ ] Supabase 프로젝트 연결
- [ ] 기본 프로젝트 구조 설정

---

**작성자**: Claude Code
**작성 일시**: 2025-11-19
**문서 버전**: v1.0
