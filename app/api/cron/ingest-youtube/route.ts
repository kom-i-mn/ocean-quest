import { NextResponse } from "next/server";
import { fetchYouTubePlaylistContents } from "@/lib/youtube";
import { hasSupabaseWriteConfig, upsertExternalContents } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseWriteConfig()) {
    return NextResponse.json(
      { error: "Supabase write environment variables are not configured." },
      { status: 500 },
    );
  }

  try {
    const maxResults = Number(process.env.YOUTUBE_INGEST_LIMIT ?? "12");
    const contents = await fetchYouTubePlaylistContents(maxResults);
    const savedContents = await upsertExternalContents(contents);

    return NextResponse.json({
      ok: true,
      source: "youtube",
      fetched: contents.length,
      saved: savedContents.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "YouTube ingest failed.",
      },
      { status: 500 },
    );
  }
}
