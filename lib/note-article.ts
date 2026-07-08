// note.com記事の全文取得。
// RSSは冒頭の抜粋しか含まないため、公開APIの /api/v3/notes/{key} から本文HTMLを取得する。

export type NoteArticle = {
  key: string;
  title: string;
  bodyText: string;
  eyecatchUrl: string | null;
  publishedAt: string | null;
};

/** note記事URL(例: https://note.com/user/n/n4f0c7b884789)からnote keyを取り出す */
export function extractNoteKey(noteUrl: string): string | null {
  try {
    const url = new URL(noteUrl);
    const match = url.pathname.match(/\/n\/(n[0-9a-f]+)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function fetchNoteArticle(noteUrl: string): Promise<NoteArticle> {
  const key = extractNoteKey(noteUrl);
  if (!key) {
    throw new Error(`Could not extract note key from URL: ${noteUrl}`);
  }

  const response = await fetch(`https://note.com/api/v3/notes/${key}`, {
    headers: {
      "User-Agent": "OceanQuestBot/1.0 (+https://ocean-quest.jp)",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`note API request failed: ${response.status} for ${key}`);
  }

  const payload = (await response.json()) as {
    data?: {
      name?: string;
      body?: string;
      eyecatch?: string;
      publish_at?: string;
    };
  };

  const data = payload.data;
  if (!data?.body) {
    throw new Error(`note API returned no body for ${key}`);
  }

  return {
    key,
    title: data.name ?? "",
    bodyText: htmlToText(data.body),
    eyecatchUrl: data.eyecatch ?? null,
    publishedAt: data.publish_at ?? null,
  };
}

/** 記事本文HTMLを、見出し構造を残したプレーンテキストに変換する */
function htmlToText(html: string): string {
  return (
    html
      // 見出しはマーカー付きで残す(リライト時に章構造の手がかりになる)
      .replace(/<h([1-6])[^>]*>/gi, "\n\n## ")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/(p|div|ul|ol|blockquote|figure)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
