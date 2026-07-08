import { NextResponse } from "next/server";
import { diagnosisAreaKeys, diagnosisResults, type DiagnosisAreaKey } from "@/lib/content";
import { composeOutcome, roleKeys, roleLabels, type RoleKey } from "@/lib/diagnosis-flow";
import { renderDiagnosisReportPdf } from "@/lib/diagnosis-pdf";
import type { DiagnosisAreaScores } from "@/lib/diagnosis-report";
import {
  hasResendConfig,
  sendContactNotificationEmail,
  sendDiagnosisResultEmail,
} from "@/lib/email";
import { insertContactSubmission } from "@/lib/supabase";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isAreaKey(value: unknown): value is DiagnosisAreaKey {
  return typeof value === "string" && (diagnosisAreaKeys as readonly string[]).includes(value);
}

function isRoleKey(value: unknown): value is RoleKey {
  return typeof value === "string" && (roleKeys as readonly string[]).includes(value);
}

function parseScores(value: unknown): { key: DiagnosisAreaKey; percent: number }[] | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as Record<string, unknown>;
  const ranked: { key: DiagnosisAreaKey; percent: number }[] = [];
  for (const key of diagnosisAreaKeys) {
    const percent = record[key];
    if (typeof percent !== "number" || !Number.isFinite(percent) || percent < 0 || percent > 100) {
      return null;
    }
    ranked.push({ key, percent: Math.round(percent) });
  }
  ranked.sort((a, b) => b.percent - a.percent);
  return ranked;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 200) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 320) : "";
  const ranked = parseScores(body.scores);

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "有効なメールアドレスが必要です。" }, { status: 400 });
  }
  if (!ranked || !isAreaKey(body.topArea) || !isAreaKey(body.secondArea) || !isRoleKey(body.role)) {
    return NextResponse.json({ error: "診断結果が不正です。" }, { status: 400 });
  }

  const profileRecord =
    body.profile && typeof body.profile === "object"
      ? (body.profile as Record<string, unknown>)
      : {};
  const profile = {
    age: typeof profileRecord.age === "string" ? profileRecord.age.slice(0, 50) : undefined,
    salaryNow:
      typeof profileRecord.salaryNow === "string" ? profileRecord.salaryNow.slice(0, 50) : undefined,
    salaryHope:
      typeof profileRecord.salaryHope === "string"
        ? profileRecord.salaryHope.slice(0, 50)
        : undefined,
  };

  const outcome = composeOutcome({
    ranked,
    topArea: body.topArea,
    secondArea: body.secondArea,
    role: body.role,
    profile,
  });

  const scoreSummary = ranked
    .slice(0, 3)
    .map((entry) => `${diagnosisResults[entry.key].title} ${entry.percent}%`)
    .join(" / ");
  const profileSummary = [
    profile.age ? `年齢 ${profile.age}` : null,
    profile.salaryNow ? `現年収 ${profile.salaryNow}` : null,
    profile.salaryHope ? `目標年収 ${profile.salaryHope}` : null,
  ]
    .filter(Boolean)
    .join(" / ");

  const submission = {
    name: name || null,
    company: null,
    email,
    topic: "diagnosis_complete",
    message: [
      `海洋キャリア診断を完了`,
      `タイプ: ${outcome.typeName}（${outcome.typeSub}）`,
      `想定職種: ${outcome.recommendedRole.name}（${roleLabels[outcome.role]}）`,
      `上位スコア: ${scoreSummary}`,
      profileSummary ? `プロフィール: ${profileSummary}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  try {
    await insertContactSubmission(submission);
  } catch (error) {
    console.error("Failed to save diagnosis result:", error);
  }

  let resultEmailSent = false;
  if (hasResendConfig()) {
    // 詳細レポートPDFを生成してメールに添付する(失敗しても本文のみで送信を続行)
    let reportPdfBase64: string | undefined;
    try {
      const scoresRecord = Object.fromEntries(
        ranked.map((entry) => [entry.key, entry.percent]),
      ) as DiagnosisAreaScores;
      const pdf = await renderDiagnosisReportPdf(scoresRecord, outcome.role);
      reportPdfBase64 = Buffer.from(pdf).toString("base64");
    } catch (error) {
      console.error("Failed to render diagnosis report PDF for email:", error);
    }

    try {
      await sendDiagnosisResultEmail({
        reportPdfBase64,
        name: name || "ゲスト",
        email,
        outcome: {
          typeName: outcome.typeName,
          typeSub: outcome.typeSub,
          summary: outcome.summary,
          ranked: outcome.ranked.map((entry) => ({
            title: diagnosisResults[entry.key].title,
            percent: entry.percent,
          })),
          recommendedRole: outcome.recommendedRole,
          marketValue: outcome.marketValue,
          strengths: outcome.strengths,
          nextSteps: outcome.nextSteps,
        },
      });
      resultEmailSent = true;
    } catch (error) {
      console.error("Failed to send diagnosis result email:", error);
    }

    try {
      await sendContactNotificationEmail(submission);
    } catch (error) {
      console.error("Failed to send diagnosis completion notification:", error);
    }
  }

  if (hasResendConfig() && !resultEmailSent) {
    return NextResponse.json({ error: "結果メールの送信に失敗しました。" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
