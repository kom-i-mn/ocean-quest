import { NextResponse } from "next/server";
import { diagnosisAreaKeys, diagnosisResults, type DiagnosisAreaKey } from "@/lib/content";
import { roleKeys, type RoleKey } from "@/lib/diagnosis-flow";
import { renderDiagnosisReportPdf } from "@/lib/diagnosis-pdf";
import type { DiagnosisAreaScores } from "@/lib/diagnosis-report";
import { hasResendConfig, sendContactNotificationEmail } from "@/lib/email";
import { hasSupabaseWriteConfig, insertContactSubmission } from "@/lib/supabase";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function parseScores(value: unknown): DiagnosisAreaScores | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as Record<string, unknown>;
  const scores = {} as DiagnosisAreaScores;
  for (const key of diagnosisAreaKeys) {
    const percent = record[key];
    if (typeof percent !== "number" || !Number.isFinite(percent) || percent < 0 || percent > 100) {
      return null;
    }
    scores[key] = Math.round(percent);
  }
  return scores;
}

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
  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください。" }, { status: 400 });
  }

  const scores = parseScores(body.scores);
  if (!scores) {
    return NextResponse.json({ error: "診断結果が不正です。もう一度診断からお試しください。" }, { status: 400 });
  }

  const role =
    typeof body.role === "string" && (roleKeys as readonly string[]).includes(body.role)
      ? (body.role as RoleKey)
      : null;

  const topKey = diagnosisAreaKeys.reduce((best, key) => (scores[key] > scores[best] ? key : best), diagnosisAreaKeys[0]);
  const scoreSummary = diagnosisAreaKeys
    .map((key) => `${diagnosisResults[key].title} ${scores[key]}%`)
    .join(" / ");
  const submission = {
    name: null,
    company: null,
    email,
    topic: "diagnosis_report",
    message: `診断レポート(詳細版PDF)をダウンロード\n1位領域: ${diagnosisResults[topKey].title}\nスコア: ${scoreSummary}`,
  };

  let saved = false;
  try {
    await insertContactSubmission(submission);
    saved = true;
  } catch (error) {
    console.error("Failed to save diagnosis report lead:", error);
  }

  let notified = false;
  if (hasResendConfig()) {
    try {
      await sendContactNotificationEmail(submission);
      notified = true;
    } catch (error) {
      console.error("Failed to send diagnosis report lead notification:", error);
    }
  }

  // The PDF is the reward for the email: only proceed if the lead was captured.
  // When neither service is configured (local dev), let the download through.
  const leadServicesConfigured = hasSupabaseWriteConfig() || hasResendConfig();
  if (leadServicesConfigured && !saved && !notified) {
    return NextResponse.json(
      {
        error:
          "レポートの発行に失敗しました。時間をおいて再度お試しいただくか、お問い合わせフォームからご連絡ください。",
      },
      { status: 500 },
    );
  }

  try {
    const pdf = await renderDiagnosisReportPdf(scores, role);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="ocean-quest-career-report.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to render diagnosis report PDF:", error);
    return NextResponse.json(
      {
        error:
          "レポートの生成に失敗しました。時間をおいて再度お試しください。",
      },
      { status: 500 },
    );
  }
}
