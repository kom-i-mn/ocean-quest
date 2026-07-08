import path from "node:path";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { DiagnosisAreaKey } from "./content";
import {
  diagnosisReportContents,
  reportCommonNotes,
  type DiagnosisAreaScores,
} from "./diagnosis-report";

const fontDir = path.join(process.cwd(), "assets", "fonts");

Font.register({
  family: "ZenKakuGothicNew",
  fonts: [
    { src: path.join(fontDir, "ZenKakuGothicNew-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontDir, "ZenKakuGothicNew-Bold.ttf"), fontWeight: 700 },
  ],
});

// CJK text has no spaces; allow a break after every character. Interleaving
// empty strings keeps react-pdf from drawing a hyphen at the break point.
Font.registerHyphenationCallback((word) =>
  Array.from(word).flatMap((char) => [char, ""]),
);

const colors = {
  navy: "#003f4a",
  teal: "#005866",
  tealLight: "#e2f5f3",
  muted: "#4b7075",
  paper: "#fbfffd",
  accent: "#ff8a2a",
  line: "#d7ebe9",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "ZenKakuGothicNew",
    fontSize: 10,
    color: colors.navy,
    backgroundColor: colors.paper,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 46,
    lineHeight: 1.7,
  },
  headerBand: {
    backgroundColor: colors.teal,
    marginTop: -48,
    marginHorizontal: -46,
    paddingVertical: 26,
    paddingHorizontal: 46,
    marginBottom: 24,
  },
  brand: {
    color: colors.tealLight,
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 6,
  },
  reportTitle: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: 700,
  },
  reportSub: {
    color: colors.tealLight,
    fontSize: 9,
    marginTop: 6,
  },
  resultLead: {
    fontSize: 10,
    color: colors.muted,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.teal,
    lineHeight: 1.4,
    marginTop: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 10.5,
    color: colors.muted,
    marginBottom: 14,
  },
  scoreBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: 14,
    marginBottom: 18,
  },
  scoreHeading: {
    fontSize: 10.5,
    fontWeight: 700,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  scoreLabel: {
    width: 120,
    fontSize: 9,
  },
  scoreBarTrack: {
    flexGrow: 1,
    height: 7,
    backgroundColor: colors.tealLight,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  scoreBarFill: {
    height: 7,
    backgroundColor: colors.teal,
    borderRadius: 4,
  },
  scorePercent: {
    width: 32,
    fontSize: 9,
    fontWeight: 700,
    color: colors.teal,
    textAlign: "right",
  },
  sectionHeading: {
    fontSize: 12.5,
    fontWeight: 700,
    color: colors.teal,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.tealLight,
    paddingBottom: 4,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bulletMark: {
    width: 12,
    color: colors.accent,
    fontWeight: 700,
  },
  bulletText: {
    flexGrow: 1,
    flexShrink: 1,
  },
  roleCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  roleName: {
    fontSize: 10.5,
    fontWeight: 700,
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: 9.5,
    color: colors.muted,
  },
  ctaBox: {
    backgroundColor: colors.tealLight,
    borderRadius: 6,
    padding: 14,
    marginTop: 18,
  },
  ctaHeading: {
    fontSize: 11.5,
    fontWeight: 700,
    marginBottom: 4,
  },
  ctaText: {
    fontSize: 9.5,
    marginBottom: 4,
  },
  ctaUrl: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.teal,
  },
  noteText: {
    fontSize: 8,
    color: colors.muted,
    marginBottom: 4,
  },
  footerLeft: {
    position: "absolute",
    bottom: 24,
    left: 46,
    fontSize: 8,
    color: colors.muted,
  },
  footerRight: {
    position: "absolute",
    bottom: 24,
    right: 46,
    fontSize: 8,
    color: colors.muted,
  },
});

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>■</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function SectionHeading({ children }: { children: string }) {
  return <Text style={styles.sectionHeading}>{children}</Text>;
}

function DiagnosisReportDocument({
  scores,
  generatedAt,
}: {
  scores: DiagnosisAreaScores;
  generatedAt: string;
}) {
  const ranked = (Object.keys(scores) as DiagnosisAreaKey[])
    .map((key) => ({ key, percent: scores[key] }))
    .sort((a, b) => b.percent - a.percent);
  const top = ranked[0];
  const second = ranked[1];
  const content = diagnosisReportContents[top.key];
  const secondContent = diagnosisReportContents[second.key];
  const isClose = top.percent - second.percent <= 10;

  return (
    <Document
      title="海洋産業キャリア診断レポート | Ocean Quest"
      author="Ocean Quest (株式会社ポテンシャライト)"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.footerLeft} fixed>
          Ocean Quest 海洋産業キャリア診断レポート
        </Text>
        <Text style={styles.footerRight} fixed>
          ocean-quest.jp
        </Text>
        <View style={styles.headerBand}>
          <Text style={styles.brand}>OCEAN QUEST</Text>
          <Text style={styles.reportTitle}>海洋産業キャリア診断レポート【詳細版】</Text>
          <Text style={styles.reportSub}>作成日: {generatedAt} ／ 発行: Ocean Quest（株式会社ポテンシャライト）</Text>
        </View>

        <Text style={styles.resultLead}>あなたの興味・志向に最も近い海洋産業の入口は</Text>
        <Text style={styles.resultTitle}>{content.title}</Text>
        <Text style={styles.tagline}>{content.tagline}</Text>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreHeading}>あなたの回答から見た9領域のマッチ度</Text>
          {ranked.map((entry) => (
            <View style={styles.scoreRow} key={entry.key}>
              <Text style={styles.scoreLabel}>{diagnosisReportContents[entry.key].title}</Text>
              <View style={styles.scoreBarTrack}>
                <View style={[styles.scoreBarFill, { width: `${entry.percent}%` }]} />
              </View>
              <Text style={styles.scorePercent}>{entry.percent}%</Text>
            </View>
          ))}
          {isClose ? (
            <Text style={{ fontSize: 8.5, color: colors.muted, marginTop: 4 }}>
              2位の「{secondContent.title}」とのスコア差はわずかです。本レポートの1位領域と合わせて、2位の領域も視野に入れて情報収集することをおすすめします。
            </Text>
          ) : null}
        </View>

        <SectionHeading>この領域の全体像</SectionHeading>
        {content.overview.map((paragraph) => (
          <Text style={styles.paragraph} key={paragraph.slice(0, 16)}>
            {paragraph}
          </Text>
        ))}

        <SectionHeading>いま起きていること（市場動向）</SectionHeading>
        {content.trends.map((trend) => (
          <Bullet text={trend} key={trend.slice(0, 16)} />
        ))}

      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.footerLeft} fixed>
          Ocean Quest 海洋産業キャリア診断レポート
        </Text>
        <Text style={styles.footerRight} fixed>
          ocean-quest.jp
        </Text>
        <SectionHeading>代表的な職種と仕事内容</SectionHeading>
        {content.roles.map((role) => (
          <View style={styles.roleCard} key={role.name} wrap={false}>
            <Text style={styles.roleName}>{role.name}</Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
          </View>
        ))}

        <SectionHeading>活かせる経験・スキル</SectionHeading>
        {content.backgrounds.map((item) => (
          <Bullet text={item} key={item.slice(0, 16)} />
        ))}

        <SectionHeading>転職前に知っておきたいこと</SectionHeading>
        {content.realities.map((item) => (
          <Bullet text={item} key={item.slice(0, 16)} />
        ))}

        <SectionHeading>最初の一歩（今週からできること）</SectionHeading>
        {content.firstSteps.map((item) => (
          <Bullet text={item} key={item.slice(0, 16)} />
        ))}

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaHeading}>この先は、無料キャリア相談で一緒に整理しませんか</Text>
          <Text style={styles.ctaText}>
            Ocean Questでは、海洋産業に特化したキャリアアドバイザーが、あなたの経験の棚卸しから、領域・職種の選び方、具体的な企業の探し方までを無料でサポートしています。診断結果を持って、お気軽にご相談ください。
          </Text>
          <Text style={styles.ctaUrl}>https://ocean-quest.jp/contact</Text>
        </View>

        <View style={{ marginTop: 14 }}>
          {reportCommonNotes.map((note) => (
            <Text style={styles.noteText} key={note.slice(0, 16)}>
              ※ {note}
            </Text>
          ))}
        </View>

      </Page>
    </Document>
  );
}

export async function renderDiagnosisReportPdf(scores: DiagnosisAreaScores) {
  const generatedAt = new Date().toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return renderToBuffer(
    <DiagnosisReportDocument scores={scores} generatedAt={generatedAt} />,
  );
}
