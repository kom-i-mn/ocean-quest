import { ArrowUpRight, FileText } from "lucide-react";
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
        <h1>思想と解体新書を読む</h1>
        <p>
          noteで公開した記事を取り込み、海洋産業の知識、思想、採用・キャリアの論点として蓄積します。
        </p>
      </section>

      <section className="section note-library" aria-label="note記事一覧">
        {notes.length > 0 ? (
          notes.map((note) => (
            <article className="note-card" key={note.id}>
              <a className="note-thumb" href={note.source_url} target="_blank" rel="noreferrer">
                {note.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={note.thumbnail_url} alt="" />
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
            <h2>note連携の準備中です</h2>
            <p>
              note RSSとSupabaseの環境変数を設定し、Cronを実行すると、DBに保存された記事がここに表示されます。
            </p>
          </div>
        )}
      </section>

      <section className="company-cta">
        <div>
          <p className="section-kicker">Next Action</p>
          <h2>noteの記事を、eBookの種にしていく</h2>
          <p>公開済みの記事を取り込み、次の段階ではeBook下書きやサムネイル生成につなげます。</p>
        </div>
        <a className="primary-button" href="/ebooks">
          eBookを見る
          <ArrowUpRight size={18} />
        </a>
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
