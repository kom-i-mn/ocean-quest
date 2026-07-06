import Image from "next/image";
import { ArrowRight, BookOpenText, MessageCircle, PenLine } from "lucide-react";

type ProfileCtaProps = {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function ProfileCta({
  primaryLabel = "無料相談する",
  primaryHref = "/contact",
  secondaryLabel = "noteで全記事を見る",
  secondaryHref = "https://note.com/gentle_moraea373",
}: ProfileCtaProps) {
  return (
    <section className="profile-cta" aria-label="運営者プロフィール">
      <div className="profile-cta-photo">
        <Image
          src="/images/minenaho-profile.jpg"
          alt="Ocean Questを運営するミネナホのプロフィール写真"
          width={96}
          height={96}
          sizes="72px"
        />
      </div>
      <div className="profile-cta-copy">
        <p className="section-kicker">Founder</p>
        <p>
          運営者のミネナホです。2022年からポテンシャライトで30社以上の採用支援に携わり、海洋産業特化のキャリア・採用支援を行っています。
          noteでは業界解説のほか、マンガから組織やキャリアを読み解く「マンガ×組織論」も書いています。
        </p>
        <div className="profile-cta-points">
          <span>
            <MessageCircle size={14} />
            採用・キャリア相談
          </span>
          <span>
            <BookOpenText size={14} />
            海洋産業の解説記事
          </span>
          <span>
            <PenLine size={14} />
            マンガ×組織論
          </span>
        </div>
      </div>
      <div className="profile-cta-actions">
        <a className="primary-button" href={primaryHref}>
          {primaryLabel}
          <ArrowRight size={16} />
        </a>
        <a className="secondary-button light" href={secondaryHref}>
          {secondaryLabel}
        </a>
      </div>
    </section>
  );
}
