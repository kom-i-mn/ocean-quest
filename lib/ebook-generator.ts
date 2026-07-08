import Anthropic from "@anthropic-ai/sdk";

// note記事をeBook構造にリライトする。
// PM Questの分析に基づく方針:
//  - eBook化するのは「体系的に学べるノウハウ・解説・ガイド系」の記事のみ
//    (お知らせ・募集・雑記・イベントレポートは対象外) — 判定もモデルに任せる
//  - シリーズ(カテゴリ)に分類し、サムネイル配色・棚の並びに使う

export const ebookCategories = [
  "業界理解",
  "職種・キャリア",
  "転職ノウハウ",
  "市場・データ",
  "企業・現場研究",
] as const;

export type EbookCategory = (typeof ebookCategories)[number];

export type EbookChapter = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type EbookContent = {
  title: string;
  subtitle: string;
  category: EbookCategory;
  summary: string;
  targetAudience: string[];
  chapters: EbookChapter[];
  keyTakeaways: string[];
};

export type EbookGenerationResult =
  | { suitable: true; reason: string; ebook: EbookContent }
  | { suitable: false; reason: string };

export function hasEbookGeneratorConfig() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const outputSchema = {
  type: "object",
  properties: {
    suitable: {
      type: "boolean",
      description:
        "この記事をeBook化すべきか。体系的に学べるノウハウ・解説・ガイド系ならtrue。お知らせ・募集・雑記・単発のイベントレポートはfalse。",
    },
    reason: {
      type: "string",
      description: "判定理由(1文)",
    },
    ebook: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description:
            "eBookとしてのタイトル。元記事のタイトルを踏襲しつつ、資料らしく整える(例:「〜の教科書」「〜完全ガイド」等の型は乱用しない)",
        },
        subtitle: { type: "string", description: "サブタイトル(1文)" },
        category: {
          type: "string",
          enum: [...ebookCategories],
          description: "シリーズ分類",
        },
        summary: {
          type: "string",
          description: "このeBookで何がわかるか(2〜3文。一覧ページの紹介文になる)",
        },
        targetAudience: {
          type: "array",
          items: { type: "string" },
          description: "想定読者(2〜3項目)",
        },
        chapters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              heading: { type: "string" },
              paragraphs: {
                type: "array",
                items: { type: "string" },
                description: "本文段落(各2〜4文)。話し言葉を資料の文体に直す",
              },
              bullets: {
                type: "array",
                items: { type: "string" },
                description: "要点の箇条書き(なければ空配列)",
              },
            },
            required: ["heading", "paragraphs", "bullets"],
            additionalProperties: false,
          },
          description: "章立て(3〜6章)。元記事の構造を活かして再構成する",
        },
        keyTakeaways: {
          type: "array",
          items: { type: "string" },
          description: "この資料の重要ポイント(3〜5項目)",
        },
      },
      required: [
        "title",
        "subtitle",
        "category",
        "summary",
        "targetAudience",
        "chapters",
        "keyTakeaways",
      ],
      additionalProperties: false,
    },
  },
  required: ["suitable", "reason", "ebook"],
  additionalProperties: false,
} as const;

const systemPrompt = `あなたはOcean Quest(海洋産業特化のキャリア支援サービス、運営:株式会社ポテンシャライト)の編集者です。noteで公開したブログ記事を、無料ダウンロード資料(eBook)向けの構成にリライトします。

方針:
- eBook化に値するのは「読者が体系的に学べるノウハウ・解説・ガイド系」の記事だけです。お知らせ、採用募集、雑記、単発のイベントレポートは suitable: false にしてください(その場合も ebook フィールドは形式上埋めますが内容は最小限で構いません)。
- 文体は「です・ます」調の資料体。noteの口語表現・呼びかけ・絵文字は資料らしい表現に直します。
- 情報は元記事に忠実に。数値・事例・固有名詞を勝手に追加・変更しない。元記事にない知識で水増ししない。
- 章立ては元記事の見出し構造を活かしつつ、資料として読みやすい3〜6章に再構成します。
- 読者は海洋産業への転職・情報収集に関心がある人、または海洋産業の採用担当者です。`;

export async function generateEbookFromArticle({
  title,
  bodyText,
  sourceUrl,
}: {
  title: string;
  bodyText: string;
  sourceUrl: string;
}): Promise<EbookGenerationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const client = new Anthropic({ apiKey });

  // 長すぎる記事は入力を安全な範囲に丸める(通常のnote記事はこの範囲に収まる)
  const body = bodyText.length > 30000 ? `${bodyText.slice(0, 30000)}\n…(以下略)` : bodyText;

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: outputSchema },
    },
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `次のnote記事をeBook化してください。\n\n記事URL: ${sourceUrl}\n記事タイトル: ${title}\n\n--- 記事本文 ---\n${body}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    return { suitable: false, reason: "モデルが処理を拒否しました" };
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("eBook generation hit the max_tokens limit.");
  }

  const text = response.content.find((block) => block.type === "text")?.text;
  if (!text) {
    throw new Error("eBook generation returned no text content.");
  }

  const parsed = JSON.parse(text) as {
    suitable: boolean;
    reason: string;
    ebook: EbookContent;
  };

  if (!parsed.suitable) {
    return { suitable: false, reason: parsed.reason };
  }

  return { suitable: true, reason: parsed.reason, ebook: parsed.ebook };
}
