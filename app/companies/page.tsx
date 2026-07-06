import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChartNoAxesCombined,
  FileText,
  Radar,
  SearchCheck,
  UsersRound,
} from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const supportAreas = [
  {
    title: "採用戦略・職種要件の設計",
    description:
      "採用計画、ターゲット人材、職種要件、選考設計などを整理し、海洋産業に必要な人材へ届く採用の土台をつくります。",
    icon: Radar,
  },
  {
    title: "魅力設計・採用ブランディング",
    description:
      "事業、技術、働く人、社会的意義、キャリアの可能性を言語化し、候補者に伝わる魅力として整理します。",
    icon: BadgeCheck,
  },
  {
    title: "採用サイト・採用広報・コンテンツ企画",
    description:
      "魅力設計をもとに、採用サイト、採用記事、動画、音声、イベントなどへ展開し、継続的に候補者へ届く接点をつくります。",
    icon: FileText,
  },
  {
    title: "専門人材向けスカウト支援",
    description:
      "エンジニア、研究開発、事業開発、現場実装、専門職など、海洋産業に関わる人材に向けたスカウト設計・運用を支援します。",
    icon: SearchCheck,
  },
  {
    title: "人材紹介・候補者接点の創出",
    description:
      "海洋産業に関心を持つ人材や、隣接領域の経験者との接点づくりを支援します。採用広報やスカウトだけでは出会いにくい候補者との接点を広げます。",
    icon: UsersRound,
  },
  {
    title: "母集団形成・候補者体験の設計",
    description:
      "応募前から選考中、内定後まで、候補者が企業や仕事を正しく理解し、前向きに意思決定できる採用体験を設計します。",
    icon: ChartNoAxesCombined,
  },
  {
    title: "面談・面接トレーニング",
    description:
      "現場社員や面接担当者が、候補者に事業や仕事の魅力を伝えられるよう、面談・面接の進め方や伝え方をレクチャーします。",
    icon: Building2,
  },
];

const process = [
  "採用課題と事業フェーズのヒアリング",
  "職種・候補者・競合採用市場の整理",
  "スカウト文面、採用広報、コンテンツ導線の設計",
  "実行支援と週次改善",
];

export default function CompaniesPage() {
  return (
    <main className="subpage-shell subpage-bg-port-cranes">
      <SiteHeader solid />
      <section className="subpage-hero companies-hero">
        <p className="section-kicker">For Companies</p>
        <h1>海洋産業の採用を、専門理解から設計する。</h1>
        <p>
          Ocean Questは、海洋産業に関わる企業の採用ブランディング、スカウト、母集団形成、候補者理解を支援します。
          技術や事業の複雑さを候補者に伝わる言葉へ変換し、採用活動の前進を支えます。
        </p>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="/contact">
            採用支援を相談する
            <ArrowRight size={18} />
          </a>
          <a className="secondary-button light" href="/ebooks">
            採用資料を見る
          </a>
        </div>
      </section>

      <section className="section support-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Support</p>
            <h2>支援領域</h2>
          </div>
          <p>
            海洋産業では、候補者に届く前に「何を担う仕事なのか」「なぜ今面白いのか」が伝わりにくいケースが多くあります。
            Ocean Questでは、採用の前提となる理解・訴求・接点づくりから支援します。
          </p>
        </div>
        <div className="card-grid">
          {supportAreas.map(({ title, description, icon: Icon }) => (
            <article className="content-card support-card" key={title}>
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section companies-band">
        <div>
          <p className="section-kicker">Why Ocean Quest</p>
          <h2>採用支援とメディアを分けずに設計する。</h2>
          <p>
            採用市場にまだ十分な認知がない領域では、求人票やスカウトだけでは候補者に届きません。
            Ocean Questは、業界理解のコンテンツ、企業の魅力発信、候補者への接点づくりを同時に組み立てます。
          </p>
        </div>
        <div className="proof-list">
          <span>
            <BadgeCheck size={18} />
            採用ブランディング設計
          </span>
          <span>
            <Building2 size={18} />
            海洋産業特化の訴求整理
          </span>
          <span>
            <ChartNoAxesCombined size={18} />
            スカウト改善と母集団形成
          </span>
        </div>
      </section>

      <section className="section process-section">
        <p className="section-kicker">Process</p>
        <h2>相談後の進め方</h2>
        <div className="process-list">
          {process.map((item, index) => (
            <div className="process-item" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="company-cta">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>海洋産業の採用について、まずは状況を聞かせてください。</h2>
          <p>
            採用計画が固まっていない段階でも大丈夫です。職種、候補者像、採用広報、スカウトのどこから着手すべきか一緒に整理します。
          </p>
        </div>
        <a className="primary-button" href="/contact">
          問い合わせる
          <ArrowRight size={18} />
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
