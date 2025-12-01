import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { AuthModal } from "@/components/AuthModal";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { LatexBackground } from "@/components/ui/latex-background";

// Optimized font loading with next/font
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
  preload: true,
});

export const metadata: Metadata = {
  title: "TeddyBear's Room | 지뢰계 감성 프라이빗 셀프케어",
  description: "지뢰계 감성의 프라이빗 셀프케어 브랜드. 엄선된 고품질 상품과 따뜻한 경험을 제공합니다. ♡",
  keywords: ["성인용품", "셀프케어", "프라이빗", "테디베어즈룸", "TeddyBear's Room", "지뢰계"],
  authors: [{ name: "TeddyBear's Room" }],
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "TeddyBear's Room ♡",
    description: "지뢰계 감성의 프라이빗 셀프케어",
    type: "website",
    locale: "ko_KR",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={notoSansKR.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <ToastProvider>
            <LatexBackground />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CartDrawer />
            <WishlistDrawer />
            <AuthModal />
            <AgeVerificationModal />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
