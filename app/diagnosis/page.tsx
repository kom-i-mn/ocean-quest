import type { Metadata } from "next";
import { DiagnosisForm } from "@/components/DiagnosisForm";
import { RdFx } from "@/components/RdFx";
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
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/sun-jellyfish.jpg')" }} />
        <div className="rd-sub-hero-inner">
          <p className="rd-kicker-w rd-rv">DIAGNOSIS — 海洋キャリア診断</p>
          <h1 className="rd-rv rd-rv-slow">
            あなたに合う海の入口を、
            <br />
            11問で見つける。
          </h1>
          <p className="rd-lead-w rd-rv rd-rv-slow">
            経歴や志向に応じて次の質問が変わる、あなた専用の診断フロー。海洋産業9領域とのマッチ度に、4つの職種タイプ（エンジニア/リサーチャー/ビジネスビルダー/フィールドリーダー）をかけ合わせて、あなたのタイプ・想定職種・想定年収帯まで提示します。
          </p>
          <div className="rd-badges rd-rv">
            <span>全11問</span>
            <span>約3分</span>
            <span>回答で質問が変わる</span>
            <span>9領域×4タイプ判定</span>
            <span>無料</span>
          </div>
          <div className="rd-final-ctas rd-rv" style={{ justifyContent: "flex-start", marginTop: 44 }}>
            <a className="rd-btn rd-btn-primary" href="#diagnosis-form">
              診断をはじめる
            </a>
          </div>
        </div>
      </section>

      <section className="rd-sec" aria-label="診断結果の例">
        <div className="rd-rv">
          <p className="rd-kicker">PREVIEW</p>
          <h2 className="rd-title">
            こんな<em>診断結果</em>が出ます。
          </h2>
        </div>
        <div className="rd-dx-card rd-rv">
          <p className="rd-dx-label">あなたの海洋キャリアタイプ（例）</p>
          <h3>
            深海フロンティアを拓く、
            <br />
            エンジニアタイプ
          </h3>
          <p className="rd-dx-sub">水中ロボティクス × 開発・エンジニア型</p>
          <p className="rd-dx-body">
            AUV・ROV・水中ドローンなど、海の中で動く機械をつくる領域があなたの入口。機械・電気・制御・組込みの経験を海洋産業に接続しやすく、「まだ誰もやっていない」に燃えるタイプです。
          </p>
          <div className="rd-dx-stats">
            <div>
              <strong>想定職種</strong>
              <span>AUV/ROV開発エンジニア</span>
            </div>
            <div>
              <strong>想定年収帯（目安）</strong>
              <span>500〜900万円</span>
            </div>
            <div>
              <strong>市場価値</strong>
              <span>S（希少×急成長）</span>
            </div>
          </div>
          <p className="rd-dx-note">
            結果には他にも: 9領域それぞれとのマッチ度（%バー）／あなたはこんなタイプ／あなたの強み4つ／重要な回答への個別解説／次に広げるべき領域。結果は画面で全文表示され、メールでも届き、保存版PDFも無料でダウンロードできます。
          </p>
        </div>
      </section>

      <section className="rd-dark-band" aria-label="診断で見る3つの軸">
        <div className="rd-dark-band-inner">
          <div className="rd-rv">
            <p className="rd-kicker">3 AXES</p>
            <h2 className="rd-title">
              診断で見る、<em>3つの軸</em>。
            </h2>
          </div>
          <div className="rd-stat-row">
            <div className="rd-stat rd-rv">
              <p className="rd-v" style={{ fontSize: "clamp(30px, 3.6vw, 52px)" }}>
                経歴・スキル
              </p>
              <p className="rd-n">
                あなたの経歴に応じて深掘り質問が変化。技術・ビジネス・現場・研究、それぞれ専用の質問が出ます。
              </p>
            </div>
            <div className="rd-stat rd-rv">
              <p className="rd-v" style={{ fontSize: "clamp(30px, 3.6vw, 52px)" }}>
                興味・価値観
              </p>
              <p className="rd-n">どの海洋テーマに心が動くか、どんな瞬間にウキウキするかから領域を絞り込みます。</p>
            </div>
            <div className="rd-stat rd-rv">
              <p className="rd-v" style={{ fontSize: "clamp(30px, 3.6vw, 52px)" }}>
                働き方・将来像
              </p>
              <p className="rd-n">海との距離感、目標年収、5年後の姿から、職種タイプと入口を特定します。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rd-sec" id="diagnosis-form" aria-label="海洋産業キャリア診断">
        <div className="rd-rv">
          <p className="rd-kicker">START</p>
          <h2 className="rd-title">
            3分後、<em>あなたの海</em>が決まる。
          </h2>
        </div>
        <div className="rd-tool-wrap">
          <DiagnosisForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
