import { NextResponse } from "next/server";
import { processEbookGeneration } from "@/lib/ebook";
import { hasSupabaseWriteConfig } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 300;

// note→eBook生成の手動トリガー(バックフィル用)。
// 日次の自動生成は daily-maintenance cron に組み込み済みで、こちらは
// `?limit=N` で一度に複数記事を処理したいときに CRON_SECRET 付きで叩く。
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

  const { searchParams } = new URL(request.url);
  const limit = Math.min(5, Math.max(1, Number(searchParams.get("limit") ?? "1")));

  try {
    const result = await processEbookGeneration(limit);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("eBook generation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "eBook generation failed." },
      { status: 500 },
    );
  }
}
