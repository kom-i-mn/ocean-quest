"use client";

import { useEffect, useRef } from "react";

// スクロール深度に連動する背景ジャーニー(/robotics・ユーザーFB 2026-07-12)。
// 水面直下(写真) → 中深層〜深海層(だんだん暗くなる青+マリンスノー) → 海底(沈没船写真)。
// 「道中」の写真は存在しない/特徴がないため、生成写真ではなくグラデーションで連続的に潜行させる。
// 右下の深度計はスクロール位置を水深(最大8,000m=うらしま8000の到達点)に換算して表示する。

const MAX_DEPTH = 8000;

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

export function DepthJourney() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const seabedRef = useRef<HTMLDivElement>(null);
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

      // 水面直下の写真は序盤でフェードアウト
      if (surfaceRef.current) {
        surfaceRef.current.style.opacity = String(clamp01(1 - p / 0.18));
      }
      // 中層の明るい青 → 深層の暗いベースへ沈む
      if (midRef.current) {
        midRef.current.style.opacity = String(clamp01(1 - (p - 0.15) / 0.45));
      }
      // 海底(沈没船)は終盤でフェードイン
      if (seabedRef.current) {
        seabedRef.current.style.opacity = String(clamp01((p - 0.7) / 0.18));
      }
      // マリンスノーは道中だけ舞う
      if (snowRef.current) {
        snowRef.current.style.opacity = String(
          clamp01((p - 0.08) / 0.15) * clamp01((0.88 - p) / 0.1) * 0.9,
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
        <div className="dj-layer dj-mid" ref={midRef} />
        <div className="dj-layer dj-surface" ref={surfaceRef} />
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
