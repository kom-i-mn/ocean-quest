import { BarChart3, Search, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLatestAnalyticsReport } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const report = await getLatestAnalyticsReport();

  return (
    <main className="subpage-shell subpage-bg-blue-water">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">Daily Analytics</p>
        <h1>成長ループレポート</h1>
        <p>
          Google AnalyticsとSearch Consoleから日次の成果を取り込み、改善ポイントを保存します。
        </p>
      </section>

      <section className="section report-section" aria-label="日次分析レポート">
        {report ? (
          <article className="daily-report">
            <header className="daily-report-header">
              <div>
                <p className="section-kicker">Ocean Quest Daily Analytics</p>
                <h2>{formatDate(report.report_date)} のサイト分析</h2>
              </div>
              <BarChart3 size={30} />
            </header>

            <div className="report-metrics">
              <Metric label="PV" value={getMetric(report.summary, "page_views")} />
              <Metric label="ユーザー" value={getMetric(report.summary, "users")} />
              <Metric label="セッション" value={getMetric(report.summary, "sessions")} />
              <Metric label="イベント" value={getMetric(report.summary, "events")} />
            </div>

            <ReportBlock title="流入チャネル" icon={<TrendingUp size={18} />}>
              <ReportRows
                rows={report.channel_groups}
                primaryKey="name"
                metrics={["sessions", "users"]}
              />
            </ReportBlock>

            <ReportBlock title="検索クエリ TOP10" icon={<Search size={18} />}>
              <SearchRows rows={report.search_queries} />
            </ReportBlock>

            <ReportBlock title="人気ページ" icon={<BarChart3 size={18} />}>
              <ReportRows
                rows={report.landing_pages}
                primaryKey="name"
                metrics={["page_views", "users"]}
              />
            </ReportBlock>

            <ReportBlock title="主要イベント" icon={<BarChart3 size={18} />}>
              <ReportRows rows={report.events} primaryKey="name" metrics={["events"]} />
            </ReportBlock>

            <div className="report-note">
              <h3>所感</h3>
              <ul>
                {report.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            </div>

            <div className="report-actions">
              <h3>次に打つ施策</h3>
              <ul>
                {report.recommended_actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          </article>
        ) : (
          <div className="empty-state">
            <BarChart3 size={28} />
            <h2>日次レポートの準備中です</h2>
            <p>
              Supabaseにanalytics_reportsテーブルを作成し、GA4とSearch Consoleの環境変数を設定すると、毎朝5時にここへ保存されます。
            </p>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <strong>{value.toLocaleString("ja-JP")}</strong>
      <span>{label}</span>
    </div>
  );
}

function ReportBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="report-block">
      <h3>
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

function ReportRows({
  rows,
  primaryKey,
  metrics,
}: {
  rows: Array<Record<string, unknown>>;
  primaryKey: string;
  metrics: string[];
}) {
  if (rows.length === 0) {
    return <p className="report-muted">データがありません。</p>;
  }

  return (
    <div className="report-table">
      {rows.map((row) => (
        <div className="report-row" key={String(row[primaryKey])}>
          <span>{String(row[primaryKey] ?? "-")}</span>
          <small>
            {metrics
              .map((metric) => `${metricLabel(metric)} ${getMetric(row, metric)}`)
              .join(" / ")}
          </small>
        </div>
      ))}
    </div>
  );
}

function SearchRows({ rows }: { rows: Array<Record<string, unknown>> }) {
  if (rows.length === 0) {
    return <p className="report-muted">Search Consoleのデータがありません。</p>;
  }

  return (
    <div className="report-table">
      {rows.map((row) => (
        <div className="report-row" key={String(row.query)}>
          <span>{String(row.query ?? "-")}</span>
          <small>
            クリック {getMetric(row, "clicks")} / 表示 {getMetric(row, "impressions")} / CTR{" "}
            {formatPercent(getMetric(row, "ctr"))} / 平均順位{" "}
            {getMetric(row, "position").toFixed(1)}
          </small>
        </div>
      ))}
    </div>
  );
}

function getMetric(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return typeof value === "number" ? value : Number(value ?? 0);
}

function metricLabel(metric: string) {
  const labels: Record<string, string> = {
    page_views: "PV",
    users: "ユーザー",
    sessions: "セッション",
    events: "イベント",
  };

  return labels[metric] ?? metric;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
