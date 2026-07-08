import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { DiagnosisForm } from "@/components/DiagnosisForm";
import { ProfileCta } from "@/components/ProfileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "海洋産業キャリア診断 | Ocean Quest",
  description:
    "12の質問に答えるだけで、水中ロボティクス、洋上風力、海洋インフラ、海底資源、海洋防衛・安全保障など9領域とのマッチ度を診断します。結果をもとに無料キャリア相談もできます。",
};

export default function DiagnosisPage() {
  return (
    <main className="subpage-shell subpage-bg-sun-jellyfish">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">Diagnosis</p>
        <h1>あなたに合う海洋産業の入口を見つける。</h1>
        <div className="diagnosis-hero-badges" aria-label="診断の概要">
          <span>全12問</span>
          <span>約3分</span>
          <span>9領域から判定</span>
          <span>無料</span>
          <span>結果はその場で表示</span>
        </div>
        <p>
          関心のあるテーマや活かしたい経験、働き方の志向など、12の質問から、海洋産業の9領域それぞれとのマッチ度を診断します。将来的には診断結果から、水中ロボティクス Quest、洋上風力 Quest、海洋インフラ Questなど各領域サイトへつながる入口にしていきます。
        </p>
        <ul className="diagnosis-hero-points">
          <li>9領域それぞれとのマッチ度が%でわかる</li>
          <li>あなたに合う領域・職種例・その理由がわかる</li>
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

      <section className="section diagnosis-preview-section" aria-label="診断結果の例">
        <div className="section-heading">
          <p className="section-kicker">Diagnosis Preview</p>
          <h2>こんな診断結果が出ます。</h2>
        </div>
        <div className="diagnosis-preview-card">
          <div>
            <p className="diagnosis-preview-label">あなたに近い海洋キャリア領域</p>
            <h3>水中ロボティクス Quest</h3>
            <p>
              AUV・ROV・水中ドローン、センサー、制御、耐圧・防水設計など、海の中で動く機械をつくる領域。機械・電気・制御・組込み・ロボティクスの経験を、海洋産業に接続しやすいタイプです。
            </p>
          </div>
          <div className="diagnosis-preview-metrics" aria-label="診断結果で表示される項目">
            <span>
              <strong>想定職種</strong>
              AUV/ROV開発、組込み制御、フィールド実証
            </span>
            <span>
              <strong>活かせる経験</strong>
              ロボティクス、FA、自動車、ドローン、画像/信号処理
            </span>
            <span>
              <strong>次の一手</strong>
              技術スタックを海洋用途に翻訳し、近接企業を調べる
            </span>
          </div>
        </div>
        <div className="diagnosis-axis-grid" aria-label="診断で見る3つの軸">
          <div>
            <span>Axis 1</span>
            <strong>興味テーマ</strong>
            <p>ロボット、エネルギー、インフラ、バイオなど、どの海洋テーマに心が動くか。</p>
          </div>
          <div>
            <span>Axis 2</span>
            <strong>活かせる経験</strong>
            <p>技術、事業開発、現場運営、研究、データなど、これまでの経験との接続先。</p>
          </div>
          <div>
            <span>Axis 3</span>
            <strong>働き方の志向</strong>
            <p>研究開発、大型PJ、社会インフラ、現場DXなど、向いている関わり方。</p>
          </div>
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
