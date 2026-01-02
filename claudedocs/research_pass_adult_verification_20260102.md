# PASS 성인인증 도입 연구 보고서

**작성일**: 2026-01-02
**프로젝트**: TeddyBear's Room (성인용품 E-commerce)
**목적**: 성인인증 PASS 서비스 도입 방안 조사

---

## Executive Summary

TeddyBear's Room은 성인용품 쇼핑몰로서 **청소년보호법**에 따라 성인인증이 법적으로 필수입니다. 본 보고서는 PASS 본인확인 서비스 도입을 위한 기술적/비용적 분석을 제공합니다.

### 핵심 권장사항

| 항목 | 권장안 |
|------|--------|
| **연동 방식** | 포트원(PortOne) 통합인증 |
| **인증 수단** | KG이니시스 통합인증 (PASS 포함) |
| **비용** | 건당 40원 (가입비 무료) |
| **개발 기간** | 1-2주 |

---

## 1. 법적 요구사항

### 1.1 관련 법규

- **청소년보호법**: 성인용품은 청소년 유해물건으로 분류
- **정보통신망 이용촉진 및 정보보호 등에 관한 법률**: 유해정보 접근 제한 의무

### 1.2 처벌 규정

| 위반 사항 | 처벌 |
|----------|------|
| 청소년에게 유해물건 판매 | 3년 이하 징역 또는 3,000만원 이하 벌금 |
| 청소년 출입금지업소 출입 허용 | 2년 이하 징역 또는 2,000만원 이하 벌금 |

### 1.3 인증 요건

- 만 19세 이상 확인 필수
- 본인 명의 휴대폰 또는 공인인증 필요
- CI(연계정보)/DI(중복가입확인정보) 활용 가능

---

## 2. 본인인증 서비스 비교

### 2.1 제공업체별 비교

| 제공업체 | 방식 | 건당 비용 | 특징 |
|---------|------|----------|------|
| **다날** | 휴대폰 SMS | 월정액 5-30만원 | 전통적, 안정적 |
| **KG이니시스** | 통합인증 | 40원 | PASS/카카오/네이버 등 통합 |
| **NICE** | PASS API | 300-500원 | 직접 연동, 고비용 |
| **KCB** | 휴대폰/아이핀 | 400-600원 | 신용정보 연계 |

### 2.2 권장: 포트원 + KG이니시스 통합인증

**장점:**
- 건당 40원으로 최저 비용
- PASS, 카카오, 네이버, 토스 등 다양한 인증 수단 지원
- 포트원 가입비 무료
- JavaScript SDK로 간편 연동
- 기존 TossPayments 결제와 독립적으로 운영 가능

**지원 인증 수단:**
- PASS (SKT, KT, LGU+)
- 카카오 인증서
- 네이버 인증서
- 토스 인증서
- 금융인증서
- KB/신한/삼성패스 등

---

## 3. 기술 구현 방안

### 3.1 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                     │
│  PortOne.requestIdentityVerification()                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  PortOne SDK (Browser)                                  │
│  - 인증 팝업/리다이렉트 처리                             │
│  - identityVerificationId 반환                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Backend API Route (Next.js /api/auth/verify)           │
│  - PortOne REST API 호출                                 │
│  - 인증 결과 검증 (status === "VERIFIED")               │
│  - 생년월일로 성인 여부 확인                             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase Database                                      │
│  - Profile.isAdultVerified = true                       │
│  - Profile.adultVerifiedAt = timestamp                  │
│  - Profile.ci (선택적 저장)                              │
└─────────────────────────────────────────────────────────┘
```

### 3.2 구현 단계

#### Step 1: 포트원 설정
```bash
# SDK 설치
npm install @portone/browser-sdk
```

#### Step 2: 환경 변수
```env
# .env.local
PORTONE_STORE_ID=store-xxx
PORTONE_CHANNEL_KEY=channel-key-xxx
PORTONE_API_SECRET=xxx
```

#### Step 3: 프론트엔드 코드

```typescript
// components/AdultVerification.tsx
import PortOne from "@portone/browser-sdk/v2";

async function requestVerification() {
  const verificationId = `adult-verify-${crypto.randomUUID()}`;

  const response = await PortOne.requestIdentityVerification({
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
    identityVerificationId: verificationId,
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
  });

  if (response.code !== undefined) {
    throw new Error(response.message);
  }

  // 서버에서 검증
  const result = await fetch("/api/auth/verify-adult", {
    method: "POST",
    body: JSON.stringify({ identityVerificationId: verificationId }),
  });

  return result.json();
}
```

#### Step 4: 백엔드 검증

```typescript
// app/api/auth/verify-adult/route.ts
export async function POST(request: Request) {
  const { identityVerificationId } = await request.json();

  // 포트원 API로 인증 결과 조회
  const response = await fetch(
    `https://api.portone.io/identity-verifications/${identityVerificationId}`,
    {
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
      },
    }
  );

  const data = await response.json();

  if (data.status !== "VERIFIED") {
    return apiError("인증에 실패했습니다.", 400);
  }

  // 성인 여부 확인 (만 19세 이상)
  const birthDate = new Date(data.verifiedCustomer.birthDate);
  const age = calculateAge(birthDate);

  if (age < 19) {
    return apiError("만 19세 이상만 이용 가능합니다.", 403);
  }

  // DB 업데이트
  await prisma.profile.update({
    where: { id: user.id },
    data: {
      isAdultVerified: true,
      adultVerifiedAt: new Date(),
      // ci: data.verifiedCustomer.ci, // 선택적
    },
  });

  return apiSuccess({ verified: true });
}
```

### 3.3 DB 스키마 변경

```prisma
// prisma/schema.prisma
model Profile {
  // 기존 필드...

  isAdultVerified   Boolean   @default(false)
  adultVerifiedAt   DateTime?
  ci                String?   // 연계정보 (선택적)
}
```

---

## 4. 비용 분석

### 4.1 초기 비용

| 항목 | 비용 |
|------|------|
| 포트원 가입 | 무료 |
| KG이니시스 계약 | 무료 (포트원 통해 신청 시) |
| **합계** | **0원** |

### 4.2 운영 비용

| 항목 | 단가 | 예상 월간 | 월 비용 |
|------|------|----------|--------|
| 성인인증 | 40원/건 | 1,000건 | 40,000원 |
| 성인인증 | 40원/건 | 5,000건 | 200,000원 |
| 성인인증 | 40원/건 | 10,000건 | 400,000원 |

### 4.3 비용 최적화 전략

1. **1회 인증 후 저장**: 인증 완료 시 DB에 저장하여 재인증 방지
2. **CI 활용**: 동일인 재가입 시 CI로 기존 인증 확인
3. **세션 기반 캐싱**: 로그인 세션 동안 인증 상태 유지

---

## 5. 구현 일정 (권장)

| 단계 | 작업 | 소요 기간 |
|------|------|----------|
| 1 | 포트원 가입 및 KG이니시스 신청 | 1-3일 |
| 2 | DB 스키마 변경 (isAdultVerified 추가) | 1시간 |
| 3 | 성인인증 API 구현 | 1일 |
| 4 | 성인인증 UI 컴포넌트 구현 | 1일 |
| 5 | 인증 필수 페이지에 가드 적용 | 1일 |
| 6 | 테스트 및 QA | 2-3일 |
| **합계** | | **약 1-2주** |

---

## 6. 보안 고려사항

### 6.1 필수 보안 조치

- [ ] API 시크릿 환경 변수로 관리
- [ ] HTTPS 통신 필수
- [ ] identityVerificationId 서버에서만 검증
- [ ] CI/DI 암호화 저장 (저장 시)
- [ ] Rate Limiting 적용

### 6.2 개인정보 처리

- 최소한의 정보만 저장 (isAdultVerified, adultVerifiedAt)
- CI 저장 시 암호화 필수
- 개인정보처리방침 업데이트 필요

---

## 7. 참고 자료

### 공식 문서
- [포트원 본인인증 가이드](https://developers.portone.io/opi/ko/extra/identity-verification/readme-v2?v=v2)
- [NICE API 공식 사이트](https://www.niceapi.co.kr/)
- [KG이니시스 통합인증](https://manual.inicis.com/sa/)

### 기술 블로그
- [포트원 다날 본인인증 연동](https://www.hongreat.co.kr/blog/backend/포트원-다날-본인인증-api-연동하기)
- [NICE PASS 인증 API 연동 가이드](https://minseoky.me/etc/pass연동가이드/)
- [Node.js 나이스 본인인증 구현](https://velog.io/@simhw/Node.js-나이스-본인인증-API-구현하기)

### GitHub 예제
- [Next.js + PortOne Boilerplate](https://github.com/crowrish/nextjs-iamport)

---

## 8. 결론

TeddyBear's Room의 성인인증 도입을 위해 **포트원 + KG이니시스 통합인증**을 권장합니다.

**핵심 이유:**
1. **최저 비용**: 건당 40원, 가입비 무료
2. **다양한 인증 수단**: PASS, 카카오, 네이버 등 사용자 선택권 제공
3. **간편한 연동**: JavaScript SDK, REST API 제공
4. **기존 결제와 독립**: TossPayments와 별도 운영 가능
5. **법적 준수**: CI/DI 제공으로 본인확인 의무 충족

다음 단계로 포트원 가입 및 KG이니시스 통합인증 신청을 진행하시기 바랍니다.
