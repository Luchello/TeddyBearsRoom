/**
 * Shipping Info Page
 * TeddyBear's Room - 배송 안내
 */

import Link from "next/link";

export const metadata = {
  title: "배송 안내 | TeddyBear's Room",
  description: "TeddyBear's Room 배송 안내입니다.",
};

const shippingInfo = [
  {
    icon: "📦",
    title: "무지박스 배송",
    description:
      "고객님의 프라이버시를 최우선으로 생각합니다. 모든 상품은 무지박스로 배송되며, 외부에 상품명이나 브랜드명이 노출되지 않습니다. 송장에도 '생활용품'으로 표기됩니다.",
  },
  {
    icon: "🚚",
    title: "배송 업체",
    description:
      "CJ대한통운, 롯데택배 등 신뢰할 수 있는 택배사를 통해 안전하게 배송됩니다. 주문량에 따라 배송 업체가 달라질 수 있습니다.",
  },
  {
    icon: "⏰",
    title: "배송 소요 시간",
    description:
      "결제 완료 후 1-3일 내 배송됩니다 (영업일 기준). 도서산간 지역은 1-2일 추가 소요될 수 있습니다. 주문량이 많은 시기에는 배송이 다소 지연될 수 있습니다.",
  },
  {
    icon: "🎁",
    title: "선물 포장",
    description:
      "선물용 포장을 원하시면 주문 시 요청사항에 남겨주세요. 프라이버시를 위해 선물 포장에도 브랜드명은 표기되지 않습니다.",
  },
];

const shippingFees = [
  {
    type: "일반 회원",
    conditions: [
      { condition: "5만원 이상 구매", fee: "무료" },
      { condition: "5만원 미만 구매", fee: "3,000원" },
    ],
    highlight: false,
  },
  {
    type: "Roommate 회원",
    conditions: [
      { condition: "3만원 이상 구매", fee: "무료" },
      { condition: "3만원 미만 구매", fee: "3,000원" },
    ],
    highlight: true,
  },
  {
    type: "도서산간 지역",
    conditions: [
      { condition: "제주도", fee: "+3,000원" },
      { condition: "기타 도서산간", fee: "+5,000원" },
    ],
    highlight: false,
  },
];

const deliveryProcess = [
  { step: 1, title: "주문 완료", description: "결제가 완료되면 주문이 접수됩니다.", icon: "✓" },
  { step: 2, title: "상품 준비", description: "정성껏 상품을 포장합니다.", icon: "📋" },
  { step: 3, title: "배송 시작", description: "택배사에 상품이 인계됩니다.", icon: "🚚" },
  { step: 4, title: "배송 중", description: "배송 조회가 가능합니다.", icon: "📍" },
  { step: 5, title: "배송 완료", description: "상품이 도착했습니다!", icon: "🎉" },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#8BD4C0] opacity-20 blur-[100px]" />

        <div className="container relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-xl">📦</span>
              <span className="text-sm font-medium text-[#E8879C]">Shipping</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2D2D]">
              배송 안내
            </h1>
            <p className="text-[#6B6B6B]">
              안전하고 프라이빗한 배송을 약속드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Info Cards */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 mb-16">
              {shippingInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#FFE8EE]/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{info.icon}</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">
                    {info.title}
                  </h3>
                  <p className="text-[#6B6B6B] leading-relaxed">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Delivery Process */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-8 text-center">
                배송 과정
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {deliveryProcess.map((process, index) => (
                  <div key={process.step} className="flex items-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] flex items-center justify-center text-white text-2xl shadow-lg mb-3 mx-auto">
                        {process.icon}
                      </div>
                      <h4 className="font-bold text-[#2D2D2D] text-sm mb-1">
                        {process.title}
                      </h4>
                      <p className="text-xs text-[#6B6B6B]">
                        {process.description}
                      </p>
                    </div>
                    {index < deliveryProcess.length - 1 && (
                      <div className="hidden md:block w-12 h-0.5 bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Fees Table */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-8 text-center">
                배송비 안내
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {shippingFees.map((fee, index) => (
                  <div
                    key={index}
                    className={`rounded-3xl p-6 border transition-all duration-300 ${
                      fee.highlight
                        ? "bg-gradient-to-br from-[#FFF5F7] to-[#FFE8EE] border-[#FFB5C5] shadow-lg"
                        : "bg-white/90 border-[#FFE8EE]/50 hover:shadow-lg"
                    }`}
                  >
                    <h3 className="text-lg font-bold text-[#2D2D2D] mb-4 text-center">
                      {fee.type}
                      {fee.highlight && (
                        <span className="ml-2 text-xs bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] text-white px-2 py-0.5 rounded-full">
                          추천
                        </span>
                      )}
                    </h3>
                    <div className="space-y-3">
                      {fee.conditions.map((condition, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-[#6B6B6B]">
                            {condition.condition}
                          </span>
                          <span
                            className={
                              condition.fee === "무료"
                                ? "font-bold text-[#5BC4B0]"
                                : "font-medium text-[#2D2D2D]"
                            }
                          >
                            {condition.fee}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="bg-[#FFF5F7] rounded-3xl p-8 border border-[#FFE8EE]">
              <h3 className="font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span>
                배송 관련 안내사항
              </h3>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li>• 평일 오후 2시 이전 결제 완료 시 당일 출고됩니다.</li>
                <li>• 주말 및 공휴일에는 배송 업무가 진행되지 않습니다.</li>
                <li>• 배송 현황은 마이페이지 &gt; 주문내역에서 확인하실 수 있습니다.</li>
                <li>• 부재 시 경비실, 무인택배함 등에 맡겨질 수 있습니다.</li>
                <li>• 배송 관련 문의는 고객센터로 연락해 주세요.</li>
              </ul>
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
