import { SimplePage } from "@/components/SimplePage";

export default function DiagnosisPage() {
  return (
    <SimplePage
      kicker="Diagnosis"
      title="あなたに合う海洋産業の入口を見つける。"
      description="関心テーマ、経験職種、働き方の希望から、あなたに合いそうな海洋産業の領域や職種を診断します。まだ転職を決めていない方も、情報収集の第一歩として利用できます。"
      items={["関心テーマ診断", "職種適性", "採用課題診断", "相談導線"]}
      cta="診断をはじめる"
      ctaHref="#contents"
      secondaryCta="結果について相談する"
      secondaryHref="/contact"
      backgroundClass="subpage-bg-sun-jellyfish"
    />
  );
}
