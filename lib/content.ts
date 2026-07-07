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

export type DiagnosisAreaKey = "shipping" | "energy" | "tech";

export type DiagnosisOption = {
  label: string;
  area: DiagnosisAreaKey;
};

export type DiagnosisQuestion = {
  question: string;
  options: DiagnosisOption[];
};

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    question: "いま一番関心があるテーマは？",
    options: [
      { label: "世界とつながる物流・大型の船や港のスケール", area: "shipping" },
      { label: "洋上風力などのエネルギー・海洋資源の開発", area: "energy" },
      { label: "ロボット・AI・海のデータ活用などの最新技術", area: "tech" },
    ],
  },
  {
    question: "経験を活かしたい領域は？",
    options: [
      { label: "現場運営・オペレーション・プロジェクト推進", area: "shipping" },
      { label: "事業開発・社会インフラづくり", area: "energy" },
      { label: "エンジニアリング・研究開発・データ分析", area: "tech" },
    ],
  },
  {
    question: "働く環境のイメージに近いのは？",
    options: [
      { label: "歴史ある産業を大きな組織・チームで支える", area: "shipping" },
      { label: "成長市場で新しい事業を立ち上げていく", area: "energy" },
      { label: "スタートアップや研究開発の現場で技術を磨く", area: "tech" },
    ],
  },
  {
    question: "心が動くのはどんな瞬間？",
    options: [
      { label: "巨大な船や構造物が動き出すのを見たとき", area: "shipping" },
      { label: "エネルギーや環境の課題解決に一歩近づいたとき", area: "energy" },
      { label: "新しい技術やデータが目に見える形になったとき", area: "tech" },
    ],
  },
  {
    question: "5年後、どんな自分でいたい？",
    options: [
      { label: "産業に欠かせない現場・事業のプロフェッショナル", area: "shipping" },
      { label: "新しい市場を切り拓く事業リーダー", area: "energy" },
      { label: "専門技術を持つエンジニア・スペシャリスト", area: "tech" },
    ],
  },
];

export type DiagnosisResult = {
  key: DiagnosisAreaKey;
  title: string;
  summary: string;
  reasons: string[];
};

export const diagnosisResults: Record<DiagnosisAreaKey, DiagnosisResult> = {
  shipping: {
    key: "shipping",
    title: "海運・造船・港湾",
    summary:
      "日本の貿易の99%以上を支える、海洋産業の背骨ともいえる領域です。外航・内航海運、造船、港湾・物流など、社会を止めないスケールの大きな仕事が集まっています。",
    reasons: [
      "大きな組織やチームで、社会インフラを着実に支える働き方に関心がある",
      "現場運営やプロジェクト推進など、実務を前に進める経験を活かせる",
      "船・港・物流といった、目に見えるスケールの大きさに心が動く",
    ],
  },
  energy: {
    key: "energy",
    title: "海洋資源・エネルギー",
    summary:
      "洋上風力、海底資源、海洋土木など、脱炭素とエネルギー安全保障を背景に急成長している領域です。新しい市場の立ち上げ期だからこそ、事業開発や体制づくりの担い手が求められています。",
    reasons: [
      "エネルギーや環境などの社会課題を、事業を通じて解決したい思いがある",
      "成長市場で新しい事業やプロジェクトを立ち上げる側に回りたい",
      "事業開発やインフラづくりの経験・志向を活かせる",
    ],
  },
  tech: {
    key: "tech",
    title: "海洋テック・データ",
    summary:
      "AUV・ROV・水中ロボット、海洋観測・海洋データ、海洋バイオなど、技術で海の可能性を広げる領域です。研究機関発のスタートアップも多く、専門性を深めながら新しい産業をつくれるフィールドです。",
    reasons: [
      "ロボット・AI・データ活用など、最新技術への関心が強い",
      "エンジニアリングや研究開発、データ分析の経験・志向を活かせる",
      "スタートアップや研究開発の現場で、専門性を磨く働き方に惹かれる",
    ],
  },
};
