# PASS 성인인증 API 명세서

> TeddyBear's Room - Adult Verification API Specification
> Version: 1.0.0
> Last Updated: 2025-12-21

---

## 목차

1. [개요](#1-개요)
2. [시스템 아키텍처](#2-시스템-아키텍처)
3. [OpenAPI 3.0 Specification](#3-openapi-30-specification)
4. [TypeScript Type Definitions](#4-typescript-type-definitions)
5. [Error Codes Table](#5-error-codes-table)
6. [Rate Limiting Strategy](#6-rate-limiting-strategy)
7. [Security Headers & CSRF Protection](#7-security-headers--csrf-protection)
8. [Database Schema Extension](#8-database-schema-extension)

---

## 1. 개요

### 1.1 목적

성인용품 E-commerce 플랫폼 TeddyBear's Room에서 **성인 인증(19세 이상)** 을 위한 PASS 본인확인 API 연동 명세입니다.

### 1.2 인증 제공사

- **Primary**: KG이니시스 통합인증서비스
- **지원 인증서**: PASS, 네이버, 카카오, 토스, 금융인증서 등

### 1.3 인증 흐름 (Sequence Diagram - ASCII)

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ Client  │     │ TeddyBear   │     │  KG이니시스   │     │   인증서앱    │
│ Browser │     │   Backend   │     │   (CAS)      │     │ (PASS/Naver) │
└────┬────┘     └──────┬──────┘     └──────┬───────┘     └──────┬───────┘
     │                 │                    │                    │
     │ 1. POST /request│                    │                    │
     │────────────────>│                    │                    │
     │                 │ 2. Create Session  │                    │
     │                 │ (Generate txId)    │                    │
     │                 │                    │                    │
     │                 │ 3. authHash 생성    │                    │
     │                 │ (SHA256)           │                    │
     │                 │                    │                    │
     │ 4. Return       │                    │                    │
     │   authRequestUrl│                    │                    │
     │<────────────────│                    │                    │
     │                 │                    │                    │
     │ 5. Popup/       │                    │                    │
     │   Redirect CAS  │                    │                    │
     │─────────────────────────────────────>│                    │
     │                 │                    │                    │
     │                 │                    │ 6. 인증 요청 푸시   │
     │                 │                    │───────────────────>│
     │                 │                    │                    │
     │                 │                    │ 7. 사용자 인증 완료 │
     │                 │                    │<───────────────────│
     │                 │                    │                    │
     │ 8. Callback     │                    │                    │
     │   (okUrl)       │                    │                    │
     │<─────────────────────────────────────│                    │
     │                 │                    │                    │
     │ 9. POST /callback (Resultcd, Token)  │                    │
     │────────────────>│                    │                    │
     │                 │                    │                    │
     │                 │ 10. POST AuthRequestUrl                 │
     │                 │ (결과조회)          │                    │
     │                 │───────────────────>│                    │
     │                 │                    │                    │
     │                 │ 11. CI/DI 응답     │                    │
     │                 │<───────────────────│                    │
     │                 │                    │                    │
     │                 │ 12. SEED 복호화    │                    │
     │                 │ 생년월일 추출       │                    │
     │                 │ 성인여부 판정       │                    │
     │                 │                    │                    │
     │                 │ 13. Profile 업데이트                    │
     │                 │ (isAdultVerified)  │                    │
     │                 │                    │                    │
     │ 14. Success     │                    │                    │
     │   Response      │                    │                    │
     │<────────────────│                    │                    │
     │                 │                    │                    │
```

### 1.4 핵심 데이터 요소

| 요소 | 설명 | 용도 |
|------|------|------|
| **CI (Connecting Information)** | 88byte 암호화된 개인식별정보 | 동일인 여부 확인 (서비스 간 연계) |
| **DI (Duplicate Info)** | 상점별 중복가입확인정보 | 동일 서비스 내 중복 가입 방지 |
| **생년월일 (Socialno)** | YYYYMMDD 형식 (SEED 암호화) | 19세 이상 성인 여부 판정 |

---

## 2. 시스템 아키텍처

### 2.1 API Endpoint 구조

```
/api/verification/adult/
├── request    POST   인증 요청 생성 (txId 발급)
├── callback   POST   이니시스 인증 결과 수신
├── status     GET    인증 상태 확인
└── verify     POST   CI값 검증 및 Profile 업데이트
```

### 2.2 데이터 흐름 (Data Flow)

```
┌──────────────────────────────────────────────────────────────────────┐
│                          TeddyBear's Room                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐   │
│  │   Frontend   │───>│   API Route  │───>│    Prisma/Supabase   │   │
│  │  (Next.js)   │<───│   Handlers   │<───│     (PostgreSQL)     │   │
│  └──────────────┘    └──────────────┘    └──────────────────────┘   │
│         │                   │                        │               │
│         │                   │                        │               │
│         │                   v                        │               │
│         │            ┌──────────────┐                │               │
│         │            │  KG이니시스   │                │               │
│         └───────────>│   CAS API    │                │               │
│           (Popup)    └──────────────┘                │               │
│                                                      │               │
│  ┌────────────────────────────────────────────────┐  │               │
│  │                 Session Store                  │  │               │
│  │  Key: txId                                     │  │               │
│  │  Value: { userId, timestamp, status, ... }    │  │               │
│  └────────────────────────────────────────────────┘  │               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. OpenAPI 3.0 Specification

```yaml
openapi: 3.0.3
info:
  title: TeddyBear's Room - Adult Verification API
  description: |
    PASS 본인확인 기반 성인인증 API.
    KG이니시스 통합인증서비스 연동.
  version: 1.0.0
  contact:
    email: dev@teddybearsroom.com

servers:
  - url: https://teddybearsroom.com/api
    description: Production
  - url: http://localhost:3000/api
    description: Development

tags:
  - name: Adult Verification
    description: 성인인증 관련 API

paths:
  /verification/adult/request:
    post:
      tags:
        - Adult Verification
      summary: 성인인증 요청 생성
      description: |
        KG이니시스 통합인증서비스에 인증 요청을 생성하고
        클라이언트가 인증 팝업을 열 수 있는 URL을 반환합니다.
      operationId: createAdultVerificationRequest
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdultVerificationRequest'
      responses:
        '200':
          description: 인증 요청 생성 성공
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdultVerificationRequestResponse'
        '400':
          description: 잘못된 요청
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: 인증 필요
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '429':
          description: 요청 제한 초과
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RateLimitErrorResponse'
        '500':
          description: 서버 오류
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /verification/adult/callback:
    post:
      tags:
        - Adult Verification
      summary: 인증 결과 콜백 수신
      description: |
        KG이니시스 CAS에서 인증 완료 후 호출되는 콜백 엔드포인트.
        결과코드와 토큰을 수신하여 결과조회 API를 호출합니다.
      operationId: handleAdultVerificationCallback
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/VerificationCallbackRequest'
      responses:
        '200':
          description: 콜백 처리 성공
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VerificationCallbackResponse'
        '400':
          description: 잘못된 콜백 데이터
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: 유효하지 않은 콜백 (서명 검증 실패)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: 서버 오류
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /verification/adult/status:
    get:
      tags:
        - Adult Verification
      summary: 인증 상태 확인
      description: |
        현재 사용자의 성인인증 상태를 조회합니다.
        트랜잭션 ID로 진행 중인 인증 상태도 확인 가능합니다.
      operationId: getAdultVerificationStatus
      security:
        - BearerAuth: []
      parameters:
        - name: txId
          in: query
          description: 인증 트랜잭션 ID (선택)
          required: false
          schema:
            type: string
            maxLength: 20
      responses:
        '200':
          description: 상태 조회 성공
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VerificationStatusResponse'
        '401':
          description: 인증 필요
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: 트랜잭션을 찾을 수 없음
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: 서버 오류
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /verification/adult/verify:
    post:
      tags:
        - Adult Verification
      summary: CI값 검증 및 Profile 업데이트
      description: |
        수신된 CI값을 검증하고, 생년월일 기준 19세 이상 확인 후
        사용자 Profile의 isAdultVerified 필드를 업데이트합니다.
      operationId: verifyAdultStatus
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/VerifyAdultRequest'
      responses:
        '200':
          description: 성인인증 성공
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VerifyAdultResponse'
        '400':
          description: 잘못된 요청 또는 미성년자
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: 인증 필요
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: CI 검증 실패
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: 서버 오류
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Supabase Auth JWT Token

  schemas:
    # ============================================================
    # Request Schemas
    # ============================================================

    AdultVerificationRequest:
      type: object
      required:
        - returnUrl
      properties:
        returnUrl:
          type: string
          format: uri
          description: 인증 완료 후 리다이렉트할 URL (같은 도메인)
          example: "https://teddybearsroom.com/my/verification/complete"
          maxLength: 200
        cancelUrl:
          type: string
          format: uri
          description: 인증 취소 시 리다이렉트할 URL
          example: "https://teddybearsroom.com/my/verification/cancelled"
          maxLength: 200
        clientData:
          type: string
          description: 클라이언트 콜백 변수 (& % 사용 불가)
          maxLength: 1000

    VerificationCallbackRequest:
      type: object
      description: |
        KG이니시스 CAS 콜백 파라미터 (application/x-www-form-urlencoded)
      required:
        - Resultcd
        - Resultmsg
        - Transid
      properties:
        Resultcd:
          type: string
          description: 결과코드 (0000=성공)
          maxLength: 4
        Resultmsg:
          type: string
          description: 결과메시지
          maxLength: 200
        AuthRequestUrl:
          type: string
          description: 결과조회 요청 URL
          maxLength: 500
        Transid:
          type: string
          description: 트랜잭션 ID
          maxLength: 20
        Token:
          type: string
          description: 암호화 토큰
          maxLength: 500
        MSTR:
          type: string
          description: 가맹점 콜백변수 (clientData)
          maxLength: 1000

    VerifyAdultRequest:
      type: object
      required:
        - txId
      properties:
        txId:
          type: string
          description: 인증 트랜잭션 ID
          maxLength: 20

    # ============================================================
    # Response Schemas
    # ============================================================

    AdultVerificationRequestResponse:
      type: object
      required:
        - success
        - data
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          required:
            - txId
            - authUrl
            - expiresAt
          properties:
            txId:
              type: string
              description: 인증 트랜잭션 ID
              example: "TBR20251221123456"
            authUrl:
              type: string
              format: uri
              description: 인증 팝업 URL (CAS)
              example: "https://cas.inicis.com/casappV2/ui/cardauthreq?..."
            expiresAt:
              type: string
              format: date-time
              description: 인증 요청 만료 시각 (당일 23:59:59)
              example: "2025-12-21T23:59:59+09:00"

    VerificationCallbackResponse:
      type: object
      required:
        - success
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          properties:
            txId:
              type: string
              description: 트랜잭션 ID
            status:
              type: string
              enum: [PENDING, PROCESSING, COMPLETED, FAILED, EXPIRED]
              description: 인증 상태
            redirectUrl:
              type: string
              format: uri
              description: 클라이언트 리다이렉트 URL

    VerificationStatusResponse:
      type: object
      required:
        - success
        - data
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          required:
            - isAdultVerified
          properties:
            isAdultVerified:
              type: boolean
              description: 성인인증 완료 여부
              example: false
            verifiedAt:
              type: string
              format: date-time
              description: 성인인증 완료 시각
              example: "2025-12-21T14:30:00+09:00"
            transaction:
              type: object
              description: 진행 중인 인증 트랜잭션 정보
              properties:
                txId:
                  type: string
                status:
                  type: string
                  enum: [PENDING, PROCESSING, COMPLETED, FAILED, EXPIRED]
                createdAt:
                  type: string
                  format: date-time
                expiresAt:
                  type: string
                  format: date-time

    VerifyAdultResponse:
      type: object
      required:
        - success
        - data
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          required:
            - isAdultVerified
            - verifiedAt
          properties:
            isAdultVerified:
              type: boolean
              example: true
            verifiedAt:
              type: string
              format: date-time
              example: "2025-12-21T14:30:00+09:00"
            message:
              type: string
              example: "성인인증이 완료되었습니다."

    # ============================================================
    # Error Schemas
    # ============================================================

    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
        error:
          type: string
          description: 사용자 친화적 에러 메시지
          example: "인증 요청을 처리하는데 실패했습니다."
        code:
          type: string
          description: 에러 코드
          example: "VERIFICATION_REQUEST_FAILED"
        details:
          type: object
          description: 추가 에러 정보 (개발 환경에서만)
          additionalProperties: true

    RateLimitErrorResponse:
      allOf:
        - $ref: '#/components/schemas/ErrorResponse'
        - type: object
          properties:
            retryAfter:
              type: integer
              description: 재시도까지 남은 초
              example: 60

  # ============================================================
  # Security
  # ============================================================

security:
  - BearerAuth: []
```

---

## 4. TypeScript Type Definitions

```typescript
// ============================================================
// web/src/types/verification.ts
// PASS 성인인증 API 타입 정의
// ============================================================

/**
 * 인증 트랜잭션 상태
 */
export type VerificationStatus =
  | 'PENDING'      // 인증 요청 생성됨, 대기 중
  | 'PROCESSING'   // 사용자가 인증 진행 중
  | 'COMPLETED'    // 인증 완료 (결과 수신)
  | 'VERIFIED'     // 성인 검증 완료 (Profile 업데이트)
  | 'FAILED'       // 인증 실패
  | 'EXPIRED';     // 인증 만료 (당일 23:59:59 이후)

/**
 * 인증 실패 사유
 */
export type VerificationFailureReason =
  | 'USER_CANCELLED'    // 사용자가 인증 취소
  | 'TIMEOUT'           // 인증 시간 초과
  | 'UNDERAGE'          // 미성년자
  | 'INVALID_CI'        // CI 값 검증 실패
  | 'ALREADY_VERIFIED'  // 이미 인증된 CI
  | 'PROVIDER_ERROR'    // 이니시스 서버 오류
  | 'DECRYPTION_ERROR'  // SEED 복호화 실패
  | 'UNKNOWN';          // 알 수 없는 오류

// ============================================================
// Request Types
// ============================================================

/**
 * POST /api/verification/adult/request
 * 성인인증 요청 생성 요청 바디
 */
export interface AdultVerificationRequest {
  /** 인증 완료 후 리다이렉트할 URL (같은 도메인) */
  returnUrl: string;
  /** 인증 취소 시 리다이렉트할 URL (선택) */
  cancelUrl?: string;
  /** 클라이언트 콜백 변수 (& % 사용 불가) */
  clientData?: string;
}

/**
 * POST /api/verification/adult/callback
 * KG이니시스 CAS 콜백 파라미터
 */
export interface VerificationCallbackRequest {
  /** 결과코드 (0000=성공) */
  Resultcd: string;
  /** 결과메시지 (UTF-8) */
  Resultmsg: string;
  /** 결과조회 요청 URL */
  AuthRequestUrl?: string;
  /** 트랜잭션 ID */
  Transid: string;
  /** 암호화 토큰 */
  Token?: string;
  /** 가맹점 콜백변수 */
  MSTR?: string;
}

/**
 * POST /api/verification/adult/verify
 * CI값 검증 및 성인 확인 요청
 */
export interface VerifyAdultRequest {
  /** 인증 트랜잭션 ID */
  txId: string;
}

/**
 * GET /api/verification/adult/status
 * 인증 상태 조회 쿼리 파라미터
 */
export interface VerificationStatusQuery {
  /** 인증 트랜잭션 ID (선택) */
  txId?: string;
}

// ============================================================
// Response Types
// ============================================================

/**
 * 공통 API 응답 래퍼
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * POST /api/verification/adult/request 응답
 */
export interface AdultVerificationRequestResponse {
  /** 인증 트랜잭션 ID */
  txId: string;
  /** 인증 팝업 URL (CAS) */
  authUrl: string;
  /** 인증 요청 만료 시각 (당일 23:59:59) */
  expiresAt: string;
}

/**
 * POST /api/verification/adult/callback 응답
 */
export interface VerificationCallbackResponse {
  /** 트랜잭션 ID */
  txId: string;
  /** 인증 상태 */
  status: VerificationStatus;
  /** 클라이언트 리다이렉트 URL */
  redirectUrl?: string;
}

/**
 * 진행 중인 트랜잭션 정보
 */
export interface TransactionInfo {
  txId: string;
  status: VerificationStatus;
  createdAt: string;
  expiresAt: string;
  failureReason?: VerificationFailureReason;
}

/**
 * GET /api/verification/adult/status 응답
 */
export interface VerificationStatusResponse {
  /** 성인인증 완료 여부 */
  isAdultVerified: boolean;
  /** 성인인증 완료 시각 */
  verifiedAt?: string;
  /** 진행 중인 인증 트랜잭션 정보 */
  transaction?: TransactionInfo;
}

/**
 * POST /api/verification/adult/verify 응답
 */
export interface VerifyAdultResponse {
  /** 성인인증 완료 여부 */
  isAdultVerified: boolean;
  /** 성인인증 완료 시각 */
  verifiedAt: string;
  /** 완료 메시지 */
  message: string;
}

// ============================================================
// Internal Types (Server-side only)
// ============================================================

/**
 * 이니시스 결과조회 API 응답 (STEP 4)
 * 참조: https://manual.inicis.com/sa/cas.html
 */
export interface InicisResultResponse {
  /** 결과코드 (0000=성공) */
  Resultcd: string;
  /** 결과메시지 */
  Resultmsg: string;
  /** 트랜잭션 ID */
  Transid: string;
  /** 거래번호 (가맹점 생성) */
  Tradeid: string;
  /** 인증일자 (YYYYMMDDHH24MISS) */
  Signdate: string;
  /** 이름 (SEED 암호화) */
  Name: string;
  /** 생년월일 (YYYYMMDD, SEED 암호화) */
  Socialno: string;
  /** CI - 연계정보 (88byte, SEED 암호화) */
  Ci: string;
  /** DI - 중복가입확인정보 (SEED 암호화) */
  Di: string;
  /** CI2 (선택) */
  Ci2?: string;
  /** CI 업데이트 횟수 */
  CiUpdate?: string;
}

/**
 * SEED 복호화된 사용자 정보
 */
export interface DecryptedUserInfo {
  /** 이름 */
  name: string;
  /** 생년월일 (YYYYMMDD) */
  birthDate: string;
  /** CI (연계정보) */
  ci: string;
  /** DI (중복가입확인정보) */
  di: string;
}

/**
 * 세션 스토어에 저장되는 인증 트랜잭션 데이터
 */
export interface VerificationSession {
  /** 사용자 ID (Profile.id) */
  userId: string;
  /** 트랜잭션 ID */
  txId: string;
  /** 인증 상태 */
  status: VerificationStatus;
  /** 생성 시각 */
  createdAt: Date;
  /** 만료 시각 */
  expiresAt: Date;
  /** 인증 완료 후 리다이렉트 URL */
  returnUrl: string;
  /** 취소 시 리다이렉트 URL */
  cancelUrl?: string;
  /** 클라이언트 콜백 변수 */
  clientData?: string;
  /** 결과조회 URL (콜백 후 설정) */
  authRequestUrl?: string;
  /** 토큰 (콜백 후 설정) */
  token?: string;
  /** 복호화된 사용자 정보 (결과조회 후 설정) */
  decryptedInfo?: DecryptedUserInfo;
  /** 실패 사유 */
  failureReason?: VerificationFailureReason;
}

// ============================================================
// Zod Validation Schemas (for API handlers)
// ============================================================

// Note: Zod 스키마는 별도 파일에서 정의
// web/src/lib/validators/verification.ts 참조
```

---

## 5. Error Codes Table

### 5.1 API Error Codes

| Code | HTTP Status | Message (KR) | Description |
|------|-------------|--------------|-------------|
| `UNAUTHORIZED` | 401 | 로그인이 필요합니다. | Supabase 세션 없음 |
| `AUTH_ERROR` | 500 | 인증 확인 중 오류가 발생했습니다. | Supabase Auth 오류 |
| `RATE_LIMIT_EXCEEDED` | 429 | 요청이 너무 많습니다. 잠시 후 다시 시도해주세요. | Rate limit 초과 |
| `VALIDATION_ERROR` | 400 | {field} 필드가 올바르지 않습니다. | Zod 유효성 검증 실패 |
| `INVALID_RETURN_URL` | 400 | returnUrl은 같은 도메인이어야 합니다. | 외부 도메인 URL 거부 |
| `VERIFICATION_REQUEST_FAILED` | 500 | 인증 요청 생성에 실패했습니다. | 이니시스 API 호출 실패 |
| `INVALID_CALLBACK` | 403 | 유효하지 않은 콜백입니다. | 콜백 서명 검증 실패 |
| `TRANSACTION_NOT_FOUND` | 404 | 인증 요청을 찾을 수 없습니다. | txId로 세션 조회 실패 |
| `TRANSACTION_EXPIRED` | 400 | 인증 요청이 만료되었습니다. | 당일 23:59:59 경과 |
| `ALREADY_VERIFIED` | 400 | 이미 성인인증이 완료되었습니다. | Profile.isAdultVerified = true |
| `CI_VERIFICATION_FAILED` | 403 | CI 값 검증에 실패했습니다. | CI 복호화/검증 오류 |
| `CI_ALREADY_USED` | 400 | 이미 다른 계정에서 사용된 CI입니다. | CI 중복 사용 |
| `UNDERAGE` | 400 | 19세 미만은 성인인증을 완료할 수 없습니다. | 생년월일 기준 미성년자 |
| `DECRYPTION_ERROR` | 500 | 인증 데이터 복호화에 실패했습니다. | SEED 복호화 오류 |
| `PROVIDER_ERROR` | 502 | 인증 제공사 오류가 발생했습니다. | 이니시스 서버 오류 |
| `VERIFICATION_UPDATE_FAILED` | 500 | 인증 정보 업데이트에 실패했습니다. | DB 업데이트 오류 |

### 5.2 KG이니시스 CAS Error Codes

| Resultcd | Resultmsg | Description | Handling |
|----------|-----------|-------------|----------|
| `0000` | 성공 | 인증 성공 | 결과조회 API 호출 |
| `0001` | 인증 취소 | 사용자가 인증 취소 | 취소 URL로 리다이렉트 |
| `0002` | 인증 실패 | 일반적인 인증 실패 | 에러 페이지 표시 |
| `0003` | 시간 초과 | 인증 제한시간 초과 | 재시도 안내 |
| `0004` | 인증서 오류 | 인증서 검증 실패 | 다른 인증서 안내 |
| `0005` | 통신 오류 | 통신사/인증사 연결 오류 | 재시도 안내 |
| `9999` | 시스템 오류 | 이니시스 내부 오류 | 고객센터 안내 |

### 5.3 Error Response Examples

```json
// 401 Unauthorized
{
  "success": false,
  "error": "로그인이 필요합니다.",
  "code": "UNAUTHORIZED"
}

// 400 Bad Request - Underage
{
  "success": false,
  "error": "19세 미만은 성인인증을 완료할 수 없습니다.",
  "code": "UNDERAGE"
}

// 429 Rate Limit
{
  "success": false,
  "error": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}

// 502 Provider Error
{
  "success": false,
  "error": "인증 제공사 오류가 발생했습니다.",
  "code": "PROVIDER_ERROR"
}
```

---

## 6. Rate Limiting Strategy

### 6.1 Rate Limit Configuration

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Rate Limiting Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Endpoint                    │  Limit       │  Window  │  Scope    │
│  ─────────────────────────────────────────────────────────────────  │
│  /verification/adult/request │  3 req       │  1 hour  │  Per User │
│  /verification/adult/callback│  10 req      │  1 min   │  Per IP   │
│  /verification/adult/status  │  30 req      │  1 min   │  Per User │
│  /verification/adult/verify  │  5 req       │  1 hour  │  Per User │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Implementation

```typescript
// web/src/lib/api/rate-limit.ts 확장

export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // ... 기존 설정

  // 성인인증 요청: 시간당 3회 (Brute Force 방지)
  'verification-request': {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1시간
  },

  // 콜백: 분당 10회 (IP 기반, 이니시스 서버 호출)
  'verification-callback': {
    maxRequests: 10,
    windowMs: 60 * 1000,
  },

  // 상태 조회: 분당 30회 (Polling 허용)
  'verification-status': {
    maxRequests: 30,
    windowMs: 60 * 1000,
  },

  // 최종 검증: 시간당 5회
  'verification-verify': {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  },
};
```

### 6.3 Rate Limit Headers

| Header | Description | Example |
|--------|-------------|---------|
| `X-RateLimit-Limit` | 윈도우당 최대 요청 수 | `3` |
| `X-RateLimit-Remaining` | 남은 요청 수 | `2` |
| `X-RateLimit-Reset` | 리셋 시각 (Unix timestamp) | `1734789600` |
| `Retry-After` | 재시도까지 남은 초 (429 응답 시) | `3600` |

### 6.4 Daily Request Quota

성인인증의 경우 **일일 요청 제한**도 추가 적용:

- 인증 요청: **일일 5회** (남용 방지)
- 검증 시도: **일일 10회** (Brute Force 방지)

```typescript
// 일일 제한 체크 로직
async function checkDailyQuota(userId: string, action: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `daily:${action}:${userId}:${today}`;

  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expireat(key, getEndOfDayUnix());
  }

  const limits = {
    'verification-request': 5,
    'verification-verify': 10,
  };

  return count <= (limits[action] || 100);
}
```

---

## 7. Security Headers & CSRF Protection

### 7.1 Required Security Headers

```typescript
// web/src/middleware.ts 확장

const SECURITY_HEADERS = {
  // XSS 방지
  'X-XSS-Protection': '1; mode=block',

  // Content-Type 스니핑 방지
  'X-Content-Type-Options': 'nosniff',

  // Clickjacking 방지
  'X-Frame-Options': 'DENY',

  // HTTPS 강제 (1년)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

  // Referrer 정보 최소화
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Content Security Policy (인증 팝업 허용)
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cas.inicis.com",
    "frame-src https://cas.inicis.com",
    "connect-src 'self' https://*.supabase.co https://cas.inicis.com",
  ].join('; '),
};
```

### 7.2 CSRF Protection

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CSRF Protection Flow                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Token Generation                                                │
│  ──────────────────                                                 │
│  Server generates CSRF token on /request:                           │
│  - Bind to user session                                             │
│  - Store in httpOnly cookie                                         │
│  - Include in response for popup                                    │
│                                                                     │
│  2. Token Validation                                                │
│  ────────────────────                                               │
│  On /callback and /verify:                                          │
│  - Validate X-CSRF-Token header matches cookie                      │
│  - Validate Origin/Referer header                                   │
│  - Validate txId belongs to current user                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.3 Callback Validation

```typescript
// web/src/lib/verification/security.ts

interface CallbackValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 콜백 요청 검증
 */
export async function validateCallback(
  request: Request,
  body: VerificationCallbackRequest
): Promise<CallbackValidationResult> {
  // 1. Origin 검증
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://cas.inicis.com',
    process.env.NEXT_PUBLIC_SITE_URL,
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return { valid: false, error: 'INVALID_ORIGIN' };
  }

  // 2. Transid 형식 검증
  if (!/^[A-Za-z0-9]{1,20}$/.test(body.Transid)) {
    return { valid: false, error: 'INVALID_TRANSID_FORMAT' };
  }

  // 3. 세션 존재 확인
  const session = await getVerificationSession(body.Transid);
  if (!session) {
    return { valid: false, error: 'SESSION_NOT_FOUND' };
  }

  // 4. 만료 확인
  if (new Date() > session.expiresAt) {
    return { valid: false, error: 'SESSION_EXPIRED' };
  }

  // 5. 상태 확인 (중복 콜백 방지)
  if (session.status !== 'PENDING') {
    return { valid: false, error: 'ALREADY_PROCESSED' };
  }

  return { valid: true };
}
```

### 7.4 CI Integrity Verification

```typescript
/**
 * CI 값 무결성 검증
 */
export async function verifyCI(
  decryptedCI: string,
  userId: string
): Promise<{ valid: boolean; error?: string }> {
  // 1. CI 형식 검증 (88 byte)
  if (decryptedCI.length !== 88) {
    return { valid: false, error: 'INVALID_CI_LENGTH' };
  }

  // 2. CI 중복 사용 확인
  const existingProfile = await prisma.profile.findFirst({
    where: {
      adultVerificationCI: decryptedCI,
      id: { not: userId },
    },
  });

  if (existingProfile) {
    return { valid: false, error: 'CI_ALREADY_USED' };
  }

  // 3. CI 무결성 검증 (해시 비교)
  // 이니시스에서 받은 CI2 값과 비교

  return { valid: true };
}
```

### 7.5 API Route Security Pattern

```typescript
// web/src/app/api/verification/adult/request/route.ts

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const rateLimitCheck = await withRateLimit('verification-request');
    if (!rateLimitCheck.success) return rateLimitCheck.response;

    // 2. Authentication
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;

    // 3. Daily Quota Check
    const quotaCheck = await checkDailyQuota(authResult.user.id, 'verification-request');
    if (!quotaCheck) {
      return apiError('일일 인증 요청 횟수를 초과했습니다.', 429, 'DAILY_QUOTA_EXCEEDED');
    }

    // 4. Input Validation
    const body = await request.json();
    const parseResult = AdultVerificationRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(
        parseResult.error.issues[0].message,
        400,
        'VALIDATION_ERROR'
      );
    }

    // 5. URL Domain Validation
    const { returnUrl, cancelUrl } = parseResult.data;
    if (!isAllowedDomain(returnUrl)) {
      return apiError('returnUrl은 같은 도메인이어야 합니다.', 400, 'INVALID_RETURN_URL');
    }

    // 6. Already Verified Check
    const profile = await prisma.profile.findUnique({
      where: { id: authResult.user.id },
      select: { isAdultVerified: true },
    });

    if (profile?.isAdultVerified) {
      return apiError('이미 성인인증이 완료되었습니다.', 400, 'ALREADY_VERIFIED');
    }

    // 7. Create Verification Request...
  } catch (error) {
    console.error('Verification Request Error:', error);
    return apiError('인증 요청 생성에 실패했습니다.', 500, 'VERIFICATION_REQUEST_FAILED');
  }
}
```

---

## 8. Database Schema Extension

### 8.1 Profile Model Extension

```prisma
// web/prisma/schema.prisma 확장

model Profile {
  // ... 기존 필드들

  // ============================================================
  // Adult Verification Fields
  // 성인인증 관련 필드
  // ============================================================

  /// 성인인증 완료 여부
  isAdultVerified       Boolean   @default(false)

  /// 성인인증 완료 시각
  adultVerifiedAt       DateTime?

  /// CI 값 (해시 저장, 중복 방지용)
  /// 원본 CI는 저장하지 않음 (개인정보 보호)
  adultVerificationCIHash String?  @unique

  /// 마지막 인증 시도 시각
  lastVerificationAttemptAt DateTime?

  /// 인증 시도 횟수 (일일 초기화)
  verificationAttemptCount  Int     @default(0)

  // ============================================================
}
```

### 8.2 Verification Session Model (Optional)

세션 데이터를 DB에 저장할 경우:

```prisma
/// 성인인증 트랜잭션 세션
/// Redis 사용 시 불필요
model VerificationSession {
  id              String   @id @default(uuid())

  /// 트랜잭션 ID (이니시스 Tradeid)
  txId            String   @unique

  /// 사용자 ID
  profileId       String

  /// 인증 상태
  status          VerificationSessionStatus @default(PENDING)

  /// 인증 완료 후 리다이렉트 URL
  returnUrl       String

  /// 취소 시 리다이렉트 URL
  cancelUrl       String?

  /// 클라이언트 콜백 변수
  clientData      String?

  /// 결과조회 URL (콜백 후 설정)
  authRequestUrl  String?

  /// 토큰 (콜백 후 설정)
  token           String?

  /// 실패 사유
  failureReason   String?

  /// 만료 시각 (당일 23:59:59)
  expiresAt       DateTime

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  profile         Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId])
  @@index([expiresAt])
  @@map("verification_sessions")
}

enum VerificationSessionStatus {
  PENDING      // 인증 요청 생성됨
  PROCESSING   // 사용자가 인증 진행 중
  COMPLETED    // 인증 완료 (결과 수신)
  VERIFIED     // 성인 검증 완료
  FAILED       // 인증 실패
  EXPIRED      // 인증 만료
}
```

### 8.3 Audit Log Model

```prisma
/// 성인인증 감사 로그
model VerificationAuditLog {
  id              String   @id @default(uuid())

  /// 사용자 ID
  profileId       String

  /// 트랜잭션 ID
  txId            String

  /// 액션 유형
  action          VerificationAuditAction

  /// 결과
  result          String   // SUCCESS, FAILURE

  /// 상세 정보 (JSON)
  details         Json?

  /// IP 주소 (마스킹)
  ipAddress       String?

  /// User-Agent
  userAgent       String?

  createdAt       DateTime @default(now())

  @@index([profileId])
  @@index([txId])
  @@index([createdAt])
  @@map("verification_audit_logs")
}

enum VerificationAuditAction {
  REQUEST_CREATED     // 인증 요청 생성
  CALLBACK_RECEIVED   // 콜백 수신
  RESULT_QUERIED      // 결과 조회
  VERIFICATION_SUCCESS // 성인 검증 성공
  VERIFICATION_FAILED // 성인 검증 실패
  SESSION_EXPIRED     // 세션 만료
}
```

---

## 참고 자료

- [KG이니시스 통합인증서비스](https://sign-service.inicis.com/)
- [KG이니시스 카드본인확인 API 매뉴얼](https://manual.inicis.com/sa/cas.html)
- [통합인증서비스 연동 샘플 및 매뉴얼](https://www.inicis.com/blog/archives/127559)
- [CI/DI 값 이해하기](https://help-center-portone.vercel.app/content/identity-verification-value)
- [BaroCert PASS 본인인증 API](https://developers.barocert.com/reference/pass/python/identity/api)

---

## 문서 이력

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2025-12-21 | Claude | Initial specification |
