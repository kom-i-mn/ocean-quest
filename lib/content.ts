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

export const diagnosisQuestions = [
  {
    question: "いま一番関心があるテーマは？",
    options: ["海洋技術", "社会課題", "グローバル事業", "研究開発"],
  },
  {
    question: "経験を活かしたい領域は？",
    options: ["事業開発", "エンジニアリング", "採用・組織", "プロジェクト推進"],
  },
  {
    question: "今の検討状況は？",
    options: ["情報収集中", "転職相談したい", "採用相談したい", "協業先を探したい"],
  },
];
