"use client";

// ====================================
// TeddyBear's Room - FAQAccordion 컴포넌트
// 확장/축소 가능한 FAQ 아코디언
// ====================================
//
// 🎯 용도:
// - 자주 묻는 질문(FAQ) 목록 표시
// - 한 번에 하나의 항목만 열림 (single-open behavior)
// - 상품 상세 페이지, 사용 설명서 등에 활용
//
// 📦 구조:
// - FAQ 항목 배열 순회
// - openIndex 상태로 열린 항목 추적
// - 클릭 시 토글 (열림↔닫힘)
//
// 🎨 디자인:
// - rounded-2xl: 둥근 모서리 카드
// - ChevronDown 아이콘 회전 애니메이션 (rotate-180)
// - max-h-96/max-h-0: height 애니메이션으로 부드러운 오픈/클로즈
// - hover:bg-muted/50: 호버 시 배경 변화
// - 다크모드 네온 효과
//
// 🔧 주요 기능:
// - toggleItem: 클릭한 항목 열기/닫기
// - duration-300: 부드러운 애니메이션 (300ms)
// - aria-expanded: 접근성 정보 제공
//
// 📝 의존성:
// - lucide-react: ChevronDown 아이콘
// - lib/types: FAQ 타입 정의
// ====================================

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/types";

// ──────────────────────────────────────
// Props 타입 정의
// ──────────────────────────────────────

interface FAQAccordionProps {
  /** FAQ 항목 배열 */
  faqs: FAQ[];
}

// ──────────────────────────────────────
// FAQAccordion 컴포넌트
// ──────────────────────────────────────

/**
 * FAQ 아코디언 컴포넌트
 *
 * @description
 * 확장/축소 가능한 FAQ 리스트를 렌더링합니다.
 * - 질문(q)과 답변(a)으로 구성된 FAQ 배열을 받음
 * - 클릭하면 해당 항목만 열림 (다른 항목은 자동 닫힘)
 * - 부드러운 애니메이션과 접근성 지원
 *
 * @param faqs - FAQ 항목 배열 ({ q: string, a: string })
 *
 * @example
 * const faqs = [
 *   { q: "배송은 얼마나 걸리나요?", a: "영업일 기준 2-3일..." },
 *   { q: "환불은 어떻게 하나요?", a: "구매 후 7일 이내..." }
 * ];
 * <FAQAccordion faqs={faqs} />
 */
export function FAQAccordion({ faqs }: FAQAccordionProps) {
  // 열린 항목의 인덱스 (null이면 모두 닫혀있음)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ──────────────────────────────────────
  // 항목 토글 핸들러
  // 같은 항목 클릭 시 닫음, 다른 항목 클릭 시 열기
  // ──────────────────────────────────────
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        // ─────────────────────────────────────
        // FAQ 항목 카드
        // - border-border: 테마 기반 테두리
        // - 다크모드에서 네온 효과
        // ───────────────────────────────────────
        <div
          key={idx}
          className="rounded-2xl border border-border bg-card overflow-hidden transition-all"
        >
          {/* ─────────────────────────────────────
              질문 헤더 (클릭 영역)
              ───────────────────────────────────── */}
          <button
            onClick={() => toggleItem(idx)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
            aria-expanded={openIndex === idx}
          >
            <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
            {/* 화살표 아이콘: 열려있으면 180도 회전 */}
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                openIndex === idx ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ─────────────────────────────────────
              답변 섹션 (토글 애니메이션)
              - max-h-96: 열려있을 때 최대 높이
              - max-h-0: 닫혀있을 때 높이 0
              - duration-300: 부드러운 애니메이션
              ───────────────────────────────────── */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === idx ? "max-h-96" : "max-h-0"
            }`}
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
