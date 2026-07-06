import { NextResponse } from "next/server";
import { hasSupabaseWriteConfig, insertContactSubmission } from "@/lib/supabase";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!hasSupabaseWriteConfig()) {
    return NextResponse.json(
      { error: "Supabase write environment variables are not configured." },
      { status: 500 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
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

  await insertContactSubmission({
    name: name || null,
    company: company || null,
    email,
    topic: topic || null,
    message,
  });

  return NextResponse.json({ ok: true });
}
