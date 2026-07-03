import { SimplePage } from "@/components/SimplePage";

export default function CompaniesPage() {
  return (
    <SimplePage
      kicker="For Companies"
      title="海洋産業の採用支援を相談する"
      description="採用ブランディング、スカウト、候補者理解、コンテンツ制作まで、海洋産業に特化して支援します。"
      items={["採用ブランディング", "スカウト支援", "母集団形成", "コンテンツ制作"]}
      cta="問い合わせる"
    />
  );
}
