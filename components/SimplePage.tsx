import { ArrowRight, Ship } from "lucide-react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SimplePage({
  kicker,
  title,
  description,
  items,
  cta = "相談する",
}: {
  kicker: string;
  title: string;
  description: string;
  items: string[];
  cta?: string;
}) {
  return (
    <main>
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      <section className="section subpage-grid">
        {items.map((item) => (
          <article className="flow-card" key={item}>
            <Ship size={22} />
            <strong>{item}</strong>
            <p>
              Ocean Questのコンテンツ基盤に順次接続し、公開済みの記事・動画・イベント情報を整理して掲載します。
            </p>
          </article>
        ))}
      </section>
      <section className="company-cta">
        <div>
          <p className="section-kicker">Next Action</p>
          <h2>海洋産業の情報を、採用とキャリアの意思決定につなげる</h2>
          <p>必要な情報に迷わずたどり着けるよう、テーマ別・対象者別にコンテンツを拡充していきます。</p>
        </div>
        <a className="primary-button" href="/contact">
          {cta}
          <ArrowRight size={18} />
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
