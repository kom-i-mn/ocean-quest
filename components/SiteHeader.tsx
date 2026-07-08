import { ChevronDown } from "lucide-react";
import { publishedQuestLinks } from "@/lib/content";

const navigationBefore = [
  { label: "動画", href: "/videos" },
  { label: "eBook", href: "/ebooks" },
  { label: "note", href: "/notes" },
  { label: "イベント", href: "/events" },
  { label: "海の地図", href: "/map" },
  { label: "診断", href: "/diagnosis" },
];

const navigationAfter = [
  { label: "企業の方へ", href: "/companies" },
  { label: "問い合わせ", href: "/contact" },
];

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  return (
    <header className={solid ? "site-header solid" : "site-header"}>
      <a className="brand" href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="brand-logo"
          src="/images/brand/ocean-quest-logo.png"
          alt="Ocean Quest"
        />
      </a>
      <nav aria-label="Primary navigation">
        {navigationBefore.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
        <details className="nav-dropdown">
          <summary>
            領域別Quest
            <ChevronDown size={14} aria-hidden="true" />
          </summary>
          <div className="nav-dropdown-menu">
            {publishedQuestLinks.map(({ label, href }) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
            <span className="nav-dropdown-note">領域別サイトは順次追加予定</span>
          </div>
        </details>
        {navigationAfter.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
