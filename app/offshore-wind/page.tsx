import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Anchor,
  Building2,
  Compass,
  FileText,
  Handshake,
  HardHat,
  Landmark,
  Radar,
  TrendingUp,
  Waves,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { QuestFx } from "@/components/QuestFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { listNoteContents } from "@/lib/supabase";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "洋上風力Quest | 洋上風力発電の転職・キャリア | Ocean Quest",
  description:
    "洋上風力発電専門のキャリアサイト。2030年10GW・2040年30〜45GWの政府目標で拡大する市場背景、開発からO&Mまでの職種マップ、建設・プラント・電力・金融など異業種経験の活かし方、事業者・メーカーマップまで。無料キャリア診断・相談つき。",
  alternates: { canonical: "/offshore-wind" },
};

const keyPoints = [
  "洋上風力は、政府が2030年10GW・2040年30〜45GWの案件形成目標を掲げる、再エネ主力電源化の切り札です。",
  "建設・プラント・電力・金融・不動産開発など隣接分野の経験は、洋上風力の開発・施工・O&Mでそのまま武器になります。",
  "Ocean Questのキャリア診断で、洋上風力領域との適性・想定職種・想定年収帯を無料で確認できます。",
];

// 出典: 資源エネルギー庁「洋上風力政策について」、洋上風力産業ビジョン(第1次・2020年12月)
const whyNowStats = [
  {
    display: "30〜45GW",
    label: "2040年の案件形成目標",
    note: "政府目標。2030年10GWから段階的に拡大（洋上風力産業ビジョン）",
  },
  {
    value: 24,
    prefix: "",
    suffix: "倍",
    label: "世界市場の拡大見込み",
    note: "世界の導入量 2018年23GW → 2040年562GW（IEA見込み）",
  },
  {
    display: "数万点",
    label: "風車1基の部品数",
    note: "事業規模は数千億円に及び、関連産業への波及効果が大きい",
  },
  {
    value: 30,
    prefix: "",
    suffix: "年間",
    label: "促進区域の占用期間",
    note: "再エネ海域利用法で長期事業が可能に。キャリアも30年続く",
  },
];

const whyNow = [
  {
    icon: Landmark,
    title: "国が導入目標を明示した、数少ない産業",
    body: "洋上風力産業ビジョン（2020年）で、政府は2030年10GW・2040年30〜45GWの案件形成目標を明示。再エネ海域利用法により促進区域では30年間の長期占用が可能になり、秋田・千葉・長崎・新潟など全国で事業者選定と建設が進んでいます。",
  },
  {
    icon: TrendingUp,
    title: "世界市場は24倍へ。アジアが主戦場になる",
    body: "世界の洋上風力導入量は2018年23GWから2040年562GWへ、24倍の成長が見込まれています。特に中国・台湾・韓国などアジア市場の急成長が予想され、日本で身につけた経験がそのまま国際市場で通用するキャリアになります。",
  },
  {
    icon: Building2,
    title: "部品数万点・事業数千億円の裾野産業",
    body: "風車1基は部品数万点で構成され、1つのプロジェクトの事業規模は数千億円に達します。デンマークのエスビアウ港は洋上風力で約8,000人の雇用を創出。日本でも港湾都市を起点に、製造・建設・物流・保守の雇用が生まれ始めています。",
  },
  {
    icon: Waves,
    title: "浮体式で「深い海の日本」が主役になる",
    body: "遠浅の海が少ない日本の本命は、深い海に浮かべる浮体式。グリーンイノベーション基金1,195億円で浮体・係留・ダイナミックケーブルの技術開発が進み、EEZ（排他的経済水域）への展開に向けた法整備も動いています。世界に先駆けるチャンスがある領域です。",
  },
  {
    icon: Wrench,
    title: "つくって終わりではない。30年続くO&Mの仕事",
    body: "風車は運転開始から20〜30年間、点検・保守（O&M）が続きます。ブレード補修、ナセル内の機械・電気保全、CTV（作業員輸送船）でのアクセス、ドローンやロボットによる点検高度化——地域に根ざした長期雇用が構造的に生まれます。",
  },
  {
    icon: Handshake,
    title: "国家戦略に「人材育成プログラム」が明記",
    body: "洋上風力産業ビジョンの基本戦略には「洋上風力人材育成プログラム」が明記され、業界を挙げて未経験者・異業種経験者の受け入れ体制づくりが進んでいます。産業の立ち上がり期のいま入る人が、日本の洋上風力の第一世代になります。",
  },
];

const roles = [
  {
    icon: Compass,
    title: "事業開発・案件開発",
    body: "公募への応札戦略、風況・海域調査の企画、漁業・地域との共生策づくり。数千億円プロジェクトの起点をつくる仕事。",
    skills: "事業企画 / 公募・入札 / 合意形成 / 収支モデリング",
  },
  {
    icon: Radar,
    title: "風況・海象解析",
    body: "風況観測データの解析、発電量予測、ウェイク（風の乱れ）評価。プロジェクトの経済性を左右する頭脳。",
    skills: "データ解析 / 気象・流体 / 統計 / Python",
  },
  {
    icon: Anchor,
    title: "基礎・浮体設計エンジニア",
    body: "モノパイル・ジャケットなどの着床式基礎や、浮体・係留システムの設計。地盤・波・台風と向き合う海洋土木の中核。",
    skills: "構造設計 / 地盤工学 / 海洋工学 / 溶接・材料",
  },
  {
    icon: Zap,
    title: "電気・系統エンジニア",
    body: "海底ケーブル・洋上変電所・系統連系の計画と設計。発電した電気を陸に届けるインフラを担う。",
    skills: "電力系統 / 高電圧 / ケーブル計画 / 保護制御",
  },
  {
    icon: HardHat,
    title: "建設・施工管理",
    body: "SEP船（自己昇降式作業船）での風車据付、港湾での基地運営、海上工事全体の工程・安全管理。",
    skills: "施工管理 / 海上工事 / 工程・安全管理 / 港湾ロジ",
  },
  {
    icon: Wrench,
    title: "O&M（運転保守）エンジニア",
    body: "風車の定期点検・故障対応・ブレード補修。CTVで風車に渡り、高所・洋上で手を動かす現場の主役。20〜30年続く仕事。",
    skills: "機械・電気保全 / 高所作業（GWO） / トラブルシュート",
  },
  {
    icon: FileText,
    title: "環境アセス・許認可",
    body: "環境影響評価、海域の利害関係者との協議、行政手続き。事業を前に進めるための「調整のプロ」。",
    skills: "環境アセスメント / 渉外・行政協議 / 法規制",
  },
  {
    icon: TrendingUp,
    title: "ファイナンス・保険",
    body: "数千億円規模のプロジェクトファイナンス組成、リスク評価、保険設計。金融の専門性が直接活きる領域。",
    skills: "プロジェクトファイナンス / リスク管理 / 契約",
  },
];

const translations = [
  {
    from: "建設・土木（施工管理）",
    to: "洋上風力の建設・施工管理",
    note: "工程・品質・安全管理の腕はそのまま。現場が陸から海に変わるだけで、希少人材になれる。",
  },
  {
    from: "プラント・発電所（機械・電気保全）",
    to: "風車のO&M（運転保守）",
    note: "回転機・電気設備の保全経験はO&Mの即戦力。GWO（安全訓練）は入社後取得が一般的。",
  },
  {
    from: "電力・送配電（系統・変電）",
    to: "系統連系・海底ケーブル計画",
    note: "系統の知識を持つ人材は業界全体で取り合い。洋上変電所という新しい仕事もある。",
  },
  {
    from: "不動産・都市開発（用地・合意形成）",
    to: "案件開発・地域共生",
    note: "地権者調整の経験は、漁業者・自治体との合意形成にそのまま翻る。開発職の中核スキル。",
  },
  {
    from: "金融（プロジェクトファイナンス・審査）",
    to: "洋上風力ファイナンス",
    note: "数千億円規模の組成・リスク評価ができる人材は圧倒的に不足している。",
  },
  {
    from: "気象・環境・データ解析",
    to: "風況解析・発電量予測",
    note: "データで発電量を当てる仕事。解析スキルがプロジェクトの入札価格を決める。",
  },
  {
    from: "造船・海運（船舶・海上オペレーション）",
    to: "SEP船・CTVオペレーション",
    note: "船と海を知る人は施工・O&Mの物流設計で不可欠。海技資格はさらに強い武器に。",
  },
  {
    from: "商社・海外営業（調達・アライアンス）",
    to: "サプライチェーン構築・国際調達",
    note: "風車・部材の多くは海外調達。英語×調達×プロジェクト推進で活躍の場が広い。",
  },
];

const players = [
  {
    icon: Building2,
    category: "発電事業者・デベロッパー",
    body: "商社・電力会社を中心に、促進区域の公募で事業者コンソーシアムが組成されています。海外の専業デベロッパーも日本市場に参入済みです。",
    orgs: [
      { name: "三菱商事", url: "https://www.mitsubishicorp.com/jp/ja/" },
      { name: "丸紅", url: "https://www.marubeni.com/jp/" },
      { name: "JERA", url: "https://www.jera.co.jp/" },
      { name: "東京電力リニューアブルパワー", url: "https://www.tepco.co.jp/rp/" },
      { name: "住友商事", url: "https://www.sumitomocorp.com/ja/jp" },
      { name: "Ørsted（デンマーク）", url: "https://orsted.com/" },
      { name: "RWE（ドイツ）", url: "https://www.rwe.com/" },
    ],
  },
  {
    icon: Wind,
    category: "風車メーカー・サプライヤー",
    body: "風車本体は海外3社が世界市場を占めますが、基礎・部材の国産化も進行中。国内調達比率60%（2040年）が産業界の目標です。",
    orgs: [
      { name: "Vestas（デンマーク）", url: "https://www.vestas.com/" },
      { name: "Siemens Gamesa（スペイン）", url: "https://www.siemensgamesa.com/" },
      { name: "GE Vernova（米国）", url: "https://www.gevernova.com/" },
      { name: "JFEエンジニアリング", url: "https://www.jfe-eng.co.jp/" },
    ],
  },
  {
    icon: HardHat,
    category: "建設・海洋土木",
    body: "大手ゼネコン・マリコンがSEP船（自己昇降式作業船）を建造し、風車の据付・基礎工事を担っています。海上施工の経験者需要が急増中です。",
    orgs: [
      { name: "五洋建設", url: "https://www.penta-ocean.co.jp/" },
      { name: "清水建設", url: "https://www.shimz.co.jp/" },
      { name: "大林組", url: "https://www.obayashi.co.jp/" },
      { name: "鹿島建設", url: "https://www.kajima.co.jp/" },
    ],
  },
  {
    icon: Landmark,
    category: "官公庁・業界団体",
    body: "経産省・国交省の共管で公募・海域指定が進み、NEDOが技術開発を支援。業界団体が人材育成プログラムを運営しています。",
    orgs: [
      { name: "資源エネルギー庁", url: "https://www.enecho.meti.go.jp/" },
      { name: "国土交通省", url: "https://www.mlit.go.jp/" },
      { name: "NEDO", url: "https://www.nedo.go.jp/" },
      { name: "日本風力発電協会", url: "https://jwpa.jp/" },
    ],
  },
];

const faqItems = [
  {
    question: "洋上風力業界への転職に、電力・エネルギー業界の経験は必要ですか？",
    answer:
      "必須ではありません。洋上風力は開発・建設・金融・保守まで裾野が広く、建設施工管理、プラント保全、不動産開発の合意形成、プロジェクトファイナンスなど、異業種の経験がそのまま評価される職種が多くあります。産業の立ち上がり期のため「業界経験者」自体がほぼ存在せず、隣接スキルでの転身が主流です。",
  },
  {
    question: "着床式と浮体式は何が違いますか？",
    answer:
      "着床式は海底に基礎を固定する方式で、水深50m程度までの浅い海域に適しています。浮体式は風車を浮体に載せて係留する方式で、深い海域にも設置できます。遠浅の海が少ない日本では浮体式が本命とされ、グリーンイノベーション基金による技術開発と実証が進んでいます。",
  },
  {
    question: "どんな職種の求人が増えていますか？",
    answer:
      "大きくは①開発（案件形成・地域調整・風況解析）、②建設（施工管理・海上工事）、③O&M（運転保守）の3段階で需要が動きます。特にO&Mは風車の運転期間20〜30年にわたって続く仕事で、地方の勤務地で長期に働ける点が特徴です。まずは無料のキャリア診断で、自分の経験がどの職種につながるか確認するのがおすすめです。",
  },
];

function SectionHead({
  no,
  ghost,
  kicker,
  title,
  lead,
}: {
  no: string;
  ghost: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <div className="quest-sec-head rv">
      <div className="quest-ghost" aria-hidden="true">
        {ghost}
      </div>
      <p className="quest-kicker">
        <span className="qno">{no}</span>
        {kicker}
      </p>
      <h2>{title}</h2>
      {lead ? <p className="quest-lead">{lead}</p> : null}
    </div>
  );
}

function Turbine({
  x,
  scale,
  duration,
  delay,
}: {
  x: number;
  scale: number;
  duration: number;
  delay: number;
}) {
  return (
    <g transform={`translate(${x}, 0) scale(${scale})`}>
      {/* 浮体プラットフォーム */}
      <rect x="-46" y="512" width="92" height="18" rx="8" fill="#0a2e3f" />
      {/* 係留ライン */}
      <path d="M-40 528 C -70 620, -110 700, -150 758" stroke="rgba(143,227,221,0.35)" strokeWidth="2" fill="none" />
      <path d="M0 530 L0 760" stroke="rgba(143,227,221,0.28)" strokeWidth="2" fill="none" />
      <path d="M40 528 C 70 620, 110 700, 150 758" stroke="rgba(143,227,221,0.35)" strokeWidth="2" fill="none" />
      {/* タワー */}
      <path d="M-7 512 L-4 220 L4 220 L7 512 Z" fill="url(#owhTower)" />
      {/* ナセル */}
      <rect x="-16" y="206" width="38" height="18" rx="7" fill="#e9f5f3" />
      {/* ローター */}
      <g
        className="owh-rotor"
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        <circle cx="0" cy="215" r="7" fill="#cfe8e4" />
        <path d="M0 215 L-8 84 Q0 74 8 84 Z" fill="#f4fbfa" transform="rotate(0, 0, 215)" />
        <path d="M0 215 L-8 84 Q0 74 8 84 Z" fill="#f4fbfa" transform="rotate(120, 0, 215)" />
        <path d="M0 215 L-8 84 Q0 74 8 84 Z" fill="#f4fbfa" transform="rotate(240, 0, 215)" />
      </g>
    </g>
  );
}

export default async function OffshoreWindQuestPage() {
  const notes = await listNoteContents(3).catch(() => []);

  return (
    <main className="subpage-shell subpage-bg-blue-water quest-page">
      <SiteHeader solid />
      <QuestFx />

      <section className="quest-hero-v2 owh-hero" aria-label="洋上風力Quest">
        <div className="qhv-scene" aria-hidden="true">
          <div className="owh-sunglow" />
          <div className="qhv-particles" />
          <svg className="qhv-svg" viewBox="0 0 1440 810" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="owhTower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f4fbfa" />
                <stop offset="1" stopColor="#9fc4c9" />
              </linearGradient>
              <linearGradient id="owhSea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(0, 74, 92, 0.92)" />
                <stop offset="1" stopColor="rgba(1, 16, 26, 0.98)" />
              </linearGradient>
            </defs>

            {/* 雲 */}
            <g className="owh-cloud">
              <ellipse cx="220" cy="120" rx="90" ry="18" fill="rgba(255,255,255,0.10)" />
              <ellipse cx="300" cy="100" rx="60" ry="14" fill="rgba(255,255,255,0.08)" />
            </g>
            <g className="owh-cloud owh-cloud-2">
              <ellipse cx="1150" cy="90" rx="110" ry="20" fill="rgba(255,255,255,0.10)" />
              <ellipse cx="1240" cy="112" rx="70" ry="14" fill="rgba(255,255,255,0.07)" />
            </g>

            {/* 海（海面から下） */}
            <rect x="0" y="520" width="1440" height="290" fill="url(#owhSea)" />
            <path
              className="owh-wave"
              d="M0 520 C 120 512, 240 528, 360 520 C 480 512, 600 528, 720 520 C 840 512, 960 528, 1080 520 C 1200 512, 1320 528, 1440 520"
              fill="none"
              stroke="rgba(143, 227, 221, 0.5)"
              strokeWidth="2.5"
            />

            {/* 風車3基（浮体式・回転） */}
            <Turbine x={1150} scale={1} duration={5.2} delay={0} />
            <Turbine x={880} scale={0.74} duration={4.6} delay={-1.4} />
            <Turbine x={1345} scale={0.6} duration={4.2} delay={-2.6} />

            {/* 海底と海底ケーブル */}
            <path
              d="M0 760 C 240 744, 480 772, 720 758 C 960 744, 1200 772, 1440 760 L1440 810 L0 810 Z"
              fill="#02101a"
            />
            <path
              className="qhv-cable"
              d="M-20 764 C 240 750, 480 776, 720 760 C 960 746, 1200 774, 1460 760"
              fill="none"
              stroke="#12a4b4"
              strokeWidth="3"
              strokeDasharray="3 12"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* 点検中の小さなAUV（水中ロボティクスQuestへの目配せ） */}
            <g className="owh-mini-auv" transform="translate(600, 690)">
              <rect x="0" y="0" width="64" height="16" rx="8" fill="#e56812" />
              <circle className="qhv-sensor" cx="56" cy="8" r="2.5" fill="#9ff5ee" />
              <rect x="-8" y="4" width="8" height="8" rx="3" fill="#0a2e3f" />
            </g>
          </svg>
          <div className="owh-target" aria-hidden="true">
            <span className="owh-target-title">政府の案件形成目標</span>
            <div className="owh-target-row">
              <i>2030年</i>
              <span className="owh-target-bar" style={{ ["--w" as string]: "26%" }} />
              <b>10GW</b>
            </div>
            <div className="owh-target-row">
              <i>2040年</i>
              <span className="owh-target-bar owh-target-bar-max" style={{ ["--w" as string]: "100%" }} />
              <b>30〜45GW</b>
            </div>
          </div>
        </div>

        <div className="qhv-content">
          <p className="qhv-kicker">Ocean Quest Family</p>
          <p className="quest-badge">洋上風力 Quest</p>
          <h1>
            海の上に、日本の電源をつくる
            <br />
            仕事。
          </h1>
          <p className="qhv-lead">
            洋上風力発電を開発する人、建てる人、守る人のためのキャリアサイトです。2030年10GW・2040年30〜45GW——国が目標を明示した数少ない成長産業で、開発・施工・O&Mの担い手はまだ圧倒的に足りていません。
          </p>
          <div className="hero-actions qhv-actions">
            <a className="primary-button" href="/diagnosis">
              3分キャリア診断をする
              <ArrowRight size={18} />
            </a>
            <a className="secondary-button light" href="/contact">
              無料でキャリア相談する
            </a>
          </div>
          <ul className="quest-points qhv-points">
            {keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <a className="qhv-scroll" href="#why-now">
          <span>SCROLL</span>
        </a>
      </section>

      <section className="section quest-sec" id="why-now" aria-label="なぜ今、洋上風力なのか">
        <SectionHead
          no="01"
          ghost="WHY NOW"
          kicker="Why Now"
          title={
            <>
              国が、<em>2040年までの導入目標</em>を宣言している。
            </>
          }
          lead="洋上風力は「政府が数字で目標を明示した」数少ない産業です。再エネ主力電源化の切り札とされる理由を、公式の数字で見てください。"
        />
        <div className="quest-stats-band rv">
          {whyNowStats.map(({ display, value, prefix, suffix, label, note }) => (
            <div className="quest-stat" key={label}>
              <b>
                {display ? (
                  <span>{display}</span>
                ) : (
                  <>
                    {prefix}
                    <span data-count={value}>0</span>
                    {suffix}
                  </>
                )}
              </b>
              <strong>{label}</strong>
              <small>{note}</small>
            </div>
          ))}
        </div>
        <div className="card-grid quest-why-grid">
          {whyNow.map(({ icon: Icon, title, body }, index) => (
            <article className="content-card rv" style={{ transitionDelay: `${index * 0.08}s` }} key={title}>
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <p className="quest-source rv">
          出典: 資源エネルギー庁「洋上風力政策について」、洋上風力産業ビジョン（第1次・2020年12月）。世界導入量見込みはIEA資料に基づく政府資料の記載より。
        </p>
      </section>

      <section className="section quest-sec quest-sec-alt" id="roles" aria-label="どんな仕事があるのか">
        <SectionHead
          no="02"
          ghost="JOB MAP"
          kicker="Job Map"
          title={
            <>
              <em>開発</em>する人、<em>建てる</em>人、<em>守る</em>人。
            </>
          }
          lead="案件の構想からファイナンス、海上工事、そして30年続く保守まで。洋上風力の主な8職種です。"
        />
        <div className="card-grid quest-role-grid">
          {roles.map(({ icon: Icon, title, body, skills }, index) => (
            <article
              className="content-card quest-role-card rv"
              style={{ transitionDelay: `${(index % 4) * 0.08}s` }}
              key={title}
            >
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

      <section className="section quest-sec" id="translate" aria-label="異業種からどうつながるか">
        <SectionHead
          no="03"
          ghost="YOUR SKILLS"
          kicker="Skill Bridge"
          title={
            <>
              あなたの経験は、海の上で<em>武器になる</em>。
            </>
          }
          lead="洋上風力は「業界経験者がほぼ存在しない」立ち上がり期の産業です。いまの仕事の経験がどこで武器になるのか、8つの入り口を用意しました。"
        />
        <div className="quest-translate-list">
          {translations.map(({ from, to, note }, index) => (
            <article
              className="quest-translate-row rv"
              style={{ transitionDelay: `${(index % 4) * 0.06}s` }}
              key={from}
            >
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

      <section className="section quest-sec quest-sec-alt" id="self-check" aria-label="セルフチェック">
        <SectionHead
          no="04"
          ghost="SELF CHECK"
          kicker="Self Check"
          title={
            <>
              まず、自分の<em>現在地</em>を知る。
            </>
          }
          lead="経歴に合わせて質問が変わる分岐型のキャリア診断です。回答から、洋上風力を含む9領域との相性と、あなたのタイプを判定します。"
        />
        <div className="sc-grid">
          <div className="sc-left rv">
            <div className="sc-road" aria-label="診断の流れ">
              <svg className="sc-road-svg" viewBox="0 0 480 238" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="scRoadG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#008b98" />
                    <stop offset=".5" stopColor="#005866" />
                    <stop offset="1" stopColor="#ff7a21" />
                  </linearGradient>
                </defs>
                <path
                  className="sc-road-bg"
                  d="M 12 30 C 160 40, 330 26, 440 48 C 486 58, 486 96, 436 108 C 340 130, 150 106, 58 122 C -8 134, -12 176, 48 192 C 120 216, 210 228, 296 232"
                />
                <path
                  className="sc-road-line"
                  style={{ stroke: "url(#scRoadG2)" }}
                  d="M 12 30 C 160 40, 330 26, 440 48 C 486 58, 486 96, 436 108 C 340 130, 150 106, 58 122 C -8 134, -12 176, 48 192 C 120 216, 210 228, 296 232"
                  pathLength={1}
                />
                <circle className="sc-road-dot" cx="296" cy="232" r="4.5" />
              </svg>
              <ol className="sc-flow">
                <li style={{ ["--fc" as string]: "#008b98" }}>
                  <span className="fno">1</span>
                  <span className="ftx">
                    <b>11問に答える</b>
                    <i>選ぶだけ・約3分。経歴の回答で次の質問が変わる分岐型</i>
                  </span>
                </li>
                <li style={{ ["--fc" as string]: "#005866" }}>
                  <span className="fno">2</span>
                  <span className="ftx">
                    <b>36タイプから判定</b>
                    <i>9領域×4職種で、あなたのタイプ名を言語化</i>
                  </span>
                </li>
                <li style={{ ["--fc" as string]: "#ff7a21" }}>
                  <span className="fno">3</span>
                  <span className="ftx">
                    <b>想定職種・年収帯・次の一手へ</b>
                    <i>強み・市場価値・おすすめ領域つきの読み物級の結果</i>
                  </span>
                </li>
              </ol>
            </div>
            <div className="sc-stats" aria-hidden="true">
              <div>
                <b>
                  <span data-count="11">0</span>問
                </b>
                <small>設問数</small>
              </div>
              <div>
                <b>
                  約<span data-count="3">0</span>分
                </b>
                <small>所要時間</small>
              </div>
              <div>
                <b>
                  <span data-count="36">0</span>タイプ
                </b>
                <small>判定結果</small>
              </div>
            </div>
            <a className="primary-button sc-cta" href="/diagnosis">
              無料でキャリア診断をはじめる
              <ArrowRight size={18} />
            </a>
            <div className="cta-pills">
              <span>無料</span>
              <span>約3分</span>
              <span>結果はその場で表示</span>
            </div>
          </div>
          <a className="sc-card rv" href="/diagnosis">
            <div className="sc-card-inner">
              <div className="sck">OCEAN QUEST SELF CHECK</div>
              <h3>
                あなたのタイプは、
                <br />
                36通りのどれか。
              </h3>
              <div className="sc-types">
                <span>エンジニア</span>
                <span>研究・R&D</span>
                <span>事業開発</span>
                <span>フィールド・現場</span>
                <span>× 9領域</span>
              </div>
              <span className="sc-card-btn">診断をはじめる →</span>
            </div>
          </a>
        </div>
      </section>

      <section className="section quest-sec" id="players" aria-label="事業者・プレイヤーマップ">
        <SectionHead
          no="05"
          ghost="PLAYERS"
          kicker="Player Map"
          title={
            <>
              この産業を動かしている<em>プレイヤー</em>たち。
            </>
          }
          lead="事業者からメーカー、建設、官公庁まで。洋上風力の見取り図です（社名は代表例で、網羅ではありません）。"
        />
        <div className="card-grid quest-player-grid">
          {players.map(({ icon: Icon, category, body, orgs }, index) => (
            <article className="content-card rv" style={{ transitionDelay: `${index * 0.08}s` }} key={category}>
              <div className="card-icon">
                <Icon size={22} />
              </div>
              <h3>{category}</h3>
              <p>{body}</p>
              <div className="quest-player-links">
                {orgs.map(({ name, url }) => (
                  <a href={url} target="_blank" rel="noopener noreferrer" key={name}>
                    {name}
                    <ArrowUpRight size={13} />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section quest-sec quest-sec-alt" id="blog" aria-label="ブログ・コンテンツ">
        <SectionHead
          no="06"
          ghost="BLOG"
          kicker="Blog & Contents"
          title={
            <>
              海洋産業の<em>現実</em>から読む。
            </>
          }
          lead="業界理解に役立つ最新の記事とコンテンツです。転職を考える前の情報収集から使ってください。"
        />
        {notes.length > 0 ? (
          <div className="quest-blog-grid">
            {notes.map((note, index) => (
              <a
                className="quest-blog-card rv"
                style={{ transitionDelay: `${index * 0.08}s` }}
                href={note.source_url}
                target="_blank"
                rel="noreferrer"
                key={note.id}
              >
                <div className="quest-blog-thumb">
                  {note.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={note.thumbnail_url} alt="" loading="lazy" />
                  ) : (
                    <FileText size={30} />
                  )}
                </div>
                <div className="quest-blog-body">
                  <time dateTime={note.published_at ?? note.created_at}>
                    {formatDate(note.published_at ?? note.created_at)}
                  </time>
                  <h3>{note.title}</h3>
                  <span className="quest-blog-more">
                    読む
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : null}
        <div className="quest-content-links rv">
          <a className="text-link" href="/notes">
            note記事一覧
            <ArrowRight size={16} />
          </a>
          <a className="text-link" href="/videos">
            動画で学ぶ海洋産業
            <ArrowRight size={16} />
          </a>
          <a className="text-link" href="/ebooks">
            eBook（無料DL）
            <ArrowRight size={16} />
          </a>
          <a className="text-link" href="/robotics">
            水中ロボティクスQuest
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="section quest-sec" aria-label="よくある質問">
        <SectionHead no="07" ghost="FAQ" kicker="FAQ" title={<>よくある質問</>} />
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

      <section className="section quest-sec quest-dive quest-size" aria-label="風車はどこまで大きくなるのか">
        <div className="quest-dive-head rv">
          <div className="quest-ghost" aria-hidden="true">
            HOW BIG?
          </div>
          <p className="quest-kicker">Super Size</p>
          <h2>
            風車は、どこまで<em>大きく</em>なるのか。
          </h2>
          <p className="quest-lead">
            洋上風車は10年ごとに倍近く大きくなってきました。次世代の15〜20MW級は回転域の高さ約250m——東京タワーに迫るサイズの機械が、海の上で回ります。これを建てて、30年守り続けるのが、この産業の仕事です。
          </p>
        </div>
        <div className="qsize-chart rv" role="img" aria-label="風車の大きさ比較チャート">
          {[
            { h: 90, label: "2010年・3MW", sub: "90m", cls: "" },
            { h: 151, label: "2013年・6MW", sub: "151m", cls: "" },
            { h: 174, label: "2019年・10MW", sub: "174m", cls: "" },
            { h: 250, label: "2030年・15〜20MW", sub: "約230〜250m", cls: "qsize-next" },
            { h: 333, label: "東京タワー", sub: "333m", cls: "qsize-tower" },
          ].map(({ h, label, sub, cls }, index) => (
            <div className={`qsize-col ${cls}`} key={label}>
              <span
                className="qsize-fill"
                style={{
                  ["--h" as string]: `${(h / 333) * 100}%`,
                  ["--delay" as string]: `${index * 0.16}s`,
                }}
              >
                <em>{sub}</em>
              </span>
              <span className="qsize-label">
                <b>{label}</b>
              </span>
            </div>
          ))}
        </div>
        <p className="qdive-note rv">
          ※ 高さは実寸比の目安（資源エネルギー庁資料の風車大型化の推移より）。東京タワーより少し低いだけの機械を、船で運んで海に建てる——スケールの大きさも、この仕事の魅力です。
        </p>
      </section>

      <section className="section quest-cta" aria-label="相談する">
        <div className="quest-cta-grid">
          <article className="quest-cta-card rv">
            <p className="section-kicker">For Candidates</p>
            <h2>キャリアの話を、まずは気軽に。</h2>
            <p>
              「今の経験で通用する？」「どの職種から入るべき？」——洋上風力への転身を、海洋産業特化のキャリアパートナーが無料で相談に乗ります。
            </p>
            <a className="primary-button" href="/contact">
              無料キャリア相談をする
              <ArrowRight size={18} />
            </a>
          </article>
          <article className="quest-cta-card rv" style={{ transitionDelay: "0.1s" }}>
            <p className="section-kicker">For Companies</p>
            <h2>洋上風力の採用を支援します。</h2>
            <p>
              施工管理・O&M・開発などの人材採用を、隣接業界からの「経験の翻訳」を軸に設計します。採用戦略からスカウト・広報まで。
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
              name: "洋上風力Quest | 洋上風力発電の転職・キャリア",
              url: "https://ocean-quest.jp/offshore-wind",
              inLanguage: "ja",
              isPartOf: { "@id": "https://ocean-quest.jp/#website" },
              about: [
                { "@type": "Thing", name: "洋上風力発電" },
                { "@type": "Thing", name: "浮体式洋上風力" },
                { "@type": "Thing", name: "風力発電のO&M（運転保守）" },
                { "@type": "Thing", name: "再エネ海域利用法" },
              ],
            },
          ]),
        }}
      />

      <SiteFooter />
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
