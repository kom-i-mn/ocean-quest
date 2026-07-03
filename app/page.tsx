import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Compass,
  FileText,
  PlayCircle,
  Ship,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  categories,
  diagnosisQuestions,
  featuredContents,
  industries,
} from "@/lib/content";

const typeLabels = {
  video: "動画",
  ebook: "eBook",
  note: "note",
  event: "イベント",
};

const typeIcons = {
  video: PlayCircle,
  ebook: BookOpen,
  note: FileText,
  event: CalendarDays,
};

const quickLinks: {
  title: string;
  description: string;
  Icon: LucideIcon;
  href: string;
}[] = [
  {
    title: "動画",
    description: "専門家対談や市場解説を視聴",
    Icon: PlayCircle,
    href: "/videos",
  },
  {
    title: "eBook",
    description: "採用・職種・業界理解を深める",
    Icon: BookOpen,
    href: "/ebooks",
  },
  {
    title: "note",
    description: "思想と解体新書を読む",
    Icon: FileText,
    href: "/notes",
  },
  {
    title: "イベント",
    description: "海洋産業の人と出会う",
    Icon: CalendarDays,
    href: "/events",
  },
  {
    title: "診断",
    description: "自分に合う領域を知る",
    Icon: ClipboardCheck,
    href: "/diagnosis",
  },
  {
    title: "企業の方へ",
    description: "採用支援を相談する",
    Icon: Building2,
    href: "/companies",
  },
];

export default function Home() {
  const videos = featuredContents.filter((item) => item.type === "video");
  const ebooks = featuredContents.filter((item) => item.type === "ebook");
  const notes = featuredContents.filter((item) => item.type === "note");
  const events = featuredContents.filter((item) => item.type === "event");

  return (
    <main>
      <SiteHeader />

      <section className="hero">
        <Image
          src="/images/ocean-quest-hero.png"
          alt="Ocean Questが扱う海洋産業と海洋技術のイメージ"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">
            <Sparkles size={16} />
            海洋産業に特化した人材支援・採用支援
          </p>
          <h1>Ocean Quest</h1>
          <p className="lead">
            海運、造船、AUV、洋上風力、海洋資源。複雑で可能性の大きい海洋産業のキャリアと採用を、
            メディアと支援サービスの両面から前に進めます。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#companies">
              採用相談をする
              <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="/diagnosis">
              キャリア診断へ
            </a>
          </div>
        </div>
      </section>

      <section className="quick-links" aria-label="Ocean Quest sections">
        {quickLinks.map(({ title, description, Icon, href }) => (
          <a className="quick-link" href={href} key={title}>
            <Icon size={22} />
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
          </a>
        ))}
      </section>

      <section className="section intro-section">
        <div>
          <p className="section-kicker">Media x Recruiting</p>
          <h2>海洋産業を学び、出会い、採用につなげる総合メディア。</h2>
        </div>
        <p>
          Ocean Questは、海洋産業の専門知をコンテンツ化しながら、求職者・採用担当者・事業会社をつなぐサービスサイトです。
          YouTube、note、eBook、イベント、診断をひとつの情報基盤に集約し、認知から相談までの流れを作ります。
        </p>
      </section>

      <section className="section split-section">
        <div>
          <p className="section-kicker">Category</p>
          <h2>コンテンツカテゴリ</h2>
          <div className="pill-grid">
            {categories.map((category) => (
              <span className="pill" key={category}>
                {category}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="section-kicker">Industry</p>
          <h2>業態別の解体新書</h2>
          <div className="industry-grid">
            {industries.map((industry) => (
              <a href="#" key={industry}>
                <Ship size={18} />
                {industry}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ContentSection
        id="videos"
        title="動画"
        description="YouTubeチャンネルの動画を自動取得し、テーマ別に整理して表示する想定です。"
        items={videos}
      />
      <ContentSection
        id="ebooks"
        title="eBook"
        description="動画やnoteの内容をもとに、採用担当者・求職者向けの資料として蓄積します。"
        items={ebooks}
      />
      <ContentSection
        id="notes"
        title="note"
        description="noteで公開した記事を取り込み、思想・解体新書・求職者向けなどに分類します。"
        items={notes}
      />
      <ContentSection
        id="events"
        title="イベント"
        description="勉強会、対談、採用イベント、企業向けウェビナーの導線をまとめます。"
        items={events}
      />

      <section className="section diagnosis-section" id="diagnosis">
        <div className="diagnosis-copy">
          <p className="section-kicker">Diagnosis</p>
          <h2>海洋産業キャリア診断</h2>
          <p>
            求職者には合いそうな領域や職種を、企業には採用課題の現在地を返す診断コンテンツとして育てます。
          </p>
          <a className="primary-button" href="#">
            診断をはじめる
            <ArrowRight size={18} />
          </a>
        </div>
        <div className="question-list">
          {diagnosisQuestions.map((item, index) => (
            <div className="question" key={item.question}>
              <span>Q{index + 1}</span>
              <strong>{item.question}</strong>
              <div>
                {item.options.map((option) => (
                  <small key={option}>{option}</small>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section audience-section">
        <AudienceCard
          icon={<Users size={24} />}
          title="求職者向け"
          description="海洋産業に興味はあるが、どんな会社・職種・キャリアがあるか分からない人に向けた入口。"
          cta="キャリア相談へ"
        />
        <AudienceCard
          icon={<Compass size={24} />}
          title="採用担当者向け"
          description="専門職採用、事業開発人材、研究開発人材など、海洋産業特有の採用論点を整理。"
          cta="採用ノウハウを見る"
        />
        <AudienceCard
          icon={<Building2 size={24} />}
          title="企業の方へ"
          description="採用ブランディング、スカウト、母集団形成、候補者理解まで一気通貫で支援。"
          cta="採用支援を相談"
        />
      </section>

      <section className="company-cta" id="companies">
        <div>
          <p className="section-kicker">For Companies</p>
          <h2>海洋産業の採用を、専門メディアと人材支援の両輪で。</h2>
          <p>
            Ocean Questは、ポテンシャライトが持つ採用ブランディング・スカウト・採用支援の知見を、
            海洋産業に特化して展開するためのサービスサイトです。
          </p>
        </div>
        <a className="primary-button" href="mailto:hello@example.com">
          相談する
          <ArrowRight size={18} />
        </a>
      </section>

      <section className="section integration-section">
        <p className="section-kicker">Integration Blueprint</p>
        <h2>自動連携の設計</h2>
        <div className="flow-grid">
          {[
            ["YouTube", "APIで動画一覧を取得し、動画ページとeBook化の起点にする"],
            ["note", "RSSで新着記事を取得し、カテゴリを付与して一覧に反映する"],
            ["Google Sheets", "コンテンツ台帳としてURL、カテゴリ、公開状態を管理する"],
            ["Search", "sitemap.xmlとメタデータを整え、Search Consoleへ登録する"],
          ].map(([title, description]) => (
            <div className="flow-card" key={title}>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function ContentSection({
  id,
  title,
  description,
  items,
}: {
  id: string;
  title: string;
  description: string;
  items: typeof featuredContents;
}) {
  return (
    <section className="section content-section" id={id}>
      <div className="section-heading">
        <div>
          <p className="section-kicker">{title}</p>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      <div className="card-grid">
        {items.map((item) => {
          const Icon = typeIcons[item.type];

          return (
            <article className="content-card" key={item.id}>
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <span className="content-type">{typeLabels[item.type]}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="card-meta">
                <span>{item.category}</span>
                <time dateTime={item.publishedAt}>{item.publishedAt}</time>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AudienceCard({
  icon,
  title,
  description,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <article className="audience-card">
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href="#">
        {cta}
        <ArrowRight size={16} />
      </a>
    </article>
  );
}
