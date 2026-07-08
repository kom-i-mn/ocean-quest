"use client";

import { useEffect } from "react";

// 領域Questページのスクロール演出:
// .rv → 表示時に .rv-in、.sc-road → 表示時に .on、[data-count] → カウントアップ
export function QuestFx() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count ?? "0");
      if (!Number.isFinite(target) || target <= 0 || reduceMotion) {
        el.textContent = String(target);
        return;
      }
      const start = performance.now();
      const duration = 900;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      document.querySelectorAll(".rv").forEach((el) => el.classList.add("rv-in"));
      document.querySelectorAll(".sc-road").forEach((el) => el.classList.add("on"));
      document
        .querySelectorAll<HTMLElement>("[data-count]")
        .forEach((el) => (el.textContent = el.dataset.count ?? "0"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.classList.contains("sc-road")) {
            el.classList.add("on");
          } else {
            el.classList.add("rv-in");
          }
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          observer.unobserve(el);
        });
      },
      { threshold: 0.25 },
    );

    document.querySelectorAll(".rv, .sc-road").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
