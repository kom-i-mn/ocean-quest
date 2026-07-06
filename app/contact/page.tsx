import { ArrowRight, Mail, MessageSquareText, Ship } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { ProfileCta } from "@/components/ProfileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const topics = [
  "海洋産業の採用相談",
  "採用ブランディング",
  "スカウト・母集団形成",
  "記事・動画・イベント連携",
];

export default function ContactPage() {
  return (
    <main className="subpage-shell subpage-bg-contact-sunset">
      <SiteHeader solid />
      <section className="subpage-hero contact-hero">
        <p className="section-kicker">Contact</p>
        <h1>Ocean Questに相談する</h1>
        <p>
          海洋産業の採用、転職・キャリア相談、記事・動画・イベント連携について、お気軽にご相談ください。内容が固まっていない段階でも、状況を伺いながら一緒に整理します。
        </p>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="#contact-form">
            相談を送信する
            <ArrowRight size={18} />
          </a>
          <a
            className="secondary-button light"
            href="mailto:hello@potentialight.co?subject=Ocean%20Quest%E3%81%B8%E3%81%AE%E7%9B%B8%E8%AB%87"
          >
            メールで相談する
          </a>
        </div>
      </section>

      <section className="section contact-layout">
        <div className="contact-panel" id="contact-form">
          <div className="card-icon">
            <MessageSquareText size={22} />
          </div>
          <h2>相談内容</h2>
          <ContactForm topics={topics} />
        </div>

        <aside className="contact-side">
          <div className="contact-side-card">
            <Ship size={28} />
            <h3>まずはメールで相談する</h3>
            <p>
              採用やキャリア相談の内容がまだ整理できていない段階でも大丈夫です。まずは現在の状況や関心テーマをお送りください。
            </p>
            <a
              className="secondary-button light"
              href="mailto:hello@potentialight.co?subject=Ocean%20Quest%E3%81%B8%E3%81%AE%E7%9B%B8%E8%AB%87"
            >
              <Mail size={18} />
              メールで相談
            </a>
          </div>
          <div className="contact-side-card">
            <h3>相談できること</h3>
            <ul>
              {topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
            <a href="/companies">
              企業向け支援を見る
              <ArrowRight size={16} />
            </a>
          </div>
        </aside>
      </section>

      <ProfileCta
        primaryLabel="noteで全記事を見る"
        primaryHref="https://note.com/gentle_moraea373"
        secondaryLabel="企業向け支援を見る"
        secondaryHref="/companies"
      />
      <SiteFooter />
    </main>
  );
}
