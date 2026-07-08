"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { GeoJSON as LeafletGeoJSON, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  msilAttribution,
  msilLayers,
  type MsilLayerDef,
  type MsilLayerKey,
} from "@/lib/msil-layers";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const layerOrder: MsilLayerKey[] = [
  "current",
  "aquarium",
  "museum",
  "experience",
  "port",
  "lighthouse",
  "cable",
];

const defaultEnabled: MsilLayerKey[] = ["current", "aquarium", "port"];

const LIST_LIMIT = 150;

type LayerStatus = "idle" | "loading" | "ready" | "error" | "zoom";

type ListItem = {
  title: string;
  lines: string[];
  link: string | null;
  lat: number | null;
  lng: number | null;
};

type GeoFeature = {
  geometry?: { type?: string; coordinates?: unknown };
  properties?: Record<string, unknown>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPopupHtml(def: MsilLayerDef, props: Record<string, unknown>) {
  const parts: string[] = [];
  const title = def.titleField ? props[def.titleField] : null;
  if (title) {
    parts.push(`<strong>${escapeHtml(String(title))}</strong>`);
  }
  for (const field of def.fields ?? []) {
    const value = props[field];
    if (value) {
      parts.push(
        `<span>${escapeHtml(field)}: ${escapeHtml(String(value))}</span>`,
      );
    }
  }
  if (def.linkField && props[def.linkField]) {
    const url = String(props[def.linkField]);
    if (/^https?:\/\//.test(url)) {
      parts.push(
        `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">公式サイトを見る</a>`,
      );
    }
  }
  if (parts.length === 0 && def.key === "cable") {
    parts.push("<strong>海底ケーブル</strong>");
  }
  return `<div class="ocean-map-popup">${parts.join("<br/>")}</div>`;
}

function toListItems(def: MsilLayerDef, features: GeoFeature[]): ListItem[] {
  const items: ListItem[] = [];
  for (const feature of features) {
    const props = feature.properties ?? {};
    const title = def.titleField ? props[def.titleField] : null;
    if (!title) continue;

    let lat: number | null = null;
    let lng: number | null = null;
    if (
      feature.geometry?.type === "Point" &&
      Array.isArray(feature.geometry.coordinates)
    ) {
      const [x, y] = feature.geometry.coordinates as number[];
      if (Number.isFinite(x) && Number.isFinite(y)) {
        lng = x;
        lat = y;
      }
    }

    const lines: string[] = [];
    for (const field of def.fields ?? []) {
      const value = props[field];
      if (value) lines.push(String(value));
    }

    let link: string | null = null;
    if (def.linkField && props[def.linkField]) {
      const url = String(props[def.linkField]);
      if (/^https?:\/\//.test(url)) link = url;
    }

    items.push({ title: String(title), lines, link, lat, lng });
  }
  items.sort((a, b) => a.title.localeCompare(b.title, "ja"));
  return items;
}

export function OceanMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const groupsRef = useRef<Partial<Record<MsilLayerKey, LeafletGeoJSON>>>({});
  const enabledRef = useRef<Set<MsilLayerKey>>(new Set(defaultEnabled));
  const loadLayerRef = useRef<((key: MsilLayerKey) => Promise<void>) | null>(
    null,
  );
  const [enabled, setEnabled] = useState<Set<MsilLayerKey>>(
    new Set(defaultEnabled),
  );
  const [status, setStatus] = useState<Record<string, LayerStatus>>({});
  const [listItems, setListItems] = useState<
    Partial<Record<MsilLayerKey, ListItem[]>>
  >({});

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current || mapRef.current) return;
      const leaflet = await import("leaflet");
      const L = leaflet.default;
      leafletRef.current = L;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [36.2, 136.9],
        zoom: 5,
        minZoom: 4,
        maxZoom: 14,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
        attribution: `<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル</a> | ${msilAttribution}`,
        maxZoom: 14,
      }).addTo(map);

      async function loadLayer(key: MsilLayerKey) {
        const def = msilLayers[key];
        const currentMap = mapRef.current;
        if (!currentMap) return;

        if (def.load === "bbox") {
          if (currentMap.getZoom() < (def.minZoom ?? 0)) {
            groupsRef.current[key]?.remove();
            delete groupsRef.current[key];
            setListItems((prev) => ({ ...prev, [key]: undefined }));
            setStatus((prev) => ({ ...prev, [key]: "zoom" }));
            return;
          }
        }

        setStatus((prev) => ({ ...prev, [key]: "loading" }));
        try {
          let url = `/api/msil/${key}`;
          if (def.load === "bbox") {
            const b = currentMap.getBounds();
            url += `?bbox=${b.getWest().toFixed(3)},${b.getSouth().toFixed(3)},${b.getEast().toFixed(3)},${b.getNorth().toFixed(3)}`;
          }
          const response = await fetch(url);
          if (!response.ok) throw new Error(String(response.status));
          const geojson = await response.json();
          if (cancelled || !enabledRef.current.has(key)) return;

          groupsRef.current[key]?.remove();
          const group = L.geoJSON(geojson, {
            style: () => ({
              color: def.color,
              weight: def.kind === "line" ? 2.5 : 1,
              opacity: 0.85,
            }),
            pointToLayer: (_feature, latlng) =>
              L.circleMarker(latlng, {
                radius: 6,
                color: "#ffffff",
                weight: 1.5,
                fillColor: def.color,
                fillOpacity: 0.9,
              }),
            onEachFeature: (feature, layer) => {
              const props = (feature.properties ?? {}) as Record<
                string,
                unknown
              >;
              layer.bindPopup(buildPopupHtml(def, props));
            },
          });
          group.addTo(currentMap);
          groupsRef.current[key] = group;

          if (def.listable) {
            setListItems((prev) => ({
              ...prev,
              [key]: toListItems(def, geojson.features ?? []),
            }));
          }
          setStatus((prev) => ({ ...prev, [key]: "ready" }));
        } catch (error) {
          console.error(`Failed to load layer ${key}:`, error);
          if (!cancelled) {
            setStatus((prev) => ({ ...prev, [key]: "error" }));
          }
        }
      }

      loadLayerRef.current = loadLayer;

      map.on("moveend", () => {
        for (const key of enabledRef.current) {
          if (msilLayers[key].load === "bbox") {
            void loadLayer(key);
          }
        }
      });

      for (const key of enabledRef.current) {
        void loadLayer(key);
      }
    }

    void init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      groupsRef.current = {};
      loadLayerRef.current = null;
    };
  }, []);

  function toggleLayer(key: MsilLayerKey) {
    const next = new Set(enabledRef.current);
    if (next.has(key)) {
      next.delete(key);
      enabledRef.current = next;
      groupsRef.current[key]?.remove();
      delete groupsRef.current[key];
      setListItems((prev) => ({ ...prev, [key]: undefined }));
      setStatus((prev) => ({ ...prev, [key]: "idle" }));
    } else {
      next.add(key);
      enabledRef.current = next;
      window.gtag?.("event", "map_layer_on", { layer: key });
      void loadLayerRef.current?.(key);
    }
    setEnabled(new Set(next));
  }

  function focusItem(def: MsilLayerDef, item: ListItem) {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || item.lat === null || item.lng === null) return;

    map.flyTo([item.lat, item.lng], Math.max(map.getZoom(), 10), {
      duration: 0.8,
    });
    const props: Record<string, unknown> = {};
    if (def.titleField) props[def.titleField] = item.title;
    (def.fields ?? []).forEach((field, index) => {
      if (item.lines[index]) props[field] = item.lines[index];
    });
    if (def.linkField && item.link) props[def.linkField] = item.link;
    L.popup()
      .setLatLng([item.lat, item.lng])
      .setContent(buildPopupHtml(def, props))
      .openOn(map);
    document
      .getElementById("ocean-map")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const enabledListable = layerOrder.filter(
    (key) =>
      enabled.has(key) && msilLayers[key].listable && listItems[key]?.length,
  );
  const enabledAbouts = layerOrder.filter(
    (key) => enabled.has(key) && msilLayers[key].about,
  );

  return (
    <div className="ocean-map-shell">
      <div className="ocean-map-controls" aria-label="表示するデータの選択">
        {layerOrder.map((key) => {
          const def = msilLayers[key];
          const layerStatus = status[key] ?? "idle";
          return (
            <label className="ocean-map-toggle" key={key}>
              <input
                type="checkbox"
                checked={enabled.has(key)}
                onChange={() => toggleLayer(key)}
              />
              <span
                className="ocean-map-swatch"
                style={{ background: def.color }}
                aria-hidden="true"
              />
              <span className="ocean-map-toggle-label">
                {def.label}
                {layerStatus === "loading" ? (
                  <em> 読み込み中...</em>
                ) : layerStatus === "zoom" ? (
                  <em> 地図を拡大すると表示</em>
                ) : layerStatus === "error" ? (
                  <em className="is-error"> 取得エラー</em>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      <div
        ref={containerRef}
        className="ocean-map-canvas"
        role="application"
        aria-label="海の地図"
      />
      <p className="ocean-map-note">
        地図データ: {msilAttribution}
        。表示内容は海しるAPIの提供状況により変わることがあります。航海の用に供するものではありません。
      </p>

      {enabledAbouts.length > 0 ? (
        <div className="ocean-map-abouts" aria-label="表示中のデータの解説">
          {enabledAbouts.map((key) => {
            const def = msilLayers[key];
            return (
              <div className="ocean-map-about" key={key}>
                <h3>
                  <span
                    className="ocean-map-swatch"
                    style={{ background: def.color }}
                    aria-hidden="true"
                  />
                  {def.label}とは
                </h3>
                <p>{def.about}</p>
              </div>
            );
          })}
        </div>
      ) : null}

      {enabledListable.map((key) => {
        const def = msilLayers[key];
        const items = listItems[key] ?? [];
        const shown = items.slice(0, LIST_LIMIT);
        return (
          <section
            className="ocean-map-list"
            key={key}
            aria-label={`${def.label}の一覧`}
          >
            <h3>
              <span
                className="ocean-map-swatch"
                style={{ background: def.color }}
                aria-hidden="true"
              />
              {def.label}の一覧
              <span className="ocean-map-list-count">
                {items.length}件
                {items.length > LIST_LIMIT
                  ? `(先頭${LIST_LIMIT}件を表示)`
                  : ""}
                {def.load === "bbox" ? " ※表示中の地図範囲内" : ""}
              </span>
            </h3>
            <ul>
              {shown.map((item) => (
                <li key={`${item.title}-${item.lat}-${item.lng}`}>
                  <button
                    type="button"
                    className="ocean-map-list-locate"
                    onClick={() => focusItem(def, item)}
                    title="地図で場所を見る"
                  >
                    <MapPin size={15} />
                  </button>
                  <div className="ocean-map-list-body">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ocean-map-list-title"
                      >
                        {item.title}
                        <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      <span className="ocean-map-list-title">{item.title}</span>
                    )}
                    {item.lines.length > 0 ? (
                      <span className="ocean-map-list-meta">
                        {item.lines.join(" / ")}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
