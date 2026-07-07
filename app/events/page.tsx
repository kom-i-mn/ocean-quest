import { SimplePage } from "@/components/SimplePage";

export const metadata = {
  title: "イベント | 海洋産業の人と出会う | Ocean Quest",
  description:
    "海洋産業に関心のある人と企業・専門家がつながる勉強会、ウェビナー、対談、キャリア相談会を準備中。開催情報の案内を受け取れます。",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <SimplePage
      kicker="Events"
      title="海洋産業に関わる人と、出会う。"
      description="勉強会、ウェビナー、対談、キャリア相談会などを通じて、海洋産業に関心のある人と企業・専門家がつながる場をつくります。学ぶだけで終わらず、次のキャリアや採用につながる接点を提供します。"
      items={["オンライン勉強会", "専門家対談", "採用ウェビナー", "キャリア相談会"]}
      cta="イベントを見る"
      ctaHref="#contents"
      secondaryCta="開催情報を受け取る"
      secondaryHref="/contact"
      comingSoon
      backgroundClass="subpage-bg-port-sunset"
    />
  );
}
