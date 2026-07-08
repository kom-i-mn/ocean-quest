import {
  generateEbookFromArticle,
  hasEbookGeneratorConfig,
  type EbookContent,
} from "./ebook-generator";
import { extractNoteKey, fetchNoteArticle } from "./note-article";
import {
  listAllEbookRecords,
  listNoteContents,
  upsertExternalContents,
  type ExternalContent,
} from "./supabase";

// note→eBookの自動生成パイプライン。
// 毎朝のcron(daily-maintenance)と手動トリガー(/api/cron/generate-ebooks)から呼ばれる。
// 判定結果は成否に関わらずeBookレコードとして保存する:
//  - eBook化された記事      → status: published(/ebooksに表示)
//  - eBook化に不向きな記事  → status: archived(再処理しないためのマーカー)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ocean-quest.jp";

export type EbookMetadata = {
  ebook: EbookContent;
  generation: {
    model: string;
    generated_at: string;
    source_note_url: string;
    reason: string;
  };
};

export function buildEbookCoverUrl(title: string, category: string) {
  const params = new URLSearchParams({ title, category });
  return `${siteUrl}/api/ebook-cover?${params.toString()}`;
}

export async function processEbookGeneration(limit = 1) {
  if (!hasEbookGeneratorConfig()) {
    return {
      skipped: true,
      reason: "ANTHROPIC_API_KEY is not configured.",
    };
  }

  const [notes, ebookRecords] = await Promise.all([
    listNoteContents(100),
    listAllEbookRecords(500),
  ]);

  const processedNoteIds = new Set(
    ebookRecords.map((record) => record.source_content_id).filter(Boolean),
  );
  const processedSourceIds = new Set(ebookRecords.map((record) => record.source_id));

  const pending = notes.filter((note) => {
    if (processedNoteIds.has(note.id)) return false;
    const key = extractNoteKey(note.source_url);
    return key ? !processedSourceIds.has(`ebook-${key}`) : false;
  });

  const results: Array<Record<string, unknown>> = [];

  for (const note of pending.slice(0, Math.max(1, limit))) {
    try {
      const result = await processSingleNote(note);
      results.push(result);
    } catch (error) {
      results.push({
        note: note.title,
        error: error instanceof Error ? error.message : "eBook generation failed.",
      });
    }
  }

  return {
    pending: pending.length,
    processed: results.length,
    results,
  };
}

async function processSingleNote(note: ExternalContent) {
  const key = extractNoteKey(note.source_url);
  if (!key) {
    throw new Error(`Could not extract note key from ${note.source_url}`);
  }

  const article = await fetchNoteArticle(note.source_url);

  // 短すぎる記事は生成コストをかけずに対象外として記録
  if (article.bodyText.length < 1200) {
    await saveEbookRecord(note, key, null, "本文が短いためeBook化の対象外");
    return { note: note.title, suitable: false, reason: "too short" };
  }

  const generation = await generateEbookFromArticle({
    title: article.title || note.title,
    bodyText: article.bodyText,
    sourceUrl: note.source_url,
  });

  if (!generation.suitable) {
    await saveEbookRecord(note, key, null, generation.reason);
    return { note: note.title, suitable: false, reason: generation.reason };
  }

  await saveEbookRecord(note, key, generation.ebook, generation.reason);
  return {
    note: note.title,
    suitable: true,
    ebookTitle: generation.ebook.title,
    category: generation.ebook.category,
  };
}

async function saveEbookRecord(
  note: ExternalContent,
  noteKey: string,
  ebook: EbookContent | null,
  reason: string,
) {
  const metadata: Record<string, unknown> = {
    generation: {
      model: "claude-opus-4-8",
      generated_at: new Date().toISOString(),
      source_note_url: note.source_url,
      reason,
    },
  };
  if (ebook) {
    metadata.ebook = ebook;
  }

  await upsertExternalContents([
    {
      source: "ebook",
      source_id: `ebook-${noteKey}`,
      source_url: note.source_url,
      title: ebook ? ebook.title : note.title,
      description: ebook ? ebook.summary : reason,
      thumbnail_url: ebook ? buildEbookCoverUrl(ebook.title, ebook.category) : null,
      published_at: note.published_at,
      status: ebook ? "published" : "archived",
      category: ebook ? ebook.category : null,
      audience: null,
      metadata,
      source_content_id: note.id,
    },
  ]);
}
