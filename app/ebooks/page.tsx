import { SimplePage } from "@/components/SimplePage";

export default function EbooksPage() {
  return (
    <SimplePage
      kicker="eBooks"
      title="海洋産業の採用・キャリア資料"
      description="動画やnoteから生まれた知見を、求職者・採用担当者向けのeBookとして蓄積します。"
      items={["海洋産業採用の教科書", "業態別解体新書", "職種マップ", "採用市場レポート"]}
      backgroundClass="subpage-bg-bubbles"
    />
  );
}
