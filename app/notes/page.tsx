import { SimplePage } from "@/components/SimplePage";

export default function NotesPage() {
  return (
    <SimplePage
      kicker="note"
      title="思想と解体新書を読む"
      description="noteで公開した記事を取り込み、思想、業態別、求職者向け、採用担当者向けに分類します。"
      items={["思想", "業態別の解体新書", "求職者向け", "採用担当者向け"]}
    />
  );
}
