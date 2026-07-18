import { RdFx } from "@/components/RdFx";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { listYouTubeContents } from "@/lib/supabase";
import { fetchMicroCmsPageHero } from "@/lib/microcms";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "動画で学ぶ海洋産業 | Ocean Quest",
  description:
    "海洋産業の仕事、技術、企業、キャリアの可能性を対談・解説動画で紹介。AUV、洋上風力、海運・造船など、海の仕事をわかりやすく学べる動画ライブラリです。",
  path: "/videos",
});

const defaultHero = {
  kicker: "VIDEOS — 動画で学ぶ",
  heading: "海洋産業を、\n動画でわかりやすく。",
  lead: "海洋産業の仕事、技術、企業、キャリアの可能性を、対談や解説動画で届けます。まだ業界に詳しくない方でも、興味のあるテーマから学べる動画ライブラリです。",
};

export default async function VideosPage() {
  const [videos, cmsHero] = await Promise.all([
    listYouTubeContents().catch(() => []),
    fetchMicroCmsPageHero("videos"),
  ]);
  const hero = cmsHero ?? defaultHero;
  // metadata.is_short(取り込み時に判定)で本編とショートに振り分ける。未判定は本編扱い
  const mainVideos = videos.filter((video) => video.metadata?.is_short !== true);
  const shortVideos = videos.filter((video) => video.metadata?.is_short === true);

  return (
    <main className="rd">
      <SiteHeader solid />
      <RdFx />

      <section className="rd-sub-hero">
        <div className="rd-sub-hero-bg" style={{ backgroundImage: "url('/images/backgrounds/deep-sea.jpg')" }} />
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

      {/* 本編動画（上層） */}
      <section className="rd-sec" id="videos" aria-label="本編動画一覧">
        <div className="rd-rv">
          <p className="rd-kicker">MAIN — 本編動画</p>
          <h2 className="rd-title">
            ここでしか聞けない話を、<em>じっくり</em>と。
          </h2>
        </div>
        {mainVideos.length > 0 ? (
          <div className="rd-media-list">
            {mainVideos.map((video) => (
              <article className="rd-media-row rd-rv" key={video.id}>
                <a
                  className="rd-media-thumb"
                  href={video.source_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${video.title}をYouTubeで見る`}
                >
                  {video.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={video.thumbnail_url} alt={video.title} />
                  ) : (
                    <span>▶</span>
                  )}
                </a>
                <div>
                  <p className="rd-media-cat">{video.category ?? "動画"}</p>
                  <h2>{video.title}</h2>
                  <div className="rd-media-meta">
                    <time dateTime={video.published_at ?? video.created_at}>
                      {formatDate(video.published_at ?? video.created_at)}
                    </time>
                    <a className="rd-link" href={video.source_url} target="_blank" rel="noreferrer">
                      YouTubeで見る
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rd-tbc rd-rv">
            <p className="rd-t">To Be Continued</p>
            <p className="rd-d">
              海洋産業の仕事や技術をわかりやすく学べる動画を、順次公開していきます。
              <br />
              公開のお知らせは、noteとイベント案内でお届けします。
            </p>
          </div>
        )}
      </section>

      {/* ショート動画（下層） */}
      {shortVideos.length > 0 ? (
        <section className="rd-sec rd-sec-tight" id="shorts" aria-label="ショート動画一覧">
          <div className="rd-rv">
            <p className="rd-kicker">SHORTS — ショート動画</p>
            <h2 className="rd-title">
              まずは<em>60秒</em>で、海をのぞく。
            </h2>
            <p className="rd-lead">通勤の合間に見られる縦型のショート動画。気になったテーマは、本編動画とnoteで深掘りできます。</p>
          </div>
          <div className="rd-shorts-grid">
            {shortVideos.map((video) => (
              <a
                className="rd-short-cell rd-rv"
                href={video.source_url}
                target="_blank"
                rel="noreferrer"
                key={video.id}
              >
                <div className="rd-short-thumb">
                  {video.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={video.thumbnail_url} alt={video.title} />
                  ) : (
                    <span>▶</span>
                  )}
                </div>
                <h3>{video.title}</h3>
                <span className="rd-link">YouTubeで見る</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rd-final rd-sub-final">
        <div className="rd-final-bg" style={{ backgroundImage: "url('/images/backgrounds/journey-jelly.jpg')" }} />
        <div className="rd-final-inner">
          <h2 className="rd-rv rd-rv-slow">
            見て、知って、
            <br />
            それから決めればいい。
          </h2>
          <p className="rd-final-sub rd-rv rd-rv-slow">キャリア相談は無料です。動画の感想からでも、話せます。</p>
          <div className="rd-final-ctas rd-rv">
            <a className="rd-btn rd-btn-primary" href="/contact">
              無料でキャリア相談する
            </a>
            <a className="rd-btn rd-btn-ghost" href="/notes">
              noteの記事を読む
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
