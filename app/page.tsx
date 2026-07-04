import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  FileText,
  PlayCircle,
  Ship,
  Sparkles,
} from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { categories, industries } from "@/lib/content";

const contentRoutes = [
  {
    title: "動画",
    description: "専門家対談、業界構造、職種理解を動画で届ける。",
    href: "/videos",
    icon: PlayCircle,
  },
  {
    title: "eBook",
    description: "動画や記事で語った内容を、採用・キャリア資料として残す。",
    href: "/ebooks",
    icon: BookOpen,
  },
  {
    title: "note",
    description: "思想、業態別の解体新書、求職者向け、採用担当者向けに整理する。",
    href: "/notes",
    icon: FileText,
  },
  {
    title: "イベント",
    description: "海洋産業の人と企業が、学びながら出会える場を作る。",
    href: "/events",
    icon: CalendarDays,
  },
];

const companySupports = [
  "採用戦略・職種要件の整理",
  "専門人材向けスカウト支援",
  "採用広報・ブランディング",
  "母集団形成と候補者体験",
];

const quickLinks = [
  {
    title: "動画",
    description: "専門家対談や市場解説を視聴",
    href: "/videos",
    icon: PlayCircle,
  },
  {
    title: "eBook",
    description: "採用・職種・業界理解を深める",
    href: "/ebooks",
    icon: BookOpen,
  },
  {
    title: "note",
    description: "思想と解体新書を読む",
    href: "/notes",
    icon: FileText,
  },
  {
    title: "イベント",
    description: "海洋産業の人と出会う",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "診断",
    description: "自分に合う領域を知る",
    href: "/diagnosis",
    icon: ClipboardCheck,
  },
  {
    title: "企業の方へ",
    description: "採用支援を相談する",
    href: "/companies",
    icon: Building2,
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero">
        <HeroVideo />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">
            <Sparkles size={16} />
            海洋産業に特化した人材支援・採用支援
          </p>
          <h1>Ocean Quest</h1>
          <p className="lead">
            海運、造船、AUV、洋上風力、海洋資源。可能性は大きいのに、仕事の中身や採用の魅力がまだ伝わりきっていない。
            Ocean Questは、海洋産業の専門知をメディア化しながら、キャリアと採用の接点を作るサービスです。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="/contact">
              採用相談をする
              <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="/notes">
              まず記事を読む
            </a>
          </div>
        </div>
      </section>

      <section className="quick-links" aria-label="Ocean Quest sections">
        {quickLinks.map(({ title, description, href, icon: Icon }) => (
          <a className="quick-link" href={href} key={title}>
            <Icon size={22} />
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
          </a>
        ))}
      </section>

      <section className="pmq-section photo-bg photo-foam photo-light" id="about">
        <div className="container pmq-two">
          <div>
            <p className="pmq-kicker">ABOUT</p>
            <h2>求人票だけでは、海洋産業の面白さは伝わりにくい。</h2>
          </div>
          <div className="pmq-text">
            <p>
              海洋産業には、研究開発、エンジニアリング、事業開発、現場実装、政策・インフラとの接続まで、複数の文脈があります。
              だからこそ、採用では「どんな技術か」だけでなく、「誰が、何を、なぜ担うのか」を丁寧に伝える必要があります。
            </p>
            <p>
              Ocean Questは、業界理解のコンテンツと採用支援を分けずに設計します。求職者が学べる場所を作りながら、企業の採用接点を増やしていきます。
            </p>
          </div>
        </div>
      </section>

      <section className="pmq-section pmq-alt photo-bg photo-harbor photo-dark">
        <div className="container">
          <div className="pmq-head">
            <p className="pmq-kicker">CONTENTS</p>
            <h2>コンテンツは、採用のための土台になる。</h2>
            <p>
              PMQuestのように、動画・eBook・note・イベントをひとつの入口にまとめます。自動連携は後から入れ、まずは情報設計を崩さないことを優先します。
            </p>
          </div>
          <div className="pmq-content-list">
            {contentRoutes.map(({ title, description, href, icon: Icon }) => (
              <a href={href} className="pmq-content-item" key={title}>
                <Icon size={21} />
                <div>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
                <ArrowRight size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pmq-section photo-bg photo-blue photo-light">
        <div className="container pmq-two">
          <div>
            <p className="pmq-kicker">CATEGORY</p>
            <h2>思想と業態別の解体新書を、分けて蓄積する。</h2>
          </div>
          <div>
            <div className="pmq-tag-block">
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
            <div className="pmq-industry-block">
              {industries.map((industry) => (
                <a href="/notes" key={industry}>
                  <Ship size={16} />
                  {industry}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pmq-section pmq-alt photo-bg photo-container photo-dark" id="companies">
        <div className="container pmq-two">
          <div>
            <p className="pmq-kicker">FOR COMPANIES</p>
            <h2>海洋産業の採用を、専門理解から設計する。</h2>
            <p className="pmq-lead">
              採用計画が固まっていない段階でも大丈夫です。職種、候補者像、採用広報、スカウトのどこから着手すべきかを整理します。
            </p>
            <a className="pmq-btn primary" href="/companies">
              企業向けページを見る
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="pmq-support-list">
            {companySupports.map((support) => (
              <div key={support}>
                <Building2 size={18} />
                <span>{support}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pmq-final photo-bg photo-shore">
        <div className="container">
          <p className="pmq-kicker">CONTACT</p>
          <h2>海洋産業の採用について、まずは状況を聞かせてください。</h2>
          <p>
            求人票を作る前、スカウトを始める前、採用広報を出す前に、候補者へ何をどう伝えるべきかを一緒に整理します。
          </p>
          <a className="pmq-btn primary" href="/contact">
            相談する
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
