import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { OceanMap } from "@/components/OceanMap";
import { ProfileCta } from "@/components/ProfileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "海の地図(β) | Ocean Quest",
  description:
    "海上保安庁「海しる」の公開データで、黒潮などの海流、全国の水族館・海の展示施設・体験学習施設、港湾、灯台、海底ケーブルを地図から探索できます。海洋産業を知る入口としてご活用ください。",
  alternates: { canonical: "/map" },
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

export default function MapPage() {
  return (
    <main className="subpage-shell subpage-bg-bubbles">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">Ocean Map (β)</p>
        <h1>海の地図から、海洋産業の入口を探す。</h1>
        <p>
          海上保安庁の海洋情報サービス「海しる」の公開データと連携し、海流・水族館・港湾・灯台・海底ケーブルなどを地図上で探索できます。気になる場所を見つけたら、そのまま診断や動画で海洋産業の仕事を知ることができます。
        </p>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="#ocean-map">
            地図を見る
            <ArrowRight size={18} />
          </a>
          <a className="secondary-button light" href="/diagnosis">
            キャリア診断をする
          </a>
        </div>
      </section>

      <section className="section" id="ocean-map" aria-label="海の地図">
        <OceanMap />
        <p className="map-attribution">
          本ページでは海上保安庁「
          <a href="https://www.msil.go.jp/" target="_blank" rel="noopener noreferrer">
            海しる（海洋状況表示システム）
          </a>
          」公開APIを利用しています。掲載データは海上保安庁が提供する情報に基づき表示しています。
        </p>
      </section>

      <section className="section" aria-label="この地図でできること">
        <div className="ocean-map-highlights">
          {highlights.map((item) => (
            <div className="ocean-map-highlight" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ProfileCta primaryLabel="無料でキャリア相談する" />
      <SiteFooter />
    </main>
  );
}
