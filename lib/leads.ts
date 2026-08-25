/**
 * contact_submissions の1行が「本当のお問い合わせ」なのか「診断の通知」なのかを判定し、
 * 通知メール・スプレッドシート同期の両方で同じ呼び方をするための共通モジュール。
 *
 * 診断フローは topic に固定値を入れて contact_submissions に記録している:
 *   diagnosis_start    … 名前とメールを入れて診断を開始した
 *   diagnosis_complete … 11問を終えて結果が出た
 *   diagnosis_report   … 結果ページから詳細版PDFをダウンロードした
 * それ以外（=お問い合わせフォームの選択肢）は本物の問い合わせとして扱う。
 */

import type { ContactSubmission } from "./supabase";

export type LeadKind = "contact" | "diagnosis_start" | "diagnosis_complete" | "diagnosis_report";

export function resolveLeadKind(topic: string | null | undefined): LeadKind {
  switch (topic) {
    case "diagnosis_start":
      return "diagnosis_start";
    case "diagnosis_complete":
      return "diagnosis_complete";
    case "diagnosis_report":
      return "diagnosis_report";
    default:
      return "contact";
  }
}

export function isDiagnosisKind(kind: LeadKind) {
  return kind !== "contact";
}

type LeadKindPresentation = {
  /** スプレッドシート・管理用の短い呼び名 */
  label: string;
  /** 通知メールの件名（お名前/メールアドレスの前に付く） */
  subjectLabel: string;
  /** 通知メールのヘッダー見出し */
  headline: string;
  /** ヘッダーの背景色 */
  headerColor: string;
  /** 「要返信」か「自動通知」かのバッジ */
  badge: string;
  badgeColor: string;
  /** 本文の詳細ブロックの見出し */
  detailHeading: string;
  /** 返信が必要かどうか（フッターの文言を切り替える） */
  needsReply: boolean;
};

export const leadKindPresentation: Record<LeadKind, LeadKindPresentation> = {
  contact: {
    label: "お問い合わせ",
    subjectLabel: "お問い合わせ",
    headline: "お問い合わせが届きました",
    headerColor: "#c2410c",
    badge: "要返信",
    badgeColor: "#ff7a21",
    detailHeading: "相談内容の詳細",
    needsReply: true,
  },
  diagnosis_start: {
    label: "診断スタート",
    subjectLabel: "診断スタート",
    headline: "キャリア診断が開始されました",
    headerColor: "#008b98",
    badge: "自動通知 / 返信不要",
    badgeColor: "#4b7075",
    detailHeading: "記録",
    needsReply: false,
  },
  diagnosis_complete: {
    label: "診断を受けました",
    subjectLabel: "診断を受けました",
    headline: "キャリア診断を受けてくれました",
    headerColor: "#005866",
    badge: "自動通知 / 返信不要",
    badgeColor: "#4b7075",
    detailHeading: "診断結果",
    needsReply: false,
  },
  diagnosis_report: {
    label: "レポートDL",
    subjectLabel: "診断レポートDL",
    headline: "診断レポート（PDF）がダウンロードされました",
    headerColor: "#005866",
    badge: "自動通知 / 返信不要",
    badgeColor: "#4b7075",
    detailHeading: "ダウンロード内容",
    needsReply: false,
  },
};

/**
 * 自分たちのテスト送信かどうか。ミネさん本人のアドレスと、
 * 動作確認で使った example.com 系を「テスト」として畳んでおくと実データが読みやすい。
 */
const testEmailPatterns = [/@example\.com$/i, /^mine@potentialight\.com$/i, /^deploy-check@/i, /^test-/i];

export function isTestLead(email: string) {
  return testEmailPatterns.some((pattern) => pattern.test(email.trim()));
}

/** 診断完了メッセージから「タイプ: …」「想定職種: …」を取り出す */
function extractLine(message: string, prefix: string) {
  const line = message.split("\n").find((row) => row.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : "";
}

function toTokyoDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date
    .toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" })
    .replace("T", " ")
    .slice(0, 16);
}

export const leadEventHeader = [
  "日時(JST)",
  "種別",
  "お名前",
  "会社名",
  "メールアドレス",
  "内容",
  "テスト",
] as const;

/** 1イベント=1行。起きたことをそのまま時系列で残すシート */
export function buildLeadEventRows(submissions: ContactSubmission[]) {
  return submissions.map((submission) => {
    const kind = resolveLeadKind(submission.topic);
    return [
      toTokyoDateTime(submission.created_at),
      leadKindPresentation[kind].label,
      submission.name || "",
      submission.company || "",
      submission.email,
      // 改行はセル内で読みづらいので「 / 」でつなぐ
      submission.message.split("\n").join(" / "),
      isTestLead(submission.email) ? "テスト" : "",
    ];
  });
}

export const leadPersonHeader = [
  "初回接触(JST)",
  "最終接触(JST)",
  "お名前",
  "メールアドレス",
  "会社名",
  "診断",
  "診断タイプ",
  "想定職種",
  "レポートDL",
  "問い合わせ",
  "接触回数",
  "テスト",
] as const;

/**
 * メールアドレスで名寄せした「人」の一覧。実際に追いかけるのはこちらのシート。
 * 同じ人が診断開始→完了→PDF DLと複数行を作るので、1人1行にまとめる。
 */
export function buildLeadPersonRows(submissions: ContactSubmission[]) {
  type Person = {
    first: string;
    last: string;
    name: string;
    company: string;
    email: string;
    startedDiagnosis: boolean;
    completedDiagnosis: boolean;
    diagnosisType: string;
    recommendedRole: string;
    downloadedReport: boolean;
    contacted: boolean;
    touches: number;
  };

  const people = new Map<string, Person>();

  // 古い順に見て、名前や診断結果は「新しい情報で上書き」する
  const ordered = [...submissions].sort((a, b) => a.created_at.localeCompare(b.created_at));

  for (const submission of ordered) {
    const key = submission.email.trim().toLowerCase();
    const kind = resolveLeadKind(submission.topic);
    const existing = people.get(key);

    const person: Person = existing ?? {
      first: submission.created_at,
      last: submission.created_at,
      name: "",
      company: "",
      email: submission.email.trim(),
      startedDiagnosis: false,
      completedDiagnosis: false,
      diagnosisType: "",
      recommendedRole: "",
      downloadedReport: false,
      contacted: false,
      touches: 0,
    };

    person.last = submission.created_at;
    person.touches += 1;
    if (submission.name) person.name = submission.name;
    if (submission.company) person.company = submission.company;

    if (kind === "diagnosis_start") person.startedDiagnosis = true;
    if (kind === "diagnosis_report") person.downloadedReport = true;
    if (kind === "contact") person.contacted = true;
    if (kind === "diagnosis_complete") {
      person.completedDiagnosis = true;
      person.diagnosisType = extractLine(submission.message, "タイプ:") || person.diagnosisType;
      person.recommendedRole = extractLine(submission.message, "想定職種:") || person.recommendedRole;
    }

    people.set(key, person);
  }

  return [...people.values()]
    // 最近動いた人を上に
    .sort((a, b) => b.last.localeCompare(a.last))
    .map((person) => [
      toTokyoDateTime(person.first),
      toTokyoDateTime(person.last),
      person.name,
      person.email,
      person.company,
      person.completedDiagnosis ? "完了" : person.startedDiagnosis ? "開始のみ" : "",
      person.diagnosisType,
      person.recommendedRole,
      person.downloadedReport ? "あり" : "",
      person.contacted ? "あり" : "",
      String(person.touches),
      isTestLead(person.email) ? "テスト" : "",
    ]);
}
