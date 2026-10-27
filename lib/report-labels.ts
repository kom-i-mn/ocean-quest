/**
 * /reportsで、GA4の生の名前（URL・イベント名・チャネル名）を初見でも分かる日本語に置き換える。
 * ページを追加したら PAGE_LABELS に1行足す。未登録のものは生の名前をそのまま出す。
 */

export type ReportLabel = { label: string; raw?: string };

const PAGE_LABELS: Record<string, string> = {
  "/": "トップページ",
  "/videos": "動画一覧",
  "/notes": "note記事一覧",
  "/ebooks": "eBook一覧（無料ダウンロード）",
  "/events": "イベント一覧",
  "/map": "海の地図（β）",
  "/news": "海洋産業ニュース",
  "/diagnosis": "海洋キャリア診断",
  "/robotics": "水中ロボティクスQuest",
  "/companies": "企業の方へ（採用支援）",
  "/contact": "問い合わせフォーム",
  "/contact/thanks": "問い合わせ送信完了",
  "/updates": "お知らせ",
  "/privacy": "プライバシーポリシー",
  "/reports": "成長ループレポート（社内用）",
};

const EVENT_LABELS: Record<string, string> = {
  page_view: "ページ表示",
  session_start: "訪問の開始",
  first_visit: "初めての訪問",
  user_engagement: "しっかり見られた（10秒以上の滞在など）",
  scroll: "ページの最後まで読んだ（90%スクロール）",
  click: "外部サイトへのリンククリック",
  form_start: "フォームに入力し始めた",
  form_submit: "フォームを送信した",
  contact_submit: "問い合わせを送信した",
  file_download: "ファイルのダウンロード",
  video_start: "動画の再生開始",
  video_progress: "動画を途中まで再生",
  video_complete: "動画を最後まで再生",
  view_search_results: "サイト内検索",
};

const CHANNEL_LABELS: Record<string, string> = {
  Direct: "直接（URL入力・ブックマークなど）",
  "Organic Search": "検索（Googleなど）",
  "Paid Search": "検索広告",
  Referral: "他サイトのリンク",
  "Organic Social": "SNS",
  "Paid Social": "SNS広告",
  "AI Assistant": "AIアシスタント（ChatGPTなど）",
  Email: "メール",
  "Organic Video": "動画サイト（YouTubeなど）",
  Unassigned: "不明",
};

export function pageLabel(path: string): ReportLabel {
  const clean = path.split("?")[0].replace(/(.)\/$/, "$1");
  if (PAGE_LABELS[clean]) {
    return { label: PAGE_LABELS[clean], raw: path };
  }
  // /notes/xxx のような個別ページは、いちばん近い親ページの名前で表す
  const parent = Object.keys(PAGE_LABELS)
    .filter((key) => key !== "/" && clean.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];
  return parent ? { label: `${PAGE_LABELS[parent]}の個別ページ`, raw: path } : { label: path };
}

export function eventLabel(name: string): ReportLabel {
  return EVENT_LABELS[name] ? { label: EVENT_LABELS[name], raw: name } : { label: name };
}

export function channelLabel(name: string): ReportLabel {
  return CHANNEL_LABELS[name] ? { label: CHANNEL_LABELS[name], raw: name } : { label: name };
}
