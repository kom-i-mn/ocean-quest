import { NextResponse } from "next/server";
import { fetchNoteRssContents } from "@/lib/note";
import { hasSupabaseWriteConfig, upsertExternalContents } from "@/lib/supabase";

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

  try {
    const maxResults = Number(process.env.NOTE_INGEST_LIMIT ?? "12");
    const contents = await fetchNoteRssContents(maxResults);
    const savedContents = await upsertExternalContents(contents);

    return NextResponse.json({
      ok: true,
      source: "note",
      fetched: contents.length,
      saved: savedContents.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "note ingest failed.",
      },
      { status: 500 },
    );
  }
}
