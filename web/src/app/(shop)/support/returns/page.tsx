/**
 * Returns & Exchange Page
 * TeddyBear's Room - 교환/반품 안내
 */

import Link from "next/link";

export const metadata = {
  title: "교환/반품 안내 | TeddyBear's Room",
  description: "TeddyBear's Room 교환 및 반품 안내입니다.",
};

const returnPolicies = [
  {
    icon: "✅",
    title: "교환/반품 가능",
    items: [
      "상품 수령 후 7일 이내",
      "상품 하자 또는 오배송의 경우",
      "포장 미개봉 상태의 상품",
      "상품 및 포장 상태가 재판매 가능한 경우",
    ],
    color: "from-[#7DD3C0] to-[#5BC4B0]",
  },
  {
    icon: "❌",
    title: "교환/반품 불가",
    items: [
      "포장을 개봉한 상품 (위생상의 이유)",
      "사용 흔적이 있는 상품",
      "고객 부주의로 상품이 훼손된 경우",
      "구매 후 7일이 경과한 상품",
    ],
    color: "from-[#FFB5C5] to-[#E8879C]",
  },
];

const returnSteps = [
  {
    step: 1,
    title: "신청하기",
    description: "마이페이지 > 주문내역에서 교환/반품 신청을 합니다.",
    icon: "📝",
  },
  {
    step: 2,
    title: "승인 대기",
    description: "신청 내용을 확인 후 승인 여부를 안내드립니다.",
    icon: "⏳",
  },
  {
    step: 3,
    title: "상품 발송",
    description: "승인 후 상품을 안전하게 포장하여 발송합니다.",
    icon: "📦",
  },
  {
    step: 4,
    title: "검수 및 처리",
    description: "상품 확인 후 교환 발송 또는 환불 처리됩니다.",
    icon: "✓",
  },
];

const feeInfo = [
  {
    case: "상품 하자/오배송",
    fee: "무료",
    note: "착불로 보내주세요",
    highlight: true,
  },
  {
    case: "단순 변심",
    fee: "5,000원 (왕복)",
    note: "선불로 보내주세요",
    highlight: false,
  },
  {
    case: "사이즈 교환",
    fee: "5,000원 (왕복)",
    note: "미개봉 상품에 한함",
    highlight: false,
  },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#C9A8E2] opacity-20 blur-[100px]" />

        <div className="container relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-xl">🔄</span>
              <span className="text-sm font-medium text-[#E8879C]">Returns</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2D2D]">
              교환/반품 안내
            </h1>
            <p className="text-[#6B6B6B]">
              상품에 문제가 있으신가요? 걱정 마세요, 저희가 도와드릴게요.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="max-w-5xl mx-auto">
            {/* Return Policies */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {returnPolicies.map((policy, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#FFE8EE]/50"
                >
                  <div
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${policy.color} text-white rounded-full px-4 py-2 mb-6`}
                  >
                    <span className="text-xl">{policy.icon}</span>
                    <span className="font-bold">{policy.title}</span>
                  </div>
                  <ul className="space-y-3">
                    {policy.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-[#6B6B6B]"
                      >
                        <span className="text-[#E8879C] mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Return Process */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-8 text-center">
                교환/반품 절차
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {returnSteps.map((step) => (
                  <div
                    key={step.step}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-[#FFE8EE]/50 text-center relative"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="text-3xl mt-4 mb-3">{step.icon}</div>
                    <h3 className="font-bold text-[#2D2D2D] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#6B6B6B]">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Info */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-8 text-center">
                배송비 안내
              </h2>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#FFE8EE]/50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#FFF5F7] to-[#FFE8EE]">
                      <th className="py-4 px-6 text-left font-bold text-[#2D2D2D]">
                        구분
                      </th>
                      <th className="py-4 px-6 text-center font-bold text-[#2D2D2D]">
                        배송비
                      </th>
                      <th className="py-4 px-6 text-right font-bold text-[#2D2D2D]">
                        비고
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeInfo.map((info, index) => (
                      <tr
                        key={index}
                        className="border-t border-[#FFE8EE]/50 hover:bg-[#FFF5F7]/30 transition-colors"
                      >
                        <td className="py-4 px-6 text-[#2D2D2D]">
                          {info.case}
                        </td>
                        <td
                          className={`py-4 px-6 text-center font-bold ${
                            info.highlight ? "text-[#5BC4B0]" : "text-[#2D2D2D]"
                          }`}
                        >
                          {info.fee}
                        </td>
                        <td className="py-4 px-6 text-right text-sm text-[#6B6B6B]">
                          {info.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Return Address */}
            <div className="mb-16 bg-[#F3E8FF]/50 rounded-3xl p-8 border border-[#E8D5F2]">
              <h3 className="font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
                <span className="text-xl">📮</span>
                반품 주소
              </h3>
              <div className="text-[#6B6B6B] space-y-2">
                <p>
                  <span className="font-medium text-[#8B7AA8]">수취인:</span>{" "}
                  TeddyBear&apos;s Room 교환/반품 담당
                </p>
                <p>
                  <span className="font-medium text-[#8B7AA8]">주소:</span>{" "}
                  (반품 승인 후 안내해 드립니다)
                </p>
                <p>
                  <span className="font-medium text-[#8B7AA8]">연락처:</span>{" "}
                  help@teddybearsroom.com
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-[#FFF5F7] rounded-3xl p-8 border border-[#FFE8EE]">
              <h3 className="font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                주의사항
              </h3>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li>
                  • 위생 상품 특성상 포장 개봉 시 교환/반품이 불가합니다.
                </li>
                <li>
                  • 반품 시 상품과 함께 받으신 모든 구성품을 함께 보내주세요.
                </li>
                <li>• 환불은 상품 확인 후 3-5 영업일 내에 처리됩니다.</li>
                <li>• 카드 결제 취소 시 카드사에 따라 환불일이 달라질 수 있습니다.</li>
                <li>• 교환 시 재고 상황에 따라 교환이 불가할 수 있습니다.</li>
              </ul>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center bg-gradient-to-r from-[#FFE8EE] via-[#F3E8FF] to-[#E8FFF5] rounded-3xl p-8">
              <p className="text-[#6B6B6B] mb-4">
                교환/반품 관련 문의사항이 있으신가요?
              </p>
              <Link
                href="/support/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                1:1 문의하기
                <span>→</span>
              </Link>
            </div>

            {/* Back to Home */}
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#E8879C] hover:text-[#D87790] transition-colors"
              >
                <span>←</span>
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
