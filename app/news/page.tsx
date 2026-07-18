import type { Metadata } from "next";
import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import {
  newsCategories,
  getAllNews,
  getNewsByCategory,
  searchNews,
  type NewsItem,
} from "@/lib/news";
import { fetchMicroCmsPageHero } from "@/lib/microcms";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "海洋産業ニュース | Ocean Quest",
  description:
    "洋上風力、海底ケーブル、水中ロボティクス、漁業・水産、港湾・海運など、海洋産業に関する国内外の報道をキャリア視点でまとめて読めるニュースコーナーです。",
  path: "/news",
});

const defaultHero = {
  kicker: "OCEAN QUEST NEWS",
  heading: "海洋産業の動きを、\nキャリア視点で読み解く。",
  lead: "洋上風力、海底ケーブル、水中ロボティクス、漁業・水産、港湾・海運など、海洋産業に関する国内外の報道を自動収集しています。見出し・提供元・リンクのみを掲載し、記事本文は各メディアのリンク先でご覧ください。",
};

function buildQuery(params: { q?: string; category?: string }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  const qs = sp.toString();
  return qs ? `/news?${qs}` : "/news";
}

function formatDate(pubDate: string) {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const query = (q ?? "").trim();
  const activeCategory = newsCategories.some((c) => c.slug === category) ? category : undefined;
  const cmsHero = await fetchMicroCmsPageHero("news");
  const hero = cmsHero ?? defaultHero;

  let items: NewsItem[] = [];
  let fetchFailed = false;
  try {
    if (query) {
      items = await searchNews(query);
    } else if (activeCategory) {
      items = await getNewsByCategory(activeCategory);
    } else {
      items = await getAllNews();
    }
  } catch {
    fetchFailed = true;
  }

  const hasFilter = Boolean(query || activeCategory);

  return (
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/port-cranes.jpg')" }} />
        <div className="rd-sub-hero-inner">
          <p className="rd-kicker-w rd-rv">{hero.kicker}</p>
          <h1 className="rd-rv rd-rv-slow">
            {hero.heading.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p className="rd-lead-w rd-rv rd-rv-slow">{hero.lead}</p>
        </div>
      </section>

      <section className="rd-sec" id="news" aria-label="海洋産業ニュース一覧">
        <div className="rd-rv">
          <p className="rd-kicker">HEADLINES</p>
          <h2 className="rd-title">
            海の仕事は、<em>今日も動いている</em>。
          </h2>
        </div>

        <div className="rd-news-filters rd-rv">
          <form className="rd-news-search" action="/news" method="get">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="キーワードで検索（例: 洋上風力 台湾）"
              aria-label="海洋産業ニュースを検索"
            />
            <button type="submit">検索</button>
          </form>

          <div className="rd-news-pills">
            <a href={buildQuery({ q: query })} className={!activeCategory ? "on" : ""}>
              すべて
            </a>
            {newsCategories.map((c) => (
              <a
                key={c.slug}
                href={buildQuery({ category: c.slug })}
                className={activeCategory === c.slug ? "on" : ""}
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>

        {hasFilter && !fetchFailed && (
          <p className="rd-news-count rd-rv">
            {query && <>「{query}」</>}
            {activeCategory && <>【{newsCategories.find((c) => c.slug === activeCategory)?.name}】</>}
            の検索結果 {items.length}件
            <a href="/news">条件をクリア</a>
          </p>
        )}

        {fetchFailed ? (
          <div className="rd-tbc rd-rv">
            <p className="rd-t">ニュースを取得できませんでした</p>
            <p className="rd-d">時間をおいて再度お試しください。</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rd-tbc rd-rv">
            <p className="rd-t">該当するニュースが見つかりませんでした</p>
            <p className="rd-d">キーワードやカテゴリーを変えてお試しください。</p>
          </div>
        ) : (
          <div className="rd-news-list">
            {items.slice(0, 40).map((item) => (
              <a
                key={item.link}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rd-news-row rd-rv"
              >
                <p className="rd-media-cat">
                  {newsCategories.find((c) => c.slug === item.categorySlug)?.name ?? "検索結果"}
                </p>
                <h3>{item.title}</h3>
                <div className="rd-news-meta">
                  <span>{item.source}</span>
                  {item.pubDate && <span>{formatDate(item.pubDate)}</span>}
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="rd-src">
          見出しはGoogleニュース経由で日本語メディアの報道から自動収集しています（1時間ごとに更新）。記事本文の著作権は各配信元に帰属します。内容の詳細・正確性は元記事でご確認ください。
        </p>
      </section>

      <section className="rd-final rd-sub-final">
        <div className="rd-final-bg" style={{ backgroundImage: "url('/images/backgrounds/harbor-sunset.jpg')" }} />
        <div className="rd-final-inner">
          <h2 className="rd-rv rd-rv-slow">
            気になるニュースがあれば、
            <br />
            そこからキャリアを考える。
          </h2>
          <p className="rd-final-sub rd-rv rd-rv-slow">業界の動きと、あなたの経験の相性を診断で確かめられます。</p>
          <div className="rd-final-ctas rd-rv">
            <a className="rd-btn rd-btn-primary" href="/diagnosis">
              キャリア診断をする
            </a>
            <a className="rd-btn rd-btn-ghost" href="/contact">
              無料でキャリア相談する
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
