import type { ExternalContent } from "./supabase";

type YouTubePlaylistResponse = {
  items?: YouTubePlaylistItem[];
  nextPageToken?: string;
};

type YouTubeChannelResponse = {
  items?: Array<{
    id?: string;
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
};

type YouTubePlaylistItem = {
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    resourceId?: {
      videoId?: string;
    };
    thumbnails?: {
      maxres?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

export type YouTubeContentInput = Pick<
  ExternalContent,
  | "source"
  | "source_id"
  | "source_url"
  | "title"
  | "description"
  | "thumbnail_url"
  | "published_at"
  | "status"
  | "category"
  | "audience"
  | "metadata"
  | "source_content_id"
>;

export async function fetchYouTubePlaylistContents(
  maxResults = 12,
): Promise<YouTubeContentInput[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistId = await resolveYouTubePlaylistId(apiKey);

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is required.");
  }

  const params = new URLSearchParams({
    part: "snippet",
    maxResults: String(Math.min(maxResults, 50)),
    playlistId,
    key: apiKey,
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to fetch YouTube playlist items: ${message}`);
  }

  const data = (await response.json()) as YouTubePlaylistResponse;
  const contents = (data.items ?? []).map(normalizePlaylistItem).filter(isYouTubeContentInput);

  // 本編/ショートを判定して metadata.is_short に保存する(動画ページの上下振り分けに使用)
  await Promise.all(
    contents.map(async (content) => {
      const isShort = await detectYouTubeShort(content.source_id);
      if (isShort !== null) {
        content.metadata = { ...content.metadata, is_short: isShort };
      }
    }),
  );

  return contents;
}

// ショート動画は https://www.youtube.com/shorts/<id> が 200 を返し、
// 本編動画は /watch へのリダイレクト(303)になることを利用して判定する。
// 判定できない場合は null(既存のmetadataを上書きしない)
async function detectYouTubeShort(videoId: string): Promise<boolean | null> {
  try {
    const response = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: "HEAD",
      redirect: "manual",
      cache: "no-store",
      headers: { "user-agent": "Mozilla/5.0" },
    });
    if (response.status === 200) {
      return true;
    }
    if (response.status >= 300 && response.status < 400) {
      return false;
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveYouTubePlaylistId(apiKey?: string) {
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID;

  if (playlistId) {
    return playlistId;
  }

  const handle = process.env.YOUTUBE_CHANNEL_HANDLE;

  if (!apiKey || !handle) {
    throw new Error(
      "YOUTUBE_PLAYLIST_ID or YOUTUBE_CHANNEL_HANDLE is required with YOUTUBE_API_KEY.",
    );
  }

  const params = new URLSearchParams({
    part: "contentDetails",
    forHandle: handle,
    key: apiKey,
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to resolve YouTube channel handle: ${message}`);
  }

  const data = (await response.json()) as YouTubeChannelResponse;
  const uploadsPlaylistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error(`No uploads playlist found for YouTube handle: ${handle}`);
  }

  return uploadsPlaylistId;
}

function normalizePlaylistItem(item: YouTubePlaylistItem): YouTubeContentInput | null {
  const snippet = item.snippet;
  const videoId = snippet?.resourceId?.videoId;
  const title = snippet?.title;

  if (!videoId || !title || title === "Deleted video" || title === "Private video") {
    return null;
  }

  return {
    source: "youtube",
    source_id: videoId,
    source_url: `https://www.youtube.com/watch?v=${videoId}`,
    title,
    description: snippet?.description ?? null,
    thumbnail_url:
      snippet?.thumbnails?.maxres?.url ??
      snippet?.thumbnails?.high?.url ??
      snippet?.thumbnails?.medium?.url ??
      snippet?.thumbnails?.default?.url ??
      null,
    published_at: snippet?.publishedAt ?? null,
    status: "draft",
    category: "動画",
    audience: "all",
    metadata: {
      embed_url: `https://www.youtube.com/embed/${videoId}`,
    },
    source_content_id: null,
  } satisfies YouTubeContentInput;
}

function isYouTubeContentInput(
  content: YouTubeContentInput | null,
): content is YouTubeContentInput {
  return content !== null;
}
