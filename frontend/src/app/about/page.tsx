import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: "🧸",
    title: "파스텔 감성",
    description:
      "부드럽고 아늑한 분위기로 특별한 경험을 선사합니다. 귀여움과 고급스러움을 동시에 담았어요.",
  },
  {
    icon: "🔒",
    title: "프라이버시 우선",
    description:
      "무지 박스 배송, 안전한 결제, 철저한 개인정보 보호. 고객의 프라이버시를 최우선으로 생각합니다.",
  },
  {
    icon: "💝",
    title: "함께하는 가치",
    description:
      "매출의 일부를 사회에 환원합니다. 구독자가 직접 기부처를 선택하는 참여형 기부 시스템을 운영해요.",
  },
  {
    icon: "✨",
    title: "큐레이션",
    description:
      "엄격한 기준으로 선별된 고품질 상품만을 제공합니다. 안전하고 신뢰할 수 있는 제품만 만나보세요.",
  },
];

const timeline = [
  { year: "2024", event: "TeddyBear's Room 브랜드 기획 시작" },
  { year: "2025", event: "온라인 쇼핑몰 런칭 예정" },
  { year: "2025", event: "엔트리 & 프리미엄 멤버십 오픈" },
  { year: "미래", event: "오프라인 경험 공간 오픈 예정" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground lg:text-5xl">
                <span className="text-primary">TeddyBear&apos;s Room</span>을
                <br />
                소개합니다
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                TeddyBear&apos;s Room은 파스텔 감성의 프라이빗 셀프케어 브랜드입니다.
                <br /><br />
                귀엽고 아늑한 공간에서 나만의 특별한 시간을 보낼 수 있도록,
                엄선된 고품질 제품과 따뜻한 경험을 제공합니다.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
                <span className="text-[180px]">🧸</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              우리의 가치
            </h2>
            <p className="mt-2 text-muted-foreground">
              TeddyBear&apos;s Room이 추구하는 가치입니다
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, idx) => (
              <Card key={idx} className="rounded-2xl border-border">
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">{value.icon}</span>
                  <h3 className="font-semibold text-foreground text-lg">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              우리의 이야기
            </h2>
          </div>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-center leading-relaxed">
              &quot;왜 이 분야의 제품들은 항상 어둡고 무겁게 느껴질까?&quot;
              <br /><br />
              이 질문에서 TeddyBear&apos;s Room은 시작되었습니다.
              <br /><br />
              우리는 셀프케어가 부끄럽거나 숨겨야 할 것이 아니라고 생각합니다.
              오히려 나 자신을 사랑하는 건강하고 아름다운 행위예요.
              <br /><br />
              테디베어가 주는 포근함처럼, 파스텔 톤의 부드러운 감성처럼,
              TeddyBear&apos;s Room은 여러분의 프라이빗한 시간을 더 특별하고 아늑하게 만들어 드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              브랜드 여정
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative flex items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold z-10">
                    {item.year}
                  </div>
                  <div className="flex-1 rounded-2xl bg-card p-4 border border-border">
                    <p className="text-foreground">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
            궁금한 점이 있으신가요?
          </h2>
          <p className="mt-4 text-muted-foreground">
            언제든지 편하게 연락해 주세요
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Card className="rounded-2xl border-border">
              <CardContent className="p-6 text-center">
                <span className="text-3xl mb-2 block">📧</span>
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="font-medium text-foreground">hello@teddybearsroom.shop</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border">
              <CardContent className="p-6 text-center">
                <span className="text-3xl mb-2 block">💬</span>
                <p className="text-sm text-muted-foreground">카카오톡</p>
                <p className="font-medium text-foreground">@teddybearsroom</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border">
              <CardContent className="p-6 text-center">
                <span className="text-3xl mb-2 block">📱</span>
                <p className="text-sm text-muted-foreground">인스타그램</p>
                <p className="font-medium text-foreground">@teddybearsroom</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
