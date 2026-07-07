"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
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
