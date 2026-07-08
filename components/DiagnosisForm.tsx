"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Download, RotateCcw } from "lucide-react";
import {
  diagnosisQuestions,
  diagnosisResults,
  type DiagnosisAreaKey,
  type DiagnosisOption,
} from "@/lib/content";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const areaKeys = ["shipping", "energy", "tech"] as const;

type DiagnosisScores = {
  ranked: { key: DiagnosisAreaKey; percent: number }[];
};

type DiagnosisLead = {
  name: string;
  email: string;
};

function LeadGatePanel({ onStart }: { onStart: (lead: DiagnosisLead) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
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
      const response = await fetch("/api/diagnosis-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ?? "登録に失敗しました。時間をおいて再度お試しください。",
        );
      }

      window.gtag?.("event", "diagnosis_start");
      onStart({ name: name.trim(), email: email.trim() });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "登録に失敗しました。時間をおいて再度お試しください。",
      );
      setStatus("error");
    }
  }

  return (
    <div className="contact-panel diagnosis-panel" id="diagnosis-form">
      <p className="content-type">無料キャリア診断</p>
      <h2 className="diagnosis-gate-heading">
        10の質問で、あなたに合う海洋産業の入口がわかる。
      </h2>
      <ul className="diagnosis-gate-points">
        <li>全10問・所要時間は約3分。結果はその場で表示されます</li>
        <li>海運・造船・港湾 / 海洋資源・エネルギー / 海洋テック・データの3領域とのマッチ度を%で診断</li>
        <li>職種例・市場動向まで入った詳細版レポート(PDF)を無料でダウンロードできます</li>
      </ul>
      <p className="diagnosis-gate-copy">
        お名前とメールアドレスをご登録のうえ、診断をはじめてください。診断後、Ocean
        Questから海洋産業のキャリアに関する情報をお送りすることがあります。
      </p>
      <form className="diagnosis-gate-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
        />
        <label className="diagnosis-gate-field">
          <span>お名前</span>
          <input
            className="diagnosis-report-input"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="山田 太郎"
            autoComplete="name"
          />
        </label>
        <label className="diagnosis-gate-field">
          <span>メールアドレス</span>
          <input
            className="diagnosis-report-input"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@company.com"
            autoComplete="email"
          />
        </label>
        <button
          className="primary-button diagnosis-gate-submit"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "登録しています..." : "診断をはじめる"}
          <ArrowRight size={18} />
        </button>
      </form>
      {status === "error" ? (
        <p className="diagnosis-report-error">{errorMessage}</p>
      ) : null}
      <p className="diagnosis-report-consent">
        ご入力いただいた情報は、
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          プライバシーポリシー
        </a>
        に基づき適切に管理します。配信はいつでも停止できます。
      </p>
    </div>
  );
}

function ReportDownloadPanel({
  scores,
  initialEmail,
}: {
  scores: DiagnosisScores;
  initialEmail?: string;
}) {
  const [email, setEmail] = useState(initialEmail ?? "");
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
    const scorePayload = Object.fromEntries(
      scores.ranked.map((entry) => [entry.key, entry.percent]),
    );

    try {
      const response = await fetch("/api/diagnosis-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, scores: scorePayload }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ?? "送信に失敗しました。時間をおいて再度お試しください。",
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ocean-quest-career-report.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      window.gtag?.("event", "report_download", {
        result: scores.ranked[0].key,
      });
      setStatus("done");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "送信に失敗しました。時間をおいて再度お試しください。",
      );
      setStatus("error");
    }
  }

  return (
    <div className="diagnosis-report-panel">
      <p className="diagnosis-report-badge">FREE DOWNLOAD</p>
      <strong className="diagnosis-report-heading">
        詳細版レポート（PDF）を無料でダウンロード
      </strong>
      <p className="diagnosis-report-copy">
        この画面の結果は概要版です。詳細版レポートでは、あなたの診断スコアに加えて、領域の全体像、いま起きている市場動向、職種別の仕事内容、活かせる経験、転職前に知っておきたいこと、最初の一歩までを約2ページにまとめています。メールアドレスを入力すると、その場でダウンロードできます。
      </p>
      {status === "done" ? (
        <p className="diagnosis-report-success">
          ダウンロードを開始しました。始まらない場合は、もう一度ボタンを押してください。
        </p>
      ) : null}
      <form className="diagnosis-report-form" onSubmit={handleSubmit}>
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
          placeholder="メールアドレス（例: taro@example.com）"
          aria-label="メールアドレス"
        />
        <button className="primary-button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "レポートを作成中..." : "PDFをダウンロード"}
          <Download size={18} />
        </button>
      </form>
      {status === "error" ? (
        <p className="diagnosis-report-error">{errorMessage}</p>
      ) : null}
      <p className="diagnosis-report-consent">
        送信いただいたメールアドレスは、レポートのご提供とキャリアに関するご案内にのみ利用します。詳しくは
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          プライバシーポリシー
        </a>
        をご確認ください。
      </p>
    </div>
  );
}

function computeScores(answers: DiagnosisOption[]): DiagnosisScores {
  const totals: Record<DiagnosisAreaKey, number> = {
    shipping: 0,
    energy: 0,
    tech: 0,
  };
  for (const option of answers) {
    for (const key of areaKeys) {
      totals[key] += option.weights[key] ?? 0;
    }
  }
  const sum = totals.shipping + totals.energy + totals.tech;
  const ranked = areaKeys
    .map((key) => ({
      key,
      percent: sum > 0 ? Math.round((totals[key] / sum) * 100) : 0,
    }))
    .sort((a, b) => b.percent - a.percent);
  return { ranked };
}

export function DiagnosisForm() {
  const [lead, setLead] = useState<DiagnosisLead | null>(null);
  const [answers, setAnswers] = useState<DiagnosisOption[]>([]);
  const total = diagnosisQuestions.length;
  const scores = answers.length === total ? computeScores(answers) : null;

  useEffect(() => {
    if (!scores) return;
    window.gtag?.("event", "diagnosis_complete", {
      result: scores.ranked[0].key,
      result_percent: scores.ranked[0].percent,
      second: scores.ranked[1].key,
    });
  }, [scores]);

  if (!lead) {
    return <LeadGatePanel onStart={setLead} />;
  }

  if (scores) {
    const top = scores.ranked[0];
    const second = scores.ranked[1];
    const result = diagnosisResults[top.key];
    const secondResult = diagnosisResults[second.key];
    const isClose = top.percent - second.percent <= 10;

    return (
      <div className="contact-panel diagnosis-panel" id="diagnosis-form">
        <p className="content-type">診断結果</p>
        <p className="diagnosis-result-lead">あなたの興味・志向に近い海洋産業の入口は</p>
        <h2 className="diagnosis-result-title">{result.title}</h2>
        <p className="diagnosis-result-summary">{result.summary}</p>

        <div className="diagnosis-scores" aria-label="領域ごとのマッチ度">
          <strong>あなたの回答から見た3領域のマッチ度</strong>
          {scores.ranked.map((entry) => (
            <div className="diagnosis-score-row" key={entry.key}>
              <span className="diagnosis-score-label">
                {diagnosisResults[entry.key].title}
              </span>
              <span className="diagnosis-score-bar">
                <span style={{ width: `${entry.percent}%` }} />
              </span>
              <span className="diagnosis-score-percent">{entry.percent}%</span>
            </div>
          ))}
          {isClose ? (
            <p className="diagnosis-score-note">
              2位の「{secondResult.title}」とのスコア差はわずかです。両方の領域を視野に入れて情報収集するのがおすすめです。
            </p>
          ) : null}
        </div>

        <div className="diagnosis-reasons">
          <strong>この領域を提案する理由</strong>
          <ul>
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>

        <div className="diagnosis-reasons">
          <strong>この領域の職種の例</strong>
          <ul>
            {result.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>

        <ReportDownloadPanel scores={scores} initialEmail={lead.email} />

        <p className="diagnosis-disclaimer">
          この診断は、興味・志向の傾向から情報収集の入口となる領域を提案するものであり、適性や合否を判定するものではありません。実際のキャリア選択は、これまでのご経験や各領域の求人動向を踏まえて、無料キャリア相談で一緒に整理していきます。
        </p>

        <div className="hero-actions diagnosis-result-actions">
          <a
            className="primary-button"
            href={`/contact?topic=diagnosis&result=${top.key}`}
          >
            この結果をもとに無料キャリア相談する
            <ArrowRight size={18} />
          </a>
        </div>
        <div className="diagnosis-recommends">
          <strong>おすすめコンテンツ</strong>
          <a href="/videos">
            動画で{result.title}の仕事を知る
            <ArrowUpRight size={15} />
          </a>
          <a href="/notes">
            noteで海洋産業の解説を読む
            <ArrowUpRight size={15} />
          </a>
        </div>
        <button
          className="diagnosis-text-button"
          type="button"
          onClick={() => setAnswers([])}
        >
          <RotateCcw size={15} />
          もう一度診断する
        </button>
      </div>
    );
  }

  const step = answers.length;
  const current = diagnosisQuestions[step];

  return (
    <div className="contact-panel diagnosis-panel" id="diagnosis-form">
      <p className="content-type">
        Q{step + 1} / {total}
      </p>
      <div className="diagnosis-progress" aria-hidden="true">
        <span style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <h2 className="diagnosis-question">{current.question}</h2>
      <div className="diagnosis-options">
        {current.options.map((option) => (
          <button
            key={option.label}
            className="diagnosis-option"
            type="button"
            onClick={() => setAnswers((prev) => [...prev, option])}
          >
            {option.label}
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
      {step > 0 ? (
        <button
          className="diagnosis-text-button"
          type="button"
          onClick={() => setAnswers((prev) => prev.slice(0, -1))}
        >
          ひとつ前の質問に戻る
        </button>
      ) : null}
    </div>
  );
}
