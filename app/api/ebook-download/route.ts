import { NextResponse } from "next/server";
import { renderEbookPdf } from "@/lib/ebook-pdf";
import type { EbookMetadata } from "@/lib/ebook";
import { hasResendConfig, sendContactNotificationEmail } from "@/lib/email";
import {
  getExternalContentById,
  hasSupabaseWriteConfig,
  insertContactSubmission,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields; pretend success and discard.
  const website = typeof body.website === "string" ? body.website.trim() : "";
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().slice(0, 320) : "";
  const id = typeof body.id === "string" ? body.id.trim().slice(0, 100) : "";

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください。" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "eBookが見つかりません。" }, { status: 400 });
  }

  const record = await getExternalContentById(id).catch(() => null);
  if (!record || record.source !== "ebook" || record.status !== "published") {
    return NextResponse.json({ error: "eBookが見つかりません。" }, { status: 404 });
  }

  const metadata = record.metadata as unknown as EbookMetadata;
  if (!metadata?.ebook) {
    return NextResponse.json({ error: "eBookの内容を取得できませんでした。" }, { status: 500 });
  }

  const submission = {
    name: null,
    company: null,
    email,
    topic: "ebook_download",
    message: `eBookをダウンロード\nタイトル: ${record.title}\nカテゴリ: ${record.category ?? "-"}\n元記事: ${record.source_url}`,
  };

  let saved = false;
  try {
    await insertContactSubmission(submission);
    saved = true;
  } catch (error) {
    console.error("Failed to save ebook download lead:", error);
  }

  let notified = false;
  if (hasResendConfig()) {
    try {
      await sendContactNotificationEmail(submission);
      notified = true;
    } catch (error) {
      console.error("Failed to send ebook download notification:", error);
    }
  }

  // PDFはメール登録と引き換え。リード保存も通知も失敗したら発行しない
  // (どちらも未設定のローカル開発時は素通し)。
  const leadServicesConfigured = hasSupabaseWriteConfig() || hasResendConfig();
  if (leadServicesConfigured && !saved && !notified) {
    return NextResponse.json(
      { error: "ダウンロードの発行に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }

  try {
    const pdf = await renderEbookPdf(metadata.ebook, record.source_url);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ocean-quest-ebook.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to render ebook PDF:", error);
    return NextResponse.json(
      { error: "PDFの生成に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }
}
