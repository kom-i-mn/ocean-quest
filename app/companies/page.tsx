import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { fetchMicroCmsPageHero } from "@/lib/microcms";

export const metadata = pageMetadata({
  title: "企業向け採用支援 | 海洋産業特化の採用パートナー | Ocean Quest",
  description:
    "海洋産業に特化した採用支援。採用戦略設計、採用ブランディング、専門人材スカウト、母集団形成まで、業界理解を土台に採用を設計します。",
  path: "/companies",
});

const supportAreas = [
  {
    title: "採用戦略・職種要件の設計",
    body: "採用計画、ターゲット人材、職種要件、選考設計などを整理し、海洋産業に必要な人材へ届く採用の土台をつくります。",
  },
  {
    title: "魅力設計・採用ブランディング",
    body: "事業、技術、働く人、社会的意義、キャリアの可能性を言語化し、候補者に伝わる魅力として整理します。",
  },
  {
    title: "採用サイト・採用広報・コンテンツ企画",
    body: "魅力設計をもとに、採用サイト、採用記事、動画、音声、イベントなどへ展開し、継続的に候補者へ届く接点をつくります。",
  },
  {
    title: "専門人材向けスカウト支援",
    body: "エンジニア、研究開発、事業開発、現場実装、専門職など、海洋産業に関わる人材に向けたスカウト設計・運用を支援します。",
  },
  {
    title: "人材紹介・候補者接点の創出",
    body: "海洋産業に関心を持つ人材や、隣接領域の経験者との接点づくりを支援します。採用広報やスカウトだけでは出会いにくい候補者との接点を広げます。",
  },
  {
    title: "母集団形成・候補者体験の設計",
    body: "応募前から選考中、内定後まで、候補者が企業や仕事を正しく理解し、前向きに意思決定できる採用体験を設計します。",
  },
  {
    title: "面談・面接トレーニング",
    body: "現場社員や面接担当者が、候補者に事業や仕事の魅力を伝えられるよう、面談・面接の進め方や伝え方をレクチャーします。",
  },
];

const process = [
  "採用課題と事業フェーズのヒアリング",
  "職種・候補者・競合採用市場の整理",
  "スカウト文面、採用広報、コンテンツ導線の設計",
  "実行支援と週次改善",
];

const defaultHero = {
  kicker: "FOR COMPANIES — 企業向け採用支援",
  heading: "海洋産業の採用を、\n専門理解から設計する。",
  lead: "技術や事業の魅力が伝わりにくい海洋産業だからこそ、候補者に届く言葉と接点設計が重要です。採用ブランディング、スカウト、母集団形成、コンテンツ企画まで支援します。",
};

export default async function CompaniesPage() {
  const cmsHero = await fetchMicroCmsPageHero("companies");
  const hero = cmsHero ?? defaultHero;

  return (
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/port-cranes.jpg')" }} />
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
          <div className="rd-final-ctas rd-rv" style={{ justifyContent: "flex-start", marginTop: 44 }}>
            <a className="rd-btn rd-btn-primary" href="/contact">
              採用支援を相談する
            </a>
          </div>
        </div>
      </section>

      <section className="rd-sec" id="support" aria-label="支援領域">
        <div className="rd-rv">
          <p className="rd-kicker">SUPPORT</p>
          <h2 className="rd-title">
            届く前に、<em>伝わる設計</em>を。
          </h2>
          <p className="rd-lead">
            海洋産業では、候補者に届く前に「何を担う仕事なのか」「なぜ今面白いのか」が伝わりにくいケースが多くあります。Ocean
            Questでは、採用の前提となる理解・訴求・接点づくりから支援します。
          </p>
        </div>
        <div className="rd-tlist">
          {supportAreas.map(({ title, body }) => (
            <div className="rd-tlist-row rd-rv" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rd-dark-band" aria-label="Ocean Questの特徴">
        <div className="rd-dark-band-inner">
          <div className="rd-rv">
            <p className="rd-kicker">WHY OCEAN QUEST</p>
            <h2 className="rd-title">
              採用支援とメディアを、<em>分けずに設計する</em>。
            </h2>
            <p className="rd-lead" style={{ color: "rgba(255,255,255,0.62)" }}>
              採用市場にまだ十分な認知がない領域では、求人票やスカウトだけでは候補者に届きません。Ocean
              Questは、業界理解のコンテンツ、企業の魅力発信、候補者への接点づくりを同時に組み立てます。
            </p>
          </div>
          <div className="rd-stat-row">
            <div className="rd-stat rd-rv">
              <p className="rd-v" style={{ fontSize: "clamp(26px, 3vw, 44px)" }}>
                採用ブランディング設計
              </p>
              <p className="rd-n">魅力の言語化から、候補者に届く発信まで。</p>
            </div>
            <div className="rd-stat rd-rv">
              <p className="rd-v" style={{ fontSize: "clamp(26px, 3vw, 44px)" }}>
                海洋産業特化の訴求整理
              </p>
              <p className="rd-n">業界文脈を踏まえた、伝わる訴求へ。</p>
            </div>
            <div className="rd-stat rd-rv">
              <p className="rd-v" style={{ fontSize: "clamp(26px, 3vw, 44px)" }}>
                スカウト改善と母集団形成
              </p>
              <p className="rd-n">週次の改善サイクルで、出会いを増やす。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rd-sec" aria-label="相談後の進め方">
        <div className="rd-rv">
          <p className="rd-kicker">PROCESS</p>
          <h2 className="rd-title">
            相談後の、<em>進め方</em>。
          </h2>
        </div>
        <div className="rd-tlist">
          {process.map((item) => (
            <div className="rd-tlist-row rd-rv" key={item}>
              <h3>{item}</h3>
              <p />
            </div>
          ))}
        </div>
      </section>

      <section className="rd-final rd-sub-final">
        <div className="rd-final-bg" style={{ backgroundImage: "url('/images/backgrounds/container-port.jpg')" }} />
        <div className="rd-final-inner">
          <h2 className="rd-rv rd-rv-slow">
            求人票を作る前から、
            <br />
            相談できます。
          </h2>
          <p className="rd-final-sub rd-rv rd-rv-slow">
            採用計画が固まっていない段階でも大丈夫です。現状の整理から、一緒に。
          </p>
          <div className="rd-final-ctas rd-rv">
            <a className="rd-btn rd-btn-primary" href="/contact">
              採用について無料相談する
            </a>
            <a className="rd-btn rd-btn-ghost" href="/notes">
              発信コンテンツを見る
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
