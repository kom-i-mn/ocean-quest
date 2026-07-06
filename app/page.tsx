import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  FileText,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const contentRoutes = [
  {
    title: "動画",
    description: "専門家や実務者へのインタビュー、業界構造の解説、職種紹介などを通じて、海洋産業のリアルを届けています。",
    href: "/videos",
    icon: PlayCircle,
  },
  {
    title: "eBook",
    description: "業界理解、職種理解、採用広報、候補者向け説明資料など、企業と求職者の双方に役立つ情報を資料としてまとめています。",
    href: "/ebooks",
    icon: BookOpen,
  },
  {
    title: "note",
    description: "海洋産業の魅力、業態別の解説、採用の考え方、キャリアの可能性などを、ブログとしてわかりやすく発信しています。",
    href: "/notes",
    icon: FileText,
  },
  {
    title: "イベント",
    description: "海洋産業に関心のある人と、企業・専門家が出会える場を準備中です。学びながらつながれる企画を予定しています。",
    href: "/events",
    icon: CalendarDays,
  },
];

const oceanIndustryTypes = [
  {
    number: "01",
    title: "海洋空間活動型",
    description:
      "海・海底・沿岸・港湾など、海洋空間そのものを使って事業を行う領域です。海運、漁業、洋上風力、海底資源、港湾運送、海上土木、海底ケーブル、海洋調査などが含まれます。",
  },
  {
    number: "02",
    title: "素材・サービス等供給型",
    description:
      "海の現場で使われるモノやサービスを供給する領域です。造船、船舶修理、船用機器、作業船、港湾設備、海洋機器、洋上風力部材、AUV・ROV・水中ロボットなどが含まれます。",
  },
  {
    number: "03",
    title: "海洋資源活用型",
    description:
      "海から得られた資源を加工・流通・販売する領域です。水産加工、魚介卸売、製塩、水産食品、海藻・藻類活用、海洋バイオなどが含まれます。",
  },
];

const companySupports = [
  {
    number: "01",
    title: "採用戦略・職種要件の設計",
    description:
      "採用計画、ターゲット人材、職種要件、選考設計などを整理し、海洋産業に必要な人材へ届く採用の土台をつくります。",
  },
  {
    number: "02",
    title: "魅力設計・採用ブランディング",
    description:
      "事業、技術、働く人、社会的意義、キャリアの可能性を言語化し、候補者に伝わる魅力として整理します。",
  },
  {
    number: "03",
    title: "採用サイト・採用広報・コンテンツ企画",
    description:
      "魅力設計をもとに、採用サイト、採用記事、動画、音声、イベントなどへ展開し、継続的に候補者へ届く接点をつくります。",
  },
  {
    number: "04",
    title: "専門人材向けスカウト支援",
    description:
      "エンジニア、研究開発、事業開発、現場実装、専門職など、海洋産業に関わる人材に向けたスカウト設計・運用を支援します。",
  },
  {
    number: "05",
    title: "人材紹介・候補者接点の創出",
    description:
      "海洋産業に関心を持つ人材や、隣接領域の経験者との接点づくりを支援します。採用広報やスカウトだけでは出会いにくい候補者との接点を広げます。",
  },
  {
    number: "06",
    title: "母集団形成・候補者体験の設計",
    description:
      "応募前から選考中、内定後まで、候補者が企業や仕事を正しく理解し、前向きに意思決定できる採用体験を設計します。",
  },
  {
    number: "07",
    title: "面談・面接トレーニング",
    description:
      "現場社員や面接担当者が、候補者に事業や仕事の魅力を伝えられるよう、面談・面接の進め方や伝え方をレクチャーします。",
  },
];

const quickLinks = [
  {
    title: "動画",
    description: "海洋産業を、動画で解説",
    href: "/videos",
    icon: PlayCircle,
  },
  {
    title: "eBook",
    description: "採用・職種・業界理解に役立つ資料を読む",
    href: "/ebooks",
    icon: BookOpen,
  },
  {
    title: "note",
    description: "海洋産業の魅力や採用の考え方を深く知る",
    href: "/notes",
    icon: FileText,
  },
  {
    title: "イベント",
    description: "海洋産業に関わる人と出会いたい",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "診断",
    description: "自分に合う海洋領域を見つける",
    href: "/diagnosis",
    icon: ClipboardCheck,
  },
  {
    title: "企業の方へ",
    description: "採用や情報発信について相談する",
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
            海洋産業に、次の仲間が集まる入口を。
          </p>
          <h1>Ocean Quest</h1>
          <p className="lead">
            海運、造船、AUV、洋上風力、海洋資源。海には、社会を支える仕事と、日本の産業・未来をつくる挑戦が広がっています。
            でも、その面白さや可能性、そして重要性は、まだ十分に届いていません。Ocean
            Questは、海洋産業の仕事・人・技術・未来をわかりやすく伝え、企業と人材の新しい出会いをつくるサービスです。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="/contact">
              採用について相談する
              <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="/notes">
              海洋産業について知る
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
            <h2>海洋産業の面白さは、求人票だけでは伝わらない。</h2>
          </div>
          <div className="pmq-text">
            <p>
              海洋産業には、研究開発、エンジニアリング、現場実装、事業開発、政策、インフラ、地域との接続まで、さまざまな仕事があります。けれど、求人票の職種名や必須要件だけでは、その仕事が社会のどこにつながっているのか、どんな人が活躍できるのかまでは伝わりにくいのが現状です。
            </p>
            <p>
              Ocean
              Questは、海洋産業の専門性をわかりやすく言語化し、コンテンツとして届けながら、採用の接点をつくっていきます。求職者にとっては業界を知る入口に。企業にとっては、自社の魅力や仕事の価値を伝える場所に。海洋産業に関わる人と企業が、より自然に出会える状態を目指しています。
            </p>
            <p>
              Ocean
              Questは、海洋産業に特化した人材・採用支援サービスです。海洋産業に特化して、採用支援、キャリア支援、業界理解の発信までを一体で行うサービスは、日本ではまだ存在していません。だからこそ私は、海洋産業について日本で最も深く理解する採用コンサルタント・キャリアカウンセラーでありたいと考えています。海洋産業の未来を一緒に探求する。企業の採用課題と、個人のキャリアの可能性、その両方に向き合いながら、海洋産業に関わる人を増やしていきます。
            </p>
          </div>
        </div>
      </section>

      <section className="pmq-section pmq-alt photo-bg photo-harbor photo-dark">
        <div className="container">
          <div className="pmq-head">
            <p className="pmq-kicker">CONTENTS</p>
            <h2>知ることから、採用は始まる。</h2>
            <p>
              Ocean
              Questでは、動画・記事・資料・イベントなどを通じて、海洋産業の仕事や人、技術、キャリアの可能性を届けていきます。まずは業界を知り、興味を持ち、企業や仕事への理解が深まる入口をつくります。
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
        <div className="container">
          <div className="pmq-head">
            <p className="pmq-kicker">CATEGORY</p>
            <h2>海洋産業を、わかりやすく。</h2>
            <p>
              海洋産業と聞くと、海運や造船、漁業を思い浮かべる方が多いかもしれません。けれど実際には、海洋の開発・利用・保全に関わる産業全体を指しており、その領域はとても広く、多様です。
            </p>
          </div>
          <div className="pmq-numbered-grid">
            {oceanIndustryTypes.map(({ number, title, description }) => (
              <div className="pmq-numbered-card" key={number}>
                <span className="pmq-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
          <div className="pmq-category-footer">
            <p className="pmq-note">興味のある領域から、海洋産業の仕事・技術・企業・キャリアを知ることができます。</p>
            <p className="pmq-source">
              出典：内閣府「海洋産業の活動状況に関する調査」／平成20年度 海洋産業の活動状況に関する調査 概要PDF／第4期海洋基本計画 本文PDF
            </p>
            <a className="pmq-btn primary" href="/contact">
              キャリアについて相談する
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="pmq-section pmq-alt photo-bg photo-container photo-dark" id="companies">
        <div className="container pmq-two">
          <div>
            <p className="pmq-kicker">FOR COMPANIES</p>
            <h2>海洋産業の採用を、伝えるところから設計する。</h2>
            <p className="pmq-lead">
              専門性の高い職種ほど、求人票だけで魅力を届けるのは簡単ではありません。Ocean
              Questでは、職種要件の整理、候補者像の設計、採用広報、スカウト、コンテンツ発信まで、海洋産業ならではの文脈をふまえて採用を支援します。採用計画が固まりきっていない段階でも、まずは現状の整理からご相談いただけます。
            </p>
            <a className="pmq-btn primary" href="/companies">
              採用に関する相談をする
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="pmq-support-list">
            {companySupports.map(({ number, title, description }) => (
              <div key={number}>
                <Building2 size={18} />
                <div>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pmq-final photo-bg photo-shore">
        <div className="container">
          <p className="pmq-kicker">CONTACT</p>
          <h2>海洋産業の採用について、まずは話すところから。</h2>
          <p>
            求人票を作る前でも、採用広報を始める前でも、スカウトに悩んでいる段階でも大丈夫です。どんな人に、何を、どう伝えるべきか。貴社の事業や採用状況を伺いながら、一緒に整理します。
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
