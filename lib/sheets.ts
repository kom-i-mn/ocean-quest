/**
 * 診断・問い合わせのリードをGoogleスプレッドシートへ同期する。
 *
 * GA4/Search Consoleで既に使っているサービスアカウント（GOOGLE_CLIENT_EMAIL /
 * GOOGLE_PRIVATE_KEY もしくは GOOGLE_SERVICE_ACCOUNT_JSON）をそのまま流用するので、
 * 新しい認証情報は要らない。スプレッドシート側でそのアドレスに編集権限を渡すだけ。
 *
 * 個人情報を扱うため、公開URLやトークン付きURLは作らない（Google側に押し出す方式）。
 */

import { getGoogleAccessToken } from "./google-auth";
import {
  buildLeadEventRows,
  buildLeadPersonRows,
  leadEventHeader,
  leadPersonHeader,
} from "./leads";
import { listContactSubmissions } from "./supabase";

const sheetsScope = "https://www.googleapis.com/auth/spreadsheets";
const apiBase = "https://sheets.googleapis.com/v4/spreadsheets";

/** 人物一覧（名寄せ済み・実際に運用で見るシート） */
const personTabTitle = "リード一覧";
/** 全イベントの時系列ログ */
const eventTabTitle = "履歴ログ";

export function getLeadsSheetId() {
  return process.env.LEADS_SHEET_ID || "";
}

export function hasLeadsSheetConfig() {
  return Boolean(getLeadsSheetId());
}

async function sheetsFetch(
  accessToken: string,
  path: string,
  init: { method?: string; body?: unknown } = {},
) {
  const response = await fetch(`${apiBase}/${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Google Sheets request failed: ${response.status} ${message}`);
  }

  return response.json();
}

/** タブが無ければ作る。既にあれば何もしない */
async function ensureTabs(accessToken: string, spreadsheetId: string, titles: string[]) {
  const metadata = (await sheetsFetch(
    accessToken,
    `${spreadsheetId}?fields=sheets.properties.title`,
  )) as { sheets?: Array<{ properties?: { title?: string } }> };

  const existing = new Set(
    (metadata.sheets ?? []).map((sheet) => sheet.properties?.title).filter(Boolean) as string[],
  );
  const missing = titles.filter((title) => !existing.has(title));

  if (missing.length === 0) return;

  await sheetsFetch(accessToken, `${spreadsheetId}:batchUpdate`, {
    method: "POST",
    body: {
      requests: missing.map((title) => ({ addSheet: { properties: { title } } })),
    },
  });
}

/** タブを空にしてから、ヘッダー＋データを書き込む（常に最新の全件で置き換える） */
async function writeTab(
  accessToken: string,
  spreadsheetId: string,
  title: string,
  values: (readonly string[])[],
) {
  const range = encodeURIComponent(`${title}!A:Z`);
  await sheetsFetch(accessToken, `${spreadsheetId}/values/${range}:clear`, { method: "POST" });

  await sheetsFetch(
    accessToken,
    `${spreadsheetId}/values/${encodeURIComponent(`${title}!A1`)}?valueInputOption=RAW`,
    { method: "PUT", body: { values } },
  );
}

export async function syncLeadsToSheet() {
  const spreadsheetId = getLeadsSheetId();

  if (!spreadsheetId) {
    throw new Error("LEADS_SHEET_ID is not configured.");
  }

  const accessToken = await getGoogleAccessToken([sheetsScope]);
  const submissions = await listContactSubmissions();

  const personRows = buildLeadPersonRows(submissions);
  const eventRows = buildLeadEventRows(submissions);

  await ensureTabs(accessToken, spreadsheetId, [personTabTitle, eventTabTitle]);
  await writeTab(accessToken, spreadsheetId, personTabTitle, [leadPersonHeader, ...personRows]);
  await writeTab(accessToken, spreadsheetId, eventTabTitle, [leadEventHeader, ...eventRows]);

  return {
    spreadsheetId,
    people: personRows.length,
    events: eventRows.length,
    syncedAt: new Date().toISOString(),
  };
}
