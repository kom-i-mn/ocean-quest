import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "プライバシーポリシー | Ocean Quest",
  description:
    "Ocean Questにおける個人情報の取り扱い方針（取得する情報、利用目的、外部サービス、開示・訂正・削除の請求方法）について説明します。",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    heading: "1. 事業者情報",
    body: "Ocean Quest（以下「当サービス」）は、株式会社ポテンシャライトが運営する、海洋産業に特化した採用・転職・キャリア支援サービスです。",
  },
  {
    heading: "2. 取得する情報",
    body: "当サービスは、お問い合わせフォームを通じて、お名前、会社名、メールアドレス、相談内容を取得します。また、サービス改善のためにGoogle Analyticsによりアクセス情報（閲覧ページ、参照元、ブラウザ情報など）を取得します。",
  },
  {
    heading: "3. 利用目的",
    body: "取得した個人情報は、お問い合わせへの対応、キャリア相談・採用支援サービスの提供、および当サービスの改善のためにのみ利用します。ご本人の同意なく、これらの目的以外に利用することはありません。",
  },
  {
    heading: "4. 第三者提供",
    body: "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。",
  },
  {
    heading: "5. 外部サービスの利用",
    body: "当サービスは、データ保管にSupabase、メール送信にResend、アクセス解析にGoogle Analyticsを利用しています。各サービスにおける情報の取り扱いは、各社のプライバシーポリシーに準じます。",
  },
  {
    heading: "6. Cookieとアクセス解析",
    body: "当サービスはGoogle Analyticsを利用しており、Cookieを通じて匿名のトラフィックデータを収集します。ブラウザの設定によりCookieを無効にすることができます。",
  },
  {
    heading: "7. 開示・訂正・削除の請求",
    body: "ご自身の個人情報の開示・訂正・削除をご希望の場合は、mine@potentialight.com までご連絡ください。ご本人であることを確認のうえ、速やかに対応します。",
  },
  {
    heading: "8. 改定",
    body: "本ポリシーの内容は、法令の変更やサービスの改善に応じて改定することがあります。重要な変更がある場合は、本ページでお知らせします。",
  },
];

export default function PrivacyPage() {
  return (
    <main className="subpage-shell subpage-bg-blue-water">
      <SiteHeader solid />
      <section className="subpage-hero">
        <p className="section-kicker">Privacy Policy</p>
        <h1>プライバシーポリシー</h1>
        <p>Ocean Questにおける個人情報の取り扱い方針です。（最終更新日: 2026年7月7日）</p>
      </section>

      <section className="section" aria-label="プライバシーポリシー本文">
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>{section.heading}</h2>
              <p style={{ lineHeight: 1.9, opacity: 0.9 }}>{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
