import { EbookCard } from "@/components/EbookCard";
import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { listEbookContents } from "@/lib/supabase";
import { fetchMicroCmsPageHero } from "@/lib/microcms";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "eBook | 海洋産業の採用・キャリア資料 | Ocean Quest",
  description:
    "海洋産業の業界理解・職種理解・転職ノウハウ・市場データを体系的にまとめた無料eBookライブラリ。noteの発信を資料化し、メールアドレスのみでダウンロードできます。",
  path: "/ebooks",
});

const defaultHero = {
  kicker: "EBOOKS — 無料ダウンロード資料",
  heading: "海洋産業の採用とキャリアを、\n体系的に学ぶ。",
  lead: "noteで発信してきた知見を、保存して読み返せる資料にまとめています。すべてメールアドレスのご登録のみ・無料でダウンロードできます。",
};

export default async function EbooksPage() {
  const [ebooks, cmsHero] = await Promise.all([
    listEbookContents(48).catch(() => []),
    fetchMicroCmsPageHero("ebooks"),
  ]);
  const hero = cmsHero ?? defaultHero;

  return (
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/bubbles.jpg')" }} />
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

      <section className="rd-sec" id="ebooks" aria-label="eBook一覧">
        <div className="rd-rv">
          <p className="rd-kicker">LIBRARY</p>
          <h2 className="rd-title">
            読み流すためではなく、<em>手元に置く</em>ための資料。
          </h2>
        </div>
        {ebooks.length > 0 ? (
          <div className="rd-ebook-wrap rd-rv">
            <div className="ebook-grid">
              {ebooks.map((ebook) => (
                <EbookCard
                  key={ebook.id}
                  id={ebook.id}
                  title={ebook.title}
                  summary={ebook.description ?? ""}
                  category={ebook.category}
                  coverUrl={ebook.thumbnail_url}
                  sourceUrl={ebook.source_url}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rd-tbc rd-rv">
            <p className="rd-t">最初のeBookを、準備中。</p>
            <p className="rd-d">
              noteの新着記事も、順次eBook化していきます。
              <br />
              それまでは、<a href="/notes" style={{ borderBottom: "1px solid currentColor" }}>noteの記事一覧</a>
              をご覧ください。
            </p>
          </div>
        )}
      </section>

      <section className="rd-final rd-sub-final">
        <div className="rd-final-bg" style={{ backgroundImage: "url('/images/backgrounds/blue-water.jpg')" }} />
        <div className="rd-final-inner">
          <h2 className="rd-rv rd-rv-slow">まず1冊、手元に。</h2>
          <p className="rd-final-sub rd-rv rd-rv-slow">メールアドレスのみ・無料。営業のご連絡はしません。</p>
          <div className="rd-final-ctas rd-rv">
            <a className="rd-btn rd-btn-primary" href="/notes">
              noteの記事一覧へ
            </a>
            <a className="rd-btn rd-btn-ghost" href="/contact">
              キャリア相談する
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
