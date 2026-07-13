import { HeroVideo } from "@/components/HeroVideo";
import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

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

const relatedKeywords = [
  "海洋産業とは",
  "海洋業界とは",
  "海洋企業一覧",
  "海洋転職",
  "海洋求人",
  "海洋エンジニアとは",
  "洋上風力とは",
];

const contents = [
  { title: "動画", body: "専門家インタビューと業界解説で、海洋産業のリアルを。", href: "/videos", cta: "見る" },
  { title: "eBook", body: "業界理解・職種理解に役立つ資料を、無料で。", href: "/ebooks", cta: "読む" },
  { title: "note", body: "海洋産業の魅力とキャリアの可能性を、ブログで。", href: "/notes", cta: "読む" },
  { title: "イベント", body: "海洋産業に関わる人と企業が出会える場を、準備中。", href: "/events", cta: "知る" },
  { title: "海の地図（β）", body: "海流・港湾・灯台・海底ケーブルを、地図から探索。", href: "/map", cta: "探す" },
  { title: "キャリア診断", body: "11問・約3分。あなたに合う海の入口が、無料でわかる。", href: "/diagnosis", cta: "診断する" },
];

const industryTypes = [
  {
    title: "海洋空間活動型",
    body: "海・海底・沿岸・港湾など、海洋空間そのものを使う仕事。海運、漁業、洋上風力、海底資源、海底ケーブル、海洋調査。",
  },
  {
    title: "素材・サービス等供給型",
    body: "海の現場で使われるモノとサービスを供給する仕事。造船、船用機器、港湾設備、AUV・ROV・水中ロボット。",
  },
  {
    title: "海洋資源活用型",
    body: "海から得た資源を加工・流通・販売する仕事。水産加工、製塩、海藻・藻類活用、海洋バイオ。",
  },
];

export default function Home() {
  return (
    <main className="rd">
      <SiteHeader />
      <RdFx />

      {/* HERO: 温存していた「国土61位・海6位」を親サイトトップで使用 */}
      <section className="rd-hero">
        <div className="rd-hero-bg">
          <HeroVideo />
        </div>
        <div className="rd-hero-lockup" aria-label="Ocean Quest × POTENTIALIGHT">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rd-lockup-oq" src="/images/brand/ocean-quest-logo.png" alt="Ocean Quest" />
          <span aria-hidden="true">×</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rd-lockup-pl" src="/images/brand/potentialight-logo-white.png" alt="POTENTIALIGHT" />
        </div>
        <div className="rd-hero-inner">
          <p className="rd-kicker-w rd-rv">OCEAN QUEST — 海洋産業のキャリア・採用支援</p>
          <h1 className="rd-rv rd-rv-slow">
            <span className="rd-h1-pre">日本の国土は、世界61位。</span>
            日本の海は、世界<em><span className="rd-num">6</span>位</em>。
          </h1>
          <p className="rd-hero-sub rd-rv rd-rv-slow">
            海に眠っているのは資源だけじゃない。
            <br />
            このポテンシャルも。あなたのキャリアも。
          </p>
        </div>
        <div className="rd-scroll-cue">SCROLL</div>
      </section>

      {/* 余白 */}
      <section className="rd-breath">
        <p className="rd-line rd-rv">
          日本は、<em>海の国</em>だ。
        </p>
        <small className="rd-rv">領海と排他的経済水域は約447万km²。世界第6位の広さ。</small>
      </section>

      {/* ストーリー */}
      <div className="rd-story">
        <div className="rd-story-row">
          <div className="rd-story-num rd-rv">
            12<small>倍</small>
          </div>
          <div className="rd-story-copy rd-rv">
            <span className="rd-tag">海のポテンシャル</span>
            <h2>
              国土の12倍の「現場」が、
              <br />
              海の中にある。
            </h2>
            <p>
              海運、造船、洋上風力、水中ロボット、海洋資源。社会を支える仕事と、日本の未来をつくる挑戦が、海には広がっています。
            </p>
            <details className="rd-story-more">
              <summary>なぜポテンシャルがあるのか、もっと詳しく</summary>
              <div className="rd-story-more-body">
                <div className="rd-more-item">
                  <p className="rd-more-lead">海は、地球の70%。</p>
                  <p>
                    地球規模の熱と物質の循環のほとんどは、海を舞台に起きています。生命の起源も海。地球という惑星を理解しようとすると、海は避けて通れません。
                  </p>
                </div>
                <div className="rd-more-item">
                  <p className="rd-more-lead">日本でしか採れない資源が、海の底に眠っている。</p>
                  <p>
                    メタンハイドレート（燃える氷）、海底熱水鉱床、コバルトリッチクラスト。世界6位のEEZ（約447万km²）の中に眠りますが、そのほとんどは水深2,000〜6,000m。採りに行く技術はこれからで、商業利用できる「最初の国」になれる可能性があります。
                  </p>
                </div>
                <div className="rd-more-item">
                  <p className="rd-more-lead">探査に必要な技術が、すでに国内に揃っている。</p>
                  <p>
                    造船技術、素材、高性能センサー、精密機械、IT。海を探査・開発するために欠かせない産業基盤が日本には揃っています。4つのプレートが交わる地震大国だからこそ磨かれてきた、他国が真似しにくい強みです。
                  </p>
                </div>
                <div className="rd-more-item">
                  <p className="rd-more-lead">国も、本気で動き始めている。</p>
                  <p>
                    政府の成長戦略の重点分野に造船が入り、AUV（海のドローン）、革新的海底開発技術、海洋状況把握（MDA）の3テーマに投資が集まっています。あとは「どう産業化するか」のフェーズです。
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
        <div className="rd-story-row">
          <div className="rd-story-num rd-rv">?</div>
          <div className="rd-story-copy rd-rv">
            <span className="rd-tag">情報のギャップ</span>
            <h2>
              それなのに、海の仕事は
              <br />
              ほとんど知られていない。
            </h2>
            <p>
              海洋転職や海洋求人の情報は、まだ十分に届いていません。求人票の職種名だけでは、その仕事が社会のどこにつながっているのか伝わらないからです。
            </p>
            <details className="rd-story-more">
              <summary>どんなギャップがあるのか、もっと詳しく</summary>
              <div className="rd-story-more-body">
                <div className="rd-more-item">
                  <p className="rd-more-lead">海は、生活のすぐ隣にある。なのに見えていない。</p>
                  <p>
                    ホルムズ海峡の緊張で、ガソリンは高騰し、ポテトチップスの袋は白黒になり、医療用手袋まで足りなくなりました。輸入の生命線は海。それでも私たちの目は、陸と宇宙にばかり向いています。
                  </p>
                </div>
                <div className="rd-more-item">
                  <p className="rd-more-lead">深海は、月の裏側より未知。</p>
                  <p>
                    海はまだ数%しか解明されていないと言われます。人類が宇宙に目を向け始めた一方で、地球の70%を占める海は、いまだにほぼ未開拓のフロンティアのままです。
                  </p>
                </div>
                <div className="rd-more-item">
                  <p className="rd-more-lead">「世界6位の資産」は、ほとんど語られない。</p>
                  <p>
                    失われた30年、GDP横ばい、物価高——聞こえてくるのはそんな話ばかり。でも日本には世界6位の海と、それを活かす技術があります。この事実が知られていないこと自体が、これから入る人のチャンスです。
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* 写真だけ */}
      <section className="rd-bleed" aria-hidden="true">
        <div className="rd-bleed-bg" style={{ backgroundImage: "url('/images/backgrounds/shoreline.jpg')" }} />
        <p className="rd-rv rd-rv-slow">
          海の仕事を、
          <br />
          キャリアの選択肢に。
        </p>
      </section>

      {/* FOR YOU */}
      <section className="rd-foryou" aria-label="Ocean Questを使う3つの立場">
        <div className="rd-rv">
          <p className="rd-kicker">FOR YOU</p>
          <h2 className="rd-title">
            あなたは、<em>どの入口</em>から？
          </h2>
        </div>
        <div className="rd-foryou-list">
          <a className="rd-fy-row rd-rv" href="/diagnosis">
            <span className="rd-fy-no">01</span>
            <div>
              <h3>海の仕事に、転職したい。</h3>
              <p className="rd-d">
                海運、造船、AUV、洋上風力——異業種の経験がどう活きるか、診断とキャリア相談で一緒に整理します。
              </p>
            </div>
            <span className="rd-link">キャリア診断へ</span>
          </a>
          <a className="rd-fy-row rd-rv" href="#contents">
            <span className="rd-fy-no">02</span>
            <div>
              <h3>まず、海洋産業を知りたい。</h3>
              <p className="rd-d">どんな産業で、どんな仕事があるのか。動画とnoteで、わかりやすく発信しています。</p>
            </div>
            <span className="rd-link">コンテンツへ</span>
          </a>
          <a className="rd-fy-row rd-rv" href="/companies">
            <span className="rd-fy-no">03</span>
            <div>
              <h3>海洋人材を、採用したい。</h3>
              <p className="rd-d">
                専門人材の採用支援から採用広報まで。採用計画が固まっていない段階からご相談いただけます。
              </p>
            </div>
            <span className="rd-link">採用相談へ</span>
          </a>
        </div>
      </section>

      {/* ABOUT: 誰のための何のためのサイトか。なぜ生まれたか */}
      <section className="rd-about" id="about">
        <div className="rd-rv">
          <p className="rd-kicker">WHY OCEAN QUEST</p>
          <h2 className="rd-title">
            求人票だけでは、<em>伝わらないから</em>。
          </h2>
          <p className="rd-lead">
            Ocean
            Questは、海洋業界を目指す人と、海洋人材を採用したい企業をつなぐ、海洋産業特化のキャリア支援・採用支援サービスです。研究開発から現場実装、事業開発まで——海の仕事が社会のどこにつながっているのかを言語化し、コンテンツとして届けながら、人と企業が自然に出会える状態をつくります。
          </p>
        </div>
        <div className="rd-about-grid">
          <figure className="rd-about-photo rd-rv">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/minenaho-profile.jpg" alt="Ocean Questを運営するミネナホのプロフィール写真" />
            <figcaption>
              FOUNDER — 株式会社ポテンシャライト
              <br />
              Ocean Quest 責任者 ミネナホ
            </figcaption>
          </figure>
          <div className="rd-about-copy rd-rv">
            <h3>
              海洋産業に特化した、
              <br />
              人材・採用支援の入口をつくる。
            </h3>
            <p>
              海洋業界に特化して、採用支援、キャリア支援、業界理解の発信までを一体で行うサービスは、日本ではまだ存在していません。世界6位の海を持つ国なのに、その海の仕事への入口がない——このサイトは、そのギャップから生まれました。
            </p>
            <p>
              だからこそ私は、海洋産業について日本で最も深く理解する採用コンサルタント・キャリアカウンセラーでありたいと考えています。企業の採用課題と、個人のキャリアの可能性、その両方に向き合いながら、海洋業界に関わる人を増やしていきます。
            </p>
            <p className="rd-strong-line">海のしごとの面白さを、キャリアの選択肢に。</p>
          </div>
        </div>
      </section>

      {/* QUEST */}
      <section className="rd-quest" id="quest" aria-label="領域別Quest">
        <div className="rd-quest-inner">
          <div className="rd-rv">
            <p className="rd-kicker">OCEAN QUEST FAMILY</p>
            <h2 className="rd-title">
              領域を選んで、<em>深く潜る</em>。
            </h2>
          </div>
          <a className="rd-quest-feature rd-rv" href="/robotics">
            <div className="rd-quest-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/backgrounds/journey-deepsea.jpg" alt="QUEST 01 水中ロボティクスのしごと" />
            </div>
            <div className="rd-quest-copy">
              <span className="rd-qno">QUEST 01</span>
              <h3>
                水中ロボティクスの
                <br />
                しごと
              </h3>
              <p className="rd-d">
                人が潜れるのは、40m。日本の水中ロボットは、8,000m。ROV・AUVをつくる人、動かす人のための領域ガイド。
              </p>
              <span className="rd-link">この領域に潜る</span>
            </div>
          </a>
          <div className="rd-quest-next rd-rv">
            <p className="rd-qn">
              <span>QUEST 02 — COMING SOON</span>洋上風力のしごと
            </p>
            <p className="rd-qn">
              <span>QUEST 03 — COMING SOON</span>海運・造船のしごと
            </p>
          </div>
        </div>
      </section>

      {/* 3分類 */}
      <section className="rd-types" aria-label="海洋産業の3分類">
        <div className="rd-rv">
          <p className="rd-kicker">CATEGORY</p>
          <h2 className="rd-title">
            海洋産業は、<em>3つの型</em>でつかめる。
          </h2>
        </div>
        <div className="rd-tlist">
          {industryTypes.map(({ title, body }) => (
            <div className="rd-tlist-row rd-rv" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <p className="rd-src rd-rv">出典: 内閣府「海洋産業の活動状況に関する調査」／第4期海洋基本計画</p>
      </section>

      {/* CONTENTS */}
      <section className="rd-contents" id="contents" aria-label="コンテンツ">
        <div className="rd-rv">
          <p className="rd-kicker">CONTENTS</p>
          <h2 className="rd-title">知ることから、始まる。</h2>
        </div>
        <div className="rd-contents-grid">
          {contents.map(({ title, body, href, cta }) => (
            <a className="rd-content-cell rd-rv" href={href} key={href}>
              <h3>{title}</h3>
              <p>{body}</p>
              <span className="rd-link">{cta}</span>
            </a>
          ))}
        </div>
      </section>

      {/* FOR COMPANIES */}
      <section className="rd-companies" id="companies" aria-label="企業の方へ">
        <div className="rd-companies-bg" style={{ backgroundImage: "url('/images/backgrounds/container-port.jpg')" }} />
        <div className="rd-companies-inner">
          <div className="rd-rv">
            <p className="rd-kicker">FOR COMPANIES</p>
            <h2>
              海洋産業の採用を、
              <br />
              「伝える」ところから設計する。
            </h2>
            <p className="rd-lead-w">
              専門性の高い職種ほど、求人票だけでは魅力が届きません。海洋産業ならではの文脈をふまえて、採用を設計します。求人票を作る前の段階から、ご相談ください。
            </p>
            <a className="rd-btn rd-btn-primary" href="/companies">
              採用について相談する
            </a>
          </div>
          <div className="rd-support-list rd-rv">
            <div>
              <span className="rd-sno">01</span>採用戦略・職種要件の設計
            </div>
            <div>
              <span className="rd-sno">02</span>採用サイト・採用広報・コンテンツ企画
            </div>
            <div>
              <span className="rd-sno">03</span>専門人材向けスカウト支援
            </div>
            <div>
              <span className="rd-sno">04</span>母集団形成・候補者体験の設計
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + 検索キーワード（静かに） */}
      <section className="rd-faq" aria-label="よくある質問" style={{ paddingTop: "18vh" }}>
        <div className="rd-rv">
          <p className="rd-kicker">FAQ</p>
          <h2 className="rd-title">よくあるご質問</h2>
        </div>
        <div className="rd-faq-list rd-rv">
          {faqItems.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
        <div className="rd-keywords rd-rv">
          <p>よく検索されるキーワードから探す</p>
          <div className="rd-keywords-tags">
            {relatedKeywords.map((keyword) => (
              <a href="/notes" key={keyword}>
                {keyword}
              </a>
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

      {/* FINAL */}
      <section className="rd-final" id="final">
        <div className="rd-final-bg" style={{ backgroundImage: "url('/images/backgrounds/harbor-sunset.jpg')" }} />
        <div className="rd-final-inner">
          <h2 className="rd-rv rd-rv-slow">
            世界6位の海が、
            <br />
            あなたを待っている。
          </h2>
          <p className="rd-final-sub rd-rv rd-rv-slow">
            キャリアの相談も、採用の相談も、無料です。
            <br />
            まずは、話すところから。
          </p>
          <div className="rd-final-ctas rd-rv">
            <a className="rd-btn rd-btn-primary" href="/contact">
              キャリア相談をする
            </a>
            <a className="rd-btn rd-btn-ghost" href="/companies">
              採用について相談する
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
