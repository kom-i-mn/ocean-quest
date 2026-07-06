import { ArrowUpRight, PlayCircle } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { listYouTubeContents } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await listYouTubeContents();

  return (
    <main className="subpage-shell subpage-bg-shark">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">Videos</p>
        <h1>海洋産業を動画で学ぶ</h1>
        <p>
          YouTubeに投稿した対談、業界解説、職種解説を取り込み、Ocean Questの動画ライブラリとして表示します。
        </p>
      </section>

      <section className="section video-library" aria-label="動画一覧">
        {videos.length > 0 ? (
          videos.map((video) => (
            <article className="video-card" key={video.id}>
              <a className="video-thumb" href={video.source_url} target="_blank" rel="noreferrer">
                {video.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={video.thumbnail_url} alt={video.title} />
                ) : (
                  <span>
                    <PlayCircle size={38} />
                  </span>
                )}
                <span className="video-play">
                  <PlayCircle size={20} />
                </span>
              </a>
              <div className="video-card-body">
                <p className="content-type">{video.category ?? "動画"}</p>
                <h2>{video.title}</h2>
                <p>{video.description || "YouTubeから取り込んだ動画コンテンツです。"}</p>
                <div className="card-meta">
                  <time dateTime={video.published_at ?? video.created_at}>
                    {formatDate(video.published_at ?? video.created_at)}
                  </time>
                  <a href={video.source_url} target="_blank" rel="noreferrer">
                    YouTubeで見る
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <PlayCircle size={28} />
            <h2>動画連携の準備中です</h2>
            <p>
              SupabaseとYouTube APIの環境変数を設定し、Cronを実行すると、DBに保存された動画がここに表示されます。
            </p>
          </div>
        )}
      </section>

      <section className="company-cta">
        <div>
          <p className="section-kicker">Next Action</p>
          <h2>動画から、海洋産業の理解を深める</h2>
          <p>専門家対談や職種解説を蓄積し、求職者と企業の意思決定に使える知識に変えていきます。</p>
        </div>
        <a className="primary-button" href="/contact">
          相談する
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
