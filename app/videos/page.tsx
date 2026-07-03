import { SimplePage } from "@/components/SimplePage";

export default function VideosPage() {
  return (
    <SimplePage
      kicker="Videos"
      title="海洋産業を動画で学ぶ"
      description="YouTubeに投稿した対談、業界解説、職種解説を自動取得して表示するページです。"
      items={["専門家対談", "業界構造の解説", "職種インタビュー", "採用担当者向け動画"]}
    />
  );
}
