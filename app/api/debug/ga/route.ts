import { NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/google-auth";

export const runtime = "nodejs";

// 一時的なGA4診断エンドポイント。診断完了後に削除する。
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const propertyId = process.env.GA4_PROPERTY_ID;
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const out: Record<string, unknown> = {
    propertyIdIsNumeric: /^\d+$/.test(propertyId ?? ""),
    measurementIdPrefix: measurementId?.slice(0, 2),
    measurementIdMatchesSiteTag: measurementId === "G-XSE196K13J",
  };

  try {
    const token = await getGoogleAccessToken([
      "https://www.googleapis.com/auth/analytics.readonly",
    ]);
    const headers = { Authorization: `Bearer ${token}` };

    const propRes = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}`,
      { headers, cache: "no-store" },
    );
    const prop = await propRes.json();
    out.property = prop.error
      ? { error: prop.error.status, message: prop.error.message }
      : { displayName: prop.displayName, timeZone: prop.timeZone, createTime: prop.createTime };

    const streamsRes = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`,
      { headers, cache: "no-store" },
    );
    const streams = await streamsRes.json();
    out.dataStreams = streams.error
      ? { error: streams.error.status, message: streams.error.message }
      : (streams.dataStreams ?? []).map(
          (s: {
            displayName?: string;
            type?: string;
            webStreamData?: { measurementId?: string; defaultUri?: string };
          }) => ({
            displayName: s.displayName,
            type: s.type,
            measurementId: s.webStreamData?.measurementId,
            defaultUri: s.webStreamData?.defaultUri,
            matchesSiteTag: s.webStreamData?.measurementId === "G-XSE196K13J",
          }),
        );

    const repRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          dateRanges: [{ startDate: "14daysAgo", endDate: "today" }],
          dimensions: [{ name: "date" }],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),
        cache: "no-store",
      },
    );
    const rep = await repRes.json();
    out.last14days = rep.error
      ? { error: rep.error.status, message: rep.error.message }
      : (rep.rows ?? []).map(
          (r: {
            dimensionValues?: Array<{ value?: string }>;
            metricValues?: Array<{ value?: string }>;
          }) => ({
            date: r.dimensionValues?.[0]?.value,
            pv: r.metricValues?.[0]?.value,
            users: r.metricValues?.[1]?.value,
          }),
        );
  } catch (error) {
    out.fatal = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(out);
}
