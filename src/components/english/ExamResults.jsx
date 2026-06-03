import React from 'react';

// Shared results screen for both Practice Exams and Real Exam Mode.
// `result` comes from engine/englishExam.js -> markAnswer().
export default function ExamResults({ result, mode, paper, onTryAgain, onSwitch, onHome }) {
  const pct = Math.round((result.score / result.max) * 100);
  const isReal = mode === 'real';

  return (
    <div className="english-wrap fade-in exam-results">
      <div className="card eng-hero exam-results-hero">
        <span className="eng-badge">{isReal ? '⏱ Real Exam Challenge' : '📝 Practice Exam'}</span>
        <h1 className="eng-title">Your feedback</h1>
        <p className="eng-hero-sub">{paper.title} · {paper.focus}</p>
      </div>

      <div className="card exam-score-card">
        <div className="score-ring" style={{ '--pct': pct }}>
          <div className="score-ring-inner">
            <span className="score-num">{result.score}</span>
            <span className="score-den">/ {result.max}</span>
          </div>
        </div>
        <div className="score-meta">
          <div className="exam-level">{result.level}</div>
          <p className="exam-headline">{result.headline}</p>
        </div>
      </div>

      <div className="card">
        <div className="eng-kicker">🌟 What went well</div>
        {result.wentWell.length ? (
          <ul className="exam-list good">
            {result.wentWell.map((w, i) => <li key={i}>✓ {w}</li>)}
          </ul>
        ) : (
          <p className="exam-note">You’ve made a start — keep going and you’ll tick these off in no time.</p>
        )}
      </div>

      {result.nextSteps.length > 0 && (
        <div className="card">
          <div className="eng-kicker">🎯 Next steps</div>
          <ul className="exam-list step">
            {result.nextSteps.map((s, i) => <li key={i}>→ {s}</li>)}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="eng-kicker">✅ Exam Power checklist</div>
        <ul className="exam-checklist">
          {result.criteria.map((c) => (
            <li key={c.key} className={c.got ? 'got' : ''}>
              <span className="ck-mark">{c.got ? '✓' : '○'}</span>
              <span className="ck-label">{c.label}</span>
              <span className="ck-pts">{c.pts}/{c.max}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card improved-card">
        <div className="eng-kicker">🪶 Try a sentence like this</div>
        <blockquote className="improved-sentence">{result.improvedSentence}</blockquote>
      </div>

      <p className="exam-disclaimer">
        This is Study Trainer practice feedback to help you improve — it isn’t official exam-board marking.
      </p>

      <div className="exam-result-actions">
        <button className="btn small-cta" onClick={onTryAgain}>🔁 Try again</button>
        {onSwitch && (
          <button className="btn small-cta ghost-cta" onClick={onSwitch}>
            {isReal ? '📝 Practise with help' : '⏱ Try a real exam'}
          </button>
        )}
        <button className="btn ghost small" onClick={onHome}>← Back to English Trainer</button>
      </div>
    </div>
  );
}
