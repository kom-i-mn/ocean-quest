"use client";

import { useEffect, useRef, useState } from "react";
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

type LayerStatus = "idle" | "loading" | "ready" | "error" | "zoom";

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
  return `<div class="ocean-map-popup">${parts.join("<br/>")}</div>`;
}

export function OceanMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const groupsRef = useRef<Partial<Record<MsilLayerKey, LeafletGeoJSON>>>({});
  const enabledRef = useRef<Set<MsilLayerKey>>(new Set(defaultEnabled));
  const [enabled, setEnabled] = useState<Set<MsilLayerKey>>(
    new Set(defaultEnabled),
  );
  const [status, setStatus] = useState<Record<string, LayerStatus>>({});

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import("leaflet")).default;
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
            groupsRef.current[key]?.clearLayers();
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
              const html = buildPopupHtml(def, props);
              if (html.length > 40) {
                layer.bindPopup(html);
              } else if (def.kind === "line" && def.key === "cable") {
                layer.bindPopup(
                  `<div class="ocean-map-popup"><strong>海底ケーブル</strong></div>`,
                );
              }
            },
          });
          group.addTo(currentMap);
          groupsRef.current[key] = group;
          setStatus((prev) => ({ ...prev, [key]: "ready" }));
        } catch (error) {
          console.error(`Failed to load layer ${key}:`, error);
          if (!cancelled) {
            setStatus((prev) => ({ ...prev, [key]: "error" }));
          }
        }
      }

      map.on("moveend", () => {
        for (const key of enabledRef.current) {
          if (msilLayers[key].load === "bbox") {
            void loadLayer(key);
          }
        }
      });

      // 初期表示レイヤーを読み込む
      for (const key of enabledRef.current) {
        void loadLayer(key);
      }

      // トグル操作から呼べるように保持
      (map as LeafletMap & { _oceanLoadLayer?: typeof loadLayer })._oceanLoadLayer =
        loadLayer;
    }

    void init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      groupsRef.current = {};
    };
  }, []);

  function toggleLayer(key: MsilLayerKey) {
    const next = new Set(enabledRef.current);
    const map = mapRef.current as
      | (LeafletMap & { _oceanLoadLayer?: (key: MsilLayerKey) => Promise<void> })
      | null;

    if (next.has(key)) {
      next.delete(key);
      groupsRef.current[key]?.remove();
      delete groupsRef.current[key];
      setStatus((prev) => ({ ...prev, [key]: "idle" }));
    } else {
      next.add(key);
      window.gtag?.("event", "map_layer_on", { layer: key });
      enabledRef.current = next;
      void map?._oceanLoadLayer?.(key);
    }
    enabledRef.current = next;
    setEnabled(new Set(next));
  }

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
    </div>
  );
}
