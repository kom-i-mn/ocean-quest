import { NextResponse } from "next/server";
import { getGoogleServiceAccountEmail, hasGoogleCredentials } from "@/lib/google-auth";
import { hasLeadsSheetConfig, syncLeadsToSheet } from "@/lib/sheets";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * リードのスプレッドシート同期を手動で走らせる。
 * 日次cronと同じ CRON_SECRET で保護する（個人情報を返すので必ず認証を通す）。
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://ocean-quest.jp/api/admin/leads-sync
 *
 * まだ設定できていない場合は、共有すべきサービスアカウントのアドレスを返して
 * セットアップの続きが分かるようにする。
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasGoogleCredentials()) {
    return NextResponse.json(
      { error: "Google service account credentials are not configured." },
      { status: 500 },
    );
  }

  if (!hasLeadsSheetConfig()) {
    return NextResponse.json(
      {
        error: "LEADS_SHEET_ID is not configured.",
        hint: "Googleスプレッドシートを作り、下記アドレスに編集権限を渡してから、URLの /d/ と /edit の間のIDを LEADS_SHEET_ID に設定してください。",
        shareWith: getGoogleServiceAccountEmail(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await syncLeadsToSheet();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Leads sheet sync failed.",
        shareWith: getGoogleServiceAccountEmail(),
      },
      { status: 500 },
    );
  }
}
