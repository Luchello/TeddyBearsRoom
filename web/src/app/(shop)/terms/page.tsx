/**
 * Terms of Service Page
 * TeddyBear's Room - 이용약관
 */

import Link from "next/link";

export const metadata = {
  title: "이용약관 | TeddyBear's Room",
  description: "TeddyBear's Room 서비스 이용약관입니다.",
};

const sections = [
  {
    title: "제1조 (목적)",
    content: `본 약관은 TeddyBear's Room(이하 "회사")이 제공하는 전자상거래 관련 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.`,
  },
  {
    title: "제2조 (정의)",
    content: `① "서비스"란 회사가 운영하는 온라인 쇼핑몰(teddybearsroom.com)을 통해 제공하는 전자상거래 관련 서비스를 말합니다.
② "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
③ "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
④ "비회원"이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.`,
  },
  {
    title: "제3조 (약관의 명시, 효력 및 개정)",
    content: `① 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
② 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
③ 개정된 약관은 적용일자 및 개정사유를 명시하여 공지합니다.
④ 이용자가 개정약관의 적용에 동의하지 않는 경우 서비스 이용을 중단하고 회원탈퇴를 할 수 있습니다.`,
  },
  {
    title: "제4조 (서비스의 제공 및 변경)",
    content: `① 회사는 다음과 같은 서비스를 제공합니다.
  - 상품 검색 및 정보 제공
  - 전자상거래 서비스
  - 배송 서비스
  - 기타 회사가 정하는 서비스
② 회사는 서비스의 품질 향상을 위해 서비스의 내용을 변경할 수 있으며, 이 경우 변경된 내용을 공지합니다.`,
  },
  {
    title: "제5조 (회원가입)",
    content: `① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
  - 가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
  - 등록 내용에 허위, 기재누락, 오기가 있는 경우
  - 만 19세 미만인 경우
  - 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우`,
  },
  {
    title: "제6조 (회원 탈퇴 및 자격 상실)",
    content: `① 회원은 언제든지 회사에 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.
② 회원이 다음 각 호의 사유에 해당하는 경우 회사는 회원자격을 제한 및 정지시킬 수 있습니다.
  - 가입 신청 시 허위 내용을 등록한 경우
  - 다른 사람의 서비스 이용을 방해하거나 정보를 도용한 경우
  - 회사를 이용하여 법령 또는 본 약관이 금지하는 행위를 한 경우
  - 기타 회사가 정한 이용조건에 위반한 경우`,
  },
  {
    title: "제7조 (구매계약의 성립)",
    content: `① 이용자는 회사가 제공하는 구매 절차에 따라 구매를 신청합니다.
② 회사는 이용자의 구매신청에 대해 승낙의 의사표시를 함으로써 구매계약이 성립합니다.
③ 회사는 다음 각 호에 해당하는 경우 구매신청을 승낙하지 않을 수 있습니다.
  - 신청 내용에 허위, 기재누락, 오기가 있는 경우
  - 만 19세 미만의 자가 성인용품을 구매하려는 경우
  - 기타 구매신청을 승낙하는 것이 회사 기술상 현저히 지장이 있다고 판단하는 경우`,
  },
  {
    title: "제8조 (결제방법)",
    content: `회사에서 구매한 상품에 대한 대금지급방법은 다음 각 호의 방법 중 가능한 방법으로 할 수 있습니다.
  - 신용카드 결제
  - 간편결제 (카카오페이, 토스페이 등)
  - 무통장입금
  - 기타 회사가 정한 결제방법`,
  },
  {
    title: "제9조 (배송)",
    content: `① 회사는 이용자가 구매한 상품에 대해 배송수단, 비용, 기간 등을 명시합니다.
② 회사는 이용자의 프라이버시 보호를 위해 무지박스로 배송합니다.
③ 배송 관련 세부사항은 배송 안내 페이지를 참조하시기 바랍니다.`,
  },
  {
    title: "제10조 (청약철회)",
    content: `① 이용자는 상품을 배송받은 날부터 7일 이내에 청약철회를 할 수 있습니다.
② 다만, 다음 각 호의 경우 청약철회가 제한됩니다.
  - 이용자의 책임 있는 사유로 상품이 멸실 또는 훼손된 경우
  - 포장을 개봉하였거나 사용한 경우 (위생상의 이유)
  - 복제가 가능한 상품의 포장을 훼손한 경우
③ 교환 및 반품에 관한 세부사항은 교환/반품 안내 페이지를 참조하시기 바랍니다.`,
  },
  {
    title: "제11조 (개인정보보호)",
    content: `회사는 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 준수합니다. 자세한 내용은 개인정보처리방침을 참조하시기 바랍니다.`,
  },
  {
    title: "제12조 (면책조항)",
    content: `① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
② 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.
③ 회사는 이용자가 게재한 정보, 자료, 사실의 신뢰도, 정확성 등에 대해서는 책임을 지지 않습니다.`,
  },
  {
    title: "제13조 (분쟁해결)",
    content: `① 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위해 고객센터를 운영합니다.
② 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.`,
  },
  {
    title: "부칙",
    content: `본 약관은 2024년 1월 1일부터 시행됩니다.`,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#FFD6E0] opacity-30 blur-[100px]" />

        <div className="container relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-xl">📜</span>
              <span className="text-sm font-medium text-[#E8879C]">Terms of Service</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2D2D]">
              이용약관
            </h1>
            <p className="text-[#6B6B6B]">
              TeddyBear&apos;s Room 서비스 이용에 관한 약관입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <div className="mb-8 p-4 bg-[#FFF5F7] rounded-2xl border border-[#FFE8EE]">
              <p className="text-sm text-[#6B6B6B]">
                <span className="font-semibold text-[#E8879C]">최종 수정일:</span> 2024년 1월 1일
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#FFE8EE]/50"
                >
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] flex items-center justify-center text-white text-sm">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="text-[#6B6B6B] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
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
