import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const plans = [
  {
    name: "엔트리",
    icon: "🐻",
    price: 19900,
    period: "월",
    description: "TeddyBear's Room을 시작하는 분들을 위한 플랜",
    features: [
      { text: "포인트 2배 적립", included: true },
      { text: "기부 투표 참여 (5%)", included: true },
      { text: "5만원 이상 무료 배송", included: true },
      { text: "매월 5% 할인 쿠폰", included: true },
      { text: "신상품 얼리 액세스", included: false },
      { text: "전용 고객 상담", included: false },
    ],
    popular: false,
    cta: "엔트리 시작하기",
  },
  {
    name: "프리미엄",
    icon: "👑",
    price: 29900,
    period: "월",
    description: "혜택은 2배! 가격은 혜택의 절반만!",
    features: [
      { text: "포인트 4배 적립", included: true },
      { text: "기부 투표 참여 (10%)", included: true },
      { text: "전 상품 무료 배송", included: true },
      { text: "매월 10% 할인 쿠폰", included: true },
      { text: "신상품 얼리 액세스", included: true },
      { text: "전용 고객 상담", included: true },
    ],
    popular: true,
    cta: "프리미엄 시작하기",
  },
];

const faqs = [
  {
    q: "구독은 언제든지 취소할 수 있나요?",
    a: "네, 언제든지 취소 가능합니다. 취소 시 다음 결제일부터 자동 해지되며, 이미 결제된 기간의 혜택은 유지됩니다.",
  },
  {
    q: "기부 투표는 어떻게 진행되나요?",
    a: "매월 초 3개의 기부 단체가 선정되며, 구독자들의 투표로 최종 기부처가 결정됩니다. 투표 결과는 매월 말 공개됩니다.",
  },
  {
    q: "포인트는 어떻게 사용하나요?",
    a: "적립된 포인트는 1포인트 = 1원으로 모든 상품 구매 시 사용 가능합니다. 유효기간은 적립일로부터 1년입니다.",
  },
  {
    q: "배송은 어떻게 되나요?",
    a: "모든 배송은 무지 박스로 진행되어 프라이버시를 보장합니다. 주문 후 1-2일 내 출고됩니다.",
  },
];

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-accent/10 via-primary/5 to-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <span className="text-6xl mb-4 block">🧸✨</span>
          <h1 className="text-3xl font-bold text-foreground lg:text-5xl">
            TeddyBear&apos;s Room<br />
            <span className="text-primary">멤버십</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            특별한 혜택과 함께 더 특별한 경험을 만들어보세요.
            <br />
            구독하고, 기부하고, 함께 성장해요.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative rounded-3xl ${
                  plan.popular
                    ? "border-2 border-primary shadow-lg shadow-primary/20"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                      인기 플랜
                    </span>
                  </div>
                )}
                <CardHeader className="p-8 text-center">
                  <span className="text-5xl mb-2 block">{plan.icon}</span>
                  <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">원/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        {feature.included ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                            ✓
                          </span>
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            –
                          </span>
                        )}
                        <span
                          className={
                            feature.included ? "text-foreground" : "text-muted-foreground"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button
                    className={`w-full rounded-xl py-6 text-lg ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="bg-gradient-to-r from-secondary/10 to-primary/10 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="text-5xl mb-4 block">💝</span>
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
            함께하는 기부
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            TeddyBear&apos;s Room은 매출의 일부를 사회에 환원합니다.
            <br />
            구독자 여러분이 기부처를 직접 선택할 수 있어요.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-card p-6">
              <span className="text-3xl">🌱</span>
              <p className="mt-2 font-medium text-foreground">환경 단체</p>
            </div>
            <div className="rounded-2xl bg-card p-6">
              <span className="text-3xl">🐾</span>
              <p className="mt-2 font-medium text-foreground">동물 복지</p>
            </div>
            <div className="rounded-2xl bg-card p-6">
              <span className="text-3xl">👶</span>
              <p className="mt-2 font-medium text-foreground">아동 보호</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="rounded-2xl border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
