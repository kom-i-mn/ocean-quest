"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import {
  diagnosisQuestions,
  diagnosisResults,
  type DiagnosisAreaKey,
} from "@/lib/content";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function computeResultKey(answers: DiagnosisAreaKey[]): DiagnosisAreaKey {
  const counts: Record<DiagnosisAreaKey, number> = {
    shipping: 0,
    energy: 0,
    tech: 0,
  };
  for (const area of answers) {
    counts[area] += 1;
  }
  let best: DiagnosisAreaKey = "shipping";
  for (const key of ["shipping", "energy", "tech"] as const) {
    if (counts[key] > counts[best]) {
      best = key;
    }
  }
  return best;
}

export function DiagnosisForm() {
  const [answers, setAnswers] = useState<DiagnosisAreaKey[]>([]);
  const total = diagnosisQuestions.length;
  const resultKey = answers.length === total ? computeResultKey(answers) : null;

  useEffect(() => {
    if (!resultKey) return;
    window.gtag?.("event", "diagnosis_complete", { result: resultKey });
  }, [resultKey]);

  if (resultKey) {
    const result = diagnosisResults[resultKey];
    return (
      <div className="contact-panel diagnosis-panel" id="diagnosis-form">
        <p className="content-type">診断結果</p>
        <p className="diagnosis-result-lead">あなたに合いそうな海洋産業の領域は</p>
        <h2 className="diagnosis-result-title">{result.title}</h2>
        <p className="diagnosis-result-summary">{result.summary}</p>
        <div className="diagnosis-reasons">
          <strong>向いていると考えられる理由</strong>
          <ul>
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
        <div className="hero-actions diagnosis-result-actions">
          <a
            className="primary-button"
            href={`/contact?topic=diagnosis&result=${resultKey}`}
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
            onClick={() => setAnswers((prev) => [...prev, option.area])}
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
