import type { Metadata } from "next";
import Script from "next/script";
import { FloatingCta } from "@/components/FloatingCta";
import "./globals.css";

const siteTitle = "Ocean Quest | 海洋産業専門の採用・転職・キャリア支援サービス";
const siteDescription =
  "Ocean Questは、海洋産業に特化した採用・転職・キャリア支援サービスです。造船・洋上風力・海洋ロボット（水中ロボティクス）・港湾・海運・海底資源など9領域を対象に、海洋業界への転職相談、キャリア診断、企業の採用支援まで、海に関わる人と企業をつなぎます。";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ocean-quest.jp";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Ocean Quest",
    url: baseUrl,
    logo: `${baseUrl}/images/brand/ocean-quest-logo.png`,
    description: siteDescription,
    parentOrganization: {
      "@type": "Organization",
      name: "株式会社ポテンシャライト",
      url: "https://www.potentialight.co",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${baseUrl}/contact`,
      availableLanguage: "ja",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Ocean Quest",
    alternateName: "オーシャンクエスト",
    url: baseUrl,
    inLanguage: "ja",
    publisher: { "@id": `${baseUrl}/#organization` },
    about: [
      "海洋産業の転職・採用",
      "造船・船舶DX",
      "洋上風力発電",
      "水中ロボティクス（海洋ロボット）",
      "港湾・海運DX",
      "海底資源",
      "海洋データ",
      "海洋バイオ",
      "海洋インフラ",
      "海洋防衛・安全保障",
    ].map((name) => ({ "@type": "Thing", name })),
  },
];

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
    images: ["/images/ocean-quest-hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/ocean-quest-hero.jpg"],
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
        <FloatingCta />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
