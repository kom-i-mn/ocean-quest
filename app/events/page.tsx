import { SimplePage } from "@/components/SimplePage";

export default function EventsPage() {
  return (
    <SimplePage
      kicker="Events"
      title="海洋産業の人と出会うイベント"
      description="勉強会、ウェビナー、採用イベント、企業向けセミナーの情報を掲載します。"
      items={["オンライン勉強会", "専門家対談", "採用ウェビナー", "キャリア相談会"]}
      backgroundClass="subpage-bg-port-sunset"
    />
  );
}
