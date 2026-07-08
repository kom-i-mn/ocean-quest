import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  Building2,
  Compass,
  Cpu,
  FlaskConical,
  GraduationCap,
  Landmark,
  Radar,
  TrendingUp,
  Waves,
  Wrench,
  Zap,
} from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "水中ロボティクスQuest | ROV・AUV・水中ドローンの転職・キャリア | Ocean Quest",
  description:
    "水中ロボティクス（ROV・AUV・水中ドローン）専門のキャリアサイト。洋上風力・海底ケーブル・防衛で拡大する市場背景、職種マップ、自動車・ドローン・組込みなど異業種経験の活かし方、企業・研究機関マップまで。無料キャリア診断・相談つき。",
  alternates: { canonical: "/robotics" },
};

const keyPoints = [
  "水中ロボティクス（ROV・AUV）は、洋上風力・海底ケーブル・防衛の需要拡大でエンジニア採用が活発化している成長領域です。",
  "自動車・ドローン・FA・組込みなど隣接分野の経験は、水中ロボット開発にそのまま翻訳できるスキルが多くあります。",
  "Ocean Questのキャリア診断で、水中ロボティクス領域との適性・想定職種・想定年収帯を無料で確認できます。",
];

const whyNow = [
  {
    icon: Landmark,
    title: "政策：AUVの社会実装が国家戦略に",
    body: "内閣府は2023年に「AUVの社会実装に向けた戦略」を策定し、官民プラットフォームを設立。2030年に向けてAUV（自律型無人潜水機）の産業化・量産化を国を挙げて推進するフェーズに入りました。",
  },
  {
    icon: TrendingUp,
    title: "市場：洋上風力の水中点検需要",
    body: "政府は洋上風力を2030年10GW、2040年30〜45GWの案件形成目標で拡大中。着床基礎や海底ケーブルの点検・保守は水中作業そのもので、ROV・AUVによる無人点検の需要が構造的に増えていきます。",
  },
  {
    icon: Waves,
    title: "インフラ：海底ケーブルと海洋調査",
    body: "国際通信のほぼすべては海底ケーブルが支えており、敷設・保守・監視の需要は増加の一途。加えて資源調査・海洋観測・防衛（無人水中航走体）でも、海中を担うロボットの役割が広がっています。",
  },
  {
    icon: Bot,
    title: "採用：担い手不足×技術の転換点",
    body: "潜水士や調査船の人材不足を背景に「人が潜らない海」への転換が進む一方、国内で水中ロボットを開発できるエンジニアはまだ少数。隣接分野からの転身者が最初の主力になれるタイミングです。",
  },
];

const roles = [
  {
    icon: Compass,
    title: "制御・自律化エンジニア",
    body: "AUVの航法・誘導・姿勢制御、自己位置推定（SLAM）、障害物回避などの自律化を担う中核職種。",
    skills: "制御工学 / ROS / C++・Python / センサフュージョン",
  },
  {
    icon: Wrench,
    title: "機械設計エンジニア",
    body: "水深数百〜数千mの水圧に耐える耐圧容器、シーリング、推進系、フレームの設計。海水・腐食との戦い。",
    skills: "機械設計・CAD / 材料力学 / 流体 / 防水・シール設計",
  },
  {
    icon: Zap,
    title: "電気・電子エンジニア",
    body: "バッテリー・電源系、モータドライバ、水中コネクタ、基板設計。限られた電力と空間で信頼性を出す仕事。",
    skills: "回路・基板設計 / 電源設計 / EMC / ハーネス設計",
  },
  {
    icon: Cpu,
    title: "組込みソフトウェアエンジニア",
    body: "機体のファームウェア、リアルタイム制御、機器間通信、フェイルセーフ。海中では再起動しに行けない前提の設計。",
    skills: "組込みC・RTOS / 通信プロトコル / テスト設計",
  },
  {
    icon: Radar,
    title: "音響・センサーエンジニア",
    body: "電波が届かない海中の目と耳＝ソナー・音響測位・音響通信を担う専門職。信号処理の腕が活きる領域。",
    skills: "信号処理 / 音響工学 / ソナー / 画像認識",
  },
  {
    icon: Waves,
    title: "フィールド・実証エンジニア／オペレーター",
    body: "海上試験、ROVの操縦（パイロット）、船上オペレーション、点検業務の実行。現場からこの産業に入る入口。",
    skills: "現場運用 / 船上作業 / 機体整備 / 安全管理",
  },
  {
    icon: Bot,
    title: "データ・解析エンジニア",
    body: "ロボットが取得した海中の画像・点群・観測データの処理と解析。点検レポートや海底地形図の自動化を担う。",
    skills: "画像処理 / 点群処理 / 機械学習 / GIS",
  },
  {
    icon: Building2,
    title: "PM・事業開発",
    body: "官公庁・電力・通信事業者との実証プロジェクト推進、海外メーカーとの提携、点検サービスの事業化。",
    skills: "プロジェクト推進 / 官公庁調整 / アライアンス / 事業企画",
  },
];

const translations = [
  {
    from: "自動車（ADAS・自動運転の認識/制御）",
    to: "AUVの自律航法・障害物回避",
    note: "センサフュージョンと経路計画の考え方はほぼ共通。GPSが使えない海中ならではの面白さが加わる。",
  },
  {
    from: "ドローン（飛行制御・機体設計）",
    to: "水中ドローンの姿勢制御・機体開発",
    note: "空から水へ。流体が変わるだけで、モータ制御・姿勢推定・軽量設計の経験はそのまま武器になる。",
  },
  {
    from: "FA・産業用ロボット（モーション制御）",
    to: "ROVマニピュレータ・遠隔操作システム",
    note: "アームの制御・ティーチング・安全設計の経験は、水中マニピュレーションの希少人材に直結。",
  },
  {
    from: "組込みソフト（車載・産業機器）",
    to: "耐環境組込み・リアルタイム制御",
    note: "「止まってはいけないシステム」を作ってきた経験が、海中という究極の耐環境で活きる。",
  },
  {
    from: "通信・音響（無線・信号処理）",
    to: "水中音響通信・ソナー信号処理",
    note: "海中は電波が届かず音が主役。信号処理エンジニアがボトルネック技術の担い手になる。",
  },
  {
    from: "ゲーム・3DCG（物理エンジン・シミュレーション）",
    to: "海中デジタルツイン・シミュレータ開発",
    note: "実海域試験は高コスト。シミュレーション上で開発を回す環境づくりが各社の課題になっている。",
  },
  {
    from: "プラント・重工（大型機械の設計・保全）",
    to: "洋上風力O&M・水中構造物点検",
    note: "回転機や構造物の保全知識×ロボットで、点検サービスの設計者・監督者へ。",
  },
  {
    from: "研究（流体・材料・海洋学など）",
    to: "R&D・耐圧/推進系の研究開発",
    note: "論文から実装へ。JAMSTECや大学発の技術を製品にする役割が増えている。",
  },
];

const players = [
  {
    icon: Building2,
    category: "大手メーカー・重工",
    body: "潜水艦・深海探査機で培った技術を持つ重工各社（三菱重工業、川崎重工業、IHIなど）や、ソナー・音響機器のメーカー（NEC、OKI、古野電気など）がAUV・水中音響の中核を担っています。",
  },
  {
    icon: Bot,
    category: "スタートアップ",
    body: "産業用水中ドローンのFullDepthをはじめ、点検・調査サービスや機体開発のスタートアップが登場。海外ではSaab SeaeyeやKongsbergなどの専業メーカーが大きな市場を築いており、日本はこれからが本番です。",
  },
  {
    icon: FlaskConical,
    category: "研究機関",
    body: "JAMSTEC（海洋研究開発機構）は「うらしま」など自律型探査機の開発・運用で世界的な実績を持ちます。海上技術安全研究所、港湾空港技術研究所、産総研なども要素技術の研究拠点です。",
  },
  {
    icon: GraduationCap,
    category: "大学・官公庁",
    body: "東京大学生産技術研究所、東京海洋大学、九州工業大学などが水中ロボットの研究・人材輩出拠点。内閣府（海洋政策）、海上保安庁、防衛省・防衛装備庁、水産庁が需要側として市場を牽引します。",
  },
];

const contents = [
  {
    title: "動画で学ぶ",
    body: "海洋産業の仕事と企業をYouTubeで紹介。まずは現場の空気から。",
    href: "/videos",
    label: "動画ライブラリへ",
  },
  {
    title: "note記事",
    body: "海洋産業・海のしごとを読み解く記事。業界理解を深めたい人へ。",
    href: "/notes",
    label: "note記事一覧へ",
  },
  {
    title: "eBook（無料）",
    body: "キャリア・転職ノウハウを資料化したeBookをダウンロードできます。",
    href: "/ebooks",
    label: "eBookライブラリへ",
  },
  {
    title: "海の地図（β）",
    body: "海流・港湾・海底ケーブルを地図で探索。産業の現場を体感する。",
    href: "/map",
    label: "海の地図へ",
  },
];

const faqItems = [
  {
    question: "水中ロボティクス業界への転職には、海洋の知識が必要ですか？",
    answer:
      "多くの場合、必須ではありません。求められているのはロボティクス・制御・組込み・機械/電気設計などのエンジニアリング経験で、海洋固有の知識（耐圧・腐食・音響など）は入社後に習得する前提の求人が中心です。自動車・ドローン・FAなど隣接分野からの転身が現実的なルートです。",
  },
  {
    question: "ROVとAUVは何が違いますか？",
    answer:
      "ROV（Remotely Operated Vehicle）はケーブルでつながった機体を人が遠隔操縦する水中ロボット、AUV（Autonomous Underwater Vehicle）はケーブルなしで自律航行する水中ロボットです。ROVは点検・作業、AUVは広域の調査・観測が主な用途で、求められる技術も操縦・作業系と自律化・ソフトウェア系で異なります。",
  },
  {
    question: "エンジニア経験がなくても水中ロボティクス領域に関われますか？",
    answer:
      "関われます。ROVオペレーターやフィールド実証、プロジェクトマネジメント、事業開発、官公庁向けの渉外など、開発以外の職種も採用が増えています。まずは無料のキャリア診断で、自分の経験がどの職種につながるかを確認するのがおすすめです。",
  },
];

export default function RoboticsQuestPage() {
  return (
    <main className="subpage-shell subpage-bg-blue-water">
      <SiteHeader solid />

      <section className="subpage-hero quest-hero">
        <p className="section-kicker">Ocean Quest Family</p>
        <p className="quest-badge">水中ロボティクス Quest</p>
        <h1>海の中で動くロボットを、仕事にする。</h1>
        <p>
          ROV・AUV・水中ドローンをつくる人、動かす人、事業にする人のためのキャリアサイトです。洋上風力・海底ケーブル・防衛・海洋調査——「人が潜らない海」への転換を担うエンジニアと仲間を、この領域につなぎます。
        </p>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="/diagnosis">
            3分キャリア診断をする
            <ArrowRight size={18} />
          </a>
          <a className="secondary-button light" href="/contact">
            無料でキャリア相談する
          </a>
        </div>
        <ul className="quest-points">
          {keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="section" id="why-now" aria-label="なぜ今、水中ロボティクスなのか">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Why Now</p>
            <h2>なぜ今、水中ロボティクスなのか</h2>
          </div>
          <p>
            政策・市場・インフラ・採用の4つの追い風が同時に吹いている、いま入る意味のある領域です。
          </p>
        </div>
        <div className="card-grid">
          {whyNow.map(({ icon: Icon, title, body }) => (
            <article className="content-card" key={title}>
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="roles" aria-label="どんな仕事があるのか">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Job Map</p>
            <h2>どんな仕事があるのか</h2>
          </div>
          <p>
            機体をつくる開発職から、海で動かす現場職、事業を広げる企画職まで。水中ロボティクスの主な8職種です。
          </p>
        </div>
        <div className="card-grid quest-role-grid">
          {roles.map(({ icon: Icon, title, body, skills }) => (
            <article className="content-card quest-role-card" key={title}>
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <p className="quest-role-skills">{skills}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="translate" aria-label="異業種からどうつながるか">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Career Translation</p>
            <h2>あなたの経験は、こう翻訳できる</h2>
          </div>
          <p>
            水中ロボティクスは「海の経験者」より「隣接分野の経験者」でできている領域です。いまの仕事からのつながり方を見てみてください。
          </p>
        </div>
        <div className="quest-translate-list">
          {translations.map(({ from, to, note }) => (
            <article className="quest-translate-row" key={from}>
              <div className="quest-translate-pair">
                <span className="quest-translate-from">{from}</span>
                <span className="quest-translate-arrow" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
                <span className="quest-translate-to">{to}</span>
              </div>
              <p className="quest-translate-note">{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="players" aria-label="企業・プレイヤーマップ">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Player Map</p>
            <h2>企業・プレイヤーマップ</h2>
          </div>
          <p>
            大手からスタートアップ、研究機関まで。この領域を動かしている主なプレイヤーの見取り図です（社名は代表例で、網羅ではありません）。
          </p>
        </div>
        <div className="card-grid quest-player-grid">
          {players.map(({ icon: Icon, category, body }) => (
            <article className="content-card" key={category}>
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <h3>{category}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section quest-diagnosis" aria-label="キャリア診断">
        <div className="quest-diagnosis-inner">
          <p className="section-kicker">Career Diagnosis</p>
          <h2>自分は水中ロボティクスに向いている？</h2>
          <p>
            分岐型の質問（約3分・無料）で、9領域×4職種＝36タイプからあなたのタイプを判定。水中ロボティクスとの適性、想定職種、想定年収帯、次の一手までその場で表示します。
          </p>
          <a className="primary-button" href="/diagnosis">
            無料でキャリア診断をする
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="section" id="contents" aria-label="コンテンツで理解を深める">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Contents</p>
            <h2>コンテンツで理解を深める</h2>
          </div>
          <p>転職を考える前の情報収集から使えるコンテンツを揃えています。</p>
        </div>
        <div className="card-grid quest-content-grid">
          {contents.map(({ title, body, href, label }) => (
            <article className="content-card" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
              <a className="text-link" href={href}>
                {label}
                <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-label="よくある質問">
        <div className="section-heading">
          <div>
            <p className="section-kicker">FAQ</p>
            <h2>よくある質問</h2>
          </div>
        </div>
        <div className="faq-list quest-faq">
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
      </section>

      <section className="section quest-cta" aria-label="相談する">
        <div className="quest-cta-grid">
          <article className="quest-cta-card">
            <p className="section-kicker">For Candidates</p>
            <h2>キャリアの話を、まずは気軽に。</h2>
            <p>
              「今の経験で通用する？」「どの職種から入るべき？」——水中ロボティクス領域への転身を、海洋産業特化のキャリアパートナーが無料で相談に乗ります。
            </p>
            <a className="primary-button" href="/contact">
              無料キャリア相談をする
              <ArrowRight size={18} />
            </a>
          </article>
          <article className="quest-cta-card">
            <p className="section-kicker">For Companies</p>
            <h2>水中ロボティクスの採用を支援します。</h2>
            <p>
              制御・組込み・機械設計などの希少人材採用を、隣接業界からの「経験の翻訳」を軸に設計します。採用戦略からスカウト・広報まで。
            </p>
            <a className="secondary-button light" href="/companies">
              企業向け採用支援を見る
              <ArrowRight size={18} />
            </a>
          </article>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "水中ロボティクスQuest | ROV・AUV・水中ドローンの転職・キャリア",
              url: "https://ocean-quest.jp/robotics",
              inLanguage: "ja",
              isPartOf: { "@id": "https://ocean-quest.jp/#website" },
              about: [
                { "@type": "Thing", name: "水中ロボティクス" },
                { "@type": "Thing", name: "ROV（遠隔操作型無人潜水機）" },
                { "@type": "Thing", name: "AUV（自律型無人潜水機）" },
                { "@type": "Thing", name: "水中ドローン" },
              ],
            },
          ]),
        }}
      />

      <SiteFooter />
    </main>
  );
}
