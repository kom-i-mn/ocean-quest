import { NextResponse } from "next/server";
import { hasResendConfig, sendContactNotificationEmail } from "@/lib/email";
import { insertContactSubmission } from "@/lib/supabase";

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
  const company = typeof body.company === "string" ? body.company.trim().slice(0, 200) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 320) : "";
  const topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 200) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 4000) : "";

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください。" }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "相談内容を入力してください。" }, { status: 400 });
  }

  const submission = {
    name: name || null,
    company: company || null,
    email,
    topic: topic || null,
    message,
  };

  let saved = false;
  try {
    await insertContactSubmission(submission);
    saved = true;
  } catch (error) {
    console.error("Failed to save contact submission:", error);
  }

  let notified = false;
  if (hasResendConfig()) {
    try {
      await sendContactNotificationEmail(submission);
      notified = true;
    } catch (error) {
      console.error("Failed to send contact notification email:", error);
    }
  }

  // Accept the lead if it reached either the database or the notification inbox.
  if (!saved && !notified) {
    return NextResponse.json(
      {
        error:
          "送信に失敗しました。時間をおいて再度お試しいただくか、メールでご連絡ください。",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
