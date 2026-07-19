import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { fetchMicroCmsPageHero } from "@/lib/microcms";

export const metadata = pageMetadata({
  title: "イベント | 海洋産業の人と出会う | Ocean Quest",
  description:
    "海洋産業に関心のある人と企業・専門家がつながる勉強会、ウェビナー、対談、キャリア相談会を準備中。開催情報の案内を受け取れます。",
  path: "/events",
});

const defaultHero = {
  kicker: "EVENTS — COMING SOON",
  heading: "海洋産業に関わる人と、\n出会う。",
  lead: "勉強会、ウェビナー、対談、キャリア相談会。海洋産業に関心のある人と企業・専門家がつながる場をつくります。学ぶだけで終わらず、次のキャリアや採用につながる接点を。",
};

const formats = [
  {
    title: "オンライン勉強会",
    body: "海洋産業の基礎から領域別の深掘りまで。全国どこからでも、業界理解の一歩目を。",
  },
  {
    title: "専門家対談",
    body: "研究者・エンジニア・経営者をゲストに、現場のリアルを聞くライブセッション。",
  },
  {
    title: "採用ウェビナー",
    body: "海洋産業の企業向けに、専門人材採用の戦略と事例を共有するセミナー。",
  },
  {
    title: "キャリア相談会",
    body: "海洋産業への転職を考える方向けの、少人数・無料の相談会。診断結果を持ち込むのもおすすめです。",
  },
];

export default async function EventsPage() {
  const cmsHero = await fetchMicroCmsPageHero("events");
  const hero = cmsHero ?? defaultHero;

  return (
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/port-sunset.jpg')" }} />
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

      <section className="rd-sec" aria-label="準備中のイベント形式">
        <div className="rd-rv">
          <p className="rd-kicker">FORMATS</p>
          <h2 className="rd-title">
            準備している、<em>4つの場</em>。
          </h2>
        </div>
        <div className="rd-tlist">
          {formats.map(({ title, body }) => (
            <div className="rd-tlist-row rd-rv" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <div className="rd-tbc rd-rv">
          <p className="rd-t">Coming Soon</p>
          <p className="rd-d">
            最初のイベントを準備中です。
            <br />
            開催情報のご案内を希望される方は、お問い合わせからご登録ください。
          </p>
        </div>
      </section>

      <section className="rd-final rd-sub-final">
        <div className="rd-final-bg" style={{ backgroundImage: "url('/images/backgrounds/harbor-sunset.jpg')" }} />
        <div className="rd-final-inner">
          <h2 className="rd-rv rd-rv-slow">
            最初の一歩は、
            <br />
            話を聞きに来るだけでいい。
          </h2>
          <p className="rd-final-sub rd-rv rd-rv-slow">開催が決まり次第、ご登録いただいた方から順にご案内します。</p>
          <div className="rd-final-ctas rd-rv">
            <a className="rd-btn rd-btn-primary" href="/contact">
              開催情報を受け取る
            </a>
            <a className="rd-btn rd-btn-ghost" href="/videos">
              まず動画で学ぶ
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
