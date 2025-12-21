/**
 * About Page
 * TeddyBear's Room - Brand Story & Mission
 */

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | TeddyBear's Room",
  description: "TeddyBear's Room의 브랜드 스토리와 미션을 소개합니다.",
};

// Team member placeholder
const teamMembers = [
  { name: "Bear", role: "Founder & CEO", emoji: "🧸" },
  { name: "Bunny", role: "Creative Director", emoji: "🐰" },
  { name: "Fox", role: "Product Manager", emoji: "🦊" },
  { name: "Cat", role: "Customer Experience", emoji: "🐱" },
];

// Values
const values = [
  {
    icon: "💕",
    title: "Self-Love First",
    description: "자신을 사랑하는 것이 가장 중요해요. 당신의 행복이 우리의 미션입니다.",
  },
  {
    icon: "🎀",
    title: "Aesthetic & Quality",
    description: "아름다움과 품질, 두 가지 모두 포기하지 않아요. 파스텔 감성으로 일상을 특별하게.",
  },
  {
    icon: "🔒",
    title: "Privacy & Trust",
    description: "무지박스 배송으로 완벽한 프라이버시를 보장해요. 당신의 비밀은 안전합니다.",
  },
  {
    icon: "🌱",
    title: "Sustainable Care",
    description: "환경을 생각하는 지속 가능한 패키징과 책임감 있는 제품 소싱을 추구해요.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#FFD6E0] opacity-40 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#E8D5F2] opacity-50 blur-[120px]" />

        {/* Floating Decorations */}
        <span className="absolute top-[15%] left-[10%] text-5xl opacity-20 animate-pulse">♡</span>
        <span className="absolute top-[25%] right-[15%] text-4xl opacity-15 animate-pulse">✧</span>
        <span className="absolute bottom-[20%] left-[20%] text-3xl opacity-20 animate-pulse">🎀</span>

        <div className="container relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-xl">🧸</span>
              <span className="text-sm font-medium text-[#E8879C]">Our Story</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-[#4A4A4A]">Soft Outside,</span>
              <br />
              <span className="bg-gradient-to-r from-[#FF8FAB] via-[#C9A8E2] to-[#8BD4C0] bg-clip-text text-transparent">
                Wild Inside.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#6B6B6B] leading-relaxed max-w-2xl mx-auto">
              TeddyBear&apos;s Room은 일상의 귀여움 속에 숨겨진
              <br className="hidden sm:block" />
              당신만의 특별한 순간을 위해 탄생했습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28">
        <div className="container px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image/Visual */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-[#FFF5F7] to-[#FFE8EE] rounded-[40px] shadow-2xl flex items-center justify-center relative overflow-hidden border border-[#FFD6E0]/30">
                {/* TBR Logo */}
                <div className="relative w-48 h-48">
                  <Image
                    src="/logo.png"
                    alt="TeddyBear's Room"
                    fill
                    sizes="192px"
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-6 right-6 text-3xl opacity-30">✧</div>
                <div className="absolute bottom-6 left-6 text-3xl opacity-30">♡</div>
                <div className="absolute top-1/4 left-6 text-2xl opacity-20">🎀</div>
                <div className="absolute bottom-1/4 right-6 text-2xl opacity-20">☆</div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 lg:right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-[#E8FFF5]">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7DD3C0] to-[#5BC4B0] flex items-center justify-center text-white text-lg">
                    ✓
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#5BC4B0]">Since 2024</p>
                    <p className="text-sm font-bold text-[#2D2D2D]">Premium Quality</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-6">
                  우리의 이야기 <span className="text-[#FFB5C5]">♡</span>
                </h2>
                <div className="space-y-4 text-[#6B6B6B] leading-relaxed">
                  <p>
                    TeddyBear&apos;s Room은 &ldquo;셀프케어는 부끄러운 것이 아니다&rdquo;라는
                    믿음에서 시작되었습니다. 우리는 모든 사람이 자신만의 방식으로
                    자기 자신을 사랑할 권리가 있다고 믿어요.
                  </p>
                  <p>
                    파스텔 톤의 부드러운 감성과 프리미엄 품질을 결합하여,
                    일상에서 특별한 순간을 만들어가는 것이 우리의 목표입니다.
                    귀여운 외면 속에 당신만의 와일드한 내면을 담아보세요.
                  </p>
                  <p>
                    완벽한 프라이버시 보장과 세심한 패키징으로,
                    당신의 비밀스러운 순간을 안전하게 지켜드립니다.
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] hover:from-[#FFA5B8] hover:to-[#D898B8] text-white px-8 py-6 rounded-2xl shadow-lg shadow-pink-200/50"
                asChild
              >
                <Link href="/products">
                  컬렉션 둘러보기
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFFBF8] to-[#FFF5F7]" />
        <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] bg-[#FFE8EE] rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-[#F3E8FF] rounded-full blur-[120px] opacity-30" />

        <div className="container relative z-10 px-6">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-xl opacity-60">✧</span>
              <span className="text-2xl">💝</span>
              <span className="text-xl opacity-60">✧</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D]">
              Our Values
            </h2>
            <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto">
              TeddyBear&apos;s Room이 소중히 여기는 가치들
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#FFE8EE]/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-lg text-[#2D2D2D] mb-3">{value.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28">
        <div className="container px-6">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-2xl">🏠</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D]">
              Meet Our Team
            </h2>
            <p className="text-[#6B6B6B] text-lg">
              TeddyBear&apos;s Room을 만들어가는 사람들
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#FFF5F7] to-[#FFE8EE] rounded-3xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-[#FFD6E0]/30"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/80 flex items-center justify-center text-4xl shadow-inner">
                  {member.emoji}
                </div>
                <h3 className="font-bold text-[#2D2D2D]">{member.name}</h3>
                <p className="text-sm text-[#8B8B8B]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFE8EE] via-[#F3E8FF] to-[#E8FFF5]" />
        <div className="container relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D]">
              함께해요 <span className="text-[#FFB5C5]">♡</span>
            </h2>
            <p className="text-[#6B6B6B] text-lg">
              TeddyBear&apos;s Room과 함께 특별한 순간을 만들어보세요.
              <br />
              Roommate가 되시면 더 많은 혜택이 기다리고 있어요!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#E8879C] to-[#C9A8E2] hover:from-[#D87790] hover:to-[#B898D2] text-white px-10 py-6 rounded-2xl shadow-lg"
                asChild
              >
                <Link href="/inner-circle">
                  Roommate 되기 🏠
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#E8D5F2] hover:bg-[#F3E8FF]/50 text-[#8B7AA8] px-10 py-6 rounded-2xl bg-white/50"
                asChild
              >
                <Link href="/products">
                  쇼핑하기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
