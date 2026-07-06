import { ArrowUpRight, FileText } from "lucide-react";
import { ProfileCta } from "@/components/ProfileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { listNoteContents } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await listNoteContents();

  return (
    <main className="subpage-shell subpage-bg-jellyfish-dark">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">note</p>
        <h1>海洋産業の今と、これからを読む。</h1>
        <p>
          海洋産業の可能性、技術、職種、採用、キャリアについて、Ocean Questの視点で解説します。ニュースだけでは見えにくい業界の文脈を、わかりやすく言語化していきます。
        </p>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="#notes">
            noteを読む
            <ArrowUpRight size={18} />
          </a>
          <a className="secondary-button light" href="/ebooks">
            eBookを見る
          </a>
        </div>
      </section>

      <section className="section note-library" id="notes" aria-label="note記事一覧">
        {notes.length > 0 ? (
          notes.map((note) => (
            <article className="note-card" key={note.id}>
              <a className="note-thumb" href={note.source_url} target="_blank" rel="noreferrer">
                {note.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={note.thumbnail_url} alt={note.title} />
                ) : (
                  <span>
                    <FileText size={34} />
                  </span>
                )}
              </a>
              <div className="note-card-body">
                <p className="content-type">{note.category ?? "note"}</p>
                <h2>{note.title}</h2>
                <p>{note.description || "noteから取り込んだ記事コンテンツです。"}</p>
                <div className="card-meta">
                  <time dateTime={note.published_at ?? note.created_at}>
                    {formatDate(note.published_at ?? note.created_at)}
                  </time>
                  <a href={note.source_url} target="_blank" rel="noreferrer">
                    noteで読む
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <FileText size={28} />
            <h2>To Be Continued</h2>
            <p>海洋産業の今とこれからを読み解く記事を、順次公開していきます。</p>
          </div>
        )}
      </section>

      <ProfileCta
        primaryLabel="noteで全記事を見る"
        primaryHref="https://note.com/gentle_moraea373"
        secondaryLabel="無料相談する"
        secondaryHref="/contact"
      />
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
