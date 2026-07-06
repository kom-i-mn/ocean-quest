import { ArrowRight, Ship } from "lucide-react";
import { ProfileCta } from "./ProfileCta";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SimplePage({
  kicker,
  title,
  description,
  items,
  cta,
  ctaHref = "/contact",
  secondaryCta,
  secondaryHref,
  comingSoon = false,
  backgroundClass,
}: {
  kicker: string;
  title: string;
  description: string;
  items: string[];
  cta?: string;
  ctaHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  comingSoon?: boolean;
  backgroundClass: string;
}) {
  return (
    <main className={`subpage-shell ${backgroundClass}`}>
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {(cta || secondaryCta) && (
          <div className="hero-actions subpage-actions">
            {cta && (
              <a className="primary-button" href={ctaHref}>
                {cta}
                <ArrowRight size={18} />
              </a>
            )}
            {secondaryCta && secondaryHref && (
              <a className="secondary-button light" href={secondaryHref}>
                {secondaryCta}
              </a>
            )}
          </div>
        )}
      </section>
      <section className="section subpage-grid" id="contents">
        {comingSoon ? (
          <div className="empty-state">
            <Ship size={28} />
            <h2>To Be Continued</h2>
            <p>
              現在、公開に向けて準備中です。海洋産業の理解やキャリア・採用に役立つコンテンツを順次お届けしていきます。
            </p>
          </div>
        ) : (
          items.map((item) => (
            <article className="flow-card" key={item}>
              <Ship size={22} />
              <strong>{item}</strong>
              <p>海洋産業の理解やキャリア・採用に役立つ情報を、テーマごとに整理してお届けします。</p>
            </article>
          ))
        )}
      </section>
      <ProfileCta />
      <SiteFooter />
    </main>
  );
}
