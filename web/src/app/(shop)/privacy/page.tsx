/**
 * Privacy Policy Page
 * TeddyBear's Room - 개인정보처리방침
 */

import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 | TeddyBear's Room",
  description: "TeddyBear's Room 개인정보처리방침입니다.",
};

const sections = [
  {
    title: "제1조 (개인정보의 수집 및 이용 목적)",
    content: `회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

① 회원 가입 및 관리
  - 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증
  - 회원자격 유지·관리, 서비스 부정이용 방지
  - 만 19세 이상 성인인증, 각종 고지·통지

② 재화 또는 서비스 제공
  - 물품배송, 서비스 제공, 계약서·청구서 발송
  - 콘텐츠 제공, 맞춤서비스 제공, 본인인증

③ 고충처리
  - 민원인의 신원 확인, 민원사항 확인
  - 사실조사를 위한 연락·통지, 처리결과 통보`,
  },
  {
    title: "제2조 (수집하는 개인정보의 항목)",
    content: `회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.

① 필수 수집 항목
  - 회원가입: 이름, 이메일, 비밀번호, 연락처, 생년월일, 성인인증정보(CI/DI)
  - 주문/결제: 주문자명, 배송지 주소, 연락처, 결제정보

② 선택 수집 항목
  - 신체정보(사이즈 추천 서비스 이용 시)
  - 마케팅 수신 동의 여부

③ 서비스 이용 과정에서 자동 생성·수집되는 정보
  - IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 기기정보`,
  },
  {
    title: "제3조 (개인정보의 보유 및 이용 기간)",
    content: `회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.

① 회원 정보: 회원 탈퇴 시까지 (단, 관련 법령에 따라 보존이 필요한 경우 해당 기간)

② 관련 법령에 의한 보존
  - 계약 또는 청약철회 등에 관한 기록: 5년
  - 대금결제 및 재화 등의 공급에 관한 기록: 5년
  - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
  - 표시/광고에 관한 기록: 6개월
  - 웹사이트 방문 기록: 3개월`,
  },
  {
    title: "제4조 (개인정보의 제3자 제공)",
    content: `회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등의 경우에만 개인정보를 제3자에게 제공합니다.

현재 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.

① 배송업체
  - 제공받는 자: 택배사
  - 제공 목적: 상품 배송
  - 제공 항목: 수령인명, 주소, 연락처
  - 보유 기간: 배송 완료 후 3개월

② 결제대행사
  - 제공받는 자: 토스페이먼츠
  - 제공 목적: 결제 처리
  - 제공 항목: 결제정보
  - 보유 기간: 결제 완료 후 5년`,
  },
  {
    title: "제5조 (개인정보처리의 위탁)",
    content: `회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.

① 위탁업체: 토스페이먼츠
   위탁업무: 결제처리

② 위탁업체: 택배사
   위탁업무: 상품배송

회사는 위탁계약 체결 시 관련 법령에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.`,
  },
  {
    title: "제6조 (정보주체의 권리·의무 및 행사방법)",
    content: `정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.

① 개인정보 열람 요구
② 오류 등이 있을 경우 정정 요구
③ 삭제 요구
④ 처리정지 요구

권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.

정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.`,
  },
  {
    title: "제7조 (개인정보의 파기)",
    content: `회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.

① 파기절차
회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.

② 파기방법
  - 전자적 파일 형태: 복원이 불가능한 방법으로 영구 삭제
  - 종이 문서: 분쇄기로 분쇄하거나 소각`,
  },
  {
    title: "제8조 (개인정보의 안전성 확보조치)",
    content: `회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.

① 관리적 조치
  - 내부관리계획 수립·시행
  - 개인정보 취급 직원의 최소화 및 교육

② 기술적 조치
  - 개인정보처리시스템 등의 접근권한 관리
  - 고유식별정보 등의 암호화
  - 보안프로그램 설치 및 주기적 갱신·점검
  - 개인정보의 암호화 저장 (pgcrypto)

③ 물리적 조치
  - 전산실, 자료보관실 등의 접근통제`,
  },
  {
    title: "제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부)",
    content: `회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.

① 쿠키의 사용 목적
  - 이용자의 접속 빈도나 방문 시간 등 분석
  - 이용자의 관심분야 파악 및 맞춤형 서비스 제공

② 쿠키의 설치·운영 및 거부
이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다.
  - 웹브라우저 옵션에서 모든 쿠키 허용/저장 시 확인/모든 쿠키 차단 선택 가능
  - 쿠키를 거부할 경우 맞춤형 서비스 이용에 제한이 있을 수 있습니다.`,
  },
  {
    title: "제10조 (개인정보 보호책임자)",
    content: `회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

▶ 개인정보 보호책임자
  - 직책: 대표
  - 연락처: help@teddybearsroom.com

정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.`,
  },
  {
    title: "제11조 (권익침해 구제방법)",
    content: `정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.

▶ 개인정보 침해신고센터 (한국인터넷진흥원 운영)
  - 소관업무: 개인정보 침해사실 신고, 상담 신청
  - 홈페이지: privacy.kisa.or.kr
  - 전화: (국번없이) 118

▶ 개인정보 분쟁조정위원회
  - 소관업무: 개인정보 분쟁조정신청, 집단분쟁조정
  - 홈페이지: www.kopico.go.kr
  - 전화: (국번없이) 1833-6972

▶ 대검찰청 사이버범죄수사단
  - 전화: 02-3480-3573
  - 홈페이지: www.spo.go.kr

▶ 경찰청 사이버안전국
  - 전화: (국번없이) 182
  - 홈페이지: cyberbureau.police.go.kr`,
  },
  {
    title: "제12조 (영상정보처리기기 운영·관리)",
    content: `회사는 영상정보처리기기를 운영하지 않습니다.`,
  },
  {
    title: "부칙",
    content: `본 개인정보처리방침은 2024년 1월 1일부터 시행됩니다.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#E8D5F2] opacity-30 blur-[100px]" />

        <div className="container relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-xl">🔒</span>
              <span className="text-sm font-medium text-[#E8879C]">Privacy Policy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2D2D]">
              개인정보처리방침
            </h1>
            <p className="text-[#6B6B6B]">
              TeddyBear&apos;s Room은 고객님의 개인정보를 소중히 보호합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <div className="mb-8 p-4 bg-[#F3E8FF]/50 rounded-2xl border border-[#E8D5F2]">
              <p className="text-sm text-[#6B6B6B]">
                <span className="font-semibold text-[#8B7AA8]">최종 수정일:</span> 2024년 1월 1일
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#FFE8EE]/50">
              <p className="text-[#6B6B6B] leading-relaxed">
                TeddyBear&apos;s Room(이하 &ldquo;회사&rdquo;)은 정보주체의 자유와 권리 보호를 위해
                「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고
                안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게
                개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게
                처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>
            </div>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#FFE8EE]/50"
                >
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C9A8E2] to-[#8BD4C0] flex items-center justify-center text-white text-sm">
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
                className="inline-flex items-center gap-2 text-[#8B7AA8] hover:text-[#7A6A98] transition-colors"
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
