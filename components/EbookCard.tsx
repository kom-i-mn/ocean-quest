"use client";

import { useState, type FormEvent } from "react";
import { BookOpen, Download } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EbookCardProps = {
  id: string;
  title: string;
  summary: string;
  category: string | null;
  coverUrl: string | null;
  sourceUrl: string;
};

export function EbookCard({ id, title, summary, category, coverUrl, sourceUrl }: EbookCardProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const website =
      (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

    try {
      const response = await fetch("/api/ebook-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email, website }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "ダウンロードに失敗しました。時間をおいて再度お試しください。");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ocean-quest-ebook.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      window.gtag?.("event", "ebook_download", { ebook_id: id, ebook_title: title });
      setStatus("done");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ダウンロードに失敗しました。時間をおいて再度お試しください。",
      );
      setStatus("error");
    }
  }

  return (
    <article className="ebook-card">
      <div className="ebook-cover">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={title} loading="lazy" />
        ) : (
          <span>
            <BookOpen size={34} />
          </span>
        )}
      </div>
      <div className="ebook-body">
        {category ? <p className="ebook-category">{category}</p> : null}
        <h3>{title}</h3>
        <p className="ebook-summary">{summary}</p>
        {status === "done" ? (
          <p className="ebook-success">
            ダウンロードを開始しました。始まらない場合はもう一度お試しください。
          </p>
        ) : null}
        <form className="ebook-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
          />
          <input
            className="diagnosis-report-input"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="メールアドレス"
            aria-label={`${title}をダウンロードするメールアドレス`}
          />
          <button className="primary-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "作成中..." : "無料DL"}
            <Download size={16} />
          </button>
        </form>
        {status === "error" ? <p className="ebook-error">{errorMessage}</p> : null}
        <a className="ebook-source" href={sourceUrl} target="_blank" rel="noreferrer">
          元記事をnoteで読む
        </a>
      </div>
    </article>
  );
}
