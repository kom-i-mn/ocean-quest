import { NextResponse } from "next/server";
import { hasResendConfig, sendContactNotificationEmail } from "@/lib/email";
import { hasSupabaseWriteConfig, insertContactSubmission } from "@/lib/supabase";

export const runtime = "nodejs";

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

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 200) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 320) : "";

  if (!name) {
    return NextResponse.json({ error: "お名前を入力してください。" }, { status: 400 });
  }
  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください。" }, { status: 400 });
  }

  const submission = {
    name,
    company: null,
    email,
    topic: "diagnosis_start",
    message: "海洋産業キャリア診断を開始",
  };

  let saved = false;
  try {
    await insertContactSubmission(submission);
    saved = true;
  } catch (error) {
    console.error("Failed to save diagnosis lead:", error);
  }

  let notified = false;
  if (hasResendConfig()) {
    try {
      await sendContactNotificationEmail(submission);
      notified = true;
    } catch (error) {
      console.error("Failed to send diagnosis lead notification:", error);
    }
  }

  const leadServicesConfigured = hasSupabaseWriteConfig() || hasResendConfig();
  if (leadServicesConfigured && !saved && !notified) {
    return NextResponse.json(
      {
        error:
          "登録に失敗しました。時間をおいて再度お試しいただくか、お問い合わせフォームからご連絡ください。",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
