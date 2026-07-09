import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { DiagnosisForm } from "@/components/DiagnosisForm";
import { ProfileCta } from "@/components/ProfileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "海洋産業キャリア診断 | Ocean Quest",
  description:
    "回答に応じて質問が変わる11問の診断で、水中ロボティクス、洋上風力、海洋データなど9領域×4つの職種タイプから、あなたの海洋キャリアタイプ・想定職種・想定年収帯まで診断します。",
  path: "/diagnosis",
});

export default function DiagnosisPage() {
  return (
    <main className="subpage-shell subpage-bg-sun-jellyfish">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">Diagnosis</p>
        <h1>あなたに合う海洋産業の入口を見つける。</h1>
        <div className="diagnosis-hero-badges" aria-label="診断の概要">
          <span>全11問</span>
          <span>約3分</span>
          <span>回答で質問が変わる</span>
          <span>9領域×4タイプ判定</span>
          <span>無料</span>
        </div>
        <p>
          経歴や志向に応じて次の質問が変わる、あなた専用の診断フローです。海洋産業の9領域とのマッチ度に加えて、4つの職種タイプ(エンジニア/リサーチャー/ビジネスビルダー/フィールドリーダー)をかけ合わせ、あなたのタイプ・想定職種・想定年収帯まで提示します。
        </p>
        <ul className="diagnosis-hero-points">
          <li>9領域それぞれとのマッチ度が%でわかる</li>
          <li>タイプ判定・想定職種・想定年収帯・市場価値までわかる</li>
          <li>結果は画面で全文表示。メールでも届き、保存版PDFもダウンロードできる</li>
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
        <div className="diagnosis-preview-card diagnosis-preview-hero">
          <div>
            <p className="diagnosis-preview-label">あなたの海洋キャリアタイプ（例）</p>
            <h3>深海フロンティアを拓く、エンジニアタイプ</h3>
            <p className="diagnosis-preview-sub">水中ロボティクス × 開発・エンジニア型</p>
            <p>
              AUV・ROV・水中ドローンなど、海の中で動く機械をつくる領域があなたの入口。機械・電気・制御・組込みの経験を海洋産業に接続しやすく、「まだ誰もやっていない」に燃えるタイプです。
            </p>
            <div className="diagnosis-preview-stats" aria-label="結果に含まれるサマリー">
              <span>
                <strong>想定職種</strong>
                AUV/ROV開発エンジニア
              </span>
              <span>
                <strong>想定年収帯（目安）</strong>
                500〜900万円
              </span>
              <span>
                <strong>市場価値</strong>
                S（希少×急成長）
              </span>
            </div>
          </div>
          <div className="diagnosis-preview-metrics" aria-label="診断結果に含まれる項目">
            <span>
              <strong>9領域マッチ度</strong>
              全領域を%バーで表示。2位以降の選択肢も見える
            </span>
            <span>
              <strong>あなたはこんなタイプ</strong>
              興味を惹かれるもの・ウキウキする環境を言語化
            </span>
            <span>
              <strong>あなたの強み</strong>
              回答から見えた強みを4つに整理
            </span>
            <span>
              <strong>あなたの回答への解説</strong>
              重要な回答には個別の深掘りコメント付き
            </span>
            <span>
              <strong>次に広げるべき領域</strong>
              市場価値を伸ばす隣接領域を提案
            </span>
            <span>
              <strong>結果はメールでもお届け</strong>
              いつでも見返せる。保存版PDFも無料
            </span>
          </div>
        </div>
        <div className="diagnosis-axis-grid" aria-label="診断で見る3つの軸">
          <div>
            <span>Axis 1</span>
            <strong>経歴・スキル</strong>
            <p>
              あなたの経歴に応じて深掘り質問が変化。技術・ビジネス・現場・研究、それぞれ専用の質問が出ます。
            </p>
          </div>
          <div>
            <span>Axis 2</span>
            <strong>興味・価値観</strong>
            <p>どの海洋テーマに心が動くか、どんな瞬間にウキウキするかから領域を絞り込みます。</p>
          </div>
          <div>
            <span>Axis 3</span>
            <strong>働き方・将来像</strong>
            <p>海との距離感、目標年収、5年後の姿から、職種タイプと入口を特定します。</p>
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
