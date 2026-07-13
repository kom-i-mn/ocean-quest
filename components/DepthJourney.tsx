"use client";

import { useEffect, useRef } from "react";

// スクロール深度に連動する背景ジャーニー(/robotics・ユーザーFB 2026-07-12)。
// ミネさん支給の4枚(水面直下→気泡の浅層→クラゲの中深層→発光クラゲの深海)を
// スクロールでクロスフェードし、最後に海底(沈没船)へ到達する。
// 右下の深度計はスクロール位置を水深(最大10,920m=チャレンジャー海淵)に換算して表示する。

const MAX_DEPTH = 10920;

const ZONES: Array<[number, string]> = [
  [200, "表層"],
  [1000, "中深層"],
  [3000, "漸深層"],
  [6000, "深層"],
  [Number.POSITIVE_INFINITY, "超深海層"],
];

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

// pが[a,b]を通過する間に0→1になる
function band(p: number, a: number, b: number) {
  return clamp01((p - a) / (b - a));
}

export function DepthJourney() {
  const ph1Ref = useRef<HTMLDivElement>(null); // 水面直下
  const ph2Ref = useRef<HTMLDivElement>(null); // 気泡の浅層
  const ph3Ref = useRef<HTMLDivElement>(null); // クラゲの中深層
  const ph4Ref = useRef<HTMLDivElement>(null); // 発光クラゲの深海
  const seabedRef = useRef<HTMLDivElement>(null); // 海底(沈没船)
  const snowRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLElement>(null);
  const zoneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp01(window.scrollY / max) : 0;

      // クロスフェード窓: w1=0.12-0.22 / w2=0.38-0.48 / w3=0.62-0.72 / w4=0.86-0.94
      const w1 = band(p, 0.12, 0.22);
      const w2 = band(p, 0.38, 0.48);
      const w3 = band(p, 0.62, 0.72);
      const w4 = band(p, 0.86, 0.94);

      if (ph1Ref.current) ph1Ref.current.style.opacity = String(1 - w1);
      if (ph2Ref.current) ph2Ref.current.style.opacity = String(w1 * (1 - w2));
      if (ph3Ref.current) ph3Ref.current.style.opacity = String(w2 * (1 - w3));
      if (ph4Ref.current) ph4Ref.current.style.opacity = String(w3 * (1 - w4));
      if (seabedRef.current) seabedRef.current.style.opacity = String(w4);
      // マリンスノーは道中だけ舞う(深海写真は素で降っているので控えめに重なる)
      if (snowRef.current) {
        snowRef.current.style.opacity = String(
          band(p, 0.08, 0.2) * (1 - band(p, 0.85, 0.95)) * 0.85,
        );
      }

      // 深度計。浅い層はゆっくり・深層で一気に潜るカーブ(背景の見た目と深度感を揃える)
      const depth = Math.round((Math.pow(p, 1.35) * MAX_DEPTH) / 10) * 10;
      if (depthRef.current) {
        depthRef.current.textContent = `-${depth.toLocaleString()}m`;
      }
      if (zoneRef.current) {
        zoneRef.current.textContent =
          p > 0.92
            ? "海底・到達"
            : (ZONES.find(([bound]) => depth < bound)?.[1] ?? "超深海層");
      }
      if (meterRef.current) {
        meterRef.current.classList.toggle("on", p > 0.05);
      }
    };

    const onScroll = () => {
      // 非表示タブではrAFが発火しないため直接更新する(タブ復帰時のズレ防止)
      if (document.hidden) {
        update();
        return;
      }
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // 非表示中はスクロールイベントが発火しないため、復帰時に同期する
    document.addEventListener("visibilitychange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="depth-journey" aria-hidden="true">
        <div className="dj-layer dj-deep" />
        <div className="dj-layer dj-ph4" ref={ph4Ref} />
        <div className="dj-layer dj-ph3" ref={ph3Ref} />
        <div className="dj-layer dj-ph2" ref={ph2Ref} />
        <div className="dj-layer dj-ph1" ref={ph1Ref} />
        <div className="dj-layer dj-snow" ref={snowRef} />
        <div className="dj-layer dj-seabed" ref={seabedRef} />
      </div>
      <div className="dj-meter" ref={meterRef} aria-hidden="true">
        <b ref={depthRef}>-0m</b>
        <span ref={zoneRef}>表層</span>
      </div>
    </>
  );
}
