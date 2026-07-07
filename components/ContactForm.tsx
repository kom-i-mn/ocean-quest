"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";

type ContactFormProps = {
  topics: string[];
};

type Status = "idle" | "submitting" | "error";

type WindowWithGtag = Window & {
  gtag?: (...args: unknown[]) => void;
};

const diagnosisResultLabels: Record<string, string> = {
  shipping: "海運・造船・港湾",
  energy: "海洋資源・エネルギー",
  tech: "海洋テック・データ",
};

export function ContactForm({ topics }: ContactFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fromDiagnosis = searchParams.get("topic") === "diagnosis";
  const diagnosisResult = searchParams.get("result");
  const resultLabel = diagnosisResult
    ? (diagnosisResultLabels[diagnosisResult] ?? diagnosisResult)
    : null;

  const defaultTopic = fromDiagnosis && topics.includes("転職・キャリア相談") ? "転職・キャリア相談" : "";
  const defaultMessage =
    fromDiagnosis && resultLabel
      ? `キャリア診断の結果（${resultLabel}）をもとに、キャリアについて相談したいです。\n\n`
      : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          topic: formData.get("topic"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error || "送信に失敗しました。時間をおいて再度お試しください。");
        setStatus("error");
        return;
      }

      (window as WindowWithGtag).gtag?.("event", "contact_submit", {
        topic: String(formData.get("topic") ?? ""),
        from_diagnosis: fromDiagnosis,
      });
      router.push("/contact/thanks");
    } catch {
      setErrorMessage("送信に失敗しました。時間をおいて再度お試しください。");
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        お名前
        <input name="name" placeholder="山田 太郎" />
      </label>
      <label>
        会社名
        <input name="company" placeholder="株式会社〇〇（個人の方は空欄でOK）" />
      </label>
      <label>
        メールアドレス
        <input name="email" placeholder="name@example.com" type="email" required />
      </label>
      <label>
        相談したい内容
        <select name="topic" defaultValue={defaultTopic}>
          <option value="" disabled>
            選択してください
          </option>
          {topics.map((topic) => (
            <option value={topic} key={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>
      <label>
        詳細
        <textarea
          name="message"
          placeholder="採用したい職種、困っていること、相談したい背景などをご記入ください。"
          rows={7}
          defaultValue={defaultMessage}
          required
        />
      </label>
      <div style={{ display: "none" }} aria-hidden="true">
        <label>
          このフィールドは空欄のままにしてください
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === "error" ? <p className="contact-form-error">{errorMessage}</p> : null}
      <p style={{ fontSize: "0.85rem", opacity: 0.75, margin: 0 }}>
        送信いただいた情報は、<a href="/privacy">プライバシーポリシー</a>
        に基づきお問い合わせ対応のために利用します。
      </p>
      <button className="primary-button" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中..." : "相談を送信する"}
        <Send size={18} />
      </button>
    </form>
  );
}
