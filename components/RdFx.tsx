"use client";

import { useEffect } from "react";

// エディトリアル・リデザインページの出現アニメーション(.rd-rv)。
// prefers-reduced-motion はCSS側で無効化済み
export function RdFx() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".rd-rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
