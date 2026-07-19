import type { Metadata } from "next";
import { OceanMap } from "@/components/OceanMap";
import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { fetchMicroCmsPageHero } from "@/lib/microcms";

export const metadata: Metadata = pageMetadata({
  title: "海の地図(β) | Ocean Quest",
  description:
    "海上保安庁「海しる」の公開データで、黒潮などの海流、全国の水族館・海の展示施設・体験学習施設、港湾、灯台、海底ケーブルを地図から探索できます。海洋産業を知る入口としてご活用ください。",
  path: "/map",
});

const defaultHero = {
  kicker: "OCEAN MAP（β）",
  heading: "海の地図から、\n海洋産業の入口を探す。",
  lead: "海上保安庁の海洋情報サービス「海しる」の公開データと連携。海流・水族館・港湾・灯台・海底ケーブルを地図上で探索できます。気になる場所を見つけたら、そのまま診断や動画へ。",
};

const highlights = [
  {
    title: "いまの海流を見る",
    body: "海上保安庁の海洋速報から、黒潮・親潮など海流の流軸の最新解析を表示。日本の海運や漁業、気候に影響する「海の大動脈」です。",
  },
  {
    title: "海を学べる場所を探す",
    body: "全国の水族館・海の展示施設・体験学習施設をマップから探せます。週末の見学から、海洋産業への興味は始まります。",
  },
  {
    title: "産業の現場を知る",
    body: "全国1,200以上の港湾、3,000を超える灯台、海底ケーブル。海洋産業の仕事が動いている「現場」の位置を体感できます。",
  },
];

export default async function MapPage() {
  const cmsHero = await fetchMicroCmsPageHero("map");
  const hero = cmsHero ?? defaultHero;

  return (
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/ocean-foam.jpg')" }} />
        <div className="rd-sub-hero-inner">
          <p className="rd-kicker-w rd-rv">{hero.kicker}</p>
          <h1 className="rd-rv rd-rv-slow">
            {hero.heading.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p className="rd-lead-w rd-rv rd-rv-slow">{hero.lead}</p>
        </div>
      </section>

      <section className="rd-sec" aria-label="日本の海の現場の数">
        <div className="rd-rv">
          <p className="rd-kicker">NUMBERS</p>
          <h2 className="rd-title">
            日本の海の「現場」は、<em>この数だけ</em>ある。
          </h2>
        </div>
        <div className="rd-stat-row">
          <div className="rd-stat rd-rv">
            <p className="rd-v">
              1,200<small>超</small>
            </p>
            <p className="rd-l">全国の港湾</p>
            <p className="rd-n">海洋産業の仕事が毎日動いている現場。あなたの街の港も、そのひとつです。</p>
          </div>
          <div className="rd-stat rd-rv">
            <p className="rd-v">
              3,000<small>超</small>
            </p>
            <p className="rd-l">全国の灯台</p>
            <p className="rd-n">海の安全を支えるインフラ。位置を地図で体感できます。</p>
          </div>
          <div className="rd-stat rd-rv">
            <p className="rd-v">
              99<small>%</small>
            </p>
            <p className="rd-l">海底ケーブルが運ぶ国際通信</p>
            <p className="rd-n">ネットも金融も、海の底が支えています。敷設ルートを地図で見られます。</p>
          </div>
        </div>
      </section>

      <section className="rd-sec rd-sec-tight" id="ocean-map" aria-label="海の地図">
        <div className="rd-tool-wrap rd-rv" style={{ marginTop: 0 }}>
          <OceanMap />
        </div>
        <p className="rd-src">
          本ページでは海上保安庁「
          <a href="https://www.msil.go.jp/" target="_blank" rel="noopener noreferrer">
            海しる（海洋状況表示システム）
          </a>
          」公開APIを利用しています。掲載データは海上保安庁が提供する情報に基づき表示しています。
        </p>
      </section>

      <section className="rd-sec rd-sec-tight" aria-label="この地図でできること">
        <div className="rd-rv">
          <p className="rd-kicker">HOW TO USE</p>
          <h2 className="rd-title">
            この地図で、<em>できること</em>。
          </h2>
        </div>
        <div className="rd-tlist">
          {highlights.map(({ title, body }) => (
            <div className="rd-tlist-row rd-rv" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rd-final rd-sub-final">
        <div className="rd-final-bg" style={{ backgroundImage: "url('/images/backgrounds/shoreline.jpg')" }} />
        <div className="rd-final-inner">
          <h2 className="rd-rv rd-rv-slow">
            地図で見つけた興味を、
            <br />
            キャリアにつなげる。
          </h2>
          <p className="rd-final-sub rd-rv rd-rv-slow">気になる場所が見つかったら、診断でその領域との相性を確かめられます。</p>
          <div className="rd-final-ctas rd-rv">
            <a className="rd-btn rd-btn-primary" href="/diagnosis">
              キャリア診断をする
            </a>
            <a className="rd-btn rd-btn-ghost" href="/contact">
              無料でキャリア相談する
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
