import type { ReactNode } from "react";

/**
 * microCMSのプレーンテキストを、既存デザインのマークアップに変換する。
 *
 * 記法（管理画面から使えるのはこの2つだけ）:
 *   - 改行           → 行が分かれる
 *   - 【…】          → 強調（<em>）。先頭が数字なら数字部分だけ大きくする（.rd-num）
 *
 * 例: "日本の海は、世界【6位】。" → 日本の海は、世界<em><span class="rd-num">6</span>位</em>。
 */
function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /【([^】]*)】/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const inner = m[1];
    const num = inner.match(/^(\d+)(.*)$/);
    nodes.push(
      <em key={`${keyBase}-em-${i++}`}>
        {num ? (
          <>
            <span className="rd-num">{num[1]}</span>
            {num[2]}
          </>
        ) : (
          inner
        )}
      </em>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** 改行を <br> にして返す（インライン記法も適用） */
export function CmsLines({ text, keyBase = "l" }: { text: string; keyBase?: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={`${keyBase}-${i}`}>
          {renderInline(line, `${keyBase}-${i}`)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

/**
 * ヒーローのh1専用。2行以上のときは1行目を「前フリ行」(.rd-h1-pre)にする。
 * 既存デザイン（前フリ小 → 主役行 大）をそのまま維持するため。
 */
export function CmsHeroHeading({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.length > 0);
  if (lines.length === 0) return null;
  if (lines.length === 1) return <>{renderInline(lines[0], "h1-0")}</>;

  const [pre, ...rest] = lines;
  return (
    <>
      <span className="rd-h1-pre">{renderInline(pre, "h1-pre")}</span>
      {rest.map((line, i) => (
        <span key={`h1-main-${i}`}>
          {renderInline(line, `h1-main-${i}`)}
          {i < rest.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
