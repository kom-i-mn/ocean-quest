const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || "mine@potentialight.com";
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
      html: `
        <p>Ocean Questの問い合わせフォームから新しい相談が届きました。</p>
        <table>
          <tr><td>お名前</td><td>${escapeHtml(submission.name || "(未入力)")}</td></tr>
          <tr><td>会社名</td><td>${escapeHtml(submission.company || "(未入力)")}</td></tr>
          <tr><td>メールアドレス</td><td>${escapeHtml(submission.email)}</td></tr>
          <tr><td>相談内容</td><td>${escapeHtml(submission.topic || "(未選択)")}</td></tr>
        </table>
        <p>詳細:</p>
        <p>${escapeHtml(submission.message).replace(/\n/g, "<br>")}</p>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${message}`);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
