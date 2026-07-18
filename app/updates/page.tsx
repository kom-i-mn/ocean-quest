import type { Metadata } from "next";
import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { fetchMicroCmsNews } from "@/lib/microcms";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "お知らせ | Ocean Quest",
  description: "Ocean Questからのお知らせ一覧。",
  path: "/updates",
});

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export default async function UpdatesPage() {
  const news = await fetchMicroCmsNews().catch(() => []);

  return (
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/jellyfish-dark.jpg')" }} />
        <div className="rd-sub-hero-inner">
          <p className="rd-kicker-w rd-rv">UPDATES — お知らせ</p>
          <h1 className="rd-rv rd-rv-slow">Ocean Questからの、お知らせ。</h1>
          <p className="rd-lead-w rd-rv rd-rv-slow">
            このページの内容はmicroCMS（ノーコードCMS）から配信しています。エンジニアの手を借りずに更新できるかどうかの検証ページです。
          </p>
        </div>
      </section>

      <section className="rd-sec" id="updates" aria-label="お知らせ一覧">
        <div className="rd-rv">
          <p className="rd-kicker">NEWS</p>
          <h2 className="rd-title">
            microCMSから、<em>自動反映</em>。
          </h2>
        </div>
        {news.length > 0 ? (
          <div className="rd-media-list">
            {news.map((item) => (
              <article className="rd-media-row rd-rv" key={item.id}>
                <div>
                  <p className="rd-src" style={{ marginBottom: "0.4em" }}>
                    {formatDate(item.publishedAt)}
                    {item.category?.name ? ` ／ ${item.category.name}` : ""}
                  </p>
                  <h3 style={{ margin: 0 }}>{item.title}</h3>
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rd-src">現在お知らせはありません。</p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
