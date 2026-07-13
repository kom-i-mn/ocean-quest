"use client";

import { useEffect, useState } from "react";

// 深度線(quest-rd.cssの .qrd::before)に沿って置く基準マーカー(ミネさんFB・2026-07-13)。
// 右下の深度計と同じ換算式(depth = p^1.35 × 10,920)でページ上の位置を逆算し、
// その深さが深度計に表示されるスクロール位置とマーカーが揃うようにする。
// 浅い基準(ダイバー40m・AUVの現場200m)はヒーローの目盛りが担当するので、ここは富士山から。

const MAX_DEPTH = 10920;
const CURVE = 1.35;

const MARKS: Array<{ depth: number; note: string; side?: "r" }> = [
  { depth: 3776, note: "富士山の高さ" },
  { depth: 6500, note: "しんかい6500（有人・日本）" },
  { depth: 8000, note: "うらしま8000（AUV・日本）" },
  { depth: 8849, note: "エベレストの高さ" },
  { depth: 10896, note: "悟空号（AUV・中国）" },
  { depth: 10909, note: "奮闘者号（有人・中国）", side: "r" },
  { depth: 10920, note: "チャレンジャー海淵・海底" },
];

export function DepthMarks() {
  const [tops, setTops] = useState<number[] | null>(null);

  useEffect(() => {
    const place = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      const total = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const scrollable = total - vh;
      if (vh <= 0 || scrollable <= 0) return false;
      setTops(
        MARKS.map(({ depth }) => {
          const p = Math.pow(depth / MAX_DEPTH, 1 / CURVE);
          // マーカーが画面中央に来たとき、深度計がその深さを示す
          return Math.round(p * scrollable + vh * 0.5);
        }),
      );
      return true;
    };
    const onResize = () => void place();
    window.addEventListener("resize", onResize);
    // 画像ロード等でページ高が確定するまで、少しずつリトライする
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (place() || tries > 10) window.clearInterval(timer);
    }, 500);
    place();
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearInterval(timer);
    };
  }, []);

  if (!tops) return null;

  return (
    <div className="qrd-marks" aria-hidden="true">
      {MARKS.map(({ depth, note, side }, i) => (
        <span className={side === "r" ? "qrd-mark qrd-mark-r" : "qrd-mark"} style={{ top: tops[i] }} key={depth}>
          <i>-{depth.toLocaleString()}m</i>
          <em>{note}</em>
        </span>
      ))}
    </div>
  );
}
