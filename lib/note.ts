import type { ExternalContent } from "./supabase";

type NoteContentInput = Pick<
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

export async function fetchNoteRssContents(maxResults = 12): Promise<NoteContentInput[]> {
  const feedUrl = process.env.NOTE_RSS_URL;

  if (!feedUrl) {
    throw new Error("NOTE_RSS_URL is required.");
  }

  const response = await fetch(feedUrl, { cache: "no-store" });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to fetch note RSS: ${message}`);
  }

  const xml = await response.text();
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g));

  return items
    .slice(0, Math.max(1, maxResults))
    .map((match) => normalizeRssItem(match[1]))
    .filter(isNoteContentInput);
}

function normalizeRssItem(itemXml: string): NoteContentInput | null {
  const link = extractTagText(itemXml, "link");
  const guid = extractTagText(itemXml, "guid") ?? link;
  const title = extractTagText(itemXml, "title");

  if (!link || !guid || !title) {
    return null;
  }

  const descriptionHtml = extractCdata(itemXml, "description") ?? "";
  const thumbnail = extractTagText(itemXml, "media:thumbnail");
  const pubDate = extractTagText(itemXml, "pubDate");
  const creatorName = extractTagText(itemXml, "note:creatorName");
  const creatorImage = extractTagText(itemXml, "note:creatorImage");

  return {
    source: "note",
    source_id: guid,
    source_url: link,
    title: cleanText(title),
    description: cleanText(stripTags(descriptionHtml)) || null,
    thumbnail_url: thumbnail ?? null,
    published_at: pubDate ? new Date(pubDate).toISOString() : null,
    status: "draft",
    category: "note",
    audience: "all",
    metadata: {
      creator_name: creatorName,
      creator_image: creatorImage,
    },
    source_content_id: null,
  } satisfies NoteContentInput;
}

function extractCdata(xml: string, tag: string) {
  return xml.match(new RegExp(`<${escapeRegExp(tag)}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escapeRegExp(tag)}>`))?.[1];
}

function extractTagText(xml: string, tag: string) {
  const escapedTag = escapeRegExp(tag);
  const value = xml.match(new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`))?.[1];
  if (!value) {
    return null;
  }
  const cdata = value.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/)?.[1];
  return cleanText(cdata ?? value) || null;
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function cleanText(value: string) {
  return decodeXmlEntities(value).replace(/\s+/g, " ").trim();
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isNoteContentInput(content: NoteContentInput | null): content is NoteContentInput {
  return content !== null;
}
