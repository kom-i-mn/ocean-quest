import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteTitle = "Ocean Quest | 海洋産業専門の採用・転職・キャリア支援サービス";
const siteDescription =
  "Ocean Questは、海洋産業に特化した採用・転職・キャリア支援サービスです。海洋業界への転職相談、海洋求人の紹介、企業の採用支援まで、海洋産業に関わる人と企業をつなぎます。";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ocean-quest.jp",
  ),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Ocean Quest",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/ocean-quest-hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/ocean-quest-hero.png"],
  },
  verification: {
    google: "gSZ3B4blvKNrTKZyfRZegZJWCfsEEl6PxGb-UFU6Zmk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ja">
      <body>
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
