import type { DailyAnalyticsReportInput } from "./analytics";

const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || "mine@potentialight.com";
const dailyReportEmail = process.env.DAILY_REPORT_EMAIL || "mine@potentialight.com";
const fromEmail = process.env.RESEND_FROM_EMAIL || "Ocean Quest <onboarding@resend.dev>";

export function hasResendConfig() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendContactNotificationEmail(submission: {
  name: string | null;
  company: string | null;
  email: string;
  topic: string | null;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: notifyEmail,
      reply_to: submission.email,
      subject: `【Ocean Quest】新しい問い合わせ: ${submission.name || submission.email}`,
      html: buildNotificationEmailHtml(submission),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${message}`);
  }
}

export async function sendDailyMaintenanceEmail({
  results,
  report,
}: {
  results: Record<string, unknown>;
  report: DailyAnalyticsReportInput | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const reportDate =
    report?.report_date ||
    (new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }) as string);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: dailyReportEmail,
      subject: `【Ocean Quest】日次更新完了 ${reportDate}`,
      html: buildDailyMaintenanceEmailHtml({ results, report, reportDate }),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${message}`);
  }
}

export async function sendDiagnosisResultEmail({
  name,
  email,
  outcome,
}: {
  name: string;
  email: string;
  outcome: {
    typeName: string;
    typeSub: string;
    summary: string;
    ranked: { title: string; percent: number }[];
    recommendedRole: { name: string; description: string; salary: string };
    marketValue: { rank: string; note: string };
    strengths: string[];
    nextSteps: string[];
  };
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject: `【Ocean Quest】${name}さんの海洋キャリア診断結果`,
      html: buildDiagnosisResultEmailHtml({ name, outcome }),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${message}`);
  }
}

function buildDiagnosisResultEmailHtml({
  name,
  outcome,
}: {
  name: string;
  outcome: {
    typeName: string;
    typeSub: string;
    summary: string;
    ranked: { title: string; percent: number }[];
    recommendedRole: { name: string; description: string; salary: string };
    marketValue: { rank: string; note: string };
    strengths: string[];
    nextSteps: string[];
  };
}) {
  const scoreRows = outcome.ranked
    .slice(0, 5)
    .map(
      (entry) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2f5f3;font-size:13px;color:#003f4a;">${escapeHtml(entry.title)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2f5f3;width:120px;">
            <div style="background:#e2f5f3;border-radius:4px;height:8px;overflow:hidden;">
              <div style="background:#0a8a7d;height:8px;width:${Math.min(100, Math.max(0, entry.percent))}%;"></div>
            </div>
          </td>
          <td style="padding:8px 0 8px 10px;border-bottom:1px solid #e2f5f3;font-size:13px;color:#003f4a;font-weight:700;width:44px;text-align:right;">${entry.percent}%</td>
        </tr>
      `,
    )
    .join("");

  const listItems = (items: string[]) =>
    items
      .map(
        (item) =>
          `<li style="margin:0 0 8px;color:#003f4a;font-size:14px;line-height:1.8;">${escapeHtml(item)}</li>`,
      )
      .join("");

  const statCell = (label: string, value: string) => `
    <td style="padding:14px 12px;background:#f4faf9;border:1px solid #e2f5f3;border-radius:8px;vertical-align:top;">
      <div style="font-size:11px;color:#4b7075;letter-spacing:0.06em;">${escapeHtml(label)}</div>
      <div style="font-size:15px;color:#003f4a;font-weight:700;margin-top:6px;line-height:1.5;">${escapeHtml(value)}</div>
    </td>
  `;

  return `
    <div style="background:#eef8f7;padding:32px 16px;font-family:'Hiragino Sans','Yu Gothic',Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fbfffd;border-radius:12px;overflow:hidden;border:1px solid #e2f5f3;">
        <tr>
          <td style="background:#005866;padding:28px 32px;">
            <div style="color:#fbfffd;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">Ocean Quest 海洋キャリア診断</div>
            <div style="color:#d7f4ef;font-size:14px;margin-top:14px;">${escapeHtml(name)}さんの海洋キャリアタイプは</div>
            <div style="color:#fbfffd;font-size:24px;font-weight:700;margin-top:6px;line-height:1.5;">${escapeHtml(outcome.typeName)}</div>
            <div style="color:#d7f4ef;font-size:13px;margin-top:8px;">${escapeHtml(outcome.typeSub)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:26px 32px 6px;">
            <div style="font-size:14px;color:#003f4a;line-height:1.9;">${escapeHtml(outcome.summary)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 6px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:8px;border-collapse:separate;">
              <tr>
                ${statCell("想定職種", outcome.recommendedRole.name)}
                ${statCell("想定年収帯（目安）", outcome.recommendedRole.salary)}
                ${statCell("市場価値", outcome.marketValue.rank)}
              </tr>
            </table>
            <div style="font-size:13px;color:#4b7075;line-height:1.8;margin-top:8px;">${escapeHtml(outcome.marketValue.note)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 6px;">
            <div style="font-size:15px;color:#003f4a;font-weight:700;margin-bottom:8px;">マッチ度の高い領域 TOP5</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${scoreRows}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 6px;">
            <div style="font-size:15px;color:#003f4a;font-weight:700;margin-bottom:8px;">あなたの強み</div>
            <ul style="padding-left:20px;margin:0;">${listItems(outcome.strengths)}</ul>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 10px;">
            <div style="font-size:15px;color:#003f4a;font-weight:700;margin-bottom:8px;">次に広げるべき領域</div>
            <ul style="padding-left:20px;margin:0;">${listItems(outcome.nextSteps)}</ul>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 28px;">
            <a href="https://ocean-quest.jp/contact?topic=diagnosis" style="display:inline-block;background:#ff8a2a;color:#ffffff;text-decoration:none;border-radius:6px;padding:12px 20px;font-weight:700;font-size:14px;">この結果をもとに無料キャリア相談する</a>
            <a href="https://ocean-quest.jp/diagnosis" style="display:inline-block;margin-left:12px;color:#005866;text-decoration:none;font-weight:700;font-size:13px;">診断ページに戻る</a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f4faf9;border-top:1px solid #e2f5f3;">
            <div style="font-size:12px;color:#8eaaa9;line-height:1.7;">
              この診断は興味・志向の傾向から情報収集の入口を提案するもので、適性や合否を判定するものではありません。想定年収帯は公開求人情報などをもとにした推定の目安です。<br>
              このメールはOcean Quest（株式会社ポテンシャライト）の海洋キャリア診断から自動送信されています。
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function buildNotificationEmailHtml(submission: {
  name: string | null;
  company: string | null;
  email: string;
  topic: string | null;
  message: string;
}) {
  const rows: Array<[string, string]> = [
    ["お名前", submission.name || "(未入力)"],
    ["会社名", submission.company || "(未入力)"],
    ["メールアドレス", submission.email],
    ["相談したい内容", submission.topic || "(未選択)"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #e2f5f3;font-size:13px;color:#4b7075;white-space:nowrap;vertical-align:top;width:120px;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #e2f5f3;font-size:15px;color:#003f4a;font-weight:600;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="background:#eef8f7;padding:32px 16px;font-family:'Hiragino Sans','Yu Gothic',Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fbfffd;border-radius:12px;overflow:hidden;border:1px solid #e2f5f3;">
        <tr>
          <td style="background:#005866;padding:28px 32px;">
            <div style="color:#fbfffd;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">Ocean Quest</div>
            <div style="color:#fbfffd;font-size:20px;font-weight:700;margin-top:6px;">新しい問い合わせが届きました</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${rowsHtml}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 32px;">
            <div style="font-size:13px;color:#4b7075;margin-bottom:8px;">相談内容の詳細</div>
            <div style="background:#e2f5f3;border-radius:8px;padding:18px 20px;color:#003f4a;font-size:14px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(
              submission.message,
            )}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f4faf9;border-top:1px solid #e2f5f3;">
            <div style="font-size:12px;color:#8eaaa9;line-height:1.7;">
              このメールはOcean Questの問い合わせフォームから自動送信されています。<br>
              このまま返信すると、送信者（${escapeHtml(submission.email)}）に直接届きます。
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function buildDailyMaintenanceEmailHtml({
  results,
  report,
  reportDate,
}: {
  results: Record<string, unknown>;
  report: DailyAnalyticsReportInput | null;
  reportDate: string;
}) {
  const youtube = toRecord(results.youtube);
  const note = toRecord(results.note);
  const analytics = toRecord(results.analytics);
  const summary = report?.summary;

  const metrics = [
    ["PV", summary ? formatNumber(summary.page_views) : "-"],
    ["ユーザー", summary ? formatNumber(summary.users) : "-"],
    ["セッション", summary ? formatNumber(summary.sessions) : "-"],
    ["イベント", summary ? formatNumber(summary.events) : "-"],
  ];

  const metricHtml = metrics
    .map(
      ([label, value]) => `
        <td style="padding:14px 10px;background:#f4faf9;border:1px solid #e2f5f3;border-radius:8px;text-align:center;">
          <div style="font-size:12px;color:#4b7075;">${escapeHtml(label)}</div>
          <div style="font-size:24px;color:#003f4a;font-weight:700;margin-top:4px;">${escapeHtml(value)}</div>
        </td>
      `,
    )
    .join("");

  return `
    <div style="background:#eef8f7;padding:32px 16px;font-family:'Hiragino Sans','Yu Gothic',Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fbfffd;border-radius:12px;overflow:hidden;border:1px solid #e2f5f3;">
        <tr>
          <td style="background:#005866;padding:28px 32px;">
            <div style="color:#fbfffd;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">Ocean Quest Daily Update</div>
            <div style="color:#fbfffd;font-size:22px;font-weight:700;margin-top:6px;">日次更新が完了しました</div>
            <div style="color:#d7f4ef;font-size:13px;margin-top:8px;">対象日: ${escapeHtml(reportDate)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 10px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:8px;border-collapse:separate;">
              <tr>${metricHtml}</tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 24px;">
            <div style="font-size:16px;color:#003f4a;font-weight:700;margin-bottom:10px;">コンテンツ取り込み</div>
            ${buildStatusRow("YouTube", youtube)}
            ${buildStatusRow("note", note)}
            ${buildStatusRow("Analytics", analytics)}
          </td>
        </tr>
        ${report ? buildAnalyticsSections(report) : buildAnalyticsSkippedSection(analytics)}
        <tr>
          <td style="padding:22px 32px;background:#f4faf9;border-top:1px solid #e2f5f3;">
            <a href="https://ocean-quest.jp/reports" style="display:inline-block;background:#ff8a2a;color:#ffffff;text-decoration:none;border-radius:6px;padding:10px 16px;font-weight:700;font-size:13px;">レポートを見る</a>
            <a href="https://ocean-quest.jp/videos" style="display:inline-block;margin-left:8px;color:#005866;text-decoration:none;font-weight:700;font-size:13px;">動画ページを見る</a>
            <div style="font-size:12px;color:#8eaaa9;line-height:1.7;margin-top:16px;">
              このメールはVercel Cronで毎朝5時ごろ自動送信されます。
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function buildStatusRow(label: string, value: Record<string, unknown>) {
  const text = formatResultValue(value);

  return `
    <div style="border-top:1px solid #e2f5f3;padding:12px 0;">
      <span style="display:inline-block;width:96px;font-size:13px;color:#4b7075;">${escapeHtml(label)}</span>
      <span style="font-size:14px;color:#003f4a;font-weight:600;">${escapeHtml(text)}</span>
    </div>
  `;
}

function buildAnalyticsSections(report: DailyAnalyticsReportInput) {
  return `
    <tr>
      <td style="padding:0 32px 24px;">
        ${buildListSection("気づき", report.insights)}
        ${buildListSection("次にやる改善案", report.recommended_actions)}
        ${buildTableSection(
          "上位ページ",
          report.landing_pages.slice(0, 5).map((row) => [
            row.name,
            `${formatNumber(row.page_views ?? 0)} PV / ${formatNumber(row.users ?? 0)} users`,
          ]),
        )}
        ${buildTableSection(
          "検索クエリ",
          report.search_queries.slice(0, 5).map((row) => [
            row.query,
            `${formatNumber(row.clicks)} clicks / ${formatNumber(row.impressions)} impressions`,
          ]),
        )}
      </td>
    </tr>
  `;
}

function buildAnalyticsSkippedSection(analytics: Record<string, unknown>) {
  const reason = analytics.error || analytics.reason || "分析データは今回取得できませんでした。";

  return `
    <tr>
      <td style="padding:0 32px 24px;">
        <div style="background:#fff8ef;border:1px solid #ffd7ad;border-radius:8px;padding:16px;color:#6c4a1f;font-size:13px;line-height:1.7;">
          Analytics/Search Consoleの取得はスキップされました。理由: ${escapeHtml(String(reason))}
        </div>
      </td>
    </tr>
  `;
}

function buildListSection(title: string, items: string[]) {
  if (items.length === 0) {
    return "";
  }

  const itemHtml = items
    .map(
      (item) =>
        `<li style="margin:0 0 8px;color:#003f4a;line-height:1.7;">${escapeHtml(item)}</li>`,
    )
    .join("");

  return `
    <div style="margin-top:18px;">
      <div style="font-size:16px;color:#003f4a;font-weight:700;margin-bottom:8px;">${escapeHtml(title)}</div>
      <ul style="padding-left:20px;margin:0;font-size:14px;">${itemHtml}</ul>
    </div>
  `;
}

function buildTableSection(title: string, rows: Array<[string, string]>) {
  if (rows.length === 0) {
    return "";
  }

  const rowsHtml = rows
    .map(
      ([name, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2f5f3;color:#003f4a;font-size:13px;">${escapeHtml(name)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e2f5f3;color:#4b7075;font-size:13px;text-align:right;white-space:nowrap;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="margin-top:18px;">
      <div style="font-size:16px;color:#003f4a;font-weight:700;margin-bottom:8px;">${escapeHtml(title)}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
    </div>
  `;
}

function formatResultValue(value: Record<string, unknown>) {
  if (value.error) {
    return `エラー: ${String(value.error)}`;
  }

  if (value.skipped) {
    return `スキップ: ${String(value.reason || "設定または権限を確認してください")}`;
  }

  if (value.report_date) {
    return `レポート保存済み (${String(value.report_date)})`;
  }

  if (typeof value.fetched === "number" || typeof value.saved === "number") {
    return `取得 ${formatNumber(Number(value.fetched ?? 0))}件 / 保存 ${formatNumber(
      Number(value.saved ?? 0),
    )}件`;
  }

  if (typeof value.saved === "number") {
    return `保存 ${formatNumber(value.saved)}件`;
  }

  return "完了";
}

function toRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
