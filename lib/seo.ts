import type { Metadata } from "next";

// ページ個別のメタデータを組み立てるヘルパー。
// Next.jsのメタデータは浅いマージのため、ページ側でopenGraph/twitterを
// 定義しないとルートlayoutのサイト共通タイトルがOGPに使われてしまう。
// 全サブページはこのヘルパーを通してog:title/og:descriptionを個別化する。
// og:image / twitter:image は各ルートの opengraph-image.tsx / twitter-image.tsx が自動設定する。
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: "Ocean Quest",
      title,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
