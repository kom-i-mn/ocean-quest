import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "送信完了 | Ocean Quest",
  robots: { index: false, follow: false },
};

export default function ContactThanksPage() {
  return (
    <main className="subpage-shell subpage-bg-contact-sunset">
      <SiteHeader solid />
      <section className="subpage-hero contact-hero">
        <p className="section-kicker">Thank You</p>
        <h1>ご相談を受け付けました</h1>
        <p>
          ご相談ありがとうございます。内容を確認のうえ、担当よりご連絡いたします。お急ぎの場合は
          mine@potentialight.com まで直接メールでご連絡ください。
        </p>
        <div className="hero-actions subpage-actions">
          <a className="primary-button" href="/notes">
            記事を読んで待つ
            <ArrowRight size={18} />
          </a>
          <a className="secondary-button light" href="/">
            トップへ戻る
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
