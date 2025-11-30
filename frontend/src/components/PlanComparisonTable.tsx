"use client";

// ====================================
// TeddyBear's Room - Plan Comparison Table
// MVP: 비회원 vs 멤버십 2컬럼 비교
// 2025-11-30: 2-Tier → Single Tier 전환
// ====================================

import { Check, X } from "lucide-react";

interface ComparisonRow {
  feature: string;
  nonMember: string | boolean;
  member: string | boolean;
}

const comparisonData: ComparisonRow[] = [
  { feature: "포인트 적립", nonMember: "0%", member: "5%" },
  { feature: "기부 투표 참여", nonMember: false, member: "5%" },
  { feature: "무료 배송", nonMember: "7만원 이상", member: "5만원 이상" },
  { feature: "할인 쿠폰", nonMember: false, member: "매월 5%" },
  { feature: "신상품 얼리 액세스", nonMember: false, member: true },
  { feature: "생일 특별 혜택", nonMember: false, member: true },
];

export function PlanComparisonTable() {
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
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 border-b border-border bg-muted/30 rounded-tl-xl">
              혜택
            </th>
            <th className="text-center p-4 border-b border-border bg-muted/30">
              <div className="text-muted-foreground">비회원</div>
              <div className="text-sm font-normal text-muted-foreground/70">0원</div>
            </th>
            <th className="text-center p-4 border-b border-border bg-primary/10 rounded-tr-xl">
              <div className="flex items-center justify-center gap-1">
                <span>🐻</span>
                <span className="text-primary">TBR 멤버십</span>
              </div>
              <div className="text-sm font-normal text-primary">19,900원/월</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="p-4 border-b border-border font-medium text-foreground">
                {row.feature}
              </td>
              <td className="p-4 border-b border-border text-center text-muted-foreground">
                {renderValue(row.nonMember)}
              </td>
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
