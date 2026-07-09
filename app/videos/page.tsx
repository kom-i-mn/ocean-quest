import { ArrowUpRight, PlayCircle } from "lucide-react";
import { ProfileCta } from "@/components/ProfileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { listYouTubeContents } from "@/lib/supabase";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "動画で学ぶ海洋産業 | Ocean Quest",
  description:
    "海洋産業の仕事、技術、企業、キャリアの可能性を対談・解説動画で紹介。AUV、洋上風力、海運・造船など、海の仕事をわかりやすく学べる動画ライブラリです。",
  path: "/videos",
});

export default async function VideosPage() {
  const videos = await listYouTubeContents().catch(() => []);

  return (
    <main className="subpage-shell subpage-bg-shark">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">Videos</p>
        <h1>海洋産業を、動画でわかりやすく。</h1>
        <p>
          海洋産業の仕事、技術、企業、キャリアの可能性を、対談や解説動画で届けます。まだ業界に詳しくない方でも、まずは興味のあるテーマから学べる動画ライブラリです。
        </p>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="#videos">
            動画を見る
            <ArrowUpRight size={18} />
          </a>
          <a className="secondary-button light" href="/contact">
            キャリア相談する
          </a>
        </div>
      </section>

      <section className="section video-library" id="videos" aria-label="動画一覧">
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
            <h2>To Be Continued</h2>
            <p>海洋産業の仕事や技術をわかりやすく学べる動画を、順次公開していきます。</p>
          </div>
        )}
      </section>

      <ProfileCta primaryLabel="無料でキャリア相談する" />
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
