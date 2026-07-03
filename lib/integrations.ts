import type { ContentItem } from "./content";

type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail?: string;
};

export async function fetchYouTubePlaylist(): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID;

  if (!apiKey || !playlistId) {
    return [];
  }

  const params = new URLSearchParams({
    part: "snippet",
    maxResults: "12",
    playlistId,
    key: apiKey,
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube playlist items.");
  }

  const data = await response.json();

  return data.items.map(
    (item: {
      snippet: {
        resourceId: { videoId: string };
        title: string;
        description: string;
        publishedAt: string;
        thumbnails?: { high?: { url: string }; medium?: { url: string } };
      };
    }) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail:
        item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.medium?.url,
    }),
  );
}

export async function fetchNoteRss(): Promise<ContentItem[]> {
  const feedUrl = process.env.NOTE_RSS_URL;

  if (!feedUrl) {
    return [];
  }

  // Keep this dependency-free for the starter. Replace with a proper RSS parser
  // once the production ingestion workflow is fixed.
  const response = await fetch(feedUrl, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error("Failed to fetch note RSS.");
  }

  const xml = await response.text();
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g));

  return items.slice(0, 12).map((match, index) => {
    const itemXml = match[1];
    const title = extractCdata(itemXml, "title") ?? `note article ${index + 1}`;
    const link = extractText(itemXml, "link") ?? "#";
    const pubDate = extractText(itemXml, "pubDate") ?? new Date().toISOString();
    const description = stripTags(extractCdata(itemXml, "description") ?? "");

    return {
      id: `note-${index}`,
      type: "note",
      title,
      description,
      category: "思想",
      audience: "all",
      publishedAt: new Date(pubDate).toISOString(),
      url: link,
    };
  });
}

function extractCdata(xml: string, tag: string) {
  return xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))?.[1];
}

function extractText(xml: string, tag: string) {
  return xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim();
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
