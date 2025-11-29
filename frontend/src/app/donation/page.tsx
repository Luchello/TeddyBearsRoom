import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Users, FileText, TrendingUp, Clock, ExternalLink } from "lucide-react";

// 기부 데이터 (나중에 DB 연동 가능)
const donationStats = {
  totalAmount: 0,
  donationCount: 0,
  startDate: "2025년 Q2",
  nextDonation: "2025년 6월 예정",
};

// 기부 히스토리 (아직 없음)
const donationHistory: Array<{
  date: string;
  amount: number;
  organization: string;
  receiptUrl?: string;
}> = [];

// 구독 등급별 기부 비율
const donationRates = [
  {
    tier: "스탠다드",
    emoji: "🐻",
    rate: "5%",
    description: "구매금액의 5%가 기부됩니다",
    color: "bg-primary/10 text-primary",
  },
  {
    tier: "프리미엄",
    emoji: "👑",
    rate: "10%",
    description: "구매금액의 10%가 기부됩니다",
    color: "bg-accent/20 text-accent-foreground",
  },
];

// 우리의 약속
const promises = [
  {
    icon: Clock,
    title: "분기별 기부 진행",
    description: "3개월마다 정기적으로 기부를 진행합니다",
  },
  {
    icon: FileText,
    title: "영수증 100% 공개",
    description: "모든 기부 내역과 영수증을 투명하게 공개합니다",
  },
  {
    icon: TrendingUp,
    title: "투명한 금액 공시",
    description: "누적 기부 금액을 실시간으로 업데이트합니다",
  },
];

export default function DonationPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground lg:text-5xl">
              <span className="text-primary">TeddyBear&apos;s Room</span>과
              <br />
              함께하는 나눔
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              여러분의 구매가 따뜻한 나눔으로 이어집니다.
              <br />
              테디베어즈룸 구독 회원의 구매금액 일부는 좋은 곳에 기부됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 누적 기부 현황 */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Card className="rounded-3xl border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  누적 기부금
                </p>
                <p className="text-5xl lg:text-7xl font-bold text-primary mb-4">
                  {formatCurrency(donationStats.totalAmount)}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>첫 기부는 {donationStats.startDate}에 진행될 예정입니다</span>
                </div>
              </div>

              {/* 구독 등급별 기부 비율 */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {donationRates.map((rate) => (
                  <div
                    key={rate.tier}
                    className={`rounded-2xl p-6 ${rate.color}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{rate.emoji}</span>
                      <span className="font-semibold">{rate.tier} 멤버십</span>
                    </div>
                    <p className="text-3xl font-bold mb-1">{rate.rate}</p>
                    <p className="text-sm opacity-80">{rate.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 파트너 단체 */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              🤝 파트너 단체
            </h2>
            <p className="mt-2 text-muted-foreground">
              테디베어즈룸과 함께하는 기부 파트너
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Coming Soon 플레이스홀더들 */}
            {[1, 2, 3].map((idx) => (
              <Card key={idx} className="rounded-2xl border-dashed border-2 border-muted">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-muted-foreground">Coming Soon</p>
                  <p className="text-sm text-muted-foreground mt-1">파트너 선정 중</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            기부 파트너 단체는 신중하게 선정 중입니다.
            <br />
            확정되는 대로 이 페이지에서 안내해 드리겠습니다.
          </p>
        </div>
      </section>

      {/* 기부 히스토리 */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              📜 기부 히스토리
            </h2>
            <p className="mt-2 text-muted-foreground">
              모든 기부 내역을 투명하게 공개합니다
            </p>
          </div>

          {donationHistory.length > 0 ? (
            <div className="space-y-4">
              {donationHistory.map((item, idx) => (
                <Card key={idx} className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.organization}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(item.amount)}
                        </p>
                        {item.receiptUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={item.receiptUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="w-4 h-4 mr-2" />
                              영수증
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border-dashed border-2">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">
                  아직 기부 내역이 없습니다
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  첫 기부는 {donationStats.startDate}에 진행될 예정입니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* 우리의 약속 */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              💬 우리의 약속
            </h2>
            <p className="mt-2 text-muted-foreground">
              테디베어즈룸이 지키는 기부 원칙
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {promises.map((promise) => (
              <Card key={promise.title} className="rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <promise.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {promise.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {promise.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
            함께 나눔에 동참해 주세요
          </h2>
          <p className="mt-4 text-muted-foreground">
            테디베어즈룸 멤버십에 가입하면 여러분의 구매가 자동으로 기부로 이어집니다
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/subscribe">
                <Heart className="w-5 h-5 mr-2" />
                멤버십 알아보기
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">
                <ExternalLink className="w-5 h-5 mr-2" />
                브랜드 소개
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
