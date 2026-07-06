"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";

type ContactFormProps = {
  topics: string[];
};

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ topics }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error || "送信に失敗しました。時間をおいて再度お試しください。");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setErrorMessage("送信に失敗しました。時間をおいて再度お試しください。");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success">
        <p>ご相談ありがとうございます。内容を確認のうえ、担当よりご連絡いたします。</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        お名前
        <input name="name" placeholder="山田 太郎" />
      </label>
      <label>
        会社名
        <input name="company" placeholder="株式会社〇〇" />
      </label>
      <label>
        メールアドレス
        <input name="email" placeholder="name@example.com" type="email" required />
      </label>
      <label>
        相談したい内容
        <select name="topic" defaultValue="">
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
          required
        />
      </label>
      {status === "error" ? <p className="contact-form-error">{errorMessage}</p> : null}
      <button className="primary-button" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中..." : "相談を送信する"}
        <Send size={18} />
      </button>
    </form>
  );
}
