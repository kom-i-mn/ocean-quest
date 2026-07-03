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
              初期公開では仮コンテンツです。YouTube、note、Google Sheetsの連携後に自動反映します。
            </p>
          </article>
        ))}
      </section>
      <section className="company-cta">
        <div>
          <p className="section-kicker">Next Action</p>
          <h2>Ocean Questのコンテンツ基盤に接続する</h2>
          <p>このページは後からCMSや外部APIに接続し、更新運用できる構成にしています。</p>
        </div>
        <a className="primary-button" href="/companies">
          {cta}
          <ArrowRight size={18} />
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
