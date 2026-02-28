import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { brandValues, brandTimeline } from "@/lib/data";
import { Heart, ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                About
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-display text-foreground">
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
              <div className="aspect-square rounded-3xl bg-[#C8A2C8]/15 flex items-center justify-center p-12">
                <div className="w-full h-full relative">
                  <Image
                    src="/tbr_logo.png"
                    alt="TeddyBear's Room Logo"
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Values
            </p>
            <h2 className="mt-3 text-2xl font-display text-foreground lg:text-3xl">
              우리의 가치
            </h2>
            <p className="mt-2 text-muted-foreground">
              TeddyBear&apos;s Room이 추구하는 가치입니다
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {brandValues.map((value, idx) => (
              <Card key={idx} className="rounded-3xl border-border">
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
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Story
            </p>
            <h2 className="mt-3 text-2xl font-display text-foreground lg:text-3xl">
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
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Journey
            </p>
            <h2 className="mt-3 text-2xl font-display text-foreground lg:text-3xl">
              브랜드 여정
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-8">
              {brandTimeline.map((item, idx) => (
                <div key={idx} className="relative flex items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold z-10">
                    {item.year}
                  </div>
                  <div className="flex-1 rounded-3xl bg-card p-4 border border-border">
                    <p className="text-foreground">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Summary */}
      <section className="bg-[#C8A2C8]/15 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Donation
            </p>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6 mt-3">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display text-foreground lg:text-3xl">
              함께하는 나눔
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              테디베어즈룸 멤버십 회원의 구매금액 일부는 좋은 곳에 기부됩니다.
              <br />
              여러분의 구매가 따뜻한 나눔으로 이어집니다.
            </p>
          </div>

          {/* MVP: 단일 멤버십 기부 카드 */}
          <div className="mt-10 max-w-xs mx-auto">
            <Card className="rounded-3xl bg-primary/10 border-2 border-primary/30">
              <CardContent className="p-8 text-center">
                <span className="text-4xl">🐻</span>
                <p className="font-semibold text-foreground mt-3 text-lg">TBR 멤버십</p>
                <p className="text-3xl font-bold text-primary mt-2">5%</p>
                <p className="text-sm text-muted-foreground">구매금액 기부</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/donation">
                기부 현황 자세히 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            Contact
          </p>
          <h2 className="mt-3 text-2xl font-display text-foreground lg:text-3xl">
            궁금한 점이 있으신가요?
          </h2>
          <p className="mt-4 text-muted-foreground">
            언제든지 편하게 연락해 주세요
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Card className="rounded-3xl border-border">
              <CardContent className="p-6 text-center">
                <Mail className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="font-medium text-foreground">hello@teddybearsroom.shop</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-border">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">카카오톡</p>
                <p className="font-medium text-foreground">@teddybearsroom</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-border">
              <CardContent className="p-6 text-center">
                <Phone className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
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
