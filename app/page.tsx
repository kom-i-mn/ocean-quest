import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  PlayCircle,
  Ship,
  Users,
} from "lucide-react";
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

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="pmq-hero">
        <div className="pmq-hero-overlay" />
        <div className="container pmq-hero-grid">
          <div>
            <p className="pmq-eyebrow">
              <span />
              Ocean Industry Career & Recruiting
            </p>
            <h1>
              海洋産業の仕事を、<br />
              <em>もっと届く言葉</em>にする。
            </h1>
            <p className="pmq-hero-copy">
              海運、造船、AUV、洋上風力、海洋資源。可能性は大きいのに、仕事の中身や採用の魅力がまだ伝わりきっていない。
              Ocean Questは、海洋産業の専門知をメディア化しながら、キャリアと採用の接点を作るサービスです。
            </p>
            <div className="pmq-actions">
              <a className="pmq-btn primary" href="/contact">
                採用支援を相談する
                <ArrowRight size={18} />
              </a>
              <a className="pmq-btn ghost" href="/notes">
                まず記事を読む
              </a>
            </div>
            <div className="pmq-trust">
              <div>
                <strong>Media</strong>
                <span>動画・note・eBookを集約</span>
              </div>
              <div>
                <strong>Recruiting</strong>
                <span>採用広報とスカウトを支援</span>
              </div>
              <div>
                <strong>Career</strong>
                <span>求職者の業界理解を支援</span>
              </div>
            </div>
          </div>

          <aside className="pmq-rep">
            <div className="pmq-rep-mark">OQ</div>
            <h2>なぜ、海洋産業なのか。</h2>
            <p>
              技術はある。社会的な意義もある。けれど、候補者から見ると仕事の輪郭がまだ見えにくい。
              その距離を、採用とコンテンツの両面から縮めたいと思っています。
            </p>
            <small>Ocean Quest / Potentialight</small>
          </aside>
        </div>
      </section>

      <section className="pmq-section" id="about">
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

      <section className="pmq-section pmq-alt">
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

      <section className="pmq-section">
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

      <section className="pmq-section pmq-alt" id="companies">
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

      <section className="pmq-final">
        <div className="container">
          <p className="pmq-kicker">CONTACT</p>
          <h2>海洋産業の採用について、まずは状況を聞かせてください。</h2>
          <p>
            求人票を作る前、スカウトを始める前、採用広報を出す前に、候補者へ何をどう伝えるべきかを一緒に整理します。
          </p>
          <a className="pmq-btn primary" href="/contact">
            相談する
            <Users size={18} />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
