import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { DiagnosisForm } from "@/components/DiagnosisForm";
import { ProfileCta } from "@/components/ProfileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "海洋産業キャリア診断 | Ocean Quest",
  description:
    "10の質問に答えるだけで、海運・造船・港湾、海洋資源・エネルギー、海洋テック・データの3領域それぞれとのマッチ度を診断します。結果をもとに無料キャリア相談もできます。",
};

export default function DiagnosisPage() {
  return (
    <main className="subpage-shell subpage-bg-sun-jellyfish">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">Diagnosis</p>
        <h1>あなたに合う海洋産業の入口を見つける。</h1>
        <div className="diagnosis-hero-badges" aria-label="診断の概要">
          <span>全10問</span>
          <span>約3分</span>
          <span>無料</span>
          <span>結果はその場で表示</span>
        </div>
        <p>
          関心のあるテーマや活かしたい経験、働き方の志向など、10の質問から、海洋産業の3領域（海運・造船・港湾／海洋資源・エネルギー／海洋テック・データ）それぞれとのマッチ度を診断します。まだ転職を決めていない方も、情報収集の第一歩として利用できます。
        </p>
        <ul className="diagnosis-hero-points">
          <li>3領域それぞれとのマッチ度が%でわかる</li>
          <li>あなたに合う領域の職種例と、その理由がわかる</li>
          <li>市場動向・活かせる経験まで入った詳細版レポート(PDF)を無料でダウンロードできる</li>
        </ul>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="#diagnosis-form">
            診断をはじめる
            <ArrowRight size={18} />
          </a>
          <a className="secondary-button light" href="/contact">
            結果について相談する
          </a>
        </div>
      </section>

      <section className="section diagnosis-form-section" aria-label="海洋産業キャリア診断">
        <DiagnosisForm />
      </section>

      <ProfileCta primaryLabel="無料でキャリア相談する" />
      <SiteFooter />
    </main>
  );
}
