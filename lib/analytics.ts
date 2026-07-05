import { getGoogleAccessToken } from "./google-auth";

type RunReportResponse = {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
};

type SearchConsoleResponse = {
  rows?: Array<{
    keys?: string[];
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  }>;
};

export type DailyAnalyticsReportInput = {
  report_date: string;
  source: "ga4_search_console";
  summary: {
    page_views: number;
    users: number;
    sessions: number;
    events: number;
  };
  channel_groups: AnalyticsRow[];
  search_queries: SearchQueryRow[];
  landing_pages: AnalyticsRow[];
  events: AnalyticsRow[];
  insights: string[];
  recommended_actions: string[];
  metadata: Record<string, unknown>;
};

type AnalyticsRow = {
  name: string;
  page_views?: number;
  users?: number;
  sessions?: number;
  events?: number;
};

type SearchQueryRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

const gaScope = "https://www.googleapis.com/auth/analytics.readonly";
const searchConsoleScope = "https://www.googleapis.com/auth/webmasters.readonly";

export async function generateDailyAnalyticsReport(date = getYesterdayTokyoDate()) {
  const [summary, channelGroups, landingPages, events, searchQueries] = await Promise.all([
    fetchGaSummary(date),
    fetchGaRows(date, ["sessionDefaultChannelGroup"], ["sessions", "activeUsers"], 8),
    fetchGaRows(date, ["pagePath"], ["screenPageViews", "activeUsers"], 10),
    fetchGaRows(date, ["eventName"], ["eventCount"], 10),
    fetchSearchQueries(date),
  ]);

  const insights = buildInsights(summary, channelGroups, landingPages, searchQueries);
  const recommendedActions = buildRecommendedActions(
    summary,
    landingPages,
    searchQueries,
    events,
  );

  return {
    report_date: date,
    source: "ga4_search_console",
    summary,
    channel_groups: channelGroups,
    search_queries: searchQueries,
    landing_pages: landingPages,
    events,
    insights,
    recommended_actions: recommendedActions,
    metadata: {
      timezone: "Asia/Tokyo",
      generated_at: new Date().toISOString(),
    },
  } satisfies DailyAnalyticsReportInput;
}

function getYesterdayTokyoDate() {
  const now = new Date();
  const tokyo = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  tokyo.setDate(tokyo.getDate() - 1);
  return tokyo.toISOString().slice(0, 10);
}

async function fetchGaSummary(date: string) {
  const data = await runGaReport({
    dateRanges: [{ startDate: date, endDate: date }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "eventCount" },
    ],
  });

  const values = data.rows?.[0]?.metricValues ?? [];

  return {
    page_views: toNumber(values[0]?.value),
    users: toNumber(values[1]?.value),
    sessions: toNumber(values[2]?.value),
    events: toNumber(values[3]?.value),
  };
}

async function fetchGaRows(
  date: string,
  dimensions: Array<"sessionDefaultChannelGroup" | "pagePath" | "eventName">,
  metrics: Array<"sessions" | "activeUsers" | "screenPageViews" | "eventCount">,
  limit: number,
) {
  const data = await runGaReport({
    dateRanges: [{ startDate: date, endDate: date }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    orderBys: [{ metric: { metricName: metrics[0] }, desc: true }],
    limit,
  });

  return (data.rows ?? []).map((row) => {
    const name = row.dimensionValues?.[0]?.value ?? "(not set)";
    const values = row.metricValues ?? [];

    return metrics.reduce<AnalyticsRow>(
      (acc, metric, index) => ({
        ...acc,
        [mapMetricName(metric)]: toNumber(values[index]?.value),
      }),
      { name },
    );
  });
}

async function fetchSearchQueries(date: string) {
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL;

  if (!siteUrl) {
    throw new Error("SEARCH_CONSOLE_SITE_URL is required.");
  }

  const accessToken = await getGoogleAccessToken([searchConsoleScope]);
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl,
    )}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: date,
        endDate: date,
        dimensions: ["query"],
        rowLimit: 10,
        startRow: 0,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Search Console report failed: ${message}`);
  }

  const data = (await response.json()) as SearchConsoleResponse;

  return (data.rows ?? []).map((row) => ({
    query: row.keys?.[0] ?? "(not set)",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  }));
}

async function runGaReport(body: Record<string, unknown>) {
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!propertyId) {
    throw new Error("GA4_PROPERTY_ID is required.");
  }

  const accessToken = await getGoogleAccessToken([gaScope]);
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GA4 report failed: ${message}`);
  }

  return response.json() as Promise<RunReportResponse>;
}

function buildInsights(
  summary: DailyAnalyticsReportInput["summary"],
  channelGroups: AnalyticsRow[],
  landingPages: AnalyticsRow[],
  searchQueries: SearchQueryRow[],
) {
  const insights = [
    `PVは${summary.page_views}、ユーザーは${summary.users}、セッションは${summary.sessions}でした。`,
  ];
  const topChannel = channelGroups[0];
  const topPage = landingPages[0];
  const highImpressionQuery = searchQueries.find((query) => query.impressions >= 10);

  if (topChannel) {
    insights.push(`最大流入チャネルは${topChannel.name}です。`);
  }

  if (topPage) {
    insights.push(`最も読まれたページは${topPage.name}です。`);
  }

  if (highImpressionQuery) {
    insights.push(
      `${highImpressionQuery.query}は表示回数が多く、CTR改善の余地があります。`,
    );
  }

  return insights;
}

function buildRecommendedActions(
  summary: DailyAnalyticsReportInput["summary"],
  landingPages: AnalyticsRow[],
  searchQueries: SearchQueryRow[],
  events: AnalyticsRow[],
) {
  const actions: string[] = [];
  const lowCtrQuery = searchQueries.find((query) => query.impressions >= 10 && query.ctr < 0.05);
  const topPage = landingPages[0];
  const clickEvent = events.find((event) => event.name === "click");

  if (lowCtrQuery) {
    actions.push(
      `検索クエリ「${lowCtrQuery.query}」向けに、該当ページのtitle/descriptionと冒頭導線を改善する。`,
    );
  }

  if (topPage) {
    actions.push(`${topPage.name}から動画・note・問い合わせへの内部リンクを追加または強化する。`);
  }

  if (!clickEvent || (clickEvent.events ?? 0) < Math.max(1, summary.sessions * 0.1)) {
    actions.push("CTAの文言と配置を見直し、クリックされる導線を1つ増やす。");
  }

  if (actions.length === 0) {
    actions.push("流入上位ページの関連コンテンツ導線を増やし、回遊率を伸ばす。");
  }

  return actions;
}

function mapMetricName(metric: string) {
  const map: Record<string, keyof AnalyticsRow> = {
    screenPageViews: "page_views",
    activeUsers: "users",
    sessions: "sessions",
    eventCount: "events",
  };

  return map[metric] ?? metric;
}

function toNumber(value?: string) {
  return Number(value ?? 0);
}
