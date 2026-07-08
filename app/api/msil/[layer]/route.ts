import { NextResponse } from "next/server";
import { msilLayers, type MsilLayerKey } from "@/lib/msil-layers";

export const runtime = "nodejs";

const MSIL_BASE = "https://api.msil.go.jp";
const PAGE_SIZE = 1000;
const MAX_PAGES = 3;

type GeoJson = {
  type: string;
  features: unknown[];
  exceededTransferLimit?: boolean;
  properties?: { exceededTransferLimit?: boolean };
};

function isValidBbox(bbox: string) {
  const parts = bbox.split(",").map(Number);
  return parts.length === 4 && parts.every((n) => Number.isFinite(n));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ layer: string }> },
) {
  const { layer } = await params;
  const def = msilLayers[layer as MsilLayerKey];

  if (!def) {
    return NextResponse.json({ error: "Unknown layer." }, { status: 404 });
  }

  const key = process.env.MSIL_SUBSCRIPTION_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "MSIL_SUBSCRIPTION_KEY is not configured." },
      { status: 503 },
    );
  }

  const search = new URL(request.url).searchParams;
  const bbox = search.get("bbox");

  const base = new URLSearchParams({
    f: "geojson",
    where: "1=1",
    returnGeometry: "true",
    outFields: "*",
    geometryPrecision: "5",
  });

  if (def.load === "bbox") {
    if (!bbox || !isValidBbox(bbox)) {
      return NextResponse.json(
        { error: "bbox=west,south,east,north is required for this layer." },
        { status: 400 },
      );
    }
    base.set("geometry", bbox);
    base.set("geometryType", "esriGeometryEnvelope");
    base.set("inSR", "4326");
    base.set("spatialRel", "esriSpatialRelIntersects");
  }

  const features: unknown[] = [];
  try {
    for (let page = 0; page < MAX_PAGES; page += 1) {
      const query = new URLSearchParams(base);
      query.set("resultRecordCount", String(PAGE_SIZE));
      if (page > 0) {
        query.set("resultOffset", String(page * PAGE_SIZE));
      }

      const response = await fetch(
        `${MSIL_BASE}/${def.service}/query?${query.toString()}`,
        {
          headers: { "Ocp-Apim-Subscription-Key": key },
          next: { revalidate: def.revalidate },
        },
      );

      if (!response.ok) {
        throw new Error(`MSIL request failed: ${response.status}`);
      }

      const data = (await response.json()) as GeoJson;
      features.push(...(data.features ?? []));

      const exceeded =
        data.exceededTransferLimit ?? data.properties?.exceededTransferLimit;
      if (!exceeded) {
        break;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch MSIL layer ${def.key}:`, error);
    return NextResponse.json(
      { error: "海しるAPIからのデータ取得に失敗しました。時間をおいてお試しください。" },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { type: "FeatureCollection", features },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${def.revalidate}, stale-while-revalidate=86400`,
      },
    },
  );
}
