import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeddyBear's Room | Coming Soon",
  description: "Soft, Cute, Safe. Premium Adult Toy Shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
