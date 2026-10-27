"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export type DailyRow = {
  date: string;
  pageViews: number;
  users: number;
  sessions: number;
  events: number;
};

type Totals = Omit<DailyRow, "date">;
type WeeklyRow = Totals & { weekStart: string };
type Mode = "month" | "week" | "range" | "all";

const MODES: Array<{ id: Mode; label: string }> = [
  { id: "month", label: "月で見る" },
  { id: "week", label: "週で見る" },
  { id: "range", label: "期間を指定" },
  { id: "all", label: "全期間" },
];

const METRICS: Array<{ key: keyof Totals; label: string }> = [
  { key: "pageViews", label: "PV" },
  { key: "users", label: "ユーザー（延べ）" },
  { key: "sessions", label: "セッション" },
  { key: "events", label: "計測イベント" },
];

/** /reportsの「これまでの推移」。月・週・任意期間で日次データを絞り込み、前の期間と比べる */
export function ReportHistory({ rows }: { rows: DailyRow[] }) {
  const firstDate = rows[0].date;
  const lastDate = rows[rows.length - 1].date;
  const months = useMemo(() => uniqueDesc(rows.map((row) => row.date.slice(0, 7))), [rows]);
  const weeks = useMemo(() => uniqueDesc(rows.map((row) => mondayOf(row.date))), [rows]);

  const [mode, setMode] = useState<Mode>("month");
  const [month, setMonth] = useState(months[0]);
  const [week, setWeek] = useState(weeks[0]);
  const [rangeFrom, setRangeFrom] = useState(addDays(lastDate, -13));
  const [rangeTo, setRangeTo] = useState(lastDate);

  const period = trimToLatest(getPeriod(mode, { month, week, rangeFrom, rangeTo, firstDate, lastDate }), lastDate);
  const selected = rows.filter((row) => row.date >= period.from && row.date <= period.to);
  const totals = sumRows(selected);
  const previous = period.previous
    ? sumRows(rows.filter((row) => row.date >= period.previous!.from && row.date <= period.previous!.to))
    : null;
  const previousDays = period.previous
    ? rows.filter((row) => row.date >= period.previous!.from && row.date <= period.previous!.to).length
    : 0;
  const previousHasData = previousDays > 0;
  const previousLength = period.previous ? daysBetween(period.previous.from, period.previous.to) + 1 : 0;
  const weekly = toWeeklyRows(selected);
  const maxPv = Math.max(1, ...selected.map((row) => row.pageViews));
  const maxWeeklyPv = Math.max(1, ...weekly.map((row) => row.pageViews));

  return (
    <section className="section report-section" aria-label="これまでの推移">
      <article className="daily-report">
        <header className="daily-report-header">
          <div>
            <p className="section-kicker">History</p>
            <h2>日次レポートの一覧（{formatLongDate(firstDate)}〜）</h2>
          </div>
          <TrendingUp size={30} />
        </header>

        <div className="history-filter">
          <div className="history-modes" role="tablist" aria-label="表示する期間の単位">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={mode === item.id}
                className={mode === item.id ? "is-active" : undefined}
                onClick={() => setMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="history-pickers">
            {mode === "month" && (
              <select value={month} onChange={(event) => setMonth(event.target.value)} aria-label="月">
                {months.map((value) => (
                  <option key={value} value={value}>
                    {formatMonth(value)}
                  </option>
                ))}
              </select>
            )}
            {mode === "week" && (
              <select value={week} onChange={(event) => setWeek(event.target.value)} aria-label="週">
                {weeks.map((value) => (
                  <option key={value} value={value}>
                    {shortDate(value)}（月）〜{shortDate(addDays(value, 6))}（日）
                  </option>
                ))}
              </select>
            )}
            {mode === "range" && (
              <>
                <input
                  type="date"
                  value={rangeFrom}
                  min={firstDate}
                  max={lastDate}
                  onChange={(event) => event.target.value && setRangeFrom(event.target.value)}
                  aria-label="開始日"
                />
                <span>〜</span>
                <input
                  type="date"
                  value={rangeTo}
                  min={firstDate}
                  max={lastDate}
                  onChange={(event) => event.target.value && setRangeTo(event.target.value)}
                  aria-label="終了日"
                />
              </>
            )}
            <p className="history-period">
              表示中：{formatLongDate(period.from)}〜{formatLongDate(period.to)}（記録 {selected.length}日分）
            </p>
          </div>
        </div>

        <div className="report-metrics">
          {METRICS.map((metric) => (
            <div key={metric.key}>
              <strong>{totals[metric.key].toLocaleString("ja-JP")}</strong>
              <span>{metric.label}</span>
              {previous && previousHasData && (
                <Delta current={totals[metric.key]} previous={previous[metric.key]} />
              )}
            </div>
          ))}
        </div>
        {period.previous && (
          <p className="history-compare-note">
            {previousHasData
              ? `比較対象：${period.previousLabel}の${period.partial ? "同じ日数分" : "全日"}（${formatLongDate(period.previous.from)}〜${formatLongDate(period.previous.to)}${previousDays < previousLength ? `、うち記録${previousDays}日分` : ""}）${period.partial ? "。表示中の期間はまだ途中のため、日数をそろえて比べています。" : ""}`
              : `${period.previousLabel}の記録がないため、比較は表示していません。`}
          </p>
        )}

        {weekly.length > 1 && (
          <HistoryBlock title="週ごとの合計" icon={<TrendingUp size={18} />}>
            <div className="history-table">
              <HistoryHead dateLabel="週（月曜はじまり・表示期間内の分）" />
              {weekly
                .slice()
                .reverse()
                .map((row) => (
                  <HistoryRow
                    key={row.weekStart}
                    label={`${shortDate(maxDate(row.weekStart, period.from))}〜${shortDate(minDate(addDays(row.weekStart, 6), period.to))}`}
                    row={row}
                    maxPv={maxWeeklyPv}
                  />
                ))}
            </div>
          </HistoryBlock>
        )}

        <HistoryBlock title="日ごとの数値" icon={<BarChart3 size={18} />}>
          {selected.length === 0 ? (
            <p className="report-muted">この期間の記録はありません。</p>
          ) : (
            <div className="history-table">
              <HistoryHead dateLabel="日付" />
              {selected
                .slice()
                .reverse()
                .map((row) => (
                  <HistoryRow
                    key={row.date}
                    label={shortDateWithWeekday(row.date)}
                    row={row}
                    maxPv={maxPv}
                    dim={row.pageViews === 0 && row.users === 0 && row.sessions === 0 && row.events === 0}
                  />
                ))}
            </div>
          )}
          <p className="report-muted">
            ユーザー・セッションは日別数値の単純合計（延べ）です。数値がすべて0の日は、計測が取れていない日です。バーはPV（表示期間内の最大値を100%として表示）。
          </p>
        </HistoryBlock>
      </article>
    </section>
  );
}

function Delta({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "±";
  const rate = previous > 0 ? `（${sign}${Math.round((Math.abs(diff) / previous) * 100)}%）` : "";
  const tone = diff > 0 ? "is-up" : diff < 0 ? "is-down" : "is-flat";
  return (
    <em className={`history-delta ${tone}`}>
      前の期間 {previous.toLocaleString("ja-JP")} → {sign}
      {Math.abs(diff).toLocaleString("ja-JP")}
      {rate}
    </em>
  );
}

function HistoryBlock({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
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

function HistoryHead({ dateLabel }: { dateLabel: string }) {
  return (
    <div className="history-row history-head">
      <span className="history-date">{dateLabel}</span>
      <i className="history-bar" aria-hidden />
      <span>PV</span>
      <span>ユーザー</span>
      <span>セッション</span>
      <span>計測イベント</span>
    </div>
  );
}

function HistoryRow({ label, row, maxPv, dim }: { label: string; row: Totals; maxPv: number; dim?: boolean }) {
  return (
    <div className={`history-row${dim ? " history-zero" : ""}`}>
      <span className="history-date">{label}</span>
      <i className="history-bar">
        <b style={{ width: `${(row.pageViews / maxPv) * 100}%` }} />
      </i>
      <span>{row.pageViews.toLocaleString("ja-JP")}</span>
      <span>{row.users.toLocaleString("ja-JP")}</span>
      <span>{row.sessions.toLocaleString("ja-JP")}</span>
      <span>{row.events.toLocaleString("ja-JP")}</span>
    </div>
  );
}

type Range = { from: string; to: string };

function getPeriod(
  mode: Mode,
  input: { month: string; week: string; rangeFrom: string; rangeTo: string; firstDate: string; lastDate: string },
): Range & { previous: Range | null; previousLabel: string } {
  if (mode === "month") {
    const from = `${input.month}-01`;
    const to = addDays(addMonths(from, 1), -1);
    const prevFrom = addMonths(from, -1);
    return { from, to, previous: { from: prevFrom, to: addDays(from, -1) }, previousLabel: "前月" };
  }
  if (mode === "week") {
    const from = input.week;
    return {
      from,
      to: addDays(from, 6),
      previous: { from: addDays(from, -7), to: addDays(from, -1) },
      previousLabel: "前週",
    };
  }
  if (mode === "range") {
    const [from, to] = input.rangeFrom <= input.rangeTo ? [input.rangeFrom, input.rangeTo] : [input.rangeTo, input.rangeFrom];
    const length = daysBetween(from, to) + 1;
    return {
      from,
      to,
      previous: { from: addDays(from, -length), to: addDays(from, -1) },
      previousLabel: `直前の${length}日間`,
    };
  }
  return { from: input.firstDate, to: input.lastDate, previous: null, previousLabel: "" };
}

/** 進行中の週・月は最新日までで区切り、比較対象も同じ日数にそろえる（1日分と7日分を比べないため） */
function trimToLatest<T extends Range & { previous: Range | null; previousLabel: string }>(period: T, lastDate: string) {
  if (period.to <= lastDate || period.from > lastDate) {
    return { ...period, partial: false };
  }
  const elapsed = daysBetween(period.from, lastDate);
  return {
    ...period,
    to: lastDate,
    previous: period.previous
      ? { from: period.previous.from, to: minDate(addDays(period.previous.from, elapsed), period.previous.to) }
      : null,
    partial: true,
  };
}

function sumRows(rows: DailyRow[]): Totals {
  return rows.reduce(
    (sum, row) => ({
      pageViews: sum.pageViews + row.pageViews,
      users: sum.users + row.users,
      sessions: sum.sessions + row.sessions,
      events: sum.events + row.events,
    }),
    { pageViews: 0, users: 0, sessions: 0, events: 0 },
  );
}

function toWeeklyRows(rows: DailyRow[]): WeeklyRow[] {
  const weeks = new Map<string, WeeklyRow>();
  for (const row of rows) {
    const weekStart = mondayOf(row.date);
    const week = weeks.get(weekStart) ?? { weekStart, pageViews: 0, users: 0, sessions: 0, events: 0 };
    week.pageViews += row.pageViews;
    week.users += row.users;
    week.sessions += row.sessions;
    week.events += row.events;
    weeks.set(weekStart, week);
  }
  return [...weeks.values()].sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

function maxDate(a: string, b: string) {
  return a > b ? a : b;
}

function minDate(a: string, b: string) {
  return a < b ? a : b;
}

function uniqueDesc(values: string[]) {
  return [...new Set(values)].sort((a, b) => b.localeCompare(a));
}

/** report_date(YYYY-MM-DD)をタイムゾーンに依存せずUTC日付として扱う */
function parseUtcDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(value: string, days: number) {
  const date = parseUtcDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

function addMonths(value: string, months: number) {
  const date = parseUtcDate(value);
  date.setUTCMonth(date.getUTCMonth() + months);
  return toIso(date);
}

function daysBetween(from: string, to: string) {
  return Math.round((parseUtcDate(to).getTime() - parseUtcDate(from).getTime()) / 86_400_000);
}

function mondayOf(value: string) {
  const date = parseUtcDate(value);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return toIso(date);
}

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

function shortDate(value: string) {
  const date = parseUtcDate(value);
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

function shortDateWithWeekday(value: string) {
  const date = parseUtcDate(value);
  return `${shortDate(value)}（${WEEKDAY_LABELS[date.getUTCDay()]}）`;
}

function formatLongDate(value: string) {
  const date = parseUtcDate(value);
  return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

function formatMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  return `${year}年${month}月`;
}
