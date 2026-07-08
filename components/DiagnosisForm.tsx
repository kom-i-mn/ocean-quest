"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Download, Mail, RotateCcw } from "lucide-react";
import { diagnosisResults, publishedQuestAreas } from "@/lib/content";
import {
  buildDiagnosisOutcome,
  flowStartId,
  flowTotalSteps,
  getFlowQuestion,
  nextFlowQuestionId,
  type DiagnosisOutcome,
  type FlowAnswer,
} from "@/lib/diagnosis-flow";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

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
        11の質問で、あなた専用の海洋キャリア診断。
      </h2>
      <ul className="diagnosis-gate-points">
        <li>回答に応じて次の質問が変わる、あなた専用の診断フローです</li>
        <li>9領域×4つの職種タイプから、あなたのタイプ・想定職種・想定年収帯まで診断</li>
        <li>結果はその場で全文表示。メールでも同じ内容をお届けします</li>
      </ul>
      <p className="diagnosis-gate-copy">
        お名前とメールアドレスをご登録のうえ、診断をはじめてください。診断結果のお届けと、海洋産業のキャリアに関する情報のご案内に利用します。
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
  outcome,
  email,
}: {
  outcome: DiagnosisOutcome;
  email: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleDownload() {
    if (status === "loading") return;
    setStatus("loading");
    setErrorMessage("");

    const scorePayload = Object.fromEntries(
      outcome.ranked.map((entry) => [entry.key, entry.percent]),
    );

    try {
      const response = await fetch("/api/diagnosis-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, scores: scorePayload, role: outcome.role }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ?? "作成に失敗しました。時間をおいて再度お試しください。",
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
        result: outcome.topArea,
      });
      setStatus("done");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "作成に失敗しました。時間をおいて再度お試しください。",
      );
      setStatus("error");
    }
  }

  return (
    <div className="diagnosis-report-panel">
      <p className="diagnosis-report-badge">保存版PDF</p>
      <strong className="diagnosis-report-heading">
        この結果を保存版レポート（PDF）で持ち歩く
      </strong>
      <p className="diagnosis-report-copy">
        タイプ判定・想定職種・年収帯に加えて、領域の全体像、市場動向、活かせる経験、転職前に知っておきたいこと、最初の一歩までを1冊にまとめたPDFです。結果メールにも同じPDFを添付していますが、今すぐ手元に保存したい方はこちらからどうぞ。
      </p>
      {status === "done" ? (
        <p className="diagnosis-report-success">
          ダウンロードを開始しました。始まらない場合は、もう一度ボタンを押してください。
        </p>
      ) : null}
      <button
        className="primary-button"
        type="button"
        onClick={handleDownload}
        disabled={status === "loading"}
      >
        {status === "loading" ? "レポートを作成中..." : "PDFをダウンロード"}
        <Download size={18} />
      </button>
      {status === "error" ? (
        <p className="diagnosis-report-error">{errorMessage}</p>
      ) : null}
    </div>
  );
}

function ResultPanel({
  outcome,
  lead,
  onRetry,
}: {
  outcome: DiagnosisOutcome;
  lead: DiagnosisLead;
  onRetry: () => void;
}) {
  const [emailStatus, setEmailStatus] = useState<"sending" | "sent" | "failed">("sending");
  const sentRef = useRef(false);

  useEffect(() => {
    window.gtag?.("event", "diagnosis_complete", {
      result: outcome.topArea,
      result_percent: outcome.ranked[0].percent,
      role: outcome.role,
      second: outcome.secondArea,
    });
  }, [outcome]);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const scorePayload = Object.fromEntries(
      outcome.ranked.map((entry) => [entry.key, entry.percent]),
    );

    fetch("/api/diagnosis-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        scores: scorePayload,
        topArea: outcome.topArea,
        secondArea: outcome.secondArea,
        role: outcome.role,
        profile: outcome.profile,
      }),
    })
      .then((response) => {
        setEmailStatus(response.ok ? "sent" : "failed");
      })
      .catch(() => {
        setEmailStatus("failed");
      });
  }, [outcome, lead]);

  const secondResult = diagnosisResults[outcome.secondArea];

  return (
    <div className="contact-panel diagnosis-panel" id="diagnosis-form">
      <p className="content-type">診断結果</p>
      <p className="diagnosis-result-lead">あなたの海洋キャリアタイプは</p>
      <h2 className="diagnosis-result-title">{outcome.typeName}</h2>
      <p className="diagnosis-result-sub">{outcome.typeSub}</p>
      <p className="diagnosis-result-summary">{outcome.summary}</p>

      <div className="diagnosis-stat-grid" aria-label="診断サマリー">
        <div>
          <span>想定職種</span>
          <strong>{outcome.recommendedRole.name}</strong>
        </div>
        <div>
          <span>想定年収帯（目安）</span>
          <strong>{outcome.recommendedRole.salary}</strong>
        </div>
        <div>
          <span>市場価値</span>
          <strong>{outcome.marketValue.rank}</strong>
        </div>
      </div>
      <p className="diagnosis-market-note">{outcome.marketValue.note}</p>

      <div className="diagnosis-scores" aria-label="領域ごとのマッチ度">
        <strong>あなたの回答から見た9領域のマッチ度</strong>
        {outcome.ranked.map((entry) => (
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
        {outcome.isClose ? (
          <p className="diagnosis-score-note">
            2位の「{secondResult.title}」とのスコア差はわずかです。両方の領域を視野に入れて情報収集するのがおすすめです。
          </p>
        ) : null}
      </div>

      <div className="diagnosis-reasons">
        <strong>あなたはこんなタイプ</strong>
        <p className="diagnosis-type-text">{outcome.excites}</p>
        <p className="diagnosis-type-text">
          <em>ウキウキする環境:</em> {outcome.environment}
        </p>
      </div>

      <div className="diagnosis-reasons">
        <strong>あなたの強み</strong>
        <ul>
          {outcome.strengths.map((strength) => (
            <li key={strength}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="diagnosis-reasons">
        <strong>おすすめの入口職種</strong>
        <p className="diagnosis-type-text">
          <b>{outcome.recommendedRole.name}</b> — {outcome.recommendedRole.description}
        </p>
        <p className="diagnosis-type-text">
          この領域のその他の職種: {diagnosisResults[outcome.topArea].roles.join(" / ")}
        </p>
      </div>

      {outcome.insights.length > 0 ? (
        <div className="diagnosis-insights">
          <strong>あなたの回答への解説</strong>
          {outcome.insights.map((item) => (
            <div className="diagnosis-insight-item" key={item.question}>
              <p className="diagnosis-insight-q">{item.question}</p>
              <p className="diagnosis-insight-a">あなたの回答: {item.answer}</p>
              <p className="diagnosis-insight-text">{item.insight}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="diagnosis-reasons">
        <strong>次に広げるべき領域</strong>
        <ul>
          {outcome.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      {publishedQuestAreas.has(outcome.topArea) ? (
        <a
          className="diagnosis-quest-link"
          href={diagnosisResults[outcome.topArea].questPath}
        >
          <span>
            <b>{diagnosisResults[outcome.topArea].questName}</b>
            {outcome.areaTitle}
            専門サイトで、職種マップと異業種からの入り方を詳しく見る
          </span>
          <ArrowRight size={18} />
        </a>
      ) : null}

      <p className="diagnosis-email-note">
        <Mail size={15} />
        {emailStatus === "sent"
          ? `診断結果を ${lead.email} 宛にお送りしました（詳細レポートPDF付き）。届かない場合は迷惑メールフォルダもご確認ください。`
          : emailStatus === "failed"
            ? "診断結果メールの送信に失敗しました。下のボタンからPDFをダウンロードして保存してください。"
            : `診断結果を ${lead.email} 宛に送信しています...`}
      </p>

      <ReportDownloadPanel outcome={outcome} email={lead.email} />

      <p className="diagnosis-disclaimer">
        この診断は、興味・志向の傾向から情報収集の入口となる領域・職種タイプを提案するものであり、適性や合否を判定するものではありません。想定年収帯は公開求人情報などをもとにした推定の目安です。実際のキャリア選択は、これまでのご経験や各領域の求人動向を踏まえて、無料キャリア相談で一緒に整理していきます。
      </p>

      {outcome.profile.age || outcome.profile.salaryNow || outcome.profile.salaryHope ? (
        <p className="diagnosis-profile-echo">
          ご回答情報:
          {outcome.profile.age ? ` 年齢 ${outcome.profile.age}` : ""}
          {outcome.profile.salaryNow ? ` ／ 現年収 ${outcome.profile.salaryNow}` : ""}
          {outcome.profile.salaryHope ? ` ／ 目標年収 ${outcome.profile.salaryHope}` : ""}
        </p>
      ) : null}

      <div className="hero-actions diagnosis-result-actions">
        <a
          className="primary-button"
          href={`/contact?topic=diagnosis&result=${outcome.topArea}`}
        >
          この結果をもとに無料キャリア相談する
          <ArrowRight size={18} />
        </a>
      </div>
      <div className="diagnosis-recommends">
        <strong>おすすめコンテンツ</strong>
        <a href="/videos">
          動画で{outcome.areaTitle}の仕事を知る
          <ArrowUpRight size={15} />
        </a>
        <a href="/notes">
          noteで海洋産業の解説を読む
          <ArrowUpRight size={15} />
        </a>
        <a href="/map">
          海の地図で産業の現場を探索する
          <ArrowUpRight size={15} />
        </a>
      </div>
      <button className="diagnosis-text-button" type="button" onClick={onRetry}>
        <RotateCcw size={15} />
        もう一度診断する
      </button>
    </div>
  );
}

export function DiagnosisForm() {
  const [lead, setLead] = useState<DiagnosisLead | null>(null);
  const [answers, setAnswers] = useState<FlowAnswer[]>([]);
  const [currentId, setCurrentId] = useState<string>(flowStartId);
  const [outcome, setOutcome] = useState<DiagnosisOutcome | null>(null);

  if (!lead) {
    return <LeadGatePanel onStart={setLead} />;
  }

  if (outcome) {
    return (
      <ResultPanel
        outcome={outcome}
        lead={lead}
        onRetry={() => {
          setAnswers([]);
          setCurrentId(flowStartId);
          setOutcome(null);
        }}
      />
    );
  }

  const current = getFlowQuestion(currentId);
  const step = answers.length;

  function handleSelect(optionIndex: number) {
    const option = current.options[optionIndex];
    const nextAnswers = [...answers, { questionId: current.id, optionIndex }];
    const nextId = nextFlowQuestionId(current, option);

    if (nextId) {
      setAnswers(nextAnswers);
      setCurrentId(nextId);
    } else {
      setOutcome(buildDiagnosisOutcome(nextAnswers));
    }
  }

  function handleBack() {
    if (answers.length === 0) return;
    const previous = answers[answers.length - 1];
    setAnswers(answers.slice(0, -1));
    setCurrentId(previous.questionId);
  }

  return (
    <div className="contact-panel diagnosis-panel" id="diagnosis-form">
      <p className="content-type">
        Q{step + 1} / {flowTotalSteps}
      </p>
      <div className="diagnosis-progress" aria-hidden="true">
        <span style={{ width: `${(step / flowTotalSteps) * 100}%` }} />
      </div>
      <h2 className="diagnosis-question">{current.question}</h2>
      {current.hint ? <p className="diagnosis-question-hint">{current.hint}</p> : null}
      <div className="diagnosis-options">
        {current.options.map((option, index) => (
          <button
            key={option.label}
            className="diagnosis-option"
            type="button"
            onClick={() => handleSelect(index)}
          >
            {option.label}
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
      {step > 0 ? (
        <button className="diagnosis-text-button" type="button" onClick={handleBack}>
          ひとつ前の質問に戻る
        </button>
      ) : null}
    </div>
  );
}
