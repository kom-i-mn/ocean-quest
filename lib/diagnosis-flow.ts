import { diagnosisAreaKeys, diagnosisResults, type DiagnosisAreaKey } from "./content";

// ---------------------------------------------------------------------------
// 診断v4: 分岐型フロー
// 回答者の経歴によって深掘り質問が変わる。全員が通る質問数は11問で固定
// (プロフィール3問 → 経歴別ブロック2問 → 共通6問)。
// スコアは「領域(9)」と「職種タイプ(4)」の2軸で加点し、
// 領域×職種タイプのマトリクスから具体的な想定職種・年収帯を提示する。
// ---------------------------------------------------------------------------

export const roleKeys = ["engineer", "research", "bizdev", "field"] as const;
export type RoleKey = (typeof roleKeys)[number];

export const roleLabels: Record<RoleKey, string> = {
  engineer: "開発・エンジニア型",
  research: "データ・研究型",
  bizdev: "事業開発・企画型",
  field: "現場・プロジェクト型",
};

type ProfileKey = "age" | "salaryNow" | "salaryHope";

export type FlowOption = {
  label: string;
  weights?: Partial<Record<DiagnosisAreaKey, number>>;
  roleWeights?: Partial<Record<RoleKey, number>>;
  /** 分岐: この選択肢を選んだときの次の質問id (未指定なら質問側のnext) */
  next?: string;
  /** 結果画面「あなたの回答への解説」に出す個別コメント */
  insight?: string;
};

export type FlowQuestion = {
  id: string;
  question: string;
  hint?: string;
  profileKey?: ProfileKey;
  options: FlowOption[];
  /** 既定の次の質問id。null相当(省略かつ選択肢にもnextなし)で診断終了 */
  next?: string;
};

export const flowStartId = "age";
export const flowTotalSteps = 11;

export const flowQuestions: FlowQuestion[] = [
  // --- プロフィール ---
  {
    id: "age",
    question: "あなたの年齢層を教えてください",
    profileKey: "age",
    next: "salary_now",
    options: [
      { label: "24歳以下" },
      { label: "25〜29歳" },
      { label: "30〜34歳" },
      { label: "35〜44歳" },
      { label: "45歳以上" },
    ],
  },
  {
    id: "salary_now",
    question: "現在の年収帯を教えてください",
    profileKey: "salaryNow",
    next: "background",
    options: [
      { label: "〜400万円" },
      { label: "400〜600万円" },
      { label: "600〜800万円" },
      { label: "800〜1,000万円" },
      { label: "1,000万円以上" },
    ],
  },
  {
    id: "background",
    question: "これまでのキャリアに一番近いのは？",
    hint: "この回答で、次からの質問があなた向けに変わります",
    options: [
      {
        label: "機械・電気・制御・組込みなどのハードウェアエンジニア",
        roleWeights: { engineer: 3 },
        weights: { robotics: 2, shipDx: 1 },
        next: "eng_domain",
        insight:
          "ハードウェア人材は海洋産業全域で最も採用ニーズが強い層です。陸上で培った技術の「翻訳先」が最も多いタイプで、未経験でも書類が通りやすい傾向があります。",
      },
      {
        label: "ソフトウェア・データ・AI関連のエンジニア/分析職",
        roleWeights: { engineer: 1, research: 2 },
        weights: { data: 2, robotics: 1 },
        next: "soft_domain",
        insight:
          "海洋産業はデータ・ソフトウェア人材が慢性的に不足しています。異業種からの参入でも「海×デジタル」の掛け算で一気に希少人材になれます。",
      },
      {
        label: "営業・事業開発・企画・コンサルタント",
        roleWeights: { bizdev: 3 },
        weights: { offshoreWind: 1, portDx: 1 },
        next: "biz_phase",
        insight:
          "洋上風力をはじめ市場の立ち上げ期にある海洋産業では、技術と社会をつなぐビジネス人材の需要が急増しています。業界未経験の中途採用が主流の領域です。",
      },
      {
        label: "施工管理・工場・物流・設備などの現場系",
        roleWeights: { field: 3 },
        weights: { infrastructure: 1, portDx: 1 },
        next: "field_type",
        insight:
          "現場を回せる人材は洋上風力・海洋土木・港湾で引く手あまたです。安全管理や工程管理の経験は、海の現場でそのまま武器になります。",
      },
      {
        label: "研究職・アカデミア（バイオ・化学・地球科学など）",
        roleWeights: { research: 3 },
        weights: { bio: 1, data: 1 },
        next: "research_field",
        insight:
          "研究バックグラウンドは海洋バイオ・海洋データ領域への最短ルートです。研究を事業化できる人材はさらに希少で、スタートアップからの需要が高まっています。",
      },
      {
        label: "学生・第二新卒・異業種からのキャリアチェンジ検討中",
        next: "fresh_interest",
        insight:
          "海洋産業は今が参入の好機です。洋上風力や海洋テックの拡大で、未経験者の入口となる職種・研修制度が増え始めています。",
      },
    ],
  },

  // --- 分岐: ハードウェアエンジニア ---
  {
    id: "eng_domain",
    question: "一番自信のある技術領域は？",
    next: "eng_moment",
    options: [
      {
        label: "組込み・制御・メカトロニクス",
        weights: { robotics: 3, shipDx: 1 },
        roleWeights: { engineer: 2 },
        insight:
          "組込み・制御は水中ロボットの中核技術です。AUV/ROVメーカーが最も欲しがるスキルセットで、ドローンや自動運転からの転身事例も出ています。",
      },
      {
        label: "機構・構造・筐体設計",
        weights: { robotics: 2, shipDx: 2, offshoreWind: 1 },
        roleWeights: { engineer: 2 },
        insight:
          "耐圧・防水という海洋特有の制約は機構設計者の腕の見せどころです。造船・浮体構造まで含めると活躍の幅はさらに広がります。",
      },
      {
        label: "電気電子・回路・センサー",
        weights: { robotics: 2, data: 1, defense: 1 },
        roleWeights: { engineer: 2 },
        insight:
          "水中では電波が使えないため、音響・光・センサー技術の価値が陸上より高くなります。観測機器や防衛系まで選択肢が広い専門性です。",
      },
      {
        label: "動力・油圧・エンジン・プラント",
        weights: { shipDx: 2, offshoreWind: 2, resources: 1 },
        roleWeights: { engineer: 2 },
        insight:
          "舶用エンジン・洋上プラントは日本が強みを持つ分野です。脱炭素燃料への転換期で、動力系エンジニアの需要が再燃しています。",
      },
      {
        label: "生産技術・品質・製造プロセス",
        weights: { shipDx: 3, portDx: 1 },
        roleWeights: { engineer: 1, field: 1 },
        insight:
          "造船は「世界最大級の一品モノ生産」。自動車や電機で磨いた生産技術・品質管理は、造船DXの文脈で高く評価されます。",
      },
      {
        label: "土木・建築・構造計算",
        weights: { infrastructure: 3, offshoreWind: 2 },
        roleWeights: { engineer: 1, field: 1 },
        insight:
          "洋上風力の基礎・海洋土木は建設系エンジニアの新天地です。港湾・沿岸構造物の設計経験はほぼそのまま通用します。",
      },
    ],
  },
  {
    id: "eng_moment",
    question: "エンジニアとして一番燃える瞬間は？",
    next: "interest",
    options: [
      {
        label: "誰も解いたことのない技術制約を突破したとき",
        weights: { robotics: 2, data: 1 },
        roleWeights: { engineer: 1 },
      },
      {
        label: "巨大な構造物・システムが計画通りに動いたとき",
        weights: { offshoreWind: 2, shipDx: 1, infrastructure: 1 },
      },
      {
        label: "現場・フィールドでの実証試験がうまくいったとき",
        weights: { robotics: 1, data: 1, offshoreWind: 1 },
        roleWeights: { field: 1 },
      },
      {
        label: "生産性や品質が目に見えて改善したとき",
        weights: { shipDx: 2, portDx: 2 },
        roleWeights: { field: 1 },
      },
      {
        label: "社会インフラの安定稼働を支えられているとき",
        weights: { infrastructure: 2, defense: 1 },
        roleWeights: { field: 1 },
      },
    ],
  },

  // --- 分岐: ソフトウェア・データ ---
  {
    id: "soft_domain",
    question: "得意・関心が近い技術は？",
    next: "soft_goal",
    options: [
      {
        label: "データ分析・機械学習・AI",
        weights: { data: 3 },
        roleWeights: { research: 2 },
        insight:
          "海洋は「地球最後の未計測領域」と呼ばれ、データサイエンスの応用余地が膨大です。海洋データを扱える分析者は国内にほとんどいません。",
      },
      {
        label: "画像・音響・信号処理",
        weights: { robotics: 2, data: 2, defense: 1 },
        roleWeights: { engineer: 1, research: 1 },
        insight:
          "水中では音響が「目」になります。ソナー・音響信号処理の素養は、探査・防衛・資源調査まで通用する希少スキルです。",
      },
      {
        label: "IoT・組込みソフト・エッジコンピューティング",
        weights: { robotics: 2, shipDx: 1 },
        roleWeights: { engineer: 2 },
        insight:
          "通信が制限される海では、エッジ側の賢さが勝負を決めます。IoT・組込みの経験は水中ロボットやスマートブイの開発に直結します。",
      },
      {
        label: "業務システム・SaaS・Webアプリケーション",
        weights: { portDx: 2, shipDx: 2 },
        roleWeights: { engineer: 1, bizdev: 1 },
        insight:
          "海運・造船・港湾はいまDXの真っ最中です。紙とFAXが残る業界だからこそ、Web/SaaS開発の経験がダイレクトに価値を生みます。",
      },
      {
        label: "GIS・シミュレーション・数値解析",
        weights: { data: 2, offshoreWind: 1, resources: 1 },
        roleWeights: { research: 2 },
        insight:
          "風況・海象シミュレーションや海底地形解析は、洋上風力・資源開発の意思決定の心臓部です。地理空間データの素養が活きます。",
      },
    ],
  },
  {
    id: "soft_goal",
    question: "ソフトウェアやデータで、一番やってみたいのは？",
    next: "interest",
    options: [
      {
        label: "海というアナログな世界を丸ごとデジタル化する",
        weights: { data: 2, portDx: 1 },
        roleWeights: { research: 1 },
      },
      {
        label: "無人機・自律システムの「頭脳」をつくる",
        weights: { robotics: 3, defense: 1 },
        roleWeights: { engineer: 2 },
      },
      {
        label: "伝統産業の現場業務をDXで効率化する",
        weights: { shipDx: 2, portDx: 2 },
        roleWeights: { bizdev: 1 },
      },
      {
        label: "観測データから新しい発見・予測を生み出す",
        weights: { data: 2, bio: 1, resources: 1 },
        roleWeights: { research: 2 },
      },
      {
        label: "海の安全を守る監視・防衛システムを支える",
        weights: { defense: 3, data: 1 },
        roleWeights: { engineer: 1 },
      },
    ],
  },

  // --- 分岐: ビジネス ---
  {
    id: "biz_phase",
    question: "一番得意・やってみたいのはどのフェーズ？",
    next: "biz_scale",
    options: [
      {
        label: "0→1の事業立ち上げ・新規市場の開拓",
        weights: { robotics: 1, bio: 1, offshoreWind: 1 },
        roleWeights: { bizdev: 2 },
        insight:
          "海洋産業は0→1フェーズの宝庫です。水中ドローン・ブルーフード・海洋データなど、事業の立ち上げ手が足りていない市場が並んでいます。",
      },
      {
        label: "官公庁・自治体・地域との合意形成や渉外",
        weights: { offshoreWind: 2, defense: 1, resources: 1 },
        roleWeights: { bizdev: 2 },
        insight:
          "洋上風力は「地域との合意形成」が事業の成否を分けます。行政・地域を巻き込める人材はデベロッパー各社が最優先で探している層です。",
      },
      {
        label: "アライアンス・パートナー企業の開拓",
        weights: { data: 1, portDx: 1, shipDx: 1 },
        roleWeights: { bizdev: 2 },
        insight:
          "海洋産業は1社では完結しない産業です。メーカー・商社・海運・行政をつなぐアライアンス構築力は、どの領域でも通用する武器になります。",
      },
      {
        label: "拡大期の営業・マーケティング組織づくり",
        weights: { portDx: 1, data: 1 },
        roleWeights: { bizdev: 2 },
        insight:
          "実証フェーズを終えて拡大期に入る海洋テック企業が増えています。営業・マーケの再現性をつくれる人材はこれから需要が伸びる層です。",
      },
      {
        label: "経営企画・戦略立案・投資判断",
        weights: { resources: 2, offshoreWind: 1 },
        roleWeights: { bizdev: 2 },
        insight:
          "海洋の大型プロジェクトは投資判断の桁が違います。ファイナンス・戦略の素養は資源開発や洋上風力の事業推進で重宝されます。",
      },
    ],
  },
  {
    id: "biz_scale",
    question: "心が躍るのは、どんな規模感・時間軸の仕事？",
    next: "interest",
    options: [
      {
        label: "数百億円規模・10年単位の国家的プロジェクト",
        weights: { offshoreWind: 2, resources: 2, infrastructure: 1 },
      },
      {
        label: "地域や港を巻き込む、数年単位の事業づくり",
        weights: { portDx: 2, offshoreWind: 1, bio: 1 },
      },
      {
        label: "スタートアップのスピード感で数ヶ月単位の勝負",
        weights: { robotics: 2, data: 2, bio: 1 },
      },
      {
        label: "業界の商習慣を変えるSaaS・プラットフォーム",
        weights: { shipDx: 2, portDx: 2 },
      },
      {
        label: "国の安全に関わる、長期で機密性の高い仕事",
        weights: { defense: 3 },
      },
    ],
  },

  // --- 分岐: 現場系 ---
  {
    id: "field_type",
    question: "経験した現場に一番近いのは？",
    next: "field_value",
    options: [
      {
        label: "建設・土木・プラント工事",
        weights: { infrastructure: 2, offshoreWind: 2 },
        roleWeights: { field: 2 },
        insight:
          "洋上風力の建設ラッシュで、海洋工事の施工管理は今もっとも人が足りない職種のひとつです。陸上の施工管理経験者の転身が相次いでいます。",
      },
      {
        label: "工場・製造ライン",
        weights: { shipDx: 3 },
        roleWeights: { field: 1, engineer: 1 },
        insight:
          "造船所は「屋外の巨大工場」です。製造現場の工程・品質管理の経験は、造船の生産管理やDX推進役として評価されます。",
      },
      {
        label: "物流・倉庫・運行管理",
        weights: { portDx: 3 },
        roleWeights: { field: 2 },
        insight:
          "港湾・海運は物流の本丸です。倉庫・配送で培ったオペレーション改善の経験は、ターミナル運営や海運DXに直結します。",
      },
      {
        label: "船・海上・漁業・マリンレジャーなど海の仕事",
        weights: { shipDx: 1, portDx: 1, resources: 1, defense: 1 },
        roleWeights: { field: 2 },
        insight:
          "海上経験者は海洋産業の「即戦力枠」です。船や海の実務感覚を持つ人材は、洋上作業・調査・訓練など幅広い職種で優遇されます。",
      },
      {
        label: "設備保全・メンテナンス",
        weights: { infrastructure: 2, offshoreWind: 1, shipDx: 1 },
        roleWeights: { field: 1, engineer: 1 },
        insight:
          "洋上風力は「建てた後の20年」が本番で、O&M(運転保守)人材の需要が長期で伸び続けます。保全経験はそのまま活きる資産です。",
      },
    ],
  },
  {
    id: "field_value",
    question: "現場で一番大事にしてきたのは？",
    next: "interest",
    options: [
      {
        label: "安全 — 全員を無事故で帰すこと",
        weights: { defense: 1, infrastructure: 1, offshoreWind: 1 },
        roleWeights: { field: 1 },
      },
      {
        label: "段取り — スケジュールを守り切ること",
        weights: { portDx: 2, shipDx: 1 },
        roleWeights: { field: 1 },
      },
      {
        label: "品質 — 妥協しないものづくり",
        weights: { shipDx: 2, infrastructure: 1 },
        roleWeights: { engineer: 1 },
      },
      {
        label: "チーム — 多職種のメンバーをまとめること",
        weights: { offshoreWind: 1, portDx: 1 },
        roleWeights: { bizdev: 1, field: 1 },
      },
      {
        label: "改善 — ムダをなくし続けること",
        weights: { portDx: 1, shipDx: 1, data: 1 },
        roleWeights: { engineer: 1 },
      },
    ],
  },

  // --- 分岐: 研究職 ---
  {
    id: "research_field",
    question: "専門・研究分野に近いのは？",
    next: "research_style",
    options: [
      {
        label: "バイオ・水産・農学・食品",
        weights: { bio: 3 },
        roleWeights: { research: 2 },
        insight:
          "陸上養殖・微細藻類・ブルーフードなど、海洋バイオは研究者が事業の中心になれる領域です。研究職の市場価値が最も直接的に活きます。",
      },
      {
        label: "化学・素材・材料",
        weights: { bio: 1, resources: 2, shipDx: 1 },
        roleWeights: { research: 2 },
        insight:
          "海洋環境は素材の限界試験場です。防食・耐圧素材からバイオ由来素材まで、化学・材料の専門性は複数領域で求められています。",
      },
      {
        label: "地球科学・海洋学・気象",
        weights: { data: 2, resources: 2 },
        roleWeights: { research: 2 },
        insight:
          "海象・地質・気象の知見は、洋上風力の適地選定や資源探査の根幹です。アカデミア出身者が民間で活躍しやすい分野です。",
      },
      {
        label: "情報・数理・物理",
        weights: { data: 3, robotics: 1 },
        roleWeights: { research: 1, engineer: 1 },
        insight:
          "数理・情報系の素養は海洋データ解析の即戦力です。海洋分野の数理人材は極端に少なく、参入すれば一気に第一人者に近づけます。",
      },
      {
        label: "機械・電気・工学系",
        weights: { robotics: 2, shipDx: 1 },
        roleWeights: { engineer: 2 },
        insight:
          "工学系研究の知見は水中ロボットや観測機器の研究開発職に直結します。大学・研究機関発のスタートアップも受け皿になっています。",
      },
    ],
  },
  {
    id: "research_style",
    question: "専門性をどう活かしていきたい？",
    next: "interest",
    options: [
      {
        label: "研究を続けながら、社会実装に近づきたい",
        weights: { bio: 1, data: 1, robotics: 1 },
        roleWeights: { research: 2 },
      },
      {
        label: "研究成果をビジネスにする側に回りたい",
        weights: { bio: 2, offshoreWind: 1 },
        roleWeights: { bizdev: 2 },
      },
      {
        label: "分析・解析の専門職としてデータと向き合いたい",
        weights: { data: 3 },
        roleWeights: { research: 2 },
      },
      {
        label: "技術のわかる営業・企画として橋渡ししたい",
        weights: { shipDx: 1, portDx: 1, offshoreWind: 1 },
        roleWeights: { bizdev: 2 },
      },
      {
        label: "政策・調査・シンクタンクで産業を俯瞰したい",
        weights: { defense: 1, resources: 1, data: 1 },
        roleWeights: { research: 1, bizdev: 1 },
      },
    ],
  },

  // --- 分岐: 学生・キャリアチェンジ ---
  {
    id: "fresh_interest",
    question: "直感で、一番ワクワクするのは？",
    next: "fresh_style",
    options: [
      {
        label: "水中ドローンやロボットを操る・つくる",
        weights: { robotics: 3 },
        roleWeights: { engineer: 2 },
        insight:
          "水中ロボットは若手が最速で第一人者になれる領域です。操縦資格やフィールド経験から入るルートもあり、未経験の入口が意外と広いです。",
      },
      {
        label: "海の上に巨大な風車を建てる",
        weights: { offshoreWind: 3 },
        roleWeights: { field: 1, bizdev: 1 },
        insight:
          "洋上風力はこれから20年続く国家プロジェクトです。若いうちに入れば、市場の成長と一緒にキャリアが伸びていきます。",
      },
      {
        label: "海底に眠る資源やエネルギーを探す",
        weights: { resources: 3 },
        roleWeights: { research: 1 },
        insight:
          "海底資源は国産資源開発の本命として国家予算が付き始めた分野です。長期戦ですが、若手が育つ時間軸と噛み合っています。",
      },
      {
        label: "海や船のデータを解析して謎を解く",
        weights: { data: 3 },
        roleWeights: { research: 2 },
        insight:
          "海洋データはまだ「解析する人」が圧倒的に足りません。データ分析を学びながら海洋を選ぶと、希少性の高いキャリアになります。",
      },
      {
        label: "巨大な船をつくる・動かす現場に立つ",
        weights: { shipDx: 2, portDx: 2 },
        roleWeights: { field: 2 },
        insight:
          "造船・海運は歴史ある産業ですが、いま世代交代とDXで若手の裁量が広がっています。スケールの大きさは全産業でも屈指です。",
      },
      {
        label: "日本の海の安全を守る仕事に就く",
        weights: { defense: 3 },
        roleWeights: { field: 1 },
        insight:
          "海洋防衛・安全保障は民間企業の関わりが急拡大している領域です。使命感を軸にキャリアを選びたい人に向いています。",
      },
    ],
  },
  {
    id: "fresh_style",
    question: "最初のキャリアで重視したいのは？",
    next: "interest",
    options: [
      {
        label: "手に職がつく専門性",
        weights: { robotics: 1, data: 1, shipDx: 1 },
        roleWeights: { engineer: 2 },
      },
      {
        label: "成長市場の勢いに乗ること",
        weights: { offshoreWind: 2, data: 1 },
        roleWeights: { bizdev: 1 },
      },
      {
        label: "安定した産業基盤の上で育つこと",
        weights: { infrastructure: 2, portDx: 1, shipDx: 1 },
        roleWeights: { field: 1 },
      },
      {
        label: "社会や地球に貢献している実感",
        weights: { bio: 1, offshoreWind: 1, defense: 1 },
        roleWeights: { research: 1 },
      },
      {
        label: "現場で体を動かして得る手応え",
        weights: { portDx: 1, offshoreWind: 1, infrastructure: 1 },
        roleWeights: { field: 2 },
      },
    ],
  },

  // --- 共通(全員) ---
  {
    id: "interest",
    question: "いま一番関心がある海洋テーマは？",
    next: "excite",
    options: [
      { label: "海中ロボット・無人探査機", weights: { robotics: 3 } },
      { label: "洋上風力・海洋再生可能エネルギー", weights: { offshoreWind: 3 } },
      { label: "海底資源・エネルギー開発", weights: { resources: 3 } },
      { label: "海底ケーブル・海洋インフラ", weights: { infrastructure: 3 } },
      { label: "海の安全保障・防衛", weights: { defense: 3 } },
      { label: "海洋ビッグデータ・観測・予測", weights: { data: 3 } },
      { label: "海洋バイオ・養殖・食", weights: { bio: 3 } },
      { label: "造船・船・港の進化", weights: { shipDx: 2, portDx: 2 } },
    ],
  },
  {
    id: "excite",
    question: "話を聞いていて、一番ウキウキするのは？",
    next: "env_pref",
    options: [
      {
        label: "最新テクノロジーが海で動いている話",
        weights: { robotics: 2, data: 1 },
        roleWeights: { engineer: 1 },
      },
      {
        label: "巨大プロジェクトが立ち上がっていく話",
        weights: { offshoreWind: 2, resources: 1 },
        roleWeights: { bizdev: 1 },
      },
      {
        label: "海の現場で働く人たちのリアルな話",
        weights: { portDx: 1, shipDx: 1, infrastructure: 1 },
        roleWeights: { field: 2 },
      },
      {
        label: "海の生き物・環境・食の未来の話",
        weights: { bio: 3 },
        roleWeights: { research: 1 },
      },
      {
        label: "国際情勢と海の関係の話",
        weights: { defense: 2, infrastructure: 1 },
        roleWeights: { bizdev: 1 },
      },
    ],
  },
  {
    id: "env_pref",
    question: "理想の働く環境イメージは？",
    next: "sea_distance",
    options: [
      {
        label: "研究所・開発拠点で腰を据えて",
        weights: { robotics: 1, data: 1, bio: 1 },
        roleWeights: { engineer: 1, research: 1 },
      },
      {
        label: "大型プロジェクトの現場を渡り歩く",
        weights: { offshoreWind: 2, infrastructure: 1 },
        roleWeights: { field: 1 },
      },
      {
        label: "港や船が見える場所で働く",
        weights: { portDx: 2, shipDx: 1 },
        roleWeights: { field: 1 },
      },
      {
        label: "都市のオフィスでデータ・企画を扱う",
        weights: { data: 2, defense: 1 },
        roleWeights: { bizdev: 1, research: 1 },
      },
      {
        label: "国内外を飛び回って商談・調整する",
        weights: { offshoreWind: 1, resources: 1, portDx: 1 },
        roleWeights: { bizdev: 2 },
      },
    ],
  },
  {
    id: "sea_distance",
    question: "「海との距離感」、どこまでOK？",
    next: "salary_hope",
    options: [
      {
        label: "船上・海上勤務もどんと来い",
        weights: { resources: 2, shipDx: 1, defense: 1, offshoreWind: 1 },
        roleWeights: { field: 1 },
        insight:
          "海上勤務OKは大きな差別化ポイントです。洋上作業・調査・運航系まで含めて、選べる職種が一気に広がります。",
      },
      {
        label: "沿岸・現場拠点への赴任はOK",
        weights: { offshoreWind: 2, infrastructure: 1, portDx: 1 },
        roleWeights: { field: 1 },
        insight:
          "洋上風力や港湾のプロジェクト拠点は地方沿岸部が中心です。この柔軟性があると、成長市場の中核ポジションに手が届きます。",
      },
      {
        label: "陸上オフィス中心がいい",
        weights: { data: 2, shipDx: 1 },
        roleWeights: { research: 1, bizdev: 1 },
        insight:
          "実は海洋産業の仕事の多くは陸上です。設計・データ解析・企画職なら、海に出ずに海洋産業の中核を担う道があります。",
      },
      {
        label: "リモートも含めて柔軟に働きたい",
        weights: { data: 2, portDx: 1 },
        roleWeights: { research: 1 },
        insight:
          "海洋データ・DX系にはリモート可の企業も出てきています。働き方の自由度と海洋テーマは両立できる時代になりました。",
      },
      {
        label: "まだイメージがない",
        insight:
          "働く場所のイメージは実際の求人を見ると一気に具体化します。無料相談で「海との距離感別」に求人イメージを整理するのがおすすめです。",
      },
    ],
  },
  {
    id: "salary_hope",
    question: "3〜5年後に目指したい年収イメージは？",
    profileKey: "salaryHope",
    next: "future",
    options: [
      { label: "まずは市場相場を知りたい" },
      { label: "〜500万円" },
      { label: "500〜700万円" },
      {
        label: "700〜1,000万円",
        weights: { offshoreWind: 1, data: 1 },
        roleWeights: { bizdev: 1 },
      },
      {
        label: "1,000万円以上",
        weights: { offshoreWind: 1, resources: 1 },
        roleWeights: { bizdev: 1 },
      },
    ],
  },
  {
    id: "future",
    question: "5年後、どんな自分になっていたい？",
    options: [
      {
        label: "海洋テックの専門エンジニアとして名前が知られている",
        weights: { robotics: 2, data: 1 },
        roleWeights: { engineer: 2 },
      },
      {
        label: "海の成長市場で事業をつくるリーダーになっている",
        weights: { offshoreWind: 2, bio: 1 },
        roleWeights: { bizdev: 2 },
      },
      {
        label: "大きな現場を任されるプロジェクトマネージャーになっている",
        weights: { offshoreWind: 1, infrastructure: 1, portDx: 1 },
        roleWeights: { field: 2 },
      },
      {
        label: "データ・研究の専門家として頼られている",
        weights: { data: 2, bio: 1 },
        roleWeights: { research: 2 },
      },
      {
        label: "日本の海を守る仕事に誇りを持っている",
        weights: { defense: 2, infrastructure: 1 },
        roleWeights: { field: 1 },
      },
      {
        label: "海事産業のDXを牽引する存在になっている",
        weights: { shipDx: 2, portDx: 2 },
        roleWeights: { engineer: 1, bizdev: 1 },
      },
    ],
  },
];

const questionMap = new Map(flowQuestions.map((q) => [q.id, q]));

export function getFlowQuestion(id: string): FlowQuestion {
  const question = questionMap.get(id);
  if (!question) {
    throw new Error(`Unknown diagnosis question: ${id}`);
  }
  return question;
}

export function nextFlowQuestionId(question: FlowQuestion, option: FlowOption): string | null {
  return option.next ?? question.next ?? null;
}

// ---------------------------------------------------------------------------
// 結果コンテンツ: 領域×職種タイプのマトリクス
// 年収帯は公開求人・業界調査をもとにした推定の目安。
// ---------------------------------------------------------------------------

export type RolePlan = {
  name: string;
  description: string;
  salary: string;
};

export const areaRolePlans: Record<DiagnosisAreaKey, Record<RoleKey, RolePlan>> = {
  robotics: {
    engineer: {
      name: "AUV/ROV開発エンジニア",
      description: "機体・電装・制御・ソフトウェアを組み合わせ、水中で動くシステムを開発します。",
      salary: "500〜900万円",
    },
    research: {
      name: "海洋ロボットのデータ解析スペシャリスト",
      description: "ソナー・画像・センサーデータを解析し、探査結果を価値ある情報に変えます。",
      salary: "500〜900万円",
    },
    bizdev: {
      name: "水中ロボティクスの事業開発",
      description: "点検・調査・防衛など用途開拓と提携を進め、技術を市場につなぎます。",
      salary: "550〜950万円",
    },
    field: {
      name: "フィールド実証・オペレーションエンジニア",
      description: "海上試験・実運用のオペレーションを組み立て、現場の知見を開発に還元します。",
      salary: "450〜850万円",
    },
  },
  offshoreWind: {
    engineer: {
      name: "風車・浮体・基礎構造のエンジニア",
      description: "風車・浮体式基礎の設計/解析、技術審査を担い、洋上発電所を形にします。",
      salary: "550〜1,000万円",
    },
    research: {
      name: "風況・海象アナリスト",
      description: "風・波・地盤のデータを解析し、発電量予測と事業性評価を支えます。",
      salary: "550〜900万円",
    },
    bizdev: {
      name: "洋上風力デベロッパー（事業開発）",
      description: "サイト開発・入札・地域合意形成・許認可対応まで、事業の最前線を推進します。",
      salary: "600〜1,200万円",
    },
    field: {
      name: "建設・O&Mプロジェクトマネージャー",
      description: "洋上工事と20年続く運転保守(O&M)の現場を統括します。",
      salary: "500〜950万円",
    },
  },
  infrastructure: {
    engineer: {
      name: "海洋土木・海底ケーブルエンジニア",
      description: "海底ケーブルや港湾構造物の設計・敷設・保全技術を担います。",
      salary: "500〜900万円",
    },
    research: {
      name: "海洋調査・測量スペシャリスト",
      description: "海底地形・地質の調査データでインフラ計画の土台をつくります。",
      salary: "500〜850万円",
    },
    bizdev: {
      name: "海洋インフラの事業企画・渉外",
      description: "通信・電力事業者や官公庁と組み、インフラ事業を組成します。",
      salary: "550〜1,000万円",
    },
    field: {
      name: "海洋工事の施工管理",
      description: "敷設船・作業船が動く海の工事現場をマネジメントします。",
      salary: "500〜900万円",
    },
  },
  resources: {
    engineer: {
      name: "資源開発・海洋プラントエンジニア",
      description: "掘削・生産設備や海洋プラントの設計・運用技術を担います。",
      salary: "550〜1,000万円",
    },
    research: {
      name: "地質・資源解析スペシャリスト",
      description: "探査データから資源ポテンシャルを評価し、開発判断を支えます。",
      salary: "550〜950万円",
    },
    bizdev: {
      name: "資源開発プロジェクトの事業推進",
      description: "国・企業間の大型プロジェクトを組成し、長期戦の開発を前に進めます。",
      salary: "600〜1,100万円",
    },
    field: {
      name: "海洋プラント・掘削オペレーション",
      description: "洋上設備の運用・保守・安全管理を現場で担います。",
      salary: "550〜950万円",
    },
  },
  defense: {
    engineer: {
      name: "防衛・監視システムエンジニア",
      description: "ソナー・レーダー・無人機など、海を見張る技術の開発を担います。",
      salary: "550〜1,000万円",
    },
    research: {
      name: "海洋状況把握(MDA)のデータアナリスト",
      description: "船舶動静・観測データを分析し、海の安全保障を情報面から支えます。",
      salary: "550〜950万円",
    },
    bizdev: {
      name: "防衛・安全保障領域の事業開発",
      description: "官公庁向け事業の企画・渉外で、民間技術を安全保障につなぎます。",
      salary: "600〜1,000万円",
    },
    field: {
      name: "装備・システムの運用/フィールド支援",
      description: "監視システムや装備品の運用・保守・訓練支援を担います。",
      salary: "500〜850万円",
    },
  },
  data: {
    engineer: {
      name: "海洋IoT・観測システムエンジニア",
      description: "ブイ・センサー・衛星データ基盤など、海を測る仕組みを開発します。",
      salary: "550〜950万円",
    },
    research: {
      name: "海洋データサイエンティスト",
      description: "海況・気象・生態データの解析と予測モデル構築を担います。",
      salary: "550〜1,000万円",
    },
    bizdev: {
      name: "海洋データサービスの事業開発",
      description: "海運・漁業・保険・エネルギーへのデータ活用提案で市場をつくります。",
      salary: "550〜1,000万円",
    },
    field: {
      name: "観測オペレーション/フィールドエンジニア",
      description: "観測機器の設置・運用・データ回収を現場で支えます。",
      salary: "450〜800万円",
    },
  },
  bio: {
    engineer: {
      name: "陸上養殖・生産システムエンジニア",
      description: "循環システムや自動給餌など、生産設備の開発・改善を担います。",
      salary: "450〜800万円",
    },
    research: {
      name: "海洋バイオR&D・研究員",
      description: "微細藻類・水産資源・機能性素材の研究開発を担います。",
      salary: "450〜850万円",
    },
    bizdev: {
      name: "ブルーフード・バイオ素材の事業開発",
      description: "養殖・代替タンパク・素材の事業化を推進し、市場を立ち上げます。",
      salary: "500〜950万円",
    },
    field: {
      name: "養殖・生産現場のマネジメント",
      description: "生産現場の運営・品質・出荷管理を担います。",
      salary: "400〜700万円",
    },
  },
  shipDx: {
    engineer: {
      name: "造船DX・スマートシップエンジニア",
      description: "設計3D化・自動運航・IoT船など、船のデジタル化を開発面から進めます。",
      salary: "500〜950万円",
    },
    research: {
      name: "船舶性能・運航データアナリスト",
      description: "運航データから燃費・性能を解析し、船の最適化を導きます。",
      salary: "500〜900万円",
    },
    bizdev: {
      name: "舶用・造船DXソリューションの企画営業",
      description: "造船所・船主に向けたDXソリューションの提案・事業化を担います。",
      salary: "550〜950万円",
    },
    field: {
      name: "造船工程・生産管理",
      description: "巨大な建造現場の工程・品質・協力会社をマネジメントします。",
      salary: "450〜850万円",
    },
  },
  portDx: {
    engineer: {
      name: "港湾・物流システムエンジニア",
      description: "ターミナル自動化や物流プラットフォームの開発を担います。",
      salary: "500〜900万円",
    },
    research: {
      name: "物流・運航データアナリスト",
      description: "貨物・運航データを解析し、港湾オペレーションを最適化します。",
      salary: "500〜850万円",
    },
    bizdev: {
      name: "港湾・海運DXの事業開発",
      description: "船社・港湾事業者と組んでDX事業を立ち上げます。",
      salary: "550〜1,000万円",
    },
    field: {
      name: "ターミナル・運航オペレーション管理",
      description: "港と船が休みなく動く現場のオペレーションを統括します。",
      salary: "450〜850万円",
    },
  },
};

export const areaTypeCatch: Record<DiagnosisAreaKey, string> = {
  robotics: "深海フロンティアを拓く",
  offshoreWind: "海の上に発電所を建てる",
  infrastructure: "海の生命線を支える",
  resources: "海底に眠る可能性を掘り起こす",
  defense: "日本の海を守り抜く",
  data: "海をデータで読み解く",
  bio: "海の恵みを科学する",
  shipDx: "ものづくりの巨艦を進化させる",
  portDx: "海の物流を再発明する",
};

export const roleTypeCatch: Record<RoleKey, string> = {
  engineer: "エンジニアタイプ",
  research: "リサーチャータイプ",
  bizdev: "ビジネスビルダータイプ",
  field: "フィールドリーダータイプ",
};

export const areaMarketValue: Record<DiagnosisAreaKey, { rank: string; note: string }> = {
  robotics: {
    rank: "S（希少×急成長）",
    note: "水中ロボットを扱える人材は国内で圧倒的に不足。今後3〜5年で最も評価が上がる領域のひとつです。",
  },
  offshoreWind: {
    rank: "S（急成長）",
    note: "案件数に対して経験者がまったく足りず、異業種からの転身が主流。市場拡大と一緒に年収も伸びやすい領域です。",
  },
  infrastructure: {
    rank: "A（安定×拡大）",
    note: "データセンター需要で海底ケーブル投資が世界的に増加中。堅い需要が長期で続く領域です。",
  },
  resources: {
    rank: "A（政策の追い風）",
    note: "国産資源開発の国家プロジェクトが本格化。長期目線で希少キャリアを築ける領域です。",
  },
  defense: {
    rank: "A+（急上昇）",
    note: "防衛予算の拡大で民間人材の登用が拡大中。使命感と市場価値を両立できる領域です。",
  },
  data: {
    rank: "S（超希少）",
    note: "「海洋×データ」を語れる人材は市場にほとんど存在しません。先行者利益が最も大きい領域です。",
  },
  bio: {
    rank: "B+（ニッチ×将来性）",
    note: "ブルーフード市場の立ち上がり期。今から入れば市場の成長とともに第一人者になれる領域です。",
  },
  shipDx: {
    rank: "A（DX人材不足）",
    note: "伝統産業×デジタルの掛け算で価値が跳ね上がる領域。DX推進の中核人材が不足しています。",
  },
  portDx: {
    rank: "A（DX人材不足）",
    note: "物流の要衝で自動化・デジタル化が加速中。オペレーション×デジタルの人材が求められています。",
  },
};

export const areaExcites: Record<DiagnosisAreaKey, string> = {
  robotics:
    "人が到達できない世界に、技術で踏み込むこと。「まだ誰もやっていない」が最大のモチベーションになるタイプです。",
  offshoreWind:
    "何もなかった海に巨大な発電所が立ち上がっていくスケール感。社会課題の解決とビジネスが重なる場所に惹かれるタイプです。",
  infrastructure:
    "誰も気づかないところで社会を支えている仕組み。「止まったらニュースになる」ものの裏側に惹かれるタイプです。",
  resources:
    "地図にない場所に眠る可能性を掘り当てること。長期戦の大きな挑戦にロマンを感じるタイプです。",
  defense:
    "国や社会を守るという使命。緊張感のある領域で、自分の仕事に誇りを持ちたいタイプです。",
  data:
    "見えないものをデータで見えるようにする瞬間。「地球最後の未計測領域」である海に知的好奇心を刺激されるタイプです。",
  bio:
    "生き物と科学が交わる領域。食や環境という誰にとっても身近なテーマを、深く探究したいタイプです。",
  shipDx:
    "巨大なものづくりの世界が変わっていく過渡期。伝統と革新の交差点に立ちたいタイプです。",
  portDx:
    "世界とつながる物流の結節点。複雑なオペレーションがぴたりと噛み合う瞬間に手応えを感じるタイプです。",
};

export const roleEnvironments: Record<RoleKey, string> = {
  engineer:
    "試作機や装置が目の前で動く開発現場。設計→試作→海での実証、というサイクルを自分の手で回せる環境で最も力を発揮します。",
  research:
    "データや実験結果から新しい発見が生まれる環境。フィールドとデスクを行き来しながら、専門性を深掘りできる環境が合っています。",
  bizdev:
    "新しい市場の立ち上げ現場。社内外の関係者と動き回りながら、事業の形が見えてくる瞬間に立ち会える環境が合っています。",
  field:
    "人とモノが動く現場の最前線。自分の采配でプロジェクトが円滑に回っていく手応えを、日々感じられる環境が合っています。",
};

export const roleStrengths: Record<RoleKey, string[]> = {
  engineer: [
    "制約の多い環境で「動くもの」をつくり切る実装力",
    "仕様・実装・検証を自分で詰め切る技術的な粘り強さ",
    "近接領域の技術を新しいフィールドに翻訳する応用力",
  ],
  research: [
    "データや実験から仮説を立てて検証する科学的思考",
    "複雑な事象を構造化してわかりやすく説明する力",
    "腰を据えて専門性を深め続ける探究心",
  ],
  bizdev: [
    "立場の異なる関係者を巻き込んで前に進める推進力",
    "市場の立ち上がりを捉えて事業に翻訳する嗅覚",
    "正解のない状況でも、まず形をつくる行動力",
  ],
  field: [
    "現場の安全・品質・納期を守り切る責任感",
    "多職種のチームをひとつにまとめる現場マネジメント力",
    "計画倒れにしない段取りと実行力",
  ],
};

export const areaStrengthLine: Record<DiagnosisAreaKey, string> = {
  robotics: "「海×ロボット」という希少カテゴリに早期参入できるポジション取り",
  offshoreWind: "20年続く成長市場に、立ち上げ期から関われるタイミングの良さ",
  infrastructure: "社会に不可欠なインフラを支える、代替の利かない専門性",
  resources: "国家プロジェクト級の長期テーマで積み上がる、唯一無二の経験",
  defense: "需要が急拡大する安全保障領域に、民間から関われる希少な立場",
  data: "「海洋×データ」というほぼ空白の市場での先行者ポジション",
  bio: "ブルーフードという新市場を最初期から知る先行者の知見",
  shipDx: "伝統産業×デジタルの掛け算で生まれる希少価値",
  portDx: "世界物流の要衝で、変革の主役になれるポジション",
};

export const areaNextSteps: Record<DiagnosisAreaKey, string[]> = {
  robotics: [
    "海洋データ — 取得したデータの解析側にも広げると市場価値が倍増",
    "海洋防衛・安全保障 — 無人機運用の需要が急増中",
    "洋上風力 — 海底調査・点検のロボット需要が拡大",
  ],
  offshoreWind: [
    "海洋インフラ — 海洋土木・送電網の知見は相互に活きる",
    "海底資源 — 洋上開発のプロジェクト経験が転用できる",
    "港湾・海運DX — 基地港湾の整備・運用と隣接",
  ],
  infrastructure: [
    "洋上風力 — 海洋工事の経験がそのまま活きる成長市場",
    "海洋防衛・安全保障 — 重要インフラ防護の需要増",
    "海底資源 — 海洋調査・敷設技術が共通",
  ],
  resources: [
    "洋上風力 — 海洋開発の技術・許認可の知見が共通",
    "海洋データ — 探査データ解析の専門性へ広げられる",
    "海洋インフラ — 海洋調査・掘削技術が隣接",
  ],
  defense: [
    "水中ロボティクス — 無人機・自律システムと直結",
    "海洋データ — 海洋状況把握(MDA)はデータが主戦場",
    "海洋インフラ — 重要インフラ防護と表裏一体",
  ],
  data: [
    "水中ロボティクス — データ取得側の技術理解で希少性アップ",
    "海洋バイオ — 生態データ×AIという新領域",
    "港湾・海運DX — 物流データ活用の実需が大きい",
  ],
  bio: [
    "海洋データ — 生態・環境データ解析で専門性を拡張",
    "海底資源 — バイオ資源・素材開発と隣接",
    "洋上風力 — 漁業共生・環境アセスメントの需要",
  ],
  shipDx: [
    "港湾・海運DX — 船と港はワンセットのDX市場",
    "水中ロボティクス — 船体点検の無人化と直結",
    "海洋データ — 運航データ活用の中核へ",
  ],
  portDx: [
    "造船・船舶DX — 船と港はワンセットのDX市場",
    "海洋インフラ — 港湾整備・維持管理と隣接",
    "海洋データ — 物流最適化はデータが主戦場",
  ],
};

// ---------------------------------------------------------------------------
// 回答履歴から結果を組み立てる
// ---------------------------------------------------------------------------

export type FlowAnswer = {
  questionId: string;
  optionIndex: number;
};

export type DiagnosisInsight = {
  question: string;
  answer: string;
  insight: string;
};

export type DiagnosisProfile = Partial<Record<ProfileKey, string>>;

export type DiagnosisOutcome = {
  ranked: { key: DiagnosisAreaKey; percent: number }[];
  topArea: DiagnosisAreaKey;
  secondArea: DiagnosisAreaKey;
  isClose: boolean;
  role: RoleKey;
  typeName: string;
  typeSub: string;
  areaTitle: string;
  questName: string;
  summary: string;
  excites: string;
  environment: string;
  strengths: string[];
  recommendedRole: RolePlan;
  marketValue: { rank: string; note: string };
  nextSteps: string[];
  insights: DiagnosisInsight[];
  profile: DiagnosisProfile;
};

export function buildDiagnosisOutcome(answers: FlowAnswer[]): DiagnosisOutcome {
  const areaTotals = Object.fromEntries(diagnosisAreaKeys.map((key) => [key, 0])) as Record<
    DiagnosisAreaKey,
    number
  >;
  const roleTotals = Object.fromEntries(roleKeys.map((key) => [key, 0])) as Record<
    RoleKey,
    number
  >;
  const insights: DiagnosisInsight[] = [];
  const profile: DiagnosisProfile = {};

  for (const answer of answers) {
    const question = getFlowQuestion(answer.questionId);
    const option = question.options[answer.optionIndex];
    if (!option) continue;

    for (const key of diagnosisAreaKeys) {
      areaTotals[key] += option.weights?.[key] ?? 0;
    }
    for (const key of roleKeys) {
      roleTotals[key] += option.roleWeights?.[key] ?? 0;
    }
    if (option.insight) {
      insights.push({ question: question.question, answer: option.label, insight: option.insight });
    }
    if (question.profileKey) {
      profile[question.profileKey] = option.label;
    }
  }

  const sum = diagnosisAreaKeys.reduce((acc, key) => acc + areaTotals[key], 0);
  const ranked = diagnosisAreaKeys
    .map((key) => ({
      key,
      percent: sum > 0 ? Math.round((areaTotals[key] / sum) * 100) : 0,
    }))
    .sort((a, b) => b.percent - a.percent);

  const topArea = ranked[0].key;
  const secondArea = ranked[1].key;
  const role = roleKeys.reduce((best, key) => (roleTotals[key] > roleTotals[best] ? key : best), roleKeys[0]);

  return composeOutcome({ ranked, topArea, secondArea, role, insights, profile });
}

/** 領域・タイプが確定した状態から結果コンテンツを組み立てる(サーバー側の再構成にも使う) */
export function composeOutcome({
  ranked,
  topArea,
  secondArea,
  role,
  insights = [],
  profile = {},
}: {
  ranked: { key: DiagnosisAreaKey; percent: number }[];
  topArea: DiagnosisAreaKey;
  secondArea: DiagnosisAreaKey;
  role: RoleKey;
  insights?: DiagnosisInsight[];
  profile?: DiagnosisProfile;
}): DiagnosisOutcome {
  const areaResult = diagnosisResults[topArea];
  const top = ranked.find((entry) => entry.key === topArea) ?? ranked[0];
  const second = ranked.find((entry) => entry.key === secondArea) ?? ranked[1];

  return {
    ranked,
    topArea,
    secondArea,
    isClose: top.percent - second.percent <= 10,
    role,
    typeName: `${areaTypeCatch[topArea]}、${roleTypeCatch[role]}`,
    typeSub: `${areaResult.title} × ${roleLabels[role]}`,
    areaTitle: areaResult.title,
    questName: areaResult.questName,
    summary: areaResult.summary,
    excites: areaExcites[topArea],
    environment: roleEnvironments[role],
    strengths: [...roleStrengths[role], areaStrengthLine[topArea]],
    recommendedRole: areaRolePlans[topArea][role],
    marketValue: areaMarketValue[topArea],
    nextSteps: areaNextSteps[topArea],
    insights,
    profile,
  };
}
