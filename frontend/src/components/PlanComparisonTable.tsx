"use client";

// ====================================
// TeddyBear's Room - Plan Comparison Table
// Side-by-side subscription plan comparison
// ====================================

import { Check, X } from "lucide-react";

interface ComparisonRow {
  feature: string;
  nonMember: string | boolean;
  standard: string | boolean;
  premium: string | boolean;
}

const comparisonData: ComparisonRow[] = [
  { feature: "포인트 적립", nonMember: "0%", standard: "5%", premium: "10%" },
  { feature: "기부 투표 참여", nonMember: false, standard: "5%", premium: "10%" },
  { feature: "무료 배송", nonMember: "7만원 이상", standard: "5만원 이상", premium: "전 상품" },
  { feature: "할인 쿠폰", nonMember: false, standard: "매월 5%", premium: "매월 10%" },
  { feature: "신상품 얼리 액세스", nonMember: false, standard: false, premium: true },
  { feature: "전용 고객 상담", nonMember: false, standard: false, premium: true },
  { feature: "생일 특별 혜택", nonMember: false, standard: true, premium: true },
  { feature: "한정판 우선 구매", nonMember: false, standard: false, premium: true },
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
            <th className="text-center p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-center gap-1">
                <span>🐻</span>
                <span>스탠다드</span>
              </div>
              <div className="text-sm font-normal text-primary">19,900원/월</div>
            </th>
            <th className="text-center p-4 border-b border-border bg-primary/10 rounded-tr-xl">
              <div className="flex items-center justify-center gap-1">
                <span>👑</span>
                <span className="text-primary">프리미엄</span>
              </div>
              <div className="text-sm font-normal text-primary">29,900원/월</div>
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
              <td className="p-4 border-b border-border text-center text-foreground">
                {renderValue(row.standard)}
              </td>
              <td className="p-4 border-b border-border text-center text-foreground bg-primary/5">
                {renderValue(row.premium)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
