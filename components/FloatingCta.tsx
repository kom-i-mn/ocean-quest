"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Building2, MessageCircle } from "lucide-react";

export function FloatingCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {pathname !== "/contact" && (
        <a
          href="/contact"
          className={`floating-cta${visible ? " is-visible" : ""}`}
          aria-label="無料相談する"
        >
          <MessageCircle size={18} />
          <span>無料相談する</span>
        </a>
      )}
      {pathname !== "/companies" && (
        <a
          href="/companies"
          className={`floating-cta floating-cta-company${visible ? " is-visible" : ""}`}
          aria-label="サービス内容を見る（企業の方へ）"
        >
          <Building2 size={18} />
          <span>サービス内容</span>
        </a>
      )}
    </>
  );
}
