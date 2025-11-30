"use client";

// ====================================
// TeddyBear's Room - PlanComparisonTable 컴포넌트
// 구독 플랜 비교 테이블 (비회원 vs TBR 멤버십)
// ====================================
//
// 🎯 용도:
// - 비회원과 TBR 멤버십(19,900원/월) 혜택 비교
// - 구독 페이지(subscribe/page.tsx)에서 사용
// - MVP Single Tier 디자인 (2025-11-30)
// - 사용자가 구독의 가치를 직관적으로 파악
//
// 📦 구조:
// - ComparisonRow interface: feature(혜택명), nonMember(비회원값), member(멤버값)
// - comparisonData: 6가지 주요 혜택 비교 항목 배열
// - renderValue(): boolean/string → 아이콘/텍스트로 변환
// - PlanComparisonTable: 반응형 테이블 컴포넌트
//   - thead: 헤더 (혜택, 비회원, TBR 멤버십)
//   - tbody: 데이터 행 (map으로 comparisonData 순회)
//   - 모바일 대응: overflow-x-auto (가로 스크롤)
//
// 🎨 디자인:
// - 2컬럼 테이블: 비회원 vs 멤버십 비교 가능
// - 헤더: bg-muted/30 (비회원), bg-primary/10 (멤버십)
// - 행: hover:bg-muted/30 (호버 강조)
// - 멤버십 열: bg-primary/5 (연한 primary 배경)
// - 아이콘: Check(✓ 초록), X(✗ 희미) lucide-react
// - rounded-tl-xl / rounded-tr-xl: 테이블 헤더 모서리
//
// 🔧 주요 기능:
// - renderValue: boolean은 아이콘, string은 텍스트로 렌더링
// - 반응형: 작은 화면에서 overflow-x-auto로 가로 스크롤
// - 호버 효과: hover:bg-muted/30로 행 강조
//
// 📝 의존성:
// - lucide-react: Check, X 아이콘
// - React: map() 배열 순회
// ====================================

import { Check, X } from "lucide-react";

// ──────────────────────────────────────
// Props & 타입 정의
// ──────────────────────────────────────

/**
 * 플랜 비교 테이블의 한 행 데이터 구조
 *
 * @interface ComparisonRow
 * @property {string} feature - 혜택/기능 이름 (예: "포인트 적립")
 * @property {string | boolean} nonMember - 비회원 값 (예: "0%", false)
 * @property {string | boolean} member - 멤버십 값 (예: "5%", true)
 *
 * @example
 * { feature: "포인트 적립", nonMember: "0%", member: "5%" }
 * { feature: "기부 투표", nonMember: false, member: "5%" }
 */
interface ComparisonRow {
  feature: string;
  nonMember: string | boolean;
  member: string | boolean;
}

/**
 * 플랜 비교 데이터
 * MVP Single Tier: 비회원 vs TBR 멤버십(19,900원/월) 6가지 혜택 비교
 *
 * 각 항목의 비회원/멤버 가치:
 * - "포인트 적립": 0% vs 5% (매 구매마다 포인트)
 * - "기부 투표 참여": false vs "5%" (기부금 1% → 사용자 추천 기부처에 기부)
 * - "무료 배송": "7만원 이상" vs "5만원 이상" (배송료 3,000원 절약)
 * - "할인 쿠폰": false vs "매월 5%" (매달 첫날 5% 할인 쿠폰)
 * - "신상품 얼리 액세스": false vs true (신상품 미리 구매 가능)
 * - "생일 특별 혜택": false vs true (생일달 추가 할인/포인트 등)
 */
const comparisonData: ComparisonRow[] = [
  { feature: "포인트 적립", nonMember: "0%", member: "5%" },
  { feature: "기부 투표 참여", nonMember: false, member: "5%" },
  { feature: "무료 배송", nonMember: "7만원 이상", member: "5만원 이상" },
  { feature: "할인 쿠폰", nonMember: false, member: "매월 5%" },
  { feature: "신상품 얼리 액세스", nonMember: false, member: true },
  { feature: "생일 특별 혜택", nonMember: false, member: true },
];

// ──────────────────────────────────────
// PlanComparisonTable 컴포넌트
// ──────────────────────────────────────

/**
 * 플랜 비교 테이블 컴포넌트
 *
 * @description
 * 비회원과 TBR 멤버십의 혜택을 비교하는 반응형 테이블입니다.
 * - 2컬럼 구조: 비회원 (비무료) vs TBR 멤버십 (19,900원/월)
 * - 6가지 주요 혜택 항목으로 멤버십 가치 명확히 표시
 * - 모바일: overflow-x-auto로 가로 스크롤 가능
 * - 호버 효과로 상호작용성 강화
 *
 * @example
 * // 구독 페이지에서 사용
 * import { PlanComparisonTable } from "@/components/PlanComparisonTable";
 *
 * export default function SubscribePage() {
 *   return (
 *     <div>
 *       <PlanComparisonTable />
 *     </div>
 *   );
 * }
 */
export function PlanComparisonTable() {
  /**
   * 데이터 값을 JSX로 렌더링하는 헬퍼 함수
   * - boolean true: ✓ 초록색 Check 아이콘
   * - boolean false: ✗ 희미한 X 아이콘
   * - string: 그대로 텍스트로 표시
   *
   * @param {string | boolean} value - 렌더링할 값
   * @returns {JSX.Element} 렌더링된 JSX (아이콘 또는 텍스트)
   */
  const renderValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="overflow-x-auto">
      {/* 비교 테이블 (border-collapse)
          - w-full: 전체 너비 사용
          - border-collapse: 테이블 보더 축소 */}
      <table className="w-full border-collapse">
        {/* 테이블 헤더
            3컬럼: 혜택명, 비회원, TBR 멤버십 */}
        <thead>
          <tr>
            {/* 헤더 1: "혜택" (왼쪽 정렬)
                - text-left: 왼쪽 정렬
                - bg-muted/30: 연한 회색 배경
                - rounded-tl-xl: 왼쪽 위 모서리 둥글게 */}
            <th className="text-left p-4 border-b border-border bg-muted/30 rounded-tl-xl">
              혜택
            </th>

            {/* 헤더 2: "비회원" 섹션 (가운데 정렬)
                - text-center: 가운데 정렬
                - "비회원" 라벨 + "0원" 가격
                - text-muted-foreground/70: 희미한 텍스트 */}
            <th className="text-center p-4 border-b border-border bg-muted/30">
              <div className="text-muted-foreground">비회원</div>
              <div className="text-sm font-normal text-muted-foreground/70">0원</div>
            </th>

            {/* 헤더 3: "TBR 멤버십" 섹션 (가운데 정렬)
                - bg-primary/10: primary 색상 배경
                - rounded-tr-xl: 오른쪽 위 모서리 둥글게
                - 🐻 + "TBR 멤버십" 라벨 + "19,900원/월" 가격 */}
            <th className="text-center p-4 border-b border-border bg-primary/10 rounded-tr-xl">
              <div className="flex items-center justify-center gap-1">
                <span>🐻</span>
                <span className="text-primary">TBR 멤버십</span>
              </div>
              <div className="text-sm font-normal text-primary">19,900원/월</div>
            </th>
          </tr>
        </thead>

        {/* 테이블 바디
            comparisonData를 map()으로 순회하며 각 행 렌더링 */}
        <tbody>
          {comparisonData.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-muted/30 transition-colors"
            >
              {/* 셀 1: 혜택명 (왼쪽 정렬, 굵은 텍스트)
                  - font-medium: 중간 굵기 (강조) */}
              <td className="p-4 border-b border-border font-medium text-foreground">
                {row.feature}
              </td>

              {/* 셀 2: 비회원 값 (가운데, renderValue 함수로 렌더링)
                  - renderValue(row.nonMember): boolean/string 처리 */}
              <td className="p-4 border-b border-border text-center text-muted-foreground">
                {renderValue(row.nonMember)}
              </td>

              {/* 셀 3: 멤버십 값 (가운데, renderValue 함수로 렌더링)
                  - bg-primary/5: 연한 primary 배경 (멤버십 하이라이트)
                  - renderValue(row.member): boolean/string 처리 */}
              <td className="p-4 border-b border-border text-center text-foreground bg-primary/5">
                {renderValue(row.member)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
