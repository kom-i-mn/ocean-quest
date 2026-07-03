import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ocean-quest.jp",
  ),
  title: "Ocean Quest | 海洋産業に特化した人材支援・採用支援",
  description:
    "Ocean Questは、海洋産業に特化したキャリア・採用支援サービスです。動画、eBook、note、イベント、診断を通じて、海洋産業の人と組織をつなぎます。",
  openGraph: {
    title: "Ocean Quest",
    description: "海洋産業に特化した人材支援・採用支援サービス",
    images: ["/images/ocean-quest-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
