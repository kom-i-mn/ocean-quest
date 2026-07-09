import { ArrowUpRight } from "lucide-react";
import { EbookCard } from "@/components/EbookCard";
import { ProfileCta } from "@/components/ProfileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { listEbookContents } from "@/lib/supabase";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "eBook | 海洋産業の採用・キャリア資料 | Ocean Quest",
  description:
    "海洋産業の業界理解・職種理解・転職ノウハウ・市場データを体系的にまとめた無料eBookライブラリ。noteの発信を資料化し、メールアドレスのみでダウンロードできます。",
  path: "/ebooks",
});

export default async function EbooksPage() {
  const ebooks = await listEbookContents(48).catch(() => []);

  return (
    <main className="subpage-shell subpage-bg-bubbles">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">eBooks</p>
        <h1>海洋産業の採用・キャリアを、体系的に学ぶ。</h1>
        <p>
          noteで発信してきた知見を、保存して読み返せる資料(eBook)にまとめています。すべてメールアドレスのご登録のみ・無料でダウンロードできます。noteの新着記事も、順次eBook化していきます。
        </p>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="#ebooks">
            eBookを見る
            <ArrowUpRight size={18} />
          </a>
          <a className="secondary-button light" href="/notes">
            noteの記事一覧へ
          </a>
        </div>
      </section>

      <section className="section ebook-library" id="ebooks" aria-label="eBook一覧">
        {ebooks.length > 0 ? (
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
        ) : (
          <div className="ebook-empty">
            <p>
              最初のeBookを準備中です。それまでは<a href="/notes">noteの記事一覧</a>をご覧ください。
            </p>
          </div>
        )}
      </section>

      <ProfileCta primaryLabel="無料でキャリア相談する" />
      <SiteFooter />
    </main>
  );
}
