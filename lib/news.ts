import { XMLParser } from "fast-xml-parser";

// Googleニュース検索RSS（無料・APIキー不要）から海洋産業関連の見出しを集めるデータ層。
// 記事本文は転載せず、見出し・提供元・日付・リンクのみを扱う。
// カテゴリー定義はocean-jobs（新規事業調査/ocean-jobs/lib/news.ts）と揃えている。

export type NewsCategory = {
  slug: string;
  name: string;
  query: string;
};

export const newsCategories: NewsCategory[] = [
  { slug: "wind", name: "洋上風力", query: "洋上風力" },
  { slug: "cable", name: "海底ケーブル", query: "海底ケーブル OR 海底通信" },
  { slug: "robotics", name: "水中ロボティクス", query: "水中ロボット OR AUV OR ROV 海洋" },
  { slug: "fishery", name: "漁業・水産", query: "漁業 OR 水産業 OR スマート漁業" },
  {
    slug: "shipping",
    name: "港湾・海運",
    query: "(港湾物流 OR 海運業 OR コンテナ船 OR 港湾工事 OR 港湾整備) -イラン -ホルムズ -ウクライナ -ロシア -軍",
  },
  { slug: "other", name: "海洋資源・その他", query: "海洋資源 OR メタンハイドレート OR 海洋開発" },
];

export type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  categorySlug: string;
};

const parser = new XMLParser({ ignoreAttributes: false });

async function fetchGoogleNewsRss(query: string): Promise<Record<string, unknown>[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    `${query} when:30d`
  )}&hl=ja&gl=JP&ceid=JP:ja`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`news fetch failed: ${res.status}`);

  const xml = await res.text();
  const data = parser.parse(xml);
  const items = data?.rss?.channel?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function toNewsItem(raw: Record<string, unknown>, categorySlug: string): NewsItem | null {
  const rawTitle = raw.title;
  const rawLink = raw.link;
  const title = typeof rawTitle === "string" ? rawTitle : undefined;
  const link = typeof rawLink === "string" ? rawLink : undefined;
  if (!title || !link) return null;

  // Googleニュースのtitleは「見出し - 提供元」形式で来る
  const match = title.match(/^(.*)\s-\s([^-]+)$/);
  const cleanTitle = match ? match[1].trim() : title;

  const rawSource = raw.source as { "#text"?: string } | string | undefined;
  const source =
    (typeof rawSource === "object" ? rawSource?.["#text"] : rawSource) ??
    (match ? match[2].trim() : "");

  return {
    title: cleanTitle,
    link,
    source: source || "不明",
    pubDate: typeof raw.pubDate === "string" ? raw.pubDate : "",
    categorySlug,
  };
}

export async function getNewsByCategory(categorySlug: string): Promise<NewsItem[]> {
  const category = newsCategories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  const raw = await fetchGoogleNewsRss(category.query);
  return raw
    .map((r) => toNewsItem(r, category.slug))
    .filter((n): n is NewsItem => Boolean(n));
}

export async function getAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    newsCategories.map((c) => getNewsByCategory(c.slug))
  );
  const items = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  const seen = new Set<string>();
  const deduped = items.filter((item) => {
    if (seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });

  return deduped.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

export async function searchNews(keyword: string): Promise<NewsItem[]> {
  const raw = await fetchGoogleNewsRss(keyword);
  return raw
    .map((r) => toNewsItem(r, "search"))
    .filter((n): n is NewsItem => Boolean(n));
}
