"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

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

  if (pathname === "/contact") {
    return null;
  }

  return (
    <a href="/contact" className={`floating-cta${visible ? " is-visible" : ""}`} aria-label="無料相談する">
      <MessageCircle size={18} />
      <span>無料相談する</span>
    </a>
  );
}
