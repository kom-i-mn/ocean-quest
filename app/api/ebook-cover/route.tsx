import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// eBookカバー画像の自動生成(PM Quest方式: タイトル文字入り+シリーズ別配色のフラットデザイン)
// 使い方: /api/ebook-cover?title=...&category=...

const categoryThemes: Record<string, { from: string; to: string; accent: string }> = {
  業界理解: { from: "#00343f", to: "#005866", accent: "#7fd6c2" },
  "職種・キャリア": { from: "#0b3a5c", to: "#14638f", accent: "#8fd0f5" },
  転職ノウハウ: { from: "#4a2f00", to: "#8a5a10", accent: "#ffd08a" },
  "市場・データ": { from: "#1f2a4d", to: "#3b4f8f", accent: "#aab8f5" },
  "企業・現場研究": { from: "#123d2e", to: "#1f6b4f", accent: "#95e0bd" },
};

const defaultTheme = { from: "#00343f", to: "#005866", accent: "#7fd6c2" };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Ocean Quest eBook").slice(0, 80);
  const category = searchParams.get("category") ?? "";
  const theme = categoryThemes[category] ?? defaultTheme;

  const fontDir = path.join(process.cwd(), "assets", "fonts");
  const [fontRegular, fontBold] = await Promise.all([
    readFile(path.join(fontDir, "ZenKakuGothicNew-Regular.ttf")),
    readFile(path.join(fontDir, "ZenKakuGothicNew-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          backgroundImage: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
          fontFamily: "ZenKakuGothicNew",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              color: "#fbfffd",
              fontSize: 28,
              letterSpacing: "0.18em",
              opacity: 0.85,
            }}
          >
            OCEAN QUEST eBOOK
          </div>
          {category ? (
            <div
              style={{
                display: "flex",
                color: theme.from,
                backgroundColor: theme.accent,
                borderRadius: 999,
                padding: "10px 26px",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {category}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            color: "#fbfffd",
            fontSize: title.length > 32 ? 52 : 64,
            fontWeight: 700,
            lineHeight: 1.4,
            maxWidth: "100%",
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 46,
                height: 46,
                borderRadius: 999,
                backgroundColor: theme.accent,
                color: theme.from,
                fontSize: 28,
                fontWeight: 700,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 18,
              }}
            >
              ⚓
            </div>
            <div style={{ display: "flex", color: "#fbfffd", fontSize: 28, fontWeight: 700 }}>
              Ocean Quest
            </div>
          </div>
          <div style={{ display: "flex", color: "#fbfffd", fontSize: 24, opacity: 0.75 }}>
            ocean-quest.jp
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "ZenKakuGothicNew", data: fontRegular, weight: 400 },
        { name: "ZenKakuGothicNew", data: fontBold, weight: 700 },
      ],
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
