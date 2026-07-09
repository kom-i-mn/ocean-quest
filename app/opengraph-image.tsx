import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// SNS/Slackのリンクプレビュー用OGP画像(全ページ共通のデフォルト)。
// 写真だけでなく「何のサイトか」が一目で伝わるよう、ロゴ+タグラインを合成する。

export const runtime = "nodejs";
export const alt = "Ocean Quest | 海洋産業専門の採用・転職・キャリア支援サービス";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const root = process.cwd();
  const [fontBold, fontRegular, heroPhoto, oqLogo, plLogo] = await Promise.all([
    readFile(path.join(root, "assets", "fonts", "ZenKakuGothicNew-Bold.ttf")),
    readFile(path.join(root, "assets", "fonts", "ZenKakuGothicNew-Regular.ttf")),
    readFile(path.join(root, "public", "images", "ocean-quest-hero.jpg")),
    readFile(path.join(root, "public", "images", "brand", "ocean-quest-logo.png")),
    readFile(path.join(root, "public", "images", "brand", "potentialight-logo-white.png")),
  ]);

  const heroSrc = `data:image/jpeg;base64,${heroPhoto.toString("base64")}`;
  const oqLogoSrc = `data:image/png;base64,${oqLogo.toString("base64")}`;
  const plLogoSrc = `data:image/png;base64,${plLogo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "ZenKaku",
          backgroundColor: "#00343f",
        }}
      >
        {/* 背景写真 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* 左からのグラデーション(文字の可読性確保) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(100deg, rgba(0,43,52,0.94) 0%, rgba(0,52,63,0.82) 42%, rgba(0,52,63,0.28) 72%, rgba(0,52,63,0.05) 100%)",
          }}
        />
        {/* コンテンツ */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px 56px",
            width: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={oqLogoSrc} alt="Ocean Quest" width={428} height={72} />

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#ffffff",
                fontSize: 52,
                fontWeight: 700,
                lineHeight: 1.35,
                textShadow: "0 2px 18px rgba(0,20,30,0.55)",
              }}
            >
              <span>海洋産業専門の</span>
              <span>採用・転職・キャリア支援サービス</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {["キャリア相談", "3分キャリア診断", "企業の採用支援", "領域別Quest"].map(
                (chip) => (
                  <div
                    key={chip}
                    style={{
                      display: "flex",
                      padding: "10px 22px",
                      borderRadius: 999,
                      border: "1.5px solid rgba(255,255,255,0.55)",
                      backgroundColor: "rgba(0,52,63,0.45)",
                      color: "#ffffff",
                      fontSize: 22,
                      fontWeight: 400,
                    }}
                  >
                    {chip}
                  </div>
                ),
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "rgba(255,255,255,0.9)",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              ocean-quest.jp
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", color: "rgba(255,255,255,0.75)", fontSize: 20 }}>
                運営
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={plLogoSrc} alt="POTENTIALIGHT" width={284} height={30} />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "ZenKaku", data: fontBold, weight: 700 },
        { name: "ZenKaku", data: fontRegular, weight: 400 },
      ],
    },
  );
}
