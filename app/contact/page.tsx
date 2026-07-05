import { ArrowRight, Mail, MessageSquareText, Send, Ship } from "lucide-react";
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
          海洋産業に関する採用支援、キャリア相談、コンテンツ連携について、お気軽にご相談ください。
          フォーム送信機能は次の段階でメール通知・CRM連携に接続します。
        </p>
      </section>

      <section className="section contact-layout">
        <div className="contact-panel">
          <div className="card-icon">
            <MessageSquareText size={22} />
          </div>
          <h2>相談内容</h2>
          <form className="contact-form">
            <label>
              お名前
              <input name="name" placeholder="山田 太郎" />
            </label>
            <label>
              会社名
              <input name="company" placeholder="株式会社〇〇" />
            </label>
            <label>
              メールアドレス
              <input name="email" placeholder="name@example.com" type="email" />
            </label>
            <label>
              相談したい内容
              <select name="topic" defaultValue="">
                <option value="" disabled>
                  選択してください
                </option>
                {topics.map((topic) => (
                  <option value={topic} key={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>
            <label>
              詳細
              <textarea
                name="message"
                placeholder="採用したい職種、困っていること、相談したい背景などをご記入ください。"
                rows={7}
              />
            </label>
            <button className="primary-button" type="button">
              送信機能を接続予定
              <Send size={18} />
            </button>
          </form>
        </div>

        <aside className="contact-side">
          <div className="contact-side-card">
            <Ship size={28} />
            <h3>まずはメールで相談する</h3>
            <p>
              フォームの送信処理を接続するまでは、メール起動の導線から相談できます。送信先メールアドレスは後で正式な窓口に差し替えます。
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

      <SiteFooter />
    </main>
  );
}
