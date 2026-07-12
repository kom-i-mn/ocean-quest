import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// ページ別OGP画像の共通レンダラー。
// 全ページ共通の骨格(ロゴ左上・ocean-quest.jp+運営ロゴ下段・背景写真+可読性グラデーション)を保ち、
// 中央のモチーフだけをページの役割に合わせて切り替える。
//
// 差し替え規約: public/images/ogp/<ページキー>.png (1200x630) を置くと、
// 生成画像の代わりにそのファイルがそのまま配信される(デザイナー入稿・AI生成画像への差し替え用)。

export const ogSize = { width: 1200, height: 630 };

export type OgPageKey =
  | "home"
  | "videos"
  | "notes"
  | "ebooks"
  | "events"
  | "companies"
  | "robotics"
  | "diagnosis"
  | "map"
  | "contact"
  | "interview"
  | "news";

type OgVariant =
  | "standard" // 標準: キッカー+タイトル+チップ(トップ・企業・診断・地図・相談・Quest)
  | "video" // 動画: 再生ボタン+シークバーのプレイヤーモチーフ
  | "article" // 記事: 白カード+引用符+大きなタイトル
  | "ebook" // eBook: 表紙スタックの書籍モチーフ
  | "event" // イベント: チケット風の破線フレームバナー
  | "interview" // インタビュー: 人物円形写真+発言引用
  | "news"; // ニュース: マストヘッド+見出し帯

type OgPageConfig = {
  variant: OgVariant;
  alt: string;
  /** public/ 配下の背景写真パス */
  photo: string;
  /** 英字キッカー(小さな見出しラベル) */
  kicker?: string;
  /** Quest系のティールピルバッジ */
  badge?: string;
  /** タイトル(行ごとに分割) */
  title: string[];
  chips?: string[];
  /** 明るい背景写真のページは "strong" でグラデーションを濃くして可読性を確保する */
  shade?: "strong";
  /** interview用: 人物写真(public/配下)・名前・肩書き */
  person?: { photo: string; name: string; role: string };
};

export const ogPages: Record<OgPageKey, OgPageConfig> = {
  home: {
    variant: "standard",
    alt: "Ocean Quest | 海洋産業専門の採用・転職・キャリア支援サービス",
    photo: "images/ocean-quest-hero.jpg",
    title: ["海洋産業専門の", "採用・転職・キャリア支援サービス"],
    chips: ["キャリア相談", "3分キャリア診断", "企業の採用支援", "領域別Quest"],
  },
  videos: {
    variant: "video",
    alt: "動画で学ぶ海洋産業 | Ocean Quest",
    photo: "images/backgrounds/shark-deep.jpg",
    kicker: "VIDEO LIBRARY",
    title: ["動画で学ぶ、", "海の仕事。"],
    chips: ["専門家対談", "業界解説", "現場のリアル"],
  },
  notes: {
    variant: "article",
    alt: "海洋産業を読み解くnote記事 | Ocean Quest",
    photo: "images/backgrounds/jellyfish-dark.jpg",
    kicker: "NOTE ARTICLES",
    title: ["ニュースでは見えない、", "海洋産業の文脈を言語化する。"],
  },
  ebooks: {
    variant: "ebook",
    alt: "eBook | 海洋産業の採用・キャリア資料を無料ダウンロード | Ocean Quest",
    photo: "images/backgrounds/bubbles.jpg",
    kicker: "FREE EBOOK LIBRARY",
    title: ["海洋産業の教科書を、", "無料でダウンロード。"],
    chips: ["業界理解", "職種理解", "転職ノウハウ", "市場データ"],
    shade: "strong",
  },
  events: {
    variant: "event",
    alt: "イベント | 海洋産業の人と出会う | Ocean Quest",
    photo: "images/backgrounds/harbor-sunset.jpg",
    kicker: "EVENT",
    title: ["海洋産業に関わる人と、", "出会う。"],
    chips: ["勉強会", "ウェビナー", "対談", "キャリア相談会"],
  },
  companies: {
    variant: "standard",
    alt: "企業向け採用支援 | 海洋産業特化の採用パートナー | Ocean Quest",
    photo: "images/backgrounds/container-port.jpg",
    kicker: "FOR COMPANIES",
    title: ["業界理解を土台にした、", "海洋産業特化の採用支援。"],
    chips: ["採用戦略設計", "採用ブランディング", "スカウト", "母集団形成"],
    shade: "strong",
  },
  robotics: {
    variant: "standard",
    alt: "QUEST 01 水中ロボティクスのしごと | ROV・AUV・水中ドローンの転職・キャリア | Ocean Quest",
    photo: "images/backgrounds/deep-dive.jpg",
    badge: "QUEST 01 水中ロボティクスのしごと",
    title: ["あなたの経験は、", "水中で武器になる。"],
    chips: ["職種マップ", "スキルブリッジ", "企業・機関マップ", "適性診断"],
  },
  diagnosis: {
    variant: "standard",
    alt: "海洋産業キャリア診断 | Ocean Quest",
    photo: "images/backgrounds/sun-jellyfish.jpg",
    kicker: "CAREER DIAGNOSIS",
    title: ["11問で見つかる、", "あなたの海洋キャリアタイプ。"],
    chips: ["9領域×4職種", "全36タイプ", "無料・約3分"],
    shade: "strong",
  },
  map: {
    variant: "standard",
    alt: "海の地図(β) | Ocean Quest",
    photo: "images/backgrounds/blue-water.jpg",
    kicker: "OCEAN MAP β",
    title: ["海の「いま」を、", "地図で探検する。"],
    chips: ["海流", "港湾", "海底ケーブル", "灯台"],
  },
  contact: {
    variant: "standard",
    alt: "相談する | 採用・転職・キャリア相談 | Ocean Quest",
    photo: "images/backgrounds/contact-sunset-family.jpg",
    kicker: "CONTACT",
    title: ["海の仕事の相談、", "まずはここから。"],
    chips: ["転職・キャリア相談", "採用のご相談", "連携のご相談"],
    shade: "strong",
  },
  // ---- 以下はページ公開前のテンプレート(ルートに opengraph-image.tsx を置けば即使える) ----
  interview: {
    variant: "interview",
    alt: "インタビュー | 海で働く人の言葉 | Ocean Quest",
    photo: "images/backgrounds/deep-sea.jpg",
    kicker: "INTERVIEW",
    title: ["「海の現場で働く」を、", "本人の言葉で。"],
    person: {
      photo: "images/minenaho-profile.jpg",
      name: "インタビュイー氏名",
      role: "所属・役職",
    },
  },
  news: {
    variant: "news",
    alt: "ニュース | 海洋産業の動きをキャリア視点で | Ocean Quest",
    photo: "images/backgrounds/ocean-foam.jpg",
    kicker: "OCEAN QUEST NEWS",
    title: ["海洋産業の動きを、", "キャリア視点で読み解く。"],
    chips: ["業界ニュース"],
    shade: "strong",
  },
};

const INK = "#0c2b33";
const ORANGE = "#ff7a21";

async function loadPublicFile(relPath: string) {
  return readFile(path.join(process.cwd(), "public", ...relPath.split("/")));
}

function toDataUri(buf: Buffer, mime: string) {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function Kicker({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          display: "flex",
          width: 46,
          height: 5,
          borderRadius: 3,
          backgroundColor: ORANGE,
        }}
      />
      <div
        style={{
          display: "flex",
          color: "rgba(255,255,255,0.92)",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 6,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function TitleLines({
  lines,
  fontSize = 52,
  color = "#ffffff",
}: {
  lines: string[];
  fontSize?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color,
        fontSize,
        fontWeight: 700,
        lineHeight: 1.35,
        // satoriはundefined値のスタイルで落ちるため、条件付きスタイルはスプレッドで足す
        ...(color === "#ffffff"
          ? { textShadow: "0 2px 18px rgba(0,20,30,0.55)" }
          : {}),
      }}
    >
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
}

function Chips({ chips }: { chips: string[] }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {chips.map((chip) => (
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
      ))}
    </div>
  );
}

/** 動画: 再生ボタン+シークバー(サムネイルのスタックで動画ライブラリ感を出す) */
function VideoMotif() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 400,
        height: 300,
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: 330,
          height: 208,
          borderRadius: 24,
          backgroundColor: "rgba(255,255,255,0.14)",
          transform: "rotate(7deg) translate(26px, -20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: 330,
          height: 208,
          borderRadius: 24,
          backgroundColor: "rgba(255,255,255,0.22)",
          transform: "rotate(-5deg) translate(-22px, 16px)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 350,
          height: 222,
          borderRadius: 24,
          backgroundColor: "rgba(0,22,30,0.82)",
          border: "2px solid rgba(255,255,255,0.4)",
          boxShadow: "0 24px 60px rgba(0,10,16,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 112,
            height: 80,
            borderRadius: 22,
            background: "linear-gradient(135deg, #ff9a4d, #ff6a1a)",
          }}
        >
          <svg width="34" height="40" viewBox="0 0 34 40">
            <path d="M2 2 L32 20 L2 38 Z" fill="#ffffff" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            width: 270,
            height: 7,
            borderRadius: 4,
            backgroundColor: "rgba(255,255,255,0.32)",
            marginTop: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 102,
              height: 7,
              borderRadius: 4,
              backgroundColor: ORANGE,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** eBook: 表紙スタック+無料バッジで「資料・書籍」を伝える */
function EbookMotif({ oqLogoSrc }: { oqLogoSrc: string }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 400,
        height: 400,
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: 252,
          height: 336,
          borderRadius: 14,
          backgroundColor: "rgba(9,64,76,0.85)",
          transform: "rotate(9deg) translate(30px, 6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: 252,
          height: 336,
          borderRadius: 14,
          backgroundColor: "rgba(16,104,120,0.9)",
          transform: "rotate(4.5deg) translate(14px, 2px)",
        }}
      />
      <div
        style={{
          display: "flex",
          width: 260,
          height: 344,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 26px 60px rgba(0,10,16,0.55)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 20,
            height: "100%",
            backgroundColor: "#062f38",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            background: "linear-gradient(160deg, #0e7c8c 0%, #063845 100%)",
            padding: "26px 24px 22px",
          }}
        >
          <img src={oqLogoSrc} alt="" width={140} height={24} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#ffffff",
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            <span>海洋産業の</span>
            <span>教科書</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "rgba(255,255,255,0.8)",
                fontSize: 15,
                letterSpacing: 2,
              }}
            >
              OCEAN QUEST EBOOK
            </div>
            <div
              style={{
                display: "flex",
                width: 40,
                height: 5,
                borderRadius: 3,
                backgroundColor: ORANGE,
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 6,
          right: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 104,
          height: 104,
          borderRadius: 52,
          background: "linear-gradient(135deg, #ff9a4d, #ff6a1a)",
          color: "#ffffff",
          fontSize: 30,
          fontWeight: 700,
          boxShadow: "0 12px 30px rgba(0,10,16,0.45)",
          transform: "rotate(10deg)",
        }}
      >
        無料
      </div>
    </div>
  );
}

async function loadFonts() {
  const root = process.cwd();
  const [bold, regular] = await Promise.all([
    readFile(path.join(root, "assets", "fonts", "ZenKakuGothicNew-Bold.ttf")),
    readFile(path.join(root, "assets", "fonts", "ZenKakuGothicNew-Regular.ttf")),
  ]);
  return [
    { name: "ZenKaku", data: bold, weight: 700 as const },
    { name: "ZenKaku", data: regular, weight: 400 as const },
  ];
}

export async function renderPageOg(
  page: OgPageKey,
  overrides?: Partial<OgPageConfig>,
): Promise<Response> {
  // 差し替え規約: public/images/ogp/<ページキー>.png があればそれを配信する
  try {
    const override = await loadPublicFile(`images/ogp/${page}.png`);
    return new Response(new Uint8Array(override), {
      headers: { "Content-Type": "image/png" },
    });
  } catch {
    // 差し替え画像なし → テンプレートを生成
  }

  const cfg = { ...ogPages[page], ...overrides };
  const [fonts, photo, oqLogo, plLogo] = await Promise.all([
    loadFonts(),
    loadPublicFile(cfg.photo),
    loadPublicFile("images/brand/ocean-quest-logo.png"),
    loadPublicFile("images/brand/potentialight-logo-white.png"),
  ]);
  const photoSrc = toDataUri(photo, "image/jpeg");
  const oqLogoSrc = toDataUri(oqLogo, "image/png");
  const plLogoSrc = toDataUri(plLogo, "image/png");
  const personPhotoSrc =
    cfg.variant === "interview" && cfg.person
      ? toDataUri(await loadPublicFile(cfg.person.photo), "image/jpeg")
      : null;

  const middle = (() => {
    switch (cfg.variant) {
      case "video":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {cfg.kicker ? <Kicker text={cfg.kicker} /> : null}
              <TitleLines lines={cfg.title} fontSize={58} />
              {cfg.chips ? <Chips chips={cfg.chips} /> : null}
            </div>
            <VideoMotif />
          </div>
        );
      case "ebook":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {cfg.kicker ? <Kicker text={cfg.kicker} /> : null}
              <TitleLines lines={cfg.title} fontSize={54} />
              {cfg.chips ? <Chips chips={cfg.chips} /> : null}
            </div>
            <EbookMotif oqLogoSrc={oqLogoSrc} />
          </div>
        );
      case "article":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(255,255,255,0.96)",
              borderRadius: 28,
              padding: "40px 52px 34px",
              width: 860,
              gap: 18,
              boxShadow: "0 24px 60px rgba(0,20,30,0.4)",
            }}
          >
            {cfg.kicker ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    display: "flex",
                    width: 46,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: ORANGE,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    color: "#0e7c8c",
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: 6,
                  }}
                >
                  {cfg.kicker}
                </div>
              </div>
            ) : null}
            <TitleLines lines={cfg.title} fontSize={46} color={INK} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 8,
                  height: 30,
                  borderRadius: 4,
                  backgroundColor: ORANGE,
                }}
              />
              <div
                style={{
                  display: "flex",
                  color: "rgba(12,43,51,0.7)",
                  fontSize: 22,
                }}
              >
                Ocean Quest 編集部の note 記事
              </div>
            </div>
          </div>
        );
      case "event":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 22,
              border: "3px dashed rgba(255,255,255,0.65)",
              borderRadius: 28,
              padding: "38px 48px",
              backgroundColor: "rgba(0,40,50,0.55)",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "8px 26px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #ff9a4d, #ff6a1a)",
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 6,
              }}
            >
              {cfg.kicker ?? "EVENT"}
            </div>
            <TitleLines lines={cfg.title} fontSize={54} />
            {cfg.chips ? <Chips chips={cfg.chips} /> : null}
          </div>
        );
      case "interview":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {cfg.kicker ? <Kicker text={cfg.kicker} /> : null}
              <TitleLines lines={cfg.title} fontSize={52} />
              {cfg.person ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 8,
                      height: 52,
                      borderRadius: 4,
                      backgroundColor: ORANGE,
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        color: "#ffffff",
                        fontSize: 30,
                        fontWeight: 700,
                      }}
                    >
                      {cfg.person.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 22,
                      }}
                    >
                      {cfg.person.role}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            {personPhotoSrc ? (
              <div
                style={{
                  display: "flex",
                  width: 330,
                  height: 330,
                  borderRadius: 165,
                  overflow: "hidden",
                  border: "6px solid rgba(255,255,255,0.85)",
                  boxShadow: "0 24px 60px rgba(0,10,16,0.5)",
                }}
              >
                <img
                  src={personPhotoSrc}
                  alt=""
                  width={318}
                  height={318}
                  style={{ objectFit: "cover", borderRadius: 159 }}
                />
              </div>
            ) : null}
          </div>
        );
      case "news":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                backgroundColor: "rgba(0,22,30,0.85)",
                borderRadius: "20px 20px 0 0",
                padding: "18px 36px",
                borderBottom: `4px solid ${ORANGE}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#ffffff",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: 6,
                }}
              >
                {cfg.kicker ?? "NEWS"}
              </div>
              {cfg.chips?.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    padding: "6px 18px",
                    borderRadius: 999,
                    backgroundColor: ORANGE,
                    color: "#ffffff",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "rgba(255,255,255,0.96)",
                borderRadius: "0 0 20px 20px",
                padding: "36px 40px",
                boxShadow: "0 24px 60px rgba(0,20,30,0.4)",
              }}
            >
              <TitleLines lines={cfg.title} fontSize={48} color={INK} />
            </div>
          </div>
        );
      default:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {cfg.kicker ? <Kicker text={cfg.kicker} /> : null}
            {cfg.badge ? (
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  padding: "10px 28px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #15a5b8, #0e7c8c)",
                  color: "#ffffff",
                  fontSize: 27,
                  fontWeight: 700,
                  boxShadow: "0 10px 26px rgba(0,20,30,0.35)",
                }}
              >
                {cfg.badge}
              </div>
            ) : null}
            <TitleLines lines={cfg.title} />
            {cfg.chips ? <Chips chips={cfg.chips} /> : null}
          </div>
        );
    }
  })();

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
        <img
          src={photoSrc}
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              cfg.shade === "strong"
                ? "linear-gradient(100deg, rgba(0,43,52,0.96) 0%, rgba(0,52,63,0.88) 45%, rgba(0,52,63,0.6) 75%, rgba(0,52,63,0.4) 100%)"
                : "linear-gradient(100deg, rgba(0,43,52,0.94) 0%, rgba(0,52,63,0.82) 42%, rgba(0,52,63,0.28) 72%, rgba(0,52,63,0.05) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 72px 52px",
            width: "100%",
          }}
        >
          <img src={oqLogoSrc} alt="Ocean Quest" width={368} height={62} />
          {middle}
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
              <div
                style={{
                  display: "flex",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 20,
                }}
              >
                運営
              </div>
              <img src={plLogoSrc} alt="POTENTIALIGHT" width={284} height={30} />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
