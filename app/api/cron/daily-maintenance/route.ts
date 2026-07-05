import { NextResponse } from "next/server";
import { generateDailyAnalyticsReport } from "@/lib/analytics";
import { hasGoogleAnalyticsConfig } from "@/lib/google-auth";
import { fetchNoteRssContents } from "@/lib/note";
import {
  hasSupabaseWriteConfig,
  upsertAnalyticsReport,
  upsertExternalContents,
} from "@/lib/supabase";
import { fetchYouTubePlaylistContents } from "@/lib/youtube";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseWriteConfig()) {
    return NextResponse.json(
      { error: "Supabase write environment variables are not configured." },
      { status: 500 },
    );
  }

  const results: Record<string, unknown> = {};

  try {
    const youtubeLimit = Number(process.env.YOUTUBE_INGEST_LIMIT ?? "12");
    const youtubeContents = await fetchYouTubePlaylistContents(youtubeLimit);
    const savedYouTubeContents = await upsertExternalContents(youtubeContents);
    results.youtube = {
      fetched: youtubeContents.length,
      saved: savedYouTubeContents.length,
    };
  } catch (error) {
    results.youtube = {
      skipped: true,
      error: error instanceof Error ? error.message : "YouTube ingest failed.",
    };
  }

  try {
    const noteLimit = Number(process.env.NOTE_INGEST_LIMIT ?? "12");
    const noteContents = await fetchNoteRssContents(noteLimit);
    const savedNoteContents = await upsertExternalContents(noteContents);
    results.note = {
      fetched: noteContents.length,
      saved: savedNoteContents.length,
    };
  } catch (error) {
    results.note = {
      skipped: true,
      error: error instanceof Error ? error.message : "note ingest failed.",
    };
  }

  if (hasGoogleAnalyticsConfig()) {
    try {
      const report = await generateDailyAnalyticsReport();
      const savedReports = await upsertAnalyticsReport(report);
      results.analytics = {
        report_date: report.report_date,
        saved: savedReports.length,
      };
    } catch (error) {
      results.analytics = {
        skipped: true,
        error: error instanceof Error ? error.message : "Analytics report failed.",
      };
    }
  } else {
    results.analytics = {
      skipped: true,
      reason:
        "GA4_PROPERTY_ID, SEARCH_CONSOLE_SITE_URL, and Google service account credentials are required.",
    };
  }

  return NextResponse.json({
    ok: true,
    results,
  });
}
