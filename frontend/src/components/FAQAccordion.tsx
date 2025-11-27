"use client";

// ====================================
// TeddyBear's Room - FAQ Accordion
// Interactive expandable FAQ component
// ====================================

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/types";

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-border bg-card overflow-hidden transition-all dark:neon-card"
        >
          <button
            onClick={() => toggleItem(idx)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
            aria-expanded={openIndex === idx}
          >
            <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                openIndex === idx ? "rotate-180" : ""
              }`}
            />
          </button>
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
