export type ContentType = "video" | "ebook" | "note" | "event";

export type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: string;
  audience: "jobseeker" | "recruiter" | "company" | "all";
  publishedAt: string;
  url: string;
  thumbnail?: string;
};

export const categories = [
  "思想",
  "業態別の解体新書",
  "求職者向け",
  "採用担当者向け",
  "海洋技術",
  "企業インタビュー",
];

export const industries = [
  "海運",
  "造船",
  "水産",
  "港湾・物流",
  "海洋土木",
  "AUV / ROV",
  "洋上風力",
  "海洋資源",
];

export const featuredContents: ContentItem[] = [
  {
    id: "video-001",
    type: "video",
    title: "日本の海が世界をリードできる理由",
    description:
      "海洋大国としての現在地、技術資産、採用市場の変化を専門家との対話から読み解く導入編。",
    category: "思想",
    audience: "all",
    publishedAt: "2026-07-01",
    url: "#",
  },
  {
    id: "ebook-001",
    type: "ebook",
    title: "海洋産業採用の教科書 2026",
    description:
      "海運、造船、AUV、洋上風力などの主要領域ごとに、職種と採用論点を整理した入門資料。",
    category: "業態別の解体新書",
    audience: "recruiter",
    publishedAt: "2026-07-02",
    url: "#",
  },
  {
    id: "note-001",
    type: "note",
    title: "技術があるのに、なぜ日本は遅いのか",
    description:
      "浦環先生との対談を起点に、海洋産業で人材と事業開発が交差するポイントを考える。",
    category: "思想",
    audience: "all",
    publishedAt: "2026-06-28",
    url: "#",
  },
  {
    id: "event-001",
    type: "event",
    title: "海洋産業キャリアと採用の未来会議",
    description:
      "研究者、事業会社、スタートアップ、採用担当者が集まり、海洋産業の人材課題を話すオンラインイベント。",
    category: "採用担当者向け",
    audience: "company",
    publishedAt: "2026-07-15",
    url: "#",
  },
];

export const diagnosisAreaKeys = [
  "robotics",
  "offshoreWind",
  "infrastructure",
  "resources",
  "defense",
  "data",
  "bio",
  "shipDx",
  "portDx",
] as const;

export type DiagnosisAreaKey = (typeof diagnosisAreaKeys)[number];

export type DiagnosisOption = {
  label: string;
  weights: Partial<Record<DiagnosisAreaKey, number>>;
};

export type DiagnosisQuestion = {
  question: string;
  options: DiagnosisOption[];
};

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    question: "いま一番関心があるテーマは？",
    options: [
      { label: "AUV・ROV・水中ドローンなど、海の中で動くロボット", weights: { robotics: 3, data: 1 } },
      { label: "洋上風力・海底資源など、海を使ったエネルギー/資源開発", weights: { offshoreWind: 2, resources: 2 } },
      { label: "海底ケーブル・港湾・海運など、社会を支える海のインフラ", weights: { infrastructure: 2, portDx: 2, defense: 1 } },
    ],
  },
  {
    question: "これまでの経験に一番近いのは？",
    options: [
      { label: "機械・電気・制御・組込み・ロボティクスなどの開発経験", weights: { robotics: 3, shipDx: 1 } },
      { label: "事業開発・営業・企画・渉外・プロジェクト推進", weights: { offshoreWind: 2, resources: 1, portDx: 1 } },
      { label: "データ分析・AI・研究開発・バイオ/素材・理系研究", weights: { data: 2, bio: 2, robotics: 1 } },
    ],
  },
  {
    question: "働く環境のイメージに近いのは？",
    options: [
      { label: "研究開発やスタートアップで、試作・実証を重ねる環境", weights: { robotics: 2, data: 2, bio: 1 } },
      { label: "大手・官公庁・地域を巻き込み、大型PJを進める環境", weights: { offshoreWind: 2, infrastructure: 1, defense: 1 } },
      { label: "造船所・港湾・船会社など、現場に近い産業のDX環境", weights: { shipDx: 2, portDx: 2, infrastructure: 1 } },
    ],
  },
  {
    question: "心が動くのはどんな瞬間？",
    options: [
      { label: "自分が関わった機体・装置・システムが海で動いたとき", weights: { robotics: 2, shipDx: 1, data: 1 } },
      { label: "脱炭素・資源・食料など、大きな社会課題に前進が見えたとき", weights: { offshoreWind: 2, resources: 1, bio: 1 } },
      { label: "通信・物流・安全保障など、止められない基盤を守れたとき", weights: { infrastructure: 2, defense: 2, portDx: 1 } },
    ],
  },
  {
    question: "仕事で大事にしたい価値観は？",
    options: [
      { label: "専門技術を深め、難しい制約条件を突破すること", weights: { robotics: 2, data: 1, shipDx: 1 } },
      { label: "新しい市場や事業を、関係者を巻き込んでつくること", weights: { offshoreWind: 2, resources: 1, bio: 1 } },
      { label: "社会インフラと安全を、地道に強くしていくこと", weights: { infrastructure: 2, defense: 2, portDx: 1 } },
    ],
  },
  {
    question: "チームの中で自然と担うことが多い役割は？",
    options: [
      { label: "技術課題を分解し、仕様・実装・検証を詰める役割", weights: { robotics: 2, data: 2, shipDx: 1 } },
      { label: "社内外の関係者をつなぎ、プロジェクトを前に進める役割", weights: { offshoreWind: 2, portDx: 1, infrastructure: 1 } },
      { label: "リスクを読み、ルール・安全・品質を守る役割", weights: { defense: 2, infrastructure: 1, resources: 1 } },
    ],
  },
  {
    question: "前例のない仕事を任されたら？",
    options: [
      { label: "仮説を立て、データや実験で検証しながら精度を上げる", weights: { data: 2, bio: 1, robotics: 1 } },
      { label: "関係者を集め、まず小さく事業や実証の形にする", weights: { offshoreWind: 1, resources: 2, bio: 1 } },
      { label: "既存の安全基準・運用を押さえ、確実に改善して進める", weights: { defense: 2, infrastructure: 1, portDx: 1 } },
    ],
  },
  {
    question: "つい読んでしまうニュースは？",
    options: [
      { label: "ロボット、ドローン、自動運転、センサー、宇宙・深海技術", weights: { robotics: 2, data: 1 } },
      { label: "再エネ、資源開発、脱炭素、エネルギー安全保障", weights: { offshoreWind: 2, resources: 2, defense: 1 } },
      { label: "物流、造船、港湾、海底ケーブル、船舶の自動化/DX", weights: { portDx: 2, shipDx: 2, infrastructure: 1 } },
    ],
  },
  {
    question: "理想の働く場所のイメージは？",
    options: [
      { label: "研究室・開発拠点・実証フィールドを行き来したい", weights: { robotics: 2, data: 1, bio: 1 } },
      { label: "地域・海域・建設現場など、大型プロジェクトの現場に関わりたい", weights: { offshoreWind: 2, resources: 1, infrastructure: 1 } },
      { label: "港・船・造船所・管制/運航の現場に近い場所で働きたい", weights: { portDx: 2, shipDx: 2 } },
    ],
  },
  {
    question: "5年後、どんな自分でいたい？",
    options: [
      { label: "海洋ロボットや海洋データを扱える専門人材", weights: { robotics: 2, data: 2 } },
      { label: "海の成長市場を立ち上げる事業開発/プロジェクトリーダー", weights: { offshoreWind: 2, resources: 1, bio: 1 } },
      { label: "海上交通・造船・港湾・安全保障を支えるDX人材", weights: { portDx: 2, shipDx: 1, defense: 1 } },
    ],
  },
  {
    question: "海洋産業の中で、特に解きたい課題は？",
    options: [
      { label: "人が行けない海中を、機械やデータで見えるようにする", weights: { robotics: 2, data: 2 } },
      { label: "エネルギー・資源・食料の制約を、海から解決する", weights: { offshoreWind: 1, resources: 2, bio: 2 } },
      { label: "海の物流・通信・安全保障を、強く効率的にする", weights: { infrastructure: 2, defense: 1, portDx: 2 } },
    ],
  },
  {
    question: "一番ワクワクする職種名に近いのは？",
    options: [
      { label: "水中ロボットエンジニア / 海洋データサイエンティスト", weights: { robotics: 2, data: 2 } },
      { label: "洋上風力の事業開発 / 海底資源プロジェクト推進", weights: { offshoreWind: 2, resources: 2 } },
      { label: "船舶DX・港湾DX・海洋インフラのプロジェクトマネージャー", weights: { shipDx: 2, portDx: 2, infrastructure: 1 } },
    ],
  },
];

export type DiagnosisResult = {
  key: DiagnosisAreaKey;
  title: string;
  questName: string;
  questPath: string;
  summary: string;
  reasons: string[];
  roles: string[];
};

export const diagnosisResults: Record<DiagnosisAreaKey, DiagnosisResult> = {
  robotics: {
    key: "robotics",
    title: "水中ロボティクス",
    questName: "水中ロボティクス Quest",
    questPath: "/robotics",
    summary:
      "AUV・ROV・水中ドローン、センサー、制御、耐圧・防水設計など、海の中で動く機械をつくる領域です。ロボティクスや組込み、機械・電気の経験を海洋分野に接続しやすい入口です。",
    reasons: [
      "機械・電気・制御・組込みなど、技術で難しい制約を突破する志向がある",
      "研究開発や実証を重ねながら、目に見えるプロダクトをつくることに惹かれる",
      "宇宙・ドローン・自動運転・FAなどの近接経験を海中に展開できる",
    ],
    roles: [
      "AUV/ROV開発エンジニア",
      "組込み・制御・メカトロエンジニア",
      "フィールドテスト/実証エンジニア",
      "水中センサー・音響機器エンジニア",
    ],
  },
  offshoreWind: {
    key: "offshoreWind",
    title: "洋上風力",
    questName: "洋上風力 Quest",
    questPath: "/offshore-wind",
    summary:
      "脱炭素とエネルギー安全保障を背景に、開発・建設・O&M・地域調整まで人材需要が広がる成長領域です。事業開発、建設、電力、プラント、渉外経験を活かしやすい分野です。",
    reasons: [
      "大型プロジェクトを、地域・行政・企業を巻き込んで進める志向がある",
      "再エネ・電力・建設・プラントなどの近接経験を海に広げられる",
      "市場の立ち上げ期に入り、事業づくり側で挑戦したい",
    ],
    roles: [
      "洋上風力の開発（デベロッパー）",
      "建設・O&Mプロジェクト管理",
      "地域共生・渉外・許認可対応",
      "事業開発・渉外・アライアンス",
    ],
  },
  infrastructure: {
    key: "infrastructure",
    title: "海洋インフラ",
    questName: "海洋インフラ Quest",
    questPath: "/infrastructure",
    summary:
      "海底ケーブル、海洋土木、港湾設備、海洋調査など、通信・物流・エネルギーを海から支える領域です。インフラを止めない責任感と、現場を動かすプロジェクト推進力が活きます。",
    reasons: [
      "社会基盤を支える仕事に関心があり、地道な安全・品質管理を大切にできる",
      "土木・通信・設備・施工管理・保守などの経験を海洋領域に接続できる",
      "海底ケーブルや港湾など、目に見えにくい重要インフラに惹かれる",
    ],
    roles: [
      "海底ケーブル敷設/保守プロジェクト管理",
      "海洋土木・海洋調査の施工/運用管理",
      "インフラ保守・アセットマネジメント",
      "通信/電力インフラの事業企画",
    ],
  },
  resources: {
    key: "resources",
    title: "海底資源",
    questName: "海底資源 Quest",
    questPath: "/resources",
    summary:
      "海底鉱物資源、CCS、海洋調査、資源探査など、海を資源開発と地球環境のフィールドとして扱う領域です。技術・政策・事業性が絡むため、研究開発と事業推進の両方にチャンスがあります。",
    reasons: [
      "資源・エネルギー・地質・環境など、長期テーマに腰を据えて関わりたい",
      "研究開発、調査、プロジェクト推進を横断する仕事に向いている",
      "不確実性の高い領域でも、仮説検証しながら前に進める志向がある",
    ],
    roles: [
      "海洋資源調査・探査プロジェクト担当",
      "CCS/海底貯留関連の事業開発",
      "地質・環境調査エンジニア",
      "資源開発の政策/渉外/アライアンス",
    ],
  },
  defense: {
    key: "defense",
    title: "海洋防衛・安全保障",
    questName: "海洋防衛・安全保障 Quest",
    questPath: "/defense",
    summary:
      "海上交通、海底ケーブル、港湾、監視・観測、サイバー/通信など、海の安全保障に関わる領域です。民間インフラと防衛・政策の接点が増え、技術・運用・リスク管理人材の重要性が高まっています。",
    reasons: [
      "社会の安全や重要インフラを守る仕事に強い意味を感じる",
      "ルール、リスク、品質、セキュリティを丁寧に扱う志向がある",
      "通信・サイバー・インフラ・行政/公共領域の経験を活かせる",
    ],
    roles: [
      "海洋監視・観測システム企画",
      "重要インフラのリスク管理/セキュリティ",
      "防衛・公共向けプロジェクトマネージャー",
      "海洋政策・渉外・調査担当",
    ],
  },
  data: {
    key: "data",
    title: "海洋データ",
    questName: "海洋データ Quest",
    questPath: "/data",
    summary:
      "海況、気象、音響、画像、衛星、センサーなどのデータを使い、海を予測・可視化・意思決定につなげる領域です。AI、データサイエンス、GIS、解析基盤の経験を活かせます。",
    reasons: [
      "データやモデルで、見えにくい海の状態を読み解くことに興味がある",
      "AI・機械学習・画像/信号処理・GISなどの経験を活かせる",
      "研究と事業、プロダクト開発の間に立つ仕事に向いている",
    ],
    roles: [
      "海洋データサイエンティスト",
      "海況予測・観測データ解析エンジニア",
      "GIS/衛星データ活用担当",
      "海洋データプロダクトマネージャー",
    ],
  },
  bio: {
    key: "bio",
    title: "海洋バイオ",
    questName: "海洋バイオ Quest",
    questPath: "/bio",
    summary:
      "藻類、海洋微生物、ブルーカーボン、食品・素材・創薬など、海の生物資源を活用する領域です。研究開発、事業化、サステナビリティの接点で新しい市場が生まれています。",
    reasons: [
      "食料・環境・素材など、海の生物資源を社会実装するテーマに惹かれる",
      "バイオ、化学、食品、素材、サステナビリティ領域の経験を活かせる",
      "研究成果を事業やプロダクトに変えるプロセスに関わりたい",
    ],
    roles: [
      "海洋バイオ研究開発",
      "藻類/微生物活用の事業開発",
      "ブルーカーボン関連プロジェクト担当",
      "食品・素材・化学領域の企画/技術営業",
    ],
  },
  shipDx: {
    key: "shipDx",
    title: "造船・船舶DX",
    questName: "造船・船舶DX Quest",
    questPath: "/ship-dx",
    summary:
      "造船、舶用機器、船舶管理、自動運航、省エネ運航など、船をつくり動かす現場をデジタルと技術で変える領域です。製造業、機械、IT、プロジェクト管理の経験と相性が良い分野です。",
    reasons: [
      "大きなモノづくりとデジタル化の両方に関心がある",
      "製造業・機械・IT・品質/生産管理の経験を船舶領域に展開できる",
      "歴史ある産業の変革に、現場に近いところから関わりたい",
    ],
    roles: [
      "造船/舶用機器のプロジェクト管理",
      "船舶IoT・運航データ活用担当",
      "自動運航/省エネ運航システム企画",
      "生産管理・品質管理・DX推進",
    ],
  },
  portDx: {
    key: "portDx",
    title: "港湾・海運DX",
    questName: "港湾・海運DX Quest",
    questPath: "/port-dx",
    summary:
      "港湾、海運、物流、通関、ターミナル運営など、海上物流をデジタルとオペレーションで進化させる領域です。物流、SaaS、業務改善、現場オペレーション経験を活かせます。",
    reasons: [
      "物流・貿易・港湾など、世界とつながる産業インフラに関心がある",
      "現場運営、業務改善、システム導入、法人営業の経験を活かせる",
      "既存産業の非効率を、データやプロセス設計で改善したい",
    ],
    roles: [
      "港湾/物流DXプロジェクトマネージャー",
      "海運・物流オペレーション企画",
      "貿易/通関SaaSの事業開発",
      "ターミナル運営・業務改善担当",
    ],
  },
};

// 公開済みの領域別Questサイト。ページ公開時にここへ追加すると診断結果からリンクされる。
export const publishedQuestAreas = new Set<DiagnosisAreaKey>(["robotics"]);

// 公開済みQuestのリンク一覧(ヘッダー/フッター共用)。publishedQuestAreasが単一ソース。
export const publishedQuestLinks = [...publishedQuestAreas].map((key) => ({
  label: diagnosisResults[key].questName,
  href: diagnosisResults[key].questPath,
}));
