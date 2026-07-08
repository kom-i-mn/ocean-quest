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
import type { EbookContent } from "./ebook-generator";

const fontDir = path.join(process.cwd(), "assets", "fonts");

Font.register({
  family: "ZenKakuGothicNew",
  fonts: [
    { src: path.join(fontDir, "ZenKakuGothicNew-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontDir, "ZenKakuGothicNew-Bold.ttf"), fontWeight: 700 },
  ],
});

// CJK対応: 文字ごとの改行を許可しつつハイフンを出さない
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
};

const styles = StyleSheet.create({
  coverPage: {
    fontFamily: "ZenKakuGothicNew",
    backgroundColor: colors.teal,
    padding: 54,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  coverKicker: {
    color: colors.paper,
    opacity: 0.8,
    fontSize: 11,
    letterSpacing: 3,
  },
  coverBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.paper,
    color: colors.teal,
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  coverTitle: {
    color: colors.paper,
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  coverSubtitle: {
    color: "#d7f4ef",
    fontSize: 13,
    lineHeight: 1.7,
  },
  coverFooter: {
    color: colors.paper,
    fontSize: 10,
    opacity: 0.85,
  },
  page: {
    fontFamily: "ZenKakuGothicNew",
    backgroundColor: colors.paper,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 46,
    color: colors.navy,
    fontSize: 10.5,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.teal,
    borderBottom: `2 solid ${colors.tealLight}`,
    paddingBottom: 5,
    marginTop: 18,
    marginBottom: 10,
  },
  paragraph: {
    lineHeight: 1.9,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bulletMark: {
    color: colors.accent,
    marginRight: 6,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.7,
  },
  audienceBox: {
    backgroundColor: colors.tealLight,
    borderRadius: 6,
    padding: 14,
    marginBottom: 6,
  },
  audienceHeading: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.teal,
    marginBottom: 6,
  },
  takeawayBox: {
    backgroundColor: "#fff6ec",
    border: "1 solid #ffd8ad",
    borderRadius: 6,
    padding: 14,
    marginTop: 16,
  },
  ctaBox: {
    backgroundColor: colors.teal,
    borderRadius: 6,
    padding: 18,
    marginTop: 20,
  },
  ctaHeading: {
    color: colors.paper,
    fontSize: 12.5,
    fontWeight: 700,
    marginBottom: 6,
  },
  ctaText: {
    color: "#d7f4ef",
    fontSize: 10,
    lineHeight: 1.8,
  },
  ctaUrl: {
    color: "#ffd8ad",
    fontSize: 10.5,
    fontWeight: 700,
    marginTop: 8,
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

function EbookDocument({
  ebook,
  sourceUrl,
  generatedAt,
}: {
  ebook: EbookContent;
  sourceUrl: string;
  generatedAt: string;
}) {
  return (
    <Document title={`${ebook.title} | Ocean Quest eBook`} author="Ocean Quest (株式会社ポテンシャライト)">
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.coverKicker}>OCEAN QUEST eBOOK</Text>
        </View>
        <View>
          <Text style={styles.coverBadge}>{ebook.category}</Text>
          <Text style={styles.coverTitle}>{ebook.title}</Text>
          <Text style={styles.coverSubtitle}>{ebook.subtitle}</Text>
        </View>
        <View>
          <Text style={styles.coverFooter}>
            発行: Ocean Quest（株式会社ポテンシャライト） ／ {generatedAt} ／ ocean-quest.jp
          </Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.footerLeft} fixed>
          {ebook.title} | Ocean Quest eBook
        </Text>
        <Text style={styles.footerRight} fixed>
          ocean-quest.jp
        </Text>

        <View style={styles.audienceBox}>
          <Text style={styles.audienceHeading}>このeBookでわかること</Text>
          <Text style={{ lineHeight: 1.8 }}>{ebook.summary}</Text>
        </View>
        <View style={styles.audienceBox}>
          <Text style={styles.audienceHeading}>想定読者</Text>
          {ebook.targetAudience.map((item) => (
            <View style={styles.bulletRow} key={item.slice(0, 20)}>
              <Text style={styles.bulletMark}>■</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {ebook.chapters.map((chapter, index) => (
          <View key={chapter.heading.slice(0, 20)}>
            <Text style={styles.sectionHeading}>
              {index + 1}. {chapter.heading}
            </Text>
            {chapter.paragraphs.map((paragraph) => (
              <Text style={styles.paragraph} key={paragraph.slice(0, 24)}>
                {paragraph}
              </Text>
            ))}
            {chapter.bullets.map((bullet) => (
              <View style={styles.bulletRow} key={bullet.slice(0, 24)}>
                <Text style={styles.bulletMark}>■</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.takeawayBox} wrap={false}>
          <Text style={[styles.audienceHeading, { color: "#8a5a10" }]}>この資料の重要ポイント</Text>
          {ebook.keyTakeaways.map((item) => (
            <View style={styles.bulletRow} key={item.slice(0, 24)}>
              <Text style={[styles.bulletMark, { color: "#c77b1e" }]}>✓</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaHeading}>海洋産業のキャリアを、一緒に考えませんか</Text>
          <Text style={styles.ctaText}>
            Ocean Questでは、海洋産業に特化したキャリアアドバイザーによる無料相談を行っています。この資料の内容をあなたの経歴に引き付けて整理したい方は、お気軽にご相談ください。約3分の海洋キャリア診断もあります。
          </Text>
          <Text style={styles.ctaUrl}>無料相談: https://ocean-quest.jp/contact ／ キャリア診断: https://ocean-quest.jp/diagnosis</Text>
        </View>

        <Text style={[styles.paragraph, { marginTop: 14, fontSize: 8, color: colors.muted }]}>
          ※ 本資料はOcean Questのnote記事(
          {sourceUrl}
          )をもとに再構成したものです。無断転載はご遠慮ください。
        </Text>
      </Page>
    </Document>
  );
}

export async function renderEbookPdf(ebook: EbookContent, sourceUrl: string) {
  const generatedAt = new Date().toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return renderToBuffer(
    <EbookDocument ebook={ebook} sourceUrl={sourceUrl} generatedAt={generatedAt} />,
  );
}
