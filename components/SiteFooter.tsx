import { publishedQuestLinks } from "@/lib/content";

const footerColumns = [
  {
    heading: "コンテンツ",
    links: [
      { label: "動画", href: "/videos" },
      { label: "note記事", href: "/notes" },
      { label: "eBook（無料DL）", href: "/ebooks" },
      { label: "イベント", href: "/events" },
      { label: "海の地図（β）", href: "/map" },
      { label: "海洋キャリア診断", href: "/diagnosis" },
    ],
  },
  {
    // 領域別Questサイト。lib/content.tsのpublishedQuestAreasが単一ソース
    heading: "領域別Quest",
    links: publishedQuestLinks,
  },
  {
    heading: "ご相談",
    links: [
      { label: "無料キャリア相談", href: "/contact" },
      { label: "企業の方へ", href: "/companies" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="site-footer-logo"
            src="/images/brand/ocean-quest-logo.png"
            alt="Ocean Quest"
          />
          <span className="site-footer-company">株式会社ポテンシャライト</span>
          <p>
            Ocean Quest（オーシャンクエスト）は、海洋産業に特化した人材支援・採用支援サービス。
            <br />
            海のしごとの面白さを、キャリアの選択肢に。
          </p>
          <div className="site-footer-brand-links">
            <a href="/privacy">プライバシーポリシー</a>
            <span aria-hidden="true">・</span>
            <a
              href="https://www.potentialight.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              運営会社
            </a>
          </div>
        </div>
        <nav className="site-footer-nav" aria-label="サイト目次">
          {footerColumns.map((column) => (
            <div className="site-footer-column" key={column.heading}>
              <span className="site-footer-heading">{column.heading}</span>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Potentialight, Inc.</span>
      </div>
    </footer>
  );
}
