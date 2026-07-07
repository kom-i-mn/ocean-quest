import { SimplePage } from "@/components/SimplePage";

export const metadata = {
  title: "eBook | 海洋産業の採用・キャリア資料 | Ocean Quest",
  description:
    "海洋産業の業界理解・職種理解・採用市場・企業研究に使えるeBookを準備中。noteや動画で発信してきた知見を体系的な資料にまとめます。",
  alternates: { canonical: "/ebooks" },
};

export default function EbooksPage() {
  return (
    <SimplePage
      kicker="eBooks"
      title="海洋産業の採用・キャリアを、体系的に学ぶ。"
      description="noteや動画で発信してきた知見を、業界理解・職種理解・採用市場・企業研究に使える資料としてまとめています。求職者の情報収集にも、企業の採用設計にも活用できます。"
      items={["海洋産業採用の教科書", "業態別解体新書", "職種マップ", "採用市場レポート"]}
      cta="eBookを読む"
      ctaHref="#contents"
      secondaryCta="資料をダウンロード"
      secondaryHref="/contact"
      comingSoon
      backgroundClass="subpage-bg-bubbles"
    />
  );
}
