const navigation = [
  { label: "動画", href: "/videos" },
  { label: "eBook", href: "/ebooks" },
  { label: "note", href: "/notes" },
  { label: "イベント", href: "/events" },
  { label: "海の地図", href: "/map" },
  { label: "診断", href: "/diagnosis" },
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
        {navigation.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
