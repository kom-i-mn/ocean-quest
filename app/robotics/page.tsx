import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Building2,
  Compass,
  Cpu,
  FileText,
  FlaskConical,
  GraduationCap,
  Landmark,
  Radar,
  ShieldAlert,
  TrendingUp,
  Waves,
  WifiOff,
  Wrench,
  Zap,
} from "lucide-react";
import { QuestFx } from "@/components/QuestFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { listNoteContents } from "@/lib/supabase";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "水中ロボティクスQuest | ROV・AUV・水中ドローンの転職・キャリア | Ocean Quest",
  description:
    "水中ロボティクス（ROV・AUV・水中ドローン）専門のキャリアサイト。洋上風力・海底ケーブル・防衛で拡大する市場背景、職種マップ、自動車・ドローン・組込みなど異業種経験の活かし方、企業・研究機関マップまで。無料キャリア診断・相談つき。",
  path: "/robotics",
});

const keyPoints = [
  "水中ロボティクス（ROV・AUV）は、洋上風力・海底ケーブル・防衛の需要拡大でエンジニア採用が活発化している成長領域です。",
  "自動車・ドローン・FA・組込みなど隣接分野の経験は、水中ロボット開発にそのまま翻訳できるスキルが多くあります。",
  "Ocean Questのキャリア診断で、水中ロボティクス領域との適性・想定職種・想定年収帯を無料で確認できます。",
];

// 出典: 内閣府「自律型無人探査機(AUV)の社会実装に向けた戦略」、
// AUV官民プラットフォーム第3回全体会議 資料2-2「AUV等海洋ロボティクス導入の効果」(2026年2月)
const whyNowStats = [
  {
    value: 90,
    prefix: "約",
    suffix: "%",
    label: "点検の人手を削減",
    note: "洋上風力の日常点検。有人船＋ROV体制（736h・人/日）をAUVが75h・人/日に",
  },
  {
    value: 81,
    prefix: "約",
    suffix: "%",
    label: "点検コストを削減",
    note: "1日あたり1,425万円 → 270万円（政府試算）",
  },
  {
    value: 200,
    prefix: "水深",
    suffix: "m",
    label: "人が潜れない現場",
    note: "浮体式洋上風力の海底部はダイバー作業不可。届くのはロボットだけ",
  },
  {
    value: 2030,
    prefix: "",
    suffix: "年",
    label: "国のAUV産業化目標",
    note: "内閣府「AUV戦略」。国主導・官民連携で産業育成、海外展開まで",
    static: true,
  },
];

const whyNow = [
  {
    icon: Waves,
    title: "「人が潜れない海」が、どんどん増えている",
    body: "浮体式洋上風力の現場は水深200m級。ダイバーが作業できるのは水深20m・1回1時間が限度で、錨鎖・アンカーや海底ケーブルの点検はそもそも人には不可能です。洋上風力は2030年10GW・2040年30〜45GWの政府目標で拡大が続き、「ロボットにしか点検できない海」が構造的に増え続けます。",
  },
  {
    icon: WifiOff,
    title: "海中は電波が届かない。だから「自律」が唯一解",
    body: "海の中ではGPSも無線も使えません。遠隔操作のROVはテザーケーブルと母船・船上要員が必須で、深く広い海域では取り回しに限界があります。ケーブルなしで自ら判断して動けるAUVだけが、広大な海の無人点検を成立させられる——AUVが「あれば便利」ではなく「ないと成り立たない」理由です。",
  },
  {
    icon: Bot,
    title: "現場29人の仕事が、ほぼ無人になる",
    body: "政府試算では、風車5基の日常点検に有人船3隻・現場29人が必要だった体制が、AUV活用で現場ほぼ無人・中央制御室の少数チームに置き換わります（現場作業696h・人/日→3h・人/日）。この転換を実際につくるのが、機体・自律化・遠隔監視システムを担うエンジニアです。",
  },
  {
    icon: ShieldAlert,
    title: "危険な潜水作業と担い手不足を、同時に解決する",
    body: "潜水作業は減圧症などのリスクと常に隣り合わせで、潜水士や船員の担い手は減り続けています。荒天の海では船を出すこと自体が危険。無人化は効率化の話であると同時に「人を危険な海に出さない」ための技術です。少子高齢化が進む日本にとって、AUVは選択肢ではなく必然です。",
  },
  {
    icon: Landmark,
    title: "国家戦略の柱に「人材育成」が明記されている",
    body: "内閣府のAUV戦略は、利用実証・標準化・制度整備と並んで「人材育成」を6本柱の1つに掲げています。実証も既に動いており、内閣府事業ではAUVによる浮体式洋上風力（水中部）の全自動周回点検に世界で初めて成功。足りないのは技術より、担う人です。",
  },
  {
    icon: TrendingUp,
    title: "洋上風力だけではない。用途は9分野に広がる",
    body: "AUV戦略が挙げる利用分野は、海洋資源開発、洋上風力発電、海洋観測・監視、科学調査・研究、海洋環境保全、防災・減災、海洋安全保障など多岐にわたります。国際通信を支える海底ケーブルの敷設・保守・監視も含め、1つのスキルセットが複数の成長市場につながる領域です。",
  },
];

const whyNowRoadmap = [
  {
    period: "現在",
    title: "ダイバー＋一部ROV",
    body: "人が潜れる範囲しか点検できない",
  },
  {
    period: "2030年頃",
    title: "人＋海洋ロボット",
    body: "有人船＋ROVの遠隔操作が主役に",
  },
  {
    period: "2040年頃",
    title: "AUVによる省人化",
    body: "現場無人化・完全自動点検へ",
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
    body: "潜水艦・深海探査機で培った技術を持つ重工各社と、ソナー・音響機器のメーカーが、AUV・水中音響の中核を担っています。",
    orgs: [
      { name: "三菱重工業", url: "https://www.mhi.com/jp" },
      { name: "川崎重工業", url: "https://www.khi.co.jp/" },
      { name: "IHI", url: "https://www.ihi.co.jp/" },
      { name: "NEC", url: "https://jpn.nec.com/" },
      { name: "OKI", url: "https://www.oki.com/jp/" },
      { name: "古野電気", url: "https://www.furuno.co.jp/" },
    ],
  },
  {
    icon: Bot,
    category: "スタートアップ",
    body: "産業用水中ドローンのFullDepthをはじめ、点検・調査サービスや機体開発のスタートアップが登場。海外では専業メーカーが大きな市場を築いており、日本はこれからが本番です。",
    orgs: [
      { name: "FullDepth", url: "https://fulldepth.co.jp/" },
      { name: "Saab Seaeye（英）", url: "https://www.saabseaeye.com/" },
      { name: "Kongsberg（ノルウェー）", url: "https://www.kongsberg.com/" },
    ],
  },
  {
    icon: FlaskConical,
    category: "研究機関",
    body: "JAMSTECは「うらしま」など自律型探査機の開発・運用で世界的な実績を持ちます。船舶・港湾・要素技術の研究拠点も揃っています。",
    orgs: [
      { name: "JAMSTEC（海洋研究開発機構）", url: "https://www.jamstec.go.jp/" },
      { name: "海上技術安全研究所", url: "https://www.nmri.go.jp/" },
      { name: "港湾空港技術研究所", url: "https://www.pari.go.jp/" },
      { name: "産業技術総合研究所", url: "https://www.aist.go.jp/" },
    ],
  },
  {
    icon: GraduationCap,
    category: "大学・官公庁",
    body: "水中ロボットの研究・人材輩出拠点となる大学と、需要側として市場を牽引する官公庁です。",
    orgs: [
      { name: "東京大学生産技術研究所", url: "https://www.iis.u-tokyo.ac.jp/" },
      { name: "東京海洋大学", url: "https://www.kaiyodai.ac.jp/" },
      { name: "九州工業大学", url: "https://www.kyutech.ac.jp/" },
      { name: "内閣府（海洋政策）", url: "https://www8.cao.go.jp/ocean/" },
      { name: "海上保安庁", url: "https://www.kaiho.mlit.go.jp/" },
      { name: "防衛装備庁", url: "https://www.mod.go.jp/atla/" },
      { name: "水産庁", url: "https://www.jfa.maff.go.jp/" },
    ],
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

// ゴーストが長文でも画面からはみ出さないよう、文字数に応じた上限を font-size にかける。
// 幅 ≈ 文字数 × font-size × 1.06(letter-spacing分)。見出しの左オフセット分として100pxを差し引く。
// ただし40px未満には縮めない(小さすぎると透かしの意味がない)。その場合は右端で
// 自然に切れる(.quest-page の overflow-x: clip が横スクロールを防ぐ)
function ghostFontSize(ghost: string) {
  const perChar = (ghost.length * 1.06).toFixed(2);
  return `min(clamp(40px, 7.5vw, 84px), max(40px, calc((100vw - 100px) / ${perChar})))`;
}

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
      <div
        className="quest-ghost"
        style={{ fontSize: ghostFontSize(ghost) }}
        aria-hidden="true"
      >
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

export default async function RoboticsQuestPage() {
  const notes = await listNoteContents(3).catch(() => []);

  return (
    <main className="subpage-shell subpage-bg-deep-wreck quest-page">
      <SiteHeader solid />
      <QuestFx />

      <section className="quest-hero-v2" aria-label="水中ロボティクスQuest">
        <div className="qhv-scene" aria-hidden="true">
          <div className="qhv-rays" />
          <div className="qhv-particles" />
          <svg className="qhv-svg" viewBox="0 0 1440 810" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="qhvHull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffa15c" />
                <stop offset="0.55" stopColor="#e56812" />
                <stop offset="1" stopColor="#b34e0c" />
              </linearGradient>
              <linearGradient id="qhvBeam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="rgba(255, 236, 190, 0.5)" />
                <stop offset="1" stopColor="rgba(255, 236, 190, 0)" />
              </linearGradient>
              <linearGradient id="qhvScan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(143, 227, 221, 0.45)" />
                <stop offset="1" stopColor="rgba(143, 227, 221, 0)" />
              </linearGradient>
            </defs>

            {/* AUVの巡航ルート */}
            <path
              className="qhv-route"
              d="M-40 400 C 300 375, 620 435, 940 405 C 1160 385, 1320 410, 1480 395"
              fill="none"
              stroke="rgba(143, 227, 221, 0.3)"
              strokeWidth="2"
              strokeDasharray="1 16"
              strokeLinecap="round"
            />

            {/* 海底と海底ケーブル */}
            <path
              d="M0 690 C 200 668, 380 712, 560 696 C 760 678, 900 724, 1090 704 C 1240 690, 1340 708, 1440 698 L1440 810 L0 810 Z"
              fill="#04141f"
            />
            <path
              className="qhv-cable"
              d="M-20 710 C 240 692, 480 726, 720 708 C 960 690, 1200 722, 1460 704"
              fill="none"
              stroke="#12a4b4"
              strokeWidth="3"
              strokeDasharray="3 12"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M0 748 C 260 730, 520 764, 780 748 C 1040 732, 1240 762, 1440 750 L1440 810 L0 810 Z"
              fill="#020d15"
            />

            {/* AUV本体 */}
            <g className="qhv-auv" transform="translate(880, 320)">
              <path className="qhv-scan" d="M150 76 L40 400 L300 400 Z" fill="url(#qhvScan)" />
              <path d="M300 26 L560 120 L470 216 L300 66 Z" fill="url(#qhvBeam)" opacity="0.55" />
              <g className="qhv-ping-group">
                <circle className="qhv-ping" cx="126" cy="-24" r="16" fill="none" stroke="rgba(143,227,221,0.8)" strokeWidth="2" />
                <circle className="qhv-ping qhv-ping-2" cx="126" cy="-24" r="16" fill="none" stroke="rgba(143,227,221,0.8)" strokeWidth="2" />
                <circle className="qhv-ping qhv-ping-3" cx="126" cy="-24" r="16" fill="none" stroke="rgba(143,227,221,0.8)" strokeWidth="2" />
              </g>
              <rect x="118" y="-20" width="10" height="36" rx="5" fill="#0a2e3f" />
              <circle className="qhv-beacon" cx="123" cy="-24" r="5" fill="#8fe3dd" />
              <path d="M70 8 L30 -16 L52 12 Z" fill="#0a2e3f" />
              <path d="M70 76 L30 100 L52 72 Z" fill="#0a2e3f" />
              <rect x="46" y="10" width="256" height="64" rx="32" fill="url(#qhvHull)" />
              <ellipse cx="174" cy="66" rx="110" ry="9" fill="rgba(0, 0, 0, 0.22)" />
              <rect x="258" y="18" width="26" height="48" rx="13" fill="#06222e" />
              <circle className="qhv-sensor" cx="271" cy="42" r="6" fill="#9ff5ee" />
              <circle cx="40" cy="42" r="27" fill="none" stroke="#0a2e3f" strokeWidth="9" />
              <g className="qhv-prop">
                <rect x="36" y="20" width="8" height="44" rx="4" fill="#8fe3dd" />
                <rect x="18" y="38" width="44" height="8" rx="4" fill="#8fe3dd" />
              </g>
              <circle className="qhv-bubble" cx="4" cy="36" r="4" fill="rgba(255,255,255,0.4)" />
              <circle className="qhv-bubble qhv-bubble-2" cx="-6" cy="48" r="3" fill="rgba(255,255,255,0.35)" />
              <circle className="qhv-bubble qhv-bubble-3" cx="-14" cy="40" r="2.5" fill="rgba(255,255,255,0.3)" />
            </g>
          </svg>
          <div className="qhv-depth">
            <span className="qhv-depth-mark" style={{ ["--d" as string]: "6%" }}>
              <i>0m</i>
            </span>
            <span className="qhv-depth-mark qhv-depth-diver" style={{ ["--d" as string]: "24%" }}>
              <i>-20m</i>
              <em>ダイバーの限界</em>
            </span>
            <span className="qhv-depth-mark" style={{ ["--d" as string]: "56%" }}>
              <i>-100m</i>
            </span>
            <span className="qhv-depth-mark qhv-depth-auv" style={{ ["--d" as string]: "88%" }}>
              <i>-200m</i>
              <em>AUVの現場</em>
            </span>
          </div>
        </div>

        <div className="qhv-content">
          <p className="qhv-kicker">Ocean Quest Family</p>
          <p className="quest-badge">水中ロボティクス Quest</p>
          <h1>
            海の中で動くロボットを、
            <br />
            仕事にする。
          </h1>
          <p className="qhv-lead">
            ROV・AUV・水中ドローンをつくる人、動かす人、事業にする人のためのキャリアサイトです。洋上風力・海底ケーブル・防衛・海洋調査——「人が潜らない海」への転換を担うエンジニアと仲間を、この領域につなぎます。
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

      <section className="section quest-sec" id="why-now" aria-label="なぜ今、水中ロボティクスなのか">
        <SectionHead
          no="01"
          ghost="なぜ、今、水中ロボティクスが重要なのか"
          kicker="Why Now"
          title={
            <>
              国が、<em>2030年までのAUV産業化</em>を宣言している。
            </>
          }
          lead="内閣府は「AUVの社会実装に向けた戦略」を掲げ、官民プラットフォームで産業育成を進めています。その公式試算が示すインパクトを、まず数字で見てください。"
        />
        <div className="quest-stats-band rv">
          {whyNowStats.map(({ value, prefix, suffix, label, note, static: isStatic }) => (
            <div className="quest-stat" key={label}>
              <b>
                {prefix}
                {isStatic ? <span>{value}</span> : <span data-count={value}>0</span>}
                {suffix}
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
        <div className="quest-roadmap rv" aria-label="海洋ロボティクス導入の道筋">
          {whyNowRoadmap.map(({ period, title, body }, index) => (
            <div className="quest-roadmap-step" key={period}>
              <span className="quest-roadmap-period">{period}</span>
              <b>{title}</b>
              <small>{body}</small>
              {index < whyNowRoadmap.length - 1 ? (
                <span className="quest-roadmap-arrow" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <p className="quest-source rv">
          出典: 内閣府「自律型無人探査機（AUV）の社会実装に向けた戦略」、AUV官民プラットフォーム「AUV等海洋ロボティクス導入の効果」（2026年2月）。削減率等は一定の条件設定に基づく政府試算の目安です。
        </p>
      </section>

      <section className="section quest-sec quest-sec-alt" id="roles" aria-label="どんな仕事があるのか">
        <SectionHead
          no="02"
          ghost="水中ロボティクスの仕事"
          kicker="Job Map"
          title={
            <>
              機体を<em>つくる</em>人、海で<em>動かす</em>人、事業に<em>する</em>人。
            </>
          }
          lead="開発職から現場職、企画職まで。水中ロボティクスの主な8職種と、それぞれに必要なスキルです。"
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
          ghost="こんな経験が活きる"
          kicker="Skill Bridge"
          title={
            <>
              あなたの経験は、海で<em>武器になる</em>。
            </>
          }
          lead="水中ロボティクスは「海の経験者」より「隣接分野の経験者」でできている領域です。いまの仕事の経験がどこで武器になるのか、8つの入り口を用意しました。"
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
          ghost="キャリア診断"
          kicker="Self Check"
          title={
            <>
              まず、自分の<em>現在地</em>を知る。
            </>
          }
          lead="経歴に合わせて質問が変わる分岐型のキャリア診断です。回答から、水中ロボティクスを含む9領域との相性と、あなたのタイプを判定します。"
        />
        <div className="sc-grid">
          <div className="sc-left rv">
            <div className="sc-road" aria-label="診断の流れ">
              <svg className="sc-road-svg" viewBox="0 0 480 238" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="scRoadG" x1="0" y1="0" x2="0" y2="1">
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

      <section className="section quest-sec" id="players" aria-label="企業・プレイヤーマップ">
        <SectionHead
          no="05"
          ghost="企業と研究機関"
          kicker="Player Map"
          title={
            <>
              この領域を動かしている<em>プレイヤー</em>たち。
            </>
          }
          lead="大手からスタートアップ、研究機関まで。水中ロボティクスの見取り図です（社名は代表例で、網羅ではありません）。"
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
          ghost="ブログ"
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
          <a className="text-link" href="/map">
            海の地図（β）
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="section quest-sec" aria-label="よくある質問">
        <SectionHead no="07" ghost="よくある質問" kicker="FAQ" title={<>よくある質問</>} />
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

      <section className="section quest-sec quest-dive" aria-label="ロボットはどこまで潜れるのか">
        <div className="quest-dive-head rv">
          <div
            className="quest-ghost"
            style={{ fontSize: ghostFontSize("どこまで潜れるのか") }}
            aria-hidden="true"
          >
            どこまで潜れるのか
          </div>
          <p className="quest-kicker">Deep Dive</p>
          <h2>
            ロボットは、どこまで<em>深く</em>潜れるのか。
          </h2>
          <p className="quest-lead">
            日本のAUVの潜航能力は8,000m級。富士山を逆さに沈めても半分にも届かず、エベレストを沈めてもまだ余裕があります。地球でいちばん深い海の底、チャレンジャー海淵（約10,920m）には、日本のROV「かいこう」が1995年に到達済み——人類より先に、ロボットが海の最深部を知っています。
          </p>
        </div>
        <div className="qdive-chart rv" role="img" aria-label="潜航深度の比較チャート">
          {[
            { depth: 20, label: "ダイバー", sub: "日常的な作業潜水", cls: "qdive-diver" },
            { depth: 3776, label: "富士山（逆さ）", sub: "3,776m", cls: "qdive-fuji" },
            { depth: 6500, label: "しんかい6500", sub: "有人潜水調査船（日本）", cls: "qdive-shinkai" },
            { depth: 8000, label: "日本のAUV", sub: "8,000m級（JAMSTEC）", cls: "qdive-auv" },
            { depth: 8849, label: "エベレスト（逆さ）", sub: "8,849m", cls: "qdive-everest" },
            {
              depth: 10920,
              label: "チャレンジャー海淵",
              sub: "地球最深部 約10,920m",
              cls: "qdive-deepest",
            },
          ].map(({ depth, label, sub, cls }, index) => (
            <div className={`qdive-col ${cls}`} key={label}>
              <span className="qdive-label">
                <b>{label}</b>
                <i>{sub}</i>
              </span>
              <span
                className="qdive-fill"
                style={{
                  ["--h" as string]: `${(depth / 10920) * 100}%`,
                  ["--delay" as string]: `${index * 0.16}s`,
                }}
              >
                <em>-{depth.toLocaleString()}m</em>
              </span>
            </div>
          ))}
        </div>
        <p className="qdive-note rv">
          ※ 深さは実寸比。ダイバーのバーが見えないのは、間違いではありません。それくらい、海は深い——だからロボットの出番です。
        </p>
      </section>

      <section className="section quest-cta" aria-label="相談する">
        <div className="quest-cta-grid">
          <article className="quest-cta-card rv">
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
          <article className="quest-cta-card rv" style={{ transitionDelay: "0.1s" }}>
            <p className="section-kicker">For Companies</p>
            <h2>水中ロボティクスの採用を支援します。</h2>
            <p>
              制御・組込み・機械設計などの希少人材採用を、「隣接業界の経験を武器に変える」発想で設計します。採用戦略からスカウト・広報まで。
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
