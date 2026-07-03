import { SimplePage } from "@/components/SimplePage";

export default function DiagnosisPage() {
  return (
    <SimplePage
      kicker="Diagnosis"
      title="海洋産業キャリア診断"
      description="関心テーマ、経験職種、検討状況から、合いそうな領域や次の相談導線を返す診断ページです。"
      items={["関心テーマ診断", "職種適性", "採用課題診断", "相談導線"]}
      cta="企業向け相談へ"
    />
  );
}
