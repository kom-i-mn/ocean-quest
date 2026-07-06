import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Compass,
  FileText,
  PlayCircle,
  Sparkles,
  UserSearch,
  Users,
} from "lucide-react";
import Image from "next/image";
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

const audiences = [
  {
    icon: UserSearch,
    title: "海洋業界へ転職したい方",
    description:
      "海運、造船、AUV、洋上風力など、海洋業界への転職・キャリアチェンジを考えている方へ。異業種の経験を海洋産業でどう活かせるか、キャリア相談で一緒に整理します。",
    href: "/diagnosis",
    cta: "キャリア相談をする",
  },
  {
    icon: Compass,
    title: "海洋産業について知りたい方",
    description:
      "海洋業界とはどんな産業で、どんな仕事があるのか。動画やnoteの記事で、海洋産業の仕事・技術・キャリアの可能性をわかりやすく発信しています。",
    href: "/notes",
    cta: "海洋産業について知る",
  },
  {
    icon: Users,
    title: "海洋人材を採用したい企業",
    description:
      "海洋産業に強い専門人材の採用支援、採用広報、スカウト支援まで対応します。採用計画が固まっていない段階からご相談いただけます。",
    href: "/companies",
    cta: "採用について相談する",
  },
];

const oceanQuestStrengths = [
  {
    number: "01",
    title: "海洋産業に特化した専門サービス",
    description:
      "海運、造船、AUV、洋上風力、海洋資源など、海洋産業に特化して知見を蓄積しているからこそ、業界特有の文脈まで踏み込んだ採用支援・キャリア支援ができます。",
  },
  {
    number: "02",
    title: "採用だけでなく業界理解まで支援",
    description:
      "求人紹介だけでなく、海洋産業そのものの面白さや仕組みを伝えるコンテンツを通じて、候補者の理解と納得感を深めます。",
  },
  {
    number: "03",
    title: "YouTube・note・イベントを通じて候補者との接点を創出",
    description:
      "動画、note記事、イベントなど複数のチャネルを通じて、転職を考えていない層にも海洋産業の魅力を届け、将来の候補者との接点をつくります。",
  },
  {
    number: "04",
    title: "企業と求職者の双方へ価値提供",
    description:
      "採用したい企業と、海洋業界で挑戦したい人材、その両方に向き合いながら、海洋産業全体の人材循環を支援します。",
  },
];

const relatedKeywords = [
  "海洋産業とは",
  "海洋業界とは",
  "海洋企業一覧",
  "海洋転職",
  "海洋求人",
  "海洋エンジニアとは",
  "洋上風力とは",
];

const faqItems = [
  {
    question: "海洋産業とは？",
    answer:
      "海運、造船、漁業、洋上風力、海洋資源開発など、海の利用・開発・保全に関わる産業全体を指します。近年は洋上風力やAUV・ROVなどの新しい技術領域も拡大しています。",
  },
  {
    question: "未経験でも海洋業界へ転職できますか？",
    answer:
      "はい、可能です。海洋産業には専門知識が必要な仕事だけでなく、事業開発、営業、マーケティング、採用など幅広い職種があり、他業界での経験を活かして海洋業界へ転職する方が増えています。",
  },
  {
    question: "どのような企業を紹介していますか？",
    answer:
      "海運、造船、AUV・ROV、洋上風力、海洋土木、水産など、海洋産業に関わるさまざまな企業の求人・採用情報を扱っています。大手企業からスタートアップまで幅広くご紹介可能です。",
  },
  {
    question: "採用相談・キャリア相談は無料ですか？",
    answer:
      "はい、無料です。転職を検討していない段階での情報収集や、企業の採用に関するご相談もお気軽にご利用いただけます。",
  },
  {
    question: "地方企業でも相談できますか？",
    answer:
      "はい、対応しています。海洋産業は港湾や造船所など地方に拠点を持つ企業も多く、地域を問わずキャリア相談・採用相談を承っています。",
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
  },
  {
    number: "02",
    title: "採用サイト・採用広報・コンテンツ企画",
  },
  {
    number: "03",
    title: "専門人材向けスカウト支援",
  },
  {
    number: "04",
    title: "母集団形成・候補者体験の設計",
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
            海洋産業専門の採用・転職・キャリア支援サービス
          </p>
          <h1>Ocean Quest</h1>
          <p className="hero-subtitle">
            海洋業界への転職・キャリア相談から、海洋人材の採用支援まで。
          </p>
          <p className="lead">
            海運、造船、AUV、洋上風力、海洋資源。海洋業界には社会を支える仕事と、日本の未来をつくる挑戦が広がっていますが、海洋転職や海洋求人の情報はまだ十分に届いていません。
            Ocean
            Questは、海洋産業に特化したキャリア支援と採用支援を通じて、海洋業界を目指す人と、海洋人材を採用したい企業をつなぐサービスです。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="/contact">
              採用について相談する
              <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="/notes">
              海洋業界について知る
            </a>
          </div>
        </div>
      </section>

      <section className="section audience-intro" aria-label="Ocean Questを使う3つの立場">
        <div className="section-heading">
          <p className="section-kicker">FOR YOU</p>
          <h2>Ocean Questは、こんな方のためのサービスです。</h2>
        </div>
        <div className="audience-section">
          {audiences.map(({ icon: Icon, title, description, href, cta }) => (
            <article className="content-card audience-card" key={title}>
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <a href={href}>
                {cta}
                <ArrowRight size={16} />
              </a>
            </article>
          ))}
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
              Questは、海洋産業の専門性をわかりやすく言語化し、コンテンツとして届けながら、採用支援の接点をつくっていきます。海洋転職を考える求職者にとっては海洋業界を知る入口に。企業にとっては、自社の魅力や仕事の価値を伝える場所に。海洋産業に関わる人と企業が、より自然に出会える状態を目指しています。
            </p>
          </div>
        </div>
        <div className="container founder-profile">
          <div className="founder-photo">
            <Image
              src="/images/minenaho-profile.jpg"
              alt="Ocean Questを運営するミネナホのプロフィール写真"
              width={400}
              height={400}
              sizes="(max-width: 768px) 220px, 320px"
            />
          </div>
          <div className="founder-copy">
            <p className="pmq-kicker">FOUNDER</p>
            <h3>海洋産業に特化した、人材・採用支援の入口をつくる。</h3>
            <p>
              Ocean
              Questは、海洋産業に特化した人材・採用支援サービスです。海洋業界に特化して、採用支援、キャリア支援、業界理解の発信までを一体で行うサービスは、日本ではまだ存在していません。
            </p>
            <p>
              だからこそ私は、海洋産業について日本で最も深く理解する採用コンサルタント・キャリアカウンセラーでありたいと考えています。海洋産業の未来を一緒に探求する。企業の採用課題と、個人のキャリアの可能性、その両方に向き合いながら、海洋業界に関わる人を増やしていきます。
            </p>
          </div>
        </div>
      </section>

      <section className="pmq-section photo-bg photo-blue photo-light">
        <div className="container">
          <div className="pmq-head">
            <p className="pmq-kicker">WHY OCEAN QUEST</p>
            <h2>Ocean Questだからできること。</h2>
          </div>
          <div className="pmq-numbered-grid pmq-numbered-grid--four">
            {oceanQuestStrengths.map(({ number, title, description }) => (
              <div className="pmq-numbered-card" key={number}>
                <span className="pmq-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
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
          <figure className="ocean-industry-map">
            <Image
              src="/images/ocean-industry-map.png"
              alt="海洋産業を海洋空間活動型、素材・サービス等供給型、海洋資源活用型の3分類で整理した図"
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, 1120px"
              priority={false}
            />
          </figure>
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

      <section className="pmq-section pmq-keywords-section">
        <div className="container">
          <p className="pmq-note">よく検索されるキーワードから探す</p>
          <div className="pmq-tag-block">
            {relatedKeywords.map((keyword) => (
              <a href="/notes" key={keyword}>
                {keyword}
              </a>
            ))}
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
              Questでは、海洋産業ならではの文脈をふまえた採用支援で、海洋人材の採用をサポートします。採用計画が固まりきっていない段階でも、まずは現状の整理からご相談いただけます。
            </p>
            <a className="pmq-btn primary" href="/companies">
              採用に関する相談をする
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="pmq-support-list pmq-support-list--compact">
            {companySupports.map(({ number, title }) => (
              <div key={number}>
                <Building2 size={18} />
                <strong>{title}</strong>
              </div>
            ))}
            <a className="pmq-support-more" href="/companies">
              支援内容の詳細を見る
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="pmq-section photo-bg photo-foam photo-light" aria-label="よくある質問">
        <div className="container">
          <div className="pmq-head">
            <p className="pmq-kicker">FAQ</p>
            <h2>よくあるご質問</h2>
          </div>
          <div className="faq-list">
            {faqItems.map(({ question, answer }) => (
              <details className="faq-item" key={question}>
                <summary>
                  <span className="faq-q">Q</span>
                  {question}
                </summary>
                <p>
                  <span className="faq-a">A</span>
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
            })),
          }),
        }}
      />

      <section className="pmq-final photo-bg photo-shore">
        <div className="container">
          <p className="pmq-kicker">CONTACT</p>
          <h2>海洋産業の採用について、まずは話すところから。</h2>
          <p>
            求人票を作る前でも、採用広報を始める前でも、スカウトに悩んでいる段階でも大丈夫です。どんな人に、何を、どう伝えるべきか。貴社の事業や採用状況、海洋業界での採用課題を伺いながら、一緒に整理します。
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
