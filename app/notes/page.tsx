import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { listNoteContents } from "@/lib/supabase";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "海洋産業を読み解くnote記事 | Ocean Quest",
  description:
    "海洋産業の可能性、技術、職種、採用、キャリアをOcean Questの視点で解説するnote記事一覧。ニュースだけでは見えない業界の文脈をわかりやすく言語化します。",
  path: "/notes",
});

export default async function NotesPage() {
  const notes = await listNoteContents().catch(() => []);

  return (
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/jellyfish-dark.jpg')" }} />
        <div className="rd-sub-hero-inner">
          <p className="rd-kicker-w rd-rv">NOTE — 読み物</p>
          <h1 className="rd-rv rd-rv-slow">
            海洋産業の今と、
            <br />
            これからを読む。
          </h1>
          <p className="rd-lead-w rd-rv rd-rv-slow">
            海洋産業の可能性、技術、職種、採用、キャリアについて、Ocean
            Questの視点で解説します。ニュースだけでは見えにくい業界の文脈を、わかりやすく言語化していきます。
          </p>
        </div>
      </section>

      <section className="rd-sec" id="notes" aria-label="note記事一覧">
        <div className="rd-rv">
          <p className="rd-kicker">ARTICLES</p>
          <h2 className="rd-title">
            ニュースの<em>行間</em>を、読み解く。
          </h2>
        </div>
        {notes.length > 0 ? (
          <div className="rd-media-list">
            {notes.map((note) => (
              <article className="rd-media-row rd-rv" key={note.id}>
                <a
                  className="rd-media-thumb"
                  href={note.source_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${note.title}をnoteで読む`}
                >
                  {note.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={note.thumbnail_url} alt={note.title} />
                  ) : (
                    <span>note</span>
                  )}
                </a>
                <div>
                  <p className="rd-media-cat">{note.category ?? "note"}</p>
                  <h2>{note.title}</h2>
                  <p className="rd-d">{note.description || "noteから取り込んだ記事コンテンツです。"}</p>
                  <div className="rd-media-meta">
                    <time dateTime={note.published_at ?? note.created_at}>
                      {formatDate(note.published_at ?? note.created_at)}
                    </time>
                    <a className="rd-link" href={note.source_url} target="_blank" rel="noreferrer">
                      noteで読む
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rd-tbc rd-rv">
            <p className="rd-t">To Be Continued</p>
            <p className="rd-d">海洋産業の今とこれからを読み解く記事を、順次公開していきます。</p>
          </div>
        )}
      </section>

      <section className="rd-final rd-sub-final">
        <div className="rd-final-bg" style={{ backgroundImage: "url('/images/backgrounds/sun-jellyfish.jpg')" }} />
        <div className="rd-final-inner">
          <h2 className="rd-rv rd-rv-slow">読むほど、海は近くなる。</h2>
          <p className="rd-final-sub rd-rv rd-rv-slow">気になった記事があれば、そこから話しましょう。相談は無料です。</p>
          <div className="rd-final-ctas rd-rv">
            <a
              className="rd-btn rd-btn-primary"
              href="https://note.com/gentle_moraea373"
              target="_blank"
              rel="noreferrer"
            >
              noteで全記事を見る
            </a>
            <a className="rd-btn rd-btn-ghost" href="/contact">
              無料相談する
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
